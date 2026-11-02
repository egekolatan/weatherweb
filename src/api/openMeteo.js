const GEO_URL = 'https://geocoding-api.open-meteo.com/v1/search'
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast'
const AIR_URL = 'https://air-quality-api.open-meteo.com/v1/air-quality'
const REVERSE_URL = 'https://api.bigdatacloud.net/data/reverse-geocode-client'
const WIKI_URL = (lang) => `https://${lang === 'en' ? 'en' : 'tr'}.wikipedia.org/api/rest_v1/page/summary/`

export async function searchCities(name, signal, language = 'tr') {
  const trimmed = name.trim()
  if (trimmed.length < 2) return []

  const url = new URL(GEO_URL)
  url.searchParams.set('name', trimmed)
  url.searchParams.set('count', '6')
  url.searchParams.set('language', language)
  url.searchParams.set('format', 'json')

  const response = await fetch(url, { signal })
  if (!response.ok) throw new Error('search')
  const data = await response.json()
  return data.results ?? []
}

export async function reverseCity(latitude, longitude, signal, language = 'tr') {
  const url = new URL(REVERSE_URL)
  url.searchParams.set('latitude', String(latitude))
  url.searchParams.set('longitude', String(longitude))
  url.searchParams.set('localityLanguage', language === 'en' ? 'en' : 'tr')

  const response = await fetch(url, { signal })
  if (!response.ok) {
    return fallbackLocation(latitude, longitude)
  }

  const data = await response.json()
  return {
    id: `geo-${latitude.toFixed(3)}-${longitude.toFixed(3)}`,
    name: data.city || data.locality || '',
    latitude,
    longitude,
    country: data.countryName,
    country_code: data.countryCode,
    admin1: data.principalSubdivision,
  }
}

export async function fetchForecast(latitude, longitude, signal) {
  const url = new URL(FORECAST_URL)
  url.searchParams.set('latitude', String(latitude))
  url.searchParams.set('longitude', String(longitude))
  url.searchParams.set(
    'current',
    [
      'temperature_2m',
      'relative_humidity_2m',
      'apparent_temperature',
      'is_day',
      'precipitation',
      'weather_code',
      'cloud_cover',
      'pressure_msl',
      'wind_speed_10m',
      'wind_direction_10m',
      'wind_gusts_10m',
    ].join(','),
  )
  url.searchParams.set(
    'hourly',
    'temperature_2m,precipitation_probability,weather_code,visibility',
  )
  url.searchParams.set(
    'daily',
    [
      'weather_code',
      'temperature_2m_max',
      'temperature_2m_min',
      'sunrise',
      'sunset',
      'uv_index_max',
      'precipitation_sum',
      'precipitation_probability_max',
    ].join(','),
  )
  url.searchParams.set('timezone', 'auto')
  url.searchParams.set('forecast_days', '7')
  url.searchParams.set('wind_speed_unit', 'kmh')

  const response = await fetch(url, { signal })
  if (!response.ok) throw new Error('weather')
  return response.json()
}

export async function fetchAirQuality(latitude, longitude, signal) {
  const url = new URL(AIR_URL)
  url.searchParams.set('latitude', String(latitude))
  url.searchParams.set('longitude', String(longitude))
  url.searchParams.set(
    'current',
    'european_aqi,pm10,pm2_5,nitrogen_dioxide,ozone',
  )
  url.searchParams.set('timezone', 'auto')

  const response = await fetch(url, { signal })
  if (!response.ok) return null
  return response.json()
}

export async function fetchCityProfile(cityName, signal, language = 'tr') {
  try {
    const response = await fetch(`${WIKI_URL(language)}${encodeURIComponent(cityName)}`, {
      signal,
      headers: { Accept: 'application/json' },
    })
    if (!response.ok) return null
    const data = await response.json()
    if (data.type === 'disambiguation' || !data.extract) return null
    return {
      extract: data.extract,
      thumbnail: data.thumbnail?.source ?? null,
      pageUrl: data.content_urls?.desktop?.page ?? null,
      title: data.title,
    }
  } catch {
    return null
  }
}

function fallbackLocation(latitude, longitude) {
  return {
    id: `geo-${latitude.toFixed(3)}-${longitude.toFixed(3)}`,
    name: '',
    latitude,
    longitude,
  }
}
