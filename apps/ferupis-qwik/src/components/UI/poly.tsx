import {
  component$,
  Slot,
  type HTMLAttributes,
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
  | 'p'

export type PolyProps = {
  as?: ContainerTag;
} & Omit<HTMLAttributes<HTMLElement>, 'ref'>;

export const Poly = component$<PolyProps>(({ as, ...props }) => {
  const Component = as || 'div';

  return (
    <Component {...props}>
      <Slot />
    </Component>
  );
});
