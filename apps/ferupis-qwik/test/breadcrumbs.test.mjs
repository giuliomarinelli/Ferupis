import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import test from "node:test";
import {
  buildBreadcrumbManifest,
  renderBreadcrumbModule,
} from "../scripts/generate-breadcrumbs.mjs";
import {
  SITE_ROUTE_REGISTRY,
  toSiteRoutePath,
} from "../src/config/routes.ts";

const APP_ROOT = resolve(import.meta.dirname, "..");

test("generates breadcrumbs from home to the current route", () => {
  const manifest = buildBreadcrumbManifest({
    registry: SITE_ROUTE_REGISTRY,
    toSiteRoutePath,
  });

  assert.deepEqual(manifest.leApi, [
    { label: "Home", href: "/" },
    { label: "Le Api", href: "/le-api/" },
  ]);
  assert.equal(manifest.home, undefined);
});

test("omits disconnected routes and rejects invalid parent chains", () => {
  const disconnected = buildBreadcrumbManifest({
    registry: {
      home: { label: "Home" },
      detached: { label: "Altro", parent: null },
      child: { label: "Figlio", parent: "detached" },
    },
    toSiteRoutePath: () => "/",
  });

  assert.equal(disconnected.detached, undefined);
  assert.equal(disconnected.child, undefined);

  assert.throws(
    () =>
      buildBreadcrumbManifest({
        registry: {
          home: { label: "Home" },
          child: { label: "Figlio", parent: "missing" },
        },
        toSiteRoutePath: () => "/",
      }),
    /unknown breadcrumb parent "missing"/,
  );

  assert.throws(
    () =>
      buildBreadcrumbManifest({
        registry: {
          home: { label: "Home" },
          first: { label: "Primo", parent: "second" },
          second: { label: "Secondo", parent: "first" },
        },
        toSiteRoutePath: () => "/",
      }),
    /parent cycle detected/,
  );
});

test("keeps the committed static module synchronized with the route registry", async () => {
  const manifest = buildBreadcrumbManifest({
    registry: SITE_ROUTE_REGISTRY,
    toSiteRoutePath,
  });
  const generatedSource = await readFile(
    resolve(APP_ROOT, "src/generated/breadcrumbs.ts"),
    "utf8",
  );

  assert.equal(generatedSource, renderBreadcrumbModule(manifest));
});
