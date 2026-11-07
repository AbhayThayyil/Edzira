// Global site settings. SITE_URL is set at build time once the domain is decided:
//   SITE_URL=https://www.edzira.com npm run build
export default {
  name: "Edzira",
  legalName: "Edzira Learning Private Limited",
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
  // PLACEHOLDER contact details from the design mockups. Replace before launch.
  email: "hello@edzira.com",
  phone: "+91 80 1234 5678",
  social: {
    linkedin: "#",
    x: "#",
    youtube: "#",
  },
  offices: [
    { city: "Bangalore", label: "Head Office", street: "#45, 3rd Floor, 17th Cross, Sector 4, HSR Layout", postalCode: "560102", region: "Karnataka" },
    { city: "Calicut", label: "Office", street: "2nd Floor, Cyberpark Kozhikode", postalCode: "673016", region: "Kerala" },
    { city: "Pune", label: "Office", street: "5th Floor, West Wing, ICC Trade Tower, Senapati Bapat Road", postalCode: "411016", region: "Maharashtra" },
  ],
  // Contact form endpoint. Create a free form at formspree.io and paste its URL here
  // (or set FORM_ACTION at build time). Until then the form shows a friendly fallback.
  formAction: process.env.FORM_ACTION || "https://formspree.io/f/YOUR_FORM_ID",
  cta: { label: "Book a Consultation", href: "/contact/" },
};
