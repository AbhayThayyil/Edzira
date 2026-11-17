// Global site settings. SITE_URL is set at build time once the domain is decided:
//   SITE_URL=https://edzira.com npm run build
const social = { linkedin: "", x: "", youtube: "" };

const offices = [
  { city: "Bangalore", label: "Head Office", street: "D004, SJR Palazza City, Sarjapura Main Road, Carmelram, Bangalore South", postalCode: "560035", region: "Karnataka" },
];

export default {
  name: "Edzira",
  legalName: "Edzira Digital Technologies Private Limited",
  tagline: "Transforming Institutions. Enabling Futures.",
  description:
    "Edzira partners with universities, colleges and public institutions to modernise learning, strengthen student outcomes and build future-ready academic ecosystems.",
  url: process.env.SITE_URL || "https://edzira.example",
  // Placeholder content (unverified stats etc.) is outlined in local previews, never in production builds.
  showPlaceholders: process.env.NODE_ENV !== "production",
  locale: "en_IN",
  language: "en-IN",
  themeColor: "#0A1A3A",
  ogImage: "/assets/img/og-default.png",
  // Insights section (nav, home page and /insights/). Set false to hide it everywhere.
  // Each article needs `placeholder: false` in its front matter to be indexed and listed in the sitemap.
  showInsights: true,
  // Confirmed contact details.
  email: "sparambil@edzira.com",
  phone: "+91 99405 95845",
  // Footer icons appear automatically for any network with a URL. Leave "" until the profile exists
  // (profiles are due about a month after launch).
  social,
  hasSocial: Object.values(social).some(Boolean),
  offices,
  // Used on the legal pages. Looked up by label so the order of `offices` does not matter.
  headOffice: offices.find((o) => o.label === "Head Office") ?? offices[0],
  // Contact form endpoint. Create a free form at formspree.io and paste its URL here
  // (or set FORM_ACTION at build time). Until then the form shows a friendly fallback.
  formAction: process.env.FORM_ACTION || "https://formspree.io/f/YOUR_FORM_ID",
  cta: { label: "Book a Consultation", href: "/contact/" },
};
