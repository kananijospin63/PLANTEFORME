// ============================================================
// CLUB AI — Réseaux sociaux et contacts publics
// ============================================================
// Source unique côté frontend. Doit rester alignée sur
// `backend/lib/make.ts` → CLUBAI_SOCIALS / CLUBAI_CONTACT.
// ============================================================

export interface SocialLink {
  id:    'facebook' | 'instagram' | 'youtube' | 'tiktok'
  label: string
  url:   string
}

export const SOCIAL_LINKS: SocialLink[] = [
  {
    id:    'facebook',
    label: 'Facebook',
    url:   'https://www.facebook.com/jovim.code',
  },
  {
    id:    'instagram',
    label: 'Instagram',
    url:   'https://www.instagram.com/jovimcode?utm_source=qr',
  },
  {
    id:    'youtube',
    label: 'YouTube',
    url:   'https://www.youtube.com/@JovimCode',
  },
  {
    id:    'tiktok',
    label: 'TikTok',
    url:   'https://www.tiktok.com/@jovimcode?is_from_webapp=1&sender_device=pc',
  },
]

/** Lien WhatsApp direct (fallback si aucun groupe n'est configuré). */
export const WHATSAPP_CONTACT = 'https://wa.me/25777165741'
