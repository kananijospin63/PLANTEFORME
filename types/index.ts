// ============================================================
// CLUB AI — Types TypeScript centralisés
// ============================================================

// ------------------------------------------------------------
// FORMATIONS
// ------------------------------------------------------------

export interface SessionFormation {
  numero: number
  titre: string
  date: string
  horaire: string
  description?: string
}

export interface Formation {
  id: string
  slug: string
  titre: string
  titreCourt: string
  description: string
  objectif: string
  modules: Module[]
  sessions?: SessionFormation[]   // planning jour par jour
  projetFinal: string
  /** Version courte pour les pastilles : « 01 – 05 DÉCEMBRE 2026 » */
  date: string
  /** Phrase complète : « Du 01 au 05 décembre 2026 » */
  periode?: string
  /** « 15H30 – 19H30 » */
  horaire: string
  /** Créneau de la journée — affiché à côté de l'horaire */
  moment?: MomentFormation
  lieu: LieuFormation
  prix: string
  formateur: string
  categorie: CategorieFormation
  niveau: NiveauFormation[]
  duree: string
  places?: number
  disponible: boolean
}

export interface Module {
  id: string
  titre: string
  description?: string
}

export interface LieuFormation {
  nom: string
  adresse: string
  ville: string
  pays: string
}

export type CategorieFormation =
  | 'outils-ia'
  | 'automatisation'
  | 'entrepreneuriat'

export type NiveauFormation = 'debutant' | 'intermediaire' | 'avance'

/** Créneau horaire d'une formation */
export type MomentFormation = 'avant-midi' | 'apres-midi'

// ------------------------------------------------------------
// INSCRIPTION / FORMULAIRE
// ------------------------------------------------------------

export interface RegistrationFormData {
  // Informations personnelles
  nom: string
  prenom: string
  dateNaissance: string
  email: string
  telephone: string

  // Profil professionnel
  profession: string
  entreprise: string

  // Formation
  niveauIA: NiveauIA
  formationChoisie: string // slug de la formation

  // Motivation
  motivation: string

  // Consentement
  consentement: boolean
}

export type NiveauIA = 'debutant' | 'intermediaire' | 'avance' | ''

// Erreurs de validation du formulaire
export type FormErrors = Partial<Record<keyof RegistrationFormData, string>>

// ------------------------------------------------------------
// API — RÉPONSES
// ------------------------------------------------------------

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface RegistrationResponse {
  reference: string
  nom: string
  prenom: string
  email: string
  formation: {
    titre: string
    date: string
    horaire: string
    lieu: LieuFormation
    prix: string
  }
  /** Lien du groupe WhatsApp de la formation (fourni par le backend). */
  whatsappGroupUrl?: string
  dateInscription: string
}

export interface RegistrationRequest {
  formData: RegistrationFormData
}

// ------------------------------------------------------------
// NAVIGATION
// ------------------------------------------------------------

export interface NavItem {
  label: string
  href: string
  active?: boolean
}

// ------------------------------------------------------------
// UI — COMPOSANTS
// ------------------------------------------------------------

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'gold'
export type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps {
  variant?: ButtonVariant
  size?: ButtonSize
  disabled?: boolean
  loading?: boolean
  fullWidth?: boolean
  href?: string
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  children: React.ReactNode
  className?: string
  ariaLabel?: string
  style?: React.CSSProperties
}

// ------------------------------------------------------------
// ÉTAT APPLICATION
// ------------------------------------------------------------

export type FormStatus = 'idle' | 'loading' | 'success' | 'error'

export interface SuccessPageData {
  reference: string
  nom: string
  prenom: string
  formationTitre: string
  date: string
  horaire: string
  lieu: string
  prix: string
  /** Lien du groupe WhatsApp de la formation. */
  whatsappGroupUrl?: string
}
