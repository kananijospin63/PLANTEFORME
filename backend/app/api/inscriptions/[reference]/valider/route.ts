// ============================================================
// POST /api/inscriptions/[reference]/valider
// ============================================================
// Confirme une inscription après contrôle par un administrateur
// et déclenche le scénario Make n°2 (email de confirmation).
//
// Idempotent : un second appel sur une inscription déjà confirmée
// ne renvoie pas d'email, il retourne le statut courant.
// ============================================================

import { NextRequest, NextResponse } from 'next/server'
import {
  validerInscription,
  InscriptionNotFoundError,
} from '@/services/inscription.service'
import { isValidReference } from '@/lib/reference'
import { ok, badRequest, notFound, serverError } from '@/lib/responses'
import { logger } from '@/lib/logger'

export const dynamic = 'force-dynamic'

export async function POST(
  _request: NextRequest,
  { params }: { params: { reference: string } }
): Promise<NextResponse> {

  // ── 1. Valider le format de la référence ──────────────────
  const reference = (params.reference ?? '').trim().toUpperCase()

  if (!isValidReference(reference)) {
    return badRequest(`La reference "${reference}" est invalide.`)
  }

  // ── 2. Confirmer l'inscription ────────────────────────────
  try {
    const result = await validerInscription(reference)

    let message: string
    if (result.dejaConfirmee) {
      message = 'Cette inscription est deja confirmee.'
    } else if (result.make.success) {
      message = 'Inscription confirmee. Un email de confirmation a ete envoye au participant.'
    } else {
      message = "Inscription confirmee, mais l'email de confirmation n'a pas pu etre envoye."
    }

    return ok(result, message)

  } catch (error) {
    if (error instanceof InscriptionNotFoundError) {
      return notFound(error.message)
    }

    logger.server.error('POST /api/inscriptions/[reference]/valider', error)
    return serverError()
  }
}

export async function OPTIONS(): Promise<NextResponse> {
  return new NextResponse(null, { status: 204 })
}
