import type { Theme } from './context'

type ThemeInitScriptOptions = {
  cookieName?: string
  defaultTheme?: Theme
}

export const DEFAULT_THEME_STORAGE_KEY = 'tw_theme_pref'
export const DEFAULT_THEME_COOKIE_NAME = 'theme'

export const createThemeInitScript = (options: ThemeInitScriptOptions = {}) => {
  const cookieName = options.cookieName ?? DEFAULT_THEME_COOKIE_NAME
  const defaultTheme = options.defaultTheme ?? 'dark'

  return `
    (function () {
      try {
        function readCookieTheme() {
          const raw = document.cookie
            .split(';')
            .map((part) => part.trim())
            .find((part) => part.startsWith(${JSON.stringify(cookieName + '=')}))
            ?.split('=')[1];
          return raw === 'dark' || raw === 'light' ? raw : null;
        }

        const cookieTheme = readCookieTheme();
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const resolved = cookieTheme ? cookieTheme : (prefersDark ? 'dark' : 'light');

        if (resolved === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      } catch {
        if (${JSON.stringify(defaultTheme)} === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    })();
  `.trim()
}
