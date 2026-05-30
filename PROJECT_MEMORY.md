# Project Memory

## Deployment

- Project path: `D:\tools\math-course`
- GitHub repository: `https://github.com/shihjcnpk/math-course.git`
- Main branch: `main`
- Cloudflare deployed URL: `https://math-course.shihjcn.workers.dev`
- Cloudflare deployment mode: Workers static assets with `npx wrangler deploy`
- Build command: `npm run build`
- Deploy command: `npx wrangler deploy`
- Output directory: `dist`
- Root directory: empty
- `wrangler.jsonc` is required. It points assets to `./dist` and uses `not_found_handling: "single-page-application"` for React Router deep links like `/lectures/4`.
- Do not add `public/_redirects`; Wrangler reported an infinite loop with that file.

## Git

- Local repository has been initialized.
- Git user for this repo:
  - name: `shihj`
  - email: `shihj@sina.cn`
- Initial commit: `471e589 Initial math course site`
- Cloudflare deployment fix commit: `eaf1ca6 Add Wrangler static assets config`

## Verification

- Production site was checked in browser.
- Homepage loaded successfully.
- Direct route `https://math-course.shihjcn.workers.dev/lectures/4` loaded successfully.
- Visible raw LaTeX check on lecture 4 passed after formula rendering fixes.

## Maintenance Workflow

1. Edit code/content locally.
2. Run `npm run lint`.
3. Run `npm run build`.
4. Commit changes.
5. Push to `origin main`.
6. Cloudflare automatically rebuilds and deploys.
