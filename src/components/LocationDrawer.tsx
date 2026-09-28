import {
  Badge,
  Button,
  CloseButton,
  Drawer,
  HStack,
  Link,
  Portal,
  Stack,
  Text,
  Timeline,
} from '@chakra-ui/react'
import { LuCheck, LuClock, LuExternalLink, LuMapPin } from 'react-icons/lu'
import { EVENTS, googleMapsUrl, STOP_ORDER, STOPS, TZ_ES, type StopId } from '../data/route'
import { useI18n } from '../i18n/context'
import { formatClock, formatDate, relative } from '../lib/time'

interface LocationDrawerProps {
  stopId: StopId | null
  open: boolean
  now: number
  onClose: () => void
  onNavigate: (id: StopId) => void
}

export function LocationDrawer({ stopId, open, now, onClose, onNavigate }: LocationDrawerProps) {
  const { t, locale } = useI18n()
  const stop = stopId ? STOPS[stopId] : null
  const text = stopId ? t.stops[stopId] : null
  const events = EVENTS.filter((e) => e.stop === stopId)
  const index = stopId ? STOP_ORDER.indexOf(stopId) : -1
  const prev = STOP_ORDER[index - 1]
  const next = STOP_ORDER[index + 1]

  return (
    <Drawer.Root
      open={open}
      onOpenChange={(e) => !e.open && onClose()}
      placement="end"
      size="sm"
      modal={false}
      closeOnInteractOutside={false}
    >
      <Portal>
        <Drawer.Positioner pointerEvents="none">
          <Drawer.Content pointerEvents="auto">
            {stop && text && (
              <>
                <Drawer.Header flexDirection="column" alignItems="flex-start" gap="1">
                  <Badge
                    colorPalette={
                      stop.variant === 'start' ? 'blue' : stop.variant === 'finish' ? 'red' : 'cyan'
                    }
                  >
                    {text.tag}
                  </Badge>
                  <Drawer.Title fontSize="2xl">{text.name}</Drawer.Title>
                  <Text color="fg.muted" fontSize="sm">
                    {text.subtitle}
                  </Text>
                  <Text color="fg.muted" fontSize="xs">
                    {formatDate(events[0].time, stop.timeZone, locale)} ·{' '}
                    {stop.timeZone === TZ_ES ? t.tzEs : t.tzRo}
                  </Text>
                </Drawer.Header>

                <Drawer.Body>
                  <Timeline.Root size="lg" variant="subtle">
                    {events.map((ev) => {
                      const time = new Date(ev.time).getTime()
                      const past = time <= now
                      return (
                        <Timeline.Item key={ev.id}>
                          <Timeline.Connector>
                            <Timeline.Separator />
                            <Timeline.Indicator
                              bg={past ? 'green.500' : 'orange.400'}
                              color="white"
                            >
                              {past ? <LuCheck /> : <LuClock />}
                            </Timeline.Indicator>
                          </Timeline.Connector>
                          <Timeline.Content gap="1" pb="6">
                            <HStack gap="2">
                              <Text fontWeight="black" fontSize="xl" fontVariantNumeric="tabular-nums">
                                {formatClock(ev.time, ev.timeZone, locale)}
                              </Text>
                              <Badge size="sm" colorPalette={past ? 'green' : 'orange'} variant="subtle">
                                {relative(time, now, t)}
                              </Badge>
                            </HStack>
                            <Timeline.Title fontSize="md">{t.events[ev.id].title}</Timeline.Title>
                            <Timeline.Description>{t.events[ev.id].description}</Timeline.Description>
                            <Link
                              href={googleMapsUrl(ev.coords)}
                              target="_blank"
                              rel="noreferrer"
                              fontSize="xs"
                              color="fg.muted"
                            >
                              <LuMapPin /> {t.events[ev.id].place} · {ev.coords[0].toFixed(6)},{' '}
                              {ev.coords[1].toFixed(6)} <LuExternalLink />
                            </Link>
                          </Timeline.Content>
                        </Timeline.Item>
                      )
                    })}
                  </Timeline.Root>
                </Drawer.Body>

                <Drawer.Footer justifyContent="space-between">
                  <Stack direction="row" gap="2">
                    {prev && (
                      <Button size="sm" variant="outline" onClick={() => onNavigate(prev)}>
                        ← {t.stops[prev].name}
                      </Button>
                    )}
                  </Stack>
                  {next && (
                    <Button size="sm" colorPalette="orange" onClick={() => onNavigate(next)}>
                      {t.stops[next].name} →
                    </Button>
                  )}
                </Drawer.Footer>

                <Drawer.CloseTrigger asChild>
                  <CloseButton size="sm" />
                </Drawer.CloseTrigger>
              </>
            )}
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  )
}
