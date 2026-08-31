import { component$ } from "@builder.io/qwik";
import GirasolePage from "~/components/content/il-miele/girasole/page.mdx";
import { EndPageBtnBlock } from "~/components/UI/end-page-btn-block";

export default component$(() => (
  <>
    <main>
      <GirasolePage />
    </main>
    <aside>
      <EndPageBtnBlock />
    </aside>
  </>
));
