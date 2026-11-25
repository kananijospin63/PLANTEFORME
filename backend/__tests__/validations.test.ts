// ============================================================
// Tests — Validations Zod
// ============================================================

import { inscriptionSchema } from '@/lib/validations'

const VALID_INPUT = {
  nom: 'Dupont',
  prenom: 'Jean',
  dateNaissance: '1990-05-15',
  email: 'jean.dupont@example.com',
  telephone: '+257 77 123456',
  fonction: 'Entrepreneur',
  entreprise: 'ACME SARL',
  niveauIA: 'DEBUTANT' as const,
  formationSlug: 'maitriser-chatgpt-gemini-claude',
  motivation:
    'Je souhaite apprendre a utiliser l IA pour mon activite professionnelle.',
}

describe('inscriptionSchema', () => {
  // ── Cas de succès ──────────────────────────────────────────

  it('valide une inscription correcte', () => {
    const result = inscriptionSchema.safeParse(VALID_INPUT)
    expect(result.success).toBe(true)
  })

  it('accepte une inscription sans entreprise', () => {
    const input = { ...VALID_INPUT, entreprise: undefined }
    const result = inscriptionSchema.safeParse(input)
    expect(result.success).toBe(true)
  })

  it('normalise l\'email en minuscules', () => {
    const input = { ...VALID_INPUT, email: 'JEAN.DUPONT@EXAMPLE.COM' }
    const result = inscriptionSchema.safeParse(input)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.email).toBe('jean.dupont@example.com')
    }
  })

  // ── Champs obligatoires ────────────────────────────────────

  it('rejette si le nom est absent', () => {
    const input = { ...VALID_INPUT, nom: '' }
    const result = inscriptionSchema.safeParse(input)
    expect(result.success).toBe(false)
    if (!result.success) {
      const nomError = result.error.issues.find((i) => i.path[0] === 'nom')
      expect(nomError).toBeDefined()
    }
  })

  // ── Email ──────────────────────────────────────────────────

  it('rejette un email invalide', () => {
    const input = { ...VALID_INPUT, email: 'pas-un-email' }
    const result = inscriptionSchema.safeParse(input)
    expect(result.success).toBe(false)
    if (!result.success) {
      const emailError = result.error.issues.find((i) => i.path[0] === 'email')
      expect(emailError?.message).toContain('email valide')
    }
  })

  it('rejette un email vide', () => {
    const input = { ...VALID_INPUT, email: '' }
    const result = inscriptionSchema.safeParse(input)
    expect(result.success).toBe(false)
  })

  // ── Date de naissance ──────────────────────────────────────

  it('rejette un participant de moins de 18 ans', () => {
    const today = new Date()
    const tooYoung = `${today.getFullYear() - 10}-01-01`
    const input = { ...VALID_INPUT, dateNaissance: tooYoung }
    const result = inscriptionSchema.safeParse(input)
    expect(result.success).toBe(false)
    if (!result.success) {
      const err = result.error.issues.find((i) => i.path[0] === 'dateNaissance')
      expect(err?.message).toContain('18 ans')
    }
  })

  it('rejette un participant né en fin d’année qui n’a pas encore 18 ans', () => {
    // Né un 31 décembre : le contrôle doit porter sur le jour, pas sur l'année.
    const today = new Date()
    const endOfYear = `${today.getFullYear() - 17}-12-31`
    const input = { ...VALID_INPUT, dateNaissance: endOfYear }
    const result = inscriptionSchema.safeParse(input)
    expect(result.success).toBe(false)
  })

  it('accepte un participant qui vient d’avoir 18 ans', () => {
    const today = new Date()
    const limite = new Date(
      today.getFullYear() - 18,
      today.getMonth(),
      today.getDate()
    )
    const justAdult = limite.toISOString().slice(0, 10)
    const input = { ...VALID_INPUT, dateNaissance: justAdult }
    const result = inscriptionSchema.safeParse(input)
    expect(result.success).toBe(true)
  })

  it('rejette une date dans le futur', () => {
    const input = { ...VALID_INPUT, dateNaissance: '2099-01-01' }
    const result = inscriptionSchema.safeParse(input)
    expect(result.success).toBe(false)
  })

  it('rejette une date au format incorrect', () => {
    const input = { ...VALID_INPUT, dateNaissance: '15/05/1990' }
    const result = inscriptionSchema.safeParse(input)
    expect(result.success).toBe(false)
  })

  // ── Niveau IA ──────────────────────────────────────────────

  it('accepte les niveaux valides', () => {
    for (const niveau of ['DEBUTANT', 'INTERMEDIAIRE', 'AVANCE'] as const) {
      const input = { ...VALID_INPUT, niveauIA: niveau }
      const result = inscriptionSchema.safeParse(input)
      expect(result.success).toBe(true)
    }
  })

  it('rejette un niveau invalide', () => {
    const input = { ...VALID_INPUT, niveauIA: 'EXPERT' as never }
    const result = inscriptionSchema.safeParse(input)
    expect(result.success).toBe(false)
  })

  // ── Motivation ─────────────────────────────────────────────

  it('rejette une motivation trop courte', () => {
    const input = { ...VALID_INPUT, motivation: 'Court.' }
    const result = inscriptionSchema.safeParse(input)
    expect(result.success).toBe(false)
    if (!result.success) {
      const err = result.error.issues.find((i) => i.path[0] === 'motivation')
      expect(err?.message).toContain('20 caractères')
    }
  })

  it('rejette une motivation vide', () => {
    const input = { ...VALID_INPUT, motivation: '' }
    const result = inscriptionSchema.safeParse(input)
    expect(result.success).toBe(false)
  })

  // ── Formation ──────────────────────────────────────────────

  it('rejette si aucune formation sélectionnée', () => {
    const input = { ...VALID_INPUT, formationSlug: '' }
    const result = inscriptionSchema.safeParse(input)
    expect(result.success).toBe(false)
  })
})
