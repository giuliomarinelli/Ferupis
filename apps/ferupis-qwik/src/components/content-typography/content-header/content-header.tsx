import { component$, Slot } from "@builder.io/qwik";
import { Poly, type ContainerTag } from "~/components/UI/poly";

export type ContentHeaderRootProps = {
  tag?: ContainerTag;
  class?: string | string[];
  classOverride?: string | string[];
};

export const Root = component$<ContentHeaderRootProps>((props) => (
  <Poly
    as={props.tag ?? "header"}
    class={[props.classOverride ?? "max-w-2xl", props.class ?? ""]}
  >
    <Slot />
  </Poly>
));
