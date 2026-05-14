# Inspiration Notes — Portfolio Redesign v1

**Project:** simiyonvinscentsamuel.tech (Next.js 16 portfolio, automation/web3/full-stack developer, Chennai, India)
**Date:** 2026-05-14
**Axis A (delivery):** Commit
**Axis B (format):** Marketing Website / Portfolio — browser-frame desktop primary at 1280-1440px
**Cycle:** Case A — first cycle, zero prior notes files. No carry-forward.

## Phase 2 diagnosis

Existing code lands in **four named slop buckets simultaneously**:

1. **Purple Problem** — `globals.css` literally hardcodes Tailwind defaults `#3b82f6`, `#a855f7`, `#22c55e`, `#f97316`. Inter font as primary. Vague "I build intelligent systems at the intersection of automation, web3, and full-stack development" hero copy.
2. **Static Marketing Page** — flat stacked sections (Hero / Skills / Projects / Contact). Only IntersectionObserver fade-ups. Zero scroll choreography, parallax, pinned reveals, smooth-scroll, or view transitions.
3. **Vague aspirational microcopy** — "Crafting robust, scalable solutions" / "View my work" / "Have a project in mind?" — the AI-builder default vocabulary.
4. **Developer-portfolio slop signature** — cream/blue/orange light + dark mode toggle + Inter + Fira Code + subtle grid background + 3D card hover. Could be any developer portfolio.

The redesign breaks **all four** simultaneously: replace palette family entirely, replace type stack entirely, replace microcopy voice, introduce real scroll choreography.

## References scouted

### R1 — Awwwards Portfolio Featured (2026 SOTM tier)
- **URL:** https://www.awwwards.com/websites/portfolio/
- **Visual layer:** Top featured portfolios (Studio Namma, T11, Adcker, fromanother.love, Code by Jesse, Simonholm.studio, Pacôme Pertant, Luca Nardi) split between dark-canvas + accent and minimalist-light + typography. Dev-award portfolios lean technical-precision aesthetic — mono labels, asymmetric grid, scroll-triggered reveals.
- **Code layer:** Most use GSAP ScrollTrigger + Lenis (Lenis count high, ~6/8 visible refs). Variable-font flex on display headlines. Custom cursors common (~5/8). Three.js/R3F appears on ~3/8 (Code by Jesse, Studio Namma).
- **Feasibility for Next.js 16:** All libraries Next-compatible. GSAP + ScrollTrigger via dynamic import. Lenis as smooth-scroll. Motion (framer-motion already installed) for component-level transitions.

