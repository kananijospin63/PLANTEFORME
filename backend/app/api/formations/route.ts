// ============================================================
// GET /api/formations — Liste toutes les formations actives
// ============================================================

import { NextResponse } from 'next/server'
import { getAllFormations } from '@/services/formation.service'
import { ok, serverError } from '@/lib/responses'
import { logger } from '@/lib/logger'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(): Promise<NextResponse> {
  try {
    const formations = await getAllFormations()
    return ok(formations)
  } catch (error) {
    logger.server.error('GET /api/formations', error)
    return serverError()
  }
}

// Répondre aux preflight CORS
export async function OPTIONS(): Promise<NextResponse> {
  return new NextResponse(null, { status: 204 })
}
