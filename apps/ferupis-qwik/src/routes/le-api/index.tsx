import { component$ } from "@builder.io/qwik";
import { ContentHeader } from "~/components/content-typography/content-header/content-header";

export default component$(() => (
    <>
        <ContentHeader eyebrow="Ferupis" heading="Le Api" headingTag="h1" showSubTitle={false} />
    </>
))