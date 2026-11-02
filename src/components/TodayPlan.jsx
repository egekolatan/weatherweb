import { useLang } from '../i18n/LanguageContext'

export default function TodayPlan({ activities }) {
  const { t } = useLang()
  if (!activities?.length) return null

  return (
    <section className="hk-card">
      <div className="section-head">
        <h2>{t('planTitle')}</h2>
        <span>{t('planHint')}</span>
      </div>
      <div className="row g-3">
        {activities.map((item) => (
          <div className="col-sm-6 col-md-4" key={item.id}>
            <article className={`plan-card verdict-${item.verdict}`}>
              <div className="plan-top">
                <i className={`bi ${item.icon}`} />
                <span>{t(`verdict.${item.verdict}`)}</span>
              </div>
              <h3>{item.title}</h3>
              <p className="mb-0">{item.reason}</p>
            </article>
          </div>
        ))}
      </div>
    </section>
  )
}
