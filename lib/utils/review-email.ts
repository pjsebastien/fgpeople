/**
 * Envoi d'email de notification à l'admin (via Resend).
 * Échec silencieux : on ne bloque jamais la création d'un avis si l'email plante.
 */

import 'server-only';
import { Resend } from 'resend';
import type { Review } from '../types/reviews';

const SITE_URL = 'https://www.fgpeople.com';

let _client: Resend | null = null;
function client(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  if (!_client) _client = new Resend(key);
  return _client;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Notifie l'admin qu'un avis vient d'être soumis et attend modération. */
export async function notifyAdminNewReview(review: Review, lieuName?: string): Promise<void> {
  const c = client();
  const to = process.env.ADMIN_EMAIL;
  const from = process.env.RESEND_FROM || 'onboarding@resend.dev';
  if (!c || !to) return;

  const stars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
  const subject = `[FG People] Nouvel avis à modérer : ${stars} ${lieuName || review.lieu_slug}`;
  const adminUrl = `${SITE_URL}/admin/avis`;

  const html = `
    <div style="font-family:system-ui,sans-serif;max-width:600px;margin:0 auto;padding:24px">
      <h2 style="margin:0 0 16px">Nouvel avis à modérer</h2>
      <p style="margin:0 0 8px"><strong>Lieu :</strong> ${escapeHtml(lieuName || review.lieu_slug)}</p>
      <p style="margin:0 0 8px"><strong>Note :</strong> ${stars} (${review.rating}/5)</p>
      ${review.pseudo ? `<p style="margin:0 0 8px"><strong>Pseudo :</strong> ${escapeHtml(review.pseudo)}</p>` : '<p style="margin:0 0 8px"><strong>Pseudo :</strong> <em>anonyme</em></p>'}
      <div style="margin:16px 0;padding:12px;background:#f4f4f5;border-radius:8px;white-space:pre-wrap">${escapeHtml(review.comment)}</div>
      <p style="margin:24px 0 0">
        <a href="${adminUrl}" style="display:inline-block;background:#111;color:#fff;padding:10px 16px;border-radius:6px;text-decoration:none">
          Modérer →
        </a>
      </p>
      <p style="margin-top:24px;color:#71717a;font-size:12px">Reçu le ${new Date(review.created_at).toLocaleString('fr-FR')}</p>
    </div>
  `;

  try {
    await c.emails.send({ from, to, subject, html });
  } catch (e) {
    console.error('[reviews] notifyAdminNewReview failed', e);
  }
}
