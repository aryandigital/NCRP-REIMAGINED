/**
 * Bank + UPI freeze playbooks.
 * Real helpline numbers. Real step-by-step instructions.
 * This is genuinely valuable consumer information that belongs in the portal.
 */

export interface BankPlaybook {
  id: string;
  name: string;
  shortName: string;
  logo: string; // emoji placeholder
  helpline: string;
  helplineLabel: string;
  appSteps: string[];
  callScript: string; // exactly what to say on the phone
  callDetails: string[]; // what info to have ready
}

export const BANK_PLAYBOOKS: BankPlaybook[] = [
  {
    id: "sbi",
    name: "State Bank of India",
    shortName: "SBI",
    logo: "🏦",
    helpline: "1800-11-2211",
    helplineLabel: "24×7 Toll Free",
    appSteps: [
      "Open YONO SBI app",
      "Tap Services → My Account → Block ATM / Debit Card",
      "Or: Services → Block Net Banking",
      "Confirm with OTP",
    ],
    callScript: `"I want to report an unauthorised transaction and block my account immediately.
My account number is [ACCOUNT], registered mobile [PHONE].
A fraudulent transfer of ₹[AMOUNT] was made on [DATE]."`,
    callDetails: [
      "Account number (last 4 digits is enough to start)",
      "Registered mobile number",
      "Approximate amount and date of fraud transaction",
      "Transaction reference / UTR number if you have it",
    ],
  },
  {
    id: "hdfc",
    name: "HDFC Bank",
    shortName: "HDFC",
    logo: "🏦",
    helpline: "1800-202-6161",
    helplineLabel: "24×7 Toll Free",
    appSteps: [
      "Open HDFC MobileBanking or PayZapp",
      "Tap Cards → Block / Hot-list Card",
      "Or: Request → Suspend Debit Card",
      "For full account block: visit branch or call helpline",
    ],
    callScript: `"I need to block my account and report fraud.
Account [ACCOUNT], mobile [PHONE].
Fraudulent transaction of ₹[AMOUNT] on [DATE]."`,
    callDetails: [
      "HDFC Customer ID or Account Number",
      "Registered mobile or email",
      "Transaction details",
    ],
  },
  {
    id: "icici",
    name: "ICICI Bank",
    shortName: "ICICI",
    logo: "🏦",
    helpline: "1860-120-7777",
    helplineLabel: "24×7",
    appSteps: [
      "Open iMobile Pay",
      "Tap Services → Block / Unblock ATM-cum-Debit Card",
      "Or: Call 1860-120-7777 → option 2 for blocking",
    ],
    callScript: `"I need to block my account and report an unauthorised transaction.
Customer ID [ID], mobile [PHONE], amount ₹[AMOUNT] on [DATE]."`,
    callDetails: [
      "Customer ID",
      "Registered mobile",
      "Transaction reference number",
    ],
  },
  {
    id: "axis",
    name: "Axis Bank",
    shortName: "Axis",
    logo: "🏦",
    helpline: "1860-419-5555",
    helplineLabel: "24×7",
    appSteps: [
      "Open Axis Mobile app",
      "Tap Cards → Block Card (temporary or permanent)",
      "Confirm with OTP sent to registered mobile",
    ],
    callScript: `"I want to block my account and report cyber fraud.
Account [ACCOUNT], mobile [PHONE], ₹[AMOUNT] deducted unauthorisedly on [DATE]."`,
    callDetails: [
      "Account number or Customer ID",
      "Registered mobile",
      "Transaction details",
    ],
  },
  {
    id: "phonpe",
    name: "PhonePe",
    shortName: "PhonePe",
    logo: "📱",
    helpline: "0804-0408-040",
    helplineLabel: "PhonePe Support",
    appSteps: [
      "Open PhonePe app",
      "Tap profile icon → Help → Dispute a Transaction",
      "Select the fraudulent transaction",
      "Tap 'Report as Fraud'",
      "Your linked bank account is NOT automatically blocked, call your bank too",
    ],
    callScript: `"I want to report a fraudulent UPI transaction.
Phone number [PHONE], UPI ID [UPI], amount ₹[AMOUNT] on [DATE].
I did not initiate this payment."`,
    callDetails: [
      "Registered mobile number",
      "UPI transaction ID (12xxx… shown in transaction history)",
      "Recipient UPI ID / handle",
    ],
  },
  {
    id: "gpay",
    name: "Google Pay",
    shortName: "GPay",
    logo: "📱",
    helpline: "1800-419-0157",
    helplineLabel: "Google Pay India",
    appSteps: [
      "Open Google Pay",
      "Tap the transaction → 'Dispute this transaction'",
      "Select 'I didn't make this payment'",
      "Also call your bank, GPay cannot freeze the destination bank account",
    ],
    callScript: `"I need to report an unauthorised UPI payment made from my GPay.
Registered number [PHONE], transaction ID [TXN_ID], ₹[AMOUNT] on [DATE].
UPI ID of recipient: [UPI_ID]."`,
    callDetails: [
      "Registered mobile number",
      "Google Pay transaction ID (shown in the transaction detail)",
      "Recipient UPI handle",
    ],
  },
  {
    id: "paytm",
    name: "Paytm",
    shortName: "Paytm",
    logo: "📱",
    helpline: "0120-4456-456",
    helplineLabel: "Paytm Care",
    appSteps: [
      "Open Paytm app",
      "Tap profile → 24×7 Help → Report Fraud",
      "Or go to: paytm.com → Help → Dispute Transaction",
    ],
    callScript: `"I want to report a fraud and block my Paytm wallet.
Registered number [PHONE], amount ₹[AMOUNT] on [DATE]."`,
    callDetails: [
      "Registered mobile number",
      "Paytm order / transaction ID",
    ],
  },
];

