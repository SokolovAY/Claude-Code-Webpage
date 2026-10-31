import type { Metadata } from "next";
import { publicEnv } from "@/lib/env";
import "./globals.css";

// PLACEHOLDER (M0): fonts, metadata, Header, Footer, consent and analytics arrive in M1–M3.
export const metadata: Metadata = {
  metadataBase: new URL(publicEnv.siteUrl),
  title: "Andrei",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
