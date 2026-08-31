import { component$ } from "@builder.io/qwik";
import AlvearePage from "~/components/content/le-api/alveare/page.mdx";
import { EndPageBtnBlock } from "~/components/UI/end-page-btn-block";

export default component$(() => (
    <>
        <main>
            <AlvearePage />
        </main>
        <aside>
            <EndPageBtnBlock />
        </aside>
    </>
))
