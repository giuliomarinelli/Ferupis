import { component$ } from "@builder.io/qwik";
import FucoPage from "~/components/content/le-api/fuco/page.mdx";
import { EndPageBtnBlock } from "~/components/UI/end-page-btn-block";

export default component$(() => (
    <>
        <main>
            <FucoPage />
        </main>
        <aside>
            <EndPageBtnBlock />
        </aside>
    </>
))
