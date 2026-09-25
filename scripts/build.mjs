import { mkdir, readFile, writeFile, rm } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { build } from 'vite';

process.env.NODE_ENV = 'production';
await build();
await build({ build: { ssr: 'src/entry-server.tsx', outDir: '.prerender', emptyOutDir: true } });
try {
  const { render, portfolio, site, pageMetadata, projectPath } = await import(pathToFileURL(resolve('.prerender/entry-server.js')).href);
  const template = await readFile('dist/index.html', 'utf8');
  const escape = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
  const paths = ['/', ...portfolio.projects.map(projectPath)];
  if (new Set(paths).size !== paths.length) throw new Error('Project slugs must be unique');
  for (const path of [...paths, '/404']) {
    const meta = pageMetadata(path);
    const head = [
      `<title>${escape(meta.title)}</title>`,
      `<meta name="description" content="${escape(meta.description)}" />`,
      `<meta name="author" content="${escape(site.name)}" />`,
      `<meta name="robots" content="${meta.missing ? 'noindex, follow' : 'index, follow, max-image-preview:large'}" />`,
      ...(!meta.missing ? [
        `<link rel="canonical" href="${meta.url}" />`,
        `<meta property="og:type" content="website" />`,
        `<meta property="og:site_name" content="${escape(site.name)}" />`,
        `<meta property="og:locale" content="en_GB" />`,
        `<meta property="og:url" content="${meta.url}" />`,
        `<meta property="og:title" content="${escape(meta.title)}" />`,
        `<meta property="og:description" content="${escape(meta.description)}" />`,
        `<meta property="og:image" content="${meta.image}" />`,
        `<meta property="og:image:width" content="1200" />`,
        `<meta property="og:image:height" content="630" />`,
        `<meta property="og:image:alt" content="Taofik Muhriz — Data Science, AI and Software" />`,
        `<meta name="twitter:card" content="summary_large_image" />`,
        `<meta name="twitter:title" content="${escape(meta.title)}" />`,
        `<meta name="twitter:description" content="${escape(meta.description)}" />`,
        `<meta name="twitter:image" content="${meta.image}" />`,
        `<meta name="twitter:image:alt" content="Taofik Muhriz — Data Science, AI and Software" />`,
        `<script type="application/ld+json">${JSON.stringify(meta.structuredData).replace(/</g, '\\u003c')}</script>`,
      ] : []),
    ].join('\n    ');
    const html = template.replace('<!--page-head-->', head).replace('<!--page-content-->', render(path));
    const output = path === '/' ? 'dist/index.html' : `dist${path}.html`;
    await mkdir(dirname(output), { recursive: true });
    await writeFile(output, html);
  }
  await writeFile('dist/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${paths.map(path => `  <url><loc>${escape(site.origin + path)}</loc></url>`).join('\n')}\n</urlset>\n`);
  await writeFile('dist/robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${site.origin}/sitemap.xml\n`);
  console.log(`Prerendered ${paths.length} indexable pages, a 404 page, robots.txt and sitemap.xml.`);
} finally {
  await rm('.prerender', { recursive: true, force: true });
}
