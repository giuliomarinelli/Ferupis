export const resolve = (specifier, context, nextResolve) => {
  if (specifier.startsWith("~/")) {
    const sourcePath = specifier.slice(2);
    const resolvedPath = /\.[^/]+$/.test(sourcePath)
      ? sourcePath
      : `${sourcePath}.ts`;

    return {
      shortCircuit: true,
      url: new URL(`../src/${resolvedPath}`, import.meta.url).href,
    };
  }

  return nextResolve(specifier, context);
};
