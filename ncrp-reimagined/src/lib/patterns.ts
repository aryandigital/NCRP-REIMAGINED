// 15 canonical scam behavioral patterns with stage graphs and keyword signals.
// Used by the in-memory cosine/keyword matcher in scam-dna.ts.
// These are behavioral scripts — identifiers rotate; the script does not.

export type RiskLevel = 'HIGH' | 'MEDIUM' | 'UNCLEAR';

export interface ScamStage {
  id: string;
  name: string;
  description: string;
  signals: string[];
  nextMove: string;
}

export interface ScamPattern {
  slug: string;
  name: string;
  primaryTrigger: string;
  tracks: string[];
  baseRisk: RiskLevel;
  stages: ScamStage[];
  keywordSignals: string[];
  doNot: string[];
  safeVerification: string;
}

export const PATTERNS: ScamPattern[] = [
  {
    slug: 'part-time-task-scam',
    name: 'Part-Time Task / Merchant Prepaid Scam',
    primaryTrigger: 'Telegram/WhatsApp job offer',
    tracks: ['money'],
    baseRisk: 'HIGH',
    stages: [
      {
        id: 'UNSOLICITED_OFFER',
        name: 'Unsolicited Job Offer',
        description: 'Stranger contacts victim with a work-from-home job offer via WhatsApp/Telegram.',
        signals: ['work from home', 'part time job', 'daily payment', 'youtube like', 'task work', 'online earning'],
        nextMove: 'They will ask you to complete 3–5 simple micro-tasks (liking videos) to "prove yourself" before the real money starts.',
      },
      {
        id: 'MICRO_TASKS_PAID',
        name: 'Micro-Tasks With Real Payout',
        description: 'Victim receives small genuine payments (₹100–₹500) to build trust.',
        signals: ['completed task', 'payment received', 'task done', 'upi credited', 'trust building'],
        nextMove: 'They will invite you to a "VIP Telegram group" for higher-paying merchant tasks requiring a deposit.',
      },
      {
        id: 'MERCHANT_PREPAID',
        name: 'Merchant Task Prepaid Deposit',
        description: 'Victim is asked to deposit money (₹1,000–₹50,000) to "activate merchant tasks" with promised higher returns.',
        signals: ['merchant task', 'deposit', 'activate account', 'prepaid', 'investment task', 'order task', 'vip group'],
        nextMove: 'The fake dashboard will show a large "pending balance" (₹50,000–₹2,00,000) that you cannot withdraw.',
      },
      {
        id: 'DASHBOARD_INFLATION',
        name: 'Fake Dashboard Balance Inflation',
        description: 'Dashboard shows large fake earnings to encourage more deposits.',
        signals: ['pending balance', 'frozen account', 'dashboard shows', 'commission pending', 'balance locked'],
        nextMove: 'They will claim your account is frozen due to "credit score" or "tax irregularity" and demand a fee to unlock withdrawals.',
      },
      {
        id: 'WITHDRAWAL_BLOCKED',
        name: 'Withdrawal Blocked / Unlocking Fee',
        description: 'Victim is told their withdrawal is blocked and must pay GST/tax/VIP fee to release funds.',
        signals: ['gst required', 'tax deposit', 'unlock fee', 'release funds', 'vip upgrade', 'security deposit', 'withdrawal blocked', '30% tax'],
        nextMove: 'After each payment they will invent a new fee. There is no final withdrawal step — the money is gone.',
      },
    ],
    keywordSignals: ['like task', 'merchant task', 'daily commission', 'deposit to earn', 'task completed', 'vip group', 'unlock withdrawal', 'prepaid task', 'work from home earning'],
    doNot: [
      'Do NOT pay any GST, tax, or unlocking fee — there is no final withdrawal step.',
      'Do NOT delete the Telegram/WhatsApp chat history — it is essential police evidence.',
      'Do NOT share OTPs or bank login credentials with any "supervisor".',
    ],
    safeVerification: 'No legitimate employer asks you to prepay before receiving your salary. Check official job boards (Naukri, LinkedIn) for the company name.',
  },
  {
    slug: 'digital-arrest',
    name: 'Digital Arrest / CBI-Police Impersonation',
    primaryTrigger: 'Fake CBI/Police video call',
    tracks: ['money', 'safety'],
    baseRisk: 'HIGH',
    stages: [
      {
        id: 'INTIMIDATION_CALL',
        name: 'Intimidation Call',
        description: 'Automated IVR or person claims victim\'s Aadhaar is linked to 16 SIMs or money laundering.',
        signals: ['aadhaar linked', 'money laundering', 'narcotics', 'cbi', 'cybercrime branch', 'fir registered', 'your number is being used', 'sim registered'],
        nextMove: 'They will demand a video call immediately and instruct you to stay on camera for your "digital custody hearing".',
      },
      {
        id: 'VIDEO_ISOLATION',
        name: 'Video Call Isolation (Digital Custody)',
        description: 'Fake officer in uniform on Skype/WhatsApp demands continuous video presence and prohibits speaking to family.',
        signals: ['skype call', 'do not tell family', 'digital custody', 'stay on camera', 'video hearing', 'do not disconnect'],
        nextMove: 'They will send a fake Supreme Court warrant or CBI letter via WhatsApp to increase panic.',
      },
      {
        id: 'FAKE_WARRANT',
        name: 'Fake Warrant / Document',
        description: 'Forged government documents (SC order, CBI FIR) are shared to create legal-sounding pressure.',
        signals: ['supreme court order', 'warrant issued', 'cbdt notice', 'official document', 'your name in fir'],
        nextMove: 'They will demand you transfer all savings to a "RBI Reserve Verification Account" for clearance.',
      },
      {
        id: 'FUND_VERIFICATION',
        name: 'Fund Verification Transfer',
        description: 'Victim is instructed to transfer all savings to a government-sounding account for "verification".',
        signals: ['rbi verification account', 'transfer for clearance', 'funds will return in 15 minutes', 'verification transfer', 'government safe account'],
        nextMove: 'After transfer, they will disconnect the call and become unreachable.',
      },
    ],
    keywordSignals: ['digital arrest', 'cbi officer', 'cybercrime notice', 'aadhaar misused', 'money laundering case', 'stay on video', 'rbi verification'],
    doNot: [
      'Do NOT transfer any money — no real government agency asks for fund transfers to "verify" accounts.',
      'Do NOT stay isolated on the call — real police never conduct "digital custody" over video.',
      'Do NOT share your bank OTP, net banking credentials, or Aadhaar number.',
      'HANG UP and call the national cybercrime helpline 1930 immediately.',
    ],
    safeVerification: 'Call the police station directly using a phone number from the official government website (not the one given by the caller). CBI never conducts digital custody hearings.',
  },
  {
    slug: 'sextortion-blackmail',
    name: 'Sextortion / Video Call Blackmail',
    primaryTrigger: 'WhatsApp video call trap',
    tracks: ['content', 'safety', 'money'],
    baseRisk: 'HIGH',
    stages: [
      {
        id: 'CONTACT_LURE',
        name: 'Friendly Contact',
        description: 'Attractive stranger initiates casual friendly conversation on Instagram/WhatsApp.',
        signals: ['new friend request', 'unknown caller', 'attractive stranger', 'video chat invite'],
        nextMove: 'They will initiate a video call and stream an explicit prerecorded video while recording your face.',
      },
      {
        id: 'SCREEN_CAPTURE',
        name: 'Recording Trap',
        description: 'Scammer records victim\'s face during explicit video, claims to have compromising footage.',
        signals: ['nude call', 'they recorded me', 'screen recording', 'video call recorded'],
        nextMove: 'They will immediately send you a screenshot of the recording and a list of your social media followers, threatening to send it to all contacts.',
      },
      {
        id: 'EXTORTION_DEMAND',
        name: 'Extortion Demand',
        description: 'Scammer threatens to go viral unless victim pays immediately.',
        signals: ['send to contacts', 'your video will go viral', 'pay now', 'upi payment or else', 'will send to family'],
        nextMove: 'If you pay ₹5,000, they will immediately demand ₹20,000 for "deleting the YouTube server backup". Payment never ends.',
      },
      {
        id: 'ESCALATION',
        name: 'Payment Escalation',
        description: 'Each payment is followed by a larger demand. The threats never stop.',
        signals: ['need more money', 'server backup', 'youtube storage', 'final payment i promise', 'delete all copies'],
        nextMove: 'They will continue escalating demands indefinitely. The only exit is to stop paying and report.',
      },
    ],
    keywordSignals: ['video call recorded', 'nude video', 'threatening to share', 'pay or else', 'send to contacts', 'sextortion', 'morphed video'],
    doNot: [
      'Do NOT pay — payment proves you are vulnerable and will trigger larger demands.',
      'Do NOT delete the chats — preserve all evidence for the police complaint.',
      'Do NOT engage further or try to negotiate.',
      'Call Tele-MANAS 14416 for immediate crisis support.',
    ],
    safeVerification: 'Block the contact on all platforms and report directly to the platform\'s Resident Grievance Officer. File at 1930 or cybercrime.gov.in.',
  },
  {
    slug: 'electricity-disconnection',
    name: 'Electricity Bill Disconnection Scam',
    primaryTrigger: 'Urgent SMS power cut alert',
    tracks: ['money', 'access'],
    baseRisk: 'HIGH',
    stages: [
      {
        id: 'URGENT_SMS',
        name: 'Urgent Disconnection SMS',
        description: 'SMS or WhatsApp claims electricity will be cut off within hours due to unpaid bill.',
        signals: ['electricity bill pending', 'connection will be disconnected', 'contact customer care', 'urgent bill payment', 'power cut tonight'],
        nextMove: 'They will provide a phone number to call immediately to "resolve" the issue.',
      },
      {
        id: 'PHONE_SUPPORT',
        name: 'Fake Helpline Call',
        description: 'Victim calls the number and is asked to install AnyDesk/QuickSupport for remote bill payment.',
        signals: ['install anydesk', 'install quicksupport', 'remote access', 'share screen', 'we will process your payment'],
        nextMove: 'After remote access is granted, they will steal net banking credentials and drain the account.',
      },
      {
        id: 'BANK_DRAIN',
        name: 'Bank Account Drain',
        description: 'Scammer transfers money out of victim\'s net banking after gaining remote access.',
        signals: ['money transferred', 'otp came', 'account drained', 'unauthorized transaction'],
        nextMove: 'They will disconnect immediately after draining the account.',
      },
    ],
    keywordSignals: ['electricity disconnection', 'power cut sms', 'msedcl', 'bses', 'tata power', 'unpaid electricity bill', 'anydesk electricity'],
    doNot: [
      'Do NOT install any remote access app (AnyDesk, TeamViewer, QuickSupport) on behalf of a utility company.',
      'Do NOT share OTPs received on your phone with any caller.',
    ],
    safeVerification: 'Visit your electricity provider\'s official website or app directly. All genuine disconnection notices reference your consumer number.',
  },
  {
    slug: 'fake-loan-app',
    name: 'Instant Loan App Extortion',
    primaryTrigger: 'Malicious APK / contact sync',
    tracks: ['access', 'safety', 'money'],
    baseRisk: 'HIGH',
    stages: [
      {
        id: 'APK_INSTALL',
        name: 'APK Installation',
        description: 'Victim installs unofficial loan app from WhatsApp/Telegram link with excessive permissions.',
        signals: ['loan app', 'instant loan', 'no documents', 'aadhar loan', 'contact access granted', 'photo access'],
        nextMove: 'The app uploads your entire contact list, photos, and Aadhaar photo to their server.',
      },
      {
        id: 'CONTACT_EXFILTRATION',
        name: 'Contact & Data Harvest',
        description: 'App uploads contacts and private photos.',
        signals: ['app has my contacts', 'photos uploaded', 'data accessed'],
        nextMove: 'They will call you demanding rapid repayment at 500%+ interest; threatening to send morphed nude images to your contacts.',
      },
      {
        id: 'HARASSMENT',
        name: 'Harassment & Morphed Image Threats',
        description: 'Recovery agents call contacts, share morphed images to shame the victim.',
        signals: ['calling family', 'morphed photo sent', 'relatives contacted', 'shame message', 'nude image to contacts'],
        nextMove: 'Harassment escalates until victim pays or is psychologically broken. Immediate uninstall and police complaint is the only exit.',
      },
      {
        id: 'EXTORTION_LOOP',
        name: 'Extortion Loop',
        description: 'Even after repayment, demands continue.',
        signals: ['paid but still demanding', 'loan not cleared', 'additional charges', 'interest keeps growing'],
        nextMove: "File police complaint and contact RBI's sachet.rbi.org.in for illegal lending app reporting.",
      },
    ],
    keywordSignals: ['instant loan apk', 'loan app harassment', 'contacts threatened', 'morphed photo threat', 'illegal loan recovery', 'recovery agents calling'],
    doNot: [
      'Do NOT install APK loan apps from WhatsApp or Telegram links.',
      'Do NOT pay further — it will not stop the harassment.',
      'Immediately uninstall the app and revoke all permissions.',
    ],
    safeVerification: 'All legitimate lending apps are registered on the RBI NBFC list at rbi.org.in. Report illegal apps at sachet.rbi.org.in.',
  },
  {
    slug: 'fake-courier',
    name: 'Fake Courier / Illegal Parcel Scam',
    primaryTrigger: 'Fake FedEx / Customs alert',
    tracks: ['money', 'identity'],
    baseRisk: 'HIGH',
    stages: [
      {
        id: 'CUSTOMS_CALL',
        name: 'Customs / FedEx Alert',
        description: 'Call or SMS claims a parcel addressed to the victim contains drugs/contraband.',
        signals: ['fedex parcel', 'customs department', 'illegal parcel', 'drugs found', 'your package has drugs', 'dhl shipment seized'],
        nextMove: 'They will connect you to a fake police/CBI officer who will demand document verification.',
      },
      {
        id: 'IDENTITY_VERIFY',
        name: 'Identity Verification Demand',
        description: 'Fake officer asks for Aadhaar, PAN, and bank details to "clear your name".',
        signals: ['send aadhaar', 'pan verification', 'bank details for clearance', 'clear your name', 'verify identity'],
        nextMove: 'They will use your credentials for identity fraud and demand a "clearance fee" to stop the FIR.',
      },
      {
        id: 'CLEARANCE_FEE',
        name: 'Clearance Fee Demand',
        description: 'Victim is told to pay a fee to have the case closed.',
        signals: ['clearance fee', 'case settlement', 'pay to clear name', 'bribe customs'],
        nextMove: 'After payment, a new fee will be invented. All shared ID documents will be used for identity fraud.',
      },
      {
        id: 'IDENTITY_FRAUD',
        name: 'Identity Fraud Exploitation',
        description: 'Stolen Aadhaar/PAN used for SIM cloning, fake loans, or mule accounts.',
        signals: ['sim registered without consent', 'loan in my name', 'bank account opened unknowingly'],
        nextMove: 'File police complaint immediately. Lock Aadhaar biometric at uidai.gov.in and check TAFCOP for SIM misuse.',
      },
    ],
    keywordSignals: ['parcel has drugs', 'customs seized package', 'fedex illegal', 'interpol notice', 'parcel arrested', 'dhl drugs'],
    doNot: [
      'Do NOT share your Aadhaar, PAN, or bank details with any caller claiming to be customs/police.',
      'No real customs department calls individuals to demand immediate payment over phone.',
    ],
    safeVerification: 'Contact your courier company directly using the tracking number on the official website. Real customs sends physical notices, not phone calls.',
  },
  {
    slug: 'fake-crypto-trading',
    name: 'Fake Crypto / High-Return Trading Scam',
    primaryTrigger: 'Stock tips group / Fake trading platform',
    tracks: ['money'],
    baseRisk: 'HIGH',
    stages: [
      {
        id: 'TIPS_GROUP',
        name: 'Investment Tips Group',
        description: 'Victim is added to a "VIP investment group" on Telegram with fake testimonials of huge gains.',
        signals: ['stock tips group', 'crypto group', 'vip investment', 'expert advisor', '1000% return', 'trading signal'],
        nextMove: 'A "senior advisor" will approach you privately and offer to manage your investments personally.',
      },
      {
        id: 'SMALL_WIN',
        name: 'Small Genuine Win',
        description: 'First trade shows real profit on fake platform to build confidence.',
        signals: ['first trade profit', 'withdrawal worked', 'small amount withdrawn'],
        nextMove: 'They will push you to invest much larger amounts for the "big opportunity" trade.',
      },
      {
        id: 'LARGE_INVESTMENT',
        name: 'Large Investment / Platform Trap',
        description: 'Victim deposits lakhs into the fake platform.',
        signals: ['transferred large amount', 'crypto platform', 'trading platform deposit', 'forex investment'],
        nextMove: 'The platform will show massive fake profits, then freeze withdrawals claiming "KYC" or "tax clearance" is needed.',
      },
      {
        id: 'WITHDRAWAL_FREEZE',
        name: 'Withdrawal Freeze',
        description: 'Platform freezes the account and demands tax/KYC payment to release funds.',
        signals: ['withdrawal frozen', 'kyc required', 'tax clearance', 'pay to unlock crypto'],
        nextMove: 'Platform will disappear (rug pull) after collecting all fees. The website will go offline.',
      },
      {
        id: 'RUG_PULL',
        name: 'Rug Pull / Exit Scam',
        description: 'Platform and all contacts disappear.',
        signals: ['website down', 'app not working', 'advisor stopped responding', 'group disbanded'],
        nextMove: 'All money is lost. File FIR at 1930 immediately with platform URLs and transaction records.',
      },
    ],
    keywordSignals: ['crypto profit guaranteed', 'trading expert advisor', 'vip stock tips', 'forex investment', 'fake trading platform', 'withdrawal frozen crypto'],
    doNot: [
      'Do NOT pay any "tax clearance" or "KYC fee" to release crypto profits.',
      'Do NOT invest in any platform not registered with SEBI (sebi.gov.in).',
    ],
    safeVerification: 'Check if the broker is SEBI-registered at sebi.gov.in/sebiweb/. Legitimate platforms never ask you to pay taxes before releasing profits.',
  },
  {
    slug: 'bank-kyc-suspension',
    name: 'Bank KYC / PAN Card Suspension Scam',
    primaryTrigger: 'Phishing SMS / Fake bank portal',
    tracks: ['money', 'identity'],
    baseRisk: 'HIGH',
    stages: [
      {
        id: 'KYC_SMS',
        name: 'KYC Urgency Message',
        description: 'SMS or call claims victim\'s bank account/PAN will be suspended for KYC non-completion.',
        signals: ['kyc pending', 'account will be blocked', 'update kyc', 'pan suspended', 'link pan aadhaar or else'],
        nextMove: 'They will send a phishing link to a fake bank portal or ask you to call a number.',
      },
      {
        id: 'PHISHING_PORTAL',
        name: 'Phishing Portal / OTP Theft',
        description: 'Victim enters credentials on a fake bank website; scammer steals OTP in real time.',
        signals: ['clicked bank link', 'entered password', 'otp stolen', 'fake sbi site', 'icici phishing'],
        nextMove: 'They will immediately log into real net banking and initiate fund transfers.',
      },
      {
        id: 'ACCOUNT_DRAIN',
        name: 'Account Drain',
        description: 'Scammer transfers all funds out of victim\'s account.',
        signals: ['unauthorized transfer', 'money gone', 'transaction i didnt do'],
        nextMove: 'Call your bank\'s emergency helpline immediately to freeze the account and file a chargeback.',
      },
    ],
    keywordSignals: ['kyc link sms', 'bank account suspended', 'pan card blocked', 'update kyc whatsapp', 'sbi kyc pending'],
    doNot: [
      'Do NOT click any KYC update links received via SMS or WhatsApp.',
      'Your bank will NEVER ask for OTP, net banking password, or card details over phone/SMS.',
    ],
    safeVerification: 'Log into your bank account directly via the official app or website to check KYC status. Call the bank\'s official helpline (printed on your card).',
  },
  {
    slug: 'remote-access-takeover',
    name: 'Remote Access Takeover Scam',
    primaryTrigger: 'AnyDesk / TeamViewer installation request',
    tracks: ['access', 'money'],
    baseRisk: 'HIGH',
    stages: [
      {
        id: 'SUPPORT_PRETEXT',
        name: 'Tech Support Pretext',
        description: 'Caller impersonates bank/telecom/computer support and claims to fix a critical issue.',
        signals: ['computer virus', 'bank portal error', 'install anydesk', 'install teamviewer', 'remote assistance', 'share your screen'],
        nextMove: 'Once remote access is granted, they will navigate to net banking and initiate transfers.',
      },
      {
        id: 'REMOTE_ACCESS_GRANTED',
        name: 'Remote Access Active',
        description: 'Scammer controls victim\'s screen and captures all banking credentials.',
        signals: ['anydesk code given', 'they can see my screen', 'remote session active'],
        nextMove: 'They will drain the bank account while showing a fake "processing" screen to distract the victim.',
      },
      {
        id: 'ACCOUNT_DRAIN',
        name: 'Account Drained',
        description: 'All funds transferred out while victim watches helplessly.',
        signals: ['money transferred while on call', 'unauthorized transactions during support call'],
        nextMove: 'Immediately force-quit the remote access app, disconnect internet, and call your bank\'s emergency line.',
      },
    ],
    keywordSignals: ['anydesk support', 'teamviewer bank', 'screen sharing support', 'remote help bank', 'computer support install'],
    doNot: [
      'Do NOT install AnyDesk, TeamViewer, or any remote-access tool for an unsolicited caller.',
      'No bank, telecom, or government agency will ever ask for remote access to your device.',
    ],
    safeVerification: 'If you need genuine tech support, visit the official brand service center or use the app\'s built-in support chat.',
  },
  {
    slug: 'romance-matrimonial',
    name: 'Romance / Matrimonial Investment Trap',
    primaryTrigger: 'Shaadi.com / Tinder relationship',
    tracks: ['money', 'identity'],
    baseRisk: 'MEDIUM',
    stages: [
      {
        id: 'PROFILE_CONTACT',
        name: 'Dating/Matrimonial Contact',
        description: 'Attractive, seemingly successful stranger builds relationship over weeks.',
        signals: ['met on shaadi', 'tinder match', 'relationship forming', 'nri contact', 'dubai-based engineer'],
        nextMove: 'After trust is built, they will mention a lucrative investment opportunity they want to share with you.',
      },
      {
        id: 'INVESTMENT_PUSH',
        name: 'Investment Opportunity',
        description: 'Partner introduces a crypto/forex platform with guaranteed returns.',
        signals: ['my uncle\'s platform', 'insider trading tips', 'guaranteed profit', 'send money together we invest'],
        nextMove: 'Small initial profits will encourage larger investments.',
      },
      {
        id: 'LARGE_TRANSFER',
        name: 'Large Money Transfer',
        description: 'Victim sends large sums. Partner claims emergency (medical/legal) requiring money.',
        signals: ['medical emergency abroad', 'stuck at airport', 'customs seized gift', 'need money urgently'],
        nextMove: 'After money is sent, the "partner" disappears and the profile is deleted.',
      },
      {
        id: 'DISAPPEARANCE',
        name: 'Partner Disappears',
        description: 'All contact suddenly ceases after money transfer.',
        signals: ['blocked me', 'account deleted', 'stopped responding', 'profile gone'],
        nextMove: 'File police FIR at 1930 with all chat screenshots and transaction records.',
      },
    ],
    keywordSignals: ['online romance money', 'nri investment trap', 'matrimonial scam', 'online boyfriend investment', 'shaadi investment fraud'],
    doNot: [
      'Do NOT send money to someone you have only met online, regardless of the relationship duration.',
      'Do NOT invest in any platform recommended by an online contact.',
    ],
    safeVerification: 'Reverse image search all profile photos. Request a live unscripted video call on Zoom. Never send money before meeting in person.',
  },
  {
    slug: 'work-from-home-penalty',
    name: 'Work-From-Home Data Entry Penalty Trap',
    primaryTrigger: 'False agreement penalty clause',
    tracks: ['money', 'safety'],
    baseRisk: 'MEDIUM',
    stages: [
      {
        id: 'WFH_OFFER',
        name: 'Data Entry Job Offer',
        description: 'Ad or message promises high-paying data entry / form filling work from home.',
        signals: ['data entry job', 'form filling work', 'home based typing', 'weekly payment guaranteed'],
        nextMove: 'They will ask you to sign a fake "employment agreement" with a penalty clause for early exit.',
      },
      {
        id: 'AGREEMENT_SIGNED',
        name: 'Penalty Agreement Signed',
        description: 'Victim "signs" a fake agreement binding them to pay penalties for non-completion.',
        signals: ['agreement signed', 'penalty clause', 'bond period', 'security deposit'],
        nextMove: 'Work "quality" will be repeatedly rejected to trigger the penalty clause.',
      },
      {
        id: 'PENALTY_DEMAND',
        name: 'Penalty Demand',
        description: 'Victim is told to pay ₹5,000–₹50,000 in penalties or face legal action.',
        signals: ['work rejected', 'quality not met', 'pay penalty', 'legal notice', 'court case threat'],
        nextMove: 'After penalty payment, more penalties will be invented or they will disappear.',
      },
    ],
    keywordSignals: ['data entry penalty', 'typing job penalty', 'work from home agreement', 'form filling security deposit'],
    doNot: [
      'Do NOT sign any "employment agreement" that includes penalty clauses requiring upfront payment.',
      'No legitimate employer charges penalties before you even start earning.',
    ],
    safeVerification: 'Search the company name + "scam" on Google. Check MCA (mca.gov.in) to verify if the company is registered.',
  },
  {
    slug: 'social-media-account-takeover',
    name: 'Social Media Account Takeover',
    primaryTrigger: 'Friend-in-distress message',
    tracks: ['access', 'money'],
    baseRisk: 'MEDIUM',
    stages: [
      {
        id: 'COMPROMISED_CONTACT',
        name: 'Message From Compromised Friend',
        description: 'A known contact\'s account is already hacked; scammer sends an urgent money request.',
        signals: ['friend asking for money', 'stuck abroad', 'urgent money needed', 'medical emergency whatsapp'],
        nextMove: 'They will escalate urgency and ask for a UPI transfer "just this once".',
      },
      {
        id: 'PHISHING_LINK',
        name: 'Phishing Link / OTP Theft',
        description: 'Victim receives a fake platform login link and their own account is stolen.',
        signals: ['instagram login link', 'verify your account', 'enter otp to help', 'facebook login'],
        nextMove: 'With victim\'s account compromised, the cycle repeats targeting the victim\'s contacts.',
      },
      {
        id: 'ACCOUNT_SOLD',
        name: 'Account Sold / Monetized',
        description: 'Hijacked account is used for spam, further scams, or sold on dark web.',
        signals: ['account posting spam', 'friends getting scam messages from my account'],
        nextMove: 'Use Meta/Google account recovery immediately. Enable 2FA on all social accounts.',
      },
    ],
    keywordSignals: ['friend hacked', 'whatsapp account taken', 'instagram hacked money', 'otp account takeover'],
    doNot: [
      'Do NOT send money to any contact asking via social media without a voice/video verification call.',
      'Do NOT enter your login credentials on any link sent via DM.',
    ],
    safeVerification: 'Call your friend directly on their phone number (not WhatsApp) to verify any urgent request.',
  },
  {
    slug: 'fake-customer-care',
    name: 'Search Engine Fake Customer Care Trap',
    primaryTrigger: 'Spoofed Google Search customer care ad',
    tracks: ['money', 'access'],
    baseRisk: 'HIGH',
    stages: [
      {
        id: 'SEARCH_RESULT',
        name: 'Fake Search Result / Ad',
        description: 'Victim searches for a bank/airline/Amazon helpline and calls a spoofed Google Ads number.',
        signals: ['called google result', 'customer care number', 'amazon refund number', 'flipkart support', 'paytm helpline'],
        nextMove: 'Agent will gain trust by confirming some account details, then ask to "verify" via a link or app.',
      },
      {
        id: 'REMOTE_INSTALL',
        name: 'Remote App Install',
        description: 'Agent asks to install a "support app" to process refund/complaint.',
        signals: ['install support app', 'anydesk for refund', 'screen share for processing'],
        nextMove: 'With remote access, they will drain net banking or steal saved card details.',
      },
      {
        id: 'MONEY_STOLEN',
        name: 'Money/Data Stolen',
        description: 'Bank account drained or card details captured for further fraud.',
        signals: ['unauthorized transaction after call', 'card charged after support call'],
        nextMove: 'Call your bank\'s official number (printed on card) immediately to freeze and file chargeback.',
      },
    ],
    keywordSignals: ['fake customer care number', 'google search scam helpline', 'amazon refund trap', 'paytm fake support'],
    doNot: [
      'Do NOT call any customer care number found via Google Ads. Search the official website and navigate to the Contact Us page.',
      'No legitimate customer care agent needs remote access to process a refund.',
    ],
    safeVerification: 'The real customer care number is printed on the back of your card or in your registered app. Never use Google-Ads numbers.',
  },
  {
    slug: 'sim-swap',
    name: 'SIM Swap / 5G eSIM Deactivation Scam',
    primaryTrigger: 'Telephony 5G upgrade prompt',
    tracks: ['access', 'identity'],
    baseRisk: 'HIGH',
    stages: [
      {
        id: 'UPGRADE_MESSAGE',
        name: '5G Upgrade / SIM Deactivation Alert',
        description: 'SMS or call claims current SIM will deactivate for 5G upgrade; victim must press 1 or share OTP.',
        signals: ['sim will deactivate', '5g upgrade required', 'send sim number', 'airtel 5g port', 'jio 5g', 'press 1 to upgrade'],
        nextMove: 'They will ask you to forward an OTP received on your phone to "complete the 5G upgrade".',
      },
      {
        id: 'OTP_CAPTURED',
        name: 'OTP Forward / SIM Transfer Initiated',
        description: 'Scammer submits a SIM swap request at the telecom operator using victim\'s OTP.',
        signals: ['otp shared', 'new sim activated', 'my sim stopped working'],
        nextMove: 'Once the SIM swap is complete, victim\'s phone loses signal and scammer receives all banking OTPs.',
      },
      {
        id: 'BANK_DRAIN',
        name: 'Banking OTP Interception',
        description: 'All banking 2FA OTPs now go to scammer\'s SIM; accounts drained.',
        signals: ['phone signal lost suddenly', 'bank otp not receiving', 'unauthorized bank transfers'],
        nextMove: 'Call your telecom operator immediately to reverse the SIM swap. Then call your bank to freeze accounts.',
      },
    ],
    keywordSignals: ['sim deactivation 5g', 'sim swap fraud', 'jio airtel esim scam', 'sim upgrade otp', 'tafcop sim misuse'],
    doNot: [
      'Do NOT share OTPs or SIM card numbers with anyone for a "5G upgrade".',
      'Telecom operators perform 5G upgrades automatically without requiring OTP shares.',
    ],
    safeVerification: 'Visit your telecom operator\'s official store with ID for any SIM-related changes. Check SIMs registered on your Aadhaar at tafcop.sancharsaathi.gov.in.',
  },
  {
    slug: 'kbc-lottery',
    name: 'KBC Lottery / Lucky Draw Voucher Scam',
    primaryTrigger: 'WhatsApp audio note prize announcement',
    tracks: ['money'],
    baseRisk: 'MEDIUM',
    stages: [
      {
        id: 'PRIZE_ANNOUNCEMENT',
        name: 'Prize Announcement',
        description: 'WhatsApp audio note or SMS claims victim has won KBC/Amazon/Government lottery.',
        signals: ['kbc winner', 'lottery won', '25 lakh prize', 'amazon lottery', 'government scheme prize', 'lucky draw'],
        nextMove: 'They will ask you to confirm your details and pay a small "processing fee" to claim the prize.',
      },
      {
        id: 'PROCESSING_FEE',
        name: 'Processing Fee Demand',
        description: 'Multiple small fees (GST, legal, courier) are demanded before prize delivery.',
        signals: ['processing fee', 'gst for lottery', 'courier charges', 'legal clearance fee', 'claim your prize fee'],
        nextMove: 'Each fee payment leads to another fee until the victim stops or runs out of money.',
      },
      {
        id: 'FEE_ESCALATION',
        name: 'Fee Escalation Loop',
        description: 'Fees keep escalating — there is no prize.',
        signals: ['one more payment', 'final fee promise', 'prize will come after this payment'],
        nextMove: 'Contact ends once victim stops paying. No prize ever arrives.',
      },
    ],
    keywordSignals: ['kbc lottery whatsapp', 'amazon lucky draw', 'lottery prize fee', 'government prize processing fee'],
    doNot: [
      'Do NOT pay any fee to claim a prize — legitimate lotteries/contests never require upfront payment.',
      'KBC does not announce winners via WhatsApp audio notes.',
    ],
    safeVerification: 'KBC winner lists are announced only on the official KBC website and Sony LIV. No government scheme requires you to pay before receiving a benefit.',
  },
];

// ---------------------------------------------------------------------------
// Fast lookup map
// ---------------------------------------------------------------------------
export const PATTERN_MAP = new Map<string, ScamPattern>(
  PATTERNS.map(p => [p.slug, p])
);
