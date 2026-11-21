# Progress log: Edzira website

Status as of 2026-11-21: **live at https://edzira.com**, all core pages built and deployed. A few client-side and post-launch items remain (see "Open items"). Context and conventions are in [CLAUDE.md](CLAUDE.md).

## Timeline (from git history)
| Commit | Summary |
| --- | --- |
| `20d6aca` | First commit: Eleventy project, design foundation, base pages |
| `d8634cc` | Content updates, layout bug fixes, code-review fixes |
| `8779909` | Launch prep: real Insights articles, legal pages, contact updates |
| `5a9d9b6` | Cloudflare `wrangler.jsonc` so the built site publishes from `_site` |
| `bf0df36` | Contact form spinner and validation, new legal name, docs update |
| `36ca9cd` | Fix contact form error alignment, shorter validation messages |

## Done

### Foundation
- Eleventy 3 static site (Nunjucks + Markdown), no framework or bundler.
- Design system in `tokens.css` (navy/teal/cyan palette, type scale, spacing, motion) and an internal `/styleguide/` page.
- Self-hosted Plus Jakarta Sans variable font; logo in PNG/WebP sizes; SVG favicon; default Open Graph image.
- Shared partials: header (with Solutions dropdown and mobile drawer), footer, icon/logo macros, page macros (`pageHero`, `ctaBand`, `faqList`), responsive photo macro.
- Single-source data: `site.js` (company facts), `solutions.js` (all five solutions), `nav.js`.

### Pages
- Home, About, Approach (5-step process), Pilot Program, Contact, Privacy, Terms, 404, Solutions overview and five solution pages (Digital Learning, Academic Systems, Institutional Transformation, Cyber Readiness, Training & Enablement), each with capabilities, outcomes and FAQs.
- Insights section with topic filter and four articles: 90-day digital learning pilot, academic data reporting and accreditation, campus cyber readiness checklist (all published), and DPDP Act for universities and colleges (held with `placeholder: true`, noindex).
- Legal pages with lawyer-style notices approved and draft notices removed; legal name set to Edzira Digital Technologies Private Limited.

### Photos
- Eight stock photos (Unsplash/Pexels) optimised to AVIF + WebP at 640/1024/1600 px through `npm run photos`; sources recorded in `credits.json`. Branded placeholder panel remains as the fallback for any missing slot.

### SEO and metadata
- Per-page title/description, canonical URLs, Open Graph and Twitter tags, JSON-LD (organisation, page types, Article, breadcrumbs, FAQ), `sitemap.xml` and `robots.txt` generated from content, noindex for placeholder articles and the styleguide.

### Performance, accessibility, security
- Plain CSS/JS, AVIF/WebP responsive images, long-lived caching headers for fonts and photos.
- Skip link, focus trap in mobile drawer, Escape handling, ARIA states, reduced-motion support, AA-contrast action colour.
- Security headers in `src/static/_headers`: strict CSP (hash for the one inline script), HSTS, nosniff, referrer policy, permissions policy, frame denial.
- Scroll reveal with a 3-second no-JS/failed-JS fallback; looping hero animations pause off-screen.

### Contact form
- Formspree integration (`FORM_ACTION`), delivering to `sparambil@edzira.com`.
- Client-side validation with inline accessible errors, honeypot, `?interest=` prefill from solution/pilot CTAs, loading spinner with disabled button, success and error messages; error alignment and message length polished.

### Hosting and domain
- Cloudflare Workers static assets connected to GitHub `AbhayThayyil/Edzira`; auto-deploy on push to `main`.
- edzira.com on Cloudflare DNS (registrar GoDaddy), `www` redirect to the bare domain, Always Use HTTPS, Microsoft 365 email records preserved.

### Documentation
- `README.md` runbook (commands, conventions, insights, photos, deployment, DNS, launch checklist); this `CLAUDE.md` and `progress.md`.

## Open items
- [ ] Client confirms the Privacy commitments: 30-day reply, 24-month retention, no analytics.
- [ ] Social profiles: add real URLs under `social` in `src/_data/site.js` (planned about a month after launch); footer icons then appear automatically.
- [ ] Lawyer reviews the DPDP article, then set `placeholder: false`.
- [ ] Update SPF record to `v=spf1 include:spf.protection.outlook.com include:secureserver.net -all`.
- [ ] Add the site to Google Search Console and Bing Webmaster Tools and submit `/sitemap.xml`.
- [ ] Manually check the live site in Safari and Firefox (automated checks only covered Chromium).

## Ideas for future upgrades (not started)
- More Insights articles (publish real dates; set `placeholder: false` once approved).
- Verified case studies, statistics and partner logos to replace anything flagged `placeholder-flag` (none should ship unverified).
- Analytics (would require updating the CSP in `_headers`, the privacy policy and the "no analytics" commitment).
- Additional offices in `offices` in `site.js` (the contact page and legal pages already loop over it).
- Replace the default Open Graph image with page-specific images if desired.

## How to continue
1. `npm install`, `npm start`, edit, then `npm run build` to confirm it compiles.
2. Follow the "How to make common changes" section in CLAUDE.md.
3. Push to `main` to deploy; check the Cloudflare build if a variable changed.
4. Record finished work here and tick off open items.
