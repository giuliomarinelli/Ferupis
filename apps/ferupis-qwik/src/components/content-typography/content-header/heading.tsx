import { component$ } from "@builder.io/qwik";
import { Poly, type ContainerTag } from "~/components/UI/poly";

export type HeadingProps = {
  class?: string | string[];
  classOverride?: string | string[];
  text: string;
  tag?: Extract<
    ContainerTag,
    "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
  >;
};

export const Heading = component$<HeadingProps>((props) => (
  <Poly
    as={props.tag ?? "h6"}
    class={[
      props.classOverride ??
        "mt-4 text-4xl font-semibold tracking-tight sm:text-5xl",
      props.class ?? "",
    ]}
  >
    {props.text}
  </Poly>
));

