import { component$ } from "@builder.io/qwik";
import { Container } from "./container";
import { ToggleThemeMenuBtn } from '@gm/qwik-core'
import BrandLogo from '~/media/pics/restored/9A24F744BA8146C2AE4EF18B13C5B7B8.gif?jsx'

export const Header = component$(() => (
    <header class="site-header">
        <Container context="header" class="flex items-center justify-between">
            <div class="flex items-center gap-4">
                <BrandLogo />
            </div>
            <div>
                <ToggleThemeMenuBtn />
            </div>
        </Container>
    </header>
))
