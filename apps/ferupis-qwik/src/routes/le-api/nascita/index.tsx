import { component$ } from "@builder.io/qwik";
import { DocumentHead } from "@builder.io/qwik-city";
import NascitaPage from "~/components/content/le-api/nascita/page.mdx";
import { EndPageBtnBlock } from "~/components/UI/end-page-btn-block";

export default component$(() => (
    <>
        <main>
            <NascitaPage />
        </main>
        <aside>
            <EndPageBtnBlock />
        </aside>
    </>
))

export const head: DocumentHead = {
    title: "La nascita | Ferupis"
}
