import type { EventId, StopId } from '../data/route'
import type { PhaseKind } from '../lib/time'

export type Lang = 'ro' | 'en' | 'es' | 'el'

export const LANGS: { code: Lang; label: string; name: string; locale: string }[] = [
  { code: 'en', label: 'EN', name: 'English', locale: 'en-GB' },
  { code: 'el', label: 'EL', name: 'Ελληνικά', locale: 'el-GR' },
  { code: 'es', label: 'ES', name: 'Español', locale: 'es-ES' },
  { code: 'ro', label: 'RO', name: 'Română', locale: 'ro-RO' },
]

export interface Dict {
  language: string
  route: string
  units: { days: string; hours: string; minutes: string; seconds: string }
  /** Unitățile scurte pentru „peste 2z 3h 10m”. */
  short: { d: string; h: string; m: string; s: string }
  future: (s: string) => string
  past: (s: string) => string
  done: string
  arrival: (es: string, ro: string) => string
  phase: Record<PhaseKind, string>
  stops: Record<StopId, { name: string; subtitle: string; tag: string }>
  events: Record<EventId, { title: string; description: string; place: string }>
  tzEs: string
  tzRo: string
  homeMarker: string
  pickupMarker: string
  fitAll: string
}

const ro: Dict = {
  language: 'Limbă',
  route: 'Brașov → București (Otopeni) → Sevilla · 20 octombrie 2026',
  units: { days: 'zile', hours: 'ore', minutes: 'min', seconds: 'sec' },
  short: { d: 'z', h: 'h', m: 'm', s: 's' },
  future: (s) => `peste ${s}`,
  past: (s) => `acum ${s}`,
  done: '¡Estoy en Sevilla! 🎉',
  arrival: (es, r) => `Sosire: ${es} Sevilla · ${r} România`,
  phase: {
    home: 'Încă acasă, în Brașov',
    walk: 'Spre punctul de preluare',
    bus: 'Cu cursa specială spre Otopeni',
    airport: 'În Aeroportul Otopeni',
    flight: 'În zbor spre Sevilla ✈',
    arrived: 'Am ajuns în Sevilla! 🎉',
  },
  stops: {
    brasov: { name: 'Brașov', subtitle: 'Punct de preluare · Cursă specială', tag: 'Plecare' },
    bucuresti: {
      name: 'București',
      subtitle: 'Aeroportul Henri Coandă, Otopeni (OTP)',
      tag: 'Escală · Otopeni',
    },
    sevilla: { name: 'Sevilla', subtitle: 'Aeropuerto de Sevilla (SVQ)', tag: 'Sosire' },
  },
  events: {
    'leave-home': {
      title: 'Plec de acasă',
      description: 'Plec spre punctul de preluare a mea și a bagajelor.',
      place: 'Acasă, Brașov',
    },
    'bus-departure': {
      title: 'Plecare cu cursa specială',
      description: 'Preluare bagaje și plecare cu cursa specială spre Aeroportul Otopeni.',
      place: 'Punct de preluare, Brașov',
    },
    'arrive-otopeni': {
      title: 'Ajung în Otopeni',
      description:
        'Sosire la Aeroportul Internațional Henri Coandă. Check-in și control de securitate.',
      place: 'Aeroportul Otopeni',
    },
    'gates-close': {
      title: 'Se închid porțile',
      description: 'Ultimul moment de îmbarcare.',
      place: 'Aeroportul Otopeni',
    },
    takeoff: {
      title: 'Decolare spre Sevilla',
      description: 'Avionul decolează din Otopeni. Zbor de aproximativ 4h 20min.',
      place: 'Aeroportul Otopeni',
    },
    landing: {
      title: 'Aterizare în Sevilla',
      description: 'Avionul aterizează pe Aeropuerto de Sevilla. ¡Bienvenido a Sevilla!',
      place: 'Aeropuerto de Sevilla',
    },
  },
  tzEs: 'ora Spaniei (CEST)',
  tzRo: 'ora României (EEST)',
  homeMarker: 'Acasă · plec la 02:30',
  pickupMarker: 'Punct de preluare · plecare 03:00',
  fitAll: 'Vezi tot traseul',
}

