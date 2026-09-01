import { useContext } from '@builder.io/qwik'
import { OverlayContext } from './context'

export const useOverlay = () => {
  const overlay = useContext(OverlayContext, null)

  if (!overlay) {
    throw new Error(
      'useOverlay() must be called inside an Overlay or OverlayProvider.',
    )
  }

  return overlay
}
