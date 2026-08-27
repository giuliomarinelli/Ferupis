import { component$ } from "@builder.io/qwik";
import LeApiPage from "~/components/content/le-api/page.mdx";
import { EndPageBtnBlock } from "~/components/UI/end-page-btn-block";

export default component$(() => (
    <>
        <main>
            <LeApiPage />
        </main>
        <aside>
            <EndPageBtnBlock />
        </aside>
    </>
))
