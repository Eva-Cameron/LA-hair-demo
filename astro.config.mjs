// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

// Set SITE_URL once the domain is known (e.g. SITE_URL=https://example.co.uk npm run build).
// With it the build adds canonical URLs and a sitemap; without it, neither is guessed.
const site = process.env.SITE_URL || undefined;

export default defineConfig({
  site,
  integrations: site ? [sitemap()] : [],
  image: { layout: "constrained" },
  build: { inlineStylesheets: "auto" },
});
