const { i18n } = require("./next-i18next.config");

module.exports = {
  i18n,
  reactStrictMode: true,
  compiler: {
    styledComponents: true, // If you're using styled-components
  },
  // Enable React dev overlay for better error messages
  devIndicators: {
    autoPrerender: false,
  },
  // Remove the eslint-loader configuration
  webpack: (config) => {
    // You can add other custom webpack configurations here if needed
    return config;
  },
  async rewrites() {
    return [
      {
        source: "/sitemap.xml",
        destination: "/api/sitemap",
      },
    ];
  },
  // Add logging for better debugging
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  // Add images configuration for external domains
  images: {
    domains: ["api.haatsign.sa"], // Add your image host domain here
  },
};
