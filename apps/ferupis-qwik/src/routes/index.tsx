import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";

export default component$(() => {
  return (
    <main class="relative isolate min-h-screen overflow-hidden bg-slate-50 text-neutral-950 dark:bg-neutral-950 dark:text-slate-50">
      {/*
        Background layer 1 — dominant neutral surface.
        This layer intentionally carries almost all of the perceived background color so
        future brand colors can be validated for WCAG AAA thin-text contrast against a
        stable slate-50 / neutral-950 surface.
      */}
      <div
        aria-hidden="true"
        class="pointer-events-none absolute inset-0 -z-30 bg-slate-50 dark:bg-neutral-950"
      />

      {/*
        Background layer 2 — theme-aware honeycomb geometry.
        The SVG is a transparent monochrome mask; theme color and opacity stay in CSS.
      */}
      <div
        aria-hidden="true"
        class="pointer-events-none absolute inset-0 -z-20 bg-neutral-950/[0.045] [mask-image:url('/patterns/honeycomb.svg')] [mask-repeat:repeat] [mask-size:112px_98px] [-webkit-mask-image:url('/patterns/honeycomb.svg')] [-webkit-mask-repeat:repeat] [-webkit-mask-size:112px_98px] dark:bg-slate-50/[0.055]"
      />

      {/*
        Background layer 3 — deliberately subtle placeholder brand lighting.
        These are not palette decisions: they only reserve the future blue → violet →
        fuchsia visual axis while keeping the neutral base visually predominant.
      */}
      <div
        aria-hidden="true"
        class="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_16%_18%,#2563eb0d_0%,transparent_34%),radial-gradient(circle_at_82%_16%,#7c3aed0a_0%,transparent_32%),radial-gradient(circle_at_52%_88%,#db277708_0%,transparent_38%)] dark:bg-[radial-gradient(circle_at_16%_18%,#60a5fa12_0%,transparent_34%),radial-gradient(circle_at_82%_16%,#a78bfa10_0%,transparent_32%),radial-gradient(circle_at_52%_88%,#f472b60d_0%,transparent_38%)]"
      />

      <section class="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl items-center px-6 py-20 sm:px-8 lg:px-12">
        <div class="max-w-2xl">
          <p class="text-sm font-medium tracking-[0.18em] uppercase opacity-65">
            Ferupis
          </p>
          <h1 class="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
            UI foundation placeholder
          </h1>
          <p class="mt-5 max-w-xl text-base leading-7 opacity-75 sm:text-lg">
            Neutral surface, theme-aware honeycomb mask and low-intensity brand
            lighting. Final palette and typography will be defined after contrast
            validation.
          </p>
        </div>
      </section>
    </main>
  );
});

export const head: DocumentHead = {
  title: "Ferupis",
  meta: [
    {
      name: "description",
      content: "Ferupis — apicoltura, api e prodotti dell'alveare.",
    },
  ],
};
