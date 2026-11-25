// ============================================================
// GET /api/participants — Liste les participants (paginée)
// ============================================================

import { NextRequest, NextResponse } from 'next/server'
import { ZodError } from 'zod'
import { participantsQuerySchema } from '@/lib/validations'
import { listParticipants } from '@/services/participant.service'
import { ok, fromZodError, serverError } from '@/lib/responses'
import { logger } from '@/lib/logger'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest): Promise<NextResponse> {
  // ── Extraire les query params ─────────────────────────────
  const { searchParams } = request.nextUrl
  const rawQuery = Object.fromEntries(searchParams.entries())

  // ── Valider les query params ──────────────────────────────
  let query: ReturnType<typeof participantsQuerySchema.parse>
  try {
    query = participantsQuerySchema.parse(rawQuery)
  } catch (error) {
    if (error instanceof ZodError) {
      return fromZodError(error)
    }
    return serverError()
  }

  // ── Récupérer les participants ────────────────────────────
  try {
    const page = query.page ? parseInt(query.page, 10) : 1
    const limit = query.limit ? parseInt(query.limit, 10) : 20

    const result = await listParticipants({
      page,
      limit,
      search: query.search,
      sort: query.sort,
      order: query.order,
      niveauIA: query.niveauIA,
      formation: query.formation,
    })

    return NextResponse.json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    })
  } catch (error) {
    logger.server.error('GET /api/participants', error)
    return serverError()
  }
}

export async function OPTIONS(): Promise<NextResponse> {
  return new NextResponse(null, { status: 204 })
}
