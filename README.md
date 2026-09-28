# SevillaComing ✈

Cronometru + hartă pentru drumul meu **Brașov → București (Otopeni) → Sevilla**, marți 20 octombrie 2026.

| Ora | Ce se întâmplă | Loc |
|---|---|---|
| 02:30 | Plec de acasă | 45.662000, 25.604963 |
| 03:00 | Preluare bagaje, plecare cu cursa specială | 45.659912, 25.618763 |
| 05:10 | Ajung în Otopeni | 44.572287, 26.077147 |
| 06:20 | Se închid porțile | Otopeni |
| 06:55 | Decolare | Otopeni |
| 10:15 (ora Spaniei) | Aterizare în Sevilla | 37.423652, -5.901265 |

Orele din România sunt EEST (UTC+3), cele din Spania CEST (UTC+2).

## Stack

React 19 · Vite 8 · Chakra UI v3 · MapLibre GL 6 + react-map-gl 8 · hărți OpenFreeMap (fără API key).

## Rulare

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
npm run lint
```

Pentru a simula un alt moment: `http://localhost:5173/?now=2026-10-20T08:30:00%2B03:00`.

## Structură

- `src/data/route.ts` — punctele, orele și steagurile traseului
- `src/lib/time.ts` — countdown, etapa curentă, poziția estimată
- `src/components/RouteMap.tsx` — harta, linia punctată animată, steagurile
- `src/components/LocationDrawer.tsx` — drawer-ul cu detalii pentru fiecare locație
