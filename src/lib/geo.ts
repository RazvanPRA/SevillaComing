import type { LatLng } from '../data/route'

const rad = (d: number) => (d * Math.PI) / 180
const deg = (r: number) => (r * 180) / Math.PI

/** Arc de mare cerc între două puncte, întors ca [lng, lat][] pentru GeoJSON. */
export function greatCircle(from: LatLng, to: LatLng, steps = 96): [number, number][] {
  const [lat1, lon1] = [rad(from[0]), rad(from[1])]
  const [lat2, lon2] = [rad(to[0]), rad(to[1])]
  const d =
    2 *
    Math.asin(
      Math.sqrt(
        Math.sin((lat2 - lat1) / 2) ** 2 +
          Math.cos(lat1) * Math.cos(lat2) * Math.sin((lon2 - lon1) / 2) ** 2,
      ),
    )
  const points: [number, number][] = []
  for (let i = 0; i <= steps; i++) {
    const f = i / steps
    const a = Math.sin((1 - f) * d) / Math.sin(d)
    const b = Math.sin(f * d) / Math.sin(d)
    const x = a * Math.cos(lat1) * Math.cos(lon1) + b * Math.cos(lat2) * Math.cos(lon2)
    const y = a * Math.cos(lat1) * Math.sin(lon1) + b * Math.cos(lat2) * Math.sin(lon2)
    const z = a * Math.sin(lat1) + b * Math.sin(lat2)
    points.push([deg(Math.atan2(y, x)), deg(Math.atan2(z, Math.hypot(x, y)))])
  }
  return points
}

/** Punctul aflat la fracțiunea t (0..1) de-a lungul unei polilinii [lng, lat][]. */
export function pointAlong(line: [number, number][], t: number): [number, number] {
  const clamped = Math.min(Math.max(t, 0), 1)
  const seg: number[] = []
  let total = 0
  for (let i = 1; i < line.length; i++) {
    const l = Math.hypot(line[i][0] - line[i - 1][0], line[i][1] - line[i - 1][1])
    seg.push(l)
    total += l
  }
  let target = clamped * total
  for (let i = 0; i < seg.length; i++) {
    if (target <= seg[i] || i === seg.length - 1) {
      const f = seg[i] === 0 ? 0 : target / seg[i]
      const [a, b] = [line[i], line[i + 1]]
      return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f]
    }
    target -= seg[i]
  }
  return line[line.length - 1]
}

/** Direcția (grade, 0 = nord, sens orar) între două puncte [lng, lat]. */
export function bearing(a: [number, number], b: [number, number]): number {
  const [lon1, lat1, lon2, lat2] = [rad(a[0]), rad(a[1]), rad(b[0]), rad(b[1])]
  const y = Math.sin(lon2 - lon1) * Math.cos(lat2)
  const x =
    Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1)
  return (deg(Math.atan2(y, x)) + 360) % 360
}
