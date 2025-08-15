const createNextIntlPlugin = require('next-intl/plugin');
const { withSentryConfig } = require('@sentry/nextjs');

const withNextIntl = createNextIntlPlugin(
  // This is the default location for the i18n config
  './src/i18n.ts'
);

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
    formats: ['image/webp', 'image/avif'],
  },
};

// Apply Next Intl plugin first, then Sentry
const configWithIntl = withNextIntl(nextConfig);

// Sentry configuration options
const sentryWebpackPluginOptions = {
  // Additional config options for the Sentry Webpack plugin. Keep in mind that
  // the following options are set automatically, and overriding them is not
  // recommended:
  //   release, url, org, project, authToken, configFile, stripPrefix,
  //   urlPrefix, include, ignore
  
  org: 'spaceplus-worldwide',
  project: 'spaceplus-worldwide',
  
  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,
  
  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/
  
  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,
  
  // Transpiles SDK to be compatible with IE11 (increases bundle size)
  transpileClientSDK: true,
  
  // Routes browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers (increases server load)
  tunnelRoute: '/monitoring',
  
  // Hides source maps from generated client bundles
  hideSourceMaps: true,
  
  // Automatically tree-shake Sentry logger statements to reduce bundle size
  disableLogger: true,
  
  // Enables automatic instrumentation of Vercel Cron Monitors.
  automaticVercelMonitors: true,
};

module.exports = withSentryConfig(configWithIntl, sentryWebpackPluginOptions);