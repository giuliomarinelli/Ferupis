# GitHub Actions deployment setup

The workflows build one tested Cloudflare Pages artifact and reuse that exact
artifact for preview and production deployment.

## One-time Cloudflare setup

Create the Direct Upload Pages project with `master` as its production branch:

```bash
npx wrangler pages project create ferupis --production-branch master
```

In the GitHub repository configure:

- repository or environment variable `CLOUDFLARE_ACCOUNT_ID`;
- environment secret `CLOUDFLARE_API_TOKEN`, with Cloudflare Pages Write access;
- GitHub environments named `preview` and `production`.

Production protection rules can be added to the `production` environment. If
the Pages project is connected to Git, disable its automatic builds to avoid a
second deployment alongside GitHub Actions.

## Branch deployments

- pushes to `preview` deploy to `https://preview.ferupis.pages.dev`;
- pushes to `master` deploy to `https://ferupis.pages.dev`;
- both deployment workflows can also be run manually from their matching
  branch.

The production workflow writes both the new deployment ID and the previous one
to its job summary. A known-good production ID can be supplied to the rollback
workflow.

## Manual Markdown release notes

GitHub Actions inputs do not provide a multiline Markdown editor. Use GitHub's
release editor instead:

1. Open **Releases** and select **Draft a new release**.
2. Choose the tag and target commit on `master`.
3. Write and preview the Markdown notes in **Describe this release**.
4. Select **Save draft** rather than publishing it.
5. Run the **Publish release** workflow and enter the same tag.

The workflow verifies that the release commit has a successful production
deployment, then publishes the existing draft without replacing its notes.
