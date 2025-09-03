/**
 * @type {import('next-pwa').PWAConfig}
 */
const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,

  // --- NEW RECOMMENDED FIELDS ---
  
  /**
   * Caches pages that are navigated to on the client-side.
   * This makes your app feel much faster and more like a native app.
   */
  cacheOnFrontEndNav: true,

  /**
   * Automatically reloads the app when the user comes back online.
   * This ensures they always have the freshest content after being offline.
   */
  reloadOnOnline: true,

  /**
   * Disables the PWA in the development environment.
   * This is highly recommended to prevent caching issues that can be
   * very frustrating when you are trying to see your code changes.
   */
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

module.exports = withPWA(nextConfig);
