"use client";

import { useEffect } from "react";
import { useRakshaLanguage, type RakshaLanguage } from "@/hooks/useRakshaLanguage";

/**
 * Site-wide translation layer for the operational routes (check, track, atlas,
 * act, report, recover, operator). The homepage, header, and emergency bar are
 * translated through React dictionaries; this layer covers the remaining routes
 * by rewriting visible text nodes and re-applying after client-side renders.
 */

const HINDI: Record<string, string> = {
  "Back to response desk": "रिस्पॉन्स डेस्क पर वापस",
  "Back to action board": "एक्शन बोर्ड पर वापस",
  "Back to recovery cockpit": "रिकवरी कॉकपिट पर वापस",
  "Quick Exit": "त्वरित बाहर निकलें",
  "Triage": "प्राथमिक जाँच",
  "Tell the story": "घटना बताएं",
  "Confirm facts": "तथ्यों की पुष्टि",
  "Act and track": "कार्रवाई और ट्रैकिंग",
  "Step 01 / incident intake": "चरण 01 / घटना इनटेक",
  "Show us what happened.": "बताइए क्या हुआ।",
  "We will identify the script, explain what may happen next, and prepare the safest response path.": "हम ठगी का तरीका पहचानेंगे, आगे क्या हो सकता है समझाएंगे, और सबसे सुरक्षित प्रतिक्रिया पथ तैयार करेंगे।",
  "If money is leaving now, call 1930 before you finish this form.": "अगर अभी पैसा जा रहा है, तो फॉर्म पूरा करने से पहले 1930 पर कॉल करें।",
  "Start with the incident record. We will keep the recovery actions in view.": "घटना रिकॉर्ड से शुरू करें। रिकवरी कार्रवाईयां हम सामने रखेंगे।",
  "This environment does not transmit reports to authorities.": "यह वातावरण अधिकारियों को रिपोर्ट नहीं भेजता है।",
  "Message": "मैसेज",
  "Voice": "आवाज़",
  "Screenshot": "स्क्रीनशॉट",
  "Number or link": "नंबर या लिंक",
  "Private image hash": "निजी छवि फ़िंगरप्रिंट",
  "Paste the message or conversation": "मैसेज या बातचीत पेस्ट करें",
  "English, Hindi, and Hinglish input are accepted. Avoid entering real personal information in this environment.": "अंग्रेज़ी, हिंदी और हिंग्लिश इनपुट स्वीकार किए जाते हैं। इस वातावरण में असली निजी जानकारी न डालें।",
  "Tell the story in your own words": "अपने शब्दों में घटना बताएं",
  "Use the browser microphone for a local transcript. Hinglish works best when you choose the language you naturally speak.": "लोकल ट्रांसक्रिप्ट के लिए ब्राउज़र माइक्रोफ़ोन का उपयोग करें। जिस भाषा में आप स्वाभाविक रूप से बोलते हैं उसे चुनें।",
  "Voice language": "आवाज़ की भाषा",
  "Start recording": "रिकॉर्डिंग शुरू करें",
  "Stop recording": "रिकॉर्डिंग रोकें",
  "Transcript": "ट्रांसक्रिप्ट",
  "Drop an image here or browse": "यहां छवि छोड़ें या ब्राउज़ करें",
  "Remove image": "छवि हटाएं",
  "Local fingerprinting": "लोकल फ़िंगरप्रिंटिंग",
  "Enter a phone number, UPI ID, or link": "फ़ोन नंबर, UPI ID या लिंक डालें",
  "Identifiers are analysed as incident evidence. Never enter real account numbers or OTPs.": "पहचानकर्ताओं का घटना साक्ष्य के रूप में विश्लेषण होता है। असली खाता नंबर या OTP कभी न डालें।",
  "Analyse this incident": "इस घटना का विश्लेषण करें",
  "Create local fingerprint": "लोकल फ़िंगरप्रिंट बनाएं",
  "Want to see the complete response path?": "पूरा प्रतिक्रिया पथ देखना चाहते हैं?",
  "Open the example task-scam case": "उदाहरण टास्क-स्कैम केस खोलें",
  "Money moving now?": "अभी पैसा जा रहा है?",
  "Call 1930 immediately. This intake can wait.": "तुरंत 1930 पर कॉल करें। यह फॉर्म बाद में भी हो सकता है।",
  "Call 1930": "1930 पर कॉल करें",
  "Privacy boundary": "गोपनीयता सीमा",
  "Text is redacted before model analysis. Uploaded screenshots are temporary analysis inputs. Private-image fingerprints stay local.": "मॉडल विश्लेषण से पहले टेक्स्ट संपादित किया जाता है। अपलोड किए गए स्क्रीनशॉट अस्थायी विश्लेषण इनपुट हैं। निजी छवि फ़िंगरप्रिंट डिवाइस पर ही रहते हैं।",
  "Case tracking": "केस ट्रैकिंग",
  "Find your recovery plan.": "अपना रिकवरी प्लान खोजें।",
  "Enter the acknowledgement number from your case record. An example case is available without an account.": "अपने केस रिकॉर्ड का पावती नंबर डालें। बिना खाते के एक उदाहरण केस उपलब्ध है।",
  "Acknowledgement number": "पावती नंबर",
  "Open case": "केस खोलें",
  "Open an example case": "उदाहरण केस खोलें",
  "See clocks, packet statuses, routing events, and the recovery warning in the complete journey.": "पूरी प्रक्रिया में समय-सीमाएं, पैकेट स्टेटस, रूटिंग इवेंट्स और रिकवरी चेतावनी देखें।",
  "Threat bulletin / pattern corpus": "खतरा बुलेटिन / पैटर्न कोष",
  "Active scam scripts in the atlas.": "एटलस में सक्रिय ठगी के तरीके।",
  "These are behavioural playbooks sourced from public advisories and represented with anonymised examples. A pattern match is a warning, not a finding of guilt.": "ये सार्वजनिक परामर्शों से लिए गए व्यवहारिक तरीके हैं, जिन्हें गुमनाम उदाहरणों से दिखाया गया है। पैटर्न मैच एक चेतावनी है, दोष का प्रमाण नहीं।",
  "High risk": "उच्च जोखिम",
  "Read playbook": "तरीका पढ़ें",
  "This is what the evidence suggests.": "साक्ष्य से यह संकेत मिलता है।",
  "Confirm extracted facts": "निकाले गए तथ्यों की पुष्टि करें",
  "Act in the right order.": "सही क्रम में कार्रवाई करें।",
  "Review the incident before routing.": "रूटिंग से पहले घटना की समीक्षा करें।",
  "Advisory result": "परामर्शी परिणाम",
  "Recovery cockpit": "रिकवरी कॉकपिट",
  "Recovery scam warning": "रिकवरी स्कैम चेतावनी",
  "A filed report can attract a second scam.": "दर्ज रिपोर्ट दूसरी ठगी को आकर्षित कर सकती है।",
  "No police officer, CBI official, bank representative, or I4C representative should ask for money to release your funds.": "कोई भी पुलिस अधिकारी, CBI अधिकारी, बैंक प्रतिनिधि या I4C प्रतिनिधि आपका पैसा छुड़ाने के लिए पैसे नहीं मांगेगा।",
  "Case state": "केस स्थिति",
  "packets prepared": "पैकेट तैयार",
  "facts still open": "तथ्य अभी बाकी",
  "Call 1930 now": "अभी 1930 पर कॉल करें",
  "Prepare response packets": "रिस्पॉन्स पैकेट तैयार करें",
  "Read threat bulletin": "खतरा बुलेटिन पढ़ें",
  "Financial amount": "वित्तीय राशि",
  "Bank or wallet": "बैंक या वॉलेट",
  "Incident description": "घटना का विवरण",
  "This prepares recipient-specific records. Nothing is transmitted to an institution from this environment.": "यह प्राप्तकर्ता-विशिष्ट रिकॉर्ड तैयार करता है। इस वातावरण से किसी संस्था को कुछ नहीं भेजा जाता।",
  "Operator console / case record": "ऑपरेटर कंसोल / केस रिकॉर्ड",
  "See the incident graph behind the journey.": "प्रक्रिया के पीछे का घटना ग्राफ देखें।",
  "Freeze through your bank": "अपने बैंक से फ्रीज़ कराएं",
  "Preserve evidence before deleting anything.": "कुछ भी हटाने से पहले साक्ष्य सुरक्षित करें।",
  "New incident": "नई घटना",
};

