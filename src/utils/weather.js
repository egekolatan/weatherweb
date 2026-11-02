import { formatTemp } from './format'

const WMO_ICONS = {
  0: { icon: 'bi-sun-fill', nightIcon: 'bi-moon-stars-fill' },
  1: { icon: 'bi-sun-fill', nightIcon: 'bi-moon-fill' },
  2: { icon: 'bi-cloud-sun-fill', nightIcon: 'bi-cloud-moon-fill' },
  3: { icon: 'bi-clouds-fill', nightIcon: 'bi-clouds-fill' },
  45: { icon: 'bi-cloud-fog2-fill', nightIcon: 'bi-cloud-fog2-fill' },
  48: { icon: 'bi-cloud-fog-fill', nightIcon: 'bi-cloud-fog-fill' },
  51: { icon: 'bi-cloud-drizzle-fill', nightIcon: 'bi-cloud-drizzle-fill' },
  53: { icon: 'bi-cloud-drizzle-fill', nightIcon: 'bi-cloud-drizzle-fill' },
  55: { icon: 'bi-cloud-drizzle-fill', nightIcon: 'bi-cloud-drizzle-fill' },
  56: { icon: 'bi-cloud-sleet-fill', nightIcon: 'bi-cloud-sleet-fill' },
  57: { icon: 'bi-cloud-sleet-fill', nightIcon: 'bi-cloud-sleet-fill' },
  61: { icon: 'bi-cloud-rain-fill', nightIcon: 'bi-cloud-rain-fill' },
  63: { icon: 'bi-cloud-rain-heavy-fill', nightIcon: 'bi-cloud-rain-heavy-fill' },
  65: { icon: 'bi-cloud-rain-heavy-fill', nightIcon: 'bi-cloud-rain-heavy-fill' },
  66: { icon: 'bi-cloud-sleet-fill', nightIcon: 'bi-cloud-sleet-fill' },
  67: { icon: 'bi-cloud-sleet-fill', nightIcon: 'bi-cloud-sleet-fill' },
  71: { icon: 'bi-cloud-snow-fill', nightIcon: 'bi-cloud-snow-fill' },
  73: { icon: 'bi-snow2', nightIcon: 'bi-snow2' },
  75: { icon: 'bi-snow', nightIcon: 'bi-snow' },
  77: { icon: 'bi-snow3', nightIcon: 'bi-snow3' },
  80: { icon: 'bi-cloud-rain-fill', nightIcon: 'bi-cloud-rain-fill' },
  81: { icon: 'bi-cloud-rain-heavy-fill', nightIcon: 'bi-cloud-rain-heavy-fill' },
  82: { icon: 'bi-cloud-rain-heavy-fill', nightIcon: 'bi-cloud-rain-heavy-fill' },
  85: { icon: 'bi-cloud-snow-fill', nightIcon: 'bi-cloud-snow-fill' },
  86: { icon: 'bi-snow', nightIcon: 'bi-snow' },
  95: { icon: 'bi-cloud-lightning-rain-fill', nightIcon: 'bi-cloud-lightning-rain-fill' },
  96: { icon: 'bi-cloud-hail-fill', nightIcon: 'bi-cloud-hail-fill' },
  99: { icon: 'bi-cloud-hail-fill', nightIcon: 'bi-cloud-hail-fill' },
}

export function describeWeather(code, isDay = true, t) {
  const entry = WMO_ICONS[code] ?? { icon: 'bi-question-circle', nightIcon: 'bi-question-circle' }
  const label = t?.(`wmo.${code}`) || t?.('wmo.unknown') || '—'
  return {
    label,
    icon: isDay ? entry.icon : entry.nightIcon,
  }
}

export function themeFromWeather(code, isDay) {
  if (!isDay) return 'theme-night'
  if ([71, 73, 75, 77, 85, 86].includes(code)) return 'theme-snow'
  if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82, 95, 96, 99].includes(code)) {
    return 'theme-rain'
  }
  if ([0, 1].includes(code)) return 'theme-clear'
  return 'theme-cloud'
}

export function windDirection(degree, t) {
  if (degree == null || Number.isNaN(degree)) return '—'
  const compass = t?.('compass') ?? ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
  return compass[Math.round(degree / 45) % 8]
}

