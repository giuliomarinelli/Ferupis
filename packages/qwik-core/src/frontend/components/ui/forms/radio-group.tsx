import { component$, Slot, type QRL } from '@builder.io/qwik'

export type RadioGroupOption = {
  id: string;
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
};

export type RadioGroupProps = {
  name: string;
  value: string | null;
  options: RadioGroupOption[];
  onChange$: QRL<(value: string) => void>;
  onTouched$?: QRL<() => void>;

  required?: boolean;
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
};

export const RadioGroup = component$<RadioGroupProps>((props) => {
  const {
    name,
    value,
    options,
    onChange$,
    onTouched$,
    optionsClass,
    optionClass,
    optionSelectedClass,
    optionInputClass,
    optionLabelClass,
  } = props;

  const showError = Boolean(
    props.touched && props.invalid && props.errorMessage,
  );
  const errorId = props.describedById ?? `${name}-error`;

  return (
    <fieldset
      class={["w-full", props.class]}
      aria-invalid={showError ? "true" : undefined}
      aria-labelledby={props.labelledById}
      aria-describedby={showError ? errorId : props.describedById}
    >
      <Slot name="header" />

      <div class={["mt-6", optionsClass ?? "space-y-6"]}>
        {options.map((option) => {
          const checked = option.value === value;
          const disabled = Boolean(option.disabled);

          return (
            <label
              key={option.id}
              for={option.id}
              class={[
                "flex min-w-0 cursor-pointer items-center gap-4",
                disabled && "cursor-not-allowed opacity-60",
                optionClass,
                checked && optionSelectedClass,
              ]}
            >
              <input
                id={option.id}
                type="radio"
                name={name}
                value={option.value}
                checked={checked}
                disabled={disabled}
                required={props.required}
                onChange$={() => onChange$(option.value)}
                onBlur$={() => onTouched$?.()}
                class={[
                  "relative size-4 shrink-0 cursor-pointer appearance-none rounded-full border bg-white",
                  "before:absolute before:inset-1 before:rounded-full before:bg-white not-checked:before:hidden",
                  "transition-colors duration-150 ease-out",
                  "border-slate-300 hover:border-indigo-500",
                  "checked:border-indigo-600 checked:bg-indigo-600 checked:hover:border-indigo-700 checked:hover:bg-indigo-700",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600",
                  "disabled:cursor-not-allowed disabled:border-slate-300 disabled:bg-slate-100 disabled:before:bg-slate-400",
                  "dark:border-slate-400/80 dark:bg-slate-950/35 dark:hover:border-indigo-400",
                  "dark:checked:border-indigo-500 dark:checked:bg-indigo-500 dark:checked:hover:border-indigo-400 dark:checked:hover:bg-indigo-400",
                  "dark:focus-visible:outline-indigo-500",
                  "dark:disabled:border-white/5 dark:disabled:bg-white/10 dark:disabled:before:bg-white/20",
                  "forced-colors:appearance-auto forced-colors:before:hidden",
                  optionInputClass,
                ]}
              />
              <span
                class={[
                  "block min-w-0 cursor-pointer text-sm/6 font-medium text-slate-900 dark:text-white",
                  disabled && "cursor-not-allowed",
                  optionLabelClass,
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
          "grid overflow-hidden text-light-error text-sm font-medium transition-[grid-template-rows,margin,opacity] duration-200 ease-out dark:text-bright-error",
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
