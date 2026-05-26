import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Projet 12 • OpenClassrooms Dashboard",
  description: "Plateforme interactive moderne et ultra-fluide conçue pour le Projet 12 d'OpenClassrooms. Interface utilisateur premium et performante.",
  authors: [{ name: "OpenClassrooms Student" }],
  robots: "index, follow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>
        {/* Ambient Glowing Background Elements */}
        <div className="glow-grid" />
        <div className="glow-orbs">
          <div className="orb orb-1" />
          <div className="orb orb-2" />
          <div className="orb orb-3" />
        </div>

        {/* Main Layout Container */}
        <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
          {children}
        </div>
      </body>
    </html>
  );
}
