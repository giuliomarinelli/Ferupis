import { component$ } from "@builder.io/qwik";
import MillefioriPage from "~/components/content/il-miele/millefiori/page.mdx";
import { EndPageBtnBlock } from "~/components/UI/end-page-btn-block";

export default component$(() => (
  <>
    <main>
      <MillefioriPage />
    </main>
    <aside>
      <EndPageBtnBlock />
    </aside>
  </>
));
