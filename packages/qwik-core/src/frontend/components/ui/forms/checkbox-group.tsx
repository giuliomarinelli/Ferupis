import { component$, Slot, type QRL } from "@builder.io/qwik";

export type CheckboxGroupOption = Readonly<{
  id: string;
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
  exclusive?: boolean;
}>;

export type CheckboxGroupProps = Readonly<{
  name: string;
  values: readonly string[];
  options: readonly CheckboxGroupOption[];
  onChange$: QRL<(values: string[]) => void>;
  onTouched$?: QRL<() => void>;
  maximumSelections?: number;
  touched?: boolean;
  invalid?: boolean;
  errorMessage?: string;
  describedById?: string;
  labelledById?: string;
  class?: string;
  optionsClass?: string;
  optionClass?: string;
  optionSelectedClass?: string;
  optionInputClass?: string;
  optionLabelClass?: string;
  reserveErrorSpace?: boolean;
}>;

export const CheckboxGroup = component$<CheckboxGroupProps>((props) => {
  const showError = Boolean(
    props.touched && props.invalid && props.errorMessage,
  );
  const errorId = props.describedById ?? `${props.name}-error`;

  return (
    <fieldset
      class={["w-full", props.class]}
      aria-invalid={showError ? "true" : undefined}
      aria-labelledby={props.labelledById}
      aria-describedby={showError ? errorId : props.describedById}
    >
      <Slot name="header" />

      <div class={["mt-6", props.optionsClass ?? "space-y-6"]}>
        {props.options.map((option) => {
          const checked = props.values.includes(option.value);
          const atMaximum =
            typeof props.maximumSelections === "number" &&
            props.values.length >= props.maximumSelections;
          const disabled = Boolean(
            option.disabled || (!checked && atMaximum && !option.exclusive),
          );

          return (
            <label
              key={option.id}
              for={option.id}
              class={[
                "flex min-w-0 cursor-pointer items-center gap-4",
                disabled && "cursor-not-allowed opacity-60",
                props.optionClass,
                checked && props.optionSelectedClass,
              ]}
            >
              <div class="group grid shrink-0 grid-cols-1">
                <input
                  id={option.id}
                  type="checkbox"
                  name={props.name}
                  value={option.value}
                  checked={checked}
                  disabled={disabled}
                  onChange$={(_, element) => {
                    const withoutExclusive = props.values.filter(
                      (value) =>
                        !props.options.find((item) => item.value === value)
                          ?.exclusive,
                    );
                    const nextValues = element.checked
                      ? option.exclusive
                        ? [option.value]
                        : [...withoutExclusive, option.value]
                      : props.values.filter((value) => value !== option.value);
                    props.onChange$(nextValues);
                  }}
                  onBlur$={() => props.onTouched$?.()}
                  class={[
                    "col-start-1 row-start-1 size-4 cursor-pointer appearance-none rounded-sm border bg-white",
                    "transition-colors duration-150 ease-out",
                    "border-slate-300 hover:border-indigo-500",
                    "checked:border-indigo-600 checked:bg-indigo-600 checked:hover:border-indigo-700 checked:hover:bg-indigo-700",
                    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600",
                    "disabled:cursor-not-allowed disabled:border-slate-300 disabled:bg-slate-100 disabled:checked:bg-slate-100",
                    "dark:border-slate-400/80 dark:bg-slate-950/35 dark:hover:border-indigo-400",
                    "dark:checked:border-indigo-500 dark:checked:bg-indigo-500 dark:checked:hover:border-indigo-400 dark:checked:hover:bg-indigo-400",
                    "dark:focus-visible:outline-indigo-500",
                    "dark:disabled:border-white/5 dark:disabled:bg-white/10 dark:disabled:checked:bg-white/10",
                    "forced-colors:appearance-auto",
                    props.optionInputClass,
                  ]}
                />
                <svg
                  viewBox="0 0 14 14"
                  fill="none"
                  class="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-disabled:stroke-slate-950/25 group-has-checked:opacity-100 dark:group-has-disabled:stroke-white/25"
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
              <span
                class={[
                  "block min-w-0 cursor-pointer text-sm/6 font-medium text-slate-900 dark:text-white",
                  disabled && "cursor-not-allowed",
                  props.optionLabelClass,
                ]}
              >
                <span class="block">{option.label}</span>
                {option.description && (
                  <span class="mt-1 block text-sm/5 font-normal text-slate-600 dark:text-slate-300">
                    {option.description}
                  </span>
                )}
              </span>
            </label>
          );
        })}
      </div>

      <div
        id={showError ? errorId : undefined}
        class={[
          "grid overflow-hidden text-sm font-medium text-light-error transition-[grid-template-rows,margin,opacity] duration-200 ease-out dark:text-bright-error",
          showError
            ? "mt-2 grid-rows-[1fr] opacity-100"
            : props.reserveErrorSpace === false
              ? "mt-0 grid-rows-[0fr] opacity-0"
              : "mt-2 grid-rows-[1fr] opacity-0",
        ]}
        role="status"
        aria-live="polite"
      >
        <span class="min-h-0 overflow-hidden">
          {showError ? props.errorMessage : ""}
        </span>
      </div>
    </fieldset>
  );
});
