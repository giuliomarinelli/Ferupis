import { component$, JSXOutput } from "@builder.io/qwik";

export type SubtitleProps = {
    component: JSXOutput
}

export const Subtitle = component$<SubtitleProps>((props) => {
    const C = props.component
    return (
        {props.component}
    )
})

/**
 * 
 *  <p class="mt-5 max-w-xl text-base leading-7 opacity-75 sm:text-lg">
                <Slot />
            </p>
 * 
 */