// ============================================================
// lib/make.ts — Intégration Make Webhook (version complète)
// ============================================================
// FLUX :
//   Backend (POST /api/inscriptions)
//     → createInscription()
//       → sendRegistrationToMake()  ← non bloquant
//         → Make Webhook
//           → Google Sheets (enregistrement)
//           → Gemini AI (message personnalisé)
//           → Gmail (email HTML)
//           → Participant (confirmation)
//
// SÉCURITÉ : MAKE_WEBHOOK_URL lu depuis .env uniquement.
// RÉSILIENCE : échec Make ≠ perte d'inscription.
// ============================================================

import { logger } from '@/lib/logger'
import { WHATSAPP_GROUPS, getWhatsappGroup } from '@/lib/whatsapp-groups'

// ── Types ─────────────────────────────────────────────────────

/** Payload complet envoyé à Make */
export interface MakeRegistrationPayload {
  // ── Métadonnées ──
  source:          string   // 'club-ai-backend'
  version:         string   // '2.0'
  event:           string   // 'INSCRIPTION_CREATED'
  timestamp:       string   // ISO 8601

  // ── Inscription ──
  reference:       string   // 'CLUBAI-2026-0001'
  statut:          string   // 'EN_ATTENTE'
  motivation:      string
  createdAt:       string   // ISO 8601

  // ── Participant ──
  nom:             string
  prenom:          string
  email:           string
  telephone:       string
  fonction:        string
  entreprise:      string
  niveauIA:        string   // 'DEBUTANT' | 'INTERMEDIAIRE' | 'AVANCE'
  niveauIALabel:   string   // 'Débutant' | 'Intermédiaire' | 'Avancé'

  // ── Formation ──
  formation: {
    titre:         string
    slug:          string
    date:          string
    heure:         string   // '14H00 – 17H00'
    heureDebut:    string   // '14H00'
    heureFin:      string   // '17H00'
    lieu:          string   // 'Centre CEPRODILUC, Bujumbura'
    lieuNom:       string
    lieuVille:     string
    prix:          string   // '150 000 FBU'
  }

  // ── WhatsApp ──
  whatsappGroupUrl: string  // lien du groupe WhatsApp de la formation

  // ── Google Sheets ──
  sheets: {
    reference:       string
    dateInscription: string
    nom:             string
    prenom:          string
    email:           string
    telephone:       string
    fonction:        string
    entreprise:      string
    niveauIA:        string
    formation:       string
    dateFormation:   string
    heure:           string
    lieu:            string
    prix:            string
    motivation:      string
    statut:          string
  }

  // ── Gemini AI prompt ──
  gemini: {
    prompt:   string
    prenom:   string
    formation: string
    niveauIA:  string
    motivation: string
  }

  // ── Réseaux sociaux ──
  socials: {
    facebook:  string
    instagram: string
    tiktok:    string
    youtube:   string
    linkedin:  string
  }

  // ── Contact CLUB AI ──
  contact: {
    email:      string
    whatsapp1:  string
    whatsapp2:  string
    site:       string
  }
}

/**
 * Payload du scénario 2 — confirmation après validation admin.
 *
 * Même structure que le payload d'inscription pour que les templates
 * email puissent réutiliser les mêmes variables, avec en plus
 * `confirmeeAt` et un statut CONFIRMEE à écrire dans Google Sheets.
 */
export interface MakeValidationPayload {
  source:      string   // 'club-ai-backend'
  version:     string   // '2.0'
  event:       string   // 'INSCRIPTION_VALIDEE'
  timestamp:   string   // ISO 8601

  reference:   string   // 'CLUBAI-2026-0001'
  statut:      string   // 'CONFIRMEE'
  confirmeeAt: string   // ISO 8601

  nom:             string
  prenom:          string
  email:           string
  telephone:       string
  fonction:        string
  entreprise:      string
  niveauIA:        string
  niveauIALabel:   string
  motivation:      string

