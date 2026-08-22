import { $, component$, type QRL, useComputed$, useSignal } from '@builder.io/qwik'
import { BookingSlotTile } from './booking-slot-tile'

export type BookingSlotPickerSlot = {
    id: number
    starts_at_utc: string
    ends_at_utc: string
    timezone: string
    status: "available" | "blocked" | "held" | "booked"
}

export type BookingSlotPickerDay = {
    dayTimestamp: string
    dayLabel: string
    slots: BookingSlotPickerSlot[]
}

export type BookingSlotPickerProps = {
    days: BookingSlotPickerDay[]
    selectedSlotId: number | null
    onSelectSlot$: QRL<(slotId: number) => void>
    maxBodyHeightPx?: number
    slotMinWidthPx?: number
    invalid?: boolean
    errorMessage?: string
    emptyMessage?: string
    class?: string
}

const DEFAULT_MAX_BODY_HEIGHT_PX = 420
const DEFAULT_SLOT_MIN_WIDTH_PX = 72
const DEFAULT_TIMEZONE = "Europe/Rome"

const formatSlotTime = (slot: BookingSlotPickerSlot) => {
    return new Intl.DateTimeFormat("it-IT", {
        timeZone: slot.timezone || DEFAULT_TIMEZONE,
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
    }).format(new Date(slot.starts_at_utc))
}

