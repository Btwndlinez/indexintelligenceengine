import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Index Intelligence Engine (IIE) | AI-Powered Alpha",
  description:
    "AI-powered market intelligence, record enrichment, and multi-vertical business discovery engine.",
  keywords: "Market Intelligence, AI leads, business discovery, enrichment, sales leads",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-black text-white overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
