import { component$ } from "@builder.io/qwik";
import { DocumentHead } from "@builder.io/qwik-city";
import LaPappaRealePage from "~/components/content/la-pappa-reale/page.mdx";
import { EndPageBtnBlock } from "~/components/UI/end-page-btn-block";

export default component$(() => (
    <>
        <main>
            <LaPappaRealePage />
        </main>
        <aside>
            <EndPageBtnBlock />
        </aside>
    </>
))

export const head: DocumentHead = {
    title: 'La pappa reale | Ferupis'
}
