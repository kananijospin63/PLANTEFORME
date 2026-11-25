// ============================================================
// Middleware — protège l'espace /admin
// ============================================================
// Toute requête vers /admin/* sans session valide est renvoyée
// vers la page de connexion, avec l'URL d'origine en paramètre.
// ============================================================

import { NextResponse, type NextRequest } from 'next/server'
import { decodeSession, SESSION_COOKIE } from '@/lib/auth'

export async function middleware(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value
  const session = await decodeSession(token)

  if (!session) {
    // Conserver le chemin ET la query string d'origine
    // (ex. /admin/inscriptions?formation=slug) pour y revenir après login.
    const target = `${request.nextUrl.pathname}${request.nextUrl.search}`

    const url = request.nextUrl.clone()
    url.pathname = '/connexion'
    url.search = ''
    url.searchParams.set('next', target)

    const response = NextResponse.redirect(url)
    // Nettoie un éventuel cookie expiré
    if (token) response.cookies.delete(SESSION_COOKIE)
    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/admin'],
}