const en: Dict = {
  language: 'Language',
  route: 'Brașov → Bucharest (Otopeni) → Seville · 20 October 2026',
  units: { days: 'days', hours: 'hours', minutes: 'min', seconds: 'sec' },
  short: { d: 'd', h: 'h', m: 'm', s: 's' },
  future: (s) => `in ${s}`,
  past: (s) => `${s} ago`,
  done: "I'm in Seville! 🎉",
  arrival: (es, r) => `Arrival: ${es} Seville · ${r} Romania`,
  phase: {
    home: 'Still at home in Brașov',
    walk: 'Heading to the pickup point',
    bus: 'On the special shuttle to Otopeni',
    airport: 'At Otopeni Airport',
    flight: 'Flying to Seville ✈',
    arrived: 'Landed in Seville! 🎉',
  },
  stops: {
    brasov: { name: 'Brașov', subtitle: 'Pickup point · Special shuttle', tag: 'Departure' },
    bucuresti: {
      name: 'Bucharest',
      subtitle: 'Henri Coandă Airport, Otopeni (OTP)',
      tag: 'Stopover · Otopeni',
    },
    sevilla: { name: 'Seville', subtitle: 'Seville Airport (SVQ)', tag: 'Arrival' },
  },
  events: {
    'leave-home': {
      title: 'Leaving home',
      description: 'Heading to the pickup point for me and my luggage.',
      place: 'Home, Brașov',
    },
    'bus-departure': {
      title: 'Special shuttle departs',
      description: 'Luggage drop-off and departure on the special shuttle to Otopeni Airport.',
      place: 'Pickup point, Brașov',
    },
    'arrive-otopeni': {
      title: 'Arriving at Otopeni',
      description: 'Arrival at Henri Coandă International Airport. Check-in and security.',
      place: 'Otopeni Airport',
    },
    'gates-close': {
      title: 'Gates close',
      description: 'Last chance to board.',
      place: 'Otopeni Airport',
    },
    takeoff: {
      title: 'Takeoff to Seville',
      description: 'The plane takes off from Otopeni. Flight time about 4h 20min.',
      place: 'Otopeni Airport',
    },
    landing: {
      title: 'Landing in Seville',
      description: 'The plane lands at Seville Airport. ¡Bienvenido a Sevilla!',
      place: 'Seville Airport',
    },
  },
  tzEs: 'Spain time (CEST)',
  tzRo: 'Romania time (EEST)',
  homeMarker: 'Home · leaving at 02:30',
  pickupMarker: 'Pickup point · departure 03:00',
  fitAll: 'Show the whole route',
}

const es: Dict = {
  language: 'Idioma',
  route: 'Brașov → Bucarest (Otopeni) → Sevilla · 20 de octubre de 2026',
  units: { days: 'días', hours: 'horas', minutes: 'min', seconds: 'seg' },
  short: { d: 'd', h: 'h', m: 'm', s: 's' },
  future: (s) => `en ${s}`,
  past: (s) => `hace ${s}`,
  done: '¡Estoy en Sevilla! 🎉',
  arrival: (e, r) => `Llegada: ${e} Sevilla · ${r} Rumanía`,
  phase: {
    home: 'Todavía en casa, en Brașov',
    walk: 'Hacia el punto de recogida',
    bus: 'En el traslado especial hacia Otopeni',
    airport: 'En el aeropuerto de Otopeni',
    flight: 'Volando hacia Sevilla ✈',
    arrived: '¡Ya estoy en Sevilla! 🎉',
  },
  stops: {
    brasov: { name: 'Brașov', subtitle: 'Punto de recogida · Traslado especial', tag: 'Salida' },
    bucuresti: {
      name: 'Bucarest',
      subtitle: 'Aeropuerto Henri Coandă, Otopeni (OTP)',
      tag: 'Escala · Otopeni',
    },
    sevilla: { name: 'Sevilla', subtitle: 'Aeropuerto de Sevilla (SVQ)', tag: 'Llegada' },
  },
  events: {
    'leave-home': {
      title: 'Salgo de casa',
      description: 'Voy al punto de recogida, para mí y mi equipaje.',
      place: 'Casa, Brașov',
    },
    'bus-departure': {
      title: 'Sale el traslado especial',
      description:
        'Entrega del equipaje y salida en el traslado especial hacia el aeropuerto de Otopeni.',
      place: 'Punto de recogida, Brașov',
    },
    'arrive-otopeni': {
      title: 'Llego a Otopeni',
      description:
        'Llegada al Aeropuerto Internacional Henri Coandă. Facturación y control de seguridad.',
      place: 'Aeropuerto de Otopeni',
    },
    'gates-close': {
      title: 'Cierre de puertas',
      description: 'Último momento para embarcar.',
      place: 'Aeropuerto de Otopeni',
    },
    takeoff: {
      title: 'Despegue hacia Sevilla',
      description: 'El avión despega de Otopeni. Vuelo de aproximadamente 4h 20min.',
      place: 'Aeropuerto de Otopeni',
    },
    landing: {
      title: 'Aterrizaje en Sevilla',
      description: 'El avión aterriza en el Aeropuerto de Sevilla. ¡Bienvenido a Sevilla!',
      place: 'Aeropuerto de Sevilla',
    },
  },
  tzEs: 'hora de España (CEST)',
  tzRo: 'hora de Rumanía (EEST)',
  homeMarker: 'Casa · salgo a las 02:30',
  pickupMarker: 'Punto de recogida · salida 03:00',
  fitAll: 'Ver toda la ruta',
}

