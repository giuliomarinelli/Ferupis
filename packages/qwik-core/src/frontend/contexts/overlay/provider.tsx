import { Slot, component$, useContextProvider } from '@builder.io/qwik'
import {
  OverlayContext,
  type OverlayStateProps,
} from './context'
import { useOverlayController } from './use-overlay-controller'

export type OverlayProviderProps = OverlayStateProps

export const OverlayProvider = component$<OverlayProviderProps>((props) => {
  const overlay = useOverlayController(props)
  useContextProvider(OverlayContext, overlay)

  return <Slot />
})
