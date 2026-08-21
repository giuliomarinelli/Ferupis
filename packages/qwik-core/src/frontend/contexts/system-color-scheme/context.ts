import { createContextId, type Signal } from '@builder.io/qwik'

export type SystemColorScheme = 'light' | 'dark'

export const SystemColorSchemeContext =
  createContextId<Signal<SystemColorScheme>>(
    'gm.qwik-core.system-color-scheme',
  )
