import { NextResponse } from 'next/server';
import {
  ADMIN_COOKIE,
  adminConfigured,
  isAdmin,
  passwordMatches,
  sessionToken,
} from '@/lib/admin-auth';

/** Já está logado? */
export async function GET() {
  return NextResponse.json({ ok: await isAdmin() });
}

/** Login. */
export async function POST(req: Request) {
  if (!adminConfigured()) {
    return NextResponse.json(
      { ok: false, error: 'ADMIN_PASSWORD não configurada no servidor.' },
      { status: 500 },
    );
  }
  const { password } = await req.json().catch(() => ({ password: '' }));
  if (typeof password !== 'string' || !passwordMatches(password)) {
    return NextResponse.json({ ok: false, error: 'Senha incorreta.' }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, sessionToken(), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 12,
  });
  return res;
}

/** Logout. */
export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete(ADMIN_COOKIE);
  return res;
}
