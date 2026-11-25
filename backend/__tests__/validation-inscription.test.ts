// ============================================================
// Tests — Validation d'une inscription (scénario Make n°2)
// ============================================================

jest.mock('@/lib/prisma', () => ({
  prisma: {
    inscription: {
      findUnique: jest.fn(),
      update:     jest.fn(),
    },
  },
}))

jest.mock('@/lib/make', () => ({
  buildMakePayload:       jest.fn(() => ({ reference: 'MOCK-PAYLOAD' })),
  buildValidationPayload: jest.fn(() => ({ reference: 'MOCK-PAYLOAD' })),
  sendRegistrationToMake: jest.fn().mockResolvedValue({ success: true }),
  sendValidationToMake:   jest.fn().mockResolvedValue({ success: true }),
  sendToMake:             jest.fn().mockResolvedValue({ success: true }),
  isMakeConfigured:       jest.fn().mockReturnValue(true),
}))

jest.mock('@/lib/logger', () => ({
  logger: {
    info:  jest.fn(),
    warn:  jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
    inscription: {
      created:   jest.fn(),
      duplicate: jest.fn(),
      makeError: jest.fn(),
      makeSent:  jest.fn(),
    },
    validation: { error: jest.fn() },
    server:     { error: jest.fn() },
  },
  maskEmail: jest.fn((e: string) => e),
}))

import { prisma } from '@/lib/prisma'
import { buildValidationPayload, sendValidationToMake } from '@/lib/make'
import {
  validerInscription,
  InscriptionNotFoundError,
} from '@/services/inscription.service'

// ── Fixture ──────────────────────────────────────────────────

const REFERENCE = 'CLUBAI-2026-0001'

function makeInscription(statut: 'EN_ATTENTE' | 'CONFIRMEE' = 'EN_ATTENTE') {
  const createdAt = new Date('2026-11-20T09:00:00.000Z')
  return {
    id:         'ins-1',
    reference:  REFERENCE,
    motivation: "Je veux automatiser mon travail d'assistant.",
    statut,
    createdAt,
    updatedAt:  createdAt,
    participant: {
      id:          'part-1',
      nom:         'Dupont',
      prenom:      'Jean',
      email:       'jean.dupont@example.com',
      telephone:   '+257771234',
      fonction:    'Entrepreneur',
      entreprise:  'ACME',
      niveauIA:    'DEBUTANT',
      dateNaissance: new Date('1990-05-15'),
      createdAt,
      updatedAt:   createdAt,
    },
    formation: {
      id:           'form-1',
      slug:         'maitriser-chatgpt-gemini-claude',
      titre:        'MAÎTRISER CHATGPT, GEMINI & CLAUDE',
      date:         '01 – 05 DÉCEMBRE 2026',
      heureDebut:   '15H30',
      heureFin:     '19H30',
      lieu:         { nom: 'Centre CEPRODILUC', adresse: 'Centre-ville', ville: 'Bujumbura', pays: 'Burundi' },
      prixAffiche:  '150 000 FBU',
      statut:       'ACTIVE',
      createdAt,
      updatedAt:    createdAt,
    },
  }
}

const mockFindUnique = prisma.inscription.findUnique as jest.Mock
const mockUpdate     = prisma.inscription.update     as jest.Mock
const mockBuild      = buildValidationPayload       as jest.Mock
const mockSend       = sendValidationToMake         as jest.Mock

beforeEach(() => {
  jest.clearAllMocks()
  mockSend.mockResolvedValue({ success: true })
})

// ── Tests ────────────────────────────────────────────────────

describe('validerInscription', () => {
  it('confirme une inscription en attente et envoie le payload Make', async () => {
    const inscription = makeInscription('EN_ATTENTE')
    mockFindUnique.mockResolvedValue(inscription)
    mockUpdate.mockResolvedValue({
      ...inscription,
      statut:    'CONFIRMEE',
      updatedAt: new Date('2026-11-24T10:00:00.000Z'),
    })

    const result = await validerInscription(REFERENCE)

    expect(result.statut).toBe('CONFIRMEE')
    expect(result.dejaConfirmee).toBe(false)
    expect(result.make.success).toBe(true)

    expect(mockBuild).toHaveBeenCalledTimes(1)
    const payloadParams = mockBuild.mock.calls[0][0]
    expect(payloadParams.reference).toBe(REFERENCE)
    expect(payloadParams.formationSlug).toBe('maitriser-chatgpt-gemini-claude')
    expect(payloadParams.lieuNom).toBe('Centre CEPRODILUC')
    expect(payloadParams.entreprise).toBe('ACME')
    expect(payloadParams.confirmeeAt).toBe('2026-11-24T10:00:00.000Z')

    expect(mockSend).toHaveBeenCalledTimes(1)
  })

  it('passe le statut à CONFIRMEE en base', async () => {
    const inscription = makeInscription('EN_ATTENTE')
    mockFindUnique.mockResolvedValue(inscription)
    mockUpdate.mockResolvedValue({ ...inscription, statut: 'CONFIRMEE' })

    await validerInscription(REFERENCE)

    const firstUpdate = mockUpdate.mock.calls[0][0]
    expect(firstUpdate.where).toEqual({ reference: REFERENCE })
    expect(firstUpdate.data).toEqual({ statut: 'CONFIRMEE' })
  })

  it('est idempotent : ne renvoie pas d’email si déjà confirmée', async () => {
    mockFindUnique.mockResolvedValue(makeInscription('CONFIRMEE'))

    const result = await validerInscription(REFERENCE)

    expect(result.dejaConfirmee).toBe(true)
    expect(result.make.success).toBe(true)
    expect(mockUpdate).not.toHaveBeenCalled()
    expect(mockSend).not.toHaveBeenCalled()
  })

  it('lève InscriptionNotFoundError sur une référence inconnue', async () => {
    mockFindUnique.mockResolvedValue(null)

    await expect(validerInscription('CLUBAI-2026-9999'))
      .rejects
      .toBeInstanceOf(InscriptionNotFoundError)

    expect(mockSend).not.toHaveBeenCalled()
  })

  it('conserve la validation même si Make échoue', async () => {
    const inscription = makeInscription('EN_ATTENTE')
    mockFindUnique.mockResolvedValue(inscription)
    mockUpdate.mockResolvedValue({ ...inscription, statut: 'CONFIRMEE' })
    mockSend.mockResolvedValue({ success: false, error: 'Make HTTP 500' })

    const result = await validerInscription(REFERENCE)

    expect(result.statut).toBe('CONFIRMEE')
    expect(result.make.success).toBe(false)
    expect(result.make.error).toBe('Make HTTP 500')

    // Le statut est bien persisté malgré l'échec de l'email
    expect(mockUpdate.mock.calls[0][0].data).toEqual({ statut: 'CONFIRMEE' })
  })

  it('marque makeNotified seulement quand l’envoi réussit', async () => {
    const inscription = makeInscription('EN_ATTENTE')
    mockFindUnique.mockResolvedValue(inscription)
    mockUpdate.mockResolvedValue({ ...inscription, statut: 'CONFIRMEE' })

    await validerInscription(REFERENCE)

    const flagged = mockUpdate.mock.calls.some(
      (call) => call[0]?.data?.makeNotified === true
    )
    expect(flagged).toBe(true)
  })
})
