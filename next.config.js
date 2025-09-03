/**
 * @type {import('next-pwa').PWAConfig}
 */
const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  cacheOnFrontEndNav: true,
  reloadOnOnline: true,
  disable: process.env.NODE_ENV === 'development',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Your other Next.js config options can go here if you have any.
  // For example:
  // images: {
  //   remotePatterns: [...]
  // }
};

// This is the standard, correct way to apply the PWA configuration
module.exports = withPWA(nextConfig);
