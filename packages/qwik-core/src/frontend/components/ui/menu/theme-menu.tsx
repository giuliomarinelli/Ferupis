import { $, component$, useStore, useVisibleTask$ } from "@builder.io/qwik";
import { useTheme } from "../../../contexts/theme/use-theme";
import { CheckIcon, MoonIcon, SunIcon } from "../icons/icons";

const THEME_MENU_LG_ID = "theme-lg-menu";

export type ToggleThemeBtnProps = {
  themeMenuLgState: ThemeMenuState;
  isCallRoute?: boolean;
};

export type ToggleThemeMenuBtnProps = Pick<
  ToggleThemeBtnProps,
  "isCallRoute"
>;

export interface ThemeMenuState {
  isOpened: boolean;
  isMounted: boolean;
  isVisible: boolean;
}

/**
 *
 * Le icone trigger svg devono restare identiche. Il menu deve invece acquisire
 * lo stesso stile di design del menu contestuale mobile.
 *
 */

const ToggleThemeMenu = component$<ToggleThemeBtnProps>(
  ({ themeMenuLgState: menuState }) => {
    const { state: themeState, setTheme } = useTheme();
    const labelThemeMenu = "Menu selezione tema";
    const labelLight = "Tema chiaro";
    const labelDark = "Tema scuro";
    const labelAuto = "Tema automatico";

    // gestione mount / animazione visibilità
    // eslint-disable-next-line qwik/no-use-visible-task
    useVisibleTask$(({ track, cleanup }) => {
      track(() => menuState.isOpened);

      if (menuState.isOpened) {
        menuState.isMounted = true;
        let visibilityFrame: number | undefined;
        const mountFrame = requestAnimationFrame(() => {
          visibilityFrame = requestAnimationFrame(() => {
            menuState.isVisible = true;
          });
        });

        cleanup(() => {
          cancelAnimationFrame(mountFrame);
          if (visibilityFrame !== undefined) {
            cancelAnimationFrame(visibilityFrame);
          }
        });
      } else {
        menuState.isVisible = false;
        const unmountTimer = window.setTimeout(() => {
          menuState.isMounted = false;
        }, 250);

        cleanup(() => window.clearTimeout(unmountTimer));
      }
    });

    /**
     * ESC per chiudere + click fuori per chiudere
     */
    // eslint-disable-next-line qwik/no-use-visible-task
    useVisibleTask$(({ track, cleanup }) => {
      track(() => menuState.isOpened);

      if (!menuState.isOpened) return;

      const handleKeyUp = (event: KeyboardEvent) => {
        if (event.key === "Escape" || event.key === "Esc") {
          menuState.isOpened = false;
        }
      };

      const handleClickOutside = (event: MouseEvent) => {
        const menuEl = document.getElementById(THEME_MENU_LG_ID);
        if (!menuEl) return;

        const target = event.target as Node | null;
        if (target && !menuEl.contains(target)) {
          menuState.isOpened = false;
        }
      };

      document.addEventListener("keyup", handleKeyUp);
      document.addEventListener("click", handleClickOutside);

      cleanup(() => {
        document.removeEventListener("keyup", handleKeyUp);
        document.removeEventListener("click", handleClickOutside);
      });
    });

    const handleSetLight = $(() => {
      setTheme("light");
      menuState.isOpened = false;
    });

    const handleSetDark = $(() => {
      setTheme("dark");
      menuState.isOpened = false;
    });

    const handleSetAuto = $(() => {
      setTheme("OS");
      menuState.isOpened = false;
    });

    if (!menuState.isMounted) return null;

    return (
      <div
        id={THEME_MENU_LG_ID}
        role="region"
        aria-label={labelThemeMenu}
        aria-hidden={!menuState.isVisible}
        class={`
                font-sans
                absolute top-14 right-0 z-900
                w-64 rounded-md shadow-lg bg-slate-50 dark:bg-neutral-900
                text-sm leading-relaxed
                transform transition-all duration-200 ease-out
                ${
                  menuState.isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 -translate-y-2 pointer-events-none"
                }
      `}
      >
        <div class="py-1 px-1 space-y-1">
          {/* Tema chiaro */}
          <button
            type="button"
            onClick$={handleSetLight}
            aria-pressed={themeState.choice === "light"}
            class={`cursor-pointer
                        flex items-center justify-between w-full px-3 py-2 rounded-md
                        hover:bg-slate-200/60 dark:hover:bg-slate-800/70
                        transition-colors duration-200
                        ${
                          themeState.choice === "light"
                            ? "bg-slate-200 dark:bg-slate-700"
                            : ""
                        }
          `}
          >
            <span class="flex items-center gap-2">
              <span aria-hidden="true">
                <SunIcon class="size-5 fill-current text-slate-500 dark:text-slate-200" />
              </span>
              <span>{labelLight}</span>
            </span>
            {themeState.choice === "light" && (
              <span aria-hidden="true">
                <CheckIcon class="h-4 w-4 text-light-success dark:text-bright-success" />
              </span>
            )}
          </button>

          {/* Tema scuro */}
          <button
            type="button"
            onClick$={handleSetDark}
            aria-pressed={themeState.choice === "dark"}
            class={`cursor-pointer
            flex items-center justify-between w-full px-3 py-2 rounded-md
            hover:bg-slate-200/60 dark:hover:bg-slate-800/70
            transition-colors duration-200
            ${
              themeState.choice === "dark"
                ? "bg-slate-200 dark:bg-slate-700"
                : ""
            }
          `}
          >
            <span class="flex items-center gap-2">
              <span aria-hidden="true">
                <MoonIcon class="size-5 fill-current text-slate-500 dark:text-slate-200" />
              </span>
              <span>{labelDark}</span>
            </span>
            {themeState.choice === "dark" && (
              <span aria-hidden="true">
                <CheckIcon class="h-4 w-4 text-light-success dark:text-bright-success" />
              </span>
            )}
          </button>

          {/* Tema automatico */}
          <button
            type="button"
            onClick$={handleSetAuto}
            aria-pressed={themeState.choice === "OS"}
            class={`cursor-pointer
            flex items-center justify-between w-full px-3 py-2 rounded-md
            hover:bg-slate-200/60 dark:hover:bg-slate-800/70
            transition-colors duration-200
            ${
              themeState.choice === "OS" ? "bg-slate-200 dark:bg-slate-700" : ""
            }
          `}
          >
            <span class="flex items-center gap-2">
              {themeState.osTheme === "dark" && (
                <span aria-hidden="true">
                  <MoonIcon class="size-5 fill-current text-slate-500 dark:text-slate-200" />
                </span>
              )}
              {themeState.osTheme === "light" && (
                <span aria-hidden="true">
                  <SunIcon class="size-5 fill-current text-slate-500 dark:text-slate-200" />
                </span>
              )}
              {!themeState.osTheme && (
                <span aria-hidden="true">
                  <MoonIcon class="h-4 w-4 fill-current text-slate-500 dark:text-slate-200" />
                </span>
              )}
              <span>{labelAuto}</span>
            </span>
            {themeState.choice === "OS" && (
              <span aria-hidden="true">
                <CheckIcon class="h-4 w-4 text-light-success dark:text-bright-success" />
              </span>
            )}
          </button>
        </div>
      </div>
    );
  },
);

