// ============================================================
// lib/email.ts — Module email (Nodemailer)
// ============================================================
// L'envoi réel des emails est délégué à Make (via webhook).
// Ce module est préparé pour un usage direct si nécessaire
// (ex : fallback, notifications admin, etc.)
//
// ACTIVATION : Renseigner SMTP_HOST, SMTP_USER, SMTP_PASS
//              dans .env.local pour activer l'envoi réel.
// ============================================================

import nodemailer from 'nodemailer'
import { logger } from '@/lib/logger'

// ── Configuration ────────────────────────────────────────────

function createTransporter() {
  const host = process.env.SMTP_HOST
  const port = parseInt(process.env.SMTP_PORT ?? '587', 10)
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS

  if (!host || !user || !pass) {
    return null
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
    tls: {
      rejectUnauthorized: process.env.NODE_ENV === 'production',
    },
  })
}

// ── Types ────────────────────────────────────────────────────

export interface ConfirmationEmailData {
  // Destinataire
  toEmail: string
  nom: string
  prenom: string

  // Formation
  formationTitre: string
  date: string
  heureDebut: string
  heureFin: string
  lieuNom: string
  lieuVille: string
  prix: string

  // Référence
  reference: string
}

export interface EmailResult {
  success: boolean
  messageId?: string
  error?: string
}

// ── Templates ────────────────────────────────────────────────

function buildConfirmationHtml(data: ConfirmationEmailData): string {
  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Confirmation d'inscription — CLUB AI</title>
  <style>
    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background: #FAF8F3; margin: 0; padding: 20px; color: #1A1A1A; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; border: 1px solid rgba(0,0,0,0.06); }
    .header { background: #0E5A4A; padding: 32px 40px; }
    .header-title { color: #B8962E; font-size: 10px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; margin: 0 0 8px; }
    .header h1 { color: #ffffff; font-size: 22px; font-weight: 700; margin: 0; }
    .body { padding: 32px 40px; }
    .greeting { font-size: 16px; color: #1A1A1A; margin-bottom: 16px; }
    .intro { font-size: 14px; color: #404040; line-height: 1.6; margin-bottom: 24px; }
    .card { background: #FAF8F3; border: 1px solid rgba(14,90,74,0.12); border-radius: 8px; padding: 24px; margin-bottom: 24px; }
    .card-title { font-size: 10px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(0,0,0,0.4); margin-bottom: 16px; }
    .row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid rgba(0,0,0,0.06); }
    .row:last-child { border-bottom: none; }
    .row-label { font-size: 12px; font-weight: 600; color: rgba(0,0,0,0.4); text-transform: uppercase; letter-spacing: 0.06em; }
    .row-value { font-size: 13px; font-weight: 600; color: #1A1A1A; text-align: right; }
    .reference-box { background: #0E5A4A; border-radius: 8px; padding: 16px 20px; margin-bottom: 24px; text-align: center; }
    .reference-label { font-size: 10px; color: rgba(255,255,255,0.5); font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 6px; }
    .reference-value { font-size: 20px; font-weight: 700; color: #B8962E; letter-spacing: 0.1em; font-family: monospace; }
    .note { font-size: 13px; color: #404040; line-height: 1.6; }
    .footer { background: #1A1A1A; padding: 20px 40px; text-align: center; }
    .footer p { font-size: 11px; color: rgba(255,255,255,0.3); margin: 0; }
    .footer a { color: rgba(255,255,255,0.5); text-decoration: none; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <p class="header-title">Inscription confirmée</p>
      <h1>CLUB AI</h1>
    </div>

    <div class="body">
      <p class="greeting">Bonjour ${data.prenom} ${data.nom},</p>
      <p class="intro">
        Votre inscription à la formation CLUB AI a bien été enregistrée.
        Voici le récapitulatif de votre inscription.
      </p>

      <div class="reference-box">
        <p class="reference-label">Votre référence d'inscription</p>
        <p class="reference-value">${data.reference}</p>
      </div>

      <div class="card">
        <p class="card-title">Détails de la formation</p>
        <div class="row">
          <span class="row-label">Formation</span>
          <span class="row-value">${data.formationTitre}</span>
        </div>
        <div class="row">
          <span class="row-label">Date</span>
          <span class="row-value">${data.date}</span>
        </div>
        <div class="row">
          <span class="row-label">Horaire</span>
          <span class="row-value">${data.heureDebut} – ${data.heureFin}</span>
        </div>
        <div class="row">
          <span class="row-label">Lieu</span>
          <span class="row-value">${data.lieuNom}, ${data.lieuVille}</span>
        </div>
        <div class="row">
          <span class="row-label">Prix</span>
          <span class="row-value">${data.prix}</span>
        </div>
      </div>

      <p class="note">
        Conservez cette référence pour tout suivi de votre inscription.<br />
        Pour toute question, contactez-nous sur WhatsApp :<br />
        <strong>+257 77 165741</strong> ou <strong>+257 79 49 08 06</strong>
      </p>
    </div>

    <div class="footer">
      <p>
        CLUB AI · Bujumbura, Burundi ·
        <a href="https://wa.me/25777165741">WhatsApp</a>
      </p>
    </div>
  </div>
</body>
</html>
  `.trim()
}

function buildConfirmationText(data: ConfirmationEmailData): string {
  return `
CLUB AI — Confirmation d'inscription
========================================

Bonjour ${data.prenom} ${data.nom},

Votre inscription a été enregistrée avec succès.

RÉFÉRENCE : ${data.reference}

DÉTAILS DE LA FORMATION
------------------------
Formation : ${data.formationTitre}
Date      : ${data.date}
Horaire   : ${data.heureDebut} – ${data.heureFin}
Lieu      : ${data.lieuNom}, ${data.lieuVille}
Prix      : ${data.prix}

Conservez cette référence pour tout suivi.

Contact : +257 77 165741 | +257 79 49 08 06 (WhatsApp)

CLUB AI · Bujumbura, Burundi
  `.trim()
}

// ── Envoi de l'email de confirmation ─────────────────────────

/**
 * Envoie l'email de confirmation d'inscription.
 *
 * NOTE : En production, l'email est envoyé par Make.
 * Ce module sert de fallback ou d'envoi direct si Make n'est pas utilisé.
 *
 * Si SMTP n'est pas configuré, log un avertissement et retourne success: false.
 */
export async function sendConfirmationEmail(
  data: ConfirmationEmailData
): Promise<EmailResult> {
  const transporter = createTransporter()

  if (!transporter) {
    logger.warn('SMTP non configuré — email non envoyé', {
      reference: data.reference,
    })
    return {
      success: false,
      error: 'SMTP non configuré.',
    }
  }

  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM ?? 'CLUB AI <noreply@club-ai.com>',
      to: data.toEmail,
      subject: `Confirmation d'inscription — ${data.formationTitre} | CLUB AI`,
      text: buildConfirmationText(data),
      html: buildConfirmationHtml(data),
    })

    logger.info('Email de confirmation envoyé', {
      reference: data.reference,
      messageId: info.messageId,
    })

    return { success: true, messageId: info.messageId }
  } catch (error) {
    const message =
      error instanceof Error ? error.message : String(error)
    logger.error('Échec envoi email de confirmation', {
      reference: data.reference,
      error: message,
    })
    return { success: false, error: message }
  }
}

/**
 * Vérifie si le SMTP est configuré.
 */
export function isEmailConfigured(): boolean {
  return Boolean(
    process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS
  )
}
