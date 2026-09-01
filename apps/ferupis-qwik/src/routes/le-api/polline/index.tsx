import { component$ } from "@builder.io/qwik";
import PollinePage from "~/components/content/le-api/polline/page.mdx";
import { EndPageBtnBlock } from "~/components/UI/end-page-btn-block";

export default component$(() => (
    <>
        <main>
            <PollinePage />
        </main>
        <aside>
            <EndPageBtnBlock />
        </aside>
    </>
))
