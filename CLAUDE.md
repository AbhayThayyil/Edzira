# CLAUDE.md: Edzira website

Read this first. It holds the full context needed to change this project safely. See [progress.md](progress.md) for what has been done and what is still open, and [README.md](README.md) for the human-oriented runbook (deploy, DNS, launch checklist).

## What this is
Marketing site for **Edzira** (legal name: Edzira Digital Technologies Private Limited), an education-technology consultancy in Bangalore, India. It serves universities, colleges and government/public institutions. Tagline: "Transforming Institutions. Enabling Futures."

- Live: https://edzira.com (www redirects to the bare domain).
- Repo: GitHub `AbhayThayyil/Edzira`, branch `main`. Every push to `main` auto-builds and deploys on Cloudflare.
- Stack: **Eleventy 3** (ESM, Nunjucks + Markdown), plain hand-written CSS and one vanilla JS file. No framework, no bundler, no CSS preprocessor. Only dev dependencies: `@11ty/eleventy`, `sharp` (photo script), `@fontsource-variable/plus-jakarta-sans`.
- Output is static HTML/CSS/JS in `_site/` (git-ignored).
- Locale `en-IN`; write copy in British/Indian English (organisation, programme, optimise).

## Commands
| Command | Purpose |
| --- | --- |
| `npm install` | once |
| `npm start` | dev server with live reload, http://localhost:8080 (placeholder outlines visible) |
| `npm run build` | production build to `_site/` (`NODE_ENV=production`) |
| `npm run photos` | optimise images in `photos-inbox/` to AVIF + WebP in `src/assets/photos/` |
| `SITE_URL=https://edzira.com npm run build` | build with real canonical/OG/sitemap URLs |

Environment variables (build time): `SITE_URL` (default `https://edzira.example`), `FORM_ACTION` (default `https://formspree.io/f/YOUR_FORM_ID`), `NODE_ENV`. In Cloudflare they are set to `NODE_VERSION=20`, `SITE_URL=https://edzira.com`, `FORM_ACTION=https://formspree.io/f/xjywyjdg`. There are no tests or linter; verify by running a build and previewing.

## Repository map
```
eleventy.config.js        passthrough copy (src/assets -> /assets, src/static -> /), filters: absoluteUrl, isoDate, readableDate, json
wrangler.jsonc            Cloudflare Workers static assets: serves ./_site, 404-page fallback, name "edzira"
scripts/optimize-photos.mjs   sharp: 640/1024/1600 px AVIF+WebP
photos-inbox/             original photos (git-ignored), named after slots
src/
  _data/
    site.js               ALL company facts: name, legalName, tagline, email, phone, offices, social, cta, showInsights, formAction, url
    solutions.js          single source for the 5 solutions (menu, footer, home cards, overview, pages, contact form)
    nav.js                main nav + legal links; solutions menu derived from solutions.js
    photos.js             scans src/assets/photos for *.webp so templates can fall back to a placeholder panel
    credits.json          record of photo sources (not shown on site)
    build.js              year/date
  _includes/layouts/      base.njk (head, CSS links, header/footer, main.js), article.njk (Insights post)
  _includes/partials/     header, footer, seo-head (meta, OG, JSON-LD), icons (macros incl. logo), page (macros: pageHero, ctaBand, faqList), photo (responsive <picture> macro)
  assets/css/             tokens, base, components, sections, pages (loaded in that order)
  assets/js/main.js       all behaviour (see below)
  assets/img/ fonts/ photos/   logo, favicon, og-default.png; self-hosted font; optimised photos
  static/_headers         security + cache headers (copied to site root)
  *.njk                   index, about, approach, pilot-program, contact, privacy, terms, 404, styleguide, robots, sitemap
  solutions/              index.njk (overview) and solution.njk (paginated: one page per entry in solutions.js)
  insights/               index.njk (+ index.11tydata.js) and posts/*.md (articles; posts.11tydata.js sets defaults)
```

## Pages and routes
`/`, `/solutions/` and `/solutions/<slug>/` (digital-learning, academic-systems, institutional-transformation, cyber-readiness, training-enablement), `/approach/`, `/pilot-program/`, `/insights/` and `/insights/<slug>/`, `/about/`, `/contact/`, `/privacy/`, `/terms/`, `/404.html`, `/sitemap.xml`, `/robots.txt`, `/styleguide/` (internal, noindex, not in sitemap).