export function uvLabel(value, t) {
  if (value == null) return '—'
  if (!t) return String(value)
  if (value < 3) return t('uv.low')
  if (value < 6) return t('uv.mid')
  if (value < 8) return t('uv.high')
  if (value < 11) return t('uv.very')
  return t('uv.extreme')
}

export function aqiInfo(value, t) {
  if (value == null) return { label: t?.('aqi.none') ?? '—', tone: 'muted' }
  if (value <= 20) return { label: t('aqi.good'), tone: 'good' }
  if (value <= 40) return { label: t('aqi.fair'), tone: 'ok' }
  if (value <= 60) return { label: t('aqi.mid'), tone: 'mid' }
  if (value <= 80) return { label: t('aqi.bad'), tone: 'bad' }
  if (value <= 100) return { label: t('aqi.worse'), tone: 'worse' }
  return { label: t('aqi.worst'), tone: 'worst' }
}

export function buildSummary(cityName, weather, unit, t) {
  if (!weather || !t) return ''
  const { label } = describeWeather(weather.current.weather_code, weather.current.is_day, t)
  const max = formatTemp(weather.daily.temperature_2m_max[0], unit)
  const min = formatTemp(weather.daily.temperature_2m_min[0], unit)
  const rain = weather.daily.precipitation_probability_max[0]
  return t('summary', { city: cityName, label: label.toLocaleLowerCase(), max, min, rain })
}

export function nextHours(weather, count = 24) {
  const times = weather.hourly.time
  const current = weather.current.time
  const start = Math.max(0, times.findIndex((time) => time >= current))
  return times.slice(start, start + count).map((time, index) => {
    const i = start + index
    return {
      time,
      temperature: weather.hourly.temperature_2m[i],
      rain: weather.hourly.precipitation_probability[i],
      code: weather.hourly.weather_code[i],
    }
  })
}

const STORM_CODES = [95, 96, 99]
const HEAVY_RAIN_CODES = [63, 65, 81, 82]
const WET_CODES = [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82, 95, 96, 99]
const SNOW_CODES = [71, 73, 75, 77, 85, 86]
const COASTAL_RE = /sahil|kıyı|deniz|liman|boğaz|körfez|ada |plaj|akdeniz|ege denizi|marmara|karadeniz|atlantik|okyanus|coast|beach|harbour|harbor|sea |bosphorus/
const COASTAL_CITIES = /istanbul|izmir|antalya|bodrum|alanya|mersin|trabzon|samsun|çanakkale|muşla|muğla|fethiye|çeşme|kuşadası/
const MUSEUM_RE = /müze|museum|galeri|gallery|saray|palace|kale|castle|ören yer|antik|historic|historical/
const PARK_RE = /park|bahçe|garden|koru|yürüyüş|promenade|promenad/

function isCoastalCity(city, profile) {
  const nameBlob = [city?.name, city?.admin1].filter(Boolean).join(' ').toLocaleLowerCase('tr-TR')
  if (COASTAL_CITIES.test(nameBlob)) return true
  const extract = [profile?.extract, profile?.title].filter(Boolean).join(' ').toLocaleLowerCase('tr-TR')
  return COASTAL_RE.test(extract)
}

export function buildAlerts(weather, air, t) {
  if (!weather || !t) return []
  const alerts = []
  const code = weather.current.weather_code
  const uv = weather.daily.uv_index_max[0]
  const aqi = air?.current?.european_aqi
  const gust = weather.current.wind_gusts_10m

  if (STORM_CODES.includes(code) || gust >= 75) {
    alerts.push({
      id: 'storm',
      tone: 'worst',
      icon: 'bi-cloud-lightning-rain-fill',
      title: t('alerts.stormTitle'),
      text: STORM_CODES.includes(code)
        ? t('alerts.stormThunder')
        : t('alerts.stormWind', { gust: Math.round(gust) }),
    })
  }

  if (uv >= 8) {
    alerts.push({
      id: 'uv',
      tone: 'bad',
      icon: 'bi-sun-fill',
      title: t('alerts.uvTitle'),
      text: t('alerts.uvText', { uv: Math.round(uv), label: uvLabel(uv, t) }),
    })
  }

  if (aqi != null && aqi > 60) {
    const info = aqiInfo(aqi, t)
    alerts.push({
      id: 'aqi',
      tone: aqi > 100 ? 'worst' : 'worse',
      icon: 'bi-lungs',
      title: t('alerts.aqiTitle'),
      text: t('alerts.aqiText', { aqi: Math.round(aqi), label: info.label }),
    })
  }

  return alerts
}

