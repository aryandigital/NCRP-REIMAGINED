/**
 * Scam DNA corpus.
 *
 * Identifiers rotate hourly. Behaviour does not. Each pattern is a behavioural
 * script: an ordered sequence of stages, the channels it runs on, what the
 * attacker asks for, and — the reason this engine exists — what they will ask
 * for NEXT once the victim is at a given stage.
 *
 * `sources` are real public advisories and MUST be shown in the UI with dates.
 * Never present an unsourced number as fact.
 */

export type HarmTrack = "money" | "content" | "access" | "identity" | "safety";

export interface ScamStage {
  id: string;
  /** Short label shown on the timeline. */
  label: string;
  /** Observable signals that place a victim at this stage. */
  signals: string[];
}

export interface ScamPattern {
  slug: string;
  name: string;
  aliases: string[];
  tracks: HarmTrack[];
  channels: string[];
  stages: ScamStage[];
  /** What the attacker asks for, in escalating order. */
  asks: string[];
  /** Keyed by stage id — the single most likely next demand. */
  nextMove: Record<string, string>;
  /** Actions that make it materially worse. Shown as "do not". */
  doNot: string[];
  /** Jurisdictions whose public authorities have issued advisories. */
  advisoryCountries: string[];
  sources: { label: string; url: string; retrieved: string }[];
}

