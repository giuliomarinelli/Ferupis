import { $, Slot, component$, useContextProvider, useSignal } from '@builder.io/qwik'
import { OffcanvasContext } from './context'

export const OffcanvasProvider = component$(() => {
  const isOpen = useSignal(false)

  useContextProvider(OffcanvasContext, {
    isOpen,
    open: $(() => {
      isOpen.value = true
    }),
    close: $(() => {
      if (typeof document !== 'undefined') {
        const activeElement = document.activeElement

        if (
          activeElement instanceof HTMLElement &&
          activeElement.closest('[data-offcanvas-panel]')
        ) {
          const toggleElement =
            document.querySelector<HTMLElement>('[data-offcanvas-toggle]')

          if (toggleElement) {
            toggleElement.focus()
          } else {
            activeElement.blur()
          }
        }
      }

      isOpen.value = false
    }),
    toggle: $(() => {
      if (isOpen.value && typeof document !== 'undefined') {
        const activeElement = document.activeElement

        if (
          activeElement instanceof HTMLElement &&
          activeElement.closest('[data-offcanvas-panel]')
        ) {
          const toggleElement =
            document.querySelector<HTMLElement>('[data-offcanvas-toggle]')

          if (toggleElement) {
            toggleElement.focus()
          } else {
            activeElement.blur()
          }
        }
      }

      isOpen.value = !isOpen.value
    }),
  })

  return <Slot />
})
