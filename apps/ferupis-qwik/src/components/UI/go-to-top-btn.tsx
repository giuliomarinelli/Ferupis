import { $, component$ } from "@builder.io/qwik";
import { useLocation, useNavigate } from "@builder.io/qwik-city";
import { ArrowUpJellyIcon, SecondaryActionOutlineBtn } from "@gm/qwik-core/ui";

export type GoToTopBtnProps = {
    class?: string
}

export const GoToTopBtn = component$<GoToTopBtnProps>((props) => {
    const loc = useLocation()
    const nav = useNavigate()
    const handleBack$ = $(() =>
        loc.prevUrl
            ? window.history.back()
            : nav("/"))
    return (
        <SecondaryActionOutlineBtn label="Torna su" isLink={false} action={handleBack$} adjunctiveTwClassList={`font-sans ${props.class}`}>
            <ArrowUpJellyIcon classList="size-5 shrink-0" q:slot="end" />
        </SecondaryActionOutlineBtn>
    )
})