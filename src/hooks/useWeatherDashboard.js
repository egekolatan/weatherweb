import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  fetchAirQuality,
  fetchCityProfile,
  fetchForecast,
  reverseCity,
} from '../api/openMeteo'
import { useCitySearch } from './useCitySearch'
import {
  DEFAULT_CITY,
  loadFavorites,
  loadLastCity,
  loadUnit,
  saveFavorites,
  saveLastCity,
  saveUnit,
} from '../utils/format'
import { useLang } from '../i18n/LanguageContext'
import { themeFromWeather } from '../utils/weather'

export function useWeatherDashboard() {
  const { t, lang } = useLang()
  const { query, setQuery, suggestions, setSuggestions, searching } = useCitySearch(lang)
  const [city, setCity] = useState(loadLastCity() ?? DEFAULT_CITY)
  const [weather, setWeather] = useState(null)
  const [air, setAir] = useState(null)
  const [profile, setProfile] = useState(null)
  const [favorites, setFavorites] = useState(loadFavorites)
  const [unit, setUnitState] = useState(loadUnit)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [locating, setLocating] = useState(false)

  useEffect(() => {
    const controller = new AbortController()

    async function load() {
      setLoading(true)
      setError('')
      try {
        const [forecast, airQuality] = await Promise.all([
          fetchForecast(city.latitude, city.longitude, controller.signal),
          fetchAirQuality(city.latitude, city.longitude, controller.signal),
        ])
        if (controller.signal.aborted) return
        setWeather(forecast)
        setAir(airQuality)
        saveLastCity(city)
      } catch (err) {
        if (err.name === 'AbortError') return
        setError(t(err.message === 'weather' ? 'errorWeather' : 'errorGeneric'))
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }

    load()
    return () => controller.abort()
  }, [city, t])

  useEffect(() => {
    const controller = new AbortController()
    fetchCityProfile(city.name, controller.signal, lang).then((wiki) => {
      if (!controller.signal.aborted) setProfile(wiki)
    })
    return () => controller.abort()
  }, [city, lang])

  const selectCity = useCallback((nextCity) => {
    setLoading(true)
    setCity(nextCity)
    setQuery('')
    setSuggestions([])
  }, [setQuery, setSuggestions])

  const toggleUnit = useCallback(() => {
    setUnitState((current) => {
      const next = current === 'c' ? 'f' : 'c'
      saveUnit(next)
      return next
    })
  }, [])

  const isFavorite = useMemo(
    () => favorites.some((item) => item.id === city.id),
    [favorites, city.id],
  )

  const toggleFavorite = useCallback(() => {
    setFavorites((current) => {
      const exists = current.some((item) => item.id === city.id)
      const next = exists
        ? current.filter((item) => item.id !== city.id)
        : [city, ...current].slice(0, 8)
      saveFavorites(next)
      return next
    })
  }, [city])

  const removeFavorite = useCallback((id) => {
    setFavorites((current) => {
      const next = current.filter((item) => item.id !== id)
      saveFavorites(next)
      return next
    })
  }, [])

  const useMyLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError(t('errorGeo'))
      return
    }

    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const found = await reverseCity(coords.latitude, coords.longitude, undefined, lang)
          selectCity({
            ...found,
            name: found.name || t('currentLocation'),
          })
        } catch {
          selectCity({
            id: `geo-${coords.latitude.toFixed(3)}-${coords.longitude.toFixed(3)}`,
            name: t('currentLocation'),
            latitude: coords.latitude,
            longitude: coords.longitude,
          })
        } finally {
          setLocating(false)
        }
      },
      () => {
        setLocating(false)
        setError(t('errorLocate'))
      },
      { timeout: 8000 },
    )
  }, [selectCity, t, lang])

  const theme = weather
    ? themeFromWeather(weather.current.weather_code, weather.current.is_day)
    : 'theme-clear'

  return {
    city,
    weather,
    air,
    profile,
    favorites,
    unit,
    loading,
    error,
    query,
    setQuery,
    suggestions,
    searching,
    locating,
    selectCity,
    toggleUnit,
    isFavorite,
    toggleFavorite,
    removeFavorite,
    useMyLocation,
    theme,
  }
}
