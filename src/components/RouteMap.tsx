import { Box, Circle, IconButton } from '@chakra-ui/react'
import type { Feature, LineString } from 'geojson'
import type { LineLayerSpecification } from 'maplibre-gl'
import { useCallback, useEffect, useMemo, useRef } from 'react'
import { FaBus, FaHouse, FaPersonWalking, FaPlane, FaPlaneDeparture, FaStar } from 'react-icons/fa6'
import { LuMaximize } from 'react-icons/lu'
import Map, { Layer, Marker, NavigationControl, Source, type MapRef } from 'react-map-gl/maplibre'
import { POINTS, STOP_ORDER, STOPS, toLngLat, type StopId } from '../data/route'
import { useI18n } from '../i18n/context'
import { bearing, pointAlong } from '../lib/geo'
import { mapLib } from '../lib/maplibre'
import { FLIGHT_LINE, FULL_ROUTE, type Phase } from '../lib/time'
import { FlagButton } from './FlagButton'
import { useColorMode } from './ui/color-mode'
import { Tooltip } from './ui/tooltip'

const STYLES = {
  light: 'https://tiles.openfreemap.org/styles/liberty',
  dark: 'https://tiles.openfreemap.org/styles/dark',
}

// Secvența din exemplul oficial MapLibre „Animate a line”: liniuțele „curg” în sensul liniei.
const DASH_SEQUENCE = [
  [0, 4, 3],
  [0.5, 4, 2.5],
  [1, 4, 2],
  [1.5, 4, 1.5],
  [2, 4, 1],
  [2.5, 4, 0.5],
  [3, 4, 0],
  [0, 0.5, 3, 3.5],
  [0, 1, 3, 3],
  [0, 1.5, 3, 2.5],
  [0, 2, 3, 2],
  [0, 2.5, 3, 1.5],
  [0, 3, 3, 1],
  [0, 3.5, 3, 0.5],
]

const ROUTE_GEOJSON: Feature<LineString> = {
  type: 'Feature',
  properties: {},
  geometry: { type: 'LineString', coordinates: FULL_ROUTE },
}

const baseLayer: LineLayerSpecification = {
  id: 'route-base',
  type: 'line',
  source: 'route',
  layout: { 'line-cap': 'round', 'line-join': 'round' },
  paint: { 'line-color': '#f59e0b', 'line-width': 6, 'line-opacity': 0.25 },
}

const dashLayer: LineLayerSpecification = {
  id: 'route-dash',
  type: 'line',
  source: 'route',
  layout: { 'line-cap': 'butt', 'line-join': 'round' },
  paint: { 'line-color': '#f59e0b', 'line-width': 3.5, 'line-dasharray': DASH_SEQUENCE[0] },
}

const BOUNDS: [[number, number], [number, number]] = (() => {
  const lngs = FULL_ROUTE.map((p) => p[0])
  const lats = FULL_ROUTE.map((p) => p[1])
  return [
    [Math.min(...lngs), Math.min(...lats)],
    [Math.max(...lngs), Math.max(...lats)],
  ]
})()

const PHASE_ICON = {
  home: FaHouse,
  walk: FaPersonWalking,
  bus: FaBus,
  airport: FaPlaneDeparture,
  flight: FaPlane,
  arrived: FaStar,
}

interface RouteMapProps {
  selected: StopId | null
  onSelect: (id: StopId) => void
  phase: Phase
}

