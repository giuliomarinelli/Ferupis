import { component$, useStylesScoped$, useVisibleTask$ } from '@builder.io/qwik'
import { useTheme } from '../../contexts/theme/use-theme'
import { ClassicSpinner } from '../ui/classic-spinner'
import { useGlobalLoading } from '../../contexts/global-loading/use-global-loading'

const styles = `
  .global-loading-overlay {
    position: fixed;
    inset: 0;
    z-index: 10000;

    display: grid;
    place-items: center;

    color: rgb(10 10 10);
    background: rgb(15 23 42 / 0.22);
    backdrop-filter: blur(2px);

    pointer-events: auto;
  }

  .global-loading-overlay--dark {
    color: rgb(248 250 252);
    background: rgb(2 6 23);
  }
`

export const GlobalLoadingOverlay = component$(() => {
  useStylesScoped$(styles)

  const { isLoading, label } = useGlobalLoading()
  const { state: themeState } = useTheme()

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(({ cleanup, track }) => {
    const loading = track(() => isLoading.value)

    document.body.toggleAttribute('aria-busy', loading)

    cleanup(() => {
      document.body.removeAttribute('aria-busy')
    })
  })

  if (!isLoading.value) return null

  const isDark = themeState.theme === 'dark'

  return (
    <section
      class={[
        'global-loading-overlay',
        { 'global-loading-overlay--dark': isDark },
      ]}
      aria-live="polite"
    >
      <ClassicSpinner
        size={64}
        stroke={4.2}
        ariaLabel="Caricamento"
        color={
          isDark
            ? 'var(--color-bright-primary)'
            : 'var(--color-light-primary)'
        }
        label={label.value}
      />
    </section>
  )
})
