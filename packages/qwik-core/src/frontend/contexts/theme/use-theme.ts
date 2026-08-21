import { $, useContext } from '@builder.io/qwik'
import { ThemeContext, type ThemeChoice, type Theme } from './context'

export function useTheme() {
  const state = useContext(ThemeContext)

  const setTheme = $((choice: ThemeChoice) => {
    const getOsTheme = (): Theme =>
      window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'

    if (choice === 'OS') {
      state.owner = 'OS'
      state.choice = 'OS'
      state.osTheme = getOsTheme()
      state.theme = state.osTheme
    } else {
      state.owner = 'User'
      state.choice = choice
      state.theme = choice
    }
  })

  return {
    state,
    setTheme,
  }
}
