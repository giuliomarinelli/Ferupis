import { component$ } from "@builder.io/qwik";
import ApeReginaPage from "~/components/content/le-api/ape-regina/page.mdx";
import { EndPageBtnBlock } from "~/components/UI/end-page-btn-block";

export default component$(() => (
    <>
        <main>
            <ApeReginaPage />
        </main>
        <aside>
            <EndPageBtnBlock />
        </aside>
    </>
))
