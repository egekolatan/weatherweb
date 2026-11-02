import AirQuality from './components/AirQuality'
import AlertBanner from './components/AlertBanner'
import CityProfile from './components/CityProfile'
import ComparePanel from './components/ComparePanel'
import DailyForecast from './components/DailyForecast'
import Favorites from './components/Favorites'
import HourlyForecast from './components/HourlyForecast'
import Metrics from './components/Metrics'
import SearchBar from './components/SearchBar'
import Skeleton from './components/Skeleton'
import TodayPlan from './components/TodayPlan'
import WeatherHero from './components/WeatherHero'
import WorldClock from './components/WorldClock'
import { useCityCompare } from './hooks/useCityCompare'
import { useWeatherDashboard } from './hooks/useWeatherDashboard'
import { useLang } from './i18n/LanguageContext'
import { buildActivities, buildAlerts } from './utils/weather'

export default function App() {
  const { t, lang, toggleLang } = useLang()
  const dash = useWeatherDashboard()
  const compare = useCityCompare(dash.city)
  const alerts = dash.weather ? buildAlerts(dash.weather, dash.air, t) : []
  const activities = dash.weather
    ? buildActivities(dash.city, dash.weather, dash.air, dash.profile, t)
    : []

  return (
    <div className={`app-shell ${dash.theme}`}>
      <header className="topbar">
        <div className="container-xl">
          <div className="topbar-row">
            <div className="brand">
              <span className="brand-mark">
                <i className="bi bi-cloud-sun-fill" />
              </span>
              <div>
                <strong>WeatherWeb</strong>
                <small>{t('tagline')}</small>
              </div>
            </div>

            <SearchBar
              query={dash.query}
              setQuery={dash.setQuery}
              suggestions={dash.suggestions}
              searching={dash.searching}
              onSelect={dash.selectCity}
              locating={dash.locating}
              onLocate={dash.useMyLocation}
              placeholder={t('searchPlaceholder')}
            />

            <div className="topbar-actions">
              <button type="button" className="btn btn-unit" onClick={toggleLang} title="TR / EN">
                {lang === 'tr' ? 'EN' : 'TR'}
              </button>
              <button type="button" className="btn btn-unit" onClick={dash.toggleUnit}>
                {dash.unit === 'c' ? '°C' : '°F'}
              </button>
            </div>
          </div>

          <Favorites
            favorites={dash.favorites}
            currentId={dash.city.id}
            onSelect={dash.selectCity}
            onRemove={dash.removeFavorite}
          />
        </div>
      </header>

      <main className="container-xl py-4 py-lg-5">
        {dash.error && (
          <div className="alert alert-warning shadow-sm" role="alert">
            {dash.error}
          </div>
        )}

        {dash.loading || !dash.weather ? (
          <Skeleton />
        ) : (
          <>
            <AlertBanner alerts={alerts} />
            <div className="row g-4">
              <div className="col-lg-8 d-flex flex-column gap-4">
                <WeatherHero
                  city={dash.city}
                  weather={dash.weather}
                  air={dash.air}
                  unit={dash.unit}
                  isFavorite={dash.isFavorite}
                  onToggleFavorite={dash.toggleFavorite}
                />
                <TodayPlan activities={activities} />
                <Metrics weather={dash.weather} unit={dash.unit} />
                <HourlyForecast weather={dash.weather} unit={dash.unit} />
                <DailyForecast weather={dash.weather} unit={dash.unit} />
              </div>
              <div className="col-lg-4 d-flex flex-column gap-4">
                <AirQuality air={dash.air} />
                <WorldClock city={dash.city} timeZone={dash.weather.timezone} />
                <CityProfile city={dash.city} weather={dash.weather} profile={dash.profile} />
              </div>
            </div>
            <div className="mt-4">
              <ComparePanel
                leftCity={dash.city}
                leftWeather={dash.weather}
                leftAir={dash.air}
                unit={dash.unit}
                compare={compare}
              />
            </div>
          </>
        )}
      </main>
    </div>
  )
}
