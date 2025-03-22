import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ReactNode } from "react";

// Preload the fonts to avoid FOUC
const geistSans = Geist({
  variable: "--font-geist-sans",
  display: "swap",
  preload: true,
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  display: "swap",
  preload: true,
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "THE WORLD'S LARGEST HACKATHON | $1M+ in Prizes | hackathon.dev",
  description: "Join the largest hackathon in history with over $1M in prizes. A global competition powered by bolt.new with industry-leading sponsors and judges.",
  openGraph: {
    title: "THE WORLD'S LARGEST HACKATHON | $1M+ in Prizes | hackathon.dev",
    description: "Join the largest hackathon in history with over $1M in prizes. A global competition powered by bolt.new with industry-leading sponsors and judges.",
    url: "https://hackathon.dev",
    siteName: "THE WORLD'S LARGEST HACKATHON",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&display=swap" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.png" type="image/png" />
        {/* Override any problematic existing styles with !important */}
        <style dangerouslySetInnerHTML={{ __html: `
          body {
            margin: 0 !important;
            padding: 0 !important;
            overflow-x: hidden !important;
            background-color: #000 !important;
            color: #fff !important;
            min-height: 100vh !important;
            line-height: 1.5 !important;
          }
          * {
            box-sizing: border-box !important;
          }
          html {
            scroll-behavior: smooth !important;
          }
          .container {
            width: 100% !important;
            max-width: 1200px !important;
            margin: 0 auto !important;
            padding: 0 1rem !important;
          }
          @media (max-width: 768px) {
            h1, h2 {
              font-size: calc(1.5rem + 2vw) !important;
            }
            h3 {
              font-size: calc(1.2rem + 1vw) !important;
            }
            p {
              font-size: 1rem !important;
            }
          }
        `}} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white`}
      >
        {children}
      </body>
    </html>
  );
}
