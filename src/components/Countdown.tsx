import { Badge, Box, HStack, Progress, Stack, Text } from '@chakra-ui/react'
import { ARRIVAL, TZ_ES, TZ_RO } from '../data/route'
import { useI18n } from '../i18n/context'
import { formatClock, remaining, type Phase } from '../lib/time'

const pad = (n: number) => String(n).padStart(2, '0')

function Unit({ value, label }: { value: string | number; label: string }) {
  return (
    <Stack gap="0" align="center" minW={{ base: '11', md: '14' }}>
      <Text
        fontSize={{ base: 'xl', md: '3xl' }}
        fontWeight="black"
        fontVariantNumeric="tabular-nums"
        lineHeight="1"
      >
        {value}
      </Text>
      <Text fontSize="2xs" textTransform="uppercase" letterSpacing="wider" color="fg.muted">
        {label}
      </Text>
    </Stack>
  )
}

export function Countdown({ now, phase }: { now: number; phase: Phase }) {
  const { t, locale } = useI18n()
  const r = remaining(ARRIVAL, now)

  return (
    <Stack gap="2" align={{ base: 'stretch', md: 'flex-end' }}>
      {r.done ? (
        <Text fontSize={{ base: 'xl', md: '3xl' }} fontWeight="black">
          {t.done}
        </Text>
      ) : (
        <HStack gap={{ base: '1', md: '3' }} justify={{ base: 'center', md: 'flex-end' }}>
          <Unit value={r.days} label={t.units.days} />
          <Text fontSize="2xl" fontWeight="bold" color="fg.subtle">:</Text>
          <Unit value={pad(r.hours)} label={t.units.hours} />
          <Text fontSize="2xl" fontWeight="bold" color="fg.subtle">:</Text>
          <Unit value={pad(r.minutes)} label={t.units.minutes} />
          <Text fontSize="2xl" fontWeight="bold" color="fg.subtle">:</Text>
          <Unit value={pad(r.seconds)} label={t.units.seconds} />
        </HStack>
      )}
      <HStack gap="2" justify={{ base: 'center', md: 'flex-end' }} wrap="wrap">
        <Badge colorPalette="yellow" variant="solid">
          {t.phase[phase.kind]}
        </Badge>
        <Text fontSize="xs" color="fg.muted">
          {t.arrival(formatClock(ARRIVAL, TZ_ES, locale), formatClock(ARRIVAL, TZ_RO, locale))}
        </Text>
      </HStack>
      <Box w={{ base: 'full', md: '280px' }}>
        <Progress.Root value={Math.round(phase.progress * 100)} size="xs" colorPalette="orange">
          <Progress.Track>
            <Progress.Range />
          </Progress.Track>
        </Progress.Root>
      </Box>
    </Stack>
  )
}
