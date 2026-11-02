export default function AlertBanner({ alerts }) {
  if (!alerts?.length) return null

  return (
    <div className="alert-stack" role="status">
      {alerts.map((alert) => (
        <article className={`alert-band tone-${alert.tone}`} key={alert.id}>
          <i className={`bi ${alert.icon}`} />
          <div>
            <strong>{alert.title}</strong>
            <p className="mb-0">{alert.text}</p>
          </div>
        </article>
      ))}
    </div>
  )
}