export const BookingSlotPicker = component$<BookingSlotPickerProps>((props) => {
    const {
        days,
        selectedSlotId,
        onSelectSlot$,
        maxBodyHeightPx = DEFAULT_MAX_BODY_HEIGHT_PX,
        slotMinWidthPx = DEFAULT_SLOT_MIN_WIDTH_PX,
        invalid = false,
        errorMessage,
        emptyMessage,
    } = props

    const visibleStartIndex = useSignal(0)

    const hasSlots = days.length > 0

    const maxIndex = useComputed$(() => Math.max(days.length - 1, 0))
    const canGoBack = useComputed$(() => visibleStartIndex.value > 0)
    const canGoForward = useComputed$(() => visibleStartIndex.value < maxIndex.value)

    const goBack$ = $(() => {
        visibleStartIndex.value = Math.max(visibleStartIndex.value - 1, 0)
    })

    const goForward$ = $(() => {
        visibleStartIndex.value = Math.min(visibleStartIndex.value + 1, maxIndex.value)
    })

    const selectedSlotLabel = (() => {
        for (const day of days) {
            const slot = day.slots.find((item) => item.id === selectedSlotId)

            if (slot) {
                return `${day.dayLabel} · ${formatSlotTime(slot)}`
            }
        }

        return null
    })()

    const normalizedEmptyMessage =
        emptyMessage ?? "Non ci sono slot disponibili nei prossimi giorni."

    const normalizedErrorMessage =
        errorMessage ?? "Seleziona uno slot disponibile."

    return (
        <section
            class={[
                "w-full min-w-0 overflow-hidden rounded-xl border bg-white/70 p-3 shadow-sm backdrop-blur xs:p-4",
                "border-slate-200 dark:border-slate-800 dark:bg-slate-950/50",
                invalid && "border-red-500 dark:border-red-400",
                props.class
            ]}
            aria-invalid={invalid}
        >
            <div class="mb-4 flex min-w-0 items-center justify-between gap-2 xs:gap-3">
                <button
                    type="button"
                    disabled={!hasSlots || !canGoBack.value}
                    onClick$={goBack$}
                    class={[
                        "inline-flex size-10 shrink-0 items-center justify-center rounded-full border text-xl",
                        "transition-all duration-200 ease-out",
                        "border-slate-300 text-slate-700 hover:border-light-primary hover:text-light-primary",
                        "disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:border-slate-300 disabled:hover:text-slate-700",
                        "dark:border-slate-700 dark:text-slate-200 dark:hover:border-bright-primary dark:hover:text-bright-primary"
                    ]}
                    aria-label="Giorno precedente"
                >
                    ‹
                </button>

                <div class="min-w-0 text-center">
                    <p class="text-sm leading-5 font-medium text-light-primary dark:text-bright-primary">
                        Scegli uno slot disponibile
                    </p>
                    <p class="text-xs text-slate-500 dark:text-slate-400">
                        Orari nel fuso Europe/Rome
                    </p>
                </div>

                <button
                    type="button"
                    disabled={!hasSlots || !canGoForward.value}
                    onClick$={goForward$}
                    class={[
                        "inline-flex size-10 shrink-0 items-center justify-center rounded-full border text-xl",
                        "transition-all duration-200 ease-out",
                        "border-slate-300 text-slate-700 hover:border-light-primary hover:text-light-primary",
                        "disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:border-slate-300 disabled:hover:text-slate-700",
                        "dark:border-slate-700 dark:text-slate-200 dark:hover:border-bright-primary dark:hover:text-bright-primary"
                    ]}
                    aria-label="Giorno successivo"
                >
                    ›
                </button>
            </div>

            {!hasSlots && (
                <div class="rounded-lg border border-dashed border-slate-300 px-4 py-8 text-center text-sm italic text-slate-500 dark:border-slate-700 dark:text-slate-400">
                    {normalizedEmptyMessage}
                </div>
            )}

            {hasSlots && (
                <>
                    <div
                        class="w-full min-w-0 overflow-hidden"
                        style={{ maxHeight: `${maxBodyHeightPx}px` }}
                    >
                        <div class="sm:hidden">
                            <div
                                class="flex w-full min-w-0 transition-transform duration-300 ease-out"
                                style={{
                                    transform: `translateX(-${visibleStartIndex.value * 100}%)`
                                }}
                            >
                                {days.map((day) => (
                                    <BookingSlotDayColumn
                                        key={`mobile-day-${day.dayTimestamp}`}
                                        day={day}
                                        selectedSlotId={selectedSlotId}
                                        onSelectSlot$={onSelectSlot$}
                                        slotMinWidthPx={slotMinWidthPx}
                                        basisClass="min-w-0 basis-full shrink-0"
                                    />
                                ))}
                            </div>
                        </div>

                        <div class="hidden sm:block">
                            <div
                                class="flex w-full min-w-0 transition-transform duration-300 ease-out"
                                style={{
                                    transform: `translateX(-${visibleStartIndex.value * 50}%)`
                                }}
                            >
                                {days.map((day) => (
                                    <BookingSlotDayColumn
                                        key={`desktop-day-${day.dayTimestamp}`}
                                        day={day}
                                        selectedSlotId={selectedSlotId}
                                        onSelectSlot$={onSelectSlot$}
                                        slotMinWidthPx={slotMinWidthPx}
                                        basisClass="min-w-0 basis-1/2 shrink-0"
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    <div class="relative mt-4 h-9 px-1 sm:px-2">
                        <p
                            class={[
                                "absolute inset-x-1 top-0 rounded-lg bg-light-primary/10 px-3 py-2 text-sm font-medium text-light-primary",
                                "transition-[opacity,transform] duration-200 ease-out will-change-transform",
                                "dark:bg-bright-primary/10 dark:text-bright-primary sm:inset-x-2",
                                selectedSlotLabel
                                    ? "translate-y-0 opacity-100"
                                    : "pointer-events-none translate-y-1 opacity-0"
                            ]}
                        >
                            Slot selezionato:{" "}
                            <span>{selectedSlotLabel}</span>
                        </p>

                        <p
                            class={[
                                "absolute inset-x-1 top-0 text-sm font-medium text-red-600",
                                "transition-[opacity,transform] duration-200 ease-out will-change-transform",
                                "dark:text-red-400 sm:inset-x-2",
                                !selectedSlotLabel && invalid
                                    ? "translate-y-0 opacity-100"
                                    : "pointer-events-none translate-y-1 opacity-0"
                            ]}
                        >
                            {normalizedErrorMessage}
                        </p>
                    </div>
                </>
            )}
        </section>
    )
})

type BookingSlotDayColumnProps = {
    day: BookingSlotPickerDay
    selectedSlotId: number | null
    onSelectSlot$: QRL<(slotId: number) => void>
    slotMinWidthPx: number
    basisClass: string
}

const BookingSlotDayColumn = component$<BookingSlotDayColumnProps>((props) => {
    const {
        day,
        selectedSlotId,
        onSelectSlot$,
        slotMinWidthPx,
        basisClass
    } = props

    const availableSlots = day.slots.filter((slot) => slot.status === "available")

    return (
        <article class={[basisClass, "max-w-full px-1 sm:px-2"]}>
            <div class="h-full min-w-0 rounded-lg border border-slate-200 bg-slate-50/70 p-3 xs:p-4 dark:border-slate-800 dark:bg-slate-900/60">
                <h3 class="mb-4 text-sm font-semibold text-slate-900 xs:text-base dark:text-slate-50">
                    {day.dayLabel}
                </h3>

                {availableSlots.length === 0 && (
                    <p class="text-sm italic text-slate-500 dark:text-slate-400">
                        Nessuno slot disponibile.
                    </p>
                )}

                {availableSlots.length > 0 && (
                    <div
                        class="grid gap-2"
                        style={{
                            gridTemplateColumns: `repeat(auto-fit, minmax(${slotMinWidthPx}px, 1fr))`
                        }}
                    >
                        {availableSlots.map((slot) => (
                            <BookingSlotTile
                                key={`slot-${slot.id}`}
                                slotId={slot.id}
                                label={formatSlotTime(slot)}
                                selected={slot.id === selectedSlotId}
                                onSelectSlot$={onSelectSlot$}
                            />
                        ))}
                    </div>
                )}
            </div>
        </article>
    )
})
