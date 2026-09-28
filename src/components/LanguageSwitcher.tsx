import { Button, Stack } from '@chakra-ui/react'
import { useI18n } from '../i18n/context'
import { LANGS } from '../i18n/translations'

export function LanguageSwitcher() {
  const { lang, setLang, t } = useI18n()

  return (
    <Stack
      role="group"
      aria-label={t.language}
      position="absolute"
      top="3"
      left="3"
      zIndex="5"
      gap="1"
      p="1"
      rounded="lg"
      bg="bg.panel"
      shadow="md"
    >
      {LANGS.map((l) => (
        <Button
          key={l.code}
          size="xs"
          minW="10"
          fontWeight="bold"
          variant={lang === l.code ? 'solid' : 'ghost'}
          colorPalette={lang === l.code ? 'orange' : 'gray'}
          aria-pressed={lang === l.code}
          title={l.name}
          lang={l.code}
          onClick={() => setLang(l.code)}
        >
          {l.label}
        </Button>
      ))}
    </Stack>
  )
}
