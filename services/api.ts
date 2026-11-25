// ============================================================
// CLUB AI — Service API frontend
// ============================================================
// Ce fichier est la SEULE interface entre le frontend et le
// backend. Toutes les communications réseau passent ici.
//
// En développement : appelle le backend réel sur port 3001.
// En production    : appelle NEXT_PUBLIC_API_URL.
// Ne jamais mettre de clés secrètes ici (Make, DB, etc.).
// ============================================================

import type {
  Formation,
  RegistrationFormData,
  RegistrationResponse,
  ApiResponse,
} from '@/types'
import {
  getAllFormations,
  getFormationBySlug,
  LIEU_COMMUN,
  DATE_COMMUNE,
  HORAIRE_COMMUN,
  PRIX_COMMUN,
} from '@/data/formations'

// ------------------------------------------------------------
// CONFIGURATION
// ------------------------------------------------------------

/**
 * Forme (partielle) de la réponse du backend sur POST /api/inscriptions.
 * Tous les champs sont optionnels : le frontend normalise ensuite.
 */
interface BackendInscriptionResponse {
  success?: boolean
  message?: string
  reference?: string
  createdAt?: string
  formation?: {
    titre?: string
    date?: string
    heureDebut?: string
    heureFin?: string
    lieu?: Formation['lieu']
    prixAffiche?: string
  }
  participant?: {
    nom?: string
    prenom?: string
    email?: string
  }
  /** Lien du groupe WhatsApp de la formation. */
  whatsappGroupUrl?: string
  data?: BackendInscriptionResponse
}

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? ''

// Mode mock uniquement si NEXT_PUBLIC_API_URL est absent
const USE_MOCK = !API_URL

// Simule un délai réseau en mode mock (ms)
const MOCK_DELAY = 800

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// Génère une référence d'inscription unique (mock uniquement)
function generateMockReference(): string {
  const year = new Date().getFullYear()
  const random = Math.floor(Math.random() * 9000) + 1000
  return `CLUBAI-${year}-${random}`
}

// Convertit le niveauIA minuscule du formulaire en majuscules (attendu par le backend)
function toNiveauIABackend(
  niveau: string
): 'DEBUTANT' | 'INTERMEDIAIRE' | 'AVANCE' {
  const map: Record<string, 'DEBUTANT' | 'INTERMEDIAIRE' | 'AVANCE'> = {
    debutant: 'DEBUTANT',
    intermediaire: 'INTERMEDIAIRE',
    avance: 'AVANCE',
  }
  return map[niveau] ?? 'DEBUTANT'
}

// ------------------------------------------------------------
// FORMATIONS
// ------------------------------------------------------------

/**
 * Récupère la liste de toutes les formations disponibles.
 *
 * Production : GET /api/formations
 */
export async function getFormations(): Promise<ApiResponse<Formation[]>> {
  // — MOCK —
  if (USE_MOCK) {
    await delay(MOCK_DELAY / 2)
    return {
      success: true,
      data: getAllFormations(),
    }
  }

  // — PRODUCTION —
  try {
    const res = await fetch(`${API_URL}/api/formations`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      next: { revalidate: 3600 }, // Cache Next.js 1h
    })

    if (!res.ok) {
      throw new Error(`Erreur serveur : ${res.status}`)
    }

    const json = await res.json()
    // Le backend renvoie { success: true, data: Formation[] }
    return { success: true, data: json.data ?? json }
  } catch (error) {
    console.error('[getFormations]', error)
    return {
      success: false,
      error: 'Impossible de charger les formations. Veuillez réessayer.',
    }
  }
}

// ------------------------------------------------------------

/**
 * Récupère une formation par son slug.
 *
 * Production : GET /api/formations/:slug
 */
