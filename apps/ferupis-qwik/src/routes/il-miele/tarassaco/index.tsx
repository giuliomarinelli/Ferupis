import { component$ } from "@builder.io/qwik";
import TarassacoPage from "~/components/content/il-miele/tarassaco/page.mdx";
import { EndPageBtnBlock } from "~/components/UI/end-page-btn-block";

export default component$(() => (
  <>
    <main>
      <TarassacoPage />
    </main>
    <aside>
      <EndPageBtnBlock />
    </aside>
  </>
));
