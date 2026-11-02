import { useLang } from '../i18n/LanguageContext'
import { flagEmoji, formatNumber, formatPopulation, mapEmbedUrl } from '../utils/format'

export default function CityProfile({ city, weather, profile }) {
  const { t, locale } = useLang()
  const facts = [
    { label: t('timezone'), value: weather?.timezone ?? city.timezone ?? '—' },
    { label: t('elevation'), value: city.elevation != null ? `${Math.round(city.elevation)} m` : `${Math.round(weather?.elevation ?? 0)} m` },
    { label: t('coordinates'), value: `${formatNumber(city.latitude, 2, locale)}°, ${formatNumber(city.longitude, 2, locale)}°` },
    { label: t('population'), value: formatPopulation(city.population, locale, t) ?? '—' },
  ]

  return (
    <section className="hk-card city-card">
      {profile?.thumbnail && (
        <div className="city-photo">
          <img src={profile.thumbnail} alt={city.name} />
        </div>
      )}
      <div className="section-head">
        <h2>{t('profile')}</h2>
        <span>{flagEmoji(city.country_code)} {city.country || t('world')}</span>
      </div>
      {profile?.extract && <p className="city-extract">{profile.extract}</p>}
      <dl className="city-facts">
        {facts.map((fact) => (
          <div key={fact.label}>
            <dt>{fact.label}</dt>
            <dd>{fact.value}</dd>
          </div>
        ))}
      </dl>
      <div className="map-frame">
        <iframe
          title={t('mapTitle', { name: city.name })}
          src={mapEmbedUrl(city.latitude, city.longitude)}
          loading="lazy"
        />
      </div>
      {profile?.pageUrl && (
        <a className="wiki-link" href={profile.pageUrl} target="_blank" rel="noreferrer">
          {t('wikiRead')} <i className="bi bi-arrow-up-right" />
        </a>
      )}
    </section>
  )
}
