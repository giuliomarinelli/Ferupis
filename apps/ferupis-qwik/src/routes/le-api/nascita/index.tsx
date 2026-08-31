import { component$ } from "@builder.io/qwik";
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
