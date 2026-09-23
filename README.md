# Taofik Muhriz — Personal Portfolio

A personal portfolio with a floating, pointer-responsive portrait, a black/silver/crimson palette, project filters, background, skills, interests, and contact links. Respects reduced-motion preferences and includes responsive layouts and keyboard focus styles.

## Content

Edit `app/portfolio.ts` to update the profile, projects, and contacts. Current content is based on Taofik’s CV, the September 2026 project and skills banks, and his directly supplied interests. Project statuses distinguish completed research from ongoing product work. No original CV files are included in the published site.

## Development

Use Node.js 22.13 or later. Run `npm install` and `npm run dev`.

## Validation

Run `npm run build` and `npx tsc --noEmit --incremental false`.

## Search and indexing

Production is **https://builtbytaofik.com/** on Vercel, deployed from GitHub `main`. The `.openai/hosting.json` file refers to an older private Sites copy, not this public domain.

`npm run build` builds the client, renders the same React components into HTML for the homepage and each `/projects/<slug>` route, and generates `robots.txt`, `sitemap.xml` and a noindex 404 document. No browser or JavaScript execution is needed to read the page content. React hydrates that HTML to enable the existing interactions. Text stays visible before hydration and without scrolling. Vercel serves the individual pages with clean URLs; do not add a catch-all SPA rewrite because it would turn nonexistent routes into soft 404s.

Edit `app/portfolio.ts` for project content and stable slugs. Each project receives a page, homepage link and sitemap entry automatically. Preserve published slugs or add permanent redirects when changing them. `app/site.ts` owns canonical origin, metadata and truthful Person, WebSite, ProfilePage, CreativeWork and breadcrumb structured data. Do not add unbuilt projects or fabricated achievements. No `lastmod` dates are emitted until a maintained per-page modification date is available.

Run `npm run images` after updating source PNGs and commit the generated WebP assets and social JPEG. Run `npm run build` followed by `npm run test:seo` to check raw HTML content, unique metadata, JSON-LD, canonical URLs, sitemap coverage, internal links, image assets and the error document. Use Node 22.13+ for the built-in TypeScript support in tests. `npm run start` previews the production HTML locally; `npm run dev` provides interactive development.

The Google verification meta tag in `index.html` belongs to the owner's Search Console URL-prefix property `https://builtbytaofik.com/`. Keep it after verification. Submit `https://builtbytaofik.com/sitemap.xml`, inspect the homepage and a project page with Google's live test, and request indexing. A successful live test confirms eligibility, not inclusion or ranking; Google's crawl and indexing decisions are asynchronous. Existing HTTP and www domain redirects should continue pointing to the HTTPS apex domain. Vercel previews should retain deployment protection or `X-Robots-Tag: noindex`.

## Portrait

`public/images/personal-avatar.png` was created with built-in imagegen from Taofik’s supplied photo and the original character style reference. Browser animation adds a subtle floating movement and pointer-following tilt. The finished image uses a near-black background blended into the hero.

Final corrective image prompt:

> Correct the generated shoulder bust using the original polished 3D cartoon style and the real adult person's identity. Make a stylized 3D character with larger expressive brown eyes and smooth sculpted forms, preserving the recognizable face, short black hair, thick eyebrows, warm complexion, striped open-collar shirt and silver chain. Replace the checkerboard with uniform near-black #08090b. Full centered head and shoulder bust, all silhouette edges inside the portrait canvas. Soft silver studio lighting and subtle crimson rim highlights. No earrings, tall hairstyle, superhero elements, props, text, or watermark.

## Suit portrait update

The current asset is `public/images/personal-avatar-suit.png`, edited with built-in imagegen. The hover movement now follows the pointer up to 112px horizontally, limited by available space and 94px vertically with spring easing and a gentle tilt. The stationary hover region extends 180px around the portrait and avoids movement feedback; reduced-motion preferences disable the effect.

Image edit prompt: Change only the clothing to a tailored charcoal suit jacket, crisp white collared shirt buttoned to the neck, and neatly knotted deep burgundy tie. Cover the necklace. Preserve the original face, identity, expression, hair, 3D style, proportions, rounded bust framing, 1024×1536 canvas, lighting and dark background. No text, logos, accessories or new objects.

## Page motion

The introduction uses a two-column layout on larger screens and stacks without overlap on phones. A timer reveals actual text and retains it after typing, with crimson cursors that fade after each line. Section labels use crimson text without numerical prefixes. Subtle portrait parallax, staggered skill and interest lists, section rules, project reveals, and the contact entrance follow native scrolling. Reduced-motion preferences disable typing, parallax, and pointer motion while keeping content visible.

## Browser regression checks

The September 2026 introduction fix was checked in Chrome: the full greeting remains visible after typing, both cursors fade, the portrait follows the pointer and returns to centre, project filters return the expected entries, and desktop, tablet, and phone layouts have no horizontal overflow. Reduced-motion mode shows the complete greeting immediately. The earlier one-millisecond CSS step animation could finish with fractional progress just below 1 and retain zero opacity; the text no longer depends on that animation.
