import { component$ } from "@builder.io/qwik";
import { Link } from '@builder.io/qwik-city'
import { toSiteRoutePath } from "~/config/routes";
import HeroLogo from "~/media/pics/restored/9A24F744BA8146C2AE4EF18B13C5B7B8.gif?jsx";

export const heroLinkClass =
    "";

export const HeroSection = component$(() => {
    return (
        <section class="flex min-h-[68svh] w-full items-center justify-center py-6 sm:py-10">
            <nav
                aria-label="Navigazione principale"
                class="mx-auto grid w-full grid-cols-1 items-center justify-items-center gap-x-4 gap-y-4 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-6 md:grid-cols-[minmax(0,1fr)_minmax(13rem,18rem)_minmax(0,1fr)] md:gap-x-10 md:gap-y-8 lg:gap-x-16"
            >
                <Link
                    href={toSiteRoutePath('leApi')}
                    class={`hero-link le-api-color col-start-1 row-start-1 md:col-start-1 md:row-start-1`}
                >
                    Le Api
                </Link>

                <Link
                    href="#il-miele"
                    class={`hero-link il-miele-color col-start-1 row-start-2 sm:col-start-2 sm:row-start-1 md:col-start-1 md:row-start-2`}
                >
                    Il Miele
                </Link>

                <a
                    href="#la-propoli"
                    class={`hero-link la-propoli-color col-start-1 row-start-3 sm:col-span-2 sm:row-start-2 md:col-span-1 md:col-start-1 md:row-start-3`}
                >
                    La Propoli
                </a>

                <div class="col-start-1 row-start-4 flex w-full items-center justify-center py-3 sm:col-span-2 sm:row-start-3 md:col-span-1 md:col-start-2 md:row-start-1 md:row-span-3 md:py-0">
                    <div class="w-44 scale-90 2xs:w-52 sm:w-60 md:w-full md:max-w-[18rem]">
                        <HeroLogo alt="Ferupis" class="h-auto w-full" />
                    </div>
                </div>

                <Link
                    href="#la-pappa-reale"
                    class={`hero-link la-papppa-reale-color col-start-1 row-start-5 sm:col-span-2 sm:row-start-4 md:col-span-1 md:col-start-3 md:row-start-1`}
                >
                    La Pappa Reale
                </Link>

                <Link
                    href="#foto"
                    class={`hero-link foto-color col-start-1 row-start-6 sm:row-start-5 md:col-start-3 md:row-start-2`}
                >
                    Foto
                </Link>

                <Link
                    href="/contatti/"
                    class={`hero-link video-color col-start-1 row-start-7 sm:col-start-2 sm:row-start-5 md:col-start-3 md:row-start-3`}
                >
                    Contattaci
                </Link>

                {/* <Link
                    href="#video"
                    class={`hero-link video-color col-start-1 row-start-7 sm:col-start-2 sm:row-start-5 md:col-start-3 md:row-start-3`}
                >
                    Video
                </Link>

                <Link
                    href="/contatti/"
                    class={`hero-link contatti-color col-start-1 row-start-8 mt-2 sm:col-span-2 sm:row-start-6 md:col-span-1 md:col-start-2 md:row-start-4 md:mt-3`}
                >
                    Contattaci
                </Link> */}
            </nav>
        </section>
    );
});
