"use client";

import { useRakshaLanguage } from "@/hooks/useRakshaLanguage";

const COPY = {
  en: "If money is leaving your account now, call 1930 immediately. National Cybercrime Helpline, available 24 × 7.",
  hi: "अगर अभी आपके खाते से पैसा जा रहा है, तो तुरंत 1930 पर कॉल करें। राष्ट्रीय साइबर अपराध हेल्पलाइन 24 × 7 उपलब्ध है।",
  ta: "உங்கள் கணக்கிலிருந்து இப்போது பணம் வெளியேறினால் உடனே 1930-ஐ அழைக்கவும். தேசிய இணையக் குற்ற உதவி எண் 24 × 7 கிடைக்கும்.",
  te: "మీ ఖాతా నుంచి ఇప్పుడు డబ్బు వెళ్తుంటే వెంటనే 1930కి కాల్ చేయండి. జాతీయ సైబర్ క్రైమ్ హెల్ప్‌లైన్ 24 × 7 అందుబాటులో ఉంది.",
  bn: "এখনই আপনার অ্যাকাউন্ট থেকে টাকা চলে গেলে অবিলম্বে 1930-এ কল করুন। জাতীয় সাইবার ক্রাইম হেল্পলাইন 24 × 7 উপলব্ধ।",
  mr: "तुमच्या खात्यातून आत्ता पैसे जात असतील तर लगेच 1930 वर कॉल करा. राष्ट्रीय सायबर गुन्हे हेल्पलाइन 24 × 7 उपलब्ध आहे.",
};

export default function EmergencyBar() {
  const { language } = useRakshaLanguage();
  const message = COPY[language];
  const [before, after = ""] = message.split("1930");
  return <div className="emergency-bar" data-raksha-i18n="react"><span>{before}{" "}<a href="tel:1930" className="font-semibold text-ink underline underline-offset-2">1930</a>{" "}{after}</span></div>;
}
