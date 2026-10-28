# Laura Anderson Hair · Beauty · Health

Static site: `index.html`, `styles.css` and `js/`. There is no build step. Deploy the folder as-is to Cloudflare Pages.

## Before launch

- `photos/`: these are upscaled previews of the Canva-generated placeholders. Replace them with the full-size Canva exports, then with Laura's own photos once the shoot is done:
  - `hero.jpg` (16:9)
  - `salon.jpg` (4:5)
  - `bridal.jpg` (4:5)
  - `colour.jpg` (4:3)
- The monogram in the nav and footer is a stand-in set in Bodoni Moda. Swap in the vector from Laura's logo file.
- Opening hours in `js/site.js` (`HOURS`) are examples. Confirm them with the salon, then delete the note under the dial.
- Reviews: add approved quotes to the `reviews-data` block in `index.html` as `{ "text", "name", "service", "approved": true }`. Nothing renders until a review is approved.
- Bridal form: wire `#enq` to a Cloudflare Pages Function. It currently validates and then shows a thank-you message.
- The footer's Instagram and Facebook links are `#`. Add the salon's real URLs.
- Fonts load from Google Fonts. To self-host, use `@fontsource-variable/bodoni-moda` and `@fontsource/jost`.

## Hairline chair

`js/chair.js` is a figure written for the Hairline engine (`js/hairline-kernel.js`, MIT, see `js/HAIRLINE-LICENSE.txt`). It passes the engine's validator and its look checks.

## Icons

The icons are drawn on a 24-unit grid with 2 units of padding and a single stroke. Lines break where they pass behind another line, and each icon has one copper accent. They live in the sprite at the top of `index.html`.
