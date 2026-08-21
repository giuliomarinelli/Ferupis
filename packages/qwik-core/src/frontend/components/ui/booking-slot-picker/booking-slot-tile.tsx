import { component$, type QRL } from '@builder.io/qwik'

export type BookingSlotTileProps = {
    slotId: number
    label: string
    selected: boolean
    onSelectSlot$: QRL<(slotId: number) => void>
}

export const BookingSlotTile = component$<BookingSlotTileProps>((props) => {
    const { slotId, label, selected, onSelectSlot$ } = props

    return (
        <button
            type="button"
            aria-pressed={selected}
            onClick$={() => onSelectSlot$(slotId)}
            class={[
                "inline-flex min-h-10 items-center justify-center rounded-md border px-3 py-2 text-sm font-medium",
                "transition-all duration-200 ease-out",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                "focus-visible:ring-light-primary dark:focus-visible:ring-bright-primary",
                selected
                    ? "border-light-primary bg-light-primary text-white shadow-sm dark:border-bright-primary dark:bg-bright-primary dark:text-slate-950"
                    : "border-slate-300 bg-white/70 text-slate-800 hover:-translate-y-0.5 hover:border-light-primary hover:bg-light-primary/10 hover:text-light-primary dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100 dark:hover:border-bright-primary dark:hover:bg-bright-primary/10 dark:hover:text-bright-primary"
            ]}
        >
            {label}
        </button>
    )
})
