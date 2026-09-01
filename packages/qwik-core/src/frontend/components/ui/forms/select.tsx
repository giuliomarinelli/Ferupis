import {
  $,
  component$,
  type HTMLInputAutocompleteAttribute,
  type JSXOutput,
  type QRL,
  useComputed$,
  useId,
  useOnDocument,
  useSignal,
} from '@builder.io/qwik'
import { ClassicSpinner } from '../classic-spinner'

export type SelectPrimitiveValue = string | number | boolean;
export type SelectedValue<T extends SelectPrimitiveValue = string> = T | null;
export type SelectValue<T extends SelectPrimitiveValue = string> =
  SelectedValue<T>;
export type SelectOptionLayout = "stacked" | "inline";
export type SelectAutocompleteAttribute =
  | HTMLInputAutocompleteAttribute
  | (string & Record<never, never>);

type ErrorMap = Record<string, string>;
type ValidationErrors = Record<string, unknown> | null | undefined;

export interface Option<T extends SelectPrimitiveValue = string> {
  key?: string;
  label: string;
  value: SelectedValue<T>;
  description?: string | null;
  iconUrl?: string | null;
  iconAlt?: string | null;
  searchText?: string;
  autocompleteValue?: string;
}

export interface SelectProps<T extends SelectPrimitiveValue = string> {
  id?: string;
  name?: string;
  autocomplete?: SelectAutocompleteAttribute;
  label?: string;
  placeholder?: string;
  placeholderDescription?: string;
  hidePlaceholder?: boolean;
  options?: Option<T>[];

  value?: SelectedValue<T>;
  selectedOptionKey?: string | null;

  disabled?: boolean;
  containerClass?: string;
  maxHeight?: number;

  touched?: boolean;
  invalid?: boolean;
  required?: boolean;
  pending?: boolean;

  validationErrors?: ValidationErrors;
  errors?: ErrorMap;
  serverError?: string | null;
  describedById?: string;

  textClass?: string;
  darkTextClass?: string;
  darkFocusClassList?: string[];
  darkTextErrorClass?: string;

  showSelectedDescription?: boolean;
  optionLayout?: SelectOptionLayout;
  publicBase?: string;

  searchable?: boolean;
  searchPlaceholder?: string;
  noResultsText?: string;

  onChange$?: QRL<(value: SelectedValue<T>, option: Option<T> | null) => void>;
  onTouched$?: QRL<() => void>;
}

const normalizeSearchText = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase();

const getOptionKey = <T extends SelectPrimitiveValue>(
  option: Option<T>,
  index: number,
) => option.key ?? `${index}-${typeof option.value}-${String(option.value)}`;

const optionsMatch = <T extends SelectPrimitiveValue>(
  left: Option<T>,
  right: Option<T>,
) =>
  left.key !== undefined && right.key !== undefined
    ? left.key === right.key
    : left === right;

const getAutocompleteValue = <T extends SelectPrimitiveValue>(
  option: Option<T>,
) => option.autocompleteValue ?? String(option.value ?? "");

type SelectComponent = <T extends SelectPrimitiveValue = string>(
  props: SelectProps<T>,
) => JSXOutput;

