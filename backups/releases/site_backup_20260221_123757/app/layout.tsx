import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "LV Breaker Intelligence Portal"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        />
        <Script
          src="https://cdn.tailwindcss.com?plugins=forms,container-queries"
          strategy="beforeInteractive"
        />
        <Script id="tailwind-config" strategy="beforeInteractive">{`
          tailwind.config = {
            darkMode: "class",
            theme: {
              extend: {
                colors: {
                  "primary": "#2d2a26",
                  "accent": "#ff3b30",
                  "scandi-wood": "#f4efe6",
                  "scandi-warm-grey": "#e8e6e1",
                  "scandi-light": "#fafaf9",
                  "surface": "#ffffff",
                  "text-main": "#2d2a26",
                  "text-muted": "#8a817c"
                },
                fontFamily: {
                  "sans": ["Inter", "sans-serif"]
                },
                borderRadius: {
                  "xl": "1rem",
                  "2xl": "1.5rem",
                  "3xl": "2.5rem"
                },
                boxShadow: {
                  "scandi": "0 10px 30px -10px rgba(0, 0, 0, 0.04), 0 4px 6px -2px rgba(0, 0, 0, 0.01)"
                }
              }
            }
          };
        `}</Script>
      </head>
      <body className="scandi-gradient text-text-main antialiased h-screen overflow-hidden flex">{children}</body>
    </html>
  );
}
