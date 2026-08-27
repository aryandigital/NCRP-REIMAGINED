import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type AgentMessage = { role: "user" | "assistant"; content: string };
type Language = "en" | "hi" | "ta" | "te" | "bn" | "mr";

const FALLBACKS: Record<Language, { urgent: string; general: string }> = {
  en: { urgent: "If money is leaving your account now, call 1930 immediately. Do not share another OTP, UPI PIN, or screen access. Save the chat and transaction reference, then start the incident record here.", general: "I can help you identify the next safe step. Save the message or screenshot, do not click new links, and never share an OTP or UPI PIN. Tell me whether money has already moved, an app was installed, or you only received a suspicious message." },
  hi: { urgent: "अगर अभी आपके खाते से पैसा जा रहा है, तो तुरंत 1930 पर कॉल करें। कोई और OTP, UPI PIN या स्क्रीन एक्सेस साझा न करें। चैट और ट्रांज़ैक्शन रेफरेंस सुरक्षित रखें, फिर यहाँ incident record शुरू करें।", general: "मैं अगला सुरक्षित कदम पहचानने में मदद कर सकता हूँ। मैसेज या स्क्रीनशॉट सुरक्षित रखें, नए लिंक न खोलें और OTP या UPI PIN कभी साझा न करें। बताइए क्या पैसा जा चुका है, कोई ऐप इंस्टॉल हुआ है, या केवल संदिग्ध संदेश मिला है।" },
  ta: { urgent: "இப்போது பணம் வெளியேறினால் உடனே 1930-ஐ அழைக்கவும். OTP, UPI PIN அல்லது screen access-ஐ மீண்டும் பகிர வேண்டாம். chat மற்றும் transaction reference-ஐ சேமித்து, பிறகு incident record-ஐ தொடங்குங்கள்.", general: "அடுத்த பாதுகாப்பான படியை கண்டறிய உதவுகிறேன். செய்தி அல்லது screenshot-ஐ சேமியுங்கள், புதிய link-களை திறக்காதீர்கள், OTP அல்லது UPI PIN-ஐ பகிராதீர்கள். பணம் சென்றதா, app நிறுவப்பட்டதா, அல்லது சந்தேகமான செய்தி மட்டும் வந்ததா என்று சொல்லுங்கள்." },
  te: { urgent: "ఇప్పుడు డబ్బు వెళ్తుంటే వెంటనే 1930కి కాల్ చేయండి. మరో OTP, UPI PIN లేదా screen access ఇవ్వవద్దు. chat మరియు transaction reference‌ని సేవ్ చేసి, ఆపై incident record ప్రారంభించండి.", general: "తర్వాతి సురక్షితమైన దశను గుర్తించడంలో సహాయం చేస్తాను. message లేదా screenshotని సేవ్ చేయండి, కొత్త links తెరవవద్దు, OTP లేదా UPI PIN ఎప్పుడూ పంచుకోవద్దు. డబ్బు వెళ్లిందా, app install చేశారా, లేదా అనుమానాస్పద సందేశం మాత్రమే వచ్చిందా చెప్పండి." },
  bn: { urgent: "এখন টাকা চলে গেলে অবিলম্বে 1930-এ কল করুন। আর কোনও OTP, UPI PIN বা screen access দেবেন না। chat এবং transaction reference সংরক্ষণ করুন, তারপর এখানে incident record শুরু করুন।", general: "পরের নিরাপদ পদক্ষেপ বুঝতে সাহায্য করতে পারি। message বা screenshot রেখে দিন, নতুন link খুলবেন না, OTP বা UPI PIN কখনও শেয়ার করবেন না। টাকা গেছে কি না, app install হয়েছে কি না, নাকি শুধু সন্দেহজনক message এসেছে বলুন।" },
  mr: { urgent: "आत्ता पैसे जात असतील तर लगेच 1930 वर कॉल करा. आणखी OTP, UPI PIN किंवा screen access देऊ नका. chat आणि transaction reference जतन करा, नंतर इथे incident record सुरू करा.", general: "पुढची सुरक्षित पायरी ओळखण्यात मी मदत करू शकतो. message किंवा screenshot जतन करा, नवीन links उघडू नका आणि OTP किंवा UPI PIN कधीही शेअर करू नका. पैसे गेले का, app install झाले का, की फक्त संशयास्पद message आला आहे ते सांगा." },
};

function fallback(language: Language, prompt: string) {
  const urgent = /money|paid|transfer|upi|debit|पैसा|भुगतान|पैसे|பணம்|డబ్బు|টাকা/i.test(prompt);
  return FALLBACKS[language][urgent ? "urgent" : "general"];
}

export async function POST(request: NextRequest) {
  const body = await request.json() as { language?: Language; messages?: AgentMessage[] };
  const language = body.language && FALLBACKS[body.language] ? body.language : "en";
  const messages = (body.messages ?? []).filter((message) => message.role === "user" || message.role === "assistant").slice(-8).map((message) => ({ ...message, content: message.content.slice(0, 1200) }));
  const prompt = messages.filter((message) => message.role === "user").at(-1)?.content ?? "";
  const apiKey = process.env.SARVAM_API_KEY;

  if (!apiKey) return NextResponse.json({ reply: fallback(language, prompt), provider: "local-safety-fallback" });

   const system = `You are Raksha Samvaad, a multilingual Indian cyber-safety guide inside an independent public-service platform. Reply in ${language === "en" ? "Indian English" : "the user's selected Indian language"}. Use calm, reassuring language and answer with short numbered action steps when advising what to do. If money may be moving, make step 1 "Call 1930 now". Never ask for OTP, PIN, passwords, full bank account numbers, Aadhaar, PAN, or real personal data. Do not claim to submit a complaint or contact a bank or government body. Explain that this environment does not transmit a complaint, then guide the person to preserve evidence and choose the next safe action.`;

  try {
    const response = await fetch(process.env.SARVAM_CHAT_API_URL ?? "https://api.sarvam.ai/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "api-subscription-key": apiKey, Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({ model: process.env.SARVAM_CHAT_MODEL ?? "sarvam-m", temperature: 0.25, max_tokens: 360, messages: [{ role: "system", content: system }, ...messages] }),
    });
    if (!response.ok) return NextResponse.json({ reply: fallback(language, prompt), provider: "local-safety-fallback" });
    const data = await response.json() as { choices?: Array<{ message?: { content?: string } }> };
    const reply = data.choices?.[0]?.message?.content?.trim();
    return NextResponse.json({ reply: reply || fallback(language, prompt), provider: reply ? "sarvam" : "local-safety-fallback" });
  } catch {
    return NextResponse.json({ reply: fallback(language, prompt), provider: "local-safety-fallback" });
  }
}
