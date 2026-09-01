import { $, component$ } from "@builder.io/qwik";
import { ArrowUpJellyIcon, SecondaryActionOutlineBtn } from "@gm/qwik-core/ui";

export type GoToTopBtnProps = {
    class?: string
}

export const GoToTopBtn = component$<GoToTopBtnProps>((props) => {    
    const handleTop$ = $(() =>
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        }))
    return (
        <SecondaryActionOutlineBtn label="Torna su" isLink={false} action={handleTop$} adjunctiveTwClassList={`font-sans ${props.class}`}>
            <ArrowUpJellyIcon class="size-5 shrink-0" q:slot="end" />
        </SecondaryActionOutlineBtn>
    )
})
