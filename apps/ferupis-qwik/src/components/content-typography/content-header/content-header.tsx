import { component$ } from "@builder.io/qwik";
import { ContainerTag, Poly } from "../../UI/poly";
import { Eyebrow } from "./eyebrow";
import { Heading } from "./heading";

type ContentHeaderProps = {
    tag?: ContainerTag
    headingTag?: Extract<ContainerTag,
        | 'h1'
        | 'h2'
        | 'h3'
        | 'h4'
        | 'h5'
        | 'h6'>,
    eyebrow: string
    heading: string
    class?: string | string[]
    classOverride?: string | string[]
    eyeBrowClass?: string | string[]
    headingClass?: string | string[]
    eyeBrowClassOverride?: string | string[]
    headingClassOverride?: string | string[]
    showSubTitle: boolean
}

export const ContentHeader = component$<ContentHeaderProps>((props) => (
    <Poly as={props.tag ?? 'header'} class={[props.classOverride ?? "max-w-2xl", props.class ?? '']}>
        <Eyebrow text={props.eyebrow} classOverride={props.classOverride} class={props.eyeBrowClass} />
        <Heading tag={props.headingTag} text={props.eyebrow} classOverride={props.headingClassOverride} class={props.class} />
    </Poly>
))