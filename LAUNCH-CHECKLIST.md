# Launch checklist: what Laura needs to confirm

Nothing below is presented on the site as confirmed fact. Every business fact lives in `src/data/salon.ts`, with its source and a `confirmed` flag.

## 1. Facts on the page today (sourced, not yet confirmed by the salon)

| Fact | Shown as | Source | Where to change |
| --- | --- | --- | --- |
| Telephone | 01670 516113 (`tel:+441670516113`) | Business listings | `salon.phone` |
| Address | 1B Newgate Street, Morpeth, Northumberland NE61 1AL | Business listings | `salon.address` |
| Award | Business of the Year, Heart of Morpeth Business Awards 2017 (public vote) | Sanderson Arcade news report on the 2017 awards | `salon.award` |
| Legal name and company number | Laura Anderson Hair Ltd, no. 12300311, "registered in England and Wales" | Companies House (jurisdiction to confirm) | `salon.legalName`, `salon.companyNumber`, `Footer.astro` |
| Services | Cutting & styling, Colour, Highlights & balayage, Grey blending, Corrective colour, Occasion & bridal hair | Salon name and listings, recent posts, lead research | `services` |
| Beauty and health | Mentioned only as "also offered, call to hear what is available" | Business name | `Services.astro` |
| Team | Laura Anderson, Salon owner; "a small team of stylists and colourists" | Salon listing | `team`, `Team.astro` |

## 2. Left out until supplied (nothing is guessed)

- [ ] **Opening hours.** The site currently says "Please call for current opening times". Add them to `salon.openingHours` and they appear in the Visit section and the structured data.
- [ ] **Google rating.** 5.0 from 91 reviews was noted during lead research. Re-check it, then set `googleRating.confirmed = true` to show it.
- [ ] **Testimonials.** Pick 3–6 Google reviews, ask each reviewer's permission, and add them verbatim to `reviews`, with name, service and link.
- [ ] **Booking URL.** If the salon uses an online booking system, set `salon.bookingUrl` to add a "Book online" button.
- [ ] **Social accounts.** Add verified profiles to `salon.social` and they appear in the footer.
- [ ] **Prices and durations.** None are published. The site says prices are confirmed at consultation.
- [ ] **Extensions or other services.** Not listed until confirmed.
- [ ] **Team portraits, names, roles and bios.** Add them to `team`. Without a portrait, a typographic card is shown.
- [ ] **Logo.** The wordmark is set in Cormorant Garamond. Replace it with the salon's own artwork if it should match the shop sign.

## 3. Photography (most important for quality)

All four photographs are **AI-generated placeholders** (made in Canva). This environment could only retrieve low-resolution copies, so they are upscaled and look soft on large screens. The gallery carries a visible note that its images are illustrative.

- [ ] Replace with Laura's own work and salon photography, shot in good natural light. Suggested set:
  - 1 hero portrait (4:5, minimum 1600 × 2000);
  - 1 colour close-up (square, minimum 1600);
  - 1 interior (3:4);
  - 6–10 gallery images in mixed ratios;
  - team portraits (3:4).
- [ ] Get written consent from every client who appears.
- [ ] Drop the files into `src/assets/photos/`, update `photos` and `gallery` in `salon.ts`, and set `placeholder: false`. The gallery note then disappears.
- [ ] Never publish a before-and-after the salon cannot verify.

## 4. Technical setup

- [ ] **Domain.** Build with `SITE_URL=https://your-domain` to enable canonical URLs, absolute Open Graph URLs and `sitemap-index.xml`.
- [ ] **Enquiry form.** It is hidden until `PUBLIC_ENQUIRY_ENDPOINT` is set to a form endpoint that accepts a JSON POST, for example a Formspree form or a Cloudflare Pages Function that emails the salon. It only shows "sent" when that endpoint returns 2xx; otherwise it shows an error with the phone number.
- [ ] **Privacy notice.** `/privacy/` is a draft for the salon to review. Update it if analytics or cookies are ever added.
- [ ] Verify the `tel:` link on a real phone, and the directions link in Google Maps.
- [ ] Update the Google Business Profile's website field once the site is live.