export const Select = component$((props: SelectProps<SelectPrimitiveValue>) => {
  const rootRef = useSignal<HTMLElement>();
  const generatedId = useId();

  const opened = useSignal(false);
  const highlighted = useSignal(-1);
  const listboxPointerActive = useSignal(false);
  const internalValue = useSignal<SelectedValue<SelectPrimitiveValue>>(
    props.value ?? null,
  );
  const internalOptionKey = useSignal<string | null>(
    props.selectedOptionKey ?? null,
  );
  const unresolvedInputValue = useSignal("");
  const searchQuery = useSignal("");
  const typeaheadBuffer = useSignal("");
  const lastTypeaheadAt = useSignal(0);

  const id = props.id ?? `m-select-${generatedId}`;
  const errors = props.errors ?? {};

  const options = useComputed$(() => props.options ?? []);
  const placeholder = useComputed$(() => props.placeholder ?? "Seleziona…");
  const hidePlaceholder = props.hidePlaceholder ?? false;
  const disabled = props.disabled ?? false;
  const searchable = props.searchable ?? false;

  const optionLayout = props.optionLayout ?? "stacked";
  const inlineOptionLayout = optionLayout === "inline";

  const containerClass =
    props.containerClass ?? "flex justify-center mx-auto max-w-[500px]";

  const maxHeight = props.maxHeight ?? 240;

  const textClass = props.textClass ?? "text-light-accent";
  const darkTextClass = props.darkTextClass ?? "dark:text-bright-accent";

  const darkTextErrorClass =
    props.darkTextErrorClass ?? "dark:text-bright-error";

  const darkFocusClassList = props.darkFocusClassList ?? [
    "dark:focus:ring-bright-primary",
    "dark:focus:border-bright-primary",
  ];

  const currentValue = useComputed$(() => {
    if (props.value !== undefined) {
      return props.value;
    }

    return internalValue.value;
  });

  const currentOptionKey = useComputed$(() => {
    if (props.selectedOptionKey !== undefined) {
      return props.selectedOptionKey;
    }

    return internalOptionKey.value;
  });

  const currentOption = useComputed$(() => {
    if (currentOptionKey.value !== null) {
      const keyedOption = options.value.find(
        (option) =>
          option.key === currentOptionKey.value &&
          option.value === currentValue.value,
      );

      if (keyedOption) return keyedOption;
    }

    const valueMatches = options.value.filter(
      (option) => option.value === currentValue.value,
    );

    return valueMatches.length === 1 ? valueMatches[0] : undefined;
  });

  const currentLabel = useComputed$(() => {
    return currentOption.value?.label ?? "";
  });

  const currentDescription = useComputed$(() => {
    return currentOption.value?.description?.trim() ?? "";
  });

  const currentDisplayValue = useComputed$(() => {
    if (!currentLabel.value) return unresolvedInputValue.value;

    return props.showSelectedDescription && currentDescription.value
      ? `${currentLabel.value} · ${currentDescription.value}`
      : currentLabel.value;
  });

  const dropdownOptions = useComputed$<Option<SelectPrimitiveValue>[]>(() => {
    const placeholderDescription = props.placeholderDescription?.trim() ?? "";

    if (hidePlaceholder) {
      return options.value;
    }

    return [
      {
        label: placeholder.value,
        value: null,
        description: placeholderDescription || null,
      },
      ...options.value,
    ];
  });

  const visibleOptions = useComputed$<Option<SelectPrimitiveValue>[]>(() => {
    if (!searchable) {
      return dropdownOptions.value;
    }

    const query = normalizeSearchText(searchQuery.value.trim());
    if (!query) return options.value;

    return options.value.filter((option) =>
      normalizeSearchText(
        `${option.label} ${option.description ?? ""} ${option.searchText ?? ""} ${option.autocompleteValue ?? ""}`,
      ).includes(query),
    );
  });

  const currentIconUrl = useComputed$(() => {
    return currentOption.value?.iconUrl ?? null;
  });

  const currentIconAlt = useComputed$(() => {
    return currentOption.value?.iconAlt ?? "";
  });

  const getCurrentError = () => {
    if (props.serverError) return props.serverError;

    if (!props.touched || !props.validationErrors) return "";

    const key = Object.keys(props.validationErrors).find((errorKey) =>
      Boolean(props.validationErrors?.[errorKey]),
    );

    if (!key) return "";

    return errors[key] ?? "";
  };

  const currentError = getCurrentError();
  const hasError = Boolean(currentError);

  const isInvalid = Boolean(props.touched && props.invalid);

  const listboxId = `${id}-listbox`;
  const controlId = `${id}-control`;
  const labelId = `${id}-label`;
  const errorId = props.describedById ?? `${id}-error`;

  const ariaDescribedby = hasError ? errorId : props.describedById;

  const activeDescendant = useComputed$(() => {
    if (!opened.value || highlighted.value < 0) {
      return undefined;
    }

    return `${id}-option-${highlighted.value}`;
  });

  const serializedValue = useComputed$(() =>
    currentValue.value === null ? "" : String(currentValue.value),
  );

  const resolvePublicUrl = (url: string | null | undefined) => {
    if (!url) return "";

    if (
      url.startsWith("/") ||
      url.startsWith("http://") ||
      url.startsWith("https://") ||
      url.startsWith("data:")
    ) {
      return url;
    }

    const base = props.publicBase ?? "";

    if (!base) {
      return `/${url}`;
    }

    return `${base.replace(/\/$/, "")}/${url.replace(/^\//, "")}`;
  };

  const scrollOptionIntoView = $((index: number) => {
    if (index < 0 || typeof window === "undefined") return;

    const scrollWhenRendered = (remainingFrames: number) => {
      window.requestAnimationFrame(() => {
        if (!opened.value || highlighted.value !== index) return;

        const optionElement = document.getElementById(`${id}-option-${index}`);

        if (optionElement) {
          optionElement.scrollIntoView({ block: "nearest" });
          return;
        }

        if (remainingFrames > 0) {
          scrollWhenRendered(remainingFrames - 1);
        }
      });
    };

    scrollWhenRendered(3);
  });

  const setHighlighted = $(async (index: number) => {
    const lastIndex = visibleOptions.value.length - 1;
    const nextIndex =
      lastIndex < 0 || index < 0 ? -1 : Math.max(0, Math.min(index, lastIndex));

    highlighted.value = nextIndex;
    await scrollOptionIntoView(nextIndex);
  });

  const open = $(
    async (placement: "selected" | "first" | "last" = "selected") => {
      if (disabled) return;

      if (searchable) {
        searchQuery.value = currentOption.value
          ? ""
          : unresolvedInputValue.value;
      }

      opened.value = true;

      const selectedIndex = visibleOptions.value.findIndex(
        (option) =>
          currentOption.value !== undefined &&
          optionsMatch(option, currentOption.value),
      );

      const nextHighlighted =
        placement === "first"
          ? 0
          : placement === "last"
            ? visibleOptions.value.length - 1
            : selectedIndex >= 0
              ? selectedIndex
              : unresolvedInputValue.value
                ? -1
                : 0;

      await setHighlighted(nextHighlighted);
    },
  );

  const close = $(async (touch = false) => {
    opened.value = false;
    searchQuery.value = "";

    if (touch) {
      await props.onTouched$?.();
    }
  });

  const toggle = $(async () => {
    if (disabled) return;

    if (opened.value) {
      await close(true);
      return;
    }

    await open("selected");
  });

  const choose = $(async (index: number) => {
    const option = visibleOptions.value[index];

    if (!option || disabled) return;

    internalValue.value = option.value;
    const optionIndex = options.value.findIndex((item) =>
      optionsMatch(item, option),
    );

    internalOptionKey.value = getOptionKey(option, optionIndex);
    unresolvedInputValue.value = "";
    opened.value = false;
    highlighted.value = index;
    searchQuery.value = "";

    await props.onChange$?.(option.value, option);
    await props.onTouched$?.();
  });

  const handleKeyDown = $(async (event: KeyboardEvent) => {
    if (disabled) return;

    const openKeys = searchable
      ? ["Enter", "ArrowDown", "ArrowUp"]
      : ["Enter", " ", "ArrowDown", "ArrowUp"];

    if (!opened.value && openKeys.includes(event.key)) {
      event.preventDefault();
      await open(event.key === "ArrowUp" ? "last" : "selected");
      return;
    }

    if (
      !searchable &&
      event.key.length === 1 &&
      !event.altKey &&
      !event.ctrlKey &&
      !event.metaKey
    ) {
      event.preventDefault();

      if (!opened.value) {
        await open("first");
      }

      const now = Date.now();
      const nextBuffer =
        now - lastTypeaheadAt.value > 700
          ? event.key
          : `${typeaheadBuffer.value}${event.key}`;

      typeaheadBuffer.value = normalizeSearchText(nextBuffer);
      lastTypeaheadAt.value = now;

      const matchIndex = visibleOptions.value.findIndex((option) =>
        normalizeSearchText(option.label).startsWith(typeaheadBuffer.value),
      );

      if (matchIndex >= 0) {
        await setHighlighted(matchIndex);
      }

      return;
    }

    if (!opened.value) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      await setHighlighted(highlighted.value + 1);
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      await setHighlighted(highlighted.value - 1);
      return;
    }

    if (event.key === "Home") {
      event.preventDefault();
      await setHighlighted(0);
      return;
    }

    if (event.key === "End") {
      event.preventDefault();
      await setHighlighted(visibleOptions.value.length - 1);
      return;
    }

    if (event.key === "Enter" || (!searchable && event.key === " ")) {
      event.preventDefault();

      if (highlighted.value >= 0) {
        await choose(highlighted.value);
      }

      return;
    }

    if (event.key === "Tab") {
      if (highlighted.value >= 0) {
        await choose(highlighted.value);
      } else {
        await close(true);
      }
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      await close(true);
    }
  });

  const handleSearchValue = $(async (rawValue: string) => {
    if (!opened.value && rawValue === currentDisplayValue.value) return;

    const normalizedValue = normalizeSearchText(rawValue.trim());
    const autocompleteMatches = normalizedValue
      ? options.value.filter(
          (option) =>
            normalizeSearchText(getAutocompleteValue(option)) ===
            normalizedValue,
        )
      : [];

    if (autocompleteMatches.length === 1) {
      const option = autocompleteMatches[0];
      const optionIndex = options.value.findIndex((item) =>
        optionsMatch(item, option),
      );

      internalValue.value = option.value;
      internalOptionKey.value = getOptionKey(option, optionIndex);
      unresolvedInputValue.value = "";
      opened.value = false;
      highlighted.value = -1;
      searchQuery.value = "";

      await props.onChange$?.(option.value, option);
      return;
    }

    searchQuery.value = rawValue;

    if (!opened.value) {
      opened.value = true;
    }

    if (autocompleteMatches.length > 1) {
      const selectedOption = currentOption.value;
      const compatibleOption = selectedOption
        ? autocompleteMatches.find((option) =>
            optionsMatch(option, selectedOption),
          )
        : undefined;

      if (compatibleOption) {
        internalValue.value = compatibleOption.value;
        unresolvedInputValue.value = "";
        await props.onChange$?.(compatibleOption.value, compatibleOption);
      } else {
        const commonValue = autocompleteMatches[0].value;
        const hasCommonValue = autocompleteMatches.every(
          (option) => option.value === commonValue,
        );

        if (hasCommonValue) {
          internalValue.value = commonValue;
          internalOptionKey.value = null;
          unresolvedInputValue.value = rawValue.trim();
          await props.onChange$?.(commonValue, null);
        }
      }

      const compatibleIndex = compatibleOption
        ? visibleOptions.value.findIndex((option) =>
            optionsMatch(option, compatibleOption),
          )
        : -1;

      await setHighlighted(compatibleIndex);
      return;
    }

    await setHighlighted(visibleOptions.value.length > 0 ? 0 : -1);
  });

  const handleSearchInput = $((event: InputEvent) =>
    handleSearchValue((event.target as HTMLInputElement).value),
  );

  const handleSearchChange = $((event: Event) =>
    handleSearchValue((event.target as HTMLInputElement).value),
  );

  useOnDocument(
    "click",
    $(async (event) => {
      const target = event.target as Node | null;

      if (!target || !rootRef.value) return;

      if (opened.value && !rootRef.value.contains(target)) {
        await close(true);
      }
    }),
  );

  return (
    <div
      id={id}
      ref={rootRef}
      class={containerClass}
      onFocusOut$={$(() => {
        window.setTimeout(() => {
          if (
            opened.value &&
            !listboxPointerActive.value &&
            rootRef.value &&
            !rootRef.value.contains(document.activeElement)
          ) {
            void close(true);
          }
        }, 0);
      })}
    >
      <div class="relative w-full">
        {props.label && (
          <label
            id={labelId}
            for={controlId}
            class={[
              "mb-0.5 ml-0.5 block text-base font-medium",
              hasError
                ? "text-light-error dark:text-bright-error"
                : [textClass, darkTextClass],
              disabled ? "opacity-45" : "",
            ]}
          >
            {props.label}
          </label>
        )}

        {props.name && (
          <input
            type="hidden"
            name={props.name}
            value={serializedValue.value}
            disabled={disabled}
          />
        )}

        {searchable ? (
          <div class="relative">
            {!opened.value && currentIconUrl.value && (
              <img
                src={resolvePublicUrl(currentIconUrl.value)}
                alt=""
                width={28}
                height={20}
                class="pointer-events-none absolute top-1/2 left-4 z-10 block h-5 w-7 -translate-y-1/2 rounded-[3px] object-contain"
              />
            )}

            <input
              id={controlId}
              type="text"
              inputMode="search"
              enterKeyHint="search"
              role="combobox"
              value={
                opened.value ? searchQuery.value : currentDisplayValue.value
              }
              placeholder={
                opened.value
                  ? (props.searchPlaceholder ?? "Cerca…")
                  : hidePlaceholder
                    ? ""
                    : placeholder.value
              }
              autoComplete={
                (props.autocomplete ?? "off") as HTMLInputAutocompleteAttribute
              }
              spellcheck={false}
              aria-haspopup="listbox"
              aria-expanded={opened.value ? "true" : "false"}
              aria-controls={opened.value ? listboxId : undefined}
              aria-activedescendant={activeDescendant.value}
              aria-labelledby={props.label ? labelId : undefined}
              aria-label={props.label ? undefined : placeholder.value}
              aria-autocomplete="list"
              aria-invalid={isInvalid ? "true" : undefined}
              aria-required={props.required ? "true" : undefined}
              aria-describedby={ariaDescribedby}
              disabled={disabled}
              onFocus$={$(() => {
                if (!opened.value) return open("selected");
              })}
              onClick$={$(() => {
                if (!opened.value) return open("selected");
              })}
              onInput$={handleSearchInput}
              onChange$={handleSearchChange}
              onKeyDown$={handleKeyDown}
              class={[
                "h-14.5 w-full appearance-none rounded-md border bg-transparent py-0 pr-10 text-base transition duration-300",
                "hover:bg-slate-200/60 dark:hover:bg-neutral-800/50",
                "focus:ring-1 focus:outline-none focus:ring-inset",
                !opened.value && currentIconUrl.value ? "pl-14" : "pl-4",
                "disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-transparent",
                hasError
                  ? [
                      "text-neutral-950 dark:text-slate-50",
                      "border-light-error ring-light-error ring-1",
                      "focus:border-light-error focus:ring-light-error",
                      "dark:border-bright-error dark:ring-bright-error",
                    ]
                  : [
                      "text-slate-600 dark:text-slate-400",
                      opened.value
                        ? "border-light-primary ring-light-primary dark:border-bright-primary dark:ring-bright-primary ring-1"
                        : "border-indigo-300 dark:border-indigo-200",
                      "focus:border-light-primary focus:ring-light-primary",
                      ...darkFocusClassList,
                    ],
              ]}
            />

            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 640 640"
              class={[
                "pointer-events-none absolute top-1/2 right-3 size-5 -translate-y-1/2 fill-current",
                hasError
                  ? "text-light-error dark:text-bright-error"
                  : "text-slate-600 dark:text-slate-200",
                opened.value ? "rotate-180" : "rotate-0",
                "transition-transform duration-200",
              ]}
              aria-hidden="true"
              focusable="false"
            >
              <path d="M536 224L320 456L104 224L536 224z" />
            </svg>
          </div>
        ) : (
          <button
            id={controlId}
            type="button"
            role="combobox"
            aria-haspopup="listbox"
            aria-expanded={opened.value ? "true" : "false"}
            aria-controls={opened.value ? listboxId : undefined}
            aria-activedescendant={activeDescendant.value}
            aria-labelledby={props.label ? labelId : undefined}
            aria-label={props.label ? undefined : placeholder.value}
            aria-disabled={disabled ? "true" : "false"}
            aria-invalid={isInvalid ? "true" : undefined}
            aria-required={props.required ? "true" : undefined}
            aria-describedby={ariaDescribedby}
            disabled={disabled}
            onClick$={toggle}
            onKeyDown$={handleKeyDown}
            class={[
              "relative flex h-14.5 w-full appearance-none items-center bg-transparent text-base",
              "hover:bg-slate-200/60 dark:hover:bg-neutral-800/50",
              "rounded-md border px-4 py-0 transition duration-300",
              "cursor-pointer ring-inset focus:ring-1 focus:outline-none",
              "pr-10 text-left",
              "disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-transparent",
              hasError
                ? [
                    "text-neutral-950 dark:text-slate-50",
                    "border-light-error ring-light-error ring-1",
                    "focus:border-light-error focus:ring-light-error",
                    "dark:border-bright-error dark:ring-bright-error",
                    "dark:focus:border-bright-error dark:focus:ring-bright-error",
                  ]
                : [
                    "text-slate-600 dark:text-slate-400",
                    opened.value
                      ? "border-light-primary ring-light-primary dark:border-bright-primary dark:ring-bright-primary ring-1"
                      : "border-indigo-300 dark:border-indigo-200",
                    "focus:border-light-primary focus:ring-light-primary",
                    !opened.value &&
                      "hover:border-indigo-500 dark:hover:border-indigo-300",
                    ...darkFocusClassList,
                  ],
            ]}
          >
            <span
              class={[
                "flex min-w-0 flex-1",
                inlineOptionLayout ? "items-center gap-3" : "items-start gap-2",
              ]}
            >
              {currentIconUrl.value && (
                <img
                  src={resolvePublicUrl(currentIconUrl.value)}
                  alt={currentIconAlt.value}
                  width={28}
                  height={20}
                  class={[
                    "block h-5 w-7 shrink-0 rounded-[3px] object-contain",
                    inlineOptionLayout ? "" : "mt-1 mr-3",
                  ]}
                />
              )}

              <span
                class={[
                  "min-w-0 flex-1",
                  inlineOptionLayout
                    ? "flex items-center gap-2 overflow-hidden"
                    : "flex flex-col",
                ]}
              >
                <span
                  class={
                    inlineOptionLayout
                      ? "min-w-0 flex-1 truncate leading-6 whitespace-nowrap"
                      : "truncate"
                  }
                >
                  {currentLabel.value ||
                    (hidePlaceholder ? "" : placeholder.value)}
                </span>

                {props.showSelectedDescription && currentDescription.value && (
                  <span
                    class={[
                      "text-sm text-slate-500 dark:text-slate-400",
                      inlineOptionLayout
                        ? "shrink-0 leading-6 whitespace-nowrap tabular-nums"
                        : "mt-0.5 leading-snug",
                    ]}
                  >
                    {currentDescription.value}
                  </span>
                )}
              </span>
            </span>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 640 640"
              class={[
                "pointer-events-none absolute top-1/2 right-3 h-5 w-5 -translate-y-1/2 fill-current",
                hasError
                  ? "text-light-error dark:text-bright-error"
                  : "text-slate-600 dark:text-slate-200",
                opened.value ? "rotate-180" : "rotate-0",
                "transition-transform duration-200",
              ]}
              aria-hidden="true"
              focusable="false"
            >
              <path d="M536 224L320 456L104 224L536 224z" />
            </svg>
          </button>
        )}

        {opened.value && (
          <ul
            id={listboxId}
            role="listbox"
            onPointerDown$={() => {
              listboxPointerActive.value = true;
            }}
            onPointerUp$={() => {
              window.setTimeout(() => {
                listboxPointerActive.value = false;
              }, 0);
            }}
            onPointerCancel$={() => {
              listboxPointerActive.value = false;
            }}
            aria-labelledby={props.label ? labelId : undefined}
            aria-busy={props.pending ? "true" : undefined}
            class={[
              "m-select-listbox m-thin-scrollbar",
              "absolute right-0 left-0 z-200 mt-1 w-full rounded-md border border-slate-400 dark:border-slate-200",
              "overflow-y-auto overscroll-contain bg-slate-100 shadow-lg dark:bg-neutral-800",
              "[--m-scrollbar-thumb:#334155] [--m-scrollbar-track:#f8fafc]",
              "dark:[--m-scrollbar-thumb:#f8fafc] dark:[--m-scrollbar-track:#171717]",
            ]}
            style={{
              maxHeight: `${maxHeight}px`,
            }}
          >
            {visibleOptions.value.length === 0 && (
              <li
                role="presentation"
                class="px-4 py-3 text-sm text-slate-500 dark:text-slate-300"
              >
                <span role="status">
                  {props.noResultsText ?? "Nessun risultato"}
                </span>
              </li>
            )}

            {visibleOptions.value.map((option, index) => {
              const selected =
                currentOption.value !== undefined &&
                optionsMatch(option, currentOption.value);
              const active = index === highlighted.value;
              const placeholderOption =
                !searchable &&
                !hidePlaceholder &&
                index === 0 &&
                option.value === null;
              const optionDescription = option.description?.trim();

              return (
                <li
                  id={`${id}-option-${index}`}
                  key={getOptionKey(option, index)}
                  role="option"
                  aria-selected={selected ? "true" : "false"}
                  onClick$={() => choose(index)}
                  onMouseEnter$={() => {
                    highlighted.value = index;
                  }}
                  class={[
                    inlineOptionLayout
                      ? "min-h-10 cursor-pointer px-4 py-2 dark:text-slate-200"
                      : "cursor-pointer px-4 py-3 dark:text-slate-200",
                    "transition hover:bg-slate-300/45 dark:hover:bg-slate-700/40",
                    active && "bg-slate-300/35 dark:bg-slate-700/80",
                    selected && [
                      "ring-light-primary/50 bg-indigo-100/80 font-medium ring-1 ring-inset",
                      "dark:ring-bright-primary/65 dark:bg-neutral-700",
                    ],
                    placeholderOption && [
                      "border-b border-slate-300/80 bg-slate-200/45",
                      "dark:border-slate-500/60 dark:bg-neutral-700/45",
                    ],
                  ]}
                >
                  <span
                    class={[
                      "flex w-full min-w-0",
                      inlineOptionLayout
                        ? "items-center gap-3"
                        : "items-start gap-3",
                    ]}
                  >
                    {option.iconUrl && (
                      <img
                        src={resolvePublicUrl(option.iconUrl)}
                        alt={option.iconAlt || ""}
                        width={28}
                        height={20}
                        class={[
                          "block h-5 w-7 shrink-0 rounded-[3px] object-contain",
                          inlineOptionLayout ? "" : "mt-1",
                        ]}
                      />
                    )}

                    <span
                      class={[
                        "min-w-0 flex-1",
                        inlineOptionLayout
                          ? "flex items-center gap-2 overflow-hidden"
                          : "flex flex-col",
                      ]}
                    >
                      <span
                        class={[
                          inlineOptionLayout
                            ? "min-w-0 flex-1 truncate text-base leading-6 whitespace-nowrap"
                            : "text-base leading-6",
                          placeholderOption
                            ? "font-normal text-slate-500 italic dark:text-slate-300"
                            : "text-slate-700 dark:text-slate-100",
                        ]}
                      >
                        {option.label}
                      </span>

                      {optionDescription && (
                        <span
                          class={[
                            inlineOptionLayout
                              ? "shrink-0 text-sm leading-6 font-normal whitespace-nowrap tabular-nums"
                              : "mt-1 text-sm leading-snug font-normal",
                            placeholderOption
                              ? "text-slate-600 dark:text-slate-300"
                              : "text-slate-500 dark:text-slate-400",
                          ]}
                        >
                          {optionDescription}
                        </span>
                      )}
                    </span>
                  </span>
                </li>
              );
            })}
          </ul>
        )}

        <div
          id={hasError ? errorId : undefined}
          class={[
            "text-light-error relative z-10 mt-1 flex min-h-5 items-center gap-3 text-sm",
            darkTextErrorClass,
            "font-medium",
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
    </div>
  );
}) as SelectComponent;
