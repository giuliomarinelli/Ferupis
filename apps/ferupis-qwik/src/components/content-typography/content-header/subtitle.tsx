import { component$, type Component } from "@builder.io/qwik";
import { ContainerTag, Poly } from "~/components/UI/poly";

export type SubtitleProps = {
  component: Component;
};

type DefaultSubtitleProps = {
  text: string
  tag?: ContainerTag
}

export type DefaultSubtitleProjectedProps = Omit<DefaultSubtitleProps, 'text'>

export const DefaultSubtitle = component$<DefaultSubtitleProps>((props) => (
  <Poly as={props.tag ?? 'p'} class="mt-5 max-w-xl text-base leading-7 opacity-75 sm:text-lg">
    {props.text}
  </Poly>
))

export const DefaultSubtitleProjected = component$<DefaultSubtitleProps>((props) => (
  <Poly as={props.tag ?? 'p'} class="mt-5 max-w-xl text-base leading-7 opacity-75 sm:text-lg">
    {props.text}
  </Poly>
))

export const Subtitle = component$<SubtitleProps>(({ component: Component }) => (
  <Component />
));
