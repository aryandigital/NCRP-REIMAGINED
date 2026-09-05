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
const fraunces = Fraunces({ variable: "--font-raksha-display-latin", subsets: ["latin"], axes: ["opsz"] });
const tiroDevanagari = Tiro_Devanagari_Hindi({ variable: "--font-raksha-display-indic", weight: "400", subsets: ["devanagari"] });

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
          <p><strong>Independent prototype.</strong> Fictional data only. No official report is sent.</p>
          <details>
            <summary>About this demo</summary>
            <p>Production authentication and security are not verified. Do not enter real victim data. Raksha is not a government service and does not send reports to authorities.</p>
          </details>
          <div className="prototype-banner-actions">
            <Link href="/shield">Open Call Shield</Link>
            <a href="tel:112">Immediate danger: call 112</a>
          </div>
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
