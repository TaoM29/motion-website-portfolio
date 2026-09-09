# Taofik Muhriz — Personal Portfolio

A personal portfolio with a floating, pointer-responsive portrait, a black/silver/crimson palette, project filters, background, skills, interests, and contact links. Respects reduced-motion preferences and includes responsive layouts and keyboard focus styles.

## Content

Edit `app/portfolio.ts` to update the profile, projects, and contacts. Current content is based on Taofik’s CV, the September 2026 project and skills banks, and his directly supplied interests. Project statuses distinguish completed research from ongoing product work. No original CV files are included in the published site.

## Development

Use Node.js 22.13 or later. Run `npm install` and `npm run dev`.

## Validation

Run `npm run build` and `npx tsc --noEmit --incremental false`.

## Portrait

`public/images/personal-avatar.png` was created with built-in imagegen from Taofik’s supplied photo and the original character style reference. Browser animation adds a subtle floating movement and pointer-following tilt. The finished image uses a near-black background blended into the hero.

Final corrective image prompt:

> Correct the generated shoulder bust using the original polished 3D cartoon style and the real adult person's identity. Make a stylized 3D character with larger expressive brown eyes and smooth sculpted forms, preserving the recognizable face, short black hair, thick eyebrows, warm complexion, striped open-collar shirt and silver chain. Replace the checkerboard with uniform near-black #08090b. Full centered head and shoulder bust, all silhouette edges inside the portrait canvas. Soft silver studio lighting and subtle crimson rim highlights. No earrings, tall hairstyle, superhero elements, props, text, or watermark.

## Suit portrait update

The current asset is `public/images/personal-avatar-suit.png`, edited with built-in imagegen. The hover movement now follows the pointer up to 72px horizontally and 56px vertically with spring easing and a gentle tilt. The stationary hover region avoids movement feedback; reduced-motion preferences disable the effect.

Image edit prompt: Change only the clothing to a tailored charcoal suit jacket, crisp white collared shirt buttoned to the neck, and neatly knotted deep burgundy tie. Cover the necklace. Preserve the original face, identity, expression, hair, 3D style, proportions, rounded bust framing, 1024×1536 canvas, lighting and dark background. No text, logos, accessories or new objects.
