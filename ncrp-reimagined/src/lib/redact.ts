// PII Redaction module — runs BEFORE any LLM call or DB storage.
// Covers Aadhaar, PAN, cards (Luhn-validated), Indian mobile numbers, UPI IDs, IFSC codes.

// ---------------------------------------------------------------------------
// Luhn mod-10 check (credit/debit cards)
// ---------------------------------------------------------------------------
function luhn(digits: string): boolean {
  let sum = 0;
  let alternate = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let n = parseInt(digits[i], 10);
    if (alternate) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    alternate = !alternate;
  }
  return sum % 10 === 0;
}

// ---------------------------------------------------------------------------
// Extracted entities (pre-redaction)
// ---------------------------------------------------------------------------
export interface ExtractedEntities {
  phoneNumbers: string[];
  upiIds: string[];
  urls: string[];
  bankAccounts: string[];
  ifscCodes: string[];
  amounts: number[];
  aadhaarNumbers: string[];
  panNumbers: string[];
}

// ---------------------------------------------------------------------------
// Extract entities from raw text BEFORE redacting
// ---------------------------------------------------------------------------
export function extractEntities(text: string): ExtractedEntities {
  const phoneNumbers = [
    ...text.matchAll(/(?:\+91[\s-]?)?([6-9]\d{9})\b/g),
  ].map(m => m[1]);

  const upiIds = [
    ...text.matchAll(/\b([a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64})\b/g),
  ].map(m => m[1]);

  const urls = [
    ...text.matchAll(/https?:\/\/[^\s"'<>]+/g),
  ].map(m => m[0]);

  const ifscCodes = [
    ...text.matchAll(/\b([A-Z]{4}0[A-Z0-9]{6})\b/g),
  ].map(m => m[1]);

  const amounts = [
    ...text.matchAll(/(?:₹|Rs\.?|INR)\s*([\d,]+(?:\.\d{1,2})?)/gi),
  ].map(m => parseFloat(m[1].replace(/,/g, '')));

  const aadhaarNumbers = [
    ...text.matchAll(/\b([2-9]\d{3}\s?\d{4}\s?\d{4})\b/g),
  ].map(m => m[1].replace(/\s/g, ''));

  const panNumbers = [
    ...text.matchAll(/\b([A-Z]{5}[0-9]{4}[A-Z])\b/g),
  ].map(m => m[1]);

  // Bank account numbers: 9–18 digit sequences not matching phone/Aadhaar
  const bankAccounts = [
    ...text.matchAll(/\b(\d{9,18})\b/g),
  ]
    .map(m => m[1])
    .filter(n => n.length >= 9 && n.length <= 18 && !phoneNumbers.includes(n.slice(-10)));

  return {
    phoneNumbers: [...new Set(phoneNumbers)],
    upiIds: [...new Set(upiIds)],
    urls: [...new Set(urls)],
    bankAccounts: [...new Set(bankAccounts)],
    ifscCodes: [...new Set(ifscCodes)],
    amounts: [...new Set(amounts)],
    aadhaarNumbers: [...new Set(aadhaarNumbers)],
    panNumbers: [...new Set(panNumbers)],
  };
}

// ---------------------------------------------------------------------------
// Redact PII from text — returns sanitized string
// ---------------------------------------------------------------------------
export function redactPII(text: string): string {
  let out = text;

  // Aadhaar: 12 digits (spaces optional), starts with 2-9
  out = out.replace(/\b([2-9]\d{3}\s?\d{4}\s?\d{4})\b/g, '[AADHAAR_REDACTED]');

  // PAN: 5 letters + 4 digits + 1 letter
  out = out.replace(/\b([A-Z]{5}[0-9]{4}[A-Z])\b/g, '[PAN_REDACTED]');

  // Credit/Debit cards (Luhn-validated 13–19 digit groups)
  out = out.replace(/\b(?:\d{4}[-\s]?){3}\d{1,7}\b/g, (match) => {
    const digits = match.replace(/[\s-]/g, '');
    if (digits.length >= 13 && digits.length <= 19 && luhn(digits)) {
      return '[CARD_REDACTED]';
    }
    return match;
  });

  // Indian mobile numbers (+91 optional)
  out = out.replace(/(?:\+91[\s-]?)?[6-9]\d{9}\b/g, '[PHONE_REDACTED]');

  // UPI IDs
  out = out.replace(/\b[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}\b/g, '[UPI_REDACTED]');

  // IFSC codes
  out = out.replace(/\b[A-Z]{4}0[A-Z0-9]{6}\b/g, '[IFSC_REDACTED]');

  return out;
}
