import {
  Slot,
  component$,
  useContext,
  useSignal,
  useStylesScoped$,
  useVisibleTask$,
  type ClassList,
} from '@builder.io/qwik'
import {
  OverlayContext,
  type OverlayStateProps,
} from '../../../contexts/overlay/context'
import { OverlayContextBoundary } from '../../../contexts/overlay/boundary'
import { useOverlayController } from '../../../contexts/overlay/use-overlay-controller'

export type OverlayVariant = 'dialog' | 'sheet'
export type OverlaySide = 'top' | 'right' | 'bottom' | 'left'

export type OverlayProps = OverlayStateProps & {
  variant: OverlayVariant
  side?: OverlaySide
  modal?: boolean
  ariaLabel?: string
  ariaLabelledby?: string
  ariaDescribedby?: string
  panelClass?: ClassList
}

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'area[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[contenteditable="true"]',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

const styles = `
  .overlay-root {
    position: fixed;
    inset: 0;
    z-index: var(--overlay-z-index, 1000);
    visibility: hidden;
    pointer-events: none;
    isolation: isolate;
    transition: visibility 0s linear var(--overlay-transition-duration, 220ms);
  }

  .overlay-root[data-state='open'] {
    visibility: visible;
    transition-delay: 0s;
  }

  .overlay-backdrop {
    position: absolute;
    inset: 0;
    z-index: 0;
    background: var(--overlay-backdrop-color, rgb(15 23 42 / 0.52));
    backdrop-filter: var(--overlay-backdrop-filter, blur(2px));
    opacity: 0;
    pointer-events: none;
    transition: opacity var(--overlay-transition-duration, 220ms) ease;
  }

  .overlay-root[data-state='open'] .overlay-backdrop {
    opacity: 1;
    pointer-events: auto;
  }

  .overlay-panel {
    box-sizing: border-box;
    position: fixed;
    z-index: 1;
    max-width: 100vw;
    max-height: 100dvh;
    overflow: auto;
    overscroll-behavior: contain;
    color: var(--overlay-color, CanvasText);
    background: var(--overlay-surface, Canvas);
    border: 1px solid var(--overlay-border-color, rgb(148 163 184 / 0.35));
    box-shadow: var(
      --overlay-shadow,
      0 24px 64px rgb(15 23 42 / 0.28)
    );
    opacity: 0;
    pointer-events: none;
    transition:
      opacity var(--overlay-transition-duration, 220ms) ease,
      transform var(--overlay-transition-duration, 220ms) ease;
    will-change: opacity, transform;
  }

  .overlay-root[data-state='open'] .overlay-panel {
    opacity: 1;
    pointer-events: auto;
  }

  .overlay-panel[data-variant='dialog'] {
    top: 50%;
    left: 50%;
    width: min(
      calc(100vw - var(--overlay-viewport-gutter, 2rem)),
      var(--overlay-dialog-max-width, 40rem)
    );
    max-height: calc(100dvh - var(--overlay-viewport-gutter, 2rem));
    border-radius: var(--overlay-border-radius, 0.75rem);
    transform: translate(-50%, -50%) scale(0.98);
  }

  .overlay-root[data-state='open'] .overlay-panel[data-variant='dialog'] {
    transform: translate(-50%, -50%) scale(1);
  }

  .overlay-panel[data-variant='sheet'][data-side='top'],
  .overlay-panel[data-variant='sheet'][data-side='bottom'] {
    left: 0;
    width: 100%;
    max-height: var(--overlay-sheet-max-height, min(85dvh, 48rem));
  }

  .overlay-panel[data-variant='sheet'][data-side='top'] {
    top: 0;
    border-radius: 0 0 var(--overlay-border-radius, 0.75rem)
      var(--overlay-border-radius, 0.75rem);
    transform: translateY(-100%);
  }

  .overlay-panel[data-variant='sheet'][data-side='bottom'] {
    bottom: 0;
    border-radius: var(--overlay-border-radius, 0.75rem)
      var(--overlay-border-radius, 0.75rem) 0 0;
    transform: translateY(100%);
  }

  .overlay-panel[data-variant='sheet'][data-side='left'],
  .overlay-panel[data-variant='sheet'][data-side='right'] {
    top: 0;
    width: min(100%, var(--overlay-sheet-max-width, 28rem));
    height: 100dvh;
  }

  .overlay-panel[data-variant='sheet'][data-side='left'] {
    left: 0;
    border-radius: 0 var(--overlay-border-radius, 0.75rem)
      var(--overlay-border-radius, 0.75rem) 0;
    transform: translateX(-100%);
  }

  .overlay-panel[data-variant='sheet'][data-side='right'] {
    right: 0;
    border-radius: var(--overlay-border-radius, 0.75rem) 0 0
      var(--overlay-border-radius, 0.75rem);
    transform: translateX(100%);
  }

  .overlay-root[data-state='open']
    .overlay-panel[data-variant='sheet'] {
    transform: translate(0);
  }

  @media (prefers-reduced-motion: reduce) {
    .overlay-root,
    .overlay-backdrop,
    .overlay-panel {
      transition-duration: 0.01ms;
    }
  }
`

