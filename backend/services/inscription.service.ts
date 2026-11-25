// ============================================================
// services/inscription.service.ts — Service des inscriptions
// ============================================================

import { prisma }                    from '@/lib/prisma'
import { generateReference }          from '@/lib/reference'
import {
  buildMakePayload,
  buildValidationPayload,
  sendRegistrationToMake,
  sendValidationToMake,
}                                     from '@/lib/make'
import { logger, maskEmail }          from '@/lib/logger'
import { getWhatsappGroup }           from '@/lib/whatsapp-groups'
import { upsertParticipant }          from '@/services/participant.service'
import {
  assertFormationExists,
  FormationNotFoundError,
}                                     from '@/services/formation.service'
import type {
  InscriptionRequest,
  InscriptionCreatedResponse,
}                                     from '@/types/api'
import type { Formation, Participant } from '@prisma/client'

// ── Erreurs métier ────────────────────────────────────────────

export class DoublonInscriptionError extends Error {
  constructor() {
    super('Vous etes deja inscrit a cette formation.')
    this.name = 'DoublonInscriptionError'
  }
}

export class InscriptionNotFoundError extends Error {
  constructor(reference: string) {
    super(`Aucune inscription ne correspond a la reference "${reference}".`)
    this.name = 'InscriptionNotFoundError'
  }
}

// ── Helpers ───────────────────────────────────────────────────

/**
 * `Formation.lieu` est une colonne Json : on normalise la forme pour
 * que le payload Make ne dépende pas du contenu réellement en base.
 */
function normalizeLieu(value: unknown): {
  nom: string; adresse: string; ville: string; pays: string
} {
  const lieu = (value ?? {}) as Partial<{
    nom: string; adresse: string; ville: string; pays: string
  }>
  return {
    nom:     lieu.nom     ?? '',
    adresse: lieu.adresse ?? '',
    ville:   lieu.ville   ?? '',
    pays:    lieu.pays    ?? '',
  }
}

// ── Logique principale ────────────────────────────────────────

/**
 * Crée une inscription complète.
 *
 * Étapes :
 *  1. Valider la formation (existe + active)
 *  2. Créer/mettre à jour le participant
 *  3. Vérifier les doublons
 *  4. Générer la référence unique
 *  5. Créer l'inscription en base
 *  6. Construire le payload Make complet
 *  7. Appeler Make (asynchrone, non bloquant)
 *  8. Retourner la réponse au frontend
 */
export async function createInscription(
  data: InscriptionRequest
): Promise<InscriptionCreatedResponse> {

  // ── 1. Vérifier la formation ──────────────────────────────
  // `assertFormationExists` lève FormationNotFoundError /
  // FormationInactiveError : on laisse remonter l'erreur métier
  // telle quelle, la route API la traduit en réponse HTTP.
  const formation: Formation = await assertFormationExists(data.formationSlug)

  // ── 2. Créer / récupérer le participant ───────────────────
  const participant: Participant = await upsertParticipant(data)

  // ── 3. Vérifier les doublons ──────────────────────────────
  const existing = await prisma.inscription.findUnique({
    where: {
      unique_participant_formation: {
        participantId: participant.id,
        formationId:   formation.id,
      },
    },
    select: { id: true, reference: true },
  })

  if (existing) {
    logger.inscription.duplicate(data.formationSlug, maskEmail(data.email))
    throw new DoublonInscriptionError()
  }

  // ── 4. Générer la référence ───────────────────────────────
  const reference = await generateReference()

  // ── 5. Créer l'inscription en base ───────────────────────
  const lieu = normalizeLieu(formation.lieu)

  const inscription = await prisma.inscription.create({
    data: {
      reference,
      motivation: data.motivation,
      statut:     'EN_ATTENTE',
      participantId: participant.id,
      formationId:   formation.id,
    },
    include: { formation: true, participant: true },
  })

  logger.inscription.created(reference, data.formationSlug, maskEmail(data.email))

  // ── 6. Construire le payload Make complet ─────────────────
  const makePayload = buildMakePayload({
    reference,
    nom:          participant.nom,
    prenom:       participant.prenom,
    email:        participant.email,
    telephone:    participant.telephone,
    fonction:     participant.fonction,
    entreprise:   participant.entreprise ?? '',
    niveauIA:     participant.niveauIA,
    formationTitre: formation.titre,
    formationSlug:  formation.slug,
    date:         formation.date,
    heureDebut:   formation.heureDebut,
    heureFin:     formation.heureFin,
    lieuNom:      lieu.nom,
    lieuVille:    lieu.ville,
    prix:         formation.prixAffiche,
    motivation:   data.motivation,
    createdAt:    inscription.createdAt.toISOString(),
  })

  // ── 7. Appel Make — asynchrone, non bloquant ─────────────
  // Si Make échoue → inscription conservée en base, erreur loggée.
  sendRegistrationToMake(makePayload)
    .then((result) => {
      if (result.success) {
        return prisma.inscription.update({
          where: { id: inscription.id },
          data: {
            makeNotified:   true,
            makeNotifiedAt: new Date(),
          },
        })
      } else {
        logger.warn('Make non notifié — inscription conservée', {
          reference,
          error: result.error,
        })
      }
    })
    .catch((err) => {
      logger.server.error('inscription.service.makeCallback', err)
    })

  // ── 8. Retourner la réponse ───────────────────────────────
  return {
    success: true,
    reference,
    message: "Votre inscription a ete enregistree avec succes. Un email de confirmation vous sera envoye.",
    data: {
      id: inscription.id,
      reference,
      formation: {
        titre:      formation.titre,
        date:       formation.date,
        heureDebut: formation.heureDebut,
        heureFin:   formation.heureFin,
        lieu,
        prixAffiche: formation.prixAffiche,
      },
      participant: {
        nom:    participant.nom,
        prenom: participant.prenom,
        email:  participant.email,
      },
      // Lien du groupe WhatsApp de la formation : permet à la page de
      // confirmation d'afficher le bouton « Rejoindre le groupe ».
      whatsappGroupUrl: getWhatsappGroup(formation.slug),
      statut:    inscription.statut,
      createdAt: inscription.createdAt.toISOString(),
    },
  }
}

