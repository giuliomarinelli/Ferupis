import { component$ } from "@builder.io/qwik";
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