  formation: {
    titre:      string
    slug:       string
    date:       string
    heure:      string
    heureDebut: string
    heureFin:   string
    lieu:       string
    lieuNom:    string
    lieuVille:  string
    prix:       string
  }

  whatsappGroupUrl: string

  /** Colonnes à mettre à jour dans la ligne Google Sheets existante. */
  sheets: {
    reference:       string
    statut:          string
    dateConfirmation: string
  }

  gemini: {
    prompt:    string
    prenom:    string
    formation: string
    niveauIA:  string
    motivation: string
  }

  socials: Record<string, string>

  contact: {
    email:     string
    whatsapp1: string
    whatsapp2: string
    site:      string
  }
}

export interface MakeResult {
  success:  boolean
  error?:   string
  httpStatus?: number
}

// ── Configuration ─────────────────────────────────────────────

/** Scénario 1 — accusé de réception, déclenché à la création de l'inscription. */
const MAKE_WEBHOOK_URL            = process.env.MAKE_WEBHOOK_URL            ?? ''
/** Scénario 2 — confirmation, déclenché quand l'admin valide l'inscription. */
const MAKE_WEBHOOK_VALIDATION_URL = process.env.MAKE_WEBHOOK_VALIDATION_URL ?? ''
const MAKE_TIMEOUT_MS   = 12000 // 12 secondes

// ── Labels niveau IA ─────────────────────────────────────────

const NIVEAU_LABELS: Record<string, string> = {
  DEBUTANT:      'Débutant',
  INTERMEDIAIRE: 'Intermédiaire',
  AVANCE:        'Avancé',
}

// ── Prompt Gemini optimisé ────────────────────────────────────

function buildGeminiPrompt(
  prenom:     string,
  formation:  string,
  niveauIA:   string,
  motivation: string
): string {
  return `Tu es un conseiller bienveillant et enthousiaste de CLUB AI, une école de formation en intelligence artificielle basée à Bujumbura, au Burundi.

Tu dois rédiger un message de confirmation d'inscription personnalisé pour ${prenom}.

Informations sur le participant :
- Prénom : ${prenom}
- Formation choisie : ${formation}
- Niveau en IA : ${niveauIA}
- Motivation : "${motivation}"

Instructions importantes :
1. Le message doit être chaleureux, humain et sincèrement motivant.
2. Mentionne le prénom de la personne dès le début.
3. Fais référence à sa motivation pour montrer que tu l'as lue.
4. Encourage-la en tenant compte de son niveau (débutant = rassure, avancé = challenge).
5. Parle de la formation de façon concrète et enthousiaste.
6. Termine avec une phrase d'encouragement forte et positive.
7. Le ton doit être professionnel mais jamais froid ni robotique.
8. Maximum 4 paragraphes courts.
9. Ne commence jamais par "Cher(e)" — commence directement par le prénom.
10. Ne mentionne jamais que tu es une IA.

Rédige uniquement le message, sans titre ni signature.`
}

// ── Réseaux sociaux CLUB AI ────────────────────────────────

const CLUBAI_SOCIALS = {
  facebook:  'https://www.facebook.com/jovim.code',
  instagram: 'https://www.instagram.com/jovimcode?utm_source=qr',
  tiktok:    'https://www.tiktok.com/@jovimcode?is_from_webapp=1&sender_device=pc',
  youtube:   'https://www.youtube.com/@JovimCode',
  linkedin:  '', // à renseigner si nécessaire
}

// ── Contacts CLUB AI ───────────────────────────────────────

const CLUBAI_CONTACT = {
  email:     'clubai@gmail.com',
  whatsapp1: '+257 77 165741',
  whatsapp2: '+257 79 49 08 06',
  site:      process.env.NEXT_PUBLIC_APP_URL ?? 'https://club-ai.com',
}

// ── Construction du payload complet ──────────────────────────

