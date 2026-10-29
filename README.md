# Laura Anderson Hair

The website for Laura Anderson Hair, an independent salon on Newgate Street, Morpeth. It is built with Astro and TypeScript, and outputs a static site with almost no JavaScript.

## Run it

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # static output in dist/
npm run preview    # serve the production build
npm run check      # type and template checks
```

Optional environment variables (see `.env.example`):

| Variable | Effect |
| --- | --- |
| `SITE_URL` | Canonical URLs, absolute Open Graph image and `sitemap-index.xml` |
| `PUBLIC_ENQUIRY_ENDPOINT` | Shows the enquiry form and posts to this endpoint as JSON. Without it, booking is by phone only |

Deploy `dist/` to any static host. On Cloudflare Pages: build command `npm run build`, output directory `dist`.

## Where things live

- `src/data/salon.ts`: every business fact, service, gallery image, review and team member, each with its source. **Read `LAUNCH-CHECKLIST.md` before launch.**
- `src/styles/global.css`: design tokens (palette, type scale, spacing, motion) and the shared type, button, link and reveal styles.
- `src/scripts/motion.ts`: the one motion system: entrance sequence, scroll reveals and restrained parallax.
- `src/components/`: one component per section, plus `Header`, `Wordmark`, `Icon` and `BookBar`.
- `src/pages/`: the home page, `/privacy/` and the 404 page.
- `public/hairline/`: the line-drawn stylist's chair in the booking section. It uses the Hairline engine (MIT, see `LICENSE.txt`) and loads only when that section comes near.

## Design system in brief

- **Palette:** chalk `#FCFAF6` and ivory `#F7F4EE` surfaces, espresso `#28211F` editorial bands, ink `#211B19`, with taupe and champagne as accents.
  - Champagne and taupe are only used as text on dark surfaces.
  - On light surfaces, accent text uses `#7B6344` (5.4:1).
- **Type:** Cormorant Garamond (variable, light weights for display) with Hanken Grotesk for interface and body text. Both are self-hosted through Fontsource. Italic appears in four places only.
- **Motion:** one easing family (`--ease-out`, `--ease-in-out`).
  - Headlines reveal line by line, images through a clip mask, and supporting text fades up.
  - Content is visible without JavaScript, and a failsafe removes the hidden state if the motion script never loads.
  - `prefers-reduced-motion` removes movement entirely.
- **Hover** effects only apply to devices with a fine pointer. Touch devices get press feedback instead.
