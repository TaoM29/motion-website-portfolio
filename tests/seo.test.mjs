import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import test from 'node:test';
import { portfolio } from '../app/portfolio.ts';

const origin = 'https://builtbytaofik.com';
const paths = ['/', ...portfolio.projects.map(project => `/projects/${project.slug}`)];
const readPage = path => readFileSync(path === '/' ? 'dist/index.html' : `dist${path}.html`, 'utf8');
const escape = value => value.replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;' })[char]);

void test('every canonical route has substantive HTML without executing JavaScript', () => {
  for (const path of paths) {
    const html = readPage(path);
    assert.match(html, /<html lang="en">/);
    assert.equal((html.match(/<h1[\s>]/g) || []).length, 1, path);
    assert.match(html, /<main[\s>]/);
    assert.ok(!html.includes('<!--page-'), path);
    assert.ok(!/opacity:\s*0[;"}]/.test(html), `Invisible prerendered content: ${path}`);
    assert.ok(!html.includes('noindex'), path);
    const project = portfolio.projects.find(item => path.endsWith(`/${item.slug}`));
    if (project) {
      assert.ok(html.includes(escape(project.description)), path);
      for (const detail of project.details ?? []) assert.ok(html.includes(escape(detail.text)), path);
    } else {
      assert.ok(html.includes(escape(portfolio.introduction)));
      for (const item of portfolio.projects) assert.ok(html.includes(escape(item.title)));
      assert.match(html, /class="typed-output">Hi, I’m/);
    }
  }
});

void test('metadata, social previews and structured data are specific to each page', () => {
  const titles = new Set();
  for (const path of paths) {
    const html = readPage(path);
    assert.equal((html.match(/rel="canonical"/g) || []).length, 1);
    assert.ok(html.includes(`<link rel="canonical" href="${origin}${path}"`));
    assert.ok(html.includes(`<meta property="og:url" content="${origin}${path}"`));
    assert.match(html, /name="description" content="[^"]{30,}"/);
    assert.match(html, /name="twitter:card" content="summary_large_image"/);
    assert.match(html, /property="og:image" content="https:\/\/builtbytaofik.com\/images\/social-card.jpg"/);
    const title = html.match(/<title>(.*?)<\/title>/)[1];
    assert.ok(!titles.has(title), path); titles.add(title);
    const data = JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1]);
    const page = data['@graph'].find(item => ['ProfilePage', 'WebPage'].includes(item['@type']));
    assert.equal(page.url, `${origin}${path}`);
    assert.ok(data['@graph'].some(item => item['@id'] === page.mainEntity['@id']));
    if (path !== '/') assert.equal(data['@graph'].find(item => item['@type'] === 'BreadcrumbList').itemListElement[1].item, `${origin}${path}`);
  }
});

void test('sitemap and crawlable homepage links cover exactly the real project routes', () => {
  const sitemap = readFileSync('dist/sitemap.xml', 'utf8');
  const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(match => match[1]);
  assert.deepEqual(urls, paths.map(path => origin + path));
  assert.equal(new Set(urls).size, urls.length);
  for (const path of paths.slice(1)) assert.ok(readPage('/').includes(`href="${path}"`));
  assert.equal(readFileSync('dist/robots.txt', 'utf8'), `User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml\n`);
});

void test('all local links and image assets resolve in the release', () => {
  for (const path of paths) {
    const html = readPage(path);
    for (const [, href] of html.matchAll(/href="(\/[^"]*)"/g)) {
      const target = href.split('#')[0];
      assert.ok(paths.includes(target) || existsSync(`dist${target}`), `${path}: ${href}`);
    }
    for (const [tag, src] of html.matchAll(/<img[^>]*src="([^"]+)"[^>]*>/g)) {
      assert.ok(existsSync(`dist${src}`), `${path}: ${src}`);
      assert.match(tag, /\balt="[^"]*"/);
      assert.match(tag, /\bwidth="\d+"/);
      assert.match(tag, /\bheight="\d+"/);
    }
  }
});

void test('missing routes have an error document and no homepage canonical or sitemap entry', () => {
  const html = readPage('/404');
  assert.match(html, /noindex, follow/);
  assert.match(html, /Page not found/);
  assert.ok(!html.includes('rel="canonical"'));
  const vercel = JSON.parse(readFileSync('vercel.json', 'utf8'));
  assert.equal(vercel.cleanUrls, true);
  assert.ok(!vercel.rewrites, 'A catch-all rewrite would turn missing URLs into soft 404s');
});
