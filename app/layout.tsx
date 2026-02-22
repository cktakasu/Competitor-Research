import type { Metadata } from "next";
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
      </head>
      <body className="scandi-gradient text-text-main antialiased min-h-screen md:h-screen overflow-x-hidden md:overflow-hidden flex flex-col md:flex-row">
        {children}
      </body>
    </html>
  );
}
