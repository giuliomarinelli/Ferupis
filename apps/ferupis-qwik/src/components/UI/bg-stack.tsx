import { component$ } from "@builder.io/qwik";

export const BgStack = component$(() => (
    <>
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
    </>
))