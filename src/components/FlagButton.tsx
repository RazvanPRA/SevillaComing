import { Box, chakra, Text } from '@chakra-ui/react'
import type { FlagVariant } from '../data/route'

interface FlagButtonProps {
  variant: FlagVariant
  name: string
  subtitle: string
  selected?: boolean
  onClick: () => void
}

const CLOTH = 'M6 4 C 16 0, 26 8, 42 4 L 42 30 C 26 34, 16 26, 6 30 Z'

function Cloth({ variant }: { variant: FlagVariant }) {
  const clip = `flag-clip-${variant}`
  return (
    <g className="flag-cloth">
      <defs>
        <clipPath id={clip}>
          <path d={CLOTH} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clip})`}>
        {variant === 'start' && (
          // Tricolorul României
          <>
            <rect x="6" y="0" width="12" height="36" fill="#002B7F" />
            <rect x="18" y="0" width="12" height="36" fill="#FCD116" />
            <rect x="30" y="0" width="12" height="36" fill="#CE1126" />
          </>
        )}
        {variant === 'stopover' && (
          <>
            <rect x="6" y="0" width="36" height="36" fill="#1d4ed8" />
            <text x="24" y="23" textAnchor="middle" fontSize="15" fill="white">
              ✈
            </text>
          </>
        )}
        {variant === 'finish' && (
          // Steagul Spaniei (roșu-galben-roșu)
          <>
            <rect x="6" y="0" width="36" height="36" fill="#AA151B" />
            <rect x="6" y="10" width="36" height="14" fill="#F1BF00" />
          </>
        )}
      </g>
      <path d={CLOTH} fill="none" stroke="rgba(0,0,0,.35)" strokeWidth="1" />
    </g>
  )
}

export function FlagButton({ variant, name, subtitle, selected, onClick }: FlagButtonProps) {
  return (
    <chakra.button
      type="button"
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
      aria-label={`${name} – ${subtitle}`}
      position="relative"
      display="block"
      w="46px"
      h="60px"
      cursor="pointer"
      transformOrigin="4px 100%"
      transition="transform .2s ease, filter .2s ease"
      transform={selected ? 'scale(1.25)' : 'scale(1)'}
      filter={
        selected
          ? 'drop-shadow(0 0 8px rgba(250, 204, 21, .9))'
          : 'drop-shadow(0 2px 3px rgba(0,0,0,.45))'
      }
      _hover={{ transform: 'scale(1.2)' }}
      _focusVisible={{ outline: '2px solid', outlineColor: 'yellow.400', outlineOffset: '2px' }}
    >
      <svg width="46" height="60" viewBox="0 0 46 60" aria-hidden>
        <rect x="3" y="1" width="3" height="57" rx="1.5" fill="#5b4326" />
        <circle cx="4.5" cy="2" r="2.5" fill="#d4a017" />
        <Cloth variant={variant} />
      </svg>
      <Box
        position="absolute"
        left="44px"
        top="4px"
        px="2"
        py="0.5"
        rounded="md"
        bg={selected ? 'yellow.300' : 'bg.panel'}
        color={selected ? 'gray.900' : 'fg'}
        shadow="md"
        whiteSpace="nowrap"
        textAlign="left"
        pointerEvents="none"
      >
        <Text fontWeight="bold" fontSize="sm" lineHeight="short">
          {name}
        </Text>
        <Text fontSize="2xs" opacity={0.8} lineHeight="short">
          {subtitle}
        </Text>
      </Box>
    </chakra.button>
  )
}