const TAMIL: Record<string, string> = {
  "Back to response desk": "பதில் மையத்திற்குத் திரும்பு",
  "Back to action board": "நடவடிக்கை பலகைக்குத் திரும்பு",
  "Back to recovery cockpit": "மீட்பு மையத்திற்குத் திரும்பு",
  "Triage": "முதல் பிரிப்பு",
  "Tell the story": "சம்பவத்தைச் சொல்லுங்கள்",
  "Confirm facts": "உண்மைகளை உறுதி செய்யுங்கள்",
  "Act and track": "செயல்படுத்தி கண்காணியுங்கள்",
  "Step 01 / incident intake": "படி 01 / சம்பவ பதிவு",
  "Show us what happened.": "என்ன நடந்தது என்பதைக் காட்டுங்கள்.",
  "We will identify the script, explain what may happen next, and prepare the safest response path.": "மோசடி முறையைக் கண்டறிந்து, அடுத்து என்ன நடக்கும் என விளக்கி, பாதுகாப்பான பதில் பாதையைத் தயாரிப்போம்.",
  "If money is leaving now, call 1930 before you finish this form.": "இப்போது பணம் சென்றால், இந்தப் படிவத்தை முடிக்கும் முன் 1930-ஐ அழைக்கவும்.",
  "Start with the incident record. We will keep the recovery actions in view.": "சம்பவ பதிவில் தொடங்குங்கள். மீட்பு நடவடிக்கைகளைக் கண்முன் வைத்திருப்போம்.",
  "This environment does not transmit reports to authorities.": "இந்த சூழல் அதிகாரிகளுக்குப் புகார்களை அனுப்பாது.",
  "Message": "செய்தி",
  "Voice": "குரல்",
  "Screenshot": "திரைக்காட்சி",
  "Number or link": "எண் அல்லது இணைப்பு",
  "Private image hash": "தனியார் பட குறிப்பு",
  "Paste the message or conversation": "செய்தி அல்லது உரையாடலை ஒட்டவும்",
  "Tell the story in your own words": "உங்கள் சொந்த வார்த்தைகளில் சொல்லுங்கள்",
  "Voice language": "குரல் மொழி",
  "Start recording": "பதிவைத் தொடங்கு",
  "Stop recording": "பதிவை நிறுத்து",
  "Transcript": "உரைநகல்",
  "Drop an image here or browse": "இங்கே படத்தை இடவும் அல்லது உலாவவும்",
  "Remove image": "படத்தை அகற்று",
  "Local fingerprinting": "உள்ளக குறிப்புருவம்",
  "Enter a phone number, UPI ID, or link": "தொலைபேசி எண், UPI ID அல்லது இணைப்பை உள்ளிடவும்",
  "Identifiers are analysed as incident evidence. Never enter real account numbers or OTPs.": "அடையாளங்கள் சம்பவ ஆதாரமாக பகுப்பாய்வு செய்யப்படுகின்றன. உண்மையான கணக்கு எண்கள் அல்லது OTP-களை உள்ளிட வேண்டாம்.",
  "Analyse this incident": "இந்த சம்பவத்தை பகுப்பாய்வு செய்",
  "Create local fingerprint": "உள்ளக குறிப்புருவம் உருவாக்கு",
  "Want to see the complete response path?": "முழு பதில் பாதையைக் காண விரும்புகிறீர்களா?",
  "Open the example task-scam case": "எடுத்துக்காட்டு டாஸ்க்-ஸ்கேம் வழக்கைத் திற",
  "Money moving now?": "இப்போது பணம் செல்கிறதா?",
  "Call 1930 immediately. This intake can wait.": "உடனே 1930-ஐ அழைக்கவும். இந்தப் பதிவு காத்திருக்கும்.",
  "Call 1930": "1930-ஐ அழை",
  "Privacy boundary": "தனியுரிமை எல்லை",
  "Text is redacted before model analysis. Uploaded screenshots are temporary analysis inputs. Private-image fingerprints stay local.": "மாடல் பகுப்பாய்வுக்கு முன் உரை திருத்தப்படுகிறது. பதிவேற்றிய திரைக்காட்சிகள் தற்காலிக பகுப்பாய்வு உள்ளீடுகள். தனிப்பட்ட பட குறிப்புகள் சாதனத்திலேயே இருக்கும்.",
  "English, Hindi, and Hinglish input are accepted. Avoid entering real personal information in this environment.": "தமிழ் உட்பட பல மொழி உள்ளீடுகள் ஏற்கப்படுகின்றன. இந்த சூழலில் உண்மையான தனிப்பட்ட தகவல்களை உள்ளிட வேண்டாம்.",
  "Case tracking": "வழக்கு கண்காணிப்பு",
  "Find your recovery plan.": "உங்கள் மீட்பு திட்டத்தைக் கண்டறியவும்.",
  "Enter the acknowledgement number from your case record. An example case is available without an account.": "உங்கள் வழக்கு பதிவின் அங்கீகார எண்ணை உள்ளிடவும். கணக்கு இல்லாமல் ஒரு எடுத்துக்காட்டு வழக்கு கிடைக்கும்.",
  "Acknowledgement number": "அங்கீகார எண்",
  "Open case": "வழக்கைத் திற",
  "Open an example case": "எடுத்துக்காட்டு வழக்கைத் திற",
  "Threat bulletin / pattern corpus": "அச்சுறுத்தல் அறிவிப்பு / முறை தொகுப்பு",
  "Active scam scripts in the atlas.": "அட்லஸில் உள்ள நடப்பு மோசடி முறைகள்.",
  "High risk": "அதிக ஆபத்து",
  "Read playbook": "முறையைப் படி",
  "This is what the evidence suggests.": "ஆதாரம் இதையே காட்டுகிறது.",
  "Confirm extracted facts": "பிரித்தெடுக்கப்பட்ட உண்மைகளை உறுதி செய்யவும்",
  "Act in the right order.": "சரியான வரிசையில் செயல்படுங்கள்.",
  "Review the incident before routing.": "அனுப்பும் முன் சம்பவத்தை மதிப்பாய்வு செய்யுங்கள்.",
  "Advisory result": "ஆலோசனை முடிவு",
  "Recovery cockpit": "மீட்பு மையம்",
  "Recovery scam warning": "மீட்பு மோசடி எச்சரிக்கை",
  "A filed report can attract a second scam.": "பதிவு செய்யப்பட்ட புகார் இரண்டாவது மோசடியை ஈர்க்கலாம்.",
  "No police officer, CBI official, bank representative, or I4C representative should ask for money to release your funds.": "உங்கள் பணத்தை விடுவிக்க எந்த காவலர், CBI அதிகாரி, வங்கி பிரதிநிதி அல்லது I4C பிரதிநிதியும் பணம் கேட்க மாட்டார்கள்.",
  "Case state": "வழக்கு நிலை",
  "packets prepared": "தொகுப்புகள் தயார்",
  "facts still open": "உண்மைகள் நிலுவையில்",
  "Call 1930 now": "இப்போதே 1930-ஐ அழை",
  "Prepare response packets": "பதில் தொகுப்புகளைத் தயாரி",
  "Financial amount": "நிதி தொகை",
  "Bank or wallet": "வங்கி அல்லது வாலட்",
  "Incident description": "சம்பவ விவரம்",
  "Freeze through your bank": "உங்கள் வங்கி மூலம் முடக்கவும்",
  "Preserve evidence before deleting anything.": "எதையும் நீக்கும் முன் ஆதாரத்தைப் பாதுகாக்கவும்.",
  "New incident": "புதிய சம்பவம்",
};

