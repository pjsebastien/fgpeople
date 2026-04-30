/**
 * Auth admin minimaliste — Basic Auth via header HTTP.
 *
 * Pas de session/cookie, pas de DB. Adapté à un seul modérateur.
 * Configurable via ADMIN_USER / ADMIN_PASSWORD.
 */

import 'server-only';
import { headers } from 'next/headers';

export interface AdminCheckResult {
  ok: boolean;
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export function parseBasicAuth(header: string | null): { user: string; pass: string } | null {
  if (!header || !header.toLowerCase().startsWith('basic ')) return null;
  try {
    const b64 = header.slice(6).trim();
    const decoded = Buffer.from(b64, 'base64').toString('utf8');
    const idx = decoded.indexOf(':');
    if (idx === -1) return null;
    return { user: decoded.slice(0, idx), pass: decoded.slice(idx + 1) };
  } catch {
    return null;
  }
}

export function checkAdminCredentials(user: string, pass: string): boolean {
  const expectedUser = process.env.ADMIN_USER || 'admin';
  const expectedPass = process.env.ADMIN_PASSWORD;
  if (!expectedPass) return false;
  return timingSafeEqual(user, expectedUser) && timingSafeEqual(pass, expectedPass);
}

export async function isAuthenticated(): Promise<boolean> {
  const h = await headers();
  const creds = parseBasicAuth(h.get('authorization'));
  if (!creds) return false;
  return checkAdminCredentials(creds.user, creds.pass);
}

/** Lance une erreur si l'utilisateur n'est pas admin. À utiliser dans les Server Actions. */
export async function requireAdmin(): Promise<void> {
  const ok = await isAuthenticated();
  if (!ok) throw new Error('Unauthorized');
}
