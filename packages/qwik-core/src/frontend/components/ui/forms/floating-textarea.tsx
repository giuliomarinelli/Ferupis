import {
    $,
    component$,
    type QRL,
    type Signal,
    useSignal
} from '@builder.io/qwik'
import { ClassicSpinner } from '../classic-spinner'


type ErrorMap = Record<string, string>
type ValidationErrors = Record<string, unknown> | null | undefined

type ResizeMode = 'none' | 'vertical' | 'horizontal' | 'both'

export interface FloatingTextareaProps {
    label: string
    id?: string
    name?: string

    value?: string
    disabled?: boolean
    readonly?: boolean

    rows?: number
    maxLength?: number
    minLength?: number
    placeholder?: string
    resize?: ResizeMode

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

    textareaRef?: Signal<HTMLTextAreaElement | undefined>

    onInput$?: QRL<(value: string) => void>
    onBlur$?: QRL<() => void>
    onFocus$?: QRL<() => void>
    onCtrlEnter$?: QRL<() => void>
}

export const FloatingTextarea = component$<FloatingTextareaProps>((props) => {
    const internalId = useSignal(`fta-${Math.random().toString(36).slice(2)}`)
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

    const resizeClass = (() => {
        switch (props.resize ?? 'vertical') {
            case 'none':
                return 'resize-none'
            case 'horizontal':
                return 'resize-x'
            case 'both':
                return 'resize'
            case 'vertical':
            default:
                return 'resize-y'
        }
    })()

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
        const target = event.target as HTMLTextAreaElement
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

    const handleKeyDown$ = $(async (event: KeyboardEvent) => {
        if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
            await props.onCtrlEnter$?.()
        }
    })

    const isDisabled = Boolean(props.disabled)

    return (
        <div class={['m-floating-field', bgClass, darkBgClass]}>
            <div class="m-floating-field-bg" />

            <textarea
                ref={props.textareaRef}
                id={id}
                name={props.name}
                placeholder={props.placeholder ?? ' '}
                disabled={props.disabled}
                readOnly={props.readonly}
                rows={props.rows ?? 5}
                maxLength={props.maxLength}
                minLength={props.minLength}
                value={currentValue}
                class={[
                    'm-floating-input-element',
                    'min-h-35 leading-6',
                    'pt-5 pb-4',
                    resizeClass,
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
                    isDisabled ? 'opacity-40 cursor-not-allowed' : '',
                    props.readonly ? 'cursor-default' : ''
                ]}
                onFocus$={handleFocus$}
                onBlur$={handleBlur$}
                onInput$={handleInput$}
                onKeyDown$={handleKeyDown$}
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
                        : 'm-floating-label--inactive',
                    isDisabled ? 'opacity-45' : ''
                ]}
            >
                {props.label}
            </label>

            <div
                id={hasError ? props.describedById ?? `${id}-error` : undefined}
                class={[
                    'mt-1 min-h-5 flex items-center justify-between gap-3 text-sm text-light-error relative z-10',
                    darkTextErrorClass,
                    'font-medium'
                ]}
                role="status"
                aria-live="polite"
            >
                <span>{currentError}</span>

                <span class="ml-auto flex items-center gap-3">
                    {props.maxLength && (
                        <span
                            class={[
                                'text-xs font-normal text-slate-500 dark:text-slate-400',
                                currentValue.length > props.maxLength ? 'text-light-error dark:text-bright-error' : ''
                            ]}
                        >
                            {currentValue.length}/{props.maxLength}
                        </span>
                    )}

                    {props.pending && (
                        <span class="text-light-on-surface-secondary dark:text-slate-200">
                            <ClassicSpinner size={15} />
                        </span>
                    )}
                </span>
            </div>
        </div>
    )
})
