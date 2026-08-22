import { component$, Slot } from "@builder.io/qwik";
import { ThemeProvider } from "@gm/qwik-core";
import { Footer } from "~/components/layout/footer";
import { Header } from "~/components/layout/header";
import { BgStack } from "~/components/UI/bg-stack";

export default component$(() => (
    <ThemeProvider>
        <div class="relative flex flex-col isolate min-h-screen overflow-x-clip bg-slate-50 text-neutral-950 dark:bg-neutral-950 dark:text-slate-50">
            <BgStack />
            <Header />
            <Slot />
            <Footer />
        </div>
    </ThemeProvider>
))