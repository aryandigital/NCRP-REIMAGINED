"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronDown, Headphones, HelpCircle, LoaderCircle, MailWarning, MessageCircle, Mic, RotateCcw, Send, ShieldAlert, Smartphone, Sparkles, Square, Volume2, Wallet, X } from "lucide-react";
import { AGENT_LANGUAGE_OPTIONS, LANGUAGE_LOCALES, type AgentLanguage } from "@/hooks/useRakshaLanguage";

type Message = { role: "user" | "assistant"; content: string };

type Plan = { steps: string[]; cta: { label: string; href: string } };
type FollowOption = { label: string; plan: Plan };
type PathDef = { followup: string; options: FollowOption[] };
type CategoryKey = "money" | "message" | "account" | "abuse" | "other";

type TriageCopy = {
  ask: string;
  labels: Record<CategoryKey, string>;
  paths: Record<CategoryKey, PathDef>;
  restart: string;
};

const CATEGORY_META: Array<{ key: CategoryKey; Icon: typeof Wallet }> = [
  { key: "money", Icon: Wallet },
  { key: "message", Icon: MailWarning },
  { key: "account", Icon: Smartphone },
  { key: "abuse", Icon: ShieldAlert },
  { key: "other", Icon: HelpCircle },
];

const STARTERS: Record<AgentLanguage, string> = {
  en: "I got a suspicious WhatsApp message",
  hi: "मुझे WhatsApp पर संदिग्ध मैसेज आया है",
  ta: "எனக்கு சந்தேகமான WhatsApp செய்தி வந்தது",
  te: "నాకు అనుమానాస్పద WhatsApp సందేశం వచ్చింది",
  bn: "আমি WhatsApp-এ সন্দেহজনক বার্তা পেয়েছি",
  mr: "मला WhatsApp वर संशयास्पद संदेश आला आहे",
};

const WELCOME: Record<AgentLanguage, string> = {
  en: "Namaste. I am Raksha Samvaad, your cyber-safety guide. You can type or speak in your language. If money is moving now, call 1930 first.",
  hi: "नमस्ते। मैं रक्षा संवाद हूँ, आपका साइबर सुरक्षा मार्गदर्शक। अपनी भाषा में बोलें या लिखें। अगर अभी पैसा जा रहा है, तो पहले 1930 पर कॉल करें।",
  ta: "வணக்கம். நான் ரக்ஷா சம்வாத், உங்கள் இணைய பாதுகாப்பு வழிகாட்டி. உங்கள் மொழியில் பேசலாம் அல்லது எழுதலாம். இப்போது பணம் சென்றால் முதலில் 1930-ஐ அழைக்கவும்.",
  te: "నమస్తే. నేను రక్ష సంవాద్, మీ సైబర్ భద్రత మార్గదర్శిని. మీ భాషలో మాట్లాడండి లేదా టైప్ చేయండి. ఇప్పుడు డబ్బు వెళ్తుంటే ముందుగా 1930కి కాల్ చేయండి.",
  bn: "নমস্কার। আমি রক্ষা সংবাদ, আপনার সাইবর নিরাপত্তা সহায়ক। নিজের ভাষায় বলুন বা লিখুন। এখন টাকা গেলে আগে 1930-এ কল করুন।",
  mr: "नमस्कार. मी रक्षा संवाद, तुमचा सायबर सुरक्षा मार्गदर्शक आहे. तुमच्या भाषेत बोला किंवा लिहा. आत्ता पैसे जात असतील तर आधी 1930 वर कॉल करा.",
};

const BROWSER_LOCALES = LANGUAGE_LOCALES;

const GREET: Record<AgentLanguage, string> = {
  en: "Scammed or confused? Tap here — I will walk you through the next safe step.",
  hi: "ठगी हुई या समझ नहीं आ रहा? यहाँ टैप करें — मैं अगला सुरक्षित कदम बताऊँगा।",
  ta: "மோசடி அல்லது குழப்பமா? இங்கே தட்டுங்கள் — அடுத்த பாதுகாப்பான படியை காட்டுகிறேன்.",
  te: "మోసం జరిగిందా లేదా అర్థం కావడం లేదా? ఇక్కడ నొక్కండి — తదుపరి సురక్షిత దశ చూపిస్తాను.",
  bn: "প্রতারণা হয়েছে বা দ্বিধায় আছেন? এখানে ট্যাপ করুন — পরের নিরাপদ পদক্ষেপ দেখিয়ে দেব।",
  mr: "फसवणूक झाली किंवा गोंधळ आहे? इथे टॅप करा — मी पुढची सुरक्षित पायरी दाखवेन.",
};

