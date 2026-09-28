import { useEffect, useState } from 'react'

// Pentru testare: ?now=2026-10-20T08:00:00%2B03:00 pornește ceasul de la acel moment.
const offset = (() => {
  const param = new URLSearchParams(window.location.search).get('now')
  const t = param ? Date.parse(param) : NaN
  return Number.isNaN(t) ? 0 : t - Date.now()
})()

export const getNow = () => Date.now() + offset

export function useNow(intervalMs = 1000) {
  const [now, setNow] = useState(getNow)
  useEffect(() => {
    const id = setInterval(() => setNow(getNow()), intervalMs)
    return () => clearInterval(id)
  }, [intervalMs])
  return now
}
