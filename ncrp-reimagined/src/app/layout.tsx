import type { Metadata } from "next";
import { Geist, Geist_Mono, Fraunces, Yatra_One, Tiro_Devanagari_Hindi } from "next/font/google";
import "./globals.css";
import EmergencyBar from "@/components/EmergencyBar";
import SiteLanguageLayer from "@/components/SiteLanguageLayer";
import AccessibilityTools from "@/components/AccessibilityTools";
import SarvamAgent from "@/components/SarvamAgent";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const fraunces = Fraunces({ variable: "--font-display", subsets: ["latin"], axes: ["opsz"] });
const yatraOne = Yatra_One({ variable: "--font-display-hindi", weight: "400", subsets: ["devanagari", "latin"] });
const tiroDevanagari = Tiro_Devanagari_Hindi({ variable: "--font-display-indic", weight: "400", subsets: ["devanagari"] });

export const metadata: Metadata = {
  title: "Raksha \u2014 Cyber Crime Response",
  description: "India\u2019s end-to-end cyber crime response system. Check, act, report, recover.",
  keywords: ["cyber crime", "scam", "fraud", "India", "NCRP", "1930"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} ${yatraOne.variable} ${tiroDevanagari.variable}`}>
      <body className="min-h-screen antialiased">
        <a href="#main-content" className="skip-link">Skip to main content</a>
        <EmergencyBar />
        {children}
        {/* Persistent disclaimer — required on every page (hackathon rule) */}
        <div className="border-t border-[var(--color-line)] bg-[var(--color-surface)] px-4 py-4 text-center">
          <p className="mx-auto max-w-3xl text-[11px] leading-5 text-[var(--color-ink-faint)]">
            <span className="font-bold">[SIMULATED ENCLAVE]</span> Raksha is an independent public-service prototype built for the Build What Moves India hackathon. It is not affiliated with the Government of India, MHA, I4C, or NCRP. This environment runs on sample data and does not transmit reports to any government body, bank, or platform. In an emergency, call <a href="tel:1930" className="font-bold text-[var(--color-ink)] underline">1930</a>.
          </p>
        </div>
        <SiteLanguageLayer />
        <AccessibilityTools />
        <SarvamAgent />
      </body>
    </html>
  );
}
