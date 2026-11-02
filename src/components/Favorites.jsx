import { useLang } from '../i18n/LanguageContext'
import { flagEmoji, QUICK_CITIES } from '../utils/format'

export default function Favorites({ favorites, currentId, onSelect, onRemove }) {
  const { t } = useLang()
  const chips = favorites.length ? favorites : QUICK_CITIES

  return (
    <div className="favorites">
      <span className="fav-label">{favorites.length ? t('favorites') : t('quickPick')}</span>
      <div className="fav-row">
        {chips.map((city) => (
          <div
            key={city.id}
            className={`fav-chip ${city.id === currentId ? 'active' : ''}`}
          >
            <button type="button" onClick={() => onSelect(city)}>
              {flagEmoji(city.country_code)} {city.name}
            </button>
            {favorites.length > 0 && (
              <button
                type="button"
                className="fav-x"
                onClick={() => onRemove(city.id)}
                aria-label={t('removeFavorite', { name: city.name })}
              >
                ×
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