// ── Validation d'une inscription ──────────────────────────────

export interface ValidationInscriptionResult {
  reference:     string
  statut:        'CONFIRMEE'
  /** true si l'inscription était déjà confirmée (aucun email renvoyé). */
  dejaConfirmee: boolean
  make: {
    success: boolean
    error?:  string
  }
}

/**
 * Confirme une inscription et déclenche le scénario Make n°2.
 *
 * Idempotent : si l'inscription est déjà CONFIRMEE, aucun second
 * email n'est envoyé — on retourne simplement le statut courant.
 * Un échec Make ne remet pas en cause la validation : le statut
 * CONFIRMEE est déjà persisté et l'admin peut réessayer plus tard.
 */
export async function validerInscription(
  reference: string
): Promise<ValidationInscriptionResult> {

  const inscription = await prisma.inscription.findUnique({
    where:   { reference },
    include: { formation: true, participant: true },
  })

  if (!inscription) {
    throw new InscriptionNotFoundError(reference)
  }

  // ── Déjà confirmée : rien à envoyer ──────────────────────
  if (inscription.statut === 'CONFIRMEE') {
    logger.info('Inscription deja confirmee — email non renvoye', { reference })
    return {
      reference,
      statut:        'CONFIRMEE',
      dejaConfirmee: true,
      make:          { success: true },
    }
  }

  // ── 1. Persister la validation ───────────────────────────
  const updated = await prisma.inscription.update({
    where: { reference },
    data:  { statut: 'CONFIRMEE' },
  })

  logger.info('Inscription confirmee', { reference })

  // ── 2. Construire le payload de confirmation ─────────────
  const { participant, formation } = inscription
  const lieu = normalizeLieu(formation.lieu)

  const payload = buildValidationPayload({
    reference,
    nom:          participant.nom,
    prenom:       participant.prenom,
    email:        participant.email,
    telephone:    participant.telephone,
    fonction:     participant.fonction,
    entreprise:   participant.entreprise ?? '',
    niveauIA:     participant.niveauIA,
    formationTitre: formation.titre,
    formationSlug:  formation.slug,
    date:         formation.date,
    heureDebut:   formation.heureDebut,
    heureFin:     formation.heureFin,
    lieuNom:      lieu.nom,
    lieuVille:    lieu.ville,
    prix:         formation.prixAffiche,
    motivation:   inscription.motivation,
    createdAt:    inscription.createdAt.toISOString(),
    confirmeeAt:  updated.updatedAt.toISOString(),
  })

  // ── 3. Envoyer à Make ────────────────────────────────────
  const make = await sendValidationToMake(payload)

  if (make.success) {
    await prisma.inscription
      .update({
        where: { reference },
        data:  { makeNotified: true, makeNotifiedAt: new Date() },
      })
      .catch((err) => {
        logger.server.error('inscription.service.makeFlag', err)
      })
  } else {
    logger.warn('Confirmation non notifiee a Make — statut conserve', {
      reference,
      error: make.error,
    })
  }

  return {
    reference,
    statut:        'CONFIRMEE',
    dejaConfirmee: false,
    make: {
      success: make.success,
      error:   make.error,
    },
  }
}
