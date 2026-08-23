import { NextRequest, NextResponse } from 'next/server';
import { SEED_JUDGES, createSession, COOKIE_NAME_EXPORT } from '@/lib/auth';

// Simple demo-only login that checks against seeded judge credentials.
// Real bcrypt comparison is skipped in favour of plaintext demo passwords for speed.
const DEMO_PASSWORDS: Record<string, string> = {
  'judge1@ncrp-demo.in': 'Judge@1234',
  'judge2@ncrp-demo.in': 'Judge@5678',
  'investigator@ncrp-demo.in': 'Investigate@99',
};

export async function POST(req: NextRequest): Promise<NextResponse> {
  const { email, password } = await req.json() as { email?: string; password?: string };

  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password required.' }, { status: 400 });
  }

  const judge = SEED_JUDGES.find(j => j.email === email);
  if (!judge || DEMO_PASSWORDS[email] !== password) {
    return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });
  }

  const token = await createSession({
    userId: email,
    email,
    role: judge.role,
    displayName: judge.displayName,
  });

  const res = NextResponse.json({ ok: true, displayName: judge.displayName });
  res.cookies.set(COOKIE_NAME_EXPORT, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  });
  return res;
}
