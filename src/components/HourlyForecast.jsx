import { useLang } from '../i18n/LanguageContext'
import { formatClock, formatTemp } from '../utils/format'
import { describeWeather, nextHours } from '../utils/weather'

export default function HourlyForecast({ weather, unit }) {
  const { t, locale } = useLang()
  const hours = nextHours(weather, 24)

  return (
    <section className="hk-card">
      <div className="section-head">
        <h2>{t('hourly')}</h2>
        <span>{t('next24')}</span>
      </div>
      <div className="hourly-scroller">
        {hours.map((hour, index) => {
          const info = describeWeather(hour.code, weather.current.is_day, t)
          return (
            <article className="hour-chip" key={hour.time}>
              <span className="hour-time">{index === 0 ? t('now') : formatClock(hour.time, locale)}</span>
              <i className={`bi ${info.icon}`} />
              <strong>{formatTemp(hour.temperature, unit)}</strong>
              <span className="hour-rain">
                <i className="bi bi-droplet" /> %{hour.rain ?? 0}
              </span>
            </article>
          )
        })}
      </div>
    </section>
  )
}
