# LEGAL_CLOCKS.md — Statutory Deadline Engine & Legal Document Templates

## 1. The Statutory Deadline Philosophy

Every legal protection granted to an Indian citizen under RBI master directions, the Information Technology Act, and MHA SOPs operates on a strict statutory timer.

> **Problem**: Today, citizens are unaware of these statutory clocks. By the time they discover their rights, the deadlines have expired.
> **Solution**: The Recovery Cockpit instantiates live countdown clocks at the exact moment of incident intake, automatically drafting the corresponding enforceable legal document before the clock runs out.

---

## 2. Complete Catalogue of the 8 Statutory Clocks

| Clock Name | Duration | Track | Statutory Legal Basis | Document Triggered |
|---|---|---|---|---|
| **RBI Zero-Liability Window** | 3 Working Days | Money | *RBI Circular DBR.No.Leg.BC.78/09.07.005/2017-18 dated 6 July 2017: Customer Protection – Limiting Liability in Unauthorised Electronic Banking Transactions.* | Bank Nodal Officer Letter |
| **Bank Shadow Reversal** | 10 Working Days | Money | *RBI Circular dated 6 July 2017 (Para 9): Mandated credit/shadow reversal within 10 working days of complaint.* | Shadow Reversal Follow-Up Letter |
| **Platform Content Takedown** | 24 Hours | Content | *IT (Intermediary Guidelines and Digital Media Ethics Code) Rules 2021, Rule 3(2)(b): Mandatory removal within 24 hours of notice regarding intimate/defamatory media.* | Platform Takedown Notice |
| **Grievance Acknowledgement** | 24 Hours | Content | *IT Rules 2021, Rule 3(2)(a): Mandatory receipt acknowledgement by Resident Grievance Officer within 24 hours.* | Grievance Receipt Verification Notice |
| **Grievance Resolution** | 15 Days | Content | *IT Rules 2021, Rule 3(2)(a): Disposal of grievance within 15 days from date of receipt.* | Final Redressal Demand Notice |
| **Grievance Appellate Committee (GAC) Appeal** | 30 Days | Content | *IT Rules 2021, Rule 3A: Appeal against intermediary decision to the central GAC within 30 calendar days.* | GAC Appeal Petition Draft |
| **Money Restoration Module (MRM)** | 30 Days | Money | *MHA CFCFRMS SOP (Jan 2026): Court-ordered release of frozen inter-bank funds via Section 457 CrPC / 503 BNSS.* | MRM Court Claim Data Sheet |
| **RBI Banking Ombudsman** | After 30 Days | Money | *Reserve Bank – Integrated Ombudsman Scheme, 2021 (Clause 10): Escalation if bank rejects or fails to reply within 30 days.* | RBI Ombudsman Formal Complaint |

---

## 3. Legal Document Templates & Specifications

### 3.1. Bank Principal Nodal Officer Notice (Zero-Liability Assertion)

```text
To,
The Principal Nodal Officer,
[Bank Name] — [Branch / IFSC: {{bankIfsc}}]
[Address / Official Nodal Email]

Date: {{currentDate}}
Subject: Immediate Formal Notice of Unauthorised Electronic Banking Transactions under RBI Circular DBR.No.Leg.BC.78/09.07.005/2017-18

Dear Sir/Madam,

I am writing to formally report unauthorized and fraudulent transactions debited from my account [Account Number: {{accountNumberRedacted}}] without my consent or authorization.

1. TRANSACTION DETAILS:
   - Transaction Reference / UTR: {{transactionRef}}
   - Amount: ₹{{amount}}
   - Date & Time: {{incidentTimestamp}}
   - National Cyber Crime Ack No: {{ackNumber}}

2. STATUTORY NOTIFICATION WITHIN ZERO-LIABILITY WINDOW:
As per Paragraph 6(a) of the RBI Master Direction on Customer Protection – Limiting Liability of Customers in Unauthorised Electronic Banking Transactions (6 July 2017), a customer has ZERO LIABILITY when unauthorized transactions occur and are reported within three working days. This notice constitutes formal reporting within that statutory window.

3. REQUIRED STATUTORY ACTIONS:
   a) Immediately reverse the unauthorized debit and provide shadow credit to my account within 10 working days as mandated under Paragraph 9 of the circular.
   b) Share the beneficiary bank IFSC, account, and freeze status under 1930 / CFCFRMS coordination.

Yours faithfully,
[Citizen Name / Account Holder]
Contact: {{phoneRedacted}} | NCRP ACK: {{ackNumber}}
```

