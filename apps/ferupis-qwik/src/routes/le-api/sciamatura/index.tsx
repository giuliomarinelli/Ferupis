import { component$ } from "@builder.io/qwik";
import SciamaturaPage from "~/components/content/le-api/sciamatura/page.mdx";
import { EndPageBtnBlock } from "~/components/UI/end-page-btn-block";

export default component$(() => (
    <>
        <main>
            <SciamaturaPage />
        </main>
        <aside>
            <EndPageBtnBlock />
        </aside>
    </>
))
