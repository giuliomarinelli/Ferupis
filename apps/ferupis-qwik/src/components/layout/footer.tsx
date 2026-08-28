import { component$ } from "@builder.io/qwik";
import { Container } from "./container";
import { Link } from "@builder.io/qwik-city";
import { CONTACT_EMAIL } from "~/site-config";
import { BoltIcon, ContactIcon } from "@gm/qwik-core/ui";

export const Footer = component$(() => {
    const Y = new Date().getFullYear()
    return (
        <footer class="shrink-0 bg-slate-300/20 dark:bg-slate-300/12 backdrop-blur-[2.5px]">
            <Container context="footer" class="px-4 py-6 flex flex-col items-center gap-y-4 sm:flex-row sm:justify-between text-xs tracking-wider font-sans">
                <span class="text-center sm:text-left leading-6">
                    © {Y} Ferdinando Marinelli<span class="hidden md:inline"> — </span>
                    <br class="inline md:hidden" /><Link class="a-link" href={`mailto:${CONTACT_EMAIL}`}><ContactIcon class="relative -top-px mr-1 inline-block size-4 align-middle" /><span>{CONTACT_EMAIL}</span></Link>
                </span>
                <span class="leading-6">
                    <BoltIcon class="relative -top-px mr-1 inline-block size-5 align-middle text-light-primary dark:text-bright-primary" /><span>Powered by</span> <Link class="a-link" href="https://giuliomarinelli.com"><span>Giulio Marinelli Web Tech Lab</span></Link>
                </span>
            </Container>
        </footer>
    )
})
