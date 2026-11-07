# Edzira website

Static site built with [Eleventy](https://www.11ty.dev/). Output is plain HTML/CSS/JS in `_site/`.

## Commands
- `npm install` once
- `npm start` runs a local preview with live reload at http://localhost:8080
- `npm run build` writes the site to `_site/`
- Set the real domain at build time: `SITE_URL=https://www.edzira.com npm run build` (used for canonical URLs, Open Graph and the sitemap)

## Where things live
- `src/assets/css/tokens.css` colours, type scale, spacing and motion. Change brand values here.
- `src/_data/site.js` company details, offices, primary button label. **Contact details and addresses are placeholders from the mockups.**
- `src/_data/nav.js` main nav and the five solutions.
- `src/_includes/partials/` header, footer, SEO head (meta, Open Graph, JSON-LD), logo, icons.
- `/styleguide/` internal page showing the design foundation (noindex, excluded from sitemap).

## Conventions
- Primary CTA everywhere: "Book a Consultation". Pilot page uses "Request a Pilot".
- Process: 5 steps (Discover, Design, Deploy, Measure, Evolve).
- Add `data-reveal` to any element to fade it in on scroll; wrap siblings in `data-reveal-group` to stagger.
- Anything unverified (stats, case studies, partner logos) gets the `placeholder-flag` class until confirmed.

## Photos
1. Download free photos from unsplash.com (not "Unsplash+") into `photos-inbox/`, named after the slot they fill: `hero-campus`, `serve-universities`, `serve-colleges`, `serve-government`, `pilot-training`, `insight-learning`, `insight-campus`, `insight-cyber`.
2. Run `npm run photos`. It writes optimised AVIF and WebP files to `src/assets/photos/`.
3. Rebuild. Any slot without a photo shows a branded placeholder panel instead.

`npm run build` sets `NODE_ENV=production`, which hides the dashed outlines that mark placeholder content (unverified stats) in local previews.

## Deploying

The site is plain static files in `_site/`, so any static host works. Recommended: **Cloudflare Pages** (free, fast in India, reads `src/static/_headers` for security and caching headers). Netlify reads the same file.

Cloudflare Pages settings (after pushing this folder to a GitHub repo):

| Setting | Value |
| --- | --- |
| Build command | `npm run build` |
| Output directory | `_site` |
| Environment variables | `SITE_URL=https://your-domain`, `FORM_ACTION=https://formspree.io/f/<your-id>`, `NODE_VERSION=20` |

`SITE_URL` sets canonical links, Open Graph URLs and the sitemap. `FORM_ACTION` connects the contact form. Both have safe defaults for local work.

## Launch checklist

- [ ] Create a Formspree form (formspree.io, free tier) and set `FORM_ACTION`.
- [ ] Buy/point the domain and set `SITE_URL`.
- [ ] Replace placeholders: phone, email, office addresses (`src/_data/site.js`), stats (`src/index.njk`, `src/about.njk`), social links.
- [ ] Legal review of `src/privacy.njk` and `src/terms.njk`.
- [ ] Replace placeholder articles, then set `placeholder: false` in each post so it is indexed.
- [ ] After launch: add the site to Google Search Console and Bing Webmaster Tools, submit `/sitemap.xml`.
- [ ] Open the live site in Safari and Firefox once (only Chromium is covered by automated checks).
