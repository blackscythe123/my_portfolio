# Portfolio v3: page plan (taste-skill run)

Skill: `C:\Users\Sam\.claude\skills\design-taste-frontend` (SKILL.md + references/). Kit copied to `public/assets/`.
Page: `public/index.html` (plain HTML; Next.js rewrites `/` to it). Parts are written to `public/parts/*.html` and assembled by the lead.

Line 1, the kind: software (`<html data-type="software">`, page-type software, site-kind software). A personal portfolio: the "product" is Simiyon's work.
Line 2, the deal: hero `collage` · palette `cool-grey-cobalt` (a cool off-white ground and cobalt accent, the blue of a code editor's selection) · type `mona` (Mona Sans + Geist Mono) · radius `soft` · nav `nav-centre` · footer `footer-statement` · close `close-word` · rhythm `dark-band` · buttons `arrow` · mark `stack` · lit ground `sage` · moment `line-carries-colour` (on the dark band).

Main action (word for word everywhere): **Download résumé** → `resume.pdf`. Second action: **Email Simiyon** → `mailto:samsamuel234567@gmail.com`.
Voice: technical-dry. Facts only from `C:\projects\resume\resume.tex`, `docs/portfolio-v3-content.md` and each repo's description. Nothing invented (no metrics, testimonials or dates beyond those sources).

## Screens (1440x900)
| # | id | idea | picture | screens |
|---|---|---|---|---|
| 1 | hero | Full-stack and AI engineer in Chennai; SIH 2024 national finalist | collage: QikSkill (DreamPi) lesson window + small "shipped" card | 1 |
| 2 | work | Every project in one window | app-frame: list pane = all 16 projects; open pane = one project screenshot | 1 |
| 3 | shipped | Client and production sites | bento: wide MCME, small CC portal, CIHC, HoneyLedge, Thamarai (screenshots in panels) | 2 (g2) |
| 4 | platform | The GitHub profile platform: 5 Vercel services on *.simiyonvinscentsamuel.tech, Upstash Redis, VS Code extension, GitHub Actions | diagram card with pulses; dark-band (`ground-inverse`), moment `line-carries-colour` | 1 |
| 5 | hackathons | FarmLedge, Crime Intelligence System, FlashBook + awards line | three `card--open span-4` with UI fragments | 1 |
| 6 | open-source | Voxa, LeetCode card, unfuck-android, Chillz IPTV | features-2x2: fragments/screenshots | 2 (g2) |
| 7 | about | Experience, education, research, CTF | `.rows` list (the one calm, picture-less section) | 1 |
| 8 | contact | footer.closing: close-word + footer-statement | the name set across the wrap | 1 |

Projects (16): QikSkill/DreamPi, MCME Digi Health, SSN Coding Club portal, Peaceful Innovations, CIHC, Thamarai, HoneyLedge, FarmLedge, Crime Intelligence System, FlashBook, GitHub profile platform, Voxa, LeetCode stats card, unfuck-android, Chillz IPTV, clash-of-progs.
Screenshots (real Chrome, 1440x900): `public/work/*.png` (cc-portal, chillz, cihc, clash, honeyledge, leetcode-card, mcme, peaceful, thamarai). No screenshot for QikSkill (site down), FarmLedge (404), CIS, FlashBook, Voxa, unfuck-android: those use rewritten kit UI fragments.
