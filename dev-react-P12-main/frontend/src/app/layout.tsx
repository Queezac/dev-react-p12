import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kasa - Location de logements entre particuliers",
  description: "Découvrez des appartements d'exception à louer partout en France avec Kasa.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <Header />

        <div style={{ flex: "1 0 auto", display: "flex", flexDirection: "column", width: "100%" }}>
          {children}
        </div>

        <Footer />
      </body>
    </html>
  );
}
