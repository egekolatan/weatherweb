import { useEffect, useRef, useState } from 'react'
import { useLang } from '../i18n/LanguageContext'
import { flagEmoji } from '../utils/format'

export default function SearchBar({
  query,
  setQuery,
  suggestions,
  searching,
  onSelect,
  locating,
  onLocate,
  showLocate = true,
  placeholder,
  compact = false,
}) {
  const { t } = useLang()
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const boxRef = useRef(null)

  useEffect(() => {
    setOpen(suggestions.length > 0)
    setActive(0)
  }, [suggestions])

  useEffect(() => {
    function handleClick(event) {
      if (boxRef.current && !boxRef.current.contains(event.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function handleKeyDown(event) {
    if (!open || suggestions.length === 0) return
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setActive((index) => (index + 1) % suggestions.length)
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActive((index) => (index - 1 + suggestions.length) % suggestions.length)
    }
    if (event.key === 'Enter') {
      event.preventDefault()
      onSelect(suggestions[active])
      setOpen(false)
    }
    if (event.key === 'Escape') setOpen(false)
  }

  return (
    <div className={`search-wrap ${compact ? 'compact' : ''}`} ref={boxRef}>
      <div className="search-field">
        <i className="bi bi-search" />
        <input
          className="form-control"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onFocus={() => suggestions.length && setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder || t('searchPlaceholder')}
          aria-label={placeholder || t('searchPlaceholder')}
          autoComplete="off"
        />
        {searching && <span className="spinner-border spinner-border-sm search-spin" />}
      </div>

      {showLocate && (
        <button
          type="button"
          className="btn btn-locate"
          onClick={onLocate}
          disabled={locating}
          title={t('locateTitle')}
        >
          {locating ? (
            <span className="spinner-border spinner-border-sm" />
          ) : (
            <i className="bi bi-geo-alt-fill" />
          )}
          <span className="d-none d-lg-inline">{t('locate')}</span>
        </button>
      )}

      {open && (
        <ul className="search-menu list-unstyled mb-0">
          {suggestions.map((item, index) => (
            <li key={`${item.id}-${item.latitude}`}>
              <button
                type="button"
                className={index === active ? 'active' : ''}
                onMouseEnter={() => setActive(index)}
                onClick={() => {
                  onSelect(item)
                  setOpen(false)
                }}
              >
                <span className="suggest-flag">{flagEmoji(item.country_code)}</span>
                <span>
                  <strong>{item.name}</strong>
                  <small>
                    {[item.admin1, item.country].filter(Boolean).join(' · ')}
                  </small>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
