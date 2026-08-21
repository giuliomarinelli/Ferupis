import {
  Slot,
  component$,
  useContextProvider,
  useSignal,
  useStore,
  useVisibleTask$,
} from '@builder.io/qwik'
import { ThemeContext, type Theme, type ThemeChoice, type ThemeOwner, type ThemeState } from './context'
import { DEFAULT_THEME_COOKIE_NAME, DEFAULT_THEME_STORAGE_KEY } from './init-script'

function readCookieTheme(cookieName: string): Theme | null {
  if (typeof document === 'undefined') return null
  const raw = document.cookie
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${cookieName}=`))
    ?.split('=')[1]

  return raw === 'dark' || raw === 'light' ? raw : null
}

function writeCookieTheme(cookieName: string, theme: Theme | null) {
  if (typeof document === 'undefined') return
  if (!theme) {
    document.cookie = `${cookieName}=; path=/; max-age=0; samesite=lax`
  } else {
    document.cookie = `${cookieName}=${theme}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`
  }
}

function applyThemeDom(theme: Theme) {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  if (theme === 'dark') {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
}

function getOsTheme(): Theme {
  if (typeof window === 'undefined') return 'dark'
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

function loadStoredPreference(params: {
  storageKey: string
  cookieName: string
  defaultTheme: Theme
}): { owner: ThemeOwner; choice: ThemeChoice; theme: Theme } {
  const { storageKey, cookieName, defaultTheme } = params

  if (typeof window === 'undefined') {
    return { owner: 'OS', choice: 'OS', theme: defaultTheme }
  }

  const cookieTheme = readCookieTheme(cookieName)
  if (cookieTheme) {
    return { owner: 'User', choice: cookieTheme, theme: cookieTheme }
  }

  try {
    const raw = window.localStorage.getItem(storageKey)
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<ThemeState>
      const owner: ThemeOwner = parsed.owner === 'User' ? 'User' : 'OS'
      if (owner === 'OS') {
        const osTheme = getOsTheme()
        return { owner: 'OS', choice: 'OS', theme: osTheme }
      }
      if (parsed.choice === 'light' || parsed.choice === 'dark') {
        return { owner: 'User', choice: parsed.choice, theme: parsed.choice }
      }
    }
  } catch {
    // ignore invalid storage
  }

  const osTheme = getOsTheme()
  return { owner: 'OS', choice: 'OS', theme: osTheme }
}

type ThemeProviderProps = {
  cookieName?: string
  storageKey?: string
  defaultTheme?: Theme
}

export const ThemeProvider = component$<ThemeProviderProps>(
  ({
    cookieName = DEFAULT_THEME_COOKIE_NAME,
    storageKey = DEFAULT_THEME_STORAGE_KEY,
    defaultTheme = 'dark',
  }) => {
    const isClientThemeHydrated = useSignal(false)

    const state = useStore<ThemeState>(() => {
      const { owner, choice, theme } = loadStoredPreference({
        storageKey,
        cookieName,
        defaultTheme,
      })
      const osTheme = getOsTheme()
      return { owner, choice, theme, osTheme }
    })

    useContextProvider(ThemeContext, state)

    // eslint-disable-next-line qwik/no-use-visible-task
    useVisibleTask$(({ track }) => {
      if (!isClientThemeHydrated.value) {
        const { owner, choice, theme } = loadStoredPreference({
          storageKey,
          cookieName,
          defaultTheme,
        })
        state.owner = owner
        state.choice = choice
        state.theme = theme
        state.osTheme = getOsTheme()
        isClientThemeHydrated.value = true
      }

      track(() => state.theme)
      track(() => state.owner)
      track(() => state.choice)
      track(() => state.osTheme)

      applyThemeDom(state.theme)

      if (state.owner === 'User') {
        window.localStorage.setItem(
          storageKey,
          JSON.stringify({
            owner: state.owner,
            choice: state.choice,
            theme: state.theme,
          }),
        )
        writeCookieTheme(cookieName, state.theme)
      } else {
        window.localStorage.setItem(
          storageKey,
          JSON.stringify({
            owner: 'OS',
            choice: 'OS',
            theme: state.theme,
          }),
        )
        writeCookieTheme(cookieName, null)
      }

      const mql = window.matchMedia('(prefers-color-scheme: dark)')
      state.osTheme = mql.matches ? 'dark' : 'light'
      if (state.owner === 'OS') {
        state.theme = state.osTheme
        state.choice = 'OS'
      }

      const handleMqlChange = (ev: MediaQueryListEvent) => {
        state.osTheme = ev.matches ? 'dark' : 'light'
        if (state.owner === 'OS') {
          state.theme = state.osTheme
          state.choice = 'OS'
        }
      }

      mql.addEventListener('change', handleMqlChange)

      const handleStorage = (e: StorageEvent) => {
        if (e.key !== storageKey || !e.newValue) return
        try {
          const parsed = JSON.parse(e.newValue) as ThemeState
          state.owner = parsed.owner ?? 'OS'
          state.choice = parsed.choice ?? 'OS'
          state.theme = parsed.theme ?? getOsTheme()
        } catch {
          // ignore invalid storage payload
        }
      }

      window.addEventListener('storage', handleStorage)

      return () => {
        mql.removeEventListener('change', handleMqlChange)
        window.removeEventListener('storage', handleStorage)
      }
    })

    return <Slot />
  },
)
