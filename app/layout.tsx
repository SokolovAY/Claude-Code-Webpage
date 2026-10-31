import type { Metadata } from "next";
import { Caveat, Inter, JetBrains_Mono } from "next/font/google";
import clsx from "clsx";
import { publicEnv } from "@/lib/env";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const caveat = Caveat({ subsets: ["latin"], variable: "--font-caveat", display: "swap" });
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

// PLACEHOLDER (M0): metadata, Header, Footer, consent and analytics arrive in M2–M3.
export const metadata: Metadata = {
  metadataBase: new URL(publicEnv.siteUrl),
  title: "Andrei",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={clsx(inter.variable, caveat.variable, jetbrainsMono.variable, "antialiased")}
    >
      <body>{children}</body>
    </html>
  );
}