/** Champs communs aux deux scénarios (inscription et confirmation). */
export interface MakeCommonParams {
  reference:    string
  nom:          string
  prenom:       string
  email:        string
  telephone:    string
  fonction:     string
  entreprise:   string
  niveauIA:     string
  formationTitre: string
  formationSlug:  string
  date:         string
  heureDebut:   string
  heureFin:     string
  lieuNom:      string
  lieuVille:    string
  prix:         string
  motivation:   string
  createdAt:    string
}

export function buildMakePayload(params: MakeCommonParams): MakeRegistrationPayload {
  const niveauIALabel = NIVEAU_LABELS[params.niveauIA] ?? params.niveauIA
  const lieuFull      = `${params.lieuNom}, ${params.lieuVille}`
  const heureFull     = `${params.heureDebut} – ${params.heureFin}`
  const whatsappUrl   = getWhatsappGroup(params.formationSlug)

  return {
    // Métadonnées
    source:    'club-ai-backend',
    version:   '2.0',
    event:     'INSCRIPTION_CREATED',
    timestamp: new Date().toISOString(),

    // Inscription
    reference:  params.reference,
    statut:     'EN_ATTENTE',
    motivation: params.motivation,
    createdAt:  params.createdAt,

    // Participant
    nom:           params.nom,
    prenom:        params.prenom,
    email:         params.email,
    telephone:     params.telephone,
    fonction:      params.fonction,
    entreprise:    params.entreprise,
    niveauIA:      params.niveauIA,
    niveauIALabel: niveauIALabel,

    // Formation
    formation: {
      titre:      params.formationTitre,
      slug:       params.formationSlug,
      date:       params.date,
      heure:      heureFull,
      heureDebut: params.heureDebut,
      heureFin:   params.heureFin,
      lieu:       lieuFull,
      lieuNom:    params.lieuNom,
      lieuVille:  params.lieuVille,
      prix:       params.prix,
    },

    // WhatsApp groupe
    whatsappGroupUrl: whatsappUrl,

    // Google Sheets — colonnes prêtes à l'emploi
    sheets: {
      reference:       params.reference,
      dateInscription: new Date(params.createdAt).toLocaleDateString('fr-FR'),
      nom:             params.nom,
      prenom:          params.prenom,
      email:           params.email,
      telephone:       params.telephone,
      fonction:        params.fonction,
      entreprise:      params.entreprise,
      niveauIA:        niveauIALabel,
      formation:       params.formationTitre,
      dateFormation:   params.date,
      heure:           heureFull,
      lieu:            lieuFull,
      prix:            params.prix,
      motivation:      params.motivation,
      statut:          'EN ATTENTE',
    },

    // Gemini AI
    gemini: {
      prompt:    buildGeminiPrompt(params.prenom, params.formationTitre, niveauIALabel, params.motivation),
      prenom:    params.prenom,
      formation: params.formationTitre,
      niveauIA:  niveauIALabel,
      motivation: params.motivation,
    },

    // Réseaux sociaux
    socials: CLUBAI_SOCIALS,

    // Contact
    contact: CLUBAI_CONTACT,
  }
}

// ── Prompt Gemini — message de confirmation ──────────────────

