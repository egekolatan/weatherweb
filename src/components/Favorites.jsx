import { useLang } from '../i18n/LanguageContext'
import { flagEmoji } from '../utils/format'

const QUICK = [
  { id: 745044, name: 'İstanbul', latitude: 41.0138, longitude: 28.9497, country: 'Türkiye', country_code: 'TR', admin1: 'İstanbul', population: 14804116, elevation: 40 },
  { id: 323786, name: 'Ankara', latitude: 39.9199, longitude: 32.8543, country: 'Türkiye', country_code: 'TR', admin1: 'Ankara', population: 3517182, elevation: 890 },
  { id: 311046, name: 'İzmir', latitude: 38.4127, longitude: 27.1384, country: 'Türkiye', country_code: 'TR', admin1: 'İzmir', population: 2505570, elevation: 25 },
  { id: 323777, name: 'Antalya', latitude: 36.9081, longitude: 30.6956, country: 'Türkiye', country_code: 'TR', admin1: 'Antalya', population: 758188, elevation: 39 },
]

export default function Favorites({ favorites, currentId, onSelect, onRemove }) {
  const { t } = useLang()
  const chips = favorites.length ? favorites : QUICK

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
