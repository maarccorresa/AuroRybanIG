import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AutoRayban - Metadata Editor",
  description: "Apply Ray-Ban Meta Smart Glasses 2 profile to your photos and videos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