export const PATTERNS: ScamPattern[] = [
  {
    slug: "task-scam",
    name: "Task / part-time job scam",
    aliases: ["prepaid task scam", "hotel rating job", "product review job", "telegram task"],
    tracks: ["money"],
    channels: ["WhatsApp", "Telegram", "SMS", "Instagram"],
    stages: [
      { id: "approach", label: "Unsolicited job offer", signals: ["Message from an unknown number offering easy daily earnings", "Claims to represent a known brand"] },
      { id: "small-reward", label: "Small real payout", signals: ["You completed simple tasks", "You actually received ₹100–₹500"] },
      { id: "prepaid-task", label: "Prepaid 'merchant' task", signals: ["Asked to deposit to unlock higher-paying tasks", "Moved to a separate app or web dashboard"] },
      { id: "fake-balance", label: "Dashboard shows large balance", signals: ["Your wallet shows earnings far above what you deposited"] },
      { id: "withdrawal-blocked", label: "Withdrawal refused", signals: ["Withdrawal fails", "Told your account is 'frozen' or the task set is incomplete"] },
      { id: "unlock-fee", label: "Unlocking fee demanded", signals: ["Asked for tax, GST, credit-score or unlocking payment to release your money"] },
    ],
    asks: ["Small deposit", "Larger 'merchant' deposit", "Tax or GST payment", "Account unlocking fee", "Credit score restoration fee"],
    nextMove: {
      approach: "They will send a few genuinely paid micro-tasks to build trust before asking for any money.",
      "small-reward": "They will invite you to a 'prepaid task' and ask you to deposit your own money to unlock a higher tier.",
      "prepaid-task": "Your dashboard will show a large fake balance to make the next, bigger deposit feel safe.",
      "fake-balance": "Your withdrawal will fail, and the failure will be blamed on an incomplete task set.",
      "withdrawal-blocked": "They will demand a tax, GST or unlocking fee — framed as the last step before payout.",
      "unlock-fee": "There is no last step. Each payment produces a new fee. Nothing will be released.",
    },
    doNot: [
      "Do not make another payment to release your balance. No legitimate employer charges you to be paid.",
      "Do not let them move you onto a new app or dashboard.",
      "Do not delete the chat — it is your evidence.",
    ],
    advisoryCountries: ["India", "Singapore", "Australia"],
    sources: [
      { label: "I4C / cybercrime.gov.in — Daily Digest advisories", url: "https://cybercrime.gov.in/Webform/daily-digest.aspx", retrieved: "2026-08-22" },
      { label: "ScamShield (Singapore) — job scams", url: "https://www.scamshield.gov.sg/", retrieved: "2026-08-22" },
      { label: "Scamwatch (Australia) — jobs and employment scams", url: "https://www.scamwatch.gov.au/types-of-scams", retrieved: "2026-08-22" },
    ],
  },
  {
    slug: "digital-arrest",
    name: "Digital arrest",
    aliases: ["CBI call", "customs parcel scam", "police video call", "money laundering case"],
    tracks: ["money", "safety"],
    channels: ["Voice call", "WhatsApp video", "Skype"],
    stages: [
      { id: "parcel", label: "Parcel or case allegation", signals: ["Told a parcel in your name contains drugs or fake passports", "Told your Aadhaar is linked to money laundering"] },
      { id: "transfer", label: "Transferred to 'police'", signals: ["Call handed to someone in uniform", "Fake FIR, notice or ID card shown"] },
      { id: "isolation", label: "Isolation enforced", signals: ["Told not to tell family", "Kept on continuous video call", "Told you are under 'digital arrest'"] },
      { id: "verification-transfer", label: "'Verification' transfer demanded", signals: ["Asked to move funds to an RBI or 'safe' account for verification"] },
    ],
    asks: ["Full account verification transfer", "Fixed deposit liquidation", "Repeat transfers to avoid arrest"],
    nextMove: {
      parcel: "The call will be transferred to someone posing as police or CBI, often on video, in uniform.",
      transfer: "They will forbid you from telling anyone and keep you on a continuous call so nobody can interrupt.",
      isolation: "They will demand you transfer your balance to a 'safe' or 'RBI verification' account.",
      "verification-transfer": "After the first transfer they will find a further 'case' and demand your deposits too.",
    },
    doNot: [
      "No Indian police, CBI, ED or court arrests anyone over a video call. Digital arrest does not exist in law.",
      "Do not stay on the call. Hang up and phone someone you trust.",
      "No agency will ever ask you to transfer money for verification.",
    ],
    advisoryCountries: ["India"],
    sources: [
      { label: "I4C / cybercrime.gov.in — advisories", url: "https://cybercrime.gov.in/Webform/Advisory.aspx", retrieved: "2026-08-22" },
    ],
  },
  {
    slug: "investment-pig-butchering",
    name: "Investment / relationship investment scam",
    aliases: ["pig butchering", "crypto mentor", "trading group", "IPO allotment group"],
    tracks: ["money"],
    channels: ["WhatsApp", "Telegram", "Instagram", "Dating apps"],
    stages: [
      { id: "grooming", label: "Trust built over days", signals: ["Long friendly conversation before money is mentioned", "Added to a group of 'successful' investors"] },
      { id: "demo-gain", label: "Small withdrawal succeeds", signals: ["A small first withdrawal was paid out to prove legitimacy"] },
      { id: "scale-up", label: "Larger deposits urged", signals: ["Encouraged to borrow or liquidate savings", "Time-limited 'allotment' pressure"] },
      { id: "exit-block", label: "Withdrawal blocked", signals: ["Told to pay tax or margin before withdrawing"] },
    ],
    asks: ["Initial deposit", "Top-up to reach a tier", "Tax on profits", "Margin call"],
    nextMove: {
      grooming: "They will show you a platform with steady returns and let you withdraw a small amount successfully.",
      "demo-gain": "They will push a much larger deposit, often suggesting you borrow or break a fixed deposit.",
      "scale-up": "Your withdrawal will be blocked pending a 'tax' or 'margin' payment.",
      "exit-block": "Each payment will reveal another fee. The displayed balance is not real money.",
    },
    doNot: [
      "Do not pay tax or margin to withdraw. Real platforms deduct from the balance.",
      "Do not borrow to top up.",
      "Screenshot the platform dashboard now — these sites are taken offline quickly.",
    ],
    advisoryCountries: ["India", "Singapore", "Australia", "United States"],
    sources: [
      { label: "Scamwatch (Australia) — investment scams", url: "https://www.scamwatch.gov.au/types-of-scams", retrieved: "2026-08-22" },
      { label: "FTC (US) — consumer alerts", url: "https://consumer.ftc.gov/consumer-alerts", retrieved: "2026-08-22" },
    ],
  },
  {
    slug: "upi-collect-request",
    name: "UPI collect-request / refund reversal",
    aliases: ["wrong transfer refund", "OLX buyer scam", "QR code to receive money"],
    tracks: ["money"],
    channels: ["UPI apps", "WhatsApp", "Phone call"],
    stages: [
      { id: "pretext", label: "Refund or payment pretext", signals: ["Told money was sent by mistake", "Buyer insists on paying via a QR you must scan"] },
      { id: "collect", label: "Collect request sent", signals: ["A request appears in your UPI app asking you to approve", "Asked to scan a QR 'to receive' money"] },
      { id: "pin", label: "PIN entry pressed", signals: ["Told to enter your UPI PIN to receive funds"] },
    ],
    asks: ["Approve collect request", "Scan QR", "Enter UPI PIN"],
    nextMove: {
      pretext: "They will send a UPI collect request or a QR code and tell you approving it will credit your account.",
      collect: "They will pressure you to enter your UPI PIN, claiming it is needed to receive money.",
      pin: "The debit will complete and they will attempt a second, larger request immediately.",
    },
    doNot: [
      "You never enter a UPI PIN to RECEIVE money. A PIN only ever sends money out.",
      "Do not scan a QR code to receive a payment.",
    ],
    advisoryCountries: ["India"],
    sources: [
      { label: "NPCI — UPI safety guidance", url: "https://www.npci.org.in/what-we-do/upi/product-overview", retrieved: "2026-08-22" },
    ],
  },
  {
    slug: "sextortion-image-threat",
    name: "Sextortion / intimate image threat",
    aliases: ["video call blackmail", "nude leak threat", "morphed image extortion"],
    tracks: ["content", "money", "safety"],
    channels: ["WhatsApp", "Instagram", "Facebook", "Video call"],
    stages: [
      { id: "contact", label: "Friendly contact", signals: ["Unknown attractive profile initiates contact", "Conversation moves quickly to video"] },
      { id: "capture", label: "Recording made", signals: ["A video call took place", "Screen recording or screenshots were captured"] },
      { id: "threat", label: "Threat to publish", signals: ["Threatened with sending content to your contact list", "Shown a list of your friends or family"] },
      { id: "payment", label: "Payment demanded", signals: ["Money demanded to stop publication"] },
      { id: "published", label: "Content published", signals: ["Content posted to a platform or sent to contacts"] },
    ],
    asks: ["One-off payment", "Repeat payments", "More content"],
    nextMove: {
      contact: "They will steer you to a video call and record it without telling you.",
      capture: "They will show you the recording and threaten to send it to your contacts.",
      threat: "They will demand payment with a very short deadline to stop you from thinking.",
      payment: "Paying does not end it. The demand will repeat and usually increase.",
      published: "Copies will be re-uploaded. Removal needs hash-based blocking, not one takedown request.",
    },
    doNot: [
      "Do not pay. Payment reliably leads to further demands, not deletion.",
      "Do not delete the chat or block them before you have preserved the evidence.",
      "You have not done anything illegal by being a victim of this. You can report anonymously.",
    ],
    advisoryCountries: ["India", "United Kingdom", "United States", "Australia"],
    sources: [
      { label: "StopNCII.org — hash-based blocking for over-18s", url: "https://stopncii.org/", retrieved: "2026-08-22" },
      { label: "Take It Down (NCMEC) — for content taken under 18", url: "https://takeitdown.ncmec.org/", retrieved: "2026-08-22" },
      { label: "I4C / cybercrime.gov.in — women & children reporting", url: "https://cybercrime.gov.in/", retrieved: "2026-08-22" },
    ],
  },
];

export const PATTERN_BY_SLUG = new Map(PATTERNS.map((p) => [p.slug, p]));
