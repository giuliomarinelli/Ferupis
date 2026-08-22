import { component$ } from "@builder.io/qwik";
import HeroLogo from "~/media/pics/restored/9A24F744BA8146C2AE4EF18B13C5B7B8.gif?jsx";

const heroLinkClass =
    "font-hero-link inline-flex items-center justify-center rounded-lg px-3 py-2 text-center text-[clamp(1.25rem,5.8vw,2.25rem)] font-semibold leading-snug underline-offset-4 transition-transform duration-200 hover:scale-[1.03] hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current motion-reduce:transition-none motion-reduce:hover:scale-100 md:text-[clamp(1.75rem,2.6vw,2.5rem)]";

export const HeroSection = component$(() => {
    return (
        <section class="flex min-h-[68svh] w-full items-center justify-center py-6 sm:py-10">
            <nav
                aria-label="Navigazione principale"
                class="mx-auto grid w-full max-w-5xl grid-cols-1 items-center justify-items-center gap-x-4 gap-y-4 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-6 md:grid-cols-[minmax(0,1fr)_minmax(13rem,18rem)_minmax(0,1fr)] md:gap-x-10 md:gap-y-8 lg:gap-x-16"
            >
                <a
                    href="#api"
                    class={`${heroLinkClass} col-start-1 row-start-1 text-light-primary dark:text-bright-primary md:col-start-1 md:row-start-1`}
                >
                    Le Api
                </a>

                <a
                    href="#miele"
                    class={`${heroLinkClass} col-start-1 row-start-2 text-light-warning dark:text-bright-warning sm:col-start-2 sm:row-start-1 md:col-start-1 md:row-start-2`}
                >
                    Il Miele
                </a>

                <a
                    href="#propoli"
                    class={`${heroLinkClass} col-start-1 row-start-3 text-light-success dark:text-bright-success sm:col-span-2 sm:row-start-2 md:col-span-1 md:col-start-1 md:row-start-3`}
                >
                    La Propoli
                </a>

                <div class="col-start-1 row-start-4 flex w-full items-center justify-center py-3 sm:col-span-2 sm:row-start-3 md:col-span-1 md:col-start-2 md:row-start-1 md:row-span-3 md:py-0">
                    <div class="w-44 scale-90 2xs:w-52 sm:w-60 md:w-full md:max-w-[18rem]">
                        <HeroLogo alt="Ferupis" class="h-auto w-full" />
                    </div>
                </div>

                <a
                    href="#pappa-reale"
                    class={`${heroLinkClass} col-start-1 row-start-5 text-light-accent dark:text-bright-accent sm:col-span-2 sm:row-start-4 md:col-span-1 md:col-start-3 md:row-start-1`}
                >
                    La Pappa Reale
                </a>

                <a
                    href="#foto"
                    class={`${heroLinkClass} col-start-1 row-start-6 text-light-primary dark:text-bright-primary sm:row-start-5 md:col-start-3 md:row-start-2`}
                >
                    Foto
                </a>

                <a
                    href="#video"
                    class={`${heroLinkClass} col-start-1 row-start-7 text-light-error dark:text-bright-error sm:col-start-2 sm:row-start-5 md:col-start-3 md:row-start-3`}
                >
                    Video
                </a>

                <a
                    href="/contatti/"
                    class={`${heroLinkClass} col-start-1 row-start-8 mt-2 text-light-accent dark:text-bright-accent sm:col-span-2 sm:row-start-6 md:col-span-1 md:col-start-2 md:row-start-4 md:mt-3`}
                >
                    Contattaci
                </a>
            </nav>
        </section>
    );
});
