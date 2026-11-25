// ============================================================
// POST /api/webhooks/make — Webhook de retour depuis Make
// ============================================================
// Make peut appeler cette route pour notifier le backend
// que l'email a bien été envoyé, ou pour mettre à jour
// le statut d'une inscription.
//
// Cette route est optionnelle et préparée pour le futur.
// Elle valide l'authenticité avec WEBHOOK_SECRET.
// ============================================================

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { ok, badRequest, serverError } from '@/lib/responses'
import { logger } from '@/lib/logger'
import { isValidReference } from '@/lib/reference'

export const dynamic = 'force-dynamic'

// ── Schéma du payload Make ────────────────────────────────────

const makeWebhookSchema = z.object({
  reference: z.string().min(1),
  event: z.enum(['EMAIL_SENT', 'EMAIL_FAILED', 'INSCRIPTION_CONFIRMEE']),
  timestamp: z.string().optional(),
})

// ── Vérification du secret ────────────────────────────────────

function verifySecret(request: NextRequest): boolean {
  const secret = process.env.WEBHOOK_SECRET
  if (!secret) return true // Pas de secret configuré = pas de vérification

  const headerSecret = request.headers.get('x-webhook-secret')
  return headerSecret === secret
}

// ── Handler ───────────────────────────────────────────────────

export async function POST(request: NextRequest): Promise<NextResponse> {
  // Vérification du secret
  if (!verifySecret(request)) {
    logger.warn('Webhook Make — Secret invalide', {
      ip: request.headers.get('x-forwarded-for') ?? 'unknown',
    })
    return badRequest('Accès non autorisé.')
  }

  // Lire le body
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return badRequest('JSON invalide.')
  }

  // Valider le payload
  const parsed = makeWebhookSchema.safeParse(body)
  if (!parsed.success) {
    return badRequest('Le payload du webhook est invalide.')
  }

  const { reference, event } = parsed.data

  // Valider le format de la référence
  if (!isValidReference(reference)) {
    return badRequest(`La référence "${reference}" est invalide.`)
  }

  try {
    // Trouver l'inscription
    const inscription = await prisma.inscription.findUnique({
      where: { reference },
      select: { id: true, statut: true },
    })

    if (!inscription) {
      return badRequest(`Inscription "${reference}" introuvable.`)
    }

    // Traiter l'événement
    switch (event) {
      case 'EMAIL_SENT':
        logger.info('Make — Email envoyé confirmé', { reference })
        await prisma.inscription.update({
          where: { reference },
          data: {
            makeNotified: true,
            makeNotifiedAt: new Date(),
          },
        })
        break

      case 'INSCRIPTION_CONFIRMEE':
        logger.info('Make — Inscription confirmée', { reference })
        await prisma.inscription.update({
          where: { reference },
          data: { statut: 'CONFIRMEE' },
        })
        break

      case 'EMAIL_FAILED':
        logger.warn('Make — Échec envoi email', { reference })
        break
    }

    return ok({ reference, event }, 'Webhook traité avec succès.')
  } catch (error) {
    logger.server.error('POST /api/webhooks/make', error)
    return serverError()
  }
}

export async function OPTIONS(): Promise<NextResponse> {
  return new NextResponse(null, { status: 204 })
}