export const BANK_PLAYBOOK_MAP = new Map(BANK_PLAYBOOKS.map((b) => [b.id, b]));

// ─── 1930 script ─────────────────────────────────────────────────────────

export const HELPLINE_1930 = {
  number: "1930",
  label: "National Cybercrime Helpline",
  available: "24 × 7",
  script: `"I want to report financial cyber fraud.

My name: [YOUR NAME]
My mobile: [YOUR PHONE]
Bank: [YOUR BANK NAME]
Account number (last 4): [XXXX]
Amount deducted: ₹[AMOUNT]
Date and time: [DATE & TIME]
Transaction / UTR number: [NUMBER]
Scammer's UPI ID or account: [IF KNOWN]

The money was transferred without my consent."`,
  readyList: [
    "Your full name and mobile number",
    "Your bank name and account type",
    "Exact amount and date/time",
    "Transaction or UTR reference number",
    "Scammer's UPI ID, phone, or bank account if shown",
  ],
  note: "Call 1930 FIRST, even before the portal. The faster CFCFRMS receives the alert, the higher the chance of freezing the funds before the scammer withdraws.",
};

// ─── Content track playbook ───────────────────────────────────────────────

export const CONTENT_PLAYBOOK = {
  steps: [
    {
      id: "hash",
      title: "Fingerprint the image on your device",
      body: "We create a digital fingerprint (hash) in your browser. The image never leaves your phone. This fingerprint can be used to automatically detect and block the content across participating platforms.",
    },
    {
      id: "notice",
      title: "Send a 24-hour takedown notice",
      body: "IT Rules 2021, Rule 3(2)(b) requires platforms to remove this content within 24 hours of a complaint. We generate the notice and address it to the platform's named Grievance Officer.",
    },
    {
      id: "gac",
      title: "If they don't comply, appeal to the GAC",
      body: "If the platform misses the 24-hour window, you can appeal to the Grievance Appellate Committee (gac.gov.in) within 30 days. We draft that appeal when the clock expires.",
    },
    {
      id: "stopncii",
      title: "Proactive blocking via StopNCII",
      body: "We hand off your hash to StopNCII.org, which shares it with participating platforms to proactively block re-uploads. Over 300,000 images removed, 90%+ removal rate.",
    },
  ],
  doNot: [
    "Do not pay the person threatening you. Payment guarantees the demands continue.",
    "Do not delete the chat or block them yet, preserve it as evidence first.",
    "You have not done anything illegal. You can report this anonymously.",
  ],
  supportLine: "Tele-MANAS: 14416",
};
