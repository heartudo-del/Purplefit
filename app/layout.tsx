import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { AppInitializer } from "@/components/AppInitializer";
import { Toaster } from "@/components/ui/sonner";

// --- PWA METADATA ---
// This tells Next.js about your app's PWA features.
export const metadata: Metadata = {
  title: "Purple Fit - Meal Planner",
  description: "Professional meal planning tool for nutritionists",
  generator: "v0.app",
  // This is the crucial line that links your manifest file.
  manifest: "/manifest.json",
  // Icons for Apple devices
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Purple Fit",
  },
};

// This sets the theme color for the browser's address bar
export const viewport: Viewport = {
  themeColor: "#9333ea",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      {/* 
        The <head> tag is now automatically populated by Next.js using the
        metadata and viewport objects above. We don't need to add anything here manually.
      */}
      <body>
        {/* AppInitializer ensures your database is ready on load */}
        <AppInitializer />
        {children}
        {/* Toaster enables success/error notifications */}
        <Toaster />
      </body>
    </html>
  );
}
