import { component$, Slot, type QRL } from '@builder.io/qwik'

export type CheckboxLabelWeight = "strong" | "light"
export type CheckboxVariant = "plain" | "card"

export type CheckboxProps = {
    id: string
    name?: string
    checked: boolean

    required?: boolean
    disabled?: boolean

    labelWeight?: CheckboxLabelWeight
    variant?: CheckboxVariant

    invalid?: boolean
    errorMessage?: string
    reserveErrorSpace?: boolean

    onChange$: QRL<(checked: boolean) => void>

    class?: string
    inputClass?: string
}

export const Checkbox = component$<CheckboxProps>((props) => {
    const {
        id,
        name,
        checked,
        required = false,
        disabled = false,
        labelWeight = "strong",
        variant = "plain",
        invalid = false,
        errorMessage = "",
        reserveErrorSpace = true,
        onChange$,
    } = props

    const descriptionId = `${id}-description`
    const errorId = `${id}-error`
    const hasError = invalid && errorMessage.length > 0

    return (
        <div
            onClick$={(event, currentTarget) => {
                if (
                    variant !== "card" ||
                    disabled ||
                    (event.target as HTMLElement).closest("input, label")
                ) {
                    return
                }

                currentTarget.querySelector("input")?.focus()
                onChange$(!checked)
            }}
            class={[
                "w-full",
                variant === "card" && [
                    "cursor-pointer rounded-xl border p-4 transition-[background-color,border-color,box-shadow] duration-200",
                    checked
                        ? "border-indigo-600 bg-indigo-50 dark:border-indigo-300 dark:bg-indigo-950/35 dark:hover:border-indigo-100"
                        : "border-slate-300 bg-white hover:border-indigo-400 dark:border-slate-400/80 dark:bg-indigo-900/65 dark:hover:border-indigo-200",
                    invalid && "border-red-500 dark:border-red-300",
                    invalid && "border-red-500 dark:border-red-300",
                    disabled && "cursor-not-allowed",
                ],
                props.class,
            ]}
        >
            <div class="flex min-w-0 items-center gap-4">
                <div class="group grid shrink-0 grid-cols-1">
                        <input
                            id={id}
                            name={name ?? id}
                            type="checkbox"
                            checked={checked}
                            required={required}
                            disabled={disabled}
                            aria-invalid={invalid ? "true" : undefined}
                            aria-required={required ? "true" : undefined}
                            aria-describedby={hasError ? `${descriptionId} ${errorId}` : descriptionId}
                            onChange$={(_, currentTarget) => onChange$(currentTarget.checked)}
                            class={[
                                "col-start-1 row-start-1 size-4 cursor-pointer appearance-none rounded-sm border bg-white",
                                "transition-colors duration-150 ease-out",
                                "border-slate-300 hover:border-indigo-500",
                                "checked:border-indigo-600 checked:bg-indigo-600 checked:hover:border-indigo-700 checked:hover:bg-indigo-700",
                                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600",
                                "disabled:cursor-not-allowed disabled:border-slate-300 disabled:bg-slate-100 disabled:checked:bg-slate-100",
                                "dark:border-slate-400/80 dark:bg-indigo-950/35 dark:hover:border-indigo-200",
                                "dark:checked:border-indigo-500 dark:checked:bg-indigo-500 dark:checked:hover:border-indigo-400 dark:checked:hover:bg-indigo-400",
                                "dark:focus-visible:outline-indigo-500",
                                "dark:disabled:border-white/5 dark:disabled:bg-white/10 dark:disabled:checked:bg-white/10",
                                "forced-colors:appearance-auto",
                                props.inputClass,
                            ]}
                        />
                        <svg
                            viewBox="0 0 14 14"
                            fill="none"
                            class="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-disabled:stroke-slate-950/25 dark:group-has-disabled:stroke-white/25"
                            aria-hidden="true"
                        >
                            <path
                                d="M3 8L6 11L11 3.5"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                class="opacity-0 transition-opacity duration-150 group-has-checked:opacity-100"
                            />
                        </svg>
                </div>

                <div class="min-w-0 flex-1 text-sm/6">
                    <label
                        for={id}
                        class={[
                            "cursor-pointer",
                            disabled && "cursor-not-allowed opacity-60",
                            labelWeight === "strong"
                                ? "font-medium text-slate-900 dark:text-white"
                                : "font-normal text-slate-500 dark:text-slate-400"
                        ]}
                    >
                        <Slot name="label" />
                    </label>

                    <p
                        id={descriptionId}
                        class="mt-1 text-slate-500 empty:mt-0 empty:hidden dark:text-slate-400"
                    >
                        <Slot name="description" />
                    </p>
                </div>
            </div>

            <div
                id={hasError ? errorId : undefined}
                class={[
                    "grid overflow-hidden text-sm font-medium text-light-error transition-[grid-template-rows,margin,opacity] duration-200 ease-out dark:text-bright-error",
                    hasError
                        ? "mt-2 grid-rows-[1fr] opacity-100"
                        : reserveErrorSpace
                          ? "mt-2 grid-rows-[1fr] opacity-0"
                          : "mt-0 grid-rows-[0fr] opacity-0",
                ]}
                role="status"
                aria-live="polite"
            >
                <span class="min-h-0 overflow-hidden">{hasError ? errorMessage : ""}</span>
            </div>
        </div>
    )
})