export function RouteMap({ selected, onSelect, phase }: RouteMapProps) {
  const mapRef = useRef<MapRef>(null)
  const { colorMode } = useColorMode()
  const { t } = useI18n()

  // Animația liniei punctate Brașov → Sevilla.
  useEffect(() => {
    let frame = 0
    let step = -1
    const animate = (timestamp: number) => {
      const map = mapRef.current?.getMap()
      const next = Math.floor((timestamp / 60) % DASH_SEQUENCE.length)
      if (map && next !== step && map.getLayer('route-dash')) {
        map.setPaintProperty('route-dash', 'line-dasharray', DASH_SEQUENCE[next])
        step = next
      }
      frame = requestAnimationFrame(animate)
    }
    frame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frame)
  }, [])

  const fitAll = useCallback(() => {
    mapRef.current?.fitBounds(BOUNDS, {
      padding: { top: 80, bottom: 80, left: 80, right: 220 },
      duration: 1200,
    })
  }, [])

  // Zoom pe steagul selectat, lăsând loc pentru drawer-ul din dreapta.
  useEffect(() => {
    if (!selected) return
    mapRef.current?.flyTo({
      center: toLngLat(STOPS[selected].coords),
      zoom: selected === 'brasov' ? 12.5 : 11,
      padding: { top: 0, bottom: 0, left: 0, right: 380 },
      duration: 1800,
    })
  }, [selected])

  const planeRotation = useMemo(() => {
    if (phase.kind !== 'flight') return 0
    const ahead = pointAlong(FLIGHT_LINE, phase.progress + 0.01)
    return bearing(phase.position, ahead) - 90
  }, [phase])

  const PhaseIcon = PHASE_ICON[phase.kind]

  return (
    <Box position="absolute" inset="0">
      <Map
        ref={mapRef}
        mapLib={mapLib}
        initialViewState={{
          bounds: BOUNDS,
          fitBoundsOptions: { padding: { top: 80, bottom: 80, left: 80, right: 220 } },
        }}
        mapStyle={STYLES[colorMode === 'dark' ? 'dark' : 'light']}
        style={{ width: '100%', height: '100%' }}
        attributionControl={{ compact: true }}
      >
        <NavigationControl position="bottom-right" />

        <Source id="route" type="geojson" data={ROUTE_GEOJSON}>
          <Layer {...baseLayer} />
          <Layer {...dashLayer} />
        </Source>

        {/* Punctele intermediare din Brașov */}
        {[
          { id: 'home', at: POINTS.home, label: t.homeMarker },
          { id: 'pickup', at: POINTS.pickup, label: t.pickupMarker },
        ].map((p) => (
          <Marker key={p.id} longitude={p.at[1]} latitude={p.at[0]}>
            <Tooltip content={p.label} showArrow>
              <Circle size="3" bg="orange.400" borderWidth="2px" borderColor="white" shadow="sm" />
            </Tooltip>
          </Marker>
        ))}

        {STOP_ORDER.map((id) => {
          const stop = STOPS[id]
          return (
            <Marker
              key={id}
              longitude={stop.coords[1]}
              latitude={stop.coords[0]}
              anchor="bottom-left"
              offset={[-4, 0]}
              style={{ zIndex: selected === id ? 3 : 2 }}
            >
              <FlagButton
                variant={stop.variant}
                name={t.stops[id].name}
                subtitle={t.stops[id].tag}
                selected={selected === id}
                onClick={() => onSelect(id)}
              />
            </Marker>
          )
        })}

        {/* Poziția mea estimată, în funcție de oră */}
        <Marker longitude={phase.position[0]} latitude={phase.position[1]} style={{ zIndex: 4 }}>
          <Tooltip content={t.phase[phase.kind]} showArrow>
            <Circle
              size="8"
              bg="yellow.300"
              color="gray.900"
              borderWidth="2px"
              borderColor="white"
              shadow="lg"
              className="me-pulse"
            >
              <PhaseIcon style={{ transform: `rotate(${planeRotation}deg)` }} />
            </Circle>
          </Tooltip>
        </Marker>
      </Map>

      <IconButton
        aria-label={t.fitAll}
        title={t.fitAll}
        position="absolute"
        bottom="150px"
        right="10px"
        size="sm"
        variant="surface"
        onClick={fitAll}
      >
        <LuMaximize />
      </IconButton>
    </Box>
  )
}