## How to make common changes
- **Company details** (email, phone, address, legal name, social URLs): `src/_data/site.js` only. Social icons in the footer appear automatically for any network with a URL (all `""` now).
- **Solutions content or a new solution**: edit/add an entry in `src/_data/solutions.js`. Menu, footer, home cards, overview, the page and the contact form radio list all update. Fields: slug, title, icon, blurb, summary, homeTags, photo, photoAlt, seoTitle, description, tagline, intro, capabilities[], outcomes[], faqs[]. A new `icon` name must exist in `partials/icons.njk`.
- **Brand colours, type scale, spacing, motion**: `src/assets/css/tokens.css`. Teal is the action colour (AA with white text); cyan is only a glow/accent on dark surfaces. Font: Plus Jakarta Sans (self-hosted variable woff2).
- **New page**: add `src/<name>.njk` with front matter (`layout: layouts/base.njk`, `title`, `seoTitle`, `description`, `breadcrumbs`, optional `bodyClass: has-dark-hero`, `schemaExtra`). Start the body with `pageHero(...)` and end with `ctaBand()`. Add the link in `src/_data/nav.js`. Pages appear in the sitemap automatically.
- **New Insights article**: add `src/insights/posts/<slug>.md` with front matter: title, description, date, tag, image (photo slot name), imageAlt, featured, placeholder, readMins. `placeholder: false` makes it indexable and sitemap-listed; `true` adds noindex but it is still listed on /insights/. `date` is the real publish date. `showInsights: false` in site.js hides the whole section.
- **Photos**: put a JPG/PNG named after a slot in `photos-inbox/`, run `npm run photos`, rebuild, record the source in `credits.json`. Slots: hero-campus, serve-universities, serve-colleges, serve-government, pilot-training, insight-learning, insight-campus, insight-cyber. A slot with no photo renders a branded placeholder. Only free-licence photos (Unsplash, not Unsplash+, or Pexels).
- **Legal pages**: `privacy.njk`, `terms.njk`; update the `lastUpdated` date at the top when text changes. Privacy mentions Formspree; keep in sync if the form provider changes.
- **Reveal animation**: add `data-reveal` to an element; wrap siblings in `data-reveal-group` to stagger.
- **Unverified content** (stats, case studies, partner logos): give it the `placeholder-flag` class. It is outlined in dev only, never in production.

## Conventions
- Primary CTA everywhere: **"Book a Consultation"** (`site.cta`). Pilot page uses "Request a Pilot". The header button keeps the default label's width so the nav never shifts.
- Delivery process is 5 steps: Discover, Design, Deploy, Measure, Evolve.
- Do not invent claims, statistics, clients or testimonials. Mark anything unconfirmed as placeholder.
- Avoid em dashes in copy; keep sentences plain and short (the existing copy style).
- Accessible by default: skip link, focus management, `aria-*`, reduced motion, AA contrast. Keep it that way.
- Progressive enhancement: pages must work without JS. `main.js` is a module; the `js` class on `<html>` hides reveal content only until the script runs (3 s fallback).
- Keep CSS in the existing five files by purpose (tokens/base/components/sections/pages); use tokens, not hard-coded values.

## main.js behaviour (single file, no dependencies)
Sticky-header solid state (IntersectionObserver sentinel), mobile nav drawer with focus trap and Escape, Solutions dropdown (click, plus hover on pointer devices >= 1021 px), scroll reveal with stagger, pause of looping hero animations off-screen, Insights topic filter, and the **contact form**: client-side validation (name, email, institution, optional phone, message >= 10 chars), honeypot field `_gotcha`, `?interest=` prefill, fetch POST to Formspree with spinner/disabled state and success/error status. `form.noValidate` is set in JS so native validation still works without JS.

## Deployment and infrastructure (summary; details in README)
- Cloudflare Workers static assets, Git-connected. Build `npm run build`, deploy `npx wrangler deploy`.
- Domain edzira.com registered at GoDaddy, DNS on Cloudflare. **Email is Microsoft 365**: never delete or proxy the MX/SPF/DMARC/autodiscover/lyncdiscover/sip/msoid/email/DKIM selector records; email CNAMEs must stay "DNS only".
- Contact form: Formspree, delivers to `sparambil@edzira.com`.
- **CSP gotcha**: `src/static/_headers` contains a `Content-Security-Policy` with a sha256 hash of the inline script in `layouts/base.njk` (the `js` class / 3 s fallback). If that inline script changes by even one character, recompute the hash and update `_headers`, or the script is blocked in production. Other external hosts are not allowed: images, fonts and scripts must be self-hosted; only `formspree.io` is allowed for `connect-src`/`form-action`. Inline `style` attributes are permitted (`style-src 'unsafe-inline'`); inline scripts are not.
- Cache headers: fonts and photos immutable for a year; CSS/JS revalidate hourly. When replacing a photo, use a new filename or expect stale caching.

## Gotchas
- `photos.js` detects photos by `*.webp` files; the templates serve AVIF with WebP fallback. Both formats must be generated (the script does this).
- Solution pages are paginated from `solutions.js` with `addAllPagesToCollections: true`; keep that so all appear in the sitemap.
- `site.url` falls back to `https://edzira.example` locally, so canonical/OG URLs only look right in builds with `SITE_URL` set.
- Insights permalink returns `false` when `showInsights` is off, and computed data guards on `page.url`; preserve those guards when editing `posts.11tydata.js`.
- The git working tree is the source of truth: do not hand-edit `_site/`.

## Working agreements
- Make focused changes, rebuild (`npm run build`) and check for errors before finishing.
- Commit only when asked. Commit messages are short imperative sentences (see `git log`).
- Update [progress.md](progress.md) (and the README checklist if relevant) when you complete or discover work.
