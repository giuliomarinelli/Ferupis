import { component$, Slot } from "@builder.io/qwik";
import { useLocation } from "@builder.io/qwik-city";
import { ThemeProvider } from "@gm/qwik-core";
import { Breadcrumb } from "~/components/building-blocks/breadcrumb";
import { resolveSiteRoutePathname } from "~/config/routes";
import { BREADCRUMBS_BY_ROUTE } from "~/generated/breadcrumbs";
import { Footer } from "~/components/layout/footer";
import { Header } from "~/components/layout/header";
import { BgStack } from "~/components/UI/bg-stack";

export default component$(() => {
  const location = useLocation();
  const route = resolveSiteRoutePathname(location.url.pathname);
  const breadcrumbItems = route
    ? BREADCRUMBS_BY_ROUTE[route.routeKey]
    : undefined;

  return (
    <ThemeProvider>
      <div class="relative isolate flex min-h-screen flex-col overflow-x-clip bg-slate-50 text-neutral-950 dark:bg-neutral-950 dark:text-slate-50">
        <BgStack />
        <Header />
        {breadcrumbItems ? <Breadcrumb items={breadcrumbItems} /> : null}
        <div class="flex flex-1 flex-col">
          <Slot />
        </div>
        <Footer />
      </div>
    </ThemeProvider>
  );
});
