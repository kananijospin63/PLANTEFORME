// ============================================================
// services/participant.service.ts — Service des participants
// ============================================================

import { prisma } from '@/lib/prisma'
import type { Participant, NiveauIA } from '@prisma/client'
import type {
  InscriptionRequest,
  ParticipantResponse,
  PaginationMeta,
} from '@/lib/types/api'

// ── Sérialisation ─────────────────────────────────────────────

export function serializeParticipant(
  p: Participant & { _count?: { inscriptions: number } }
): ParticipantResponse {
  return {
    id: p.id,
    nom: p.nom,
    prenom: p.prenom,
    // Email masqué dans la réponse publique (RGPD / bonne pratique)
    email: p.email,
    telephone: p.telephone,
    fonction: p.fonction,
    entreprise: p.entreprise,
    niveauIA: p.niveauIA,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
    ...(p._count && { _count: p._count }),
  }
}

// ── Requêtes ─────────────────────────────────────────────────

/**
 * Récupère ou crée un participant à partir de son email.
 * Si le participant existe, ses données sont mises à jour.
 */
export async function upsertParticipant(
  data: InscriptionRequest
): Promise<Participant> {
  const niveauIA = data.niveauIA as NiveauIA
  // Le formulaire peut envoyer une chaîne vide : on stocke NULL en base
  // plutôt qu'une valeur vide (contrainte d'intégrité + affichage).
  const entreprise = data.entreprise?.trim() ? data.entreprise.trim() : null
  const dateNaissance = new Date(data.dateNaissance)

  return prisma.participant.upsert({
    where: { email: data.email },
    update: {
      nom: data.nom,
      prenom: data.prenom,
      dateNaissance,
      telephone: data.telephone,
      fonction: data.fonction,
      entreprise,
      niveauIA,
    },
    create: {
      nom: data.nom,
      prenom: data.prenom,
      dateNaissance,
      email: data.email,
      telephone: data.telephone,
      fonction: data.fonction,
      entreprise,
      niveauIA,
    },
  })
}

/**
 * Liste les participants avec pagination, recherche et filtres.
 */
export async function listParticipants(params: {
  page?: number
  limit?: number
  search?: string
  sort?: string
  order?: 'asc' | 'desc'
  niveauIA?: string
  formation?: string
}): Promise<{ data: ParticipantResponse[]; pagination: PaginationMeta }> {
  const page = Math.max(1, params.page ?? 1)
  const limit = Math.min(100, Math.max(1, params.limit ?? 20))
  const skip = (page - 1) * limit

  // Construire le where dynamiquement
  const where: Record<string, unknown> = {}

  // Recherche full-text sur nom, prénom, email, fonction
  if (params.search) {
    const term = params.search
    where.OR = [
      { nom: { contains: term, mode: 'insensitive' } },
      { prenom: { contains: term, mode: 'insensitive' } },
      { email: { contains: term, mode: 'insensitive' } },
      { fonction: { contains: term, mode: 'insensitive' } },
    ]
  }

  // Filtre niveauIA
  if (params.niveauIA) {
    where.niveauIA = params.niveauIA
  }

  // Filtre par formation (slug)
  if (params.formation) {
    where.inscriptions = {
      some: {
        formation: { slug: params.formation },
      },
    }
  }

  // Tri
  const validSorts: Record<string, unknown> = {
    createdAt: { createdAt: params.order ?? 'desc' },
    nom: { nom: params.order ?? 'asc' },
    prenom: { prenom: params.order ?? 'asc' },
    email: { email: params.order ?? 'asc' },
  }
  const orderBy = validSorts[params.sort ?? 'createdAt'] ?? {
    createdAt: 'desc',
  }

  const [total, participants] = await Promise.all([
    prisma.participant.count({ where }),
    prisma.participant.findMany({
      where,
      skip,
      take: limit,
      orderBy: orderBy as Record<string, 'asc' | 'desc'>,
      include: {
        _count: { select: { inscriptions: true } },
      },
    }),
  ])

  const totalPages = Math.ceil(total / limit)

  return {
    data: participants.map(serializeParticipant),
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  }
}
