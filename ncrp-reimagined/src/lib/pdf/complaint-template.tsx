import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { Incident } from "@/lib/store";

const PATTERN_CONFIG: Record<string, { title: string; authority: string; subject: string }> = {
  "task-scam": {
    title: "Online Task / Part-time Job Fraud Complaint",
    authority: "The Nodal Officer, Cyber Crime Cell",
    subject: "Complaint regarding online task fraud and financial loss",
  },
  "upi-fraud": {
    title: "UPI / Online Payment Fraud Complaint",
    authority: "The Nodal Officer, NPCI Grievance Cell",
    subject: "Complaint regarding unauthorized UPI payment transaction",
  },
  "investment-fraud": {
    title: "Online Investment Fraud Complaint",
    authority: "The Nodal Officer, SEBI / Cyber Crime Cell",
    subject: "Complaint regarding fraudulent online investment scheme",
  },
  "identity-theft": {
    title: "Identity Theft / Impersonation Complaint",
    authority: "The Station House Officer, Cyber Crime Police Station",
    subject: "Complaint regarding identity theft and unauthorized use of personal information",
  },
  phishing: {
    title: "Phishing Attack Complaint",
    authority: "The Nodal Officer, CERT-In",
    subject: "Complaint regarding phishing attack and impersonation of a trusted entity",
  },
  sextortion: {
    title: "Image-Based Abuse / Sextortion Complaint",
    authority: "The Station House Officer, Cyber Crime Police Station",
    subject: "Complaint regarding image-based abuse and financial extortion",
  },
  "romance-scam": {
    title: "Online Romance Scam Complaint",
    authority: "The Nodal Officer, Cyber Crime Cell",
    subject: "Complaint regarding online romance fraud and financial cheating",
  },
};

const DEFAULT_CONFIG = {
  title: "Cybercrime Complaint",
  authority: "The Nodal Officer, National Cyber Crime Reporting Portal",
  subject: "Complaint regarding cybercrime incident",
};

