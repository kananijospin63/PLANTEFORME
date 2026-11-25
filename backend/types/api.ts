// ============================================================
// types/api.ts — Types des réponses et requêtes API
// ============================================================

// ── Réponses API génériques ──────────────────────────────────

export interface ApiSuccessResponse<T = unknown> {
  success: true
  data?: T
  message?: string
}

export interface ApiErrorResponse {
  success: false
  message: string
  errors?: Record<string, string[]>
  code?: string
}

export type ApiResponse<T = unknown> =
  | ApiSuccessResponse<T>
  | ApiErrorResponse

// ── Pagination ───────────────────────────────────────────────

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export interface PaginatedResponse<T> {
  success: true
  data: T[]
  pagination: PaginationMeta
}

// ── Formations ───────────────────────────────────────────────

export interface FormationModule {
  id: string
  titre: string
  description?: string
}

export interface FormationLieu {
  nom: string
  adresse: string
  ville: string
  pays: string
}

export interface FormationResponse {
  id: string
  slug: string
  titre: string
  description: string
  objectif: string
  modules: FormationModule[]
  projetFinal: string
  date: string
  heureDebut: string
  heureFin: string
  lieu: FormationLieu
  prix: number
  prixAffiche: string
  formateur: string
  statut: string
  createdAt: string
  updatedAt: string
}

// ── Inscriptions ─────────────────────────────────────────────

export interface InscriptionRequest {
  nom: string
  prenom: string
  dateNaissance: string
  email: string
  telephone: string
  fonction: string
  entreprise?: string
  niveauIA: 'DEBUTANT' | 'INTERMEDIAIRE' | 'AVANCE'
  formationSlug: string
  motivation: string
}

export interface InscriptionCreatedResponse {
  success: true
  reference: string
  message: string
  data: {
    id: string
    reference: string
    formation: {
      titre: string
      date: string
      heureDebut: string
      heureFin: string
      lieu: FormationLieu
      prixAffiche: string
    }
    participant: {
      nom: string
      prenom: string
      email: string
    }
    /** Lien d'invitation du groupe WhatsApp de la formation. */
    whatsappGroupUrl: string
    statut: string
    createdAt: string
  }
}

// ── Participants ─────────────────────────────────────────────

export interface ParticipantResponse {
  id: string
  nom: string
  prenom: string
  email: string
  telephone: string
  fonction: string
  entreprise: string | null
  niveauIA: string
  createdAt: string
  updatedAt: string
  _count?: {
    inscriptions: number
  }
}

export interface ParticipantWithInscriptions extends ParticipantResponse {
  inscriptions: {
    id: string
    reference: string
    statut: string
    createdAt: string
    formation: {
      titre: string
      slug: string
    }
  }[]
}