const TELUGU: Record<string, string> = {
  "Back to response desk": "ప్రతిస్పందన డెస్క్‌కు తిరిగి",
  "Back to action board": "యాక్షన్ బోర్డ్‌కు తిరిగి",
  "Back to recovery cockpit": "రికవరీ కాక్‌పిట్‌కు తిరిగి",
  "Triage": "ప్రాథమిక విభజన",
  "Tell the story": "సంఘటనను చెప్పండి",
  "Confirm facts": "వాస్తవాలను నిర్ధారించండి",
  "Act and track": "చర్య మరియు ట్రాకింగ్",
  "Step 01 / incident intake": "దశ 01 / సంఘటన ఇన్‌టేక్",
  "Show us what happened.": "ఏమి జరిగిందో చెప్పండి.",
  "We will identify the script, explain what may happen next, and prepare the safest response path.": "మేము మోసపు పద్ధతిని గుర్తించి, తర్వాత ఏమి జరగొచ్చో వివరించి, సురక్షితమైన ప్రతిస్పందన మార్గాన్ని సిద్ధం చేస్తాము.",
  "If money is leaving now, call 1930 before you finish this form.": "ఇప్పుడు డబ్బు వెళ్తుంటే, ఈ ఫారం పూర్తి చేయకముందే 1930కి కాల్ చేయండి.",
  "Start with the incident record. We will keep the recovery actions in view.": "సంఘటన రికార్డుతో ప్రారంభించండి. రికవరీ చర్యలను మేము ముందుంచుతాము.",
  "This environment does not transmit reports to authorities.": "ఈ వాతావరణం అధికారులకు నివేదికలను పంపదు.",
  "Message": "మెసేజ్",
  "Voice": "వాయిస్",
  "Screenshot": "స్క్రీన్‌షాట్",
  "Number or link": "నంబర్ లేదా లింక్",
  "Private image hash": "ప్రైవేట్ ఇమేజ్ ఫింగర్‌ప్రింట్",
  "Paste the message or conversation": "మెసేజ్ లేదా సంభాషణను పేస్ట్ చేయండి",
  "Tell the story in your own words": "మీ స్వంత మాటల్లో సంఘటనను చెప్పండి",
  "Voice language": "వాయిస్ భాష",
  "Start recording": "రికార్డింగ్ ప్రారంభించండి",
  "Stop recording": "రికార్డింగ్ ఆపండి",
  "Transcript": "ట్రాన్స్‌క్రిప్ట్",
  "Drop an image here or browse": "ఇక్కడ చిత్రాన్ని వదలండి లేదా బ్రౌజ్ చేయండి",
  "Remove image": "చిత్రాన్ని తొలగించండి",
  "Local fingerprinting": "స్థానిక ఫింగర్‌ప్రింటింగ్",
  "Enter a phone number, UPI ID, or link": "ఫోన్ నంబర్, UPI ID లేదా లింక్ నమోదు చేయండి",
  "Identifiers are analysed as incident evidence. Never enter real account numbers or OTPs.": "గుర్తింపులు సంఘటన సాక్ష్యంగా విశ్లేషించబడతాయి. నిజమైన ఖాతా నంబర్లు లేదా OTPలు ఎప్పుడూ నమోదు చేయకండి.",
  "Analyse this incident": "ఈ సంఘటనను విశ్లేషించండి",
  "Create local fingerprint": "స్థానిక ఫింగర్‌ప్రింట్ సృష్టించండి",
  "Want to see the complete response path?": "పూర్తి ప్రతిస్పందన మార్గాన్ని చూడాలనుకుంటున్నారా?",
  "Open the example task-scam case": "ఉదాహరణ టాస్క్-స్కామ్ కేసును తెరవండి",
  "Money moving now?": "ఇప్పుడు డబ్బు వెళ్తోందా?",
  "Call 1930 immediately. This intake can wait.": "వెంటనే 1930కి కాల్ చేయండి. ఈ ఇన్‌టేక్ వేచి ఉంటుంది.",
  "Call 1930": "1930కి కాల్ చేయండి",
  "Privacy boundary": "గోప్యతా సరిహద్దు",
  "Text is redacted before model analysis. Uploaded screenshots are temporary analysis inputs. Private-image fingerprints stay local.": "మోడల్ విశ్లేషణకు ముందు టెక్స్ట్ సవరించబడుతుంది. అప్‌లోడ్ చేసిన స్క్రీన్‌షాట్‌లు తాత్కాలిక విశ్లేషణ ఇన్‌పుట్‌లు. ప్రైవేట్ చిత్రాల ఫింగర్‌ప్రింట్లు పరికరంలోనే ఉంటాయి.",
  "English, Hindi, and Hinglish input are accepted. Avoid entering real personal information in this environment.": "తెలుగుతో సహా అనేక భాషల ఇన్‌పుట్ అంగీకరించబడుతుంది. ఈ వాతావరణంలో నిజమైన వ్యక్తిగత సమాచారం నమోదు చేయవద్దు.",
  "Case tracking": "కేసు ట్రాకింగ్",
  "Find your recovery plan.": "మీ రికవరీ ప్రణాళికను కనుగొనండి.",
  "Enter the acknowledgement number from your case record. An example case is available without an account.": "మీ కేసు రికార్డులోని రసీదు నంబరును నమోదు చేయండి. ఖాతా లేకుండా ఒక ఉదాహరణ కేసు అందుబాటులో ఉంది.",
  "Acknowledgement number": "రసీదు నంబరు",
  "Open case": "కేసు తెరవండి",
  "Open an example case": "ఉదాహరణ కేసు తెరవండి",
  "Threat bulletin / pattern corpus": "ముప్పు బులెటిన్ / పద్ధతుల సంగ్రహం",
  "Active scam scripts in the atlas.": "అట్లాస్‌లో క్రియాశీల స్కామ్ పద్ధతులు.",
  "High risk": "అధిక ప్రమాదం",
  "Read playbook": "పద్ధతిని చదవండి",
  "This is what the evidence suggests.": "సాక్ష్యం ఇదే సూచిస్తుంది.",
  "Confirm extracted facts": "సేకరించిన వాస్తవాలను నిర్ధారించండి",
  "Act in the right order.": "సరైన క్రమంలో చర్య తీసుకోండి.",
  "Review the incident before routing.": "రూటింగ్ ముందు సంఘటనను సమీక్షించండి.",
  "Advisory result": "సలహా ఫలితం",
  "Recovery cockpit": "రికవరీ కాక్‌పిట్",
  "Recovery scam warning": "రికవరీ స్కామ్ హెచ్చరిక",
  "A filed report can attract a second scam.": "నమోదైన ఫిర్యాదు రెండో స్కామ్‌ను ఆకర్షించవచ్చు.",
  "No police officer, CBI official, bank representative, or I4C representative should ask for money to release your funds.": "మీ నిధులను విడుదల చేయడానికి ఎటువంటి పోలీసు అధికారి, CBI అధికారి, బ్యాంకు ప్రతినిధి లేదా I4C ప్రతినిధి డబ్బు అడగరాదు.",
  "Case state": "కేసు స్థితి",
  "packets prepared": "ప్యాకెట్లు సిద్ధం",
  "facts still open": "వాస్తవాలు ఇంకా బాకీ",
  "Call 1930 now": "ఇప్పుడే 1930కి కాల్ చేయండి",
  "Prepare response packets": "ప్రతిస్పందన ప్యాకెట్లను సిద్ధం చేయండి",
  "Financial amount": "ఆర్థిక మొత్తం",
  "Bank or wallet": "బ్యాంకు లేదా వాలెట్",
  "Incident description": "సంఘటన వివరణ",
  "Freeze through your bank": "మీ బ్యాంకు ద్వారా ఫ్రీజ్ చేయించండి",
  "Preserve evidence before deleting anything.": "ఏదైనా తొలగించే ముందు సాక్ష్యాన్ని భద్రపరచండి.",
  "New incident": "కొత్త సంఘటన",
};

