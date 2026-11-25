// ============================================================
// Tests — Service des formations
// ============================================================
// Ces tests utilisent un mock de Prisma pour ne pas
// nécessiter une vraie connexion PostgreSQL.
// ============================================================

// Mock du client Prisma
jest.mock('@/lib/prisma', () => ({
  prisma: {
    formation: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
  },
}))

import { prisma } from '@/lib/prisma'
import {
  getAllFormations,
  getFormationBySlug,
  serializeFormation,
  FormationNotFoundError,
} from '@/services/formation.service'
import type { Formation } from '@prisma/client'

const mockFormation: Formation = {
  id: 'cuid-formation-001',
  slug: 'maitriser-chatgpt-gemini-claude',
  titre: 'MAITRISER CHATGPT, GEMINI & CLAUDE',
  description: 'Utilisez l IA pour travailler plus vite.',
  objectif: 'Objectif de la formation.',
  modules: [{ id: 'mod-1', titre: 'Prompting' }],
  projetFinal: 'Projet final concret.',
  date: '05 OCTOBRE 2026',
  heureDebut: '14H00',
  heureFin: '17H00',
  lieu: { nom: 'Centre CEPRODILUC', adresse: 'Centre-ville', ville: 'Bujumbura', pays: 'Burundi' },
  prix: 150000,
  prixAffiche: '150 000 FBU',
  formateur: 'CLUB AI',
  statut: 'ACTIVE',
  createdAt: new Date('2025-01-01T00:00:00Z'),
  updatedAt: new Date('2025-01-01T00:00:00Z'),
}

describe('serializeFormation', () => {
  it('convertit correctement un objet Formation Prisma', () => {
    const result = serializeFormation(mockFormation)
    expect(result.id).toBe(mockFormation.id)
    expect(result.slug).toBe(mockFormation.slug)
    expect(result.createdAt).toBe('2025-01-01T00:00:00.000Z')
    expect(result.updatedAt).toBe('2025-01-01T00:00:00.000Z')
    expect(typeof result.modules).toBe('object')
    expect(typeof result.lieu).toBe('object')
  })
})

describe('getAllFormations', () => {
  it('retourne la liste des formations actives', async () => {
    (prisma.formation.findMany as jest.Mock).mockResolvedValue([mockFormation])

    const result = await getAllFormations()

    expect(Array.isArray(result)).toBe(true)
    expect(result).toHaveLength(1)
    expect(result[0].slug).toBe('maitriser-chatgpt-gemini-claude')
  })

  it('retourne un tableau vide s\'il n\'y a aucune formation', async () => {
    (prisma.formation.findMany as jest.Mock).mockResolvedValue([])

    const result = await getAllFormations()
    expect(result).toHaveLength(0)
  })
})

describe('getFormationBySlug', () => {
  it('retourne la formation correspondante', async () => {
    (prisma.formation.findUnique as jest.Mock).mockResolvedValue(mockFormation)

    const result = await getFormationBySlug('maitriser-chatgpt-gemini-claude')
    expect(result).not.toBeNull()
    expect(result?.slug).toBe('maitriser-chatgpt-gemini-claude')
  })

  it('retourne null si la formation n\'existe pas', async () => {
    (prisma.formation.findUnique as jest.Mock).mockResolvedValue(null)

    const result = await getFormationBySlug('formation-inexistante')
    expect(result).toBeNull()
  })
})

describe('FormationNotFoundError', () => {
  it('est une instance de Error', () => {
    const err = new FormationNotFoundError('test-slug')
    expect(err).toBeInstanceOf(Error)
    expect(err.name).toBe('FormationNotFoundError')
    expect(err.message).toContain('test-slug')
  })
})
