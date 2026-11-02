import { useLang } from '../i18n/LanguageContext'
import { formatClock, formatTemp, flagEmoji } from '../utils/format'
import { aqiInfo, buildSummary, describeWeather } from '../utils/weather'

export default function WeatherHero({ city, weather, air, unit, isFavorite, onToggleFavorite }) {
  const { t, locale } = useLang()
  const current = weather.current
  const info = describeWeather(current.weather_code, current.is_day, t)
  const high = weather.daily.temperature_2m_max[0]
  const low = weather.daily.temperature_2m_min[0]
  const aqi = air?.current?.european_aqi
  const airInfo = aqi == null ? null : aqiInfo(aqi, t)

  return (
    <section className="hk-card hero-card">
      <div className="d-flex justify-content-between align-items-start gap-3">
        <div>
          <p className="eyebrow mb-2">
            {flagEmoji(city.country_code)} {[city.admin1, city.country].filter(Boolean).join(' · ')}
          </p>
          <h1 className="city-name">{city.name}</h1>
        </div>
        <button
          type="button"
          className={`btn btn-fav ${isFavorite ? 'on' : ''}`}
          onClick={onToggleFavorite}
          aria-label={isFavorite ? t('removeFav') : t('addFavorite')}
        >
          <i className={`bi ${isFavorite ? 'bi-star-fill' : 'bi-star'}`} />
        </button>
      </div>

      <div className="hero-temp-row">
        <div className="hero-temp">
          <span>{formatTemp(current.temperature_2m, unit)}</span>
          <i className={`bi ${info.icon} weather-glyph`} />
        </div>
        <div className="hero-meta">
          <p className="condition">{info.label}</p>
          <p className="range mb-0">
            {t('highLow', {
              feels: formatTemp(current.apparent_temperature, unit),
              high: formatTemp(high, unit),
              low: formatTemp(low, unit),
            })}
          </p>
          <p className="sun-line mb-0">
            <i className="bi bi-sunrise" /> {formatClock(weather.daily.sunrise[0], locale)}
            <span className="mx-2">·</span>
            <i className="bi bi-sunset" /> {formatClock(weather.daily.sunset[0], locale)}
          </p>
          <p className="hero-aqi-line mb-0">
            <i className="bi bi-lungs" /> {t('air')}
            {airInfo ? (
              <>
                <strong>{Math.round(aqi)}</strong>
                <span className={`aqi-label tone-${airInfo.tone}`}>{airInfo.label}</span>
              </>
            ) : (
              <span className="muted">{t('aqi.none')}</span>
            )}
          </p>
        </div>
      </div>

      <p className="summary mb-0">{buildSummary(city.name, weather, unit, t)}</p>
    </section>
  )
}
