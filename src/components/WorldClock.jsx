import { useEffect, useState } from 'react'
import { useLang } from '../i18n/LanguageContext'
import {
  formatDateInZone,
  formatTimeInZone,
  localTimeZone,
  offsetVersusLocal,
} from '../utils/format'

const WORLD = [
  { key: 'london', tz: 'Europe/London', mark: '🇬🇧' },
  { key: 'newYork', tz: 'America/New_York', mark: '🇺🇸' },
  { key: 'dubai', tz: 'Asia/Dubai', mark: '🇦🇪' },
  { key: 'tokyo', tz: 'Asia/Tokyo', mark: '🇯🇵' },
  { key: 'sydney', tz: 'Australia/Sydney', mark: '🇦🇺' },
]

export default function WorldClock({ city, timeZone }) {
  const { t, locale } = useLang()
  const [, setTick] = useState(0)
  const zone = timeZone || city.timezone || 'UTC'
  const here = localTimeZone()

  useEffect(() => {
    const id = setInterval(() => setTick((value) => value + 1), 1000)
    return () => clearInterval(id)
  }, [])

  const world = WORLD.filter((item) => item.tz !== zone)

  return (
    <section className="hk-card">
      <div className="section-head">
        <h2>{t('localTime')}</h2>
        <span>{zone.replace(/_/g, ' ')}</span>
      </div>
      <p className="clock-city mb-1">{city.name}</p>
      <p className="clock-time mb-1">{formatTimeInZone(zone, true, locale)}</p>
      <p className="clock-date mb-0">{formatDateInZone(zone, locale)}</p>
      <p className="clock-offset">{offsetVersusLocal(zone, t)}</p>

      <div className="local-chip">
        <span>{t('yourTime')}</span>
        <strong>
          {formatTimeInZone(here, false, locale)} · {here.replace(/_/g, ' ')}
        </strong>
      </div>

      <div className="world-list">
        {world.map((item) => (
          <article key={item.tz}>
            <span>
              {item.mark} {t(`cities.${item.key}`)}
            </span>
            <strong>{formatTimeInZone(item.tz, false, locale)}</strong>
          </article>
        ))}
      </div>
    </section>
  )
}
