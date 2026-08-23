import { NextRequest, NextResponse } from 'next/server';
import { redactPII, extractEntities } from '@/lib/redact';

export const runtime = 'nodejs';
export const maxDuration = 30;

interface IngestResult {
  rawRedactedText: string;
  entities: ReturnType<typeof extractEntities>;
  source: 'vision' | 'whisper' | 'text';
  originalLength: number;
}

// ---------------------------------------------------------------------------
// POST /api/ingest
// Accepts: multipart/form-data with one of:
//   - file: image file (png/jpg/webp) → Vision OCR
//   - audio: audio file (m4a/mp3/wav) → Whisper transcription
//   - text: plain text string → direct
// Returns: redacted narrative + extracted entities
// ---------------------------------------------------------------------------
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const formData = await req.formData();
    const imageFile = formData.get('file') as File | null;
    const audioFile = formData.get('audio') as File | null;
    const text = formData.get('text') as string | null;

    let rawText = '';
    let source: IngestResult['source'] = 'text';

    if (imageFile) {
      rawText = await ingestImage(imageFile);
      source = 'vision';
    } else if (audioFile) {
      rawText = await ingestAudio(audioFile);
      source = 'whisper';
    } else if (text) {
      rawText = text;
      source = 'text';
    } else {
      return NextResponse.json(
        { error: 'Provide file (image), audio, or text in the request body.' },
        { status: 400 }
      );
    }

    // PII redaction MUST happen before storing or forwarding
    const entities = extractEntities(rawText);
    const rawRedactedText = redactPII(rawText);

    return NextResponse.json<IngestResult>({
      rawRedactedText,
      entities,
      source,
      originalLength: rawText.length,
    });
  } catch (err) {
    console.error('[/api/ingest] error:', err);
    return NextResponse.json({ error: 'Ingest failed.' }, { status: 500 });
  }
}

// ---------------------------------------------------------------------------
// Vision OCR via GPT-4o
// ---------------------------------------------------------------------------
async function ingestImage(file: File): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    // Fallback: return empty string with a note (allows text-mode to cover the demo)
    return `[Image uploaded: ${file.name} — Vision OCR requires OPENAI_API_KEY. Please paste the message text instead.]`;
  }

  const bytes = await file.arrayBuffer();
  const b64 = Buffer.from(bytes).toString('base64');
  const mime = file.type || 'image/jpeg';

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      max_tokens: 2000,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'You are a forensic text extractor. Extract ALL text visible in this screenshot exactly as written — every word, number, name, URL, UPI ID, phone number, and message. Include sender names, timestamps, and platform labels if visible. Output ONLY the extracted text, nothing else.',
            },
            {
              type: 'image_url',
              image_url: { url: `data:${mime};base64,${b64}`, detail: 'high' },
            },
          ],
        },
      ],
    }),
  });

  const data = await response.json() as {
    choices?: Array<{ message: { content: string } }>;
    error?: { message: string };
  };

  if (data.error) throw new Error(data.error.message);
  return data.choices?.[0]?.message?.content ?? '';
}

// ---------------------------------------------------------------------------
// Audio transcription via Whisper
// ---------------------------------------------------------------------------
async function ingestAudio(file: File): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return `[Audio uploaded: ${file.name} — Whisper transcription requires OPENAI_API_KEY. Please describe the call in text instead.]`;
  }

  const form = new FormData();
  form.append('file', file, file.name);
  form.append('model', 'whisper-1');
  form.append('language', 'hi'); // Hindi fallback; Whisper auto-detects

  const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}` },
    body: form,
  });

  const data = await response.json() as { text?: string; error?: { message: string } };
  if (data.error) throw new Error(data.error.message);
  return data.text ?? '';
}
