# Taofik Muhriz — Portfolio

My personal portfolio showcasing data science, software, and client projects, with responsive layouts and scroll animations.

**Live site:** [builtbytaofik.com](https://builtbytaofik.com)

Built with React, TypeScript, Vite, Tailwind CSS, Framer Motion, and Three.js. Pages are prerendered for search engines and deployed on Vercel.

## Run locally

Requires Node.js **22.13+**.

```sh
npm ci
npm run dev
```

## Commands

- `npm run build` — build the production site.
- `npm run start` — preview the production build.
- `npm test` — build and run all SEO and physics tests.
- `npx tsc --noEmit` — check TypeScript.
- `npm run lint` — run the linter.
- `npm run images` — regenerate optimized images.

## Update content

Edit `app/portfolio.ts` for projects, profile, and contact details. Images live in `public/images`; site metadata lives in `app/site.ts`.
