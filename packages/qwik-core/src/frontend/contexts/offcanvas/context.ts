import { createContextId, type QRL, type Signal } from '@builder.io/qwik'

export interface OffcanvasContextValue {
  isOpen: Signal<boolean>
  open: QRL<() => void>
  close: QRL<() => void>
  toggle: QRL<() => void>
}

export const OffcanvasContext = createContextId<OffcanvasContextValue>('gm.qwik-core.offcanvas')
