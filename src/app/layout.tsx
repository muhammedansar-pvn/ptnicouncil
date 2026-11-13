import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SSF Puthanathani Sector Student Council 2026",
  description:
    "Official Online Registration Portal for SSF Puthanathani Sector Student Council on Friday, November 13, 2026 at Irfaa Campus, Vettichira.",
  keywords: [
    "SSF",
    "Student Council",
    "SSF Puthanathani Sector",
    "Irfaa Campus",
    "Vettichira",
    "SSF Malappuram",
    "Event Registration",
  ],
  authors: [{ name: "SSF Puthanathani Sector" }],
  openGraph: {
    title: "SSF Puthanathani Sector Student Council 2026",
    description: "Friday, Nov 13, 2026 • 7:00 PM • Irfaa Campus, Vettichira. Register online now.",
    type: "website",
    locale: "en_IN",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#0756A0",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Manjari:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased selection:bg-[#0756A0] selection:text-white min-h-screen bg-[#F7F9FC] text-[#172033]">
        {children}
      </body>
    </html>
  );
}
