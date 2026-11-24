import { createHash, timingSafeEqual } from 'crypto';
import { cookies } from 'next/headers';

/* Login do painel admin, validado no servidor.
   A senha vem de ADMIN_PASSWORD (variável de ambiente) e nunca vai para o navegador. */

export const ADMIN_COOKIE = 'rise_admin';

const hash = (pwd: string) => createHash('sha256').update('rise-admin:' + pwd).digest();

export const adminConfigured = () => Boolean(process.env.ADMIN_PASSWORD);

export function passwordMatches(input: string) {
  const pwd = process.env.ADMIN_PASSWORD;
  if (!pwd) return false;
  return timingSafeEqual(hash(input), hash(pwd));
}

/** Valor do cookie de sessão (muda sozinho se a senha for trocada). */
export const sessionToken = () => hash(process.env.ADMIN_PASSWORD ?? '').toString('hex');

export async function isAdmin() {
  if (!adminConfigured()) return false;
  const value = (await cookies()).get(ADMIN_COOKIE)?.value;
  return value === sessionToken();
}
