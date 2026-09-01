import { component$ } from "@builder.io/qwik";
import LaPappaRealePage from "~/components/content/la-pappa-reale/page.mdx";
import { EndPageBtnBlock } from "~/components/UI/end-page-btn-block";

export default component$(() => (
    <>
        <main>
            <LaPappaRealePage />
        </main>
        <aside>
            <EndPageBtnBlock />
        </aside>
    </>
))
