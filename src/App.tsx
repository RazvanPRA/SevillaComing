import { Box, Flex, Heading, HStack, Text } from '@chakra-ui/react'
import { useState } from 'react'
import { Countdown } from './components/Countdown'
import { LanguageSwitcher } from './components/LanguageSwitcher'
import { LocationDrawer } from './components/LocationDrawer'
import { RouteMap } from './components/RouteMap'
import { ColorModeButton } from './components/ui/color-mode'
import type { StopId } from './data/route'
import { useNow } from './hooks/useNow'
import { useI18n } from './i18n/context'
import { currentPhase } from './lib/time'

export default function App() {
  const now = useNow()
  const phase = currentPhase(now)
  const [selected, setSelected] = useState<StopId | null>(null)
  const { t } = useI18n()

  return (
    <Flex direction="column" h="100dvh" bg="bg">
      <Flex
        as="header"
        px={{ base: '4', md: '6' }}
        py="3"
        gap="3"
        direction={{ base: 'column', md: 'row' }}
        align={{ base: 'stretch', md: 'center' }}
        justify="space-between"
        borderBottomWidth="1px"
        bg="bg.panel"
        zIndex="1"
      >
        <HStack justify="space-between" align="flex-start">
          <Box>
            <Heading size={{ base: 'lg', md: '2xl' }} fontWeight="black">
              Sevilla Coming ✈
            </Heading>
            <Text fontSize="sm" color="fg.muted">
              {t.route}
            </Text>
          </Box>
          <Box display={{ md: 'none' }}>
            <ColorModeButton />
          </Box>
        </HStack>
        <HStack gap="4" align="center">
          <Countdown now={now} phase={phase} />
          <Box display={{ base: 'none', md: 'block' }}>
            <ColorModeButton />
          </Box>
        </HStack>
      </Flex>

      <Box as="main" position="relative" flex="1">
        <RouteMap selected={selected} onSelect={setSelected} phase={phase} />
        <LanguageSwitcher />
      </Box>

      <LocationDrawer
        stopId={selected}
        open={selected !== null}
        now={now}
        onClose={() => setSelected(null)}
        onNavigate={setSelected}
      />
    </Flex>
  )
}
