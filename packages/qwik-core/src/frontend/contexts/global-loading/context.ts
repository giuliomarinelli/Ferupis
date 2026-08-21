import { createContextId, type QRL, type Signal } from '@builder.io/qwik'


export interface GlobalLoadingContextValue {
  isLoading: Signal<boolean>
  label: Signal<string>
  startLoading: QRL<(label?: string) => void>
  stopLoading: QRL<() => void>
  toggleLoading: QRL<() => void>
}

export const GlobalLoadingContext =
  createContextId<GlobalLoadingContextValue>('premythic.global-loading')
