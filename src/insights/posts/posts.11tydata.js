// Defaults for every Insights article. Set `placeholder: false` once an article is real:
// placeholder articles are excluded from search engines (noindex) and the sitemap.
export default {
  layout: "layouts/article.njk",
  tags: ["insights"],
  bodyClass: "has-dark-hero",
  ogType: "article",
  placeholder: true,
  permalink: (data) => `/insights/${data.page.fileSlug}/`,
  eleventyComputed: {
    noindex: (data) => data.placeholder,
    breadcrumbs: (data) => [
      { title: "Home", href: "/" },
      { title: "Insights", href: "/insights/" },
      { title: data.title, href: data.page.url },
    ],
    ogImage: (data) => (data.image ? `/assets/photos/${data.image}-1024.webp` : undefined),
    schemaExtra: (data) => ({
      "@type": "Article",
      headline: data.title,
      description: data.description,
      datePublished: new Date(data.page.date).toISOString(),
      image: data.image ? new URL(`/assets/photos/${data.image}-1600.webp`, data.site.url).href : undefined,
      author: { "@type": "Organization", name: data.site.name },
      publisher: { "@id": new URL("/", data.site.url).href + "#organization" },
      mainEntityOfPage: new URL(data.page.url, data.site.url).href,
    }),
  },
};
