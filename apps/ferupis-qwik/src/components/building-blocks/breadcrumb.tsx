import { component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import type { BreadcrumbItem } from "~/generated/breadcrumbs";

type BreadcrumbProps = {
  items: readonly BreadcrumbItem[];
};

export const Breadcrumb = component$<BreadcrumbProps>((props) => (
  <nav aria-label="Percorso di navigazione" class="bg-transparent">
    <ol class="2xs:px-4 xs:px-5 relative z-10 mx-auto flex w-full max-w-7xl min-w-0 items-center gap-2 overflow-x-auto px-3 py-3 text-xs whitespace-nowrap text-slate-600 [scrollbar-width:none] sm:gap-2.5 sm:py-3.5 sm:text-sm dark:text-slate-400 [&::-webkit-scrollbar]:hidden">
      {props.items.map((item, index) => {
        const isCurrent = index === props.items.length - 1;

        return (
          <li
            key={item.href}
            class="flex min-w-0 items-center gap-2 sm:gap-2.5"
          >
            {index > 0 ? (
              <span
                aria-hidden="true"
                class="size-1.5 shrink-0 -rotate-45 border-r border-b border-light-primary dark:border-bright-primary"
              />
            ) : null}
            {isCurrent ? (
              <span
                aria-current="page"
                class="font-semibold text-slate-900 dark:text-slate-100"
              >
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                class="text-light-accent dark:text-bright-accent rounded-sm font-semibold transition-colors hover:text-indigo-800 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-indigo-600 dark:hover:text-indigo-200 dark:focus-visible:outline-indigo-300"
              >
                {item.label}
              </Link>
            )}
          </li>
        );
      })}
    </ol>
  </nav>
));
