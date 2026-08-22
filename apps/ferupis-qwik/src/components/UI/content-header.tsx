import { component$, Slot } from "@builder.io/qwik";
import { ContainerTag, Poly } from "./poly";

type ContentHeaderProps = {
    tag?: ContainerTag
    headingTag?: Extract<ContainerTag, | 'h1'
        | 'h2'
        | 'h3'
        | 'h4'
        | 'h5'
        | 'h6'>,
    eyebrow: string
    heading: string
    addClass?: string | string[]
}

export const ContentHeader = component$<ContentHeaderProps>((props) => (
    <Poly as={props.tag} class={["max-w-2xl", props.addClass ?? '']}>
        <p class="text-sm font-medium tracking-[0.18em] uppercase opacity-65">
            {props.eyebrow}
        </p>
        <Poly as={props.headingTag ?? 'h6'} class="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
            {props.heading}
        </Poly>
        <p class="mt-5 max-w-xl text-base leading-7 opacity-75 sm:text-lg">
            <Slot />
        </p>
    </Poly>
)
)