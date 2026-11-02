import { useCallback, useEffect, useState } from 'react'
import { fetchAirQuality, fetchForecast, searchCities } from '../api/openMeteo'
import {
  loadCompareCity,
  pickCompareCity,
  saveCompareCity,
} from '../utils/format'
import { useLang } from '../i18n/LanguageContext'

export function useCityCompare(primaryCity) {
  const { apiLang } = useLang()
  const [other, setOther] = useState(() => loadCompareCity() ?? pickCompareCity(primaryCity))
  const [weather, setWeather] = useState(null)
  const [air, setAir] = useState(null)
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [searching, setSearching] = useState(false)

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

  useEffect(() => {
    if (query.trim().length < 2) {
      setSuggestions([])
      setSearching(false)
      return undefined
    }

    const controller = new AbortController()
    const timer = setTimeout(async () => {
      setSearching(true)
      try {
        const results = await searchCities(query, controller.signal, apiLang)
        if (!controller.signal.aborted) setSuggestions(results)
      } catch (err) {
        if (err.name !== 'AbortError') setSuggestions([])
      } finally {
        if (!controller.signal.aborted) setSearching(false)
      }
    }, 280)

    return () => {
      clearTimeout(timer)
      controller.abort()
    }
  }, [query, apiLang])

  const selectOther = useCallback((city) => {
    setOther(city)
    saveCompareCity(city)
    setQuery('')
    setSuggestions([])
  }, [])

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
