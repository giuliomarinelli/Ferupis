import { component$ } from "@builder.io/qwik";
import FavoPage from "~/components/content/le-api/favo/page.mdx";
import { EndPageBtnBlock } from "~/components/UI/end-page-btn-block";

export default component$(() => (
    <>
        <main>
            <FavoPage />
        </main>
        <aside>
            <EndPageBtnBlock />
        </aside>
    </>
))
