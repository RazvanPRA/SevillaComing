import { eventTime, POINTS, toLngLat } from '../data/route'
import { greatCircle, pointAlong } from './geo'

export interface Remaining {
  days: number
  hours: number
  minutes: number
  seconds: number
  done: boolean
}

export function remaining(target: number, now: number): Remaining {
  const diff = Math.max(0, target - now)
  const s = Math.floor(diff / 1000)
  return {
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
    done: diff === 0,
  }
}

export function formatClock(iso: string | number, timeZone: string) {
  return new Intl.DateTimeFormat('ro-RO', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone,
  }).format(new Date(iso))
}

export function formatDate(iso: string | number, timeZone: string) {
  return new Intl.DateTimeFormat('ro-RO', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone,
  }).format(new Date(iso))
}

/** „peste 2z 3h 10m” / „acum 5m” — scurt, pentru evenimente. */
export function relative(target: number, now: number) {
  const diff = target - now
  const r = remaining(Math.abs(diff), 0)
  const parts = [
    r.days && `${r.days}z`,
    r.hours && `${r.hours}h`,
    r.minutes && `${r.minutes}m`,
    !r.days && !r.hours && `${r.seconds}s`,
  ].filter(Boolean)
  return diff >= 0 ? `peste ${parts.join(' ')}` : `acum ${parts.join(' ')}`
}

export const BUS_LINE: [number, number][] = [
  toLngLat(POINTS.home),
  toLngLat(POINTS.pickup),
  toLngLat(POINTS.otopeni),
]
export const FLIGHT_LINE = greatCircle(POINTS.otopeni, POINTS.sevilla)
export const FULL_ROUTE: [number, number][] = [...BUS_LINE, ...FLIGHT_LINE.slice(1)]

export type PhaseKind = 'home' | 'walk' | 'bus' | 'airport' | 'flight' | 'arrived'

export interface Phase {
  kind: PhaseKind
  label: string
  /** Poziția mea estimată, [lng, lat]. */
  position: [number, number]
  /** Progresul pe întreg traseul, 0..1 (în funcție de timp). */
  progress: number
}

const lerp = (a: [number, number], b: [number, number], t: number): [number, number] => [
  a[0] + (b[0] - a[0]) * t,
  a[1] + (b[1] - a[1]) * t,
]

export function currentPhase(now: number): Phase {
  const tLeave = eventTime('leave-home')
  const tBus = eventTime('bus-departure')
  const tOtp = eventTime('arrive-otopeni')
  const tOff = eventTime('takeoff')
  const tLand = eventTime('landing')
  const frac = (a: number, b: number) => (now - a) / (b - a)
  const progress = Math.min(Math.max(frac(tLeave, tLand), 0), 1)
  const [home, pickup, otp] = BUS_LINE

  if (now < tLeave) return { kind: 'home', label: 'Încă acasă, în Brașov', position: home, progress }
  if (now < tBus)
    return {
      kind: 'walk',
      label: 'Spre punctul de preluare',
      position: lerp(home, pickup, frac(tLeave, tBus)),
      progress,
    }
  if (now < tOtp)
    return {
      kind: 'bus',
      label: 'Cu cursa specială spre Otopeni',
      position: lerp(pickup, otp, frac(tBus, tOtp)),
      progress,
    }
  if (now < tOff)
    return { kind: 'airport', label: 'În Aeroportul Otopeni', position: otp, progress }
  if (now < tLand)
    return {
      kind: 'flight',
      label: 'În zbor spre Sevilla ✈',
      position: pointAlong(FLIGHT_LINE, frac(tOff, tLand)),
      progress,
    }
  return {
    kind: 'arrived',
    label: 'Am ajuns în Sevilla! 🎉',
    position: toLngLat(POINTS.sevilla),
    progress,
  }
}
