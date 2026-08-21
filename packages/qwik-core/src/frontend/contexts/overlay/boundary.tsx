import {
  Slot,
  component$,
  useContextProvider,
} from '@builder.io/qwik'
import {
  OverlayContext,
  type OverlayContextValue,
} from './context'

type OverlayContextBoundaryProps = {
  value: OverlayContextValue
}

/** Internal boundary used by the standalone Overlay component. */
export const OverlayContextBoundary =
  component$<OverlayContextBoundaryProps>((props) => {
    useContextProvider(OverlayContext, props.value)
    return <Slot />
  })