const BENGALI: Record<string, string> = {
  "Back to response desk": "প্রতিক্রিয়া ডেস্কে ফিরুন",
  "Back to action board": "অ্যাকশন বোর্ডে ফিরুন",
  "Back to recovery cockpit": "পুনরুদ্ধার ককপিটে ফিরুন",
  "Triage": "প্রাথমিক বাছাই",
  "Tell the story": "ঘটনাটি বলুন",
  "Confirm facts": "তথ্য নিশ্চিত করুন",
  "Act and track": "কাজ করুন ও ট্র্যাক করুন",
  "Step 01 / incident intake": "ধাপ 01 / ঘটনা গ্রহণ",
  "Show us what happened.": "কী ঘটেছে তা জানান।",
  "We will identify the script, explain what may happen next, and prepare the safest response path.": "আমরা প্রতারণার কায়দা চিহ্নিত করব, পরে কী হতে পারে তা ব্যাখ্যা করব এবং সবচেয়ে নিরাপদ প্রতিক্রিয়ার পথ প্রস্তুত করব।",
  "If money is leaving now, call 1930 before you finish this form.": "এখনই টাকা চলে গেলে, এই ফর্ম শেষ করার আগে 1930-এ কল করুন।",
  "Start with the incident record. We will keep the recovery actions in view.": "ঘটনার রেকর্ড দিয়ে শুরু করুন। পুনরুদ্ধারের পদক্ষেপগুলি আমরা সামনে রাখব।",
  "This environment does not transmit reports to authorities.": "এই পরিবেশ কর্তৃপক্ষের কাছে কোনো রিপোর্ট পাঠায় না।",
  "Message": "বার্তা",
  "Voice": "ভয়েস",
  "Screenshot": "স্ক্রিনশট",
  "Number or link": "নম্বর বা লিংক",
  "Private image hash": "ব্যক্তিগত ছবির ফিঙ্গারপ্রিন্ট",
  "Paste the message or conversation": "বার্তা বা কথোপকথন পেস্ট করুন",
  "Tell the story in your own words": "নিজের ভাষায় ঘটনাটি বলুন",
  "Voice language": "ভয়েসের ভাষা",
  "Start recording": "রেকর্ডিং শুরু করুন",
  "Stop recording": "রেকর্ডিং বন্ধ করুন",
  "Transcript": "ট্রান্সক্রিপ্ট",
  "Drop an image here or browse": "এখানে ছবি ছাড়ুন বা ব্রাউজ করুন",
  "Remove image": "ছবি সরান",
  "Local fingerprinting": "স্থানীয় ফিঙ্গারপ্রিন্টিং",
  "Enter a phone number, UPI ID, or link": "ফোন নম্বর, UPI ID বা লিংক দিন",
  "Identifiers are analysed as incident evidence. Never enter real account numbers or OTPs.": "পরিচয়কারীগুলি ঘটনার প্রমাণ হিসেবে বিশ্লেষণ করা হয়। আসল অ্যাকাউন্ট নম্বর বা OTP কখনো দেবেন না।",
  "Analyse this incident": "এই ঘটনাটি বিশ্লেষণ করুন",
  "Create local fingerprint": "স্থানীয় ফিঙ্গারপ্রিন্ট তৈরি করুন",
  "Want to see the complete response path?": "সম্পূর্ণ প্রতিক্রিয়ার পথ দেখতে চান?",
  "Open the example task-scam case": "উদাহরণ টাস্ক-স্ক্যাম কেস খুলুন",
  "Money moving now?": "এখনই টাকা চলে যাচ্ছে?",
  "Call 1930 immediately. This intake can wait.": "এখনই 1930-এ কল করুন। এই ফর্ম পরেও করা যাবে।",
  "Call 1930": "1930-এ কল করুন",
  "Privacy boundary": "গোপনীয়তার সীমা",
  "Text is redacted before model analysis. Uploaded screenshots are temporary analysis inputs. Private-image fingerprints stay local.": "মডেল বিশ্লেষণের আগে টেক্সট সম্পাদনা করা হয়। আপলোড করা স্ক্রিনশট সাময়িক বিশ্লেষণ ইনপুট। ব্যক্তিগত ছবির ফিঙ্গারপ্রিন্ট ডিভাইসেই থাকে।",
  "English, Hindi, and Hinglish input are accepted. Avoid entering real personal information in this environment.": "বাংলাসহ একাধিক ভাষার ইনপুট গৃহীত হয়। এই পরিবেশে আসল ব্যক্তিগত তথ্য দেবেন না।",
  "Case tracking": "কেস ট্র্যাকিং",
  "Find your recovery plan.": "আপনার পুনরুদ্ধার পরিকল্পনা খুঁজুন।",
  "Enter the acknowledgement number from your case record. An example case is available without an account.": "আপনার কেস রেকর্ডের স্বীকৃতি নম্বরটি দিন। অ্যাকাউন্ট ছাড়াই একটি উদাহরণ কেস উপলব্ধ।",
  "Acknowledgement number": "স্বীকৃতি নম্বর",
  "Open case": "কেস খুলুন",
  "Open an example case": "উদাহরণ কেস খুলুন",
  "Threat bulletin / pattern corpus": "হুমকি বুলেটিন / প্যাটার্ন সংগ্রহ",
  "Active scam scripts in the atlas.": "অ্যাটলাসে সক্রিয় প্রতারণার কায়দা।",
  "High risk": "উচ্চ ঝুঁকি",
  "Read playbook": "কায়দা পড়ুন",
  "This is what the evidence suggests.": "প্রমাণ এটাই ইঙ্গিত করে।",
  "Confirm extracted facts": "সংগৃহীত তথ্য নিশ্চিত করুন",
  "Act in the right order.": "সঠিক ক্রমে কাজ করুন।",
  "Review the incident before routing.": "রাউটিংয়ের আগে ঘটনাটি পর্যালোচনা করুন।",
  "Advisory result": "পরামর্শমূলক ফলাফল",
  "Recovery cockpit": "পুনরুদ্ধার ককপিট",
  "Recovery scam warning": "পুনরুদ্ধার প্রতারণা সতর্কতা",
  "A filed report can attract a second scam.": "দায়ের করা অভিযোগ দ্বিতীয় প্রতারণা আকর্ষণ করতে পারে।",
  "No police officer, CBI official, bank representative, or I4C representative should ask for money to release your funds.": "আপনার টাকা মুক্ত করতে কোনো পুলিশ কর্মকর্তা, CBI কর্মকর্তা, ব্যাংক প্রতিনিধি বা I4C প্রতিনিধি টাকা চাইবে না।",
  "Case state": "কেসের অবস্থা",
  "packets prepared": "প্যাকেট প্রস্তুত",
  "facts still open": "তথ্য এখনো বাকি",
  "Call 1930 now": "এখনই 1930-এ কল করুন",
  "Prepare response packets": "প্রতিক্রিয়া প্যাকেট প্রস্তুত করুন",
  "Financial amount": "আর্থিক পরিমাণ",
  "Bank or wallet": "ব্যাংক বা ওয়ালেট",
  "Incident description": "ঘটনার বিবরণ",
  "Freeze through your bank": "আপনার ব্যাংকের মাধ্যমে ফ্রিজ করুন",
  "Preserve evidence before deleting anything.": "কিছু মুছে ফেলার আগে প্রমাণ সংরক্ষণ করুন।",
  "New incident": "নতুন ঘটনা",
};

