export default function Skeleton() {
  return (
    <div className="row g-4">
      <div className="col-lg-8">
        <div className="hk-card skeleton-card">
          <div className="sk sk-title" />
          <div className="sk sk-temp" />
          <div className="sk sk-line" />
        </div>
        <div className="hk-card skeleton-card mt-4">
          <div className="row g-3">
            {Array.from({ length: 8 }).map((_, index) => (
              <div className="col-6 col-md-3" key={index}>
                <div className="sk sk-metric" />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="col-lg-4">
        <div className="hk-card skeleton-card">
          <div className="sk sk-photo" />
          <div className="sk sk-line mt-3" />
          <div className="sk sk-line short" />
        </div>
      </div>
    </div>
  )
}