---

### 3.2. Platform 24-Hour Takedown Notice (IT Rules Rule 3(2)(b))

```text
URGENT STATUTORY NOTICE UNDER RULE 3(2)(b) OF THE INFORMATION TECHNOLOGY (INTERMEDIARY GUIDELINES AND DIGITAL MEDIA ETHICS CODE) RULES, 2021

To,
Resident Grievance Officer,
[Platform Name: {{platformName}}]

Date: {{currentDate}}
Incident Reference: NCRP-{{ackNumber}}

RE: Mandatory Removal / Disabling of Access within 24 Hours to Non-Consensual / Intimate Material

Dear Grievance Officer,

This is a formal statutory notice filed under Rule 3(2)(b) of the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021.

1. CONTENT IDENTIFIERS:
   - Platform URL / Handle / Post Link: {{contentUrl}}
   - Perceptual Hash (pHash): {{hashHex}} (Algorithm: {{hashAlgo}})
   - Note: In compliance with privacy safeguards, the image is represented via cryptographic fingerprint.

2. STATUTORY OBLIGATION:
Under Rule 3(2)(b), upon receipt of a complaint from an individual or person on their behalf regarding material which exposes the private area of such individual or is in the nature of impersonation/non-consensual sexual content, the intermediary SHALL TAKE ALL REASONABLE AND PRACTICABLE MEASURES TO REMOVE OR DISABLE ACCESS TO THE CONTENT WITHIN TWENTY-FOUR (24) HOURS FROM THE RECEIPT OF COMPLAINT.

Failure to comply within 24 hours constitutes forfeiture of intermediary safe harbor protections under Section 79(1) of the Information Technology Act, 2000.

Please confirm receipt and disablement within the statutory window.

Sincerely,
Citizen Redressal Enclave | Ref: NCRP-{{ackNumber}}
```

---

### 3.3. Grievance Appellate Committee (GAC) Appeal Petition

```text
APPEAL UNDER RULE 3A OF THE INFORMATION TECHNOLOGY (INTERMEDIARY GUIDELINES AND DIGITAL MEDIA ETHICS CODE) RULES, 2021

To,
The Grievance Appellate Committee (GAC),
Ministry of Electronics and Information Technology (MeitY), Government of India.

1. APPELLANT DETAILS:
   - Case ID: NCRP-{{ackNumber}}
   - Date of Initial Notice to Intermediary: {{noticeSentDate}}

2. INTERMEDIARY DETAILS:
   - Intermediary Name: {{platformName}}
   - Resident Grievance Officer Reference: {{grievanceRefId}}

3. GROUNDS OF APPEAL:
   [X] The intermediary failed to take down the non-consensual content within the 24-hour statutory window mandated under Rule 3(2)(b).
   [ ] The intermediary rejected the takedown request without valid legal justification.

4. RELIEF SOUGHT:
   Order directing {{platformName}} to immediately purge the fingerprinted media (Hash: {{hashHex}}) across all associated instances and CDNs.
```

---

## 4. Compliance & Verification Guarantees

1. **Rule-Based Generation**: All document templates are deterministic and code-curated. The AI system only fills schema fields; it never invents dates or legal citations.
2. **Real-Time Clocks**: Clocks use UTC timestamps with dynamic client calculation against IST business days and holidays.
3. **Print-CSS Architecture**: Rendered on `/documents/[docId]/print` with clean A4 layout, formal headers, and print styling without requiring heavy headless browser rendering.
