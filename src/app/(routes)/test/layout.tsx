
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "My Exported Page",
  description: "This is a page exported from my website builder.",
  keywords: "nextjs, react, export",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Outfit,+sans-serif:wght@400;700&family=Inter,+sans-serif:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}