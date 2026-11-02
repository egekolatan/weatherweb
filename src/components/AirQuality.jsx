import { useLang } from '../i18n/LanguageContext'
import { formatNumber } from '../utils/format'
import { aqiInfo } from '../utils/weather'

export default function AirQuality({ air }) {
  const { t, locale } = useLang()

  if (!air?.current) {
    return (
      <section className="hk-card">
        <div className="section-head">
          <h2>{t('air')}</h2>
        </div>
        <p className="mb-0 muted">{t('airEmpty')}</p>
      </section>
    )
  }

  const aqi = air.current.european_aqi
  if (aqi == null) {
    return (
      <section className="hk-card">
        <div className="section-head">
          <h2>{t('air')}</h2>
        </div>
        <p className="mb-0 muted">{t('airEmpty')}</p>
      </section>
    )
  }
  const info = aqiInfo(aqi, t)
  const pollutants = [
    { label: 'PM2.5', value: air.current.pm2_5, unit: 'µg/m³' },
    { label: 'PM10', value: air.current.pm10, unit: 'µg/m³' },
    { label: 'NO₂', value: air.current.nitrogen_dioxide, unit: 'µg/m³' },
    { label: 'O₃', value: air.current.ozone, unit: 'µg/m³' },
  ]

  return (
    <section className="hk-card">
      <div className="section-head">
        <h2>{t('air')}</h2>
        <span>{t('airHint')}</span>
      </div>
      <div className="aqi-hero">
        <div>
          <p className="aqi-value mb-1">{Math.round(aqi)}</p>
          <p className={`aqi-label tone-${info.tone} mb-0`}>{info.label}</p>
        </div>
        <div className="aqi-track">
          <span style={{ width: `${Math.min(100, aqi)}%` }} />
        </div>
      </div>
      <div className="row g-2 mt-1">
        {pollutants.map((item) => (
          <div className="col-6 col-md-3" key={item.label}>
            <article className="pollutant">
              <span>{item.label}</span>
              <strong>
                {formatNumber(item.value, 0, locale)} {item.unit}
              </strong>
            </article>
          </div>
        ))}
      </div>
    </section>
  )
}
