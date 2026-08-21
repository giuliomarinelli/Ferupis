import { useContext } from '@builder.io/qwik'
import { SystemColorSchemeContext } from './context'

export function useSystemColorScheme() {
  return useContext(SystemColorSchemeContext)
}
