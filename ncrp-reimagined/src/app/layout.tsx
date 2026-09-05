import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
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
  title: "Raksha | Independent Cyber Safety Prototype",
  description: "Independent cyber-safety prototype for fictional data only. Production authentication and security are not verified; do not enter real victim data. Not a government service; no reports are filed. For immediate danger call 112; financial cyber fraud: 1930.",
  keywords: ["cyber crime", "scam", "fraud", "India", "NCRP", "1930"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} ${tiroDevanagari.variable}`}>
      <body className="min-h-screen antialiased">
        <a href="#main-content" className="skip-link">Skip to main content</a>
        <div className="prototype-banner" lang="en" data-raksha-i18n="react">
          <p><strong>Independent prototype. Fictional data only.</strong> Production authentication and security are not verified. Do not enter real victim data. Not a government service; no reports are filed or sent to authorities.</p>
          <Link href="/shield" className="font-bold underline underline-offset-4">Open Call Shield</Link>
          <a href="tel:112" className="font-bold underline underline-offset-4">Immediate danger: call 112</a>
        </div>
        <EmergencyBar />
        {children}
        <Suspense fallback={null}><SiteLanguageLayer /></Suspense>
        <AccessibilityTools />
        <Suspense fallback={null}><SarvamAgent /></Suspense>
      </body>
    </html>
  );
}
