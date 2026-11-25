// ============================================================
// lib/responses.ts — Helpers de réponses API uniformes
// ============================================================
// Toutes les réponses de l'API utilisent ce format :
// { success: true/false, data?: ..., message?: ..., errors?: ... }
// ============================================================

import { NextResponse } from 'next/server'

// ── Types ────────────────────────────────────────────────────

interface SuccessResponse<T = unknown> {
  success: true
  data?: T
  message?: string
}

interface ErrorResponse {
  success: false
  message: string
  errors?: Record<string, string[]>
  code?: string
}

// ── Réponses de succès ───────────────────────────────────────

export function ok<T>(data?: T, message?: string): NextResponse<SuccessResponse<T>> {
  return NextResponse.json(
    { success: true, ...(data !== undefined && { data }), ...(message && { message }) },
    { status: 200 }
  )
}

export function created<T>(data?: T, message?: string): NextResponse<SuccessResponse<T>> {
  return NextResponse.json(
    { success: true, ...(data !== undefined && { data }), ...(message && { message }) },
    { status: 201 }
  )
}

// ── Réponses d'erreur ────────────────────────────────────────

export function badRequest(
  message: string,
  errors?: Record<string, string[]>
): NextResponse<ErrorResponse> {
  return NextResponse.json(
    { success: false, message, ...(errors && { errors }) },
    { status: 400 }
  )
}

export function notFound(message = 'Ressource introuvable.'): NextResponse<ErrorResponse> {
  return NextResponse.json(
    { success: false, message },
    { status: 404 }
  )
}

export function conflict(message: string): NextResponse<ErrorResponse> {
  return NextResponse.json(
    { success: false, message, code: 'CONFLICT' },
    { status: 409 }
  )
}

export function unprocessable(
  message: string,
  errors?: Record<string, string[]>
): NextResponse<ErrorResponse> {
  return NextResponse.json(
    { success: false, message, ...(errors && { errors }) },
    { status: 422 }
  )
}

export function serverError(
  message = 'Une erreur interne est survenue. Veuillez réessayer.'
): NextResponse<ErrorResponse> {
  return NextResponse.json(
    { success: false, message },
    { status: 500 }
  )
}

// ── Helper Zod ───────────────────────────────────────────────

import { ZodError } from 'zod'

/**
 * Convertit une ZodError en format d'erreur uniforme.
 */
export function fromZodError(error: ZodError): NextResponse<ErrorResponse> {
  const errors: Record<string, string[]> = {}

  for (const issue of error.issues) {
    const path = issue.path.join('.')
    if (!errors[path]) errors[path] = []
    errors[path].push(issue.message)
  }

  // Message principal = premier message d'erreur
  const firstMessage = error.issues[0]?.message ?? 'Les données envoyées sont invalides.'

  return unprocessable(firstMessage, errors)
}