export function buildActivities(city, weather, air, profile, t) {
  if (!weather || !t) return []
  const code = weather.current.weather_code
  const temp = weather.current.temperature_2m
  const rain = weather.daily.precipitation_probability_max[0] ?? 0
  const uv = weather.daily.uv_index_max[0] ?? 0
  const aqi = air?.current?.european_aqi
  const isDay = Boolean(weather.current.is_day)
  const storm = STORM_CODES.includes(code)
  const heavyRain = HEAVY_RAIN_CODES.includes(code)
  const likelyRain = rain >= 70
  const wet = WET_CODES.includes(code) || rain >= 50
  const snow = SNOW_CODES.includes(code)
  const coastal = isCoastalCity(city, profile)
  const wiki = (profile?.extract || '').toLocaleLowerCase('tr-TR')
  const mentionsMuseum = MUSEUM_RE.test(wiki)
  const mentionsPark = PARK_RE.test(wiki)

  const museum = { id: 'museum', title: t('plan.museum'), icon: 'bi-bank', verdict: 'ok', reason: '' }
  if (storm || heavyRain || likelyRain || snow || (aqi != null && aqi > 80) || temp < 6) {
    museum.verdict = 'go'
    museum.reason = storm || heavyRain || likelyRain || wet
      ? t('reasons.museumWet')
      : aqi != null && aqi > 80
        ? t('reasons.museumAqi')
        : t('reasons.museumCold')
  } else if (!isDay) {
    museum.reason = t('reasons.museumNight')
  } else {
    museum.reason = t('reasons.museumOk')
  }
  if (mentionsMuseum) museum.reason += t('reasons.museumWiki')

  const beach = { id: 'beach', title: t('plan.beach'), icon: 'bi-water', verdict: 'skip', reason: '' }
  if (!coastal) {
    beach.reason = t('reasons.beachInland')
  } else if (storm || heavyRain || likelyRain || snow || temp < 16) {
    beach.reason = temp < 16
      ? t('reasons.beachCold', { temp: Math.round(temp) })
      : t('reasons.beachRain')
  } else if (temp >= 22 && !wet && isDay) {
    beach.verdict = 'go'
    beach.reason = uv >= 8 ? t('reasons.beachUv') : t('reasons.beachGo')
  } else {
    beach.verdict = 'ok'
    beach.reason = isDay ? t('reasons.beachWalk') : t('reasons.beachNight')
  }

  const walk = { id: 'walk', title: t('plan.walk'), icon: 'bi-person-walking', verdict: 'ok', reason: '' }
  if (storm || heavyRain || (aqi != null && aqi > 100)) {
    walk.verdict = 'skip'
    walk.reason = storm
      ? t('reasons.walkStorm')
      : aqi != null && aqi > 100
        ? t('reasons.walkAqi')
        : t('reasons.walkHeavy')
  } else if (likelyRain) {
    walk.verdict = 'ok'
    walk.reason = t('reasons.walkRain')
  } else if (!wet && temp >= 8 && temp <= 28 && (aqi == null || aqi <= 60)) {
    walk.verdict = 'go'
    walk.reason = mentionsPark ? t('reasons.walkPark') : t('reasons.walkGo')
  } else {
    walk.reason = wet ? t('reasons.walkDamp') : t('reasons.walkOk')
  }

  return [museum, beach, walk]
}

export function currentVisibility(weather) {
  const currentMs = new Date(weather.current.time).getTime()
  let bestIndex = 0
  let bestDiff = Infinity

  weather.hourly.time.forEach((time, index) => {
    const diff = Math.abs(new Date(time).getTime() - currentMs)
    if (diff < bestDiff) {
      bestDiff = diff
      bestIndex = index
    }
  })

  return weather.hourly.visibility[bestIndex]
}
