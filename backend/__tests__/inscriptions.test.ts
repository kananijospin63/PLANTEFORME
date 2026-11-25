// ============================================================
// Tests — Service des inscriptions
// ============================================================

jest.mock('@/lib/prisma', () => ({
  prisma: {
    inscription: {
      count: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    participant: {
      upsert: jest.fn(),
    },
    formation: {
      findUnique: jest.fn(),
    },
  },
}))

jest.mock('@/lib/make', () => ({
  buildMakePayload: jest.fn(() => ({ reference: 'MOCK-PAYLOAD' })),
  buildValidationPayload: jest.fn(() => ({ reference: 'MOCK-PAYLOAD' })),
  sendRegistrationToMake: jest.fn().mockResolvedValue({ success: true }),
  sendValidationToMake: jest.fn().mockResolvedValue({ success: true }),
  sendToMake: jest.fn().mockResolvedValue({ success: true }),
  isMakeConfigured: jest.fn().mockReturnValue(false),
}))

jest.mock('@/lib/logger', () => ({
  logger: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
    inscription: {
      created: jest.fn(),
      duplicate: jest.fn(),
      makeError: jest.fn(),
      makeSent: jest.fn(),
    },
    validation: { error: jest.fn() },
    server: { error: jest.fn() },
  },
  maskEmail: jest.fn((e: string) => e),
}))

import { prisma } from '@/lib/prisma'
import { createInscription, DoublonInscriptionError } from '@/services/inscription.service'
import { FormationNotFoundError } from '@/services/formation.service'
import type { InscriptionRequest } from '@/types/api'

const VALID_INPUT: InscriptionRequest = {
  nom: 'Dupont',
  prenom: 'Jean',
  dateNaissance: '1990-05-15',
  email: 'jean.dupont@example.com',
  telephone: '+257771234',
  fonction: 'Entrepreneur',
  entreprise: 'ACME',
  niveauIA: 'DEBUTANT',
  formationSlug: 'maitriser-chatgpt-gemini-claude',
  motivation: 'Je veux apprendre l IA pour mon activite professionnelle.',
}

const MOCK_FORMATION = {
  id: 'formation-id-001',
  slug: 'maitriser-chatgpt-gemini-claude',
  titre: 'MAITRISER CHATGPT, GEMINI & CLAUDE',
  statut: 'ACTIVE',
  date: '05 OCTOBRE 2026',
  heureDebut: '14H00',
  heureFin: '17H00',
  lieu: { nom: 'Centre CEPRODILUC', adresse: 'Centre-ville', ville: 'Bujumbura', pays: 'Burundi' },
  prix: 150000,
  prixAffiche: '150 000 FBU',
  formateur: 'CLUB AI',
}

const MOCK_PARTICIPANT = {
  id: 'participant-id-001',
  nom: 'Dupont',
  prenom: 'Jean',
  email: 'jean.dupont@example.com',
  telephone: '+257771234',
  fonction: 'Entrepreneur',
  entreprise: 'ACME',
  niveauIA: 'DEBUTANT',
  dateNaissance: new Date('1990-05-15'),
  createdAt: new Date(),
  updatedAt: new Date(),
}

const MOCK_INSCRIPTION = {
  id: 'inscription-id-001',
  reference: 'CLUBAI-2026-0001',
  statut: 'EN_ATTENTE',
  motivation: VALID_INPUT.motivation,
  participantId: MOCK_PARTICIPANT.id,
  formationId: MOCK_FORMATION.id,
  makeNotified: false,
  makeNotifiedAt: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  formation: MOCK_FORMATION,
  participant: MOCK_PARTICIPANT,
}

describe('createInscription', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('crée une inscription avec succès', async () => {
    // Formation existe
    ;(prisma.formation.findUnique as jest.Mock).mockResolvedValue(MOCK_FORMATION)
    // Participant upsert
    ;(prisma.participant.upsert as jest.Mock).mockResolvedValue(MOCK_PARTICIPANT)
    // Pas de doublon
    ;(prisma.inscription.findUnique as jest.Mock).mockResolvedValue(null)
    // Count pour référence
    ;(prisma.inscription.count as jest.Mock).mockResolvedValue(0)
    // Vérification référence unique
    const findUniqueMock = prisma.inscription.findUnique as jest.Mock
    findUniqueMock
      .mockResolvedValueOnce(null) // pas de doublon participant/formation
      .mockResolvedValueOnce(null) // référence disponible
    // Création
    ;(prisma.inscription.create as jest.Mock).mockResolvedValue(MOCK_INSCRIPTION)
    ;(prisma.inscription.update as jest.Mock).mockResolvedValue(MOCK_INSCRIPTION)

    const result = await createInscription(VALID_INPUT)

    expect(result.success).toBe(true)
    // La référence est générée dynamiquement : CLUBAI-<année>-0001
    expect(result.reference).toMatch(/^CLUBAI-\d{4}-0001$/)
    expect(result.data.participant.email).toBe(VALID_INPUT.email)
  })

  it('lève FormationNotFoundError si la formation n\'existe pas', async () => {
    ;(prisma.formation.findUnique as jest.Mock).mockResolvedValue(null)

    await expect(createInscription(VALID_INPUT)).rejects.toThrow(
      FormationNotFoundError
    )
  })

  it('lève DoublonInscriptionError en cas de doublon', async () => {
    ;(prisma.formation.findUnique as jest.Mock).mockResolvedValue(MOCK_FORMATION)
    ;(prisma.participant.upsert as jest.Mock).mockResolvedValue(MOCK_PARTICIPANT)
    // Doublon trouvé
    ;(prisma.inscription.findUnique as jest.Mock).mockResolvedValue({
      id: 'existing-id',
      reference: 'CLUBAI-2026-0001',
    })

    await expect(createInscription(VALID_INPUT)).rejects.toThrow(
      DoublonInscriptionError
    )
  })
})

describe('DoublonInscriptionError', () => {
  it('est une instance de Error', () => {
    const err = new DoublonInscriptionError()
    expect(err).toBeInstanceOf(Error)
    expect(err.name).toBe('DoublonInscriptionError')
  })
})
