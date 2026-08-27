import { component$ } from "@builder.io/qwik";
import { ContainerTag, Poly } from "~/components/UI/poly";

export type HeadingProps = {
    class?: string | string[];
    classOverride?: string | string[];
    text: string;
    tag?: Extract<ContainerTag, "h1" | "h2" | "h3" | "h4" | "h5" | "h6">;
};

export const Heading = component$<HeadingProps>((props) => {
    const tag = props.tag ?? 'h6'
    return (
        <Poly
            as={tag}
            class={[
                props.classOverride ??
                "mt-4 text-4xl font-semibold tracking-tight sm:text-5xl",
                props.class ?? "",
            ]}
        >
            {props.text}
        </Poly>
    )
})