function buildGeminiConfirmationPrompt(params: {
  prenom:      string
  formation:   string
  niveauIA:    string
  motivation:  string
  date:        string
  heure:       string
  lieu:        string
}): string {
  return `Tu es un conseiller bienveillant de CLUB AI, une école de formation en intelligence artificielle basée à Bujumbura, au Burundi.

Tu dois rédiger le message de CONFIRMATION DÉFINITIVE de l'inscription de ${params.prenom}. Sa place est désormais réservée : l'émotion doit être celle d'une bonne nouvelle, pas d'un simple accusé de réception.

Informations :
- Prénom : ${params.prenom}
- Formation : ${params.formation}
- Niveau en IA : ${params.niveauIA}
- Motivation exprimée : "${params.motivation}"
- Début de la formation : ${params.date}
- Horaire : ${params.heure}
- Lieu : ${params.lieu}

Instructions :
1. Commence directement par le prénom, jamais par "Cher(e)".
2. Confirme clairement que la place est réservée.
3. Rappelle la date, l'horaire et le lieu, sans les inventer.
4. Fais un clin d'œil à sa motivation pour montrer que tu l'as lue.
5. Termine par une phrase d'encouragement courte et concrète.
6. Ton professionnel, chaleureux, jamais robotique.
7. Maximum 3 paragraphes courts.
8. Ne mentionne jamais que tu es une IA. N'invente aucun tarif ni aucune information absente ci-dessus.

Rédige uniquement le message, sans titre ni signature.`
}

// ── Construction du payload de confirmation ──────────────────

/**
 * Construit le payload du scénario 2 (validation admin).
 *
 * Le statut passé est toujours CONFIRMEE : c'est la validation
 * qui déclenche cet envoi, jamais autre chose.
 */
export function buildValidationPayload(
  params: MakeCommonParams & { confirmeeAt: string }
): MakeValidationPayload {
  const niveauIALabel = NIVEAU_LABELS[params.niveauIA] ?? params.niveauIA
  const lieuFull      = `${params.lieuNom}, ${params.lieuVille}`
  const heureFull     = `${params.heureDebut} – ${params.heureFin}`
  const whatsappUrl   = getWhatsappGroup(params.formationSlug)

  return {
    source:      'club-ai-backend',
    version:     '2.0',
    event:       'INSCRIPTION_VALIDEE',
    timestamp:   new Date().toISOString(),

    reference:   params.reference,
    statut:      'CONFIRMEE',
    confirmeeAt: params.confirmeeAt,

    nom:           params.nom,
    prenom:        params.prenom,
    email:         params.email,
    telephone:     params.telephone,
    fonction:      params.fonction,
    entreprise:    params.entreprise,
    niveauIA:      params.niveauIA,
    niveauIALabel: niveauIALabel,
    motivation:    params.motivation,

    formation: {
      titre:      params.formationTitre,
      slug:       params.formationSlug,
      date:       params.date,
      heure:      heureFull,
      heureDebut: params.heureDebut,
      heureFin:   params.heureFin,
      lieu:       lieuFull,
      lieuNom:    params.lieuNom,
      lieuVille:  params.lieuVille,
      prix:       params.prix,
    },

    whatsappGroupUrl: whatsappUrl,

    sheets: {
      reference:        params.reference,
      statut:           'CONFIRMEE',
      dateConfirmation: new Date(params.confirmeeAt).toLocaleDateString('fr-FR'),
    },

    gemini: {
      prompt: buildGeminiConfirmationPrompt({
        prenom:     params.prenom,
        formation:  params.formationTitre,
        niveauIA:   niveauIALabel,
        motivation: params.motivation,
        date:       params.date,
        heure:      heureFull,
        lieu:       lieuFull,
      }),
      prenom:     params.prenom,
      formation:  params.formationTitre,
      niveauIA:   niveauIALabel,
      motivation: params.motivation,
    },

    socials: CLUBAI_SOCIALS,
    contact: CLUBAI_CONTACT,
  }
}

// ── Envoi générique ──────────────────────────────────────────

/**
 * POST vers un webhook Make, avec timeout et sans jamais lever
 * d'exception : un échec Make ne doit pas casser le flux métier.
 */
