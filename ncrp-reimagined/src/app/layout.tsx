import type { Metadata } from "next";
import { Geist, Geist_Mono, Fraunces, Tiro_Devanagari_Hindi } from "next/font/google";
import "./globals.css";
import EmergencyBar from "@/components/EmergencyBar";
import SiteLanguageLayer from "@/components/SiteLanguageLayer";
import AccessibilityTools from "@/components/AccessibilityTools";
import SarvamAgent from "@/components/SarvamAgent";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const fraunces = Fraunces({ variable: "--font-display", subsets: ["latin"], axes: ["opsz"] });
const tiroDevanagari = Tiro_Devanagari_Hindi({ variable: "--font-display-indic", weight: "400", subsets: ["devanagari"] });

export const metadata: Metadata = {
  title: "Raksha — Cyber Crime Response",
  description: "India's end-to-end cyber crime response system. Check, act, report, recover.",
  keywords: ["cyber crime", "scam", "fraud", "India", "NCRP", "1930"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} ${tiroDevanagari.variable}`}>
      <body className="min-h-screen antialiased">
        <a href="#main-content" className="skip-link">Skip to main content</a>
        <EmergencyBar />
        {children}
        <SiteLanguageLayer />
        <AccessibilityTools />
        <SarvamAgent />
      </body>
    </html>
  );
}