function getConfig(slug: string | null) {
  if (!slug) return DEFAULT_CONFIG;
  return PATTERN_CONFIG[slug] ?? DEFAULT_CONFIG;
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

const s = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 10,
    paddingTop: 50,
    paddingBottom: 65,
    paddingHorizontal: 52,
    color: "#1a1a1a",
    backgroundColor: "#ffffff",
  },
  watermark: {
    position: "absolute",
    top: 270,
    left: -30,
    fontSize: 54,
    color: "#cc0000",
    opacity: 0.07,
    fontFamily: "Helvetica-Bold",
    width: 680,
    textAlign: "center",
  },
  banner: {
    backgroundColor: "#fffbeb",
    borderWidth: 1,
    borderColor: "#fbbf24",
    borderRadius: 3,
    paddingVertical: 7,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  bannerText: {
    fontSize: 7.5,
    color: "#78350f",
    textAlign: "center",
    fontFamily: "Helvetica-Bold",
    lineHeight: 1.5,
  },
  title: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
    color: "#111827",
    marginBottom: 6,
  },
  rule: {
    borderBottomWidth: 1.5,
    borderBottomColor: "#111827",
    marginBottom: 18,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  metaLabel: { fontSize: 8, color: "#6b7280", marginBottom: 2 },
  metaValue: { fontSize: 9, fontFamily: "Helvetica-Bold", color: "#111827" },
  ackBadge: {
    backgroundColor: "#f0fdf4",
    borderWidth: 0.5,
    borderColor: "#86efac",
    borderRadius: 3,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginBottom: 16,
    alignSelf: "flex-start",
  },
  ackText: { fontSize: 8, color: "#15803d", fontFamily: "Helvetica-Bold" },
  addrLabel: { fontSize: 10, fontFamily: "Helvetica-Bold", marginBottom: 3 },
  addrText: { fontSize: 10, lineHeight: 1.6 },
  subjectRow: { flexDirection: "row", marginBottom: 14, marginTop: 2 },
  subjectBold: { fontSize: 10, fontFamily: "Helvetica-Bold", marginRight: 4 },
  subjectItalic: { fontSize: 10, fontFamily: "Helvetica-Oblique", flex: 1, lineHeight: 1.5 },
  para: { fontSize: 10, lineHeight: 1.7, marginBottom: 12, textAlign: "justify" },
  sectionHead: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    letterSpacing: 0.6,
    color: "#374151",
    marginBottom: 6,
    marginTop: 2,
  },
  tableWrap: { borderWidth: 0.5, borderColor: "#d1d5db", borderRadius: 2, marginBottom: 14 },
  factRow: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderBottomColor: "#e5e7eb",
    paddingVertical: 5,
    paddingHorizontal: 8,
  },
  factRowLast: {
    flexDirection: "row",
    paddingVertical: 5,
    paddingHorizontal: 8,
  },
  factKey: { width: "36%", fontSize: 9, fontFamily: "Helvetica-Bold", color: "#4b5563" },
  factVal: { width: "64%", fontSize: 9, color: "#111827", lineHeight: 1.5 },
  bullet: { flexDirection: "row", marginBottom: 4 },
  bulletDot: { fontSize: 9, marginRight: 6, color: "#9ca3af" },
  bulletText: { fontSize: 9, flex: 1, lineHeight: 1.5, color: "#374151" },
  narrative: {
    fontSize: 9,
    lineHeight: 1.6,
    color: "#374151",
    backgroundColor: "#f9fafb",
    padding: 10,
    borderLeftWidth: 2,
    borderLeftColor: "#d1d5db",
    marginBottom: 14,
  },
  declarationBox: {
    borderWidth: 0.5,
    borderColor: "#d1d5db",
    borderRadius: 3,
    padding: 10,
    marginTop: 14,
    backgroundColor: "#f9fafb",
  },
  declarationText: { fontSize: 9, lineHeight: 1.7, color: "#4b5563", textAlign: "justify" },
  sigRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 28,
  },
  sigBlock: { width: "42%" },
  sigLine: { borderBottomWidth: 0.5, borderBottomColor: "#374151", height: 32, marginBottom: 5 },
  sigLabel: { fontSize: 8, color: "#9ca3af", textAlign: "center" },
  footer: {
    position: "absolute",
    bottom: 22,
    left: 52,
    right: 52,
    borderTopWidth: 0.5,
    borderTopColor: "#e5e7eb",
    paddingTop: 6,
  },
  footerText: { fontSize: 7, color: "#9ca3af", textAlign: "center", lineHeight: 1.5 },
  pageNum: { fontSize: 7, color: "#9ca3af", textAlign: "right", marginTop: 2 },
  addrBlock: { marginBottom: 14 },
});

export interface ComplaintDocumentProps {
  incident: Incident;
  userName?: string | null;
}