async function postToMake(
  url:       string,
  payload:   unknown,
  reference: string,
  envName:   string,
  source:    string
): Promise<MakeResult> {
  if (!url) {
    logger.debug(`Webhook Make non configuré (${envName}) — envoi ignoré`, {
      reference,
    })
    return { success: false, error: `${envName} non configuré dans .env` }
  }

  let timeoutId: ReturnType<typeof setTimeout> | null = null

  try {
    const controller = new AbortController()
    timeoutId = setTimeout(() => controller.abort(), MAKE_TIMEOUT_MS)

    const response = await fetch(url, {
      method:  'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent':   'club-ai-Backend/2.0',
        'X-Source':     source,
      },
      body:   JSON.stringify(payload),
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      const errorText = await response.text().catch(() => '')
      logger.inscription.makeError(
        reference,
        `HTTP ${response.status} — ${errorText.slice(0, 200)}`
      )
      return { success: false, error: `Make HTTP ${response.status}`, httpStatus: response.status }
    }

    logger.inscription.makeSent(reference)
    return { success: true }

  } catch (err) {
    if (timeoutId) clearTimeout(timeoutId)

    const isTimeout = err instanceof Error && err.name === 'AbortError'
    const message   = isTimeout
      ? `Timeout Make webhook (${MAKE_TIMEOUT_MS / 1000}s)`
      : err instanceof Error ? err.message : String(err)

    logger.inscription.makeError(reference, message)
    return { success: false, error: message }
  }
}

// ── Fonction principale ───────────────────────────────────────

/**
 * Envoie le payload complet au Webhook Make.
 *
 * IMPORTANT :
 * - Ne lance JAMAIS d'exception.
 * - L'inscription en base reste intacte même si Make échoue.
 * - Toute erreur est loggée sans exposer les données sensibles.
 */
export async function sendRegistrationToMake(
  payload: MakeRegistrationPayload
): Promise<MakeResult> {
  return postToMake(
    MAKE_WEBHOOK_URL,
    payload,
    payload.reference,
    'MAKE_WEBHOOK_URL',
    'CLUBAI-inscription'
  )
}

/**
 * Envoie le payload de confirmation au scénario Make n°2.
 *
 * Appelée uniquement après validation par un administrateur.
 * Comme pour l'inscription, un échec Make ne remet pas en cause
 * la validation : le statut CONFIRMEE est déjà en base.
 */
export async function sendValidationToMake(
  payload: MakeValidationPayload
): Promise<MakeResult> {
  return postToMake(
    MAKE_WEBHOOK_VALIDATION_URL,
    payload,
    payload.reference,
    'MAKE_WEBHOOK_VALIDATION_URL',
    'CLUBAI-validation'
  )
}

// ── Alias rétro-compatible ────────────────────────────────────
// Conservé pour ne pas casser le code existant
export type MakePayload = MakeRegistrationPayload

export async function sendToMake(payload: Partial<MakeRegistrationPayload> & {
  reference: string
  nom: string; prenom: string; email: string; telephone: string
  fonction: string; niveauIA: string
  formationTitre: string; formationSlug: string
  date: string; heureDebut: string; heureFin: string
  lieuNom: string; lieuVille: string; prix: string
  dateInscription: string
}): Promise<MakeResult> {
  const full = buildMakePayload({
    reference:    payload.reference,
    nom:          payload.nom,
    prenom:       payload.prenom,
    email:        payload.email,
    telephone:    payload.telephone,
    fonction:     payload.fonction,
    entreprise:   '',
    niveauIA:     payload.niveauIA,
    formationTitre: payload.formationTitre,
    formationSlug:  payload.formationSlug,
    date:         payload.date,
    heureDebut:   payload.heureDebut,
    heureFin:     payload.heureFin,
    lieuNom:      payload.lieuNom,
    lieuVille:    payload.lieuVille,
    prix:         payload.prix,
    motivation:   '',
    createdAt:    payload.dateInscription,
  })
  return sendRegistrationToMake(full)
}

export function isMakeConfigured(): boolean {
  return Boolean(MAKE_WEBHOOK_URL)
}

/** Le scénario de confirmation est-il configuré ? */
export function isValidationConfigured(): boolean {
  return Boolean(MAKE_WEBHOOK_VALIDATION_URL)
}
