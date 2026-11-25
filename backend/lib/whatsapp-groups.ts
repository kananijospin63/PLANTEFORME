// ============================================================
// lib/whatsapp-groups.ts — Groupes WhatsApp par formation
// ============================================================
// Remplacer les placeholders par les vrais liens d'invitation
// une fois les groupes créés sur WhatsApp.
//
// Format : https://chat.whatsapp.com/XXXXXXXXXXXXXXXXXXXX
// ============================================================

/**
 * Configuration centralisée des groupes WhatsApp.
 * Clé = slug de la formation (identique à la DB).
 */
export const WHATSAPP_GROUPS: Record<string, string> = {
  // Formation 1 — ChatGPT, Gemini & Claude
  'maitriser-chatgpt-gemini-claude':
    process.env.WHATSAPP_GROUP_CHATGPT ??
    'https://chat.whatsapp.com/BgwYG0nijyYHGLDh6ZYWCo?s=cl&p=a&mlu=4&ilr=4',

  // Formation 2 — Automatisation n8n & Make
  'automatiser-son-travail-n8n-make':
    process.env.WHATSAPP_GROUP_N8N ??
    'https://chat.whatsapp.com/IS86oPrMPQO78xboIl5Ej6?s=cl&p=a&mlu=4&ilr=4',

  // Formation 3 — IA pour Entrepreneurs & Professionnels
  'ia-pour-entrepreneurs-professionnels':
    process.env.WHATSAPP_GROUP_ENTREPRENEURS ??
    'https://chat.whatsapp.com/JgnYOHnca94Gs5qWM2UFaH?s=cl&p=a&mlu=4&ilr=4',

  // Formation 4 — Développement d'applications web avec l'IA
  'dev-applications-web-ia':
    process.env.WHATSAPP_GROUP_DEV ??
    'https://chat.whatsapp.com/BgwYG0nijyYHGLDh6ZYWCo?s=cl&p=a&mlu=4&ilr=4',
}

/**
 * Retourne le lien du groupe WhatsApp pour une formation.
 * Si le slug est inconnu, retourne le groupe général.
 */
export function getWhatsappGroup(slug: string): string {
  return (
    WHATSAPP_GROUPS[slug] ??
    process.env.WHATSAPP_GROUP_GENERAL ??
    'https://chat.whatsapp.com/BgwYG0nijyYHGLDh6ZYWCo?s=cl&p=a&mlu=4&ilr=4'
  )
}

/**
 * Labels humains pour l'affichage.
 */
export const WHATSAPP_GROUP_LABELS: Record<string, string> = {
  'maitriser-chatgpt-gemini-claude':       'Groupe ChatGPT, Gemini & Claude',
  'automatiser-son-travail-n8n-make':      'Groupe Automatisation n8n & Make',
  'ia-pour-entrepreneurs-professionnels':  'Groupe IA Entrepreneurs',
  'dev-applications-web-ia':               'Groupe Dev Web avec l\'IA',
}
