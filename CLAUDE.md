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
| `site/assets/site.js` | Phone-width menu toggle; pauses work videos off-screen and for reduced motion |
| `site/assets/logo/` | Logo files (see Logo usage) |
| `site/assets/photos/` | Photos of Jayden (metadata stripped) |
| `site/assets/videos/` | Silent looping work clips (MP4 + WebM, metadata stripped). They replace the `jayden-work-*` photos, which stay as the poster frame and the reduced-motion fallback |
| `site/assets/favicon.png`, `apple-touch-icon.png` | Icons made from the piston mark |
| `design-reference/home-phone.html` | Approved phone layout (390 px) of Home. Open it in a browser. |

Plain static HTML. No build step. Preview with `npx serve site`, or open `site/index.html`.

## Business facts (source of truth: never change without the owner)

- Name: Samudio Auto (logo tagline: Mobile Auto Repair)
- Owner and mechanic: Jayden
- Phone, call or text: (865) 315-8860 → `tel:+18653158860`, `sms:+18653158860`
- Email: Samudioauto@gmail.com
- Area: Knoxville, TN. Fully mobile: he comes to the customer's home, work or roadside.
- Hours: scheduled service by appointment; roadside help day or night.

### Prices

| Item | Price |
|---|---|
| Travel fee | $50 |
| Diagnostic | $50 |
| Oil change | $40 + oil & oil filter |
| Brake job (parts + labor) | $125/axle sedan · $175/axle SUV/truck |
| Roadside assistance | $75 daytime (7am–10pm) · $175 late night (10pm–7am) |
| Battery service, tire rotation, electrical fixes | No posted price: "Text for a quote" |

Open question: the brake price is presented as labor per axle with parts extra (Home shows "$125–$175 per axle + parts"). Confirm with the owner before launch.

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
- Below 820px the nav collapses behind a menu button and a fixed Call/Text bar sits at the bottom (`site.css`, `site.js`).

## To do before launch

1. **Contact form** ("Request a visit" on `contact.html`) is design-only. Wire it to Samudioauto@gmail.com (for example Formspree, or a Vercel function plus Resend), or remove it if the owner only wants calls and texts.
2. Bring phone layouts closer to `design-reference/home-phone.html` where the responsive pages differ (compact service cards, full-width buttons).
3. SEO: add AutoRepair / LocalBusiness JSON-LD (name, telephone, email, areaServed: Knoxville, TN), Open Graph tags and a social share image.
4. Optional: self-host Smooch Sans and Montserrat instead of loading them from Google Fonts.
5. Deploy. The old site is on Vercel; this folder deploys as a static site with `site/` as the output directory. Then point the domain.
6. After any change, run an accessibility pass: keyboard navigation, focus states, contrast.
