// Coordonatele sunt [lat, lng] (ca în Google Maps). MapLibre folosește [lng, lat] — vezi toLngLat().
export type LatLng = [number, number]

export type StopId = 'brasov' | 'bucuresti' | 'sevilla'

export type FlagVariant = 'start' | 'stopover' | 'finish'

export const TZ_RO = 'Europe/Bucharest'
export const TZ_ES = 'Europe/Madrid'

export type EventId =
  | 'leave-home'
  | 'bus-departure'
  | 'arrive-otopeni'
  | 'gates-close'
  | 'takeoff'
  | 'landing'

// Textele (titluri, descrieri, nume) sunt în src/i18n/translations.ts.
export interface RouteEvent {
  id: EventId
  stop: StopId
  /** ISO cu offset explicit: 20 oct 2026 România = EEST (+03:00), Spania = CEST (+02:00). */
  time: string
  timeZone: string
  coords: LatLng
}

export interface Stop {
  id: StopId
  variant: FlagVariant
  /** Poziția steagului pe hartă. */
  coords: LatLng
  timeZone: string
}

export const POINTS = {
  home: [45.662, 25.604963] as LatLng,
  pickup: [45.659912, 25.618763] as LatLng,
  otopeni: [44.572287, 26.077147] as LatLng,
  sevilla: [37.423652, -5.901265] as LatLng,
}

export const STOPS: Record<StopId, Stop> = {
  brasov: {
    id: 'brasov',
    variant: 'start',
    coords: POINTS.pickup,
    timeZone: TZ_RO,
  },
  bucuresti: {
    id: 'bucuresti',
    variant: 'stopover',
    coords: POINTS.otopeni,
    timeZone: TZ_RO,
  },
  sevilla: {
    id: 'sevilla',
    variant: 'finish',
    coords: POINTS.sevilla,
    timeZone: TZ_ES,
  },
}

export const STOP_ORDER: StopId[] = ['brasov', 'bucuresti', 'sevilla']

export const EVENTS: RouteEvent[] = [
  {
    id: 'leave-home',
    stop: 'brasov',
    time: '2026-10-20T02:30:00+03:00',
    timeZone: TZ_RO,
    coords: POINTS.home,
  },
  {
    id: 'bus-departure',
    stop: 'brasov',
    time: '2026-10-20T03:00:00+03:00',
    timeZone: TZ_RO,
    coords: POINTS.pickup,
  },
  {
    id: 'arrive-otopeni',
    stop: 'bucuresti',
    time: '2026-10-20T05:10:00+03:00',
    timeZone: TZ_RO,
    coords: POINTS.otopeni,
  },
  {
    id: 'gates-close',
    stop: 'bucuresti',
    time: '2026-10-20T06:20:00+03:00',
    timeZone: TZ_RO,
    coords: POINTS.otopeni,
  },
  {
    id: 'takeoff',
    stop: 'bucuresti',
    time: '2026-10-20T06:55:00+03:00',
    timeZone: TZ_RO,
    coords: POINTS.otopeni,
  },
  {
    id: 'landing',
    stop: 'sevilla',
    time: '2026-10-20T10:15:00+02:00',
    timeZone: TZ_ES,
    coords: POINTS.sevilla,
  },
]

export const eventTime = (id: EventId) =>
  new Date(EVENTS.find((e) => e.id === id)!.time).getTime()

export const ARRIVAL = eventTime('landing')

export const toLngLat = ([lat, lng]: LatLng): [number, number] => [lng, lat]

export const googleMapsUrl = ([lat, lng]: LatLng) =>
  `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`
