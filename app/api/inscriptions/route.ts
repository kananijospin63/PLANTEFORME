// ============================================================
// POST /api/inscriptions — Crée une nouvelle inscription
// ============================================================

import { NextRequest, NextResponse } from 'next/server'
import { ZodError } from 'zod'
import { inscriptionSchema } from '@/lib/validations'
import { createInscription } from '@/lib/services/inscription.service'
import {
  FormationNotFoundError,
} from '@/lib/services/formation.service'
import { DoublonInscriptionError } from '@/lib/services/inscription.service'
import {
  created,
  badRequest,
  notFound,
  conflict,
  fromZodError,
  serverError,
} from '@/lib/responses'
import { logger } from '@/lib/logger'

export const dynamic = 'force-dynamic'

// Taille max du body : 64 Ko
const MAX_BODY_SIZE = 64 * 1024

export async function POST(request: NextRequest): Promise<NextResponse> {
  // ── 1. Vérifier Content-Type ──────────────────────────────
  const contentType = request.headers.get('content-type') ?? ''
  if (!contentType.includes('application/json')) {
    return badRequest('Le Content-Type doit être application/json.')
  }

  // ── 2. Lire le body avec limite de taille ─────────────────
  let rawBody: string
  try {
    rawBody = await request.text()
    if (Buffer.byteLength(rawBody, 'utf8') > MAX_BODY_SIZE) {
      return badRequest('La taille de la requête dépasse la limite autorisée (64 Ko).')
    }
  } catch {
    return badRequest('Impossible de lire le corps de la requête.')
  }

  // ── 3. Parser le JSON ─────────────────────────────────────
  let body: unknown
  try {
    body = JSON.parse(rawBody)
  } catch {
    return badRequest('Le corps de la requête contient un JSON invalide.')
  }

  // ── 4. Valider avec Zod ───────────────────────────────────
  let input: ReturnType<typeof inscriptionSchema.parse>
  try {
    input = inscriptionSchema.parse(body)
  } catch (error) {
    if (error instanceof ZodError) {
      logger.validation.error('POST /api/inscriptions', error.issues[0]?.message ?? '')
      return fromZodError(error)
    }
    return badRequest('Les données envoyées sont invalides.')
  }

  // ── 5. Créer l'inscription ────────────────────────────────
  try {
    const result = await createInscription(input)
    return created(result.data, result.message)
  } catch (error) {
    // Formation introuvable
    if (error instanceof FormationNotFoundError) {
      return notFound(error.message)
    }

    // Doublon
    if (error instanceof DoublonInscriptionError) {
      return conflict('Vous etes deja inscrit a cette formation.')
    }

    // Erreur serveur
    logger.server.error('POST /api/inscriptions', error)
    return serverError()
  }
}

export async function OPTIONS(): Promise<NextResponse> {
  return new NextResponse(null, { status: 204 })
}
