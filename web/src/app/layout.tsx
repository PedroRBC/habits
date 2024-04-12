import type { Metadata, Viewport } from "next";
import "./globals.css";

import { siteConfig } from "@/config/site";

import { GeistSans } from "geist/font/sans";
import React from "react";
import { cn } from "@/lib/utils";
import { Providers } from "@/providers";
import Header from "@/components/header";
import Footer from "@/components/footer";
export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: "%s | " + siteConfig.name,
  },
  description: siteConfig.description,
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen w-screen bg-background font-sans antialiased text-foreground flex flex-col",
          GeistSans.variable,
        )}
      >
        <Providers>
          <Header />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