const TRIAGE: Record<AgentLanguage, TriageCopy> = {
  en: {
    ask: "What happened? Tap one — I will give you the exact steps.",
    labels: {
      money: "Money was stolen or a fraudulent payment",
      message: "Suspicious call, message, or link",
      account: "Account hacked or OTP/app misuse",
      abuse: "Harassment, blackmail, or morphed photos",
      other: "Something else",
    },
    paths: {
      money: {
        followup: "Is money leaving your account right now?",
        options: [
          { label: "Yes, right now", plan: { steps: ["Call 1930 immediately — the first hour decides whether the money can be frozen.", "Do not share any more OTP, UPI PIN, or screen access.", "Note the transaction/UPI reference and the scammer's number or handle.", "Then start an emergency record here so everything stays in one place."], cta: { label: "Start emergency record", href: "/check?mode=emergency" } } },
          { label: "It already happened", plan: { steps: ["Call 1930 now — funds can still be traced if you act fast.", "Save screenshots, chats, and transaction references.", "Inform your bank's fraud desk and request a freeze.", "File the incident here with your evidence attached."], cta: { label: "Report the fraud", href: "/check?mode=lost" } } },
          { label: "No, I have not paid", plan: { steps: ["Do not pay or share any code — that is the trap.", "Verify the number or ID here before doing anything.", "Screenshot everything in case you need it later."], cta: { label: "Verify the suspect", href: "/check" } } },
        ],
      },
      message: {
        followup: "Did you click the link or share any code or password?",
        options: [
          { label: "I clicked or shared something", plan: { steps: ["Stop — do not share anything further.", "Change passwords from a different, safe device.", "Call 1930 if any payment detail was involved.", "Check the link or number here to confirm the scam."], cta: { label: "Check it now", href: "/check?mode=emergency" } } },
          { label: "No, I only received it", plan: { steps: ["Do not click, reply, or call back.", "Verify the sender's number or ID here.", "Block and report the sender, then delete."], cta: { label: "Verify the sender", href: "/check" } } },
        ],
      },
      account: {
        followup: "What best describes it?",
        options: [
          { label: "I shared an OTP or PIN", plan: { steps: ["Call 1930 immediately — a shared OTP means money can move.", "Call your bank and freeze the account or card.", "Change every linked password from a safe device."], cta: { label: "Start emergency record", href: "/check?mode=emergency" } } },
          { label: "I installed an app they sent", plan: { steps: ["Disconnect from the internet, then uninstall the app.", "Run a device scan and change banking passwords from another device.", "Call 1930 if any money moved."], cta: { label: "Secure my case", href: "/check?mode=emergency" } } },
          { label: "My account was taken over", plan: { steps: ["Use the platform's recovery flow to log out all sessions.", "Change the password and turn on two-factor authentication.", "Warn contacts not to trust messages from that account."], cta: { label: "Report the takeover", href: "/check" } } },
        ],
      },
      abuse: {
        followup: "Are they demanding money or threatening to share photos?",
        options: [
          { label: "Yes, blackmail or threats", plan: { steps: ["Do not pay — paying only escalates the demands.", "Save everything: profiles, messages, payment handles.", "Report it here — these cases are handled with priority and confidentiality."], cta: { label: "Report safely", href: "/check?mode=emergency" } } },
          { label: "Harassment without money demand", plan: { steps: ["Do not engage or retaliate.", "Preserve evidence with screenshots and profile links.", "Report the account and file a complaint here."], cta: { label: "Start a report", href: "/check" } } },
        ],
      },
      other: { followup: "No problem — describe what happened in your own words below, and I will guide you.", options: [] },
    },
    restart: "Start over",
  },
  hi: {
    ask: "क्या हुआ? एक चुनें — मैं आपको सटीक कदम बताऊँगा।",
    labels: {
      money: "पैसे की धोखाधड़ी या गलत पेमेंट हुआ",
      message: "संदिग्ध कॉल, मैसेज या लिंक आया",
      account: "अकाउंट हैक हुआ या OTP/ऐप का दुरुपयोग",
      abuse: "उत्पीड़न, ब्लैकमेल या मॉर्फ़्ड फोटो",
      other: "कुछ और",
    },
    paths: {
      money: {
        followup: "क्या अभी इस समय आपके खाते से पैसा जा रहा है?",
        options: [
          { label: "हाँ, अभी जा रहा है", plan: { steps: ["तुरंत 1930 पर कॉल करें — पहला घंटा ही पैसा रोकने का असली समय है।", "कोई और OTP, UPI PIN या स्क्रीन एक्सेस बिल्कुल साझा न करें।", "ट्रांज़ैक्शन/UPI रेफरेंस और ठग का नंबर नोट करें।", "फिर यहाँ इमरजेंसी रिकॉर्ड शुरू करें ताकि सब कुछ एक जगह रहे।"], cta: { label: "इमरजेंसी रिकॉर्ड शुरू करें", href: "/check?mode=emergency" } } },
          { label: "पैसा जा चुका है", plan: { steps: ["अभी भी 1930 पर कॉल करें — जल्दी कार्रवाई पर पैसा ट्रेस हो सकता है।", "स्क्रीनशॉट, चैट और ट्रांज़ैक्शन रेफरेंस सुरक्षित रखें।", "बैंक के फ्रॉड डेस्क को सूचित कर फ्रीज़ का अनुरोध करें।", "सबूत के साथ यहाँ रिपोर्ट दर्ज करें।"], cta: { label: "धोखाधड़ी रिपोर्ट करें", href: "/check?mode=lost" } } },
          { label: "नहीं, अभी पेमेंट नहीं किया", plan: { steps: ["पैसा या कोई कोड न दें — यही जाल है।", "कुछ भी करने से पहले नंबर या ID यहाँ जाँचें।", "भविष्य के लिए सब कुछ स्क्रीनशॉट करें।"], cta: { label: "संदिग्ध की जाँच करें", href: "/check" } } },
        ],
      },
      message: {
        followup: "क्या आपने लिंक खोला या कोई कोड/पासवर्ड साझा किया?",
        options: [
          { label: "क्लिक किया या कुछ साझा किया", plan: { steps: ["रुकें — अब कुछ भी साझा न करें।", "दूसरे सुरक्षित डिवाइस से पासवर्ड बदलें।", "अगर पेमेंट जुड़ा है तो 1930 पर कॉल करें।", "लिंक या नंबर यहाँ जाँचकर पक्का करें।"], cta: { label: "अभी जाँचें", href: "/check?mode=emergency" } } },
          { label: "नहीं, सिर्फ मैसेज आया", plan: { steps: ["क्लिक, रिप्लाई या कॉल बैक न करें।", "भेजने वाले का नंबर या ID यहाँ जाँचें।", "ब्लॉक और रिपोर्ट करें, फिर डिलीट करें।"], cta: { label: "भेजने वाले की जाँच करें", href: "/check" } } },
        ],
      },
      account: {
        followup: "क्या स्थिति है?",
        options: [
          { label: "मैंने OTP/PIN साझा किया", plan: { steps: ["तुरंत 1930 पर कॉल करें — OTP साझा होने पर पैसा जा सकता है।", "बैंक को कॉल कर अकाउंट या कार्ड फ्रीज़ कराएँ।", "सुरक्षित डिवाइस से सभी पासवर्ड बदलें।"], cta: { label: "इमरजेंसी रिकॉर्ड शुरू करें", href: "/check?mode=emergency" } } },
          { label: "उनका भेजा ऐप इंस्टॉल किया", plan: { steps: ["इंटरनेट बंद करें, फिर ऐप अनइंस्टॉल करें।", "डिवाइस स्कैन करें और दूसरे डिवाइस से बैंकिंग पासवर्ड बदलें।", "पैसा गया हो तो 1930 पर कॉल करें।"], cta: { label: "केस सुरक्षित करें", href: "/check?mode=emergency" } } },
          { label: "अकाउंट पर कब्ज़ा हो गया", plan: { steps: ["प्लेटफ़ॉर्म के रिकवरी फ़्लो से सभी सेशन लॉगआउट करें।", "पासवर्ड बदलें और टू-फ़ैक्टर चालू करें।", "संपर्कों को चेतावनी दें कि उस अकाउंट से आए मैसेज पर भरोसा न करें।"], cta: { label: "रिपोर्ट दर्ज करें", href: "/check" } } },
        ],
      },
      abuse: {
        followup: "क्या वे पैसे माँग रहे हैं या फोटो वायरल करने की धमकी दे रहे हैं?",
        options: [
          { label: "हाँ, ब्लैकमेल/धमकी", plan: { steps: ["पैसा न दें — देने से माँग और बढ़ती है।", "प्रोफ़ाइल, मैसेज, पेमेंट हैंडल — सब सुरक्षित रखें।", "यहाँ रिपोर्ट करें — ऐसे मामले प्राथमिकता और गोपनीयता से देखे जाते हैं।"], cta: { label: "सुरक्षित रिपोर्ट करें", href: "/check?mode=emergency" } } },
          { label: "बिना पैसे की माँग के उत्पीड़न", plan: { steps: ["जवाब या प्रतिक्रिया न दें।", "स्क्रीनशॉट और प्रोफ़ाइल लिंक से सबूत सुरक्षित रखें।", "अकाउंट रिपोर्ट करें और यहाँ शिकायत दर्ज करें।"], cta: { label: "शिकायत शुरू करें", href: "/check" } } },
        ],
      },
      other: { followup: "कोई बात नहीं — नीचे अपने शब्दों में लिखिए या बोलिए, मैं मार्गदर्शन करूँगा।", options: [] },
    },
    restart: "फिर से शुरू करें",
  },
  ta: {
    ask: "என்ன நடந்தது? ஒன்றை தட்டுங்கள் — சரியான படிகளை சொல்கிறேன்.",
    labels: {
      money: "பணம் மோசடியாக சென்றது",
      message: "சந்தேகமான அழைப்பு, செய்தி அல்லது link",
      account: "Account hack அல்லது OTP/app தவறான பயன்பாடு",
      abuse: "துன்புறுத்தல், மிரட்டல் அல்லது morphed புகைப்படங்கள்",
      other: "வேறு ஏதோ",
    },
    paths: {
      money: {
        followup: "இப்போது பணம் உங்கள் account-இலிருந்து வெளியேறுகிறதா?",
        options: [
          { label: "ஆம், இப்போது", plan: { steps: ["உடனே 1930-ஐ அழைக்கவும் — முதல் ஒரு மணி நேரம் பணத்தை முடக்க முக்கியம்.", "மேலும் OTP, UPI PIN அல்லது screen access யாருக்கும் தர வேண்டாம்.", "Transaction/UPI reference மற்றும் மோசடி எண்ணை குறித்து வையுங்கள்.", "பின்னர் இங்கே emergency record தொடங்குங்கள்."], cta: { label: "Emergency record தொடங்கு", href: "/check?mode=emergency" } } },
          { label: "ஏற்கனவே சென்றுவிட்டது", plan: { steps: ["இப்போதும் 1930-ஐ அழைக்கவும் — விரைவான நடவடிக்கையில் பணம் trace ஆகும்.", "Screenshots, chat, transaction reference அனைத்தையும் சேமியுங்கள்.", "வங்கி fraud desk-ஐ அழைத்து freeze கோருங்கள்.", "ஆதாரத்துடன் இங்கே report செய்யுங்கள்."], cta: { label: "மோசடியை report செய்", href: "/check?mode=lost" } } },
          { label: "இல்லை, இன்னும் செலுத்தவில்லை", plan: { steps: ["பணமோ code-ஓ தர வேண்டாம் — இதுவே மோசடி.", "எதுவும் செய்யும் முன் எண்/ID-ஐ இங்கே சரிபாருங்கள்.", "எல்லாவற்றையும் screenshot செய்து வையுங்கள்."], cta: { label: "சந்தேக எண்ணை சரிபார்", href: "/check" } } },
        ],
      },
      message: {
        followup: "Link-ஐ திறந்தீர்களா அல்லது code/password பகிர்ந்தீர்களா?",
        options: [
          { label: "திறந்தேன்/பகிர்ந்தேன்", plan: { steps: ["நிறுத்துங்கள் — இனி எதுவும் பகிர வேண்டாம்.", "வேறு பாதுகாப்பான சாதனத்தில் password மாற்றுங்கள்.", "பணம் தொடர்புடையதெனில் 1930 அழைக்கவும்.", "Link/எண்ணை இங்கே சரிபாருங்கள்."], cta: { label: "இப்போது சரிபார்", href: "/check?mode=emergency" } } },
          { label: "இல்லை, செய்தி மட்டும் வந்தது", plan: { steps: ["Click, பதில் அல்லது call back செய்யாதீர்கள்.", "அனுப்பியவரின் எண்/ID-ஐ இங்கே சரிபாருங்கள்.", "Block மற்றும் report செய்து delete செய்யுங்கள்."], cta: { label: "அனுப்பியவரை சரிபார்", href: "/check" } } },
        ],
      },
      account: {
        followup: "எது பொருந்தும்?",
        options: [
          { label: "OTP/PIN பகிர்ந்தேன்", plan: { steps: ["உடனே 1930 அழைக்கவும் — OTP பகிரப்பட்டால் பணம் செல்லும்.", "வங்கியை அழைத்து account/card-ஐ freeze செய்யுங்கள்.", "பாதுகாப்பான சாதனத்தில் அனைத்து password-ஐயும் மாற்றுங்கள்."], cta: { label: "Emergency record தொடங்கு", href: "/check?mode=emergency" } } },
          { label: "அவர்கள் அனுப்பிய app நிறுவினேன்", plan: { steps: ["Internet-ஐ நிறுத்தி app-ஐ uninstall செய்யுங்கள்.", "Device scan செய்து வேறு சாதனத்தில் banking password மாற்றுங்கள்.", "பணம் சென்றால் 1930 அழைக்கவும்."], cta: { label: "வழக்கை பாதுகா", href: "/check?mode=emergency" } } },
          { label: "Account கைப்பற்றப்பட்டது", plan: { steps: ["Platform recovery flow மூலம் அனைத்து session-ஐயும் logout செய்யுங்கள்.", "Password மாற்றி two-factor இயக்குங்கள்.", "அந்த account-இலிருந்து வரும் செய்திகளை நம்ப வேண்டாம் என தொடர்புகளுக்கு எச்சரிக்கவும்."], cta: { label: "Report செய்", href: "/check" } } },
        ],
      },
      abuse: {
        followup: "பணம் கேட்கிறார்களா அல்லது புகைப்படங்களை பகிர்வதாக மிரட்டுகிறார்களா?",
        options: [
          { label: "ஆம், மிரட்டல்/பணம் கோரல்", plan: { steps: ["பணம் தர வேண்டாம் — கொடுத்தால் கோரிக்கை அதிகரிக்கும்.", "Profiles, messages, payment handles அனைத்தையும் சேமியுங்கள்.", "இங்கே report செய்யுங்கள் — இத்தகைய வழக்குகள் முன்னுரிமையுடன், ரகசியமாக கையாளப்படும்."], cta: { label: "பாதுகாப்பாக report செய்", href: "/check?mode=emergency" } } },
          { label: "பண கோரிக்கையின்றி துன்புறுத்தல்", plan: { steps: ["பதில் அளிக்காதீர்கள்.", "Screenshots மற்றும் profile links மூலம் ஆதாரம் சேமியுங்கள்.", "Account-ஐ report செய்து இங்கே புகார் பதியுங்கள்."], cta: { label: "புகார் தொடங்கு", href: "/check" } } },
        ],
      },
      other: { followup: "பரவாயில்லை — கீழே உங்கள் வார்த்தைகளில் எழுதுங்கள் அல்லது பேசுங்கள், நான் வழிகாட்டுகிறேன்.", options: [] },
    },
    restart: "மீண்டும் தொடங்கு",
  },
  te: {
    ask: "ఏం జరిగింది? ఒకటి నొక్కండి — ఖచ్చితమైన చర్యలు చెబుతాను.",
    labels: {
      money: "డబ్బు మోసం/తప్పు చెల్లింపు జరిగింది",
      message: "అనుమానాస్పద కాల్, మెసేజ్ లేదా link వచ్చింది",
      account: "Account hack లేదా OTP/app దుర్వినియోగం",
      abuse: "వేధింపు, బ్లాక్‌మెయిల్ లేదా morphed ఫోటోలు",
      other: "మరేదైనా",
    },
    paths: {
      money: {
        followup: "ఇప్పుడే మీ account నుండి డబ్బు వెళ్తోందా?",
        options: [
          { label: "అవును, ఇప్పుడే", plan: { steps: ["వెంటనే 1930కి కాల్ చేయండి — మొదటి గంట డబ్బు ఆపడానికి కీలకం.", "ఇక OTP, UPI PIN లేదా screen access ఎవరికీ ఇవ్వవద్దు.", "Transaction/UPI reference మరియు మోసగాడి నంబర్ నోట్ చేసుకోండి.", "తర్వాత ఇక్కడ emergency record ప్రారంభించండి."], cta: { label: "Emergency record ప్రారంభించండి", href: "/check?mode=emergency" } } },
          { label: "ఇప్పటికే వెళ్లిపోయింది", plan: { steps: ["ఇప్పుడూ 1930కి కాల్ చేయండి — త్వరగా చర్య తీసుకుంటే డబ్బు trace అవుతుంది.", "Screenshots, chat, transaction reference అన్నీ సేవ్ చేయండి.", "బ్యాంక్ fraud deskకి తెలియజేసి freeze అడగండి.", "ఆధారాలతో ఇక్కడ report చేయండి."], cta: { label: "మోసాన్ని report చేయండి", href: "/check?mode=lost" } } },
          { label: "లేదు, ఇంకా చెల్లించలేదు", plan: { steps: ["డబ్బూ codeనూ ఇవ్వవద్దు — ఇదే మోసం.", "ఏదీ చేయకముందు నంబర్/IDని ఇక్కడ తనిఖీ చేయండి.", "అన్నీ screenshot చేసి ఉంచండి."], cta: { label: "అనుమానితుణ్ణి తనిఖీ చేయండి", href: "/check" } } },
        ],
      },
      message: {
        followup: "Link తెరిచారా లేదా code/password పంచుకున్నారా?",
        options: [
          { label: "తెరిచాను/పంచాను", plan: { steps: ["ఆపండి — ఇక ఏమీ పంచవద్దు.", "మరో సురక్షిత device నుండి password మార్చండి.", "డబ్బు సంబంధం ఉంటే 1930కి కాల్ చేయండి.", "Link/నంబర్ ఇక్కడ తనిఖీ చేయండి."], cta: { label: "ఇప్పుడే తనిఖీ", href: "/check?mode=emergency" } } },
          { label: "లేదు, మెసేజ్ మాత్రమే వచ్చింది", plan: { steps: ["Click చేయవద్దు, reply ఇవ్వవద్దు, call back చేయవద్దు.", "పంపినవారి నంబర్/IDని ఇక్కడ తనిఖీ చేయండి.", "Block మరియు report చేసి delete చేయండి."], cta: { label: "పంపినవారిని తనిఖీ", href: "/check" } } },
        ],
      },
      account: {
        followup: "ఏది జరిగింది?",
        options: [
          { label: "OTP/PIN పంచాను", plan: { steps: ["వెంటనే 1930కి కాల్ చేయండి — OTP పంచితే డబ్బు వెళ్తుంది.", "బ్యాంక్‌కు కాల్ చేసి account/card freeze చేయించండి.", "సురక్షిత device నుండి అన్ని passwordలు మార్చండి."], cta: { label: "Emergency record ప్రారంభించండి", href: "/check?mode=emergency" } } },
          { label: "వారు పంపిన app install చేశాను", plan: { steps: ["Internet ఆపి appని uninstall చేయండి.", "Device scan చేసి మరో device నుండి banking password మార్చండి.", "డబ్బు వెళ్లి ఉంటే 1930కి కాల్ చేయండి."], cta: { label: "కేసు సురక్షితం చేయండి", href: "/check?mode=emergency" } } },
          { label: "Account స్వాధీనమైంది", plan: { steps: ["Platform recovery flowతో అన్ని sessionలు logout చేయండి.", "Password మార్చి two-factor ఆన్ చేయండి.", "ఆ account నుండి వచ్చే మెసేజ్‌లు నమ్మవద్దని పరిచయాలకు హెచ్చరించండి."], cta: { label: "Report చేయండి", href: "/check" } } },
        ],
      },
      abuse: {
        followup: "డబ్బు కోరుతున్నారా లేదా ఫోటోలు పంచుతామని బెదిరిస్తున్నారా?",
        options: [
          { label: "అవును, బెదిరింపు/డబ్బు కోరిక", plan: { steps: ["డబ్బు ఇవ్వవద్దు — ఇస్తే కోరికలు పెరుగుతాయి.", "Profiles, messages, payment handles అన్నీ సేవ్ చేయండి.", "ఇక్కడ report చేయండి — ఈ కేసులు ప్రాధాన్యంతో, గోప్యంగా పరిష్కరించబడతాయి."], cta: { label: "సురక్షితంగా report చేయండి", href: "/check?mode=emergency" } } },
          { label: "డబ్బు కోరిక లేని వేధింపు", plan: { steps: ["స్పందించవద్దు.", "Screenshots మరియు profile linksతో ఆధారాలు సేవ్ చేయండి.", "Accountని report చేసి ఇక్కడ ఫిర్యాదు నమోదు చేయండి."], cta: { label: "ఫిర్యాదు ప్రారంభించండి", href: "/check" } } },
        ],
      },
      other: { followup: "పరవాలేదు — క్రింద మీ మాటల్లో వ్రాయండి లేదా మాట్లాడండి, నేను మార్గదర్శకత్వం చేస్తాను.", options: [] },
    },
    restart: "మళ్లీ ప్రారంభించండి",
  },
  bn: {
    ask: "কী হয়েছে? একটি বেছে নিন — আমি সঠিক পদক্ষেপ বলে দেব।",
    labels: {
      money: "টাকা প্রতারণায় চলে গেছে বা ভুল পেমেন্ট",
      message: "সন্দেহজনক কল, মেসেজ বা লিংক এসেছে",
      account: "অ্যাকাউন্ট হ্যাক বা OTP/অ্যাপ অপব্যবহার",
      abuse: "হয়রানি, ব্ল্যাকমেইল বা morph করা ছবি",
      other: "অন্য কিছু",
    },
    paths: {
      money: {
        followup: "এই মুহূর্তে কি আপনার অ্যাকাউন্ট থেকে টাকা যাচ্ছে?",
        options: [
          { label: "হ্যাঁ, এখনই যাচ্ছে", plan: { steps: ["এখনই 1930-এ কল করুন — প্রথম ঘণ্টাই টাকা আটকানোর আসল সময়।", "আর কোনো OTP, UPI PIN বা screen access কাউকে দেবেন না।", "Transaction/UPI reference আর প্রতারকের নম্বর নোট করুন।", "তারপর এখানে emergency record শুরু করুন।"], cta: { label: "Emergency record শুরু করুন", href: "/check?mode=emergency" } } },
          { label: "এরই মধ্যে চলে গেছে", plan: { steps: ["এখনও 1930-এ কল করুন — দ্রুত পদক্ষেপে টাকা trace হতে পারে।", "Screenshot, chat আর transaction reference সব সংরক্ষণ করুন।", "ব্যাংকের fraud desk-কে জানিয়ে freeze চান।", "প্রমাণসহ এখানে report করুন।"], cta: { label: "প্রতারণা report করুন", href: "/check?mode=lost" } } },
          { label: "না, এখনও পেমেন্ট করিনি", plan: { steps: ["টাকা বা code কিছুই দেবেন না — এটাই ফাঁদ।", "কিছু করার আগে নম্বর/ID এখানে যাচাই করুন।", "সবকিছুর screenshot রাখুন।"], cta: { label: "সন্দেহজনকটি যাচাই করুন", href: "/check" } } },
        ],
      },
      message: {
        followup: "আপনি কি লিংকে ক্লিক করেছেন বা code/password শেয়ার করেছেন?",
        options: [
          { label: "ক্লিক করেছি/শেয়ার করেছি", plan: { steps: ["থামুন — আর কিছু শেয়ার করবেন না।", "অন্য নিরাপদ ডিভাইস থেকে password বদলান।", "পেমেন্ট জড়িত থাকলে 1930-এ কল করুন।", "লিংক/নম্বর এখানে যাচাই করুন।"], cta: { label: "এখনই যাচাই করুন", href: "/check?mode=emergency" } } },
          { label: "না, শুধু মেসেজ এসেছে", plan: { steps: ["ক্লিক, reply বা call back করবেন না।", "প্রেরকের নম্বর/ID এখানে যাচাই করুন।", "Block ও report করুন, তারপর delete করুন।"], cta: { label: "প্রেরককে যাচাই করুন", href: "/check" } } },
        ],
      },
      account: {
        followup: "কোনটি ঘটেছে?",
        options: [
          { label: "OTP/PIN শেয়ার করেছি", plan: { steps: ["এখনই 1930-এ কল করুন — OTP শেয়ার হলে টাকা যেতে পারে।", "ব্যাংকে কল করে অ্যাকাউন্ট/কার্ড freeze করান।", "নিরাপদ ডিভাইস থেকে সব password বদলান।"], cta: { label: "Emergency record শুরু করুন", href: "/check?mode=emergency" } } },
          { label: "তাদের পাঠানো অ্যাপ install করেছি", plan: { steps: ["ইন্টারনেট বন্ধ করে অ্যাপটি uninstall করুন।", "ডিভাইস scan করে অন্য ডিভাইস থেকে banking password বদলান।", "টাকা গেলে 1930-এ কল করুন।"], cta: { label: "কেস সুরক্ষিত করুন", href: "/check?mode=emergency" } } },
          { label: "অ্যাকাউন্ট দখলে চলে গেছে", plan: { steps: ["Platform-এর recovery flow দিয়ে সব session logout করুন।", "Password বদলে two-factor চালু করুন।", "পরিচিতদের সতর্ক করুন যেন ওই অ্যাকাউন্টের মেসেজ বিশ্বাস না করে।"], cta: { label: "Report করুন", href: "/check" } } },
        ],
      },
      abuse: {
        followup: "তারা কি টাকা চাইছে বা ছবি ছড়িয়ে দেওয়ার হুমকি দিচ্ছে?",
        options: [
          { label: "হ্যাঁ, হুমকি/টাকা চাওয়া হচ্ছে", plan: { steps: ["টাকা দেবেন না — দিলে দাবি বাড়বে।", "Profile, message, payment handle সব সংরক্ষণ করুন।", "এখানে report করুন — এসব কেস অগ্রাধিকার ও গোপনীয়তার সঙ্গে দেখা হয়।"], cta: { label: "নিরাপদে report করুন", href: "/check?mode=emergency" } } },
          { label: "টাকার দাবি ছাড়া হয়রানি", plan: { steps: ["প্রতিক্রিয়া দেবেন না।", "Screenshot ও profile link দিয়ে প্রমাণ সংরক্ষণ করুন।", "অ্যাকাউন্টটি report করে এখানে অভিযোগ দায়ের করুন।"], cta: { label: "অভিযোগ শুরু করুন", href: "/check" } } },
        ],
      },
      other: { followup: "কোনো সমস্যা নেই — নিচে নিজের ভাষায় লিখুন বা বলুন, আমি পথ দেখাব।", options: [] },
    },
    restart: "আবার শুরু করুন",
  },
  mr: {
    ask: "काय झाले? एक निवडा — मी नेमक्या पायऱ्या सांगेन.",
    labels: {
      money: "पैशांची फसवणूक/चुकीचा पेमेंट झाला",
      message: "संशयास्पद कॉल, मेसेज किंवा लिंक आली",
      account: "अकाउंट हॅक झाले किंवा OTP/ॲपचा गैरवापर",
      abuse: "छळ, ब्लॅकमेल किंवा मॉर्फ केलेले फोटो",
      other: "काहीतरी वेगळे",
    },
    paths: {
      money: {
        followup: "आत्ताच तुमच्या खात्यातून पैसे जात आहेत का?",
        options: [
          { label: "होय, आत्ताच", plan: { steps: ["लगेच 1930 वर कॉल करा — पहिला तास पैसे थांबवण्यासाठी महत्त्वाचा.", "आणखी OTP, UPI PIN किंवा screen access कोणालाही देऊ नका.", "Transaction/UPI reference आणि फसवणूक करणाऱ्याचा नंबर नोंदवा.", "मग इथे emergency record सुरू करा."], cta: { label: "Emergency record सुरू करा", href: "/check?mode=emergency" } } },
          { label: "पैसे आधीच गेले", plan: { steps: ["आत्ताही 1930 वर कॉल करा — लवकर कारवाई केल्यास पैसे trace होऊ शकतात.", "Screenshots, chat आणि transaction reference सर्व जतन करा.", "बँकेच्या fraud desk ला कळवून freeze मागा.", "पुराव्यासह इथे तक्रार नोंदवा."], cta: { label: "फसवणूक नोंदवा", href: "/check?mode=lost" } } },
          { label: "नाही, अजून पेमेंट केले नाही", plan: { steps: ["पैसे किंवा code देऊ नका — हाच सापळा आहे.", "काही करण्यापूर्वी नंबर/ID इथे तपासा.", "सर्व काही screenshot करून ठेवा."], cta: { label: "संशयिताची तपासणी करा", href: "/check" } } },
        ],
      },
      message: {
        followup: "तुम्ही लिंक उघडली किंवा code/पासवर्ड शेअर केला का?",
        options: [
          { label: "उघडले/शेअर केले", plan: { steps: ["थांबा — पुढे काहीही शेअर करू नका.", "दुसऱ्या सुरक्षित डिव्हाइसवरून पासवर्ड बदला.", "पैसे संबंधित असतील तर 1930 वर कॉल करा.", "लिंक/नंबर इथे तपासा."], cta: { label: "आता तपासा", href: "/check?mode=emergency" } } },
          { label: "नाही, फक्त मेसेज आला", plan: { steps: ["Click, reply किंवा call back करू नका.", "पाठवणाऱ्याचा नंबर/ID इथे तपासा.", "Block आणि report करा, मग delete करा."], cta: { label: "पाठवणारा तपासा", href: "/check" } } },
        ],
      },
      account: {
        followup: "काय झाले ते निवडा?",
        options: [
          { label: "OTP/PIN शेअर केला", plan: { steps: ["लगेच 1930 वर कॉल करा — OTP शेअर झाला तर पैसे जाऊ शकतात.", "बँकेला कॉल करून अकाउंट/कार्ड freeze करा.", "सुरक्षित डिव्हाइसवरून सर्व पासवर्ड बदला."], cta: { label: "Emergency record सुरू करा", href: "/check?mode=emergency" } } },
          { label: "त्यांचा पाठवलेला ॲप install केला", plan: { steps: ["इंटरनेट बंद करून ॲप uninstall करा.", "डिव्हाइस scan करा आणि दुसऱ्या डिव्हाइसवरून banking पासवर्ड बदला.", "पैसे गेले असतील तर 1930 वर कॉल करा."], cta: { label: "केस सुरक्षित करा", href: "/check?mode=emergency" } } },
          { label: "अकाउंट ताब्यात गेले", plan: { steps: ["Platform च्या recovery flow ने सर्व session logout करा.", "पासवर्ड बदला आणि two-factor सुरू करा.", "त्या अकाउंटवरून येणाऱ्या मेसेजवर विश्वास ठेवू नका म्हणून परिचितांना इशारा द्या."], cta: { label: "तक्रार नोंदवा", href: "/check" } } },
        ],
      },
      abuse: {
        followup: "ते पैसे मागत आहेत का किंवा फोटो पसरवण्याची धमकी देत आहेत?",
        options: [
          { label: "होय, धमकी/पैशांची मागणी", plan: { steps: ["पैसे देऊ नका — दिल्यास मागण्या वाढतात.", "Profiles, messages, payment handles सर्व जतन करा.", "इथे तक्रार करा — अशा प्रकरणांना प्राधान्याने व गोपनीयतेने हाताळले जाते."], cta: { label: "सुरक्षित तक्रार करा", href: "/check?mode=emergency" } } },
          { label: "पैशांच्या मागणीशिवाय छळ", plan: { steps: ["प्रतिसाद देऊ नका.", "Screenshots आणि profile links ने पुरावा जतन करा.", "अकाउंट report करा आणि इथे तक्रार नोंदवा."], cta: { label: "तक्रार सुरू करा", href: "/check" } } },
        ],
      },
      other: { followup: "हरकत नाही — खाली तुमच्या शब्दांत लिहा किंवा बोला, मी मार्गदर्शन करेन.", options: [] },
    },
    restart: "पुन्हा सुरू करा",
  },
};

