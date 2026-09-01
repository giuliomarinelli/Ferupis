import { component$ } from "@builder.io/qwik";
import UovoPage from "~/components/content/le-api/uovo/page.mdx";
import { EndPageBtnBlock } from "~/components/UI/end-page-btn-block";

export default component$(() => (
    <>
        <main>
            <UovoPage />
        </main>
        <aside>
            <EndPageBtnBlock />
        </aside>
    </>
))
