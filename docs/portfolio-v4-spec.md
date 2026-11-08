# Portfolio v4: personal portfolio (supersedes the v3 taste-skill page)

The user (Simiyon Vinscent Samuel L) rejected v3: big empty gaps from "one section per screen", a bad hero, and it talked about products instead of him. v4 is a **personal portfolio**: about him first, all work portrayed with award-site scroll effects, a blog, and the SSN Coding Club CMS + its GitHub Actions emphasised. The taste-skill gate is closed; its rules no longer bind. Keep its kit for tokens, type and components where useful.

## Fixed facts
- Sources of truth: `C:\projects\resume\resume.tex`, `docs/portfolio-v3-content.md` (the 16 chosen projects + extras), repo READMEs (`gh repo view blackscythe123/<repo>`, local clones under `C:\projects\`). Never invent metrics, testimonials, clients, dates. Mock UI text inside drawn fragments may be illustrative.
- Photo: `public/me.webp` (800x800 PNG-derived, transparent edges possible; a young man in a white shirt and round glasses, outdoors). Alt: "Simiyon Vinscent Samuel".
- Contact: email samsamuel234567@gmail.com, LinkedIn https://www.linkedin.com/in/simiyonvinscentsamuel/, GitHub https://github.com/blackscythe123, LeetCode https://leetcode.com/u/blackscythe123/. Never publish the phone number. Résumé: `resume.pdf`.
- Screenshots (real Chrome): `public/work/*.webp`: qikskill (Kaushalam, 1180x1300), mcme, cc-portal, cihc, honeyledge, thamarai, peaceful, leetcode-card, chillz, clash (1440x900). No shots: FarmLedge (demo 404), Crime Intelligence System, FlashBook, Voxa, unfuck-android, GitHub profile platform: use drawn kit UI fragments (`public/parts/hackathons.html`, `open-source.html`, `platform.html` already contain good ones — reuse their markup) or styled text cards.

## Design system
- Keep the kit CSS: `assets/system.css`, `assets/ui/base.css` + needed `assets/ui/<name>/fragment.css`, `assets/diagrams/diagram.css`. Fonts: Mona Sans (display, use the width axis for drama) + Geist Mono. Palette tokens as in `.taste-skill/css-deal.txt` (cool grey #eef0f3 ground, ink #0b0c0e, cobalt #1f2de6 accent; inverse ink #0b0c0e ground for dark sections). Never violet.
- Section rhythm: sections size to their content (no forced 100svh except the hero and pinned scenes). Consistent vertical padding (`clamp(96px, 12vw, 160px)`). No empty half-screens.
- Motion: GSAP 3.13 + ScrollTrigger + Lenis smooth scroll, loaded from jsDelivr in `<head>` by the shell (`https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/gsap.min.js`, `.../ScrollTrigger.min.js`, `https://cdn.jsdelivr.net/npm/lenis@1.3.4/dist/lenis.min.js`). Everything respects `prefers-reduced-motion: reduce` (show the final state, no pinning/scrubbing). Award-site vocabulary allowed: split-text line reveals, pinned horizontal gallery, sticky stacking cards, image parallax, scrubbed counters, marquee, word-by-word highlight, cursor-follow preview. Never scroll-jack wheel deltas beyond Lenis; never hide content if JS fails (add `js` class on <html> before hiding).
- Copy: first person ("I build…"), plain, specific, no slop words (seamless, cutting-edge, passionate, leverage, unlock, elevate, robust, journey), no exclamation marks, sentence case.

## Page map (`public/index.html`, one file built from `public/v4/*.html` by `scripts/build-v4.mjs`)
| order | id | owner | content |
|---|---|---|---|
| 1 | hero | shell agent | Giant name (split-text reveal), photo with parallax/mask reveal, one line: "Full-stack and AI engineer, Integrated M.Tech student at SSN College of Engineering, Chennai." Résumé + email buttons, small facts row (SIH 2025 national finalist · DreamPi intern 2026 · 16 projects shipped or open-sourced). |
| 2 | about | shell agent | First-person story paragraph with word-by-word highlight on scroll; facts from résumé; a scrubbed facts row (CGPA 8.315, 3,400 CTF points, 11,452-pair research dataset, 167 card themes) with sources inline. |
| 3 | stack | shell agent | Marquee rows of real tech names grouped (from the blackscythe123 README tech stack). Text or simple-icons via `https://cdn.simpleicons.org/<slug>` is fine. |
| 4 | work | work agent | All 16 projects: pinned horizontal gallery on desktop (vertical stack on phones), each card: screenshot or drawn mock, name, one line, stack, year, status, links (live/repo where public). Order: Kaushalam (DreamPi), SSN Coding Club CMS, MCME, CIHC, HoneyLedge, Thamarai, Peaceful Innovations, GitHub profile platform, FarmLedge, Crime Intelligence System, FlashBook, Voxa, LeetCode stats card, unfuck-android, Chillz IPTV, clash-of-progs. |
| 5 | cms | work agent | Featured case study: the SSN Coding Club zero-database multi-tenant CMS and its GitHub Actions. Sticky stacking chapters (what it is, how content lives in git, how Actions build/deploy/validate, what it enables). Facts from `docs/cc-cms-facts.md` (written by the CC blog agent) and the repo. Link to the blog post. |
| 6 | platform | work agent | README platform: reuse/upgrade the diagram from `public/parts/platform.html` on the dark ground; link to its blog post. |
| 7 | hackathons | work agent | FarmLedge, Crime Intelligence System, FlashBook + awards as a timeline with years; reuse fragments from `public/parts/hackathons.html`. |
| 8 | experience | shell agent | Timeline: DreamPi intern (Mar–Jun 2026), freelance (2025–now), SSN M.Tech (2024–2029), research co-author, TRIVARNA 2.0 CTF. |
| 9 | writing | shell agent | Cards for blog posts from `public/blog/posts.json` (title, date, summary, slug) — render statically at build time by build-v4.mjs or hardcode from posts.json. |
| 10 | contact | shell agent | Big "Let's talk" style close (plain words, e.g. "Hiring an intern or a freelancer? Email me."), giant name, links, © 2026. |

## Blog (`public/blog/`)
- `blog/_post.html` is the template (written by the lead). Each post: `blog/<slug>.html`, dated from real GitHub history (repo createdAt and the commit range of the work; state the date and say "based on the repo's commit history"). `blog/posts.json`: `[{slug,title,date,summary,repo,tags}]` — each blog agent appends its own entries to its own file `blog/posts-<agent>.json`; the build merges.
- `blog/index.html` lists all posts (built by build-v4.mjs from the merged json).
- Posts: technical, first person, 900–1600 words, with real code/config excerpts from the repos (short), architecture sections, what was hard, what I'd change. Facts only from repos/résumé.
