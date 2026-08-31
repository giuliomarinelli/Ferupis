import { component$ } from "@builder.io/qwik";
import AcaciaPage from "~/components/content/il-miele/acacia/page.mdx";
import { EndPageBtnBlock } from "~/components/UI/end-page-btn-block";

export default component$(() => (
  <>
    <main>
      <AcaciaPage />
    </main>
    <aside>
      <EndPageBtnBlock />
    </aside>
  </>
));
