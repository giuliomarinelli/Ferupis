import {
  component$,
  Slot,
  type FunctionComponent,
  type PropsOf,
} from '@builder.io/qwik';

export type ContainerTag =
  | 'div'
  | 'section'
  | 'article'
  | 'aside'
  | 'nav'
  | 'header'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'

export const Poly = component$(
  <C extends string | FunctionComponent = 'div'>({
    as,
    ...props
  }: {
    as?: C extends ContainerTag ? C : never;
  } & PropsOf<string extends C ? 'div' : C>) => {
    const Component = as || 'div';

    return (
      <Component {...props}>
        <Slot />
      </Component>
    );
  },
);