export async function getFormationBySlugAPI(
  slug: string
): Promise<ApiResponse<Formation>> {
  // — MOCK —
  if (USE_MOCK) {
    await delay(MOCK_DELAY / 2)
    const formation = getFormationBySlug(slug)

    if (!formation) {
      return {
        success: false,
        error: 'Formation introuvable.',
      }
    }

    return { success: true, data: formation }
  }

  // — PRODUCTION —
  try {
    const res = await fetch(`${API_URL}/api/formations/${slug}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      next: { revalidate: 3600 },
    })

    if (res.status === 404) {
      return { success: false, error: 'Formation introuvable.' }
    }

    if (!res.ok) {
      throw new Error(`Erreur serveur : ${res.status}`)
    }

    const json = await res.json()
    return { success: true, data: json.data ?? json }
  } catch (error) {
    console.error('[getFormationBySlug]', error)
    return {
      success: false,
      error: 'Impossible de charger la formation. Veuillez réessayer.',
    }
  }
}

// ------------------------------------------------------------
// INSCRIPTION
// ------------------------------------------------------------

/**
 * Soumet le formulaire d'inscription.
 *
 * Flux :
 * Frontend → POST /api/inscriptions
 *          → Backend enregistre en DB
 *          → Backend déclenche webhook Make (asynchrone)
 *          → Make envoie email de confirmation via Gemini + Gmail
 *
 * Production : POST /api/inscriptions
 */
export async function submitRegistration(
  formData: RegistrationFormData
): Promise<ApiResponse<RegistrationResponse>> {
  // — MOCK —
  if (USE_MOCK) {
    await delay(MOCK_DELAY)

    // Simule une erreur réseau rare (1% de chance) pour tester la gestion d'erreur
    if (Math.random() < 0.01) {
      return {
        success: false,
        error:
          'Une erreur temporaire est survenue. Veuillez réessayer dans quelques instants.',
      }
    }

    const formation = getFormationBySlug(formData.formationChoisie)

    return {
      success: true,
      data: {
        reference: generateMockReference(),
        nom: formData.nom,
        prenom: formData.prenom,
        email: formData.email,
        formation: {
          titre: formation?.titre ?? formData.formationChoisie,
          date: formation?.date ?? DATE_COMMUNE,
          horaire: formation?.horaire ?? HORAIRE_COMMUN,
          lieu: formation?.lieu ?? LIEU_COMMUN,
          prix: formation?.prix ?? PRIX_COMMUN,
        },
        dateInscription: new Date().toISOString(),
      },
      message:
        'Votre inscription a été enregistrée avec succès. Un email de confirmation vous sera envoyé.',
    }
  }

  // — PRODUCTION —
  // Mapper les champs du formulaire vers le format attendu par le backend
  const payload = {
    nom:           formData.nom.trim(),
    prenom:        formData.prenom.trim(),
    dateNaissance: formData.dateNaissance,
    email:         formData.email.trim().toLowerCase(),
    telephone:     formData.telephone.trim(),
    fonction:      formData.profession.trim(),   // profession → fonction
    entreprise:    formData.entreprise.trim() || undefined,
    niveauIA:      toNiveauIABackend(formData.niveauIA), // minuscule → MAJUSCULE
    formationSlug: formData.formationChoisie,    // formationChoisie → formationSlug
    motivation:    formData.motivation.trim(),
  }

  try {
    const res = await fetch(`${API_URL}/api/inscriptions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    // Le serveur peut répondre autre chose que du JSON (502 HTML, proxy…).
    // On isole le parsing pour renvoyer un message exploitable.
    let json: BackendInscriptionResponse | null = null
    try {
      json = (await res.json()) as BackendInscriptionResponse
    } catch {
      json = null
    }

    if (!res.ok) {
      return {
        success: false,
        error:
          json?.message ??
          `Une erreur est survenue lors de votre inscription (code ${res.status}). Veuillez réessayer.`,
      }
    }

    if (!json) {
      return {
        success: false,
        error: 'La réponse du serveur est illisible. Veuillez réessayer.',
      }
    }

    // Normaliser la réponse backend vers le type RegistrationResponse du frontend
    // Backend renvoie : { success, message, data: { id, reference, formation, participant, statut, createdAt } }
    const backendData = json.data ?? json

    // Sans référence, la page de confirmation n'a rien à afficher :
    // mieux vaut une erreur explicite qu'un écran « undefined ».
    if (!backendData?.reference) {
      return {
        success: false,
        error:
          "L'inscription a été transmise mais la confirmation est incomplète. Contactez-nous sur WhatsApp pour vérifier votre place.",
      }
    }

    const formation = getFormationBySlug(formData.formationChoisie)

    const normalizedResponse: RegistrationResponse = {
      reference:      backendData.reference,
      nom:            backendData.participant?.nom   ?? formData.nom,
      prenom:         backendData.participant?.prenom ?? formData.prenom,
      email:          backendData.participant?.email  ?? formData.email,
      formation: {
        titre:   backendData.formation?.titre   ?? formation?.titre   ?? formData.formationChoisie,
        date:    backendData.formation?.date    ?? formation?.date    ?? DATE_COMMUNE,
        // Le backend renvoie heureDebut/heureFin séparément ; reconstruire le horaire affiché
        horaire: backendData.formation?.heureDebut && backendData.formation?.heureFin
          ? `${backendData.formation.heureDebut} – ${backendData.formation.heureFin}`
          : (formation?.horaire ?? HORAIRE_COMMUN),
        lieu:    backendData.formation?.lieu    ?? formation?.lieu    ?? LIEU_COMMUN,
        prix:    backendData.formation?.prixAffiche ?? formation?.prix ?? PRIX_COMMUN,
      },
      whatsappGroupUrl: backendData.whatsappGroupUrl,
      dateInscription: backendData.createdAt ?? new Date().toISOString(),
    }

    return {
      success: true,
      data:    normalizedResponse,
      message: json.message,
    }
  } catch (error) {
    console.error('[submitRegistration]', error)
    return {
      success: false,
      error:
        'La connexion au serveur a échoué. Vérifiez votre connexion internet et réessayez.',
    }
  }
}

// ------------------------------------------------------------
// ADMIN — VALIDATION D'UNE INSCRIPTION
// ------------------------------------------------------------

/** Réponse du backend sur POST /api/inscriptions/[reference]/valider */
export interface ValidationInscriptionResponse {
  reference:     string
  statut:        string
  dejaConfirmee: boolean
  make: {
    success: boolean
    error?:  string
  }
}

/**
 * Confirme une inscription et déclenche l'email de confirmation
 * (scénario Make n°2).
 *
 * L'appel est idempotent : revalider une inscription déjà confirmée
 * ne renvoie pas de second email.
 *
 * Production : POST /api/inscriptions/[reference]/valider
 */
export async function validerInscription(
  reference: string
): Promise<ApiResponse<ValidationInscriptionResponse>> {
  const ref = reference.trim().toUpperCase()

  if (!/^CLUBAI-\d{4}-\d{4}$/.test(ref)) {
    return {
      success: false,
      error: `La référence "${reference}" est invalide.`,
    }
  }

  // — MOCK —
  // Aucun backend joignable : on simule la validation pour que la
  // démonstration de l'admin reste utilisable.
  if (USE_MOCK) {
    await delay(400)
    return {
      success: true,
      data: {
        reference:     ref,
        statut:        'CONFIRMEE',
        dejaConfirmee: false,
        make:          { success: true },
      },
      message: 'Inscription confirmée (mode démonstration, aucun email envoyé).',
    }
  }

  // — PRODUCTION —
  try {
    const res = await fetch(
      `${API_URL}/api/inscriptions/${encodeURIComponent(ref)}/valider`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' } }
    )

    let json: {
      success?: boolean
      message?: string
      data?: ValidationInscriptionResponse
    } | null = null

    try {
      json = await res.json()
    } catch {
      json = null
    }

    if (!res.ok) {
      return {
        success: false,
        error:
          json?.message ??
          `La validation a échoué (code ${res.status}). Veuillez réessayer.`,
      }
    }

    if (!json?.data) {
      return {
        success: false,
        error: 'La réponse du serveur est incomplète. Veuillez réessayer.',
      }
    }

    return {
      success: true,
      data:    json.data,
      message: json.message,
    }
  } catch (error) {
    console.error('[validerInscription]', error)
    return {
      success: false,
      error:
        'La connexion au serveur a échoué. Vérifiez votre connexion internet et réessayez.',
    }
  }
}