const el: Dict = {
  language: 'Γλώσσα',
  route: 'Μπρασόφ → Βουκουρέστι (Οτοπένι) → Σεβίλλη · 20 Οκτωβρίου 2026',
  units: { days: 'ημέρες', hours: 'ώρες', minutes: 'λεπτά', seconds: 'δευτ.' },
  short: { d: 'ημ', h: 'ω', m: 'λ', s: 'δ' },
  future: (s) => `σε ${s}`,
  past: (s) => `πριν ${s}`,
  done: 'Είμαι στη Σεβίλλη! 🎉',
  arrival: (e, r) => `Άφιξη: ${e} Σεβίλλη · ${r} Ρουμανία`,
  phase: {
    home: 'Ακόμα στο σπίτι, στο Μπρασόφ',
    walk: 'Προς το σημείο παραλαβής',
    bus: 'Με την ειδική μεταφορά προς το Οτοπένι',
    airport: 'Στο αεροδρόμιο Οτοπένι',
    flight: 'Σε πτήση προς τη Σεβίλλη ✈',
    arrived: 'Έφτασα στη Σεβίλλη! 🎉',
  },
  stops: {
    brasov: { name: 'Μπρασόφ', subtitle: 'Σημείο παραλαβής · Ειδική μεταφορά', tag: 'Αναχώρηση' },
    bucuresti: {
      name: 'Βουκουρέστι',
      subtitle: 'Αεροδρόμιο Henri Coandă, Οτοπένι (OTP)',
      tag: 'Ενδιάμεση στάση · Οτοπένι',
    },
    sevilla: { name: 'Σεβίλλη', subtitle: 'Αεροδρόμιο Σεβίλλης (SVQ)', tag: 'Άφιξη' },
  },
  events: {
    'leave-home': {
      title: 'Φεύγω από το σπίτι',
      description: 'Ξεκινάω για το σημείο παραλαβής, για μένα και τις αποσκευές μου.',
      place: 'Σπίτι, Μπρασόφ',
    },
    'bus-departure': {
      title: 'Αναχώρηση με την ειδική μεταφορά',
      description:
        'Παράδοση αποσκευών και αναχώρηση με την ειδική μεταφορά προς το αεροδρόμιο Οτοπένι.',
      place: 'Σημείο παραλαβής, Μπρασόφ',
    },
    'arrive-otopeni': {
      title: 'Φτάνω στο Οτοπένι',
      description:
        'Άφιξη στο Διεθνές Αεροδρόμιο Henri Coandă. Check-in και έλεγχος ασφαλείας.',
      place: 'Αεροδρόμιο Οτοπένι',
    },
    'gates-close': {
      title: 'Κλείνουν οι πύλες',
      description: 'Τελευταία ευκαιρία για επιβίβαση.',
      place: 'Αεροδρόμιο Οτοπένι',
    },
    takeoff: {
      title: 'Απογείωση για Σεβίλλη',
      description: 'Το αεροπλάνο απογειώνεται από το Οτοπένι. Πτήση περίπου 4ω 20λ.',
      place: 'Αεροδρόμιο Οτοπένι',
    },
    landing: {
      title: 'Προσγείωση στη Σεβίλλη',
      description:
        'Το αεροπλάνο προσγειώνεται στο αεροδρόμιο της Σεβίλλης. ¡Bienvenido a Sevilla!',
      place: 'Αεροδρόμιο Σεβίλλης',
    },
  },
  tzEs: 'ώρα Ισπανίας (CEST)',
  tzRo: 'ώρα Ρουμανίας (EEST)',
  homeMarker: 'Σπίτι · φεύγω στις 02:30',
  pickupMarker: 'Σημείο παραλαβής · αναχώρηση 03:00',
  fitAll: 'Δείτε όλη τη διαδρομή',
}

export const DICTS: Record<Lang, Dict> = { ro, en, es, el }
