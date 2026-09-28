// Coordonatele sunt [lat, lng] (ca în Google Maps). MapLibre folosește [lng, lat] — vezi toLngLat().
export type LatLng = [number, number]

export type StopId = 'brasov' | 'bucuresti' | 'sevilla'

export type FlagVariant = 'start' | 'stopover' | 'finish'

export const TZ_RO = 'Europe/Bucharest'
export const TZ_ES = 'Europe/Madrid'

export interface RouteEvent {
  id: string
  stop: StopId
  /** ISO cu offset explicit: 20 oct 2026 România = EEST (+03:00), Spania = CEST (+02:00). */
  time: string
  timeZone: string
  title: string
  description: string
  coords: LatLng
  place: string
}

export interface Stop {
  id: StopId
  name: string
  subtitle: string
  /** Eticheta scurtă de lângă steag. */
  tag: string
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
    name: 'Brașov',
    subtitle: 'Punct de preluare · Cursă specială',
    tag: 'Plecare',
    variant: 'start',
    coords: POINTS.pickup,
    timeZone: TZ_RO,
  },
  bucuresti: {
    id: 'bucuresti',
    name: 'București',
    subtitle: 'Aeroportul Henri Coandă, Otopeni (OTP)',
    tag: 'Escală · Otopeni',
    variant: 'stopover',
    coords: POINTS.otopeni,
    timeZone: TZ_RO,
  },
  sevilla: {
    id: 'sevilla',
    name: 'Sevilla',
    subtitle: 'Aeropuerto de Sevilla (SVQ)',
    tag: 'Sosire',
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
    title: 'Plec de acasă',
    description: 'Plec spre punctul de preluare a mea și a bagajelor.',
    coords: POINTS.home,
    place: 'Acasă, Brașov',
  },
  {
    id: 'bus-departure',
    stop: 'brasov',
    time: '2026-10-20T03:00:00+03:00',
    timeZone: TZ_RO,
    title: 'Plecare cu cursa specială',
    description: 'Preluare bagaje și plecare cu cursa specială spre Aeroportul Otopeni.',
    coords: POINTS.pickup,
    place: 'Punct de preluare, Brașov',
  },
  {
    id: 'arrive-otopeni',
    stop: 'bucuresti',
    time: '2026-10-20T05:10:00+03:00',
    timeZone: TZ_RO,
    title: 'Ajung în Otopeni',
    description: 'Sosire la Aeroportul Internațional Henri Coandă. Check-in și control de securitate.',
    coords: POINTS.otopeni,
    place: 'Aeroportul Otopeni',
  },
  {
    id: 'gates-close',
    stop: 'bucuresti',
    time: '2026-10-20T06:20:00+03:00',
    timeZone: TZ_RO,
    title: 'Se închid porțile',
    description: 'Ultimul moment de îmbarcare.',
    coords: POINTS.otopeni,
    place: 'Aeroportul Otopeni',
  },
  {
    id: 'takeoff',
    stop: 'bucuresti',
    time: '2026-10-20T06:55:00+03:00',
    timeZone: TZ_RO,
    title: 'Decolare spre Sevilla',
    description: 'Avionul decolează din Otopeni. Zbor de aproximativ 4h 20min.',
    coords: POINTS.otopeni,
    place: 'Aeroportul Otopeni',
  },
  {
    id: 'landing',
    stop: 'sevilla',
    time: '2026-10-20T10:15:00+02:00',
    timeZone: TZ_ES,
    title: 'Aterizare în Sevilla',
    description: 'Avionul aterizează pe Aeropuerto de Sevilla. ¡Bienvenido a Sevilla!',
    coords: POINTS.sevilla,
    place: 'Aeropuerto de Sevilla',
  },
]

export const eventTime = (id: string) =>
  new Date(EVENTS.find((e) => e.id === id)!.time).getTime()

export const ARRIVAL = eventTime('landing')

export const toLngLat = ([lat, lng]: LatLng): [number, number] => [lng, lat]

export const googleMapsUrl = ([lat, lng]: LatLng) =>
  `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`
