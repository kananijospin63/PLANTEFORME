// ============================================================
// services/formation.service.ts — Service des formations
// ============================================================

import { prisma } from '@/lib/prisma'
import type { Formation } from '@prisma/client'
import type {
  FormationResponse,
  FormationModule,
  FormationLieu,
} from '@/lib/types/api'

// ── Helpers de sérialisation ──────────────────────────────────

/**
 * Les colonnes Json de Prisma sont typées `JsonValue` : on les
 * normalise explicitement vers les types de l'API pour éviter les
 * casts directs (TS2352) et garantir une forme stable côté client.
 */
function toModules(value: unknown): FormationModule[] {
  return Array.isArray(value) ? (value as FormationModule[]) : []
}

function toLieu(value: unknown): FormationLieu {
  const lieu = (value ?? {}) as Partial<FormationLieu>
  return {
    nom: lieu.nom ?? '',
    adresse: lieu.adresse ?? '',
    ville: lieu.ville ?? '',
    pays: lieu.pays ?? '',
  }
}

/**
 * Sérialise un objet Formation Prisma en FormationResponse API.
 * Convertit les dates en ISO strings et normalise les JSON fields.
 */
export function serializeFormation(f: Formation): FormationResponse {
  return {
    id: f.id,
    slug: f.slug,
    titre: f.titre,
    description: f.description,
    objectif: f.objectif,
    modules: toModules(f.modules),
    projetFinal: f.projetFinal,
    date: f.date,
    heureDebut: f.heureDebut,
    heureFin: f.heureFin,
    lieu: toLieu(f.lieu),
    prix: f.prix,
    prixAffiche: f.prixAffiche,
    formateur: f.formateur,
    statut: f.statut,
    createdAt: f.createdAt.toISOString(),
    updatedAt: f.updatedAt.toISOString(),
  }
}

// ── Requêtes ─────────────────────────────────────────────────

/**
 * Retourne toutes les formations actives.
 */
export async function getAllFormations(): Promise<FormationResponse[]> {
  const formations = await prisma.formation.findMany({
    where: { statut: 'ACTIVE' },
    orderBy: { createdAt: 'asc' },
  })
  return formations.map(serializeFormation)
}

/**
 * Retourne une formation par son slug.
 * Retourne null si non trouvée.
 */
export async function getFormationBySlug(
  slug: string
): Promise<FormationResponse | null> {
  const formation = await prisma.formation.findUnique({
    where: { slug },
  })
  if (!formation) return null
  return serializeFormation(formation)
}

/**
 * Retourne une formation raw Prisma par son slug.
 * Utile pour les opérations internes (sans sérialisation).
 */
export async function getFormationRawBySlug(
  slug: string
): Promise<Formation | null> {
  return prisma.formation.findUnique({ where: { slug } })
}

/**
 * Vérifie qu'une formation existe et est active.
 */
export async function assertFormationExists(
  slug: string
): Promise<Formation> {
  const formation = await prisma.formation.findUnique({
    where: { slug },
  })

  if (!formation) {
    throw new FormationNotFoundError(slug)
  }

  if (formation.statut !== 'ACTIVE') {
    throw new FormationInactiveError(slug)
  }

  return formation
}

// ── Erreurs métier ────────────────────────────────────────────

export class FormationNotFoundError extends Error {
  constructor(slug: string) {
    super(`La formation "${slug}" est introuvable.`)
    this.name = 'FormationNotFoundError'
  }
}

export class FormationInactiveError extends Error {
  constructor(slug: string) {
    super(`La formation "${slug}" n'est plus disponible.`)
    this.name = 'FormationInactiveError'
  }
}
