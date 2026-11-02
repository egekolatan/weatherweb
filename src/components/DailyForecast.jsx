import { useLang } from '../i18n/LanguageContext'
import { formatTemp, formatWeekday } from '../utils/format'
import { describeWeather } from '../utils/weather'

export default function DailyForecast({ weather, unit }) {
  const { t, locale } = useLang()
  const days = weather.daily.time

  return (
    <section className="hk-card">
      <div className="section-head">
        <h2>{t('daily')}</h2>
        <span>{t('dailyHint')}</span>
      </div>
      <ul className="daily-list list-unstyled mb-0">
        {days.map((date, index) => {
          const info = describeWeather(weather.daily.weather_code[index], true, t)
          const rain = weather.daily.precipitation_probability_max[index]
          const min = weather.daily.temperature_2m_min[index]
          const max = weather.daily.temperature_2m_max[index]
          const span = Math.max(max - min, 1)
          const width = Math.min(100, 28 + span * 4)

          return (
            <li className="daily-row" key={date}>
              <span className="daily-day">{formatWeekday(date, index, locale, t)}</span>
              <span className="daily-icon">
                <i className={`bi ${info.icon}`} />
                <small>%{rain}</small>
              </span>
              <span className="daily-temps">
                <em>{formatTemp(min, unit)}</em>
                <span className="temp-bar">
                  <span style={{ width: `${width}%` }} />
                </span>
                <strong>{formatTemp(max, unit)}</strong>
              </span>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
