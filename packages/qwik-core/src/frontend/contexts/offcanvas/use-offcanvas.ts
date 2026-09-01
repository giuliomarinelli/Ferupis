import { useContext } from '@builder.io/qwik'
import { OffcanvasContext } from './context'

export function useOffcanvas() {
  return useContext(OffcanvasContext)
}
