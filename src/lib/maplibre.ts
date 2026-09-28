import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url'

// MapLibre 6 caută worker-ul lângă propriul fișier (import.meta.url), pe care Vite nu îl copiază.
// Vite îl împachetează ca worker ES, iar noi îi spunem lui MapLibre unde e.
// Import dinamic → maplibre-gl rămâne într-un chunk separat, încărcat odată cu harta.
export const mapLib = import('maplibre-gl').then((maplibre) => {
  maplibre.setWorkerUrl(workerUrl)
  return maplibre
})
