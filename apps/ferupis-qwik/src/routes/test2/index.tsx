import { component$ } from "@builder.io/qwik";
import { Container } from "~/components/layout/container";
import { ContentHeader } from "~/components/UI/content-header";

export default component$(() => (
    <main>
        <Container>
            <ContentHeader headingTag="h2" eyebrow="Ferupis" heading="UI foundation placeholder" addClass="!max-w-4xl">
                Neutral surface, theme-aware honeycomb mask and low-intensity brand
                lighting. Final palette and typography will be defined after contrast
                validation.
            </ContentHeader>
        </Container>
    </main>
))