import { $, component$ } from "@builder.io/qwik";
import { useLocation, useNavigate } from "@builder.io/qwik-city";
import { ArrowLeftJellyIcon, PrimaryActionBtn } from "@gm/qwik-core/ui";

export type ComeBackBtnProps = {
    class?: string
}

export const ComeBackBtn = component$<ComeBackBtnProps>((props) => {
    const loc = useLocation()
    const nav = useNavigate()
    const handleBack$ = $(() =>
        loc.prevUrl
            ? window.history.back()
            : nav("/"))
    return (
        <PrimaryActionBtn label="Torna indietro" isLink={false} action={handleBack$} adjunctiveTwClassList={`font-sans ${props.class}`}>
            <ArrowLeftJellyIcon classList="size-5 shrink-0" />
        </PrimaryActionBtn>
    )
})