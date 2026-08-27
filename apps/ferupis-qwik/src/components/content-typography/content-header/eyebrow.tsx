import { component$ } from "@builder.io/qwik";

export type EyebrowProps = {
    text: string
    class?: string | string[]
    classOverride?: string | string[]
}

export const Eyebrow = component$<EyebrowProps>((props) => (
    <p class={[props.classOverride ?? 'text-sm font-medium tracking-[0.18em] uppercase opacity-65', props.class ?? '']}>
        {props.text}
    </p>
))