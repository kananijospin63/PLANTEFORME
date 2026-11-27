// ============================================================
// lib/validations.ts — Schémas de validation Zod
// ============================================================
// Tous les schémas de validation de l'API sont centralisés ici.
// Les messages d'erreur sont en français, clairs, compréhensibles.
// ============================================================

import { z } from 'zod'

// ── Helpers ──────────────────────────────────────────────────

const PHONE_REGEX = /^\+?[\d\s\-().]{7,20}$/

/** Âge minimum pour suivre une formation CLUB AI. */
export const AGE_MINIMUM = 18

// ── Schéma d'inscription ─────────────────────────────────────

export const inscriptionSchema = z.object({
  nom: z
    .string({ required_error: 'Veuillez renseigner votre nom.' })
    .trim()
    .min(2, 'Le nom doit contenir au moins 2 caractères.')
    .max(100, 'Le nom ne peut pas dépasser 100 caractères.'),

  prenom: z
    .string({ required_error: 'Veuillez renseigner votre prénom.' })
    .trim()
    .min(2, 'Le prénom doit contenir au moins 2 caractères.')
    .max(100, 'Le prénom ne peut pas dépasser 100 caractères.'),

  dateNaissance: z
    .string({ required_error: 'Veuillez renseigner votre date de naissance.' })
    .regex(
      /^\d{4}-\d{2}-\d{2}$/,
      'La date de naissance doit être au format AAAA-MM-JJ.'
    )
    .refine((val) => {
      const date = new Date(`${val}T00:00:00`)
      if (Number.isNaN(date.getTime())) return false

      // Comparaison exacte (mois + jour), pas seulement l'année :
      // une personne née en décembre 2008 n'a pas 18 ans en novembre 2026.
      const today = new Date()
      const limite = new Date(
        today.getFullYear() - AGE_MINIMUM,
        today.getMonth(),
        today.getDate()
      )

      return date <= today && date <= limite
    }, `Vous devez avoir au moins ${AGE_MINIMUM} ans pour vous inscrire.`),

  email: z
    .string({ required_error: 'Veuillez renseigner votre adresse email.' })
    .trim()
    .toLowerCase()
    .email('Veuillez renseigner une adresse email valide.')
    .max(255, "L'adresse email ne peut pas dépasser 255 caractères."),

  telephone: z
    .string({ required_error: 'Veuillez renseigner votre numéro de téléphone.' })
    .trim()
    .regex(
      PHONE_REGEX,
      'Veuillez renseigner un numéro de téléphone valide (ex : +257 77 000 000).'
    )
    .max(30, 'Le numéro de téléphone est trop long.'),

  fonction: z
    .string({ required_error: 'Veuillez renseigner votre fonction ou profession.' })
    .trim()
    .min(2, 'La fonction doit contenir au moins 2 caractères.')
    .max(150, 'La fonction ne peut pas dépasser 150 caractères.'),

  entreprise: z
    .string()
    .trim()
    .max(200, "Le nom de l'entreprise ne peut pas dépasser 200 caractères.")
    .optional()
    .or(z.literal('')),

  niveauIA: z.enum(['DEBUTANT', 'INTERMEDIAIRE', 'AVANCE'], {
    required_error: "Veuillez sélectionner votre niveau en intelligence artificielle.",
    invalid_type_error:
      'Le niveau sélectionné est invalide. Choisissez parmi : DEBUTANT, INTERMEDIAIRE, AVANCE.',
  }),

  formationSlug: z
    .string({ required_error: 'Veuillez sélectionner une formation.' })
    .trim()
    .min(1, 'Veuillez sélectionner une formation.'),

  motivation: z
    .string({ required_error: 'Veuillez indiquer votre motivation.' })
    .trim()
    .min(20, 'Votre message de motivation doit contenir au moins 20 caractères.')
    .max(2000, 'Votre message de motivation ne peut pas dépasser 2000 caractères.'),
})

export type InscriptionInput = z.infer<typeof inscriptionSchema>

// ── Schéma de pagination ─────────────────────────────────────

export const paginationSchema = z.object({
  page: z
    .string()
    .optional()
    .transform((v) => (v ? Math.max(1, parseInt(v, 10)) : 1))
    .pipe(z.number().min(1)),

  limit: z
    .string()
    .optional()
    .transform((v) => {
      const n = v ? parseInt(v, 10) : 20
      return Math.min(Math.max(1, n), 100) // Entre 1 et 100
    })
    .pipe(z.number().min(1).max(100)),
})

// ── Schéma de recherche participants ─────────────────────────

export const participantsQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  search: z.string().trim().max(100).optional(),
  sort: z
    .enum(['createdAt', 'nom', 'prenom', 'email'])
    .optional()
    .default('createdAt'),
  order: z.enum(['asc', 'desc']).optional().default('desc'),
  niveauIA: z
    .enum(['DEBUTANT', 'INTERMEDIAIRE', 'AVANCE'])
    .optional(),
  formation: z.string().trim().optional(),
})

export type ParticipantsQuery = z.infer<typeof participantsQuerySchema>

// ── Schéma slug ──────────────────────────────────────────────

export const slugSchema = z
  .string()
  .trim()
  .min(1, 'Le slug est requis.')
  .regex(/^[a-z0-9-]+$/, 'Le slug contient des caractères invalides.')
