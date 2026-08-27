import { component$, type Component } from "@builder.io/qwik";

export type SubtitleProps = {
  component: Component;
};

export const Subtitle = component$<SubtitleProps>(({ component: Component }) => (
  <Component />
));