const getFocusableElements = (panel: HTMLElement) =>
  Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    (element) =>
      element.tabIndex >= 0 &&
      !element.hasAttribute('disabled') &&
      element.getClientRects().length > 0,
  )

export const Overlay = component$<OverlayProps>((props) => {
  useStylesScoped$(styles)

  const inheritedOverlay = useContext(OverlayContext, null)
  const overlay = useOverlayController(props, inheritedOverlay)
  const panelRef = useSignal<HTMLElement>()

  // Modal focus, keyboard handling and scroll locking require browser APIs.
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(({ cleanup, track }) => {
    const isOpen = track(() => overlay.open.value)
    const isModal = track(() => props.modal ?? true)

    if (!isOpen) return

    const panel = panelRef.value
    if (!panel) return

    const previouslyFocused = document.activeElement
    const previousBodyOverflow = document.body.style.overflow
    let focusFrame: number | undefined

    if (isModal) {
      document.body.style.overflow = 'hidden'
      focusFrame = window.requestAnimationFrame(() => {
        const [firstFocusable] = getFocusableElements(panel)
        ;(firstFocusable ?? panel).focus()
      })
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !event.defaultPrevented) {
        event.preventDefault()
        void overlay.close$()
        return
      }

      if (!isModal || event.key !== 'Tab') return

      const focusableElements = getFocusableElements(panel)
      if (focusableElements.length === 0) {
        event.preventDefault()
        panel.focus()
        return
      }

      const firstFocusable = focusableElements[0]
      const lastFocusable = focusableElements[focusableElements.length - 1]
      const activeElement = document.activeElement

      if (event.shiftKey) {
        if (activeElement === firstFocusable || !panel.contains(activeElement)) {
          event.preventDefault()
          lastFocusable.focus()
        }
      } else if (
        activeElement === lastFocusable ||
        !panel.contains(activeElement)
      ) {
        event.preventDefault()
        firstFocusable.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    cleanup(() => {
      document.removeEventListener('keydown', handleKeyDown)
      if (focusFrame !== undefined) window.cancelAnimationFrame(focusFrame)

      if (isModal) {
        document.body.style.overflow = previousBodyOverflow
        if (
          previouslyFocused instanceof HTMLElement &&
          previouslyFocused.isConnected
        ) {
          previouslyFocused.focus()
        }
      }
    })
  })

  const isOpen = overlay.open.value
  const modal = props.modal ?? true
  const side = props.variant === 'sheet' ? (props.side ?? 'bottom') : undefined
  const dialogSemantics = modal || props.variant === 'dialog'

  return (
    <OverlayContextBoundary value={overlay}>
      <div
        class="overlay-root"
        data-state={isOpen ? 'open' : 'closed'}
        data-variant={props.variant}
        data-side={side}
        data-modal={modal ? 'true' : 'false'}
        inert={!isOpen}
      >
        {modal && (
          <div
            class="overlay-backdrop"
            data-state={isOpen ? 'open' : 'closed'}
            data-modal="true"
            aria-hidden="true"
            onClick$={overlay.close$}
          />
        )}

        <section
          ref={panelRef}
          class={['overlay-panel', props.panelClass]}
          data-state={isOpen ? 'open' : 'closed'}
          data-variant={props.variant}
          data-side={side}
          data-modal={modal ? 'true' : 'false'}
          role={dialogSemantics ? 'dialog' : undefined}
          aria-modal={modal ? 'true' : undefined}
          aria-label={props.ariaLabel}
          aria-labelledby={props.ariaLabelledby}
          aria-describedby={props.ariaDescribedby}
          tabIndex={modal ? -1 : undefined}
        >
          <Slot />
        </section>
      </div>
    </OverlayContextBoundary>
  )
})
