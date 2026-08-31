import { component$ } from "@builder.io/qwik";
import ApeOperaiaPage from "~/components/content/le-api/ape-operaia/page.mdx";
import { EndPageBtnBlock } from "~/components/UI/end-page-btn-block";

export default component$(() => (
    <>
        <main>
            <ApeOperaiaPage />
        </main>
        <aside>
            <EndPageBtnBlock />
        </aside>
    </>
))
