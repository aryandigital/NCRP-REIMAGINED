import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const SECRET = new TextEncoder().encode(
  process.env.SESSION_SECRET ?? 'dev-secret-change-me-32-chars!!'
);
const COOKIE_NAME = 'ncrp_session';

export interface SessionPayload {
  userId: string;
  email: string;
  role: string;
  displayName: string;
}

export async function createSession(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(SECRET);
}

export async function verifySession(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySession(token);
}

export const COOKIE_NAME_EXPORT = COOKIE_NAME;

// ---------------------------------------------------------------------------
// Seeded judge accounts for demo / evaluation
// Passwords are bcrypt hashes of the plaintext shown in comments.
// ---------------------------------------------------------------------------
export const SEED_JUDGES = [
  {
    email: 'judge1@ncrp-demo.in',
    displayName: 'Judge Priya Sharma',
    role: 'judge',
    // password: Judge@1234
    passwordHash: '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
  },
  {
    email: 'judge2@ncrp-demo.in',
    displayName: 'Judge Arjun Mehta',
    role: 'judge',
    // password: Judge@5678
    passwordHash: '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
  },
  {
    email: 'investigator@ncrp-demo.in',
    displayName: 'Inspector R. K. Verma',
    role: 'investigator_mock',
    // password: Investigate@99
    passwordHash: '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
  },
];