### R2 — Exat microsite (Codrops, April 2026)
- **URL:** https://tympanus.net/codrops/2026/04/10/the-exat-microsite-pushing-a-typography-showcase-to-new-creative-extremes/
- **Visual layer:** Variable typeface (21 styles, 1715 glyphs), proximity-based cursor detection where characters shift weight/color based on cursor distance. Color palette progresses cool-to-warm (blue #0000cb → red #FF0B00) mapped to weight intensity. Large numerals oscillate via sine wave tied to scroll speed. Stacked panels replace within pinned sections. Typography rotates on X-axis as it enters viewport.
- **Code layer:** Variable font axis animation. GSAP ScrollTrigger pinned sections. Proximity detection via mousemove + per-glyph weight binding. Sine-wave scroll mapping.
- **Feasibility for our stack:** High — pure CSS + JS. No Three.js dependency. Could ship in Next.js with Google Fonts variable axis API.
- **Borrowed move for Direction B (Signal & Trace):** variable-font weight morph driven by cursor distance + scroll velocity.

### R3 — Bruno Simon Portfolio
- **URL:** https://bruno-simon.com/
- **Visual layer:** Interactive 3D driving experience. Users navigate by driving a 3D car. Muted modern palette with iconography overlay (game-style UI). Amatic SC display + Nunito body — handwritten contrast.
- **Code layer:** Three.js (WebGL + WebGPU via TSL), Rapier physics, Howler.js audio. Heavy stack but legendary execution.
- **Feasibility for our stack:** Overkill for a personal portfolio. Three.js is appropriate as a **signature moment** ornament (rotating polyhedron, animated brand-mark) but not as a navigation paradigm.
- **Borrowed move for Direction A (Control Room):** WebGL-rendered isometric polyhedron as the hero ornament — wireframe schematic feel.

### R4 — Linear "Magic Blue" (anti-reference)
- **URL:** https://linear.app
- **Visual layer:** Near-black + Linear's `#5E6AD2` + Geist/Inter + frosted glass cards + `whileHover scale 1.02`.
- **Slop verdict:** Bucket 2 from community-sentiment file. **Avoid this entirely.** Any direction landing in this visual family fails. Used as negative reference to validate Phase 6 directions stay away from the indigo/violet + glass family.

### R5 — Codrops Scroll-Reactive 3D Gallery (March 2026)
- **URL:** https://tympanus.net/codrops/2026/03/09/building-a-scroll-reactive-3d-gallery-with-three-js-velocity-and-mood-based-backgrounds/
- **Visual layer:** Scroll-velocity-driven micro-motion. Background mood shifts based on scroll velocity. 3D gallery items tilt and pulse with scroll speed.
- **Code layer:** Three.js + ScrollTrigger velocity emit + Lenis. Mood transitions via WebGL shader interpolation.
- **Feasibility:** Strong reference for scroll-driven project gallery. Could simplify to canvas-2D for a lighter ship.
- **Borrowed move for Direction B (Signal & Trace):** scroll-velocity reactivity — the waveform amplitude scales with scroll velocity.

### R6 — Departure Mono / Editorial Mono fonts (Google Fonts + indie type)
- **URL:** https://github.com/fontworks-fonts/Departure-Mono (and similar archive-mono fonts)
- **Visual layer:** Pixel-precision mono, schematic feel. Lightweight retro-tech aesthetic.
- **Borrowed move for Direction A (Control Room) and D (Neural Terminal):** Departure Mono / JetBrains Mono as the primary display font, not just for code.

### R7 — Active Theory studio site
- **URL:** https://activetheory.net
- **Visual layer:** Cinematic case-study scroll with full-bleed media. Dark canvas + restrained color use. Heavy typography. Custom cursor.
- **Code layer:** GSAP, Three.js, custom WebGL fluid shaders.
- **Borrowed move:** Custom cursor magnetic behavior + cinematic case-study reveal pattern for the Projects section.

## Library frequency across references

| Library / Technique         | Count | Verdict for our stack (Next.js 16) |
|-----------------------------|-------|-----------------------------|
| GSAP + ScrollTrigger        | 6/7   | mainstream — install for hero choreography |
| Lenis (smooth scroll)       | 6/7   | install — pairs with GSAP, supports `position: sticky` |
| Variable fonts + axis       | 3/7   | install via Google Fonts (Bricolage Grotesque, Recursive) |
| Three.js / R3F              | 3/7   | optional — only as signature ornament, not page-wide |
| Custom cursor               | 5/7   | install — magnetic + bespoke per direction |
| View Transitions API        | 2/7   | use natively (browser supported) for internal nav |
| Canvas 2D (waveforms, ASCII)| 2/7   | use natively — lighter than Three.js for some moments |

## Cross-project URL dedup

Globbed sibling project directories. No other `v*-inspiration-notes.md` exists in adjacent projects. All URLs are fresh to this project.

## Emergent directions (cluster output)

Four directions cluster from the surviving references. Axis-spread confirmed (≥3 axes each):

- **A. Control Room** — engineered brutalism, schematic precision, phosphor-lime + warning-amber on ink (cool/contemporary/mid-sat/utilitarian/loud). Borrows from R1 (mono labels + asymmetric grid), R3 (WebGL ornament), R6 (mono display), R7 (custom cursor).
- **B. Signal & Trace** — oscilloscope, variable-font flex, phosphor cyan on navy (cool/futurist/saturated/abstract-modern/loud). Borrows from R2 (variable-font axis morph) + R5 (scroll-velocity reactivity).
- **C. Graphite & Molten** — editorial-with-thermal-accent, NO Fraunces (deliberately dodges warm-paper bucket), Spectral display + IBM Plex Mono, single molten-orange accent on charcoal graphite (warm-on-cool/contemporary-heritage/mid-sat/literal-tactile/moderate). Borrows from R7 (cinematic case-study reveal), R1 (editorial portfolio refs).
- **D. Neural Terminal** — hacker-shell, acid green + magenta strobe on pure black, glitch hover, typewriter decode (cool/futurist/saturated/utilitarian/loud). Borrows from R6 (Departure Mono).

All four directions intentionally avoid: indigo `#6366f1`, violet `#a855f7`, Linear `#5E6AD2`, shadcn defaults, Fraunces italic + cream paper + sage + terracotta (warm-paper bucket).

## Round 3 — user-supplied reference (heavily weighted in survival-of-fittest)

User asked for a site **like chainzoku.io**. Phase 3 was re-run via `agent-browser` per global rules — full visual + code dissection captured below. Tile H built to match.

### R-USER1 — chainzoku.io (Antinomy Labs design + Miinded Studio dev)
- **URL:** https://chainzoku.io/
- **Screenshots:** `scout/v1-chainzoku-{hero,clans,clans2,vision,customize,team,team-final}.png`
- **Subject:** NFT/web3 multimedia experience — fashion + manga + gaming + storytelling
- **Visual layer:**
  - Hero: deep cobalt navy `#0e1b3a`-ish canvas + painterly cherry-red smoke/cloud SVG drifting on both edges + massive white wavy-melted custom wordmark "CHAINZOKU" centered + tagline "MINT YOUR ZOKU. TAKE A SIDE." + sticky yellow PLAY badge bottom-right with comic-frame border + tiny chainzoku vertical wordmark on left rail.
  - Top nav: Home (active, yellow pill), Box Reveal, Lore, My Zoku, Jumps + social icons (Discord/Twitter/Insta/OpenSea).
  - Section 2 (PICK YOUR CLAN): hero stays pinned, full-bleed Tokyo street scene reveals beneath (vending machine, character squat, power lines, painterly red sky with character silhouettes) — cinematic pinned scroll.
  - Section 3 (LORE): black sans bold italic narrative captions (`The city of Tōdai was a blooming metropolis...`) over bone/cream background.
  - Section 4 (VISION/CUSTOMIZE): dramatic palette flip — hot pink + black star bursts + 3D-rendered horned anime warrior with katana in white kimono.
  - Section 5 (ZOKUS): white + lime-green highlight pill behind word "Zokus" + 3D character in display-case frame with anime stickers.
  - Section 6 (PLAY): pink/magenta + numbered cards "01 Play / 02 / 03..." with comic-frame card design + arcade game labels.
  - Sticky left rail through all scrolls: ZOKUS / CLANS / VISION / CUSTOMIZE / TEAM / FAQ — dot+label indicator showing scroll position.
  - Persistent yellow PLAY pill bottom-right (sticky video trigger, with comic-frame border).
  - Diagonal slice transitions between sections.
- **Code layer (confirmed via `agent-browser eval` + bundle inspection):**
  - **Framework:** Nuxt.js (Vue SSR) — confirmed `window.$nuxt: object`, `_nuxt/` paths everywhere.
  - **No GSAP / ScrollTrigger / Lenis / Three.js / Lottie as globals** — they roll their own Vue transition system + custom JS.
  - **5 videos:** `can.mp4` (vending machine, autoplay loop muted), `New_Rotation_Bunraku_White.mp4` (character turntable), 2× Vimeo MP4s (autoplay loop muted, painterly smoke/clouds), `CZK-Glitch-BNRK_Bolts2_Sound-new.mp4` (glitch sound effect on demand). **This is the canonical "fancy 3D hero is actually MP4" pattern from `award-winning-patterns.md`.**
  - **2 canvases:** `.anim__image canvas` 720×720 (character animation) + `.stickers canvas` 1440×900 (sticker overlay).
  - **Fonts:** AkzidenzGrotesk-BoldExtended (hero display + section heads), DrukHeavy (heavyweight body display), NeueHaasGrotDisp-76BoldItalic (narrative italics).
  - **YouTube iframe API** loaded for the PLAY badge → fullscreen trailer.
- **Feasibility for Next.js 16 portfolio:** Highly feasible. Pre-render painterly clouds as MP4 (~500KB each, autoplay muted loops), use 1 canvas for character art animation, use system + Google Fonts (Sigmar / Bowlby One for wavy display + Manrope ExtraBold Italic for narrative + Inter Tight for UI). No GSAP/Three.js needed for the mockup; production build can add GSAP ScrollTrigger for the pinned reveals.
- **Borrowed moves for Tile H:**
  - Massive chunky-bold display wordmark with wave/skew animation.
  - Painterly red SVG clouds drifting from both edges (CSS animation).
  - Sticky left rail nav with active-state dot.
  - Persistent yellow PLAY pill bottom-right.
  - Dramatic palette shift between sections.
  - Diagonal slice transitions.
  - Numbered comic-frame project cards.

### Round 3 emergent direction

- **H. Zoku Cinema** — chainzoku.io aesthetic adapted to Simiyon's portfolio (automation/web3/full-stack). Navy + cherry red + sodium yellow + magenta. Massive wavy display "SIMIYON" + painterly cloud + character portrait inset + sticky rail + comic-frame PLAY pill. Borrows from R-USER1 directly (user-weighted carry).

Hard-avoids preserved: still no indigo/violet, no Tailwind defaults, no warm-paper-cozy, no Linear Magic Blue.

