# Edzira website

Static site built with [Eleventy](https://www.11ty.dev/). Output is plain HTML/CSS/JS in `_site/`. Live at https://edzira.com.

## Commands
- `npm install` once
- `npm start` runs a local preview with live reload at http://localhost:8080
- `npm run build` writes the site to `_site/`
- Set the real domain at build time: `SITE_URL=https://edzira.com npm run build` (used for canonical URLs, Open Graph and the sitemap)

## Where things live
- `src/assets/css/tokens.css` colours, type scale, spacing and motion. Change brand values here.
- `src/_data/site.js` company details, offices, contact email and phone, social links, the `showInsights` switch, primary button label.
- `src/_data/nav.js` main nav and the five solutions.
- `src/_includes/partials/` header, footer, SEO head (meta, Open Graph, JSON-LD), logo, icons.
- `src/insights/posts/` Insights articles (Markdown).
- `src/privacy.njk`, `src/terms.njk` legal pages. Edit the `lastUpdated` date at the top when the text changes.
- `wrangler.jsonc` tells Cloudflare which folder to publish (`_site`).
- `/styleguide/` internal page showing the design foundation (noindex, excluded from sitemap).

## Conventions
- Primary CTA everywhere: "Book a Consultation". Pilot page uses "Request a Pilot" (the header button keeps the width of the default label, so the nav never shifts).
- Process: 5 steps (Discover, Design, Deploy, Measure, Evolve).
- Add `data-reveal` to any element to fade it in on scroll; wrap siblings in `data-reveal-group` to stagger.
- Anything unverified (stats, case studies, partner logos) gets the `placeholder-flag` class until confirmed.

## Insights
- Each article needs `placeholder: false` in its front matter to be indexed and listed in the sitemap. With `placeholder: true` it is hidden from search engines but still listed on the Insights page (the DPDP article is held this way until a lawyer has reviewed it).
- Set the real publish date in each article's `date`.
- `showInsights: false` in `src/_data/site.js` hides the whole section (nav, home page, pages and sitemap).

## Photos
1. Download free photos (Unsplash, not "Unsplash+", or Pexels) into `photos-inbox/`, named after the slot they fill: `hero-campus`, `serve-universities`, `serve-colleges`, `serve-government`, `pilot-training`, `insight-learning`, `insight-campus`, `insight-cyber`.
2. Run `npm run photos`. It writes optimised AVIF and WebP files to `src/assets/photos/`.
3. Rebuild. Any slot without a photo shows a branded placeholder panel instead.
4. Note the photographer and source in `src/_data/credits.json` (a record only; it is not shown on the site).

`npm run build` sets `NODE_ENV=production`, which hides the dashed outlines that mark placeholder content (unverified stats) in local previews.

## Deploying

Hosting is **Cloudflare** (Workers with static assets), connected to the GitHub repo `AbhayThayyil/Edzira`. Every push to `main` triggers a build and publishes the site.

| Setting | Value |
| --- | --- |
| Build command | `npm run build` |
| Deploy command | `npx wrangler deploy` (reads `wrangler.jsonc`, publishes `_site`) |
| Build variables (Settings, Build, Variables and secrets) | `NODE_VERSION=20`, `SITE_URL=https://edzira.com`, `FORM_ACTION=https://formspree.io/f/xjywyjdg` |

`SITE_URL` sets canonical links, Open Graph URLs and the sitemap. `FORM_ACTION` connects the contact form. Both have safe defaults for local work. After changing a build variable, retry the build.

Security and caching headers come from `src/static/_headers`. If the inline script in the page head ever changes, update its hash in the `Content-Security-Policy` there.

### Domain and DNS
- The domain `edzira.com` is registered at GoDaddy; its **DNS is managed by Cloudflare** (nameservers `piper.ns.cloudflare.com` and `rajeev.ns.cloudflare.com`).
- **Main address: `https://edzira.com`.** `www.edzira.com` has a proxied placeholder A record (`192.0.2.1`) and a Cloudflare Redirect Rule that sends it to the bare domain. "Always Use HTTPS" is on.
- **Email is Microsoft 365.** Do not delete or proxy the email records in Cloudflare DNS: MX, the SPF/DMARC/`NETORGFT…` TXT records, `autodiscover`, `lyncdiscover`, `sip`, `msoid`, `email`, the `selector1/2._domainkey` and `secureserver1/2._domainkey` CNAMEs, and the two `_sip` SRV records. Email-related CNAMEs must stay "DNS only" (grey cloud).

### Contact form
Submissions go through Formspree (formspree.io) and are emailed to `sparambil@edzira.com`. The form's address is `FORM_ACTION` above. To switch providers, change `FORM_ACTION` and update `connect-src` and `form-action` in `src/static/_headers` and the Formspree mention in `src/privacy.njk`.

## Launch checklist

- [x] Formspree form created and `FORM_ACTION` set.
- [x] Domain connected to Cloudflare, `SITE_URL` set, www redirect and HTTPS redirect on.
- [x] Contact details (phone, email, head office) confirmed in `src/_data/site.js`.
- [x] Privacy and Terms approved (draft notices removed).
- [ ] The client confirms the Privacy commitments: 30-day reply, 24-month retention, no analytics.
- [ ] Social links: hidden for now. Add the real URLs under `social` in `src/_data/site.js` (they are `""` now) and each icon appears in the footer automatically.
- [ ] The DPDP article is reviewed by a lawyer, then set `placeholder: false`.
- [ ] SPF record includes Microsoft: `v=spf1 include:spf.protection.outlook.com include:secureserver.net -all`.
- [ ] Add the site to Google Search Console and Bing Webmaster Tools, submit `/sitemap.xml`.
- [ ] Open the live site in Safari and Firefox once (only Chromium is covered by automated checks).
