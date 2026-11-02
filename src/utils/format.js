const FAVORITES_KEY = 'weatherweb-favorites'
const UNIT_KEY = 'weatherweb-unit'
const LAST_CITY_KEY = 'weatherweb-last-city'

export function formatTemp(celsius, unit, withSymbol = true) {
  if (celsius == null || Number.isNaN(celsius)) return '—'
  const value = unit === 'f' ? (celsius * 9) / 5 + 32 : celsius
  return `${Math.round(value)}${withSymbol ? '°' : ''}`
}

export function formatNumber(value, digits = 0, locale = 'tr-TR') {
  if (value == null || Number.isNaN(value)) return '—'
  return Number(value).toLocaleString(locale, {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  })
}

export function formatHour(iso, locale = 'tr-TR') {
  return new Date(iso).toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })
}

export function formatClock(iso, locale = 'tr-TR') {
  return new Date(iso).toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })
}

export function formatWeekday(date, index, locale = 'tr-TR', t) {
  if (index === 0) return t ? t('today') : 'Today'
  if (index === 1) return t ? t('tomorrow') : 'Tomorrow'
  return new Date(`${date}T00:00:00`).toLocaleDateString(locale, { weekday: 'long' })
}

export function formatPopulation(value, locale = 'tr-TR', t) {
  if (!value) return null
  if (value >= 1_000_000) {
    const n = (value / 1_000_000).toFixed(1).replace('.0', '')
    return t ? t('million', { n }) : `${n} million`
  }
  return value.toLocaleString(locale)
}

export function flagEmoji(countryCode) {
  if (!countryCode) return ''
  return [...countryCode.toUpperCase()]
    .map((char) => String.fromCodePoint(127397 + char.charCodeAt()))
    .join('')
}

export function mapEmbedUrl(lat, lon) {
  const delta = 0.08
  const bbox = [lon - delta, lat - delta / 1.6, lon + delta, lat + delta / 1.6].join('%2C')
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lon}`
}

export function loadFavorites() {
  try {
    return JSON.parse(localStorage.getItem(FAVORITES_KEY)) ?? []
  } catch {
    return []
  }
}

export function saveFavorites(list) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(list))
}

export function loadUnit() {
  return localStorage.getItem(UNIT_KEY) === 'f' ? 'f' : 'c'
}

export function saveUnit(unit) {
  localStorage.setItem(UNIT_KEY, unit)
}

export function loadLastCity() {
  try {
    return JSON.parse(localStorage.getItem(LAST_CITY_KEY))
  } catch {
    return null
  }
}

export function saveLastCity(city) {
  localStorage.setItem(LAST_CITY_KEY, JSON.stringify(city))
}

export const DEFAULT_CITY = {
  id: 745044,
  name: 'İstanbul',
  latitude: 41.0138,
  longitude: 28.9497,
  country: 'Türkiye',
  country_code: 'TR',
  admin1: 'İstanbul',
  timezone: 'Europe/Istanbul',
  elevation: 40,
  population: 14804116,
}

export const ANKARA_CITY = {
  id: 323786,
  name: 'Ankara',
  latitude: 39.9199,
  longitude: 32.8543,
  country: 'Türkiye',
  country_code: 'TR',
  admin1: 'Ankara',
  timezone: 'Europe/Istanbul',
  elevation: 890,
  population: 3517182,
}

const COMPARE_KEY = 'weatherweb-compare'

export function pickCompareCity(primary) {
  return primary?.id === DEFAULT_CITY.id ? ANKARA_CITY : DEFAULT_CITY
}

export function loadCompareCity() {
  try {
    return JSON.parse(localStorage.getItem(COMPARE_KEY))
  } catch {
    return null
  }
}

export function saveCompareCity(city) {
  localStorage.setItem(COMPARE_KEY, JSON.stringify(city))
}

export function formatTimeInZone(timeZone, withSeconds = false, locale = 'tr-TR') {
  if (!timeZone) return '—'
  return new Intl.DateTimeFormat(locale, {
    timeZone,
    hour: '2-digit',
    minute: '2-digit',
    ...(withSeconds ? { second: '2-digit' } : {}),
  }).format(new Date())
}

export function formatDateInZone(timeZone, locale = 'tr-TR') {
  if (!timeZone) return '—'
  return new Intl.DateTimeFormat(locale, {
    timeZone,
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date())
}

export function localTimeZone() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone
}

export function zoneOffsetHours(timeZone, date = new Date()) {
  try {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone,
      hour: '2-digit',
      timeZoneName: 'shortOffset',
    }).formatToParts(date)
    const raw = parts.find((part) => part.type === 'timeZoneName')?.value || ''
    const match = raw.match(/([+-])(\d{1,2})(?::?(\d{2}))?/)
    if (!match) return 0
    const sign = match[1] === '-' ? -1 : 1
    return sign * (Number(match[2]) + Number(match[3] || 0) / 60)
  } catch {
    return 0
  }
}

export function offsetVersusLocal(timeZone, t) {
  if (!timeZone) return '—'
  const diff = zoneOffsetHours(timeZone) - zoneOffsetHours(localTimeZone())
  if (Math.abs(diff) < 0.05) return t ? t('sameZone') : 'Same as your clock'
  const sign = diff > 0 ? '+' : '−'
  const abs = Math.abs(diff)
  const hours = Math.floor(abs)
  const minutes = Math.round((abs - hours) * 60)
  const offset = minutes ? `${sign}${hours}:${String(minutes).padStart(2, '0')}` : `${sign}${hours}`
  return t ? t('offsetHours', { offset }) : `${offset} h`
}
