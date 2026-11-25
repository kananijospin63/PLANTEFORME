// ============================================================
// Tests — Générateur de référence
// ============================================================
// Format officiel : CLUBAI-AAAA-XXXX (ex. CLUBAI-2026-0001)
// ============================================================

import { isValidReference, getYearFromReference } from '@/lib/reference'

describe('isValidReference', () => {
  it('valide une référence correcte', () => {
    expect(isValidReference('CLUBAI-2026-0001')).toBe(true)
    expect(isValidReference('CLUBAI-2026-9999')).toBe(true)
    expect(isValidReference('CLUBAI-2025-0001')).toBe(true)
  })

  it('rejette une référence incorrecte', () => {
    expect(isValidReference('CLUBAI-2026-001')).toBe(false)   // 3 chiffres
    expect(isValidReference('clubai-2026-0001')).toBe(false)  // minuscules
    expect(isValidReference('CLUBAI2026-0001')).toBe(false)   // pas de tiret
    expect(isValidReference('CLUB AI-2026-0001')).toBe(false) // espace interdit
    expect(isValidReference('')).toBe(false)
    expect(isValidReference('ABC-2026-0001')).toBe(false)     // mauvais préfixe
  })
})

describe('getYearFromReference', () => {
  it('extrait correctement l\'année', () => {
    expect(getYearFromReference('CLUBAI-2026-0001')).toBe(2026)
    expect(getYearFromReference('CLUBAI-2025-0042')).toBe(2025)
  })

  it('retourne null pour une référence invalide', () => {
    expect(getYearFromReference('invalid')).toBeNull()
    expect(getYearFromReference('')).toBeNull()
  })
})
