export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy({ "src/static": "/" });
  eleventyConfig.addWatchTarget("src/assets/");

  // Absolute URL helper for canonical links, Open Graph and the sitemap.
  eleventyConfig.addFilter("absoluteUrl", (path, base) => new URL(path || "/", base).href);
  eleventyConfig.addFilter("isoDate", (d) => new Date(d).toISOString().slice(0, 10));
  eleventyConfig.addFilter("readableDate", (d) => new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }));
  // JSON for <script type="application/ld+json">. "<" is escaped so text can never close the script tag.
  eleventyConfig.addFilter("json", (v) => (JSON.stringify(v) ?? "null").replace(/</g, "\\u003c"));

  return {
    dir: { input: "src", includes: "_includes", data: "_data", output: "_site" },
    templateFormats: ["njk", "md", "html"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
  };
}
