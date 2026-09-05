/** Conditional guidance only. Case creation and transaction times are not legal trigger dates. */
export interface ActionGuidance {
  track: "money" | "content";
  label: string;
  why: string;
  triggerEvent: string;
  basis: string;
  sourceUrl: string;
}

export const CLOCKS = {
  RBI_ZERO_LIABILITY: {
    track: "money",
    label: "Notify your bank and ask about liability protections",
    why: "If a transaction was unauthorised, notify your bank promptly through its official channel. RBI protections depend on the circumstances, customer conduct and notification timing; reimbursement is not guaranteed.",
    triggerEvent: "Receipt of the bank's transaction communication, plus when the bank received your notification",
    basis: "RBI customer protection circular, 6 July 2017. Check current rules and applicability with your bank.",
    sourceUrl: "https://www.rbi.org.in/Scripts/NotificationUser.aspx?Id=11040&Mode=0",
  },
  BANK_SHADOW_REVERSAL: {
    track: "money",
    label: "Ask your bank about provisional credit",
    why: "If the RBI unauthorised-transaction framework applies, ask the bank to assess provisional credit and explain its decision. Raksha cannot promise a reversal or recovery of funds.",
    triggerEvent: "The bank's receipt of your unauthorised-transaction notification",
    basis: "RBI customer protection circular, 6 July 2017, reversal provisions subject to applicability.",
    sourceUrl: "https://www.rbi.org.in/Scripts/NotificationUser.aspx?Id=11040&Mode=0",
  },
  PLATFORM_TAKEDOWN: {
    track: "content",
    label: "Request removal of qualifying private content",
    why: "If the content falls within Rule 3(2)(b), use the platform's official complaint channel. The special removal provision does not apply to every harmful post. Keep evidence of the complaint without redistributing private images.",
    triggerEvent: "The platform's receipt of a complaint by or on behalf of the affected individual about qualifying content",
    basis: "IT Rules 2021, Rule 3(2)(b); consult the current rules through the official GAC portal.",
    sourceUrl: "https://gac.gov.in/",
  },
  PLATFORM_GRIEVANCE_ACK: {
    track: "content",
    label: "Keep the platform complaint receipt",
    why: "If you have complained to the platform's Grievance Officer, retain the receipt and check the applicable acknowledgement requirements. A Raksha draft is not a platform complaint.",
    triggerEvent: "The Grievance Officer's receipt of your complaint",
    basis: "IT Rules 2021, Rule 3(2)(a); consult the current rules through the official GAC portal.",
    sourceUrl: "https://gac.gov.in/",
  },
  PLATFORM_GRIEVANCE_RESOLUTION: {
    track: "content",
    label: "Follow up with the platform's Grievance Officer",
    why: "If a platform complaint remains unresolved, check the applicable resolution process. Requirements vary by complaint category; Raksha does not verify platform action.",
    triggerEvent: "The Grievance Officer's receipt of your complaint and its applicable category",
    basis: "IT Rules 2021, Rule 3(2)(a); consult the current rules through the official GAC portal.",
    sourceUrl: "https://gac.gov.in/",
  },
  GAC_APPEAL: {
    track: "content",
    label: "Check whether a GAC appeal is available",
    why: "If you are dissatisfied with a Grievance Officer's decision, or the applicable response period has passed, check appeal eligibility and timing on the official portal. An appeal does not guarantee removal.",
    triggerEvent: "Receipt of the Grievance Officer's decision, or verified expiry of the applicable complaint-resolution period",
    basis: "IT Rules 2021, Rule 3A; current appeal guidance on the official GAC portal.",
    sourceUrl: "https://gac.gov.in/",
  },
  MRM_APPLICATION: {
    track: "money",
    label: "Check the process for restoring frozen funds",
    why: "If authorities confirm that funds were frozen, ask about the applicable restoration process and required documents. A Raksha case ID is not an official complaint acknowledgement and does not establish eligibility.",
    triggerEvent: "Official confirmation of frozen funds and the applicable restoration instructions",
    basis: "MHA Money Restoration Module. Confirm eligibility and current instructions with the responsible authority.",
    sourceUrl: "https://mrm-ncrp.mha.gov.in/",
  },
  BANKING_OMBUDSMAN: {
    track: "money",
    label: "Check eligibility for an RBI Ombudsman complaint",
    why: "If your bank complaint is rejected, the response is unsatisfactory, or the applicable no-reply period has passed, check eligibility through RBI's Complaint Management System. Escalation does not guarantee reimbursement.",
    triggerEvent: "The bank's receipt of your written complaint and its reply date, or confirmed absence of a reply",
    basis: "RBI Integrated Ombudsman Scheme 2021; check the current eligibility and time limits on RBI CMS.",
    sourceUrl: "https://cms.rbi.org.in/",
  },
} satisfies Record<string, ActionGuidance>;

export type ClockKind = keyof typeof CLOCKS;
