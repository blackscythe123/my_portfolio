// Assembles public/index.html (v4 personal portfolio) from public/v4/*.html. Posts come from the engineering blog repo (BLOG_URL/posts.json).
import fs from 'node:fs';
import path from 'node:path';
import { loadEnv } from './env.mjs';

const pub = path.resolve(import.meta.dirname, '..', 'public');
const v4 = (n) => fs.readFileSync(path.join(pub, 'v4', n), 'utf8');
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const { SITE_URL, BLOG_URL } = loadEnv();
// blog posts: the blog (its own repo) publishes BLOG_URL/posts.json. A local checkout of the blog repo
// (BLOG_SRC, default ../engineering-blog/posts) is the fallback, so the portfolio still builds when the blog is offline.
// The portfolio shows the latest eight in a horizontal scroller that ends in a link to the full blog.
async function loadPosts() {
  try {
    const r = await fetch(`${BLOG_URL}/posts.json`, { signal: AbortSignal.timeout(8000) });
    if (r.ok) return { from: `${BLOG_URL}/posts.json`, list: await r.json() };
  } catch { /* fall through to the local checkout */ }
  const dir = path.resolve(process.env.BLOG_SRC || path.join(import.meta.dirname, '..', '..', 'engineering-blog', 'posts'));
  if (!fs.existsSync(dir)) return { from: 'none', list: [] };
  const list = fs.readdirSync(dir).filter((f) => f.endsWith('.json') && fs.existsSync(path.join(dir, f.replace(/.json$/, '.html'))))
    .map((f) => JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')));
  return { from: dir, list };
}
const loaded = await loadPosts();
const posts = loaded.list.sort((a, b) => b.date.localeCompare(a.date)).slice(0, 8);
const human = (d) => new Date(d + 'T00:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
const card = (p, prefix) => `<a class="post-card" href="${prefix}/${esc(p.slug)}/" data-reveal>
  <time datetime="${esc(p.date)}">${human(p.date)}</time>
  <h3>${esc(p.title)}</h3>
  <p>${esc(p.summary)}</p>
  <span class="post-card__tags">${(p.tags || []).map(esc).join(' · ')}</span>
</a>`;


// ---- card screenshot loops: replace a card's single image with its shots.json loop ----
const LOOPS = { 'qikskill.webp': 'kaushalam', 'mcme.webp': 'mcme', 'cihc.webp': 'cihc', 'thamarai.webp': 'thamarai', 'peaceful.webp': 'peaceful',
  'honeyledge.webp': 'honeyledge', 'clash.webp': 'clash', 'leetcode-card.webp': 'leetcode-card', 'chillz.webp': 'chillz', 'cms/1-write.webp': 'cc-portal' };
const PREPEND = { 'cc-portal': [
  { src: 'work/cms/1-write.webp', alt: 'Writing an article in the Coding Club CMS Studio with the live preview beside it' },
  { src: 'work/cms/2-submitted.webp', alt: 'The Studio after Submit: the post is on a draft branch and opened as pull request #28' },
  { src: 'work/cms/3-reviews.webp', alt: 'The Studio Reviews queue showing the submitted article waiting for a superadmin' },
  { src: 'work/cms/4-github-pr.webp', alt: 'The pull request on GitHub with the code owners requested as reviewers' },
  { src: 'work/cms/people.webp', alt: 'The CMS Studio People page: roles per vertical' } ] };
function loopify(html) {
  return html.replace(/<img src="work\/([\w./-]+?\.webp)(?:\?v=\d+)?"([^>]*)>/g, (m, file, rest) => {
    const slug = LOOPS[file]; if (!slug) return m;
    const f = path.join(pub, 'work', slug, 'shots.json'); if (!fs.existsSync(f)) return m;
    const shots = [...(PREPEND[slug] || []), ...JSON.parse(fs.readFileSync(f, 'utf8'))].slice(0, 6);
    if (shots.length < 2) return m;
    const imgs = shots.map((s, i) => `<img src="${esc(s.src)}" alt="${esc(s.alt || '')}" width="1440" height="900" loading="${i ? 'lazy' : 'eager'}"${i ? '' : ' class="is-on"'}>`).join('');
    return `<div class="wk-slides" data-slides>${imgs}<span class="wk-slides__dots" aria-hidden="true">${shots.map((_, i) => `<i${i ? '' : ' class="is-on"'}></i>`).join('')}</span></div>`;
  });
}

// ---- WebGL ribbon textures: tag every work card with data-tex (its screenshots, else its rendered poster) ----
function texify(html) {
  return html.replace(/<article([^>]*data-wk-card[^>]*)>([\s\S]*?)<\/article>/g, (m, attrs, inner) => {
    if (/data-tex=/.test(attrs)) return m;
    let tex = [];
    const slides = inner.match(/<div class="wk-slides"[\s\S]*?<\/div>/);
    if (slides) tex = [...slides[0].matchAll(/<img src="([^"]+)"/g)].map((x) => x[1]);
    const title = (inner.match(/<h3[^>]*>([^<]+)</) || [, 'card'])[1].trim();
    const slug = title.toLowerCase().replace(/\(.*?\)/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    if (!tex.length && slug === 'github-profile-platform') tex = [1, 2, 3].map((n) => `work/github-profile/${n}.webp`);
    if (!tex.length) { const one = inner.match(/<img src="(work\/(?:thamarai|chillz)[^"]*\.webp)[^"]*"/); if (one) tex = [one[1]]; }
    if (!tex.length) { const sj = path.join(pub, 'work', slug, 'shots.json'); if (fs.existsSync(sj)) tex = JSON.parse(fs.readFileSync(sj, 'utf8')).map((x) => x.src); }
    if (!tex.length) tex = [`work/posters/${slug}.webp`];
    return `<article${attrs} data-tex="${tex.join('|')}">${inner}</article>`;
  });
}

const sections = ['hero.html', 'stack.html', 'work.html', 'writing.html'];
const sub = (t) => t.split('%SITE_URL%').join(SITE_URL).split('%BLOG_URL%').join(BLOG_URL);
const more = `<a class="post-card post-card--more" href="${BLOG_URL}/" data-reveal><span>Every post</span><h3>More on the engineering blog</h3><p>Architecture write-ups, request flows and the code behind them.</p><span class="post-card__go" aria-hidden="true">&rarr;</span></a>`;
const body = sections.map((n) => n === 'work.html' ? texify(loopify(v4(n))) : v4(n)).join('\n').replace('<!-- POSTS -->', posts.map((p) => card(p, BLOG_URL)).join('\n') + (posts.length ? '\n' + more : ''));

// stylesheets and scripts the parts ask for
const all = body + v4('contact.html');
const frag = new Set([...all.matchAll(/data-ui="([a-z-]+)"/g)].map((m) => m[1]));
for (const m of all.matchAll(/assets\/ui\/([a-z-]+)\/fragment\.css/g)) frag.add(m[1]);
['chat', 'checklist', 'pipeline-board', 'voice', 'terminal-run', 'window'].forEach((n) => frag.add(n));
const fragCss = [...frag].filter((n) => fs.existsSync(path.join(pub, 'assets', 'ui', n, 'fragment.css')))
  .map((n) => `<link rel="stylesheet" href="assets/ui/${n}/fragment.css">`).join('\n');

const head = sub(v4('head.html'))
  .replace('<!-- FRAGMENT CSS -->', fragCss)
  .replace('<!-- WORK CSS -->', '<link rel="stylesheet" href="v4/work.css">');

const html = `<!doctype html>
<html lang="en">
<head>
${head}
</head>
<body>
${v4('nav.html')}
<main id="top">
${body}
</main>
${v4('contact.html')}
<script type="module" src="assets/system.js"></script>
<script type="module" src="assets/diagrams/mount.js"></script>
<script src="v4/work.js" defer></script>
<script src="v4/slides.js" defer></script>
<script type="module" src="v4/ribbon.js"></script>
</body>
</html>
`;
const stamp = Date.now().toString(36);
fs.writeFileSync(path.join(pub, 'index.html'), sub(html).replace(/("v4\/[\w.-]+\.(?:css|js))"/g, `$1?v=${stamp}"`));

console.log(`index.html ${html.length} bytes, ${posts.length} posts from ${loaded.from}: ${posts.map((p) => p.date + ' ' + p.slug).join(', ')}`);
