import { component$ } from "@builder.io/qwik";
import { DocumentHead } from "@builder.io/qwik-city";
import PollinePage from "~/components/content/le-api/polline/page.mdx";
import { EndPageBtnBlock } from "~/components/UI/end-page-btn-block";

export default component$(() => (
    <>
        <main>
            <PollinePage />
        </main>
        <aside>
            <EndPageBtnBlock />
        </aside>
    </>
))

export const head: DocumentHead = {
    title: "Il polline | Ferupis"
}
