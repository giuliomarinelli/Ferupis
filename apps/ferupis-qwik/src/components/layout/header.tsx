import { component$ } from "@builder.io/qwik";
import { Container } from "./container";
import { ToggleThemeMenuBtn } from '@gm/qwik-core'
import BrandLogo from '~/media/pics/restored/9A24F744BA8146C2AE4EF18B13C5B7B8.gif?jsx'
import { Link } from "@builder.io/qwik-city";

export const Header = component$(() => (
    <header class="site-header">
        <Container context="header" class="flex items-center justify-between">
            <Link href="/" class="flex items-center gap-4">
                <div class="w-[45px]">
                    <BrandLogo class="w-full h-auto" />
                </div>
                <span class="font-brand font-semibold text-2xl">Ferupis</span>
            </Link>
            <div>
                <ToggleThemeMenuBtn />
            </div>
        </Container>
    </header>
))
