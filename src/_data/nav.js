import solutions from "./solutions.js";

export default {
  // Built from solutions.js so names and links live in one place.
  solutions: solutions.map((s) => ({ title: s.title, href: `/solutions/${s.slug}/`, blurb: s.blurb })),
  main: [
    { title: "Approach", href: "/approach/" },
    { title: "Pilot Program", href: "/pilot-program/" },
    { title: "Insights", href: "/insights/" },
    { title: "About", href: "/about/" },
    { title: "Contact", href: "/contact/" },
  ],
  legal: [
    { title: "Privacy Policy", href: "/privacy/" },
    { title: "Terms of Use", href: "/terms/" },
  ],
};
