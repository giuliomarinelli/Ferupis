import { component$ } from "@builder.io/qwik";
import CovataPage from "~/components/content/le-api/covata/page.mdx";
import { EndPageBtnBlock } from "~/components/UI/end-page-btn-block";

export default component$(() => (
    <>
        <main>
            <CovataPage />
        </main>
        <aside>
            <EndPageBtnBlock />
        </aside>
    </>
))
