import { component$, Slot } from "@builder.io/qwik";
import { FotoPage } from "~/components/content/foto/page";
import { EndPageBtnBlock } from "~/components/UI/end-page-btn-block";

export default component$(() => (
  <>
    <main>
      <FotoPage />
    </main>
    <Slot />
    <aside>
      <EndPageBtnBlock />
    </aside>
  </>
));
