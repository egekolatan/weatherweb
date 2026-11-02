import { useEffect, useState } from 'react'
import { searchCities } from '../api/openMeteo'

export function useCitySearch(language) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [pending, setPending] = useState(false)
  const ready = query.trim().length >= 2

  useEffect(() => {
    if (!ready) return undefined

    const controller = new AbortController()
    const timer = setTimeout(async () => {
      setPending(true)
      try {
        const next = await searchCities(query, controller.signal, language)
        if (!controller.signal.aborted) setResults(next)
      } catch (err) {
        if (err.name !== 'AbortError') setResults([])
      } finally {
        if (!controller.signal.aborted) setPending(false)
      }
    }, 280)

    return () => {
      clearTimeout(timer)
      controller.abort()
    }
  }, [query, language, ready])

  return {
    query,
    setQuery,
    suggestions: ready ? results : [],
    setSuggestions: setResults,
    searching: ready && pending,
  }
}
