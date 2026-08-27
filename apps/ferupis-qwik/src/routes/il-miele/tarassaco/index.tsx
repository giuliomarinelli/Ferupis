import { component$ } from "@builder.io/qwik";
import { DocumentHead } from "@builder.io/qwik-city";
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

export const head: DocumentHead = {
  title: "Miele di tarassaco | Ferupis",
};
