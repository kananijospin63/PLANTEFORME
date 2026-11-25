// ============================================================
// POST /api/auth/login — ouvre une session administrateur
// ============================================================

import { NextResponse } from 'next/server'
import {
  authenticate,
  encodeSession,
  SESSION_COOKIE,
  SESSION_MAX_AGE,
} from '@/lib/auth'

export async function POST(request: Request) {
  let body: { email?: string; password?: string }

  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { success: false, message: 'Requête invalide.' },
      { status: 400 }
    )
  }

  const email = (body.email ?? '').trim()
  const password = body.password ?? ''

  if (!email || !password) {
    return NextResponse.json(
      { success: false, message: 'Email et mot de passe requis.' },
      { status: 400 }
    )
  }

  const user = authenticate(email, password)

  if (!user) {
    return NextResponse.json(
      { success: false, message: 'Email ou mot de passe incorrect.' },
      { status: 401 }
    )
  }

  const response = NextResponse.json({ success: true, data: user })

  response.cookies.set({
    name: SESSION_COOKIE,
    value: await encodeSession(user),
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE,
    secure: process.env.NODE_ENV === 'production',
  })

  return response
}