type BrowserRecognition = { continuous: boolean; interimResults: boolean; lang: string; onend: (() => void) | null; onerror: (() => void) | null; onresult: ((event: { results: ArrayLike<{ 0: { transcript: string } }> }) => void) | null; start: () => void; stop: () => void };
type VoiceWindow = Window & { SpeechRecognition?: new () => BrowserRecognition; webkitSpeechRecognition?: new () => BrowserRecognition };

export default function SarvamAgent() {
  const [open, setOpen] = useState(false);
  const [greeted, setGreeted] = useState(false);
  const [showGreet, setShowGreet] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [recording, setRecording] = useState(false);
  const [language, setLanguage] = useState<AgentLanguage>("en");
  const [activePath, setActivePath] = useState<CategoryKey | null>(null);
  const [activePlan, setActivePlan] = useState<Plan | null>(null);
  const [triageDone, setTriageDone] = useState(false);
  const recognition = useRef<BrowserRecognition | null>(null);
  const textarea = useRef<HTMLTextAreaElement | null>(null);
  const visibleMessages = useMemo(() => messages.length ? messages : [{ role: "assistant" as const, content: WELCOME[language] }], [language, messages]);
  const triage = TRIAGE[language];

  useEffect(() => {
    const openAgent = () => { setOpen(true); dismissGreet(); window.setTimeout(() => textarea.current?.focus(), 60); };
    window.addEventListener("raksha:open-agent", openAgent);
    return () => window.removeEventListener("raksha:open-agent", openAgent);
  }, []);

  // Default the conversation language to the site language the visitor chose.
  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const stored = window.localStorage.getItem("raksha-language");
        if (stored && AGENT_LANGUAGE_OPTIONS.some((option) => option.code === stored)) {
          setLanguage(stored as AgentLanguage);
        }
      } catch { /* storage blocked */ }
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  // Surface the assistant once per visitor so it is discoverable without
  // blocking the page; dismissing or opening the dock ends the greeting.
  useEffect(() => {
    if (window.localStorage.getItem("raksha-samvaad-greeted") === "true") {
      return;
    }
    const timer = window.setTimeout(() => setShowGreet(true), 1800);
    return () => window.clearTimeout(timer);
  }, []);

  function dismissGreet() {
    setShowGreet(false);
    setGreeted(true);
    try { window.localStorage.setItem("raksha-samvaad-greeted", "true"); } catch { /* storage blocked */ }
  }

  useEffect(() => () => recognition.current?.stop(), []);

  function resetTriage() {
    setActivePath(null);
    setActivePlan(null);
    setTriageDone(false);
  }

  function restart() {
    setMessages([]);
    resetTriage();
  }

  function pickCategory(key: CategoryKey) {
    const path = triage.paths[key];
    setMessages((current) => [...current, { role: "user", content: triage.labels[key] }, { role: "assistant", content: path.followup }]);
    setActivePlan(null);
    setActivePath(path.options.length ? key : null);
    setTriageDone(path.options.length === 0);
  }

  function pickFollowOption(option: FollowOption) {
    const planText = option.plan.steps.map((step, index) => `${index + 1}. ${step}`).join("\n");
    setMessages((current) => [...current, { role: "user", content: option.label }, { role: "assistant", content: planText }]);
    setActivePath(null);
    setActivePlan(option.plan);
    setTriageDone(true);
  }

  async function send(event?: FormEvent) {
    event?.preventDefault();
    const content = input.trim();
    if (!content || loading) return;
    const nextMessages = [...messages, { role: "user" as const, content }];
    setMessages(nextMessages);
    setInput("");
    setActivePath(null);
    setLoading(true);
    try {
      const response = await fetch("/api/agent", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ language, messages: nextMessages }) });
      const data = await response.json() as { reply?: string };
      setMessages((current) => [...current, { role: "assistant", content: data.reply ?? WELCOME[language] }]);
    } catch {
      setMessages((current) => [...current, { role: "assistant", content: WELCOME[language] }]);
    } finally {
      setLoading(false);
    }
  }

  function toggleVoice() {
    if (recording) { recognition.current?.stop(); return; }
    const Recognition = (window as VoiceWindow).SpeechRecognition ?? (window as VoiceWindow).webkitSpeechRecognition;
    if (!Recognition) { setInput("Voice input is not available in this browser. You can type your message here."); return; }
    const instance = new Recognition();
    instance.continuous = false;
    instance.interimResults = true;
    instance.lang = BROWSER_LOCALES[language];
    instance.onresult = (event) => setInput(Array.from(event.results).map((result) => result[0].transcript).join(" ").trim());
    instance.onerror = () => setRecording(false);
    instance.onend = () => setRecording(false);
    recognition.current = instance;
    setRecording(true);
    instance.start();
  }

  function speakLatest() {
    const latest = visibleMessages.at(-1)?.content;
    if (!latest || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(latest);
    utterance.lang = BROWSER_LOCALES[language];
    window.speechSynthesis.speak(utterance);
  }

  return <aside className={`samvaad-dock ${open ? "samvaad-dock-open" : ""}`} data-raksha-i18n="react" aria-label="Raksha Samvaad multilingual cyber safety assistant">
    {!open && showGreet && !greeted && (
      <div className="samvaad-greet" role="status">
        {GREET[language]}
        <button type="button" onClick={dismissGreet} aria-label="Dismiss assistant greeting"><X size={13} aria-hidden="true" /></button>
      </div>
    )}
    {!open && <button type="button" className="samvaad-fab" onClick={() => { setOpen(true); dismissGreet(); }} aria-label="Open Raksha Samvaad, talk or type for cyber safety help"><span className="samvaad-fab-mark"><MessageCircle size={14} aria-hidden="true" /></span><strong>Talk to Raksha</strong></button>}
    {open && (
      <section className="samvaad-panel" role="dialog" aria-modal="false" aria-label="Raksha Samvaad assistant">
        <div className="samvaad-spectrum" aria-hidden="true" />
        <div className="samvaad-top">
          <div className="flex min-w-0 items-center gap-3">
            <span className="samvaad-orbit"><Sparkles size={18} aria-hidden="true" /></span>
            <div><p className="kicker">Raksha Samvaad / रक्षा संवाद</p><h2>Talk, type, or listen</h2></div>
          </div>
          <button type="button" className="samvaad-close" onClick={() => setOpen(false)} aria-label="Close Raksha Samvaad"><X size={18} aria-hidden="true" /></button>
        </div>
        <div className="samvaad-info"><Headphones size={15} aria-hidden="true" />You do not need to write. Choose your language, speak, then listen to the response.</div>
        <div className="samvaad-language">
          <label htmlFor="agent-language">Conversation language</label>
          <div>
            <select id="agent-language" value={language} onChange={(event) => { setLanguage(event.target.value as AgentLanguage); setMessages([]); resetTriage(); }}>
              <option value="en">English</option>
              {AGENT_LANGUAGE_OPTIONS.filter((option) => option.code !== "en").map((option) => <option key={option.code} value={option.code}>{option.native}</option>)}
            </select>
            <ChevronDown size={14} aria-hidden="true" />
          </div>
        </div>
        <div className="samvaad-thread" aria-live="polite">
          {visibleMessages.map((message, index) => <div key={`${message.role}-${index}-${message.content.slice(0, 16)}`} className={`samvaad-message samvaad-${message.role}`}>{message.content}</div>)}
          {loading && <div className="samvaad-message samvaad-assistant flex items-center gap-2"><LoaderCircle size={15} className="animate-spin" aria-hidden="true" />Finding the next safe step…</div>}
        </div>
        {messages.length === 0 && !loading && (
          <div className="samvaad-triage">
            <p className="samvaad-triage-label">{triage.ask}</p>
            <div className="samvaad-triage-grid">
              {CATEGORY_META.map(({ key, Icon }) => (
                <button key={key} type="button" className="samvaad-triage-option" onClick={() => pickCategory(key)}>
                  <Icon size={16} aria-hidden="true" />{triage.labels[key]}
                </button>
              ))}
            </div>
          </div>
        )}
        {activePath && !loading && (
          <div className="samvaad-triage">
            <div className="samvaad-triage-chips">
              {triage.paths[activePath].options.map((option) => (
                <button key={option.label} type="button" className="samvaad-triage-option" onClick={() => pickFollowOption(option)}>{option.label}</button>
              ))}
            </div>
          </div>
        )}
        {activePlan && (
          <Link href={activePlan.cta.href} className="samvaad-plan-cta" onClick={() => setOpen(false)}>
            {activePlan.cta.label}<ArrowRight size={14} aria-hidden="true" />
          </Link>
        )}
        <div className="samvaad-actions">
          <button type="button" onClick={() => setInput(STARTERS[language])}>{STARTERS[language]}</button>
          <button type="button" onClick={speakLatest}><Volume2 size={14} aria-hidden="true" />Listen</button>
          {triageDone && <button type="button" onClick={restart}><RotateCcw size={13} aria-hidden="true" />{triage.restart}</button>}
        </div>
        <form onSubmit={send} className="samvaad-compose">
          <textarea ref={textarea} value={input} onChange={(event) => setInput(event.target.value)} placeholder="Speak or type what happened…" rows={2} />
          <button type="button" onClick={toggleVoice} className={recording ? "samvaad-mic samvaad-recording" : "samvaad-mic"} aria-label={recording ? "Stop voice input" : "Start voice input"}>{recording ? <Square size={15} aria-hidden="true" /> : <Mic size={17} aria-hidden="true" />}</button>
          <button type="submit" className="samvaad-send" disabled={!input.trim() || loading} aria-label="Send to Raksha Samvaad"><Send size={17} aria-hidden="true" /></button>
        </form>
        <p className="samvaad-note">Safety guidance only. No OTP, PIN, password, or real account detail is needed.</p>
      </section>
    )}
  </aside>;
}
