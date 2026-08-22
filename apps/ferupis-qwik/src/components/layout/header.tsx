import { component$ } from "@builder.io/qwik";
import { Container } from "./container";

export const Header = component$(() => (
    <header class="site-header">
        <Container context="header">
            test
        </Container>
    </header>
))