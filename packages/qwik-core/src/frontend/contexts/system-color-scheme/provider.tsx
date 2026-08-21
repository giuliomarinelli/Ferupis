import {
  $,
  Slot,
  component$,
  useContextProvider,
  useOnDocument,
  useSignal,
  useVisibleTask$,
} from '@builder.io/qwik'
import {
  SystemColorSchemeContext,
  type SystemColorScheme,
} from './context'

const DARK_MODE_MEDIA_QUERY = '(prefers-color-scheme: dark)'
const FAVICON_SELECTOR =
  'link[rel~="icon"][data-system-color-scheme-favicon]'
const FAVICON_BASE_HREF_ATTRIBUTE =
  'data-system-color-scheme-favicon-base-href'

function getSystemColorScheme(): SystemColorScheme {
  return window.matchMedia(DARK_MODE_MEDIA_QUERY).matches ? 'dark' : 'light'
}

function reloadAdaptiveFavicons(colorScheme: SystemColorScheme) {
  const favicons = document.querySelectorAll<HTMLLinkElement>(FAVICON_SELECTOR)

  for (const favicon of favicons) {
    const baseHref =
      favicon.getAttribute(FAVICON_BASE_HREF_ATTRIBUTE) ??
      favicon.getAttribute('href')

    if (!baseHref) continue

    favicon.setAttribute(FAVICON_BASE_HREF_ATTRIBUTE, baseHref)

    const nextUrl = new URL(baseHref, document.baseURI)
    nextUrl.searchParams.set('color-scheme', colorScheme)
    const nextHref = nextUrl.toString()

    if (favicon.href !== nextHref) favicon.href = nextHref
  }
}

export const SystemColorSchemeProvider = component$(() => {
  const colorScheme = useSignal<SystemColorScheme>('light')

  useContextProvider(SystemColorSchemeContext, colorScheme)

  useOnDocument(
    'visibilitychange',
    $(() => {
      if (document.visibilityState !== 'visible') return

      const nextColorScheme = getSystemColorScheme()
      if (colorScheme.value !== nextColorScheme) {
        colorScheme.value = nextColorScheme
      }
    }),
  )

  // The MediaQueryList API and favicon DOM update are browser-only effects.
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(
    ({ cleanup, track }) => {
      const currentColorScheme = track(() => colorScheme.value)
      const mediaQuery = window.matchMedia(DARK_MODE_MEDIA_QUERY)
      const detectedColorScheme: SystemColorScheme = mediaQuery.matches
        ? 'dark'
        : 'light'

      if (currentColorScheme !== detectedColorScheme) {
        colorScheme.value = detectedColorScheme
      } else {
        reloadAdaptiveFavicons(currentColorScheme)
      }

      const handleChange = (event: MediaQueryListEvent) => {
        colorScheme.value = event.matches ? 'dark' : 'light'
      }

      mediaQuery.addEventListener('change', handleChange)
      cleanup(() => mediaQuery.removeEventListener('change', handleChange))
    },
    { strategy: 'document-ready' },
  )

  return <Slot />
})
