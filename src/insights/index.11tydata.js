// `false` skips the Insights listing page while site.showInsights is off.
export default {
  permalink: (data) => (data.site.showInsights ? "/insights/" : false),
};