export const ToggleThemeBtn = component$<ToggleThemeBtnProps>(
  ({ themeMenuLgState: menuState, isCallRoute }) => {
    const { state } = useTheme();
    const { theme } = state;
    const openLabel = "Apri il menu di selezione del tema";
    const closeLabel = "Chiudi il menu di selezione del tema";

    const toggleThemeMenu = $(() => {
      menuState.isOpened = !menuState.isOpened;
    });

    const prefetchThemeMenu = $(() => {
      if (!menuState.isMounted) {
        menuState.isMounted = true;
        menuState.isVisible = false;
      }
    });

    return (
      <div
        class={[
          "relative flex",
          isCallRoute ? "mr-0" : "mr-0 xs:mr-1 lg:mr-2",
        ]}
      >
        <button
          type="button"
          class={[
            "cursor-pointer flex items-center justify-center size-10 rounded-full theme-toggle-button",
            "transition-all duration-500 hover:bg-slate-300/65 dark:hover:bg-white/15",
            "focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-light-primary",
            "origin-right hover:scale-105",
          ]}
          title={menuState.isOpened ? closeLabel : openLabel}
          aria-label={menuState.isOpened ? closeLabel : openLabel}
          aria-expanded={menuState.isOpened}
          aria-controls={THEME_MENU_LG_ID}
          onClick$={toggleThemeMenu}
          onMouseEnter$={prefetchThemeMenu}
          onFocus$={prefetchThemeMenu}
          onTouchStart$={prefetchThemeMenu}
        >
          {theme === "dark" && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-7 w-7 fill-current text-slate-100 hover:text-slate-300 transition-colors duration-300"
              viewBox="0 0 384 512"
              aria-hidden="true"
              focusable="false"
            >
              <path d="M223.5 32C100 32 0 132.3 0 256S100 480 223.5 480c60.6 0 115.5-24.2 155.8-63.4c5-4.9 6.3-12.5 3.1-18.7s-10.1-9.7-17-8.5c-9.8 1.7-19.8 2.6-30.1 2.6c-96.9 0-175.5-78.8-175.5-176c0-65.8 36-123.1 89.3-153.3c6.1-3.5 9.2-10.5 7.7-17.3s-7.3-11.9-14.3-12.5c-6.3-.5-12.6-.8-19-.8z" />
            </svg>
          )}
          {theme === "light" && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              viewBox="0 0 512 512"
              aria-hidden="true"
              focusable="false"
            >
              <path
                class="fill-current text-blue-200"
                d="M208 256a48 48 0 1 0 96 0 48 48 0 1 0 -96 0z"
              />
              <path
                class="fill-current text-light-on-surface-secondary"
                d="M232 88l0 24 48 0 0-24 0-64 0-24L232 0l0 24 0 64zm24 120a48 48 0 1 1 0 96 48 48 0 1 1 0-96zm0 144a96 96 0 1 0 0-192 96 96 0 1 0 0 192zM0 232l0 48 24 0 64 0 24 0 0-48-24 0-64 0L0 232zm424 0l-24 0 0 48 24 0 64 0 24 0 0-48-24 0-64 0zM232 512l48 0 0-24 0-64 0-24-48 0 0 24 0 64 0 24zM92 58L58 92l17 17 45.3 45.3 17 17 33.9-33.9-17-17L108.9 75 92 58zM391.8 357.8l-17-17-33.9 33.9 17 17L403.1 437l17 17L454 420l-17-17-45.3-45.3zM58 420L92 454l17-17 45.3-45.3 17-17-33.9-33.9-17 17L75 403.1 58 420zM357.8 120.2l-17 17 33.9 33.9 17-17L437 108.9l17-17L420 58l-17 17-45.3 45.3z"
              />
            </svg>
          )}
        </button>
        <ToggleThemeMenu themeMenuLgState={menuState} />
      </div>
    );
  },
);

export const ToggleThemeMenuBtn = component$<ToggleThemeMenuBtnProps>(
  ({ isCallRoute }) => {
    const themeMenuState = useStore<ThemeMenuState>({
      isOpened: false,
      isMounted: false,
      isVisible: false,
    });

    return (
      <ToggleThemeBtn
        themeMenuLgState={themeMenuState}
        isCallRoute={isCallRoute}
      />
    );
  },
);
