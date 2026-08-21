import {
  $,
  useComputed$,
  useSignal,
} from '@builder.io/qwik'
import type {
  OverlayContextValue,
  OverlayStateProps,
} from './context'

const hasLocalStateConfiguration = (props: OverlayStateProps) =>
  props.open !== undefined ||
  props.defaultOpen !== undefined ||
  props.onOpenChange$ !== undefined

/**
 * Creates a local controller or reuses an inherited one when no state props
 * were supplied. Hooks are always called so this remains safe across renders.
 */
export const useOverlayController = (
  props: OverlayStateProps,
  inherited?: OverlayContextValue | null,
): OverlayContextValue => {
  const internalOpen = useSignal(props.defaultOpen ?? false)
  const effectiveOpen = useComputed$(() => props.open ?? internalOpen.value)

  const localController: OverlayContextValue = {
    open: effectiveOpen,
    open$: $(() => {
      if (effectiveOpen.value) return
      if (props.open === undefined) internalOpen.value = true
      void props.onOpenChange$?.(true)
    }),
    close$: $(() => {
      if (!effectiveOpen.value) return
      if (props.open === undefined) internalOpen.value = false
      void props.onOpenChange$?.(false)
    }),
    toggle$: $(() => {
      const nextOpen = !effectiveOpen.value
      if (props.open === undefined) internalOpen.value = nextOpen
      void props.onOpenChange$?.(nextOpen)
    }),
  }

  return inherited && !hasLocalStateConfiguration(props)
    ? inherited
    : localController
}
