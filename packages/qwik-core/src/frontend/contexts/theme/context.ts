import { createContextId } from '@builder.io/qwik'

export type Theme = 'light' | 'dark'
export type ThemeOwner = 'OS' | 'User'
export type ThemeChoice = Theme | 'OS'

export interface ThemeState {
  theme: Theme
  owner: ThemeOwner
  choice: ThemeChoice
  osTheme: Theme
}

export const ThemeContext = createContextId<ThemeState>('gm.qwik-core.theme')