export function ComplaintDocument({ incident, userName }: ComplaintDocumentProps) {
  const cfg = getConfig(incident.dna?.patternSlug ?? null);
  const ref = incident.ackNumber ?? incident.id;
  const dateStr = fmtDate(incident.createdAt);
  const displayName = userName ?? "[Your Full Name]";
  const facts = incident.extractedFacts;
  const signals = incident.dna?.signals ?? [];
  const riskLabel = incident.dna?.risk === "high" ? "HIGH" : incident.dna?.risk === "medium" ? "MEDIUM" : "UNCLEAR";

  return (
    <Document
      title={cfg.title}
      author="NCRP Reimagined (Hackathon Prototype)"
      subject={cfg.subject}
      creator="NCRP Reimagined"
    >
      <Page size="A4" style={s.page}>
        {/* Diagonal watermark — fixed repeats on every page */}
        <Text style={s.watermark} fixed>
          PROTOTYPE — NOT A REAL DOCUMENT
        </Text>

        {/* Prototype warning banner */}
        <View style={s.banner}>
          <Text style={s.bannerText}>
            PROTOTYPE ONLY · This draft was generated by a hackathon project. It is NOT an official government
            document and has NO legal standing. Verify all information before filing any actual complaint.
          </Text>
        </View>

        {/* Document title */}
        <Text style={s.title}>{cfg.title}</Text>
        <View style={s.rule} />

        {/* Meta row */}
        <View style={s.metaRow}>
          <View>
            <Text style={s.metaLabel}>Reference No.</Text>
            <Text style={s.metaValue}>{ref}</Text>
          </View>
          <View>
            <Text style={s.metaLabel}>Date of Report</Text>
            <Text style={s.metaValue}>{dateStr}</Text>
          </View>
          <View>
            <Text style={s.metaLabel}>Risk Level</Text>
            <Text style={s.metaValue}>{riskLabel}</Text>
          </View>
          <View>
            <Text style={s.metaLabel}>Crime Type</Text>
            <Text style={s.metaValue}>{incident.dna?.patternName ?? "Unclassified"}</Text>
          </View>
        </View>

        {/* Acknowledgement badge */}
        {incident.ackNumber && (
          <View style={s.ackBadge}>
            <Text style={s.ackText}>Acknowledgement: {incident.ackNumber}</Text>
          </View>
        )}

        {/* Address */}
        <View style={s.addrBlock}>
          <Text style={s.addrLabel}>To,</Text>
          <Text style={s.addrText}>{cfg.authority}</Text>
          <Text style={s.addrText}>National Cyber Crime Reporting Portal (cybercrime.gov.in)</Text>
        </View>

        {/* Subject */}
        <View style={s.subjectRow}>
          <Text style={s.subjectBold}>Sub:</Text>
          <Text style={s.subjectItalic}>{cfg.subject}</Text>
        </View>

        {/* Opening */}
        <Text style={s.para}>Respected Sir / Madam,</Text>
        <Text style={s.para}>
          I, {displayName}, am writing to formally report a cybercrime incident identified on {dateStr}. The
          incident has been classified as &#34;{incident.dna?.patternName ?? "a cybercrime"}&#34; with a risk
          level of &#34;{riskLabel}&#34;. I request appropriate action under the Information Technology Act,
          2000 and applicable provisions of the Bharatiya Nyaya Sanhita, 2023.
        </Text>

        {/* Incident details table */}
        {facts.length > 0 && (
          <View>
            <Text style={s.sectionHead}>Incident Details</Text>
            <View style={s.tableWrap}>
              {facts.map((fact, i) => (
                <View key={i} style={i === facts.length - 1 ? s.factRowLast : s.factRow}>
                  <Text style={s.factKey}>{fact.field}</Text>
                  <Text style={s.factVal}>
                    {fact.value !== null && fact.value !== undefined ? String(fact.value) : "—"}
                    {fact.confirmationStatus === "confirmed" || fact.confirmationStatus === "corrected"
                      ? "  ✓"
                      : ""}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Signals */}
        {signals.length > 0 && (
          <View style={{ marginBottom: 14 }}>
            <Text style={s.sectionHead}>Signals Detected</Text>
            {signals.map((signal, i) => (
              <View key={i} style={s.bullet}>
                <Text style={s.bulletDot}>•</Text>
                <Text style={s.bulletText}>{signal}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Original narrative */}
        {incident.rawText && (
          <View style={{ marginBottom: 14 }}>
            <Text style={s.sectionHead}>Original Complaint Narrative</Text>
            <Text style={s.narrative}>
              {incident.rawText.length > 900
                ? incident.rawText.slice(0, 900) + "… [truncated]"
                : incident.rawText}
            </Text>
          </View>
        )}

        {/* Declaration */}
        <View style={s.declarationBox}>
          <Text style={s.declarationText}>
            I hereby declare that the information provided above is true and correct to the best of my
            knowledge and belief. I understand that providing false information to authorities is punishable
            under applicable law. I request the concerned authorities to take necessary action and keep me
            informed of progress at the contact details on record.
          </Text>
        </View>

        {/* Signature */}
        <View style={s.sigRow}>
          <View style={s.sigBlock}>
            <View style={s.sigLine} />
            <Text style={s.sigLabel}>Complainant Signature</Text>
          </View>
          <View style={s.sigBlock}>
            <View style={s.sigLine} />
            <Text style={s.sigLabel}>Date &amp; Place</Text>
          </View>
        </View>

        {/* Fixed footer on every page */}
        <View style={s.footer} fixed>
          <Text style={s.footerText}>
            PROTOTYPE · Generated by NCRP Reimagined Hackathon Project · NOT an official government document ·
            For demonstration purposes only
          </Text>
          <Text
            style={s.pageNum}
            render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
            fixed
          />
        </View>
      </Page>
    </Document>
  );
}
