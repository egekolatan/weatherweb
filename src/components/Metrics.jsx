import { useLang } from '../i18n/LanguageContext'
import { formatNumber, formatTemp } from '../utils/format'
import { currentVisibility, uvLabel, windDirection } from '../utils/weather'

export default function Metrics({ weather, unit }) {
  const { t, locale } = useLang()
  const current = weather.current
  const visibility = currentVisibility(weather)
  const uv = weather.daily.uv_index_max[0]

  const items = [
    { icon: 'bi-moisture', label: t('humidity'), value: `%${Math.round(current.relative_humidity_2m)}` },
    { icon: 'bi-wind', label: t('wind'), value: `${Math.round(current.wind_speed_10m)} km/s ${windDirection(current.wind_direction_10m, t)}` },
    { icon: 'bi-speedometer2', label: t('pressure'), value: `${Math.round(current.pressure_msl)} hPa` },
    { icon: 'bi-clouds', label: t('clouds'), value: `%${Math.round(current.cloud_cover)}` },
    { icon: 'bi-sun', label: t('uvIndex'), value: `${formatNumber(uv, 0, locale)} · ${uvLabel(uv, t)}` },
    { icon: 'bi-eye', label: t('visibility'), value: visibility == null ? '—' : `${Math.round(visibility / 1000)} km` },
    { icon: 'bi-droplet-half', label: t('precipitation'), value: `${formatNumber(current.precipitation, 1, locale)} mm` },
    { icon: 'bi-tropical-storm', label: t('gusts'), value: `${Math.round(current.wind_gusts_10m)} km/s` },
  ]

  return (
    <section className="hk-card">
      <div className="section-head">
        <h2>{t('details')}</h2>
        <span>{t('feelsLike', { temp: formatTemp(current.apparent_temperature, unit) })}</span>
      </div>
      <div className="row g-3">
        {items.map((item) => (
          <div className="col-6 col-md-3" key={item.label}>
            <article className="metric">
              <i className={`bi ${item.icon}`} />
              <p className="metric-label">{item.label}</p>
              <p className="metric-value mb-0">{item.value}</p>
            </article>
          </div>
        ))}
      </div>
    </section>
  )
}
