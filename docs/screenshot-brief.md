# Screenshot brief (shared by the screenshot agents)

Goal: for each project card, a short loop of 3–4 screenshots showing the project's **important** pages (home, the main feature page, one more distinctive page). Only strong shots: no empty states, error pages, cookie banners, loading spinners, sign-in walls, or anything showing personal data (emails, phone numbers, codes, tokens, receipts). Never sign in, never submit a form, never click anything that sends data.

## How (must be parallel-safe)
- Do NOT use agent-browser (single shared daemon; other agents run at the same time). Use Playwright with your own browser process:
  `C:\Users\Sam\obscura-eval\harness\` has `playwright-core` installed. Write your script in that folder (e.g. `shots-<yourname>.mjs`) and run it with `node` from there.
  Launch: `chromium.launch({ executablePath: 'C:/Users/Sam/.agent-browser/browsers/chrome-150.0.7871.49/chrome.exe', headless: true })`, context `viewport 1440x900`, `deviceScaleFactor: 1`, `colorScheme` matching the site's default.
- Find the important pages by reading each site's own nav links (get the hrefs from the DOM), not by guessing URLs. Wait for `networkidle` (catch timeouts) plus ~2.5 s for animations/fonts; scroll to top before shooting; remove fixed cookie/consent overlays and floating chat/WhatsApp/review widgets via DOM before the shot. Viewport shots (not full page).
- Save as WebP 1440x900, quality ~80, using Python Pillow run with `python -I`: `C:\projects\my_portfolio\public\work\<project-slug>\<n>-<page>.webp` (n = 1..4 in the order they should play; 1 = the home/hero).
- Look at every shot yourself (Read the image) and delete weak ones. Keep 3–4 per project (2 is fine if the site has only 2 good pages).

## Output
Write `C:\projects\my_portfolio\public\work\<project-slug>\shots.json`: `[{"src":"work/<slug>/1-home.webp","alt":"what the page shows","page":"Home"}, ...]` in play order. Final message: per project, the pages kept and any dropped with the reason.