const MARATHI: Record<string, string> = {
  "Back to response desk": "प्रतिसाद डेस्कवर परत",
  "Back to action board": "कृती फलकावर परत",
  "Back to recovery cockpit": "पुनर्प्राप्ती केंद्रावर परत",
  "Triage": "प्राथमिक वर्गीकरण",
  "Tell the story": "घटना सांगा",
  "Confirm facts": "तथ्यांची पुष्टी करा",
  "Act and track": "कृती करा व ट्रॅक करा",
  "Step 01 / incident intake": "पायरी 01 / घटना नोंद",
  "Show us what happened.": "काय घडले ते सांगा.",
  "We will identify the script, explain what may happen next, and prepare the safest response path.": "आम्ही फसवणुकीची पद्धत ओळखू, पुढे काय घडू शकते ते सांगू आणि सर्वात सुरक्षित प्रतिसाद मार्ग तयार करू.",
  "If money is leaving now, call 1930 before you finish this form.": "आत्ता पैसे जात असतील तर हा फॉर्म पूर्ण करण्याआधी 1930 वर कॉल करा.",
  "Start with the incident record. We will keep the recovery actions in view.": "घटना नोंदीने सुरुवात करा. पुनर्प्राप्ती कृती आम्ही समोर ठेवू.",
  "This environment does not transmit reports to authorities.": "हे वातावरण अधिकाऱ्यांना तक्रारी पाठवत नाही.",
  "Message": "संदेश",
  "Voice": "आवाज",
  "Screenshot": "स्क्रीनशॉट",
  "Number or link": "नंबर किंवा लिंक",
  "Private image hash": "खाजगी प्रतिमा फिंगरप्रिंट",
  "Paste the message or conversation": "संदेश किंवा संवाद पेस्ट करा",
  "Tell the story in your own words": "तुमच्या शब्दांत घटना सांगा",
  "Voice language": "आवाजाची भाषा",
  "Start recording": "रेकॉर्डिंग सुरू करा",
  "Stop recording": "रेकॉर्डिंग थांबवा",
  "Transcript": "लिप्यंतरण",
  "Drop an image here or browse": "येथे प्रतिमा टाका किंवा ब्राउझ करा",
  "Remove image": "प्रतिमा काढा",
  "Local fingerprinting": "स्थानिक फिंगरप्रिंटिंग",
  "Enter a phone number, UPI ID, or link": "फोन नंबर, UPI ID किंवा लिंक टाका",
  "Identifiers are analysed as incident evidence. Never enter real account numbers or OTPs.": "ओळखपत्रांचे घटना पुरावा म्हणून विश्लेषण होते. खरे खाते क्रमांक किंवा OTP कधीही टाकू नका.",
  "Analyse this incident": "या घटनेचे विश्लेषण करा",
  "Create local fingerprint": "स्थानिक फिंगरप्रिंट तयार करा",
  "Want to see the complete response path?": "संपूर्ण प्रतिसाद मार्ग पाहायचा आहे का?",
  "Open the example task-scam case": "उदाहरण टास्क-स्कॅम केस उघडा",
  "Money moving now?": "आत्ता पैसे जात आहेत का?",
  "Call 1930 immediately. This intake can wait.": "लगेच 1930 वर कॉल करा. ही नोंद थांबू शकते.",
  "Call 1930": "1930 वर कॉल करा",
  "Privacy boundary": "गोपनीयता सीमा",
  "Text is redacted before model analysis. Uploaded screenshots are temporary analysis inputs. Private-image fingerprints stay local.": "मॉडेल विश्लेषणापूर्वी मजकूर संपादित केला जातो. अपलोड केलेले स्क्रीनशॉट तात्पुरते विश्लेषण इनपुट आहेत. खाजगी प्रतिमा फिंगरप्रिंट डिव्हाइसवरच राहतात.",
  "English, Hindi, and Hinglish input are accepted. Avoid entering real personal information in this environment.": "मराठीसह अनेक भाषांचे इनपुट स्वीकारले जाते. या वातावरणात खरी वैयक्तिक माहिती टाकू नका.",
  "Case tracking": "केस ट्रॅकिंग",
  "Find your recovery plan.": "तुमची पुनर्प्राप्ती योजना शोधा.",
  "Enter the acknowledgement number from your case record. An example case is available without an account.": "तुमच्या केस नोंदीतील पावती क्रमांक टाका. खाते नसतानाही एक उदाहरण केस उपलब्ध आहे.",
  "Acknowledgement number": "पावती क्रमांक",
  "Open case": "केस उघडा",
  "Open an example case": "उदाहरण केस उघडा",
  "Threat bulletin / pattern corpus": "धोका बुलेटिन / पद्धत संग्रह",
  "Active scam scripts in the atlas.": "अटलासमधील सक्रिय फसवणूक पद्धती.",
  "High risk": "उच्च धोका",
  "Read playbook": "पद्धत वाचा",
  "This is what the evidence suggests.": "पुरावा हेच सूचित करतो.",
  "Confirm extracted facts": "मिळालेल्या तथ्यांची पुष्टी करा",
  "Act in the right order.": "योग्य क्रमाने कृती करा.",
  "Review the incident before routing.": "रूटिंगपूर्वी घटनेचे पुनरावलोकन करा.",
  "Advisory result": "सल्लागार निकाल",
  "Recovery cockpit": "पुनर्प्राप्ती केंद्र",
  "Recovery scam warning": "पुनर्प्राप्ती फसवणूक इशारा",
  "A filed report can attract a second scam.": "नोंदवलेली तक्रार दुसरी फसवणूक आकर्षित करू शकते.",
  "No police officer, CBI official, bank representative, or I4C representative should ask for money to release your funds.": "तुमचे पैसे सोडण्यासाठी कोणताही पोलीस अधिकारी, CBI अधिकारी, बँक प्रतिनिधी किंवा I4C प्रतिनिधी पैसे मागत नाही.",
  "Case state": "केस स्थिती",
  "packets prepared": "पॅकेट्स तयार",
  "facts still open": "तथ्ये अजून बाकी",
  "Call 1930 now": "आत्ताच 1930 वर कॉल करा",
  "Prepare response packets": "प्रतिसाद पॅकेट्स तयार करा",
  "Financial amount": "आर्थिक रक्कम",
  "Bank or wallet": "बँक किंवा वॉलेट",
  "Incident description": "घटनेचे वर्णन",
  "Freeze through your bank": "तुमच्या बँकेद्वारे फ्रीझ करा",
  "Preserve evidence before deleting anything.": "काहीही हटवण्यापूर्वी पुरावे जतन करा.",
  "New incident": "नवीन घटना",
};

