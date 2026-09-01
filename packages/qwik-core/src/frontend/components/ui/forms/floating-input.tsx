import {
    $,
    component$,
    type HTMLInputAutocompleteAttribute,
    type QRL,
    type Signal,
    useSignal
} from '@builder.io/qwik'
import { ClassicSpinner } from '../classic-spinner'


type InputType = 'text' | 'email' | 'password' | 'tel'
type InputAutocompleteAttribute =
    | HTMLInputAutocompleteAttribute
    | 'email'
    | 'tel'
    | 'tel-country-code'
    | 'tel-national'
    | 'mobile tel-country-code'
    | 'mobile tel-national'
type InputMode = 'none' | 'text' | 'tel' | 'url' | 'email' | 'numeric' | 'decimal' | 'search'

type ErrorMap = Record<string, string>
type ValidationErrors = Record<string, unknown> | null | undefined

export interface FloatingInputProps {
    label: string
    id?: string
    type?: InputType
    autocomplete: InputAutocompleteAttribute

    value?: string
    disabled?: boolean
    maxLength?: number
    minLength?: number
    pattern?: string
    inputMode?: InputMode

    touched?: boolean
    invalid?: boolean
    required?: boolean
    pending?: boolean

    validationErrors?: ValidationErrors
    errors?: ErrorMap
    serverError?: string | null
    describedById?: string

    bgClass?: string
    darkBgClass?: string
    labelClass?: string
    darkLabelClass?: string
    darkFocusRingClass?: string
    darkFocusBorderClass?: string
    darkTextErrorClass?: string

    inputRef?: Signal<HTMLInputElement | undefined>

    onInput$?: QRL<(value: string) => void>
    onBlur$?: QRL<() => void>
    onFocus$?: QRL<() => void>
    onEnter$?: QRL<() => void>
}

export const FloatingInput = component$<FloatingInputProps>((props) => {
    const internalId = useSignal(`fi-${Math.random().toString(36).slice(2)}`)
    const focused = useSignal(false)
    const internalValue = useSignal(props.value ?? '')

    const id = props.id ?? internalId.value
    const errors = props.errors ?? {}

    const currentValue = props.value ?? internalValue.value
    const hasValue = currentValue.trim().length > 0
    const activeLabel = focused.value || hasValue

    const bgClass = props.bgClass ?? 'bg-slate-50'
    const darkBgClass = props.darkBgClass ?? 'dark:bg-neutral-900'
    const labelClass = props.labelClass ?? 'text-light-accent'
    const darkLabelClass = props.darkLabelClass ?? 'dark:text-bright-accent'

    const darkFocusRingClass =
        props.darkFocusRingClass ?? 'dark:focus:ring-bright-primary'

    const darkFocusBorderClass =
        props.darkFocusBorderClass ?? 'dark:focus:border-bright-primary'

    const darkTextErrorClass = props.darkTextErrorClass ?? 'dark:text-bright-error'

    const getCurrentError = () => {
        if (props.serverError) return props.serverError

        if (!props.touched || !props.validationErrors) return ''

        const key = Object.keys(props.validationErrors)[0]

        return errors[key] ?? ''
    }

    const currentError = getCurrentError()
    const hasError = Boolean(currentError)

    const isInvalid = Boolean(props.touched && props.invalid)

    const ariaDescribedby = hasError
        ? props.describedById ?? `${id}-error`
        : props.describedById

    const handleInput$ = $((event: Event) => {
        const target = event.target as HTMLInputElement
        const nextValue = target.value

        internalValue.value = nextValue
        props.onInput$?.(nextValue)
    })

    const handleFocus$ = $(async () => {
        focused.value = true
        await props.onFocus$?.()
    })

    const handleBlur$ = $(async () => {
        focused.value = false
        await props.onBlur$?.()
    })

    const handleKeyUp$ = $(async (event: KeyboardEvent) => {
        if (event.key === 'Enter') {
            await props.onEnter$?.()
        }
    })

    const isDisabled = Boolean(props.disabled)
    return (
        <div class={['m-floating-field', 'w-full min-w-0', bgClass, darkBgClass]}>
            <div class="m-floating-field-bg" />

            <input
                ref={props.inputRef}
                id={id}
                type={props.type ?? 'text'}
                autoComplete={props.autocomplete as HTMLInputAutocompleteAttribute}
                placeholder=" "
                disabled={props.disabled}
                maxLength={props.maxLength}
                minLength={props.minLength}
                pattern={props.pattern}
                inputMode={props.inputMode}
                value={currentValue}
                class={[
                    'm-floating-input-element',
                    'text-neutral-950 dark:text-slate-50',
                    'border',
                    hasError
                        ? [
                            'border-light-error ring-1 ring-inset ring-light-error',
                            'focus:border-light-error focus:ring-light-error focus:outline-none',
                            'dark:border-bright-error dark:ring-bright-error',
                            'dark:focus:border-bright-error dark:focus:ring-bright-error'
                        ]
                        : [
                            'border-indigo-300 dark:border-indigo-200',
                            'focus:border-light-primary focus:ring-light-primary focus:outline-none focus:ring-1 focus:ring-inset',
                            'hover:border-indigo-500 dark:hover:border-indigo-300',
                            darkFocusBorderClass,
                            darkFocusRingClass
                        ],
                    isDisabled ? 'opacity-40' : '',
                ]}
                onFocus$={handleFocus$}
                onBlur$={handleBlur$}
                onInput$={handleInput$}
                onKeyUp$={handleKeyUp$}
                aria-invalid={isInvalid ? 'true' : undefined}
                aria-required={props.required ? 'true' : undefined}
                aria-describedby={ariaDescribedby}
            />

            <label
                for={id}
                class={[
                    'm-floating-label',
                    activeLabel
                        ? ['m-floating-label--active font-medium', labelClass, darkLabelClass]
                        : 'm-floating-label--inactive ',               
                    isDisabled ? 'opacity-45' : '' 
                ]}
            >
                {props.label}
            </label>

            <div
                id={hasError ? props.describedById ?? `${id}-error` : undefined}
                class={[
                    'mt-1 min-h-5 flex items-center gap-3 text-sm text-light-error relative z-10',
                    darkTextErrorClass,
                    'font-medium'
                ]}
                role="status"
                aria-live="polite"
            >
                <span>{currentError}</span>

                {props.pending && (
                    <div class="text-light-on-surface-secondary dark:text-slate-200">
                        <ClassicSpinner size={15} />
                    </div>
                )}
            </div>
        </div>
    )
})
