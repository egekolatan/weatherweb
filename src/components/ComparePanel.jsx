import { useLang } from '../i18n/LanguageContext'
import { ANKARA_CITY, DEFAULT_CITY, flagEmoji, formatTemp } from '../utils/format'
import { aqiInfo, describeWeather } from '../utils/weather'
import SearchBar from './SearchBar'

const QUICK = [DEFAULT_CITY, ANKARA_CITY]

export default function ComparePanel({
  leftCity,
  leftWeather,
  leftAir,
  unit,
  compare,
}) {
  const { t } = useLang()
  const rightReady = !compare.loading && compare.weather

  const leftRows = rowsFor(leftWeather, leftAir, unit, t)
  const rightRows = rightReady ? rowsFor(compare.weather, compare.air, unit, t) : []

  return (
    <section className="hk-card">
      <div className="section-head">
        <h2>{t('compareTitle')}</h2>
        <span>{t('compareHint')}</span>
      </div>

      <div className="compare-heads">
        <div>
          <p className="eyebrow mb-1">{t('selectedCity')}</p>
          <h3>
            {flagEmoji(leftCity.country_code)} {leftCity.name}
          </h3>
        </div>
        <span className="compare-vs">{t('versus')}</span>
        <div>
          <p className="eyebrow mb-1">{t('compareWith')}</p>
          <h3>
            {flagEmoji(compare.other.country_code)} {compare.other.name}
          </h3>
          <SearchBar
            query={compare.query}
            setQuery={compare.setQuery}
            suggestions={compare.suggestions}
            searching={compare.searching}
            onSelect={compare.selectOther}
            showLocate={false}
            placeholder={t('compareSearch')}
            compact
          />
          <div className="compare-quick">
            {QUICK.filter((city) => city.id !== leftCity.id && city.id !== compare.other.id).map((city) => (
              <button key={city.id} type="button" className="fav-chip" onClick={() => compare.selectOther(city)}>
                {flagEmoji(city.country_code)} {city.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="compare-table">
        {leftRows.map((row, index) => {
          const other = rightRows[index]
          const winner = other ? whoWins(row, other) : ''
          return (
            <div className="compare-row" key={row.label}>
              <span className="compare-label">{row.label}</span>
              <strong className={winner === 'left' ? 'is-better' : ''}>{row.display}</strong>
              <strong className={winner === 'right' ? 'is-better' : ''}>
                {compare.loading ? '…' : other?.display ?? '—'}
              </strong>
            </div>
          )
        })}
      </div>
    </section>
  )
}

function rowsFor(weather, air, unit, t) {
  if (!weather) return []
  const info = describeWeather(weather.current.weather_code, weather.current.is_day, t)
  const aqi = air?.current?.european_aqi
  const aqiMeta = aqiInfo(aqi, t)
  return [
    { label: t('temperature'), display: formatTemp(weather.current.temperature_2m, unit), value: weather.current.temperature_2m, prefer: 'none' },
    { label: t('condition'), display: info.label, value: null, prefer: 'none' },
    { label: t('rainChance'), display: `%${weather.daily.precipitation_probability_max[0] ?? 0}`, value: weather.daily.precipitation_probability_max[0], prefer: 'low' },
    { label: t('humidity'), display: `%${Math.round(weather.current.relative_humidity_2m)}`, value: weather.current.relative_humidity_2m, prefer: 'low' },
    { label: t('wind'), display: `${Math.round(weather.current.wind_speed_10m)} km/s`, value: weather.current.wind_speed_10m, prefer: 'none' },
    { label: 'UV', display: `${Math.round(weather.daily.uv_index_max[0] ?? 0)}`, value: weather.daily.uv_index_max[0], prefer: 'low' },
    { label: t('air'), display: aqi == null ? '—' : `${Math.round(aqi)} · ${aqiMeta.label}`, value: aqi, prefer: 'low' },
  ]
}

function whoWins(left, right) {
  if (left.prefer !== 'low' || left.value == null || right.value == null || left.value === right.value) {
    return ''
  }
  return left.value < right.value ? 'left' : 'right'
}