const DICTIONARIES: Record<Exclude<RakshaLanguage, "en">, Record<string, string>> = {
  hi: HINDI,
  ta: TAMIL,
  te: TELUGU,
  bn: BENGALI,
  mr: MARATHI,
};

const originals = new WeakMap<Text, string>();

function translateText(node: Text, dictionary: Record<string, string> | null) {
  const original = originals.get(node) ?? node.data;
  if (!originals.has(node)) originals.set(node, original);
  const leading = original.match(/^\s*/)?.[0] ?? "";
  const trailing = original.match(/\s*$/)?.[0] ?? "";
  const core = original.trim();
  const translated = dictionary?.[core];
  const next = dictionary && translated ? `${leading}${translated}${trailing}` : original;
  if (node.data !== next) node.data = next;
}

function translateTree(root: Node, dictionary: Record<string, string> | null) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = node.parentElement;
      if (!parent || ["SCRIPT", "STYLE", "TEXTAREA", "OPTION", "CODE", "PRE"].includes(parent.tagName)) return NodeFilter.FILTER_REJECT;
      // Never touch subtrees that React translates itself via dictionaries.
      // Writing into React-owned nodes corrupts hydration state and freezes
      // the interface in the wrong language.
      if (parent.closest("[data-raksha-i18n='react']")) return NodeFilter.FILTER_REJECT;
      return (node as Text).data.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
    },
  });
  const nodes: Text[] = [];
  while (walker.nextNode()) nodes.push(walker.currentNode as Text);
  nodes.forEach((node) => translateText(node, dictionary));
}

export default function SiteLanguageLayer() {
  const { language } = useRakshaLanguage();

  useEffect(() => {
    const dictionary = language === "en" ? null : DICTIONARIES[language as Exclude<RakshaLanguage, "en">];
    let scheduled = false;

    const apply = () => {
      scheduled = false;
      observer.disconnect();
      translateTree(document.body, dictionary);
      observer.observe(document.body, { childList: true, subtree: true, characterData: true });
    };

    const schedule = () => {
      if (scheduled) return;
      scheduled = true;
      window.setTimeout(apply, 120);
    };

    // Re-apply after React re-renders and client-side navigations restore
    // English text nodes, so the chosen language persists across the site.
    const observer = new MutationObserver(schedule);
    const firstPass = window.setTimeout(apply, 700);
    window.addEventListener("popstate", schedule);
    window.addEventListener("raksha:routechange", schedule);

    return () => {
      observer.disconnect();
      window.clearTimeout(firstPass);
      window.removeEventListener("popstate", schedule);
      window.removeEventListener("raksha:routechange", schedule);
    };
  }, [language]);

  return null;
}
