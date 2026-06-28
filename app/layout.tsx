import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Index Intelligence Engine — Field-Grade Market Intelligence",
  description:
    "AI-powered construction market intelligence. Search by zip, score companies, deploy outreach. Built for teams in the field.",
  keywords: "construction market intelligence, AI leads, company discovery, field operations, IIE",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Blocking theme init — prevents flash of wrong theme */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('iie-theme');if(t==='day'||t==='night'){document.documentElement.setAttribute('data-theme',t);}else{document.documentElement.setAttribute('data-theme','night');}}catch(e){}})();`,
          }}
        />
      </head>
      <body className="overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}

