# Samudio Auto — website

Marketing site for **Samudio Auto** ("SAMUDIO — Mobile Auto Repair"), a mobile mechanic in Knoxville, TN, run by Jayden. It replaces the old one-page site at jayden-s-auto-repair-landing.vercel.app.

The pages in `site/` were exported from an approved design. Treat them as the visual spec: keep the layout, type, colors and copy unless the owner asks for a change.

## What's in this folder

| Path | What it is |
|---|---|
| `site/index.html` | Home |
| `site/services.html` | Services & Pricing |
| `site/about.html` | About / Meet Jayden |
| `site/contact.html` | Contact |
| `site/assets/site.css` | Brand tokens, base rules, phone-width menu and fixed Call/Text bar |
| `site/assets/site.js` | Phone-width menu toggle; work videos; page wipe + intro bumper; scroll builds; Koalendar booking + floating button |
| `site/assets/logo/` | Logo files (see Logo usage) |
| `site/assets/photos/` | Photos of Jayden (metadata stripped) |
| `site/assets/videos/` | Silent looping work clips (MP4 + WebM, metadata stripped). They replace the `jayden-work-*` photos, which stay as the poster frame and the reduced-motion fallback |
| `site/assets/favicon.png`, `apple-touch-icon.png` | Icons made from the piston mark |
| `site/assets/og-image.jpg` | Link-preview image (Jayden + stacked logo) |
| `design-reference/home-phone.html` | Approved phone layout (390 px) of Home. Open it in a browser. |

Plain static HTML. No build step. Preview with `npx serve site`, or open `site/index.html`.

## Business facts (source of truth: never change without the owner)

- Name: Samudio Auto (logo tagline: Mobile Auto Repair)
- Owner and mechanic: Jayden
- Phone, call or text: (865) 315-8860 → `tel:+18653158860`, `sms:+18653158860`
- Email: Samudioauto@gmail.com
- Website: https://samudio-auto.vercel.app
- Area: Knoxville, TN. Fully mobile: he comes to the customer's home, work or roadside.
- Hours: scheduled service by appointment; roadside help day or night.

### Prices

| Item | Price |
|---|---|
| Travel fee | $50 |
| Diagnostic | $50 |
| Oil change | $40 + oil & oil filter |
| Brake job | By appointment: no posted price ("call or text for a price"), links to booking |
| Roadside assistance | $75 daytime (7am–10pm) · $175 late night (10pm–7am) |
| Battery service, tire rotation, electrical fixes | No posted price: "Text for a quote" |

### Content rules

- Don't invent reviews, ratings, years of experience, certifications or guarantees.
- Keep the faith line "Built on faith and hard work." and Colossians 3:23: "Whatever you do, work at it with all your heart."
- Services list: brake repair, oil changes, diagnostics, battery service, tire rotation, electrical fixes, roadside assistance.

## Brand

Colors (sampled from the logo file):

- Piston Red `#BC1823`: buttons and accents. Hover `#9E1420`.
- Black `#0C0C0D`: UI near-black (the wordmark itself is `#000000`).
- Espresso `#2E0800`: the tagline color; used for eyebrow labels on light backgrounds.
- Steel `#F3F5F9`: the reverse wordmark color; light section background and text on dark.
- Lines `#DDE0E7` (light) / `#2A2A2E` (dark). Muted text `#4A4C55` on light, `#B4B7BF` on dark.
- Contrast: Piston Red text on black only at 24px and up. Smaller red text on dark uses `#F0505A`.

Type (loaded from Google Fonts):

- Display: **Smooch Sans** 700/800, uppercase, line-height about 0.9. Closest Google Font to the SAMUDIO wordmark, which uses a Canva font.
- Body: **Montserrat** 400–700. Same font as the logo's tagline.
- Eyebrow labels: Montserrat 700, 12–13px, uppercase, letter-spacing 0.127em (the tagline's exact tracking), led by two small red bars that echo the piston's ring grooves.

Logo usage:

- `samudio-logo-horizontal-light.png`: header on black
- `samudio-logo-stacked-light.png`: footer on black
- `*-dark.png`: versions for light backgrounds
- `samudio-piston-white.png`: 10% watermark on the red call-to-action band
- `originals/`: the logo exactly as exported from Canva

Never recolor, stretch or retype the wordmark.

## Structure notes

- Styles are mostly inline because they were exported from the design tool. If you move to a framework or shared CSS, keep the look identical.
- Every page repeats the header and footer. Keep them in sync, or turn them into partials.
- **Page wipe / loading screen:** every page starts with `<div class="wipe">` (first in `<body>`) and a one-line script in `<head>` that adds `.wipe-in` before first paint. A black panel with a red leading edge and the spinning piston covers the page until fonts load, then wipes off; internal links wipe it back on before navigating. The first page of each visit plays the **bumper** instead: the piston spins in and lands above the wordmark (`samudio-wordmark-light.png`, cropped unaltered from the stacked logo). Tap skips it. Reduced motion gets a short fade, no spin.
- **Scroll builds:** `site.js` tags the content of every section after the first with `.build` so it rises in as it scrolls into view (cards one at a time). Off for reduced motion and without JS.
- **Booking (Koalendar, https://koalendar.com/e/samudioauto):** `#schedule` on Home and Contact holds the Koalendar inline calendar (`#inline-widget-samudioauto`; `site.js` loads Koalendar's `widget.js` only on those pages), with a fallback link to the booking page plus text/call links. Every page has a floating red **Book a job** button (`.book-fab`) that opens the booking page in a `<dialog>` (iframe with `?embed=true`); without JS it opens Koalendar in a new tab. The button hides while `#schedule` is on screen and sits above the phone Call/Text bar. Booking questions, hours and notifications are set in the Koalendar dashboard, not here.
- **Sticky header:** `.site-header` is `position: sticky` and gets a shadow once the page scrolls (`html.is-scrolled`). `scroll-padding-top` keeps in-page jumps clear of it; adjust it if the header height changes.
- Below 820px the nav collapses behind a menu button and a fixed Call/Text bar sits at the bottom (`site.css`, `site.js`).

## To do before launch

1. ~~Koalendar setup (accent color, booking questions, availability, notifications, test booking)~~: done by the owner.
2. ~~Phone layouts~~: done. Below 600px, `site.css` restyles via classes (`btn-row`, `hero-*`, `svc-card`, `roadside-*`): full-width buttons, Home photo before the price strip, compact icon-beside-title service cards, side-by-side roadside prices, 40px header logo.
3. ~~SEO~~: done. Live site: https://samudio-auto.vercel.app (clean URLs: `/services`, `/about`, `/contact`). Every page has a canonical link, Open Graph/Twitter tags and `assets/og-image.jpg` (1200×630); Home has AutoRepair JSON-LD. All of these use absolute URLs on that domain: update them if a custom domain is added.
4. Optional: self-host Smooch Sans and Montserrat instead of loading them from Google Fonts.
5. ~~Deploy~~: done by the owner. The old site is on Vercel; this folder deploys as a static site with `site/` as the output directory. Then point the domain.
6. After any change, run an accessibility pass: keyboard navigation, focus states, contrast.
