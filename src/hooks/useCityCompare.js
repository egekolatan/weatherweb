import { useCallback, useEffect, useState } from 'react'
import { fetchAirQuality, fetchForecast } from '../api/openMeteo'
import { useCitySearch } from './useCitySearch'
import {
  loadCompareCity,
  pickCompareCity,
  saveCompareCity,
} from '../utils/format'
import { useLang } from '../i18n/LanguageContext'

export function useCityCompare(primaryCity) {
  const { lang } = useLang()
  const { query, setQuery, suggestions, setSuggestions, searching } = useCitySearch(lang)
  const [other, setOther] = useState(() => loadCompareCity() ?? pickCompareCity(primaryCity))
  const [weather, setWeather] = useState(null)
  const [air, setAir] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (other?.id === primaryCity?.id) {
      const next = pickCompareCity(primaryCity)
      setOther(next)
      saveCompareCity(next)
    }
  }, [primaryCity, other?.id])

  useEffect(() => {
    if (!other) return undefined
    const controller = new AbortController()

    async function load() {
      setLoading(true)
      try {
        const [forecast, airQuality] = await Promise.all([
          fetchForecast(other.latitude, other.longitude, controller.signal),
          fetchAirQuality(other.latitude, other.longitude, controller.signal),
        ])
        if (controller.signal.aborted) return
        setWeather(forecast)
        setAir(airQuality)
      } catch (err) {
        if (err.name !== 'AbortError') {
          setWeather(null)
          setAir(null)
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }

    load()
    return () => controller.abort()
  }, [other])

  const selectOther = useCallback((city) => {
    setOther(city)
    saveCompareCity(city)
    setQuery('')
    setSuggestions([])
  }, [setQuery, setSuggestions])

  return {
    other,
    weather,
    air,
    loading,
    query,
    setQuery,
    suggestions,
    searching,
    selectOther,
  }
}
