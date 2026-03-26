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
    <html lang="en" suppressHydrationWarning>
      <body className="scandi-gradient text-text-main antialiased min-h-screen md:h-screen overflow-x-hidden md:overflow-hidden flex flex-col md:flex-row">
        {children}
      </body>
    </html>
  );
}
