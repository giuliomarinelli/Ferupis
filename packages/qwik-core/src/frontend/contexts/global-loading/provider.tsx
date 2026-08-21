import {
  $,
  Slot,
  component$,
  useContextProvider,
  useSignal,
} from '@builder.io/qwik'
import { GlobalLoadingContext } from './context'

export const GlobalLoadingProvider = component$(() => {
  const isLoading = useSignal(false)
  const label = useSignal('')

  useContextProvider(GlobalLoadingContext, {
    isLoading,
    label,
    startLoading: $((nextLabel?: string) => {
      if (typeof nextLabel === 'string' && nextLabel.trim()) {
        label.value = nextLabel
      }

      isLoading.value = true
    }),
    stopLoading: $(() => {
      isLoading.value = false
      label.value = ''
    }),
    toggleLoading: $(() => {
      isLoading.value = !isLoading.value
    }),
  })

  return <Slot />
})
