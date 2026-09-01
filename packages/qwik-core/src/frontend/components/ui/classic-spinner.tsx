import { component$, useStylesScoped$ } from '@builder.io/qwik'


export interface ClassicSpinnerProps {
    /**
     * Dimensione in px.
     */
    size?: number

    /**
     * Spessore della traccia.
     */
    stroke?: number

    /**
     * Colore custom.
     * Se non passato, usa currentColor.
     */
    color?: string | null

    /**
     * Testo visibile mostrato sotto lo spinner.
     */
    label?: string

    /**
     * Label accessibile per screen reader.
     */
    ariaLabel?: string

    /**
     * Variante overlay centrata.
     */
    overlay?: boolean
}

const styles = `
  .app-spinner-host {
    display: inline-block;
    line-height: 0;
  }

  .app-spinner {
    position: relative;
    display: inline-grid;
    justify-items: center;
    gap: 0.625rem;
    color: inherit;
    line-height: 1;
  }

  .app-spinner__sr {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  .app-spinner__svg {
    display: block;
    animation: app-spinner-rotate 850ms linear infinite;
    transform-origin: 50% 50%;
    transform-box: fill-box;
    will-change: transform;
  }

  @keyframes app-spinner-rotate {
    from {
      transform: rotate(0deg);
    }

    100% {
      transform: rotate(360deg);
    }
  }

  .app-spinner__label {
    color: currentColor;
    font-size: 0.875rem;
    font-weight: 500;
    line-height: 1.25;
    text-align: center;
    white-space: normal;
  }

  .app-spinner__track {
    stroke: currentColor;
    opacity: .15;
  }

  .app-spinner__arc {
    stroke: currentColor;
    stroke-dasharray: 18 126;
    stroke-dashoffset: 0;
    animation: app-spinner-arc-length 1.35s cubic-bezier(0.45, 0, 0.55, 1) infinite alternate;
  }

  @keyframes app-spinner-arc-length {
    from {
      stroke-dasharray: 18 126;
    }

    to {
      stroke-dasharray: 94 126;
    }
  }

  .app-spinner--overlay {
    position: absolute;
    inset: 0;
    display: grid;
    place-items: center;
    align-content: center;
    background: transparent;
    pointer-events: none;
  }

  @media (prefers-reduced-motion: reduce) {
    .app-spinner__svg {
      animation-duration: 3s;
    }

    .app-spinner__arc {
      animation-duration: 2.7s;
    }
  }
`

export const ClassicSpinner = component$<ClassicSpinnerProps>((props) => {
    useStylesScoped$(styles)

    const size = props.size ?? 40
    const stroke = props.stroke ?? 3.6
    const ariaLabel = props.ariaLabel ?? 'Caricamento…'
    const color = typeof props.color === 'string' && props.color.trim()
        ? props.color
        : undefined
    const label = typeof props.label === 'string' ? props.label.trim() : ''
    const statusLabel = label || ariaLabel

    return (
        <span class="app-spinner-host">
            <span
                class={[
                    'app-spinner',
                    {
                        'app-spinner--overlay': props.overlay
                    }
                ]}
                style={color ? { color } : undefined}
                role="status"
                aria-label={statusLabel}
            >
                <svg
                    class="app-spinner__svg"
                    width={size}
                    height={size}
                    viewBox="0 0 50 50"
                    focusable="false"
                    aria-hidden="true"
                >
                    <circle
                        class="app-spinner__track"
                        cx="25"
                        cy="25"
                        r="20"
                        stroke-width={stroke}
                        fill="none"
                    />

                    <circle
                        class="app-spinner__arc"
                        cx="25"
                        cy="25"
                        r="20"
                        stroke-width={stroke}
                        fill="none"
                        stroke-linecap="round"
                    />
                </svg>

                {label && <span class="app-spinner__label">{label}</span>}

                <span class="app-spinner__sr">{statusLabel}</span>
            </span>
        </span>
    )
})
