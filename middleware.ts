/**
 * Middleware Next.js — protège les routes /admin avec Basic Auth.
 * (le middleware tourne sur Edge runtime → ne peut pas importer 'crypto' Node.
 *  On fait une comparaison simple de strings ; pas idéal contre les attaques timing
 *  mais largement suffisant pour un panneau d'admin solo avec un mot de passe long.)
 */

import { NextRequest, NextResponse } from 'next/server';

export const config = {
  matcher: ['/admin/:path*'],
};

export function middleware(req: NextRequest) {
  const expectedUser = process.env.ADMIN_USER || 'admin';
  const expectedPass = process.env.ADMIN_PASSWORD;

  // Pas de mot de passe configuré → on bloque tout
  if (!expectedPass) {
    return new NextResponse('Admin not configured (set ADMIN_PASSWORD)', {
      status: 503,
    });
  }

  const auth = req.headers.get('authorization');
  if (!auth || !auth.toLowerCase().startsWith('basic ')) {
    return unauthorized();
  }

  let decoded = '';
  try {
    decoded = atob(auth.slice(6).trim());
  } catch {
    return unauthorized();
  }

  const idx = decoded.indexOf(':');
  if (idx === -1) return unauthorized();

  const user = decoded.slice(0, idx);
  const pass = decoded.slice(idx + 1);

  if (user !== expectedUser || pass !== expectedPass) {
    return unauthorized();
  }

  return NextResponse.next();
}

function unauthorized() {
  return new NextResponse('Authentification requise', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="FG People Admin"',
    },
  });
}
