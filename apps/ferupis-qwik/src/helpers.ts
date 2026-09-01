export type CamelCase<S extends string> =
  S extends `${infer Head}-${infer Tail}`
    ? `${CamelCase<Head>}${Capitalize<CamelCase<Tail>>}`
    : S extends `${infer Head}_${infer Tail}`
      ? `${CamelCase<Head>}${Capitalize<CamelCase<Tail>>}`
      : Lowercase<S>;

export const toCamelCase = <const T extends string>(
  value: T,
): CamelCase<T> =>
  value
    .trim()
    .replace(/^[-_]+|[-_]+$/g, "")
    .toLowerCase()
    .replace(
      /[-_]+([\p{L}\p{N}])/gu,
      (_, char: string) => char.toUpperCase(),
    ) as CamelCase<T>