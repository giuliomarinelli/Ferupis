import { component$ } from "@builder.io/qwik";
import { DocumentHead } from "@builder.io/qwik-city";
import LaPropoliPage from "~/components/content/la-propoli/page.mdx";
import { EndPageBtnBlock } from "~/components/UI/end-page-btn-block";

export default component$(() => (
    <>
        <main>
            <LaPropoliPage />
        </main>
        <aside>
            <EndPageBtnBlock />
        </aside>
    </>
))

export const head: DocumentHead = {
    title: 'La propoli | Ferupis'
}
