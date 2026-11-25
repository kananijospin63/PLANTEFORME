// ============================================================
// GET /api/formations/[slug] — Retourne une formation par slug
// ============================================================

import { NextResponse } from 'next/server'
import { getFormationBySlug } from '@/services/formation.service'
import { ok, notFound, badRequest, serverError } from '@/lib/responses'
import { logger } from '@/lib/logger'

interface RouteParams {
  params: { slug: string }
}

export const dynamic = 'force-dynamic'

export async function GET(
  _request: Request,
  { params }: RouteParams
): Promise<NextResponse> {
  const { slug } = params

  // Validation basique du slug
  if (!slug || typeof slug !== 'string' || slug.length > 100) {
    return badRequest('Le slug fourni est invalide.')
  }

  try {
    const formation = await getFormationBySlug(slug)

    if (!formation) {
      return notFound(`La formation "${slug}" est introuvable.`)
    }

    return ok(formation)
  } catch (error) {
    logger.server.error(`GET /api/formations/${slug}`, error)
    return serverError()
  }
}

export async function OPTIONS(): Promise<NextResponse> {
  return new NextResponse(null, { status: 204 })
}
