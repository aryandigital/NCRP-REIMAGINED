'use client';

import { useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';

type Mode = 'screenshot' | 'text' | 'identifier' | 'voice' | 'guided';

const MODES: { key: Mode; icon: string; label: string; hint: string }[] = [
  { key: 'screenshot', icon: '📸', label: 'Screenshot', hint: 'Upload or drag & drop a WhatsApp, SMS, Telegram, or bank alert screenshot' },
  { key: 'text', icon: '✏️', label: 'Paste text / URL', hint: 'Paste the suspicious message, link, or describe what happened' },
  { key: 'identifier', icon: '🔢', label: 'Phone / UPI / Account', hint: 'Enter a phone number, UPI ID, bank account, or social handle to check' },
  { key: 'voice', icon: '🎙️', label: 'Voice description', hint: 'Record yourself describing the scam call or incident in any language' },
  { key: 'guided', icon: '❓', label: 'Not sure what to upload', hint: 'Answer a few quick questions and we\'ll guide you to the right evidence' },
];

interface Props {
  initialText?: string;
}

export default function EvidenceDrop({ initialText = '' }: Props) {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>('screenshot');
  const [text, setText] = useState(initialText);
  const [identifier, setIdentifier] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [previewFile, setPreviewFile] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // ── Submit handlers ──────────────────────────────────────────

  async function submitText(value: string) {
    if (!value.trim()) { setError('Please enter a message or URL to check.'); return; }
    setIsLoading(true); setError('');
    try {
      const res = await fetch('/api/dna', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: value }),
      });
      const data = await res.json() as { incidentId?: string | null; error?: string; risk?: string };
      if (data.incidentId) {
        router.push(`/check/${data.incidentId}`);
      } else if (!data.error && data.risk) {
        // DB unavailable but analysis succeeded — persist in sessionStorage and show result
        sessionStorage.setItem('dna-pending', JSON.stringify(data));
        router.push('/check/result');
      } else {
        setError(data.error ?? 'Analysis failed. Please try again.');
      }
    } catch {
      setError('Network error. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  }

  async function submitFile(file: File) {
    setIsLoading(true); setError('');
    try {
      // Step 1: Ingest (Vision OCR)
      const fd = new FormData();
      fd.append('file', file);
      const ingestRes = await fetch('/api/ingest', { method: 'POST', body: fd });
      const ingestData = await ingestRes.json() as { rawRedactedText?: string; error?: string };
      if (!ingestData.rawRedactedText) {
        setError(ingestData.error ?? 'Could not read the image. Please try pasting the text instead.');
        return;
      }
      // Step 2: DNA analysis
      await submitText(ingestData.rawRedactedText);
    } catch {
      setError('Upload failed. Please try again or paste the text directly.');
    } finally {
      setIsLoading(false);
    }
  }

  // ── Drag & drop ──────────────────────────────────────────────

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file?.type.startsWith('image/')) {
      setPreviewFile(URL.createObjectURL(file));
      submitFile(file);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreviewFile(URL.createObjectURL(file));
      submitFile(file);
    }
  };

  // ── Voice recording ──────────────────────────────────────────

  async function toggleRecording() {
    if (isRecording) {
      mediaRecorderRef.current?.stop();
      setIsRecording(false);
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      audioChunksRef.current = [];
      mr.ondataavailable = e => audioChunksRef.current.push(e.data);
      mr.onstop = async () => {
        stream.getTracks().forEach(t => t.stop());
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const file = new File([blob], 'voice.webm', { type: 'audio/webm' });
        setIsLoading(true); setError('');
        const fd = new FormData();
        fd.append('audio', file);
        try {
          const res = await fetch('/api/ingest', { method: 'POST', body: fd });
          const data = await res.json() as { rawRedactedText?: string; error?: string };
          if (data.rawRedactedText) {
            await submitText(data.rawRedactedText);
          } else {
            setError('Could not transcribe audio. Please describe in text instead.');
          }
        } catch {
          setError('Audio processing failed.');
        } finally {
          setIsLoading(false);
        }
      };
      mr.start();
      mediaRecorderRef.current = mr;
      setIsRecording(true);
    } catch {
      setError('Microphone access denied. Please describe in text instead.');
    }
  }

  // ── Guided questionnaire ─────────────────────────────────────

  const GUIDED_OPTIONS = [
    { label: 'I got a suspicious message or call', action: () => { setMode('text'); } },
    { label: 'I was asked to pay or invest money', action: () => { setMode('text'); setText('I was asked to pay money / make an investment. '); } },
    { label: 'Someone threatened me online', action: () => { setMode('text'); setText('I received a threat online saying '); } },
    { label: 'My account was hacked or taken over', action: () => { setMode('identifier'); } },
    { label: 'Someone is using my images/videos', action: () => { router.push('/check?track=content'); } },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Mode selector tabs */}
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          overflowX: 'auto',
          paddingBottom: '0.25rem',
          scrollbarWidth: 'none',
        }}
      >
        {MODES.map(m => (
          <button
            key={m.key}
            onClick={() => { setMode(m.key); setError(''); }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.5rem 1rem',
              borderRadius: '999px',
              border: '1px solid',
              borderColor: mode === m.key ? 'var(--blue-light)' : 'var(--border-card)',
              background: mode === m.key ? 'var(--blue-subtle)' : 'var(--bg-input)',
              color: mode === m.key ? 'var(--blue-light)' : 'var(--text-secondary)',
              fontWeight: mode === m.key ? 700 : 500,
              fontSize: '0.875rem',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              flexShrink: 0,
              transition: 'all 0.15s',
            }}
          >
            <span>{m.icon}</span>
            {m.label}
          </button>
        ))}
      </div>

      {/* Hint */}
      <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>
        {MODES.find(m => m.key === mode)?.hint}
      </p>

      {/* ── Screenshot mode ── */}
      {mode === 'screenshot' && (
        <div>
          <div
            className={`drop-zone${isDragOver ? ' drag-over' : ''}`}
            onDragOver={e => { e.preventDefault(); setIsDragOver(true); }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            {previewFile ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={previewFile} alt="Uploaded screenshot" style={{ maxHeight: 200, maxWidth: '100%', objectFit: 'contain', borderRadius: 8 }} />
            ) : (
              <>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>📷</div>
                <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.375rem' }}>
                  Drag & drop or click to upload
                </div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                  WhatsApp · SMS · Telegram · Bank alerts · PNG, JPG, WEBP
                </div>
                <div style={{ marginTop: '0.75rem' }}>
                  <kbd style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: 4, padding: '2px 6px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Ctrl+V
                  </kbd>
                  <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginLeft: '0.375rem' }}>to paste from clipboard</span>
                </div>
              </>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleFileInput}
          />
        </div>
      )}

      {/* ── Text / URL mode ── */}
      {mode === 'text' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <textarea
            className="input"
            placeholder="Paste the suspicious message, URL, or describe what happened in your own words…"
            value={text}
            onChange={e => setText(e.target.value)}
            style={{ minHeight: 160 }}
            autoFocus
          />
          <button
            className="btn btn-primary"
            onClick={() => submitText(text)}
            disabled={isLoading || !text.trim()}
          >
            {isLoading ? 'Analysing…' : 'Analyse with Scam DNA →'}
          </button>
        </div>
      )}

      {/* ── Identifier mode ── */}
      {mode === 'identifier' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <input
            className="input"
            type="text"
            placeholder="+91 98765 43210 · merchant@okaxis · 40100XXXXX / SBIN0001234"
            value={identifier}
            onChange={e => setIdentifier(e.target.value)}
            autoFocus
          />
          <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
            Phone numbers, UPI IDs, bank accounts with IFSC, social handles, or URLs
          </p>
          <button
            className="btn btn-primary"
            onClick={() => submitText(`Suspicious identifier reported: ${identifier}`)}
            disabled={isLoading || !identifier.trim()}
          >
            {isLoading ? 'Checking…' : 'Check Identifier →'}
          </button>
        </div>
      )}

      {/* ── Voice mode ── */}
      {mode === 'voice' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
              Speak in English, Hindi, or Hinglish. Describe the call, message, or incident.
            </p>
            {isRecording && (
              <div style={{ color: 'var(--red-light)', fontWeight: 600, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--red-light)', display: 'inline-block', animation: 'pulse 1s infinite' }} />
                Recording… click to stop
              </div>
            )}
            <button
              className={`btn btn-lg ${isRecording ? 'btn-danger' : 'btn-primary'}`}
              onClick={toggleRecording}
              disabled={isLoading}
              style={{ borderRadius: '50%', width: 72, height: 72, minHeight: 72, padding: 0, fontSize: '1.75rem' }}
            >
              {isRecording ? '⏹' : '🎙️'}
            </button>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '0.75rem' }}>
              {isLoading ? 'Transcribing…' : isRecording ? 'Tap to stop recording' : 'Tap the mic to start recording'}
            </p>
          </div>
          <div style={{ width: '100%', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem', margin: '0 0 0.5rem' }}>
              Or describe in text instead:
            </p>
            <textarea className="input" placeholder="Type your description here…" onChange={e => setText(e.target.value)} value={text} />
            {text && (
              <button className="btn btn-primary" style={{ marginTop: '0.5rem', width: '100%' }} onClick={() => submitText(text)}>
                Analyse text →
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── Guided mode ── */}
      {mode === 'guided' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
          <p style={{ margin: '0 0 0.5rem', color: 'var(--text-secondary)' }}>
            Which best describes your situation?
          </p>
          {GUIDED_OPTIONS.map(o => (
            <button
              key={o.label}
              onClick={o.action}
              className="btn btn-secondary"
              style={{ justifyContent: 'flex-start', textAlign: 'left', height: 'auto', padding: '0.875rem 1.25rem' }}
            >
              {o.label}
            </button>
          ))}
        </div>
      )}

      {/* Error state */}
      {error && (
        <div
          style={{
            background: 'var(--red-subtle)',
            border: '1px solid rgba(239,68,68,0.3)',
            borderRadius: 'var(--radius-md)',
            padding: '0.875rem 1rem',
            color: 'var(--red-light)',
            fontSize: '0.9rem',
          }}
        >
          {error}
        </div>
      )}

      {/* Loading overlay */}
      {isLoading && !error && (
        <div
          style={{
            background: 'var(--blue-subtle)',
            border: '1px solid rgba(59,130,246,0.2)',
            borderRadius: 'var(--radius-md)',
            padding: '1rem',
            textAlign: 'center',
            color: 'var(--blue-light)',
          }}
        >
          <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Running Scam DNA analysis…</div>
          <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
            Redacting PII · Extracting entities · Matching 15 behavioral patterns
          </div>
        </div>
      )}
    </div>
  );
}
