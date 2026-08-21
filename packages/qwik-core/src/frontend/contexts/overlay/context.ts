import {
  createContextId,
  type QRL,
  type ReadonlySignal,
} from '@builder.io/qwik'

export type OverlayStateProps = {
  /** Controlled open state. */
  open?: boolean
  /** Initial state used only when the overlay owns its state. */
  defaultOpen?: boolean
  /** Called whenever an action requests a different open state. */
  onOpenChange$?: QRL<(open: boolean) => void>
}

export interface OverlayContextValue {
  open: ReadonlySignal<boolean>
  open$: QRL<() => void>
  close$: QRL<() => void>
  toggle$: QRL<() => void>
}

export const OverlayContext = createContextId<OverlayContextValue>(
  'gm.qwik-core.overlay',
)
