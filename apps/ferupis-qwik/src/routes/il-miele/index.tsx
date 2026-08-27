import { component$ } from "@builder.io/qwik";
import { DocumentHead } from "@builder.io/qwik-city";
import IlMielePage from "~/components/content/il-miele/page.mdx";
import { EndPageBtnBlock } from "~/components/UI/end-page-btn-block";

export default component$(() => (
    <>
        <main>
            <IlMielePage />
        </main>
        <aside>
            <EndPageBtnBlock />
        </aside>
    </>
))

export const head: DocumentHead = {
    title: 'Il miele | Ferupis'
}
