// ============================================================
// CLUB AI — Données de démonstration du tableau de bord
// ============================================================
// Ces données alimentent l'espace /admin tant que le backend
// (Prisma + PostgreSQL, dossier /backend) n'est pas branché.
// Toutes les valeurs sont statiques et déterministes : aucun
// Math.random(), donc aucun risque d'écart d'hydratation.
// ============================================================

import { FORMATIONS } from '@/data/formations'

export type StatutInscription = 'CONFIRMEE' | 'EN_ATTENTE' | 'ANNULEE'
export type NiveauIA = 'Débutant' | 'Intermédiaire' | 'Avancé'

export interface AdminInscription {
  id: string
  reference: string
  nom: string
  prenom: string
  email: string
  telephone: string
  formationSlug: string
  formation: string
  niveau: NiveauIA
  statut: StatutInscription
  /** ISO — date d'inscription */
  date: string
  montant: number
}

export interface AdminMessage {
  id: string
  auteur: string
  email: string
  sujet: string
  extrait: string
  date: string
  lu: boolean
}

export interface TeamMember {
  id: string
  nom: string
  email: string
  role: 'Administrateur' | 'Formateur' | 'Support'
  actif: boolean
  initiales: string
}

// ------------------------------------------------------------
// FORMATIONS (réutilise la source unique du site)
// ------------------------------------------------------------

export const FORMATION_OPTIONS = FORMATIONS.map((f) => ({
  slug: f.slug,
  titre: f.titreCourt,
}))

/** Capacité d'accueil par formation (places ouvertes). */
const CAPACITES: Record<string, number> = {
  'maitriser-chatgpt-gemini-claude':      20,
  'automatiser-son-travail-n8n-make':     20,
  'ia-pour-entrepreneurs-professionnels': 16,
  'dev-applications-web-ia':              14,
}

// ------------------------------------------------------------
// INSCRIPTIONS
// ------------------------------------------------------------

type Row = [
  string, // nom
  string, // prenom
  string, // email
  string, // telephone
  number, // index formation
  NiveauIA,
  StatutInscription,
  string, // date
]

const ROWS: Row[] = [
  ['Ndayishimiye', 'Aline',    'aline.ndayi@gmail.com',      '+257 79 12 34 56', 0, 'Intermédiaire', 'CONFIRMEE',  '2026-11-22'],
  ['Nkurunziza',   'Patrick',  'p.nkurunziza@outlook.com',   '+257 77 45 88 21', 1, 'Débutant',      'CONFIRMEE',  '2026-11-22'],
  ['Uwimana',      'Chantal',  'chantal.uwimana@yahoo.fr',   '+257 71 23 09 47', 0, 'Débutant',      'EN_ATTENTE', '2026-11-22'],
  ['Bizimana',     'Eric',     'eric.bizimana@gmail.com',    '+257 79 66 12 03', 2, 'Intermédiaire', 'CONFIRMEE',  '2026-11-21'],
  ['Irakoze',      'Sandrine', 's.irakoze@protonmail.com',   '+257 77 90 55 18', 3, 'Avancé',        'CONFIRMEE',  '2026-11-21'],
  ['Hakizimana',   'Jean-Bosco','jb.hakizimana@gmail.com',   '+257 71 78 34 90', 1, 'Débutant',      'ANNULEE',    '2026-11-21'],
  ['Niyonkuru',    'Divine',   'divine.niyonkuru@gmail.com', '+257 79 33 27 64', 0, 'Débutant',      'CONFIRMEE',  '2026-11-20'],
  ['Mbonimpa',     'Thierry',  't.mbonimpa@gmail.com',       '+257 77 14 82 35', 2, 'Intermédiaire', 'EN_ATTENTE', '2026-11-20'],
  ['Ntibantunganya','Clarisse','clarisse.nt@gmail.com',      '+257 71 55 41 72', 0, 'Intermédiaire', 'CONFIRMEE',  '2026-11-20'],
  ['Bigirimana',   'Léonce',   'leonce.bigiri@yahoo.fr',     '+257 79 08 63 11', 3, 'Avancé',        'CONFIRMEE',  '2026-11-19'],
  ['Ndikumana',    'Fabrice',  'f.ndikumana@gmail.com',      '+257 77 21 47 88', 1, 'Débutant',      'CONFIRMEE',  '2026-11-19'],
  ['Nizigiyimana', 'Ariane',   'ariane.nizi@gmail.com',      '+257 71 62 90 54', 2, 'Intermédiaire', 'EN_ATTENTE', '2026-11-19'],
  ['Kaneza',       'Yvette',   'yvette.kaneza@outlook.com',  '+257 79 74 15 26', 0, 'Débutant',      'CONFIRMEE',  '2026-11-18'],
  ['Habonimana',   'Gérard',   'gerard.habo@gmail.com',      '+257 77 39 06 82', 1, 'Intermédiaire', 'CONFIRMEE',  '2026-11-18'],
  ['Ntakirutimana','Josiane',  'j.ntakiru@gmail.com',        '+257 71 88 22 47', 3, 'Intermédiaire', 'EN_ATTENTE', '2026-11-18'],
  ['Sinankwa',     'Olivier',  'olivier.sinankwa@gmail.com', '+257 79 51 73 09', 2, 'Débutant',      'CONFIRMEE',  '2026-11-17'],
  ['Ndayizeye',    'Béatrice', 'b.ndayizeye@yahoo.fr',       '+257 77 03 96 41', 0, 'Avancé',        'CONFIRMEE',  '2026-11-17'],
  ['Baransaka',    'Emmanuel', 'e.baransaka@gmail.com',      '+257 71 40 18 75', 1, 'Débutant',      'ANNULEE',    '2026-11-16'],
  ['Nkeshimana',   'Grâce',    'grace.nkeshi@gmail.com',     '+257 79 27 60 33', 2, 'Intermédiaire', 'CONFIRMEE',  '2026-11-16'],
  ['Nduwimana',    'Samuel',   's.nduwimana@outlook.com',    '+257 77 83 05 19', 3, 'Avancé',        'CONFIRMEE',  '2026-11-15'],
  ['Mukamana',     'Joséphine','j.mukamana@gmail.com',       '+257 71 12 58 94', 0, 'Débutant',      'CONFIRMEE',  '2026-11-14'],
  ['Nshimirimana', 'Lionel',   'lionel.nshimi@gmail.com',    '+257 79 69 31 08', 1, 'Intermédiaire', 'EN_ATTENTE', '2026-11-13'],
  ['Kanyana',      'Rosine',   'rosine.kanyana@yahoo.fr',    '+257 77 46 72 51', 2, 'Débutant',      'CONFIRMEE',  '2026-11-12'],
  ['Ntakirutimana','Pascal',   'pascal.ntaki@gmail.com',     '+257 71 95 24 63', 3, 'Intermédiaire', 'CONFIRMEE',  '2026-11-11'],
]

export const INSCRIPTIONS: AdminInscription[] = ROWS.map((row, i) => {
  const [nom, prenom, email, telephone, fIdx, niveau, statut, date] = row
  const formation = FORMATIONS[fIdx] ?? FORMATIONS[0]
  const num = String(1042 - i).padStart(4, '0')

  return {
    id: `ins-${num}`,
    reference: `CLUBAI-2026-${num}`,
    nom,
    prenom,
    email,
    telephone,
    formationSlug: formation.slug,
    formation: formation.titreCourt,
    niveau,
    statut,
    date,
    montant: 150000,
  }
})

// ------------------------------------------------------------
// STATISTIQUES PAR FORMATION (dérivées des inscriptions)
// ------------------------------------------------------------

export const FORMATION_STATS = FORMATIONS.map((f) => {
  const inscrits = INSCRIPTIONS.filter(
    (i) => i.formationSlug === f.slug && i.statut !== 'ANNULEE'
  ).length
  const capacite = CAPACITES[f.slug] ?? 20

  return {
    slug: f.slug,
    titre: f.titreCourt,
    categorie: f.categorie,
    inscrits,
    capacite,
    remplissage: Math.round((inscrits / capacite) * 100),
    revenus: inscrits * 150000,
  }
})

export const TOTAL_INSCRITS_ACTIFS = FORMATION_STATS.reduce((s, f) => s + f.inscrits, 0)
export const TOTAL_PLACES = FORMATION_STATS.reduce((s, f) => s + f.capacite, 0)

// ------------------------------------------------------------
// INDICATEURS
// ------------------------------------------------------------

export const KPI = (() => {
  const total = INSCRIPTIONS.length
  const confirmees = INSCRIPTIONS.filter((i) => i.statut === 'CONFIRMEE').length
  const enAttente = INSCRIPTIONS.filter((i) => i.statut === 'EN_ATTENTE').length
  const annulees = INSCRIPTIONS.filter((i) => i.statut === 'ANNULEE').length
  const revenus = INSCRIPTIONS.filter((i) => i.statut === 'CONFIRMEE').reduce(
    (sum, i) => sum + i.montant,
    0
  )

  return {
    total,
    confirmees,
    enAttente,
    annulees,
    revenus,
    tauxConfirmation: Math.round((confirmees / total) * 100),
    placesRestantes: FORMATION_STATS.reduce((s, f) => s + (f.capacite - f.inscrits), 0),
  }
})()

/** Inscriptions par jour — 12 derniers jours. */
export const INSCRIPTIONS_PAR_JOUR = (() => {
  const days = [
    '2026-11-11', '2026-11-12', '2026-11-13', '2026-11-14',
    '2026-11-15', '2026-11-16', '2026-11-17', '2026-11-18',
    '2026-11-19', '2026-11-20', '2026-11-21', '2026-11-22',
  ]

  return days.map((day) => ({
    date: day,
    label: `${day.slice(8, 10)}/${day.slice(5, 7)}`,
    total: INSCRIPTIONS.filter((i) => i.date === day).length,
  }))
})()

export const REPARTITION_FORMATIONS = FORMATION_STATS.map((f) => ({
  ...f,
  part: Math.round((f.inscrits / FORMATION_STATS.reduce((s, x) => s + x.inscrits, 0)) * 100),
}))

// ------------------------------------------------------------
// MESSAGES
// ------------------------------------------------------------

export const MESSAGES: AdminMessage[] = [
  {
    id: 'msg-01',
    auteur: 'Chantal Uwimana',
    email: 'chantal.uwimana@yahoo.fr',
    sujet: 'Question sur le paiement en plusieurs fois',
    extrait: 'Bonjour, est-il possible de régler la formation en deux tranches ? Je suis disponible pour un appel…',
    date: '2026-11-22T08:42:00',
    lu: false,
  },
  {
    id: 'msg-02',
    auteur: 'Eric Bizimana',
    email: 'eric.bizimana@gmail.com',
    sujet: 'Attestation pour mon employeur',
    extrait: 'Ma direction demande une facture au nom de l’entreprise avant l’atelier. Pouvez-vous m’en faire parvenir une ?',
    date: '2026-11-21T16:10:00',
    lu: false,
  },
  {
    id: 'msg-03',
    auteur: 'Sandrine Irakoze',
    email: 's.irakoze@protonmail.com',
    sujet: 'Matériel à apporter',
    extrait: 'Faut-il venir avec un ordinateur portable ? J’ai une tablette uniquement, est-ce suffisant ?',
    date: '2026-11-21T09:35:00',
    lu: false,
  },
  {
    id: 'msg-04',
    auteur: 'Gérard Habonimana',
    email: 'gerard.habo@gmail.com',
    sujet: 'Inscription pour deux collègues',
    extrait: 'Je souhaite inscrire deux personnes de mon équipe sur la même session. Y a-t-il un tarif groupé ?',
    date: '2026-11-20T14:02:00',
    lu: true,
  },
  {
    id: 'msg-05',
    auteur: 'Rosine Kanyana',
    email: 'rosine.kanyana@yahoo.fr',
    sujet: 'Changement de session',
    extrait: 'Serait-il possible de basculer mon inscription sur la session de décembre plutôt que celle de novembre ?',
    date: '2026-11-19T11:48:00',
    lu: true,
  },
]

// ------------------------------------------------------------
// ÉQUIPE & ACCÈS
// ------------------------------------------------------------

export const TEAM: TeamMember[] = [
  { id: 'usr-01', nom: 'Aline Ndayishimiye', email: 'admin@club-ai.com',      role: 'Administrateur', actif: true,  initiales: 'AN' },
  { id: 'usr-02', nom: 'Kevin Nsengiyumva',  email: 'formateur@club-ai.com',  role: 'Formateur',      actif: true,  initiales: 'KN' },
  { id: 'usr-03', nom: 'Nadine Iradukunda',  email: 'nadine@club-ai.com',     role: 'Support',        actif: true,  initiales: 'NI' },
  { id: 'usr-04', nom: 'Fabrice Ndayizeye',  email: 'fabrice@club-ai.com',    role: 'Formateur',      actif: false, initiales: 'FN' },
]

// ------------------------------------------------------------
// NEWSLETTER
// ------------------------------------------------------------

export interface Newsletter {
  id: string
  objet: string
  /** Extrait du message envoyé */
  apercu: string
  /** ISO — date d'envoi */
  date: string
  destinataires: number
  ouverture: number
  clics: number
  statut: 'ENVOYEE' | 'BROUILLON'
}

/** Audiences disponibles pour une campagne. */
export type AudienceId = 'TOUS' | 'CONFIRMES' | 'ATTENTE' | 'FORMATION'

export const AUDIENCE_LABEL: Record<AudienceId, string> = {
  TOUS:      'Tous les inscrits',
  CONFIRMES: 'Participants confirmés',
  ATTENTE:   'Inscriptions en attente',
  FORMATION: 'Une formation précise',
}

export function destinataires(
  audience: AudienceId,
  formationSlug?: string
): AdminInscription[] {
  switch (audience) {
    case 'CONFIRMES':
      return INSCRIPTIONS.filter((i) => i.statut === 'CONFIRMEE')
    case 'ATTENTE':
      return INSCRIPTIONS.filter((i) => i.statut === 'EN_ATTENTE')
    case 'FORMATION':
      return INSCRIPTIONS.filter((i) => i.formationSlug === formationSlug)
    default:
      return INSCRIPTIONS
  }
}

export const NEWSLETTERS: Newsletter[] = [
  {
    id: 'nl-04',
    objet: 'J-7 : votre place est confirmée pour décembre',
    apercu: 'Bonjour, la session du 14 au 19 décembre approche. Voici tout ce qu’il faut savoir avant le premier jour…',
    date: '2026-11-18T09:15:00',
    destinataires: 17,
    ouverture: 82,
    clics: 34,
    statut: 'ENVOYEE',
  },
  {
    id: 'nl-03',
    objet: 'Les 5 automatisations qui font gagner 6 h par semaine',
    apercu: 'Nous avons compilé les cas d’usage les plus demandés par les participants de la session précédente…',
    date: '2026-11-11T08:00:00',
    destinataires: 24,
    ouverture: 71,
    clics: 28,
    statut: 'ENVOYEE',
  },
  {
    id: 'nl-02',
    objet: 'Dernières places — session du 14 décembre',
    apercu: 'Il reste quelques places pour la prochaine session. Inscription confirmée en moins de 2 minutes…',
    date: '2026-11-04T10:30:00',
    destinataires: 21,
    ouverture: 66,
    clics: 41,
    statut: 'ENVOYEE',
  },
  {
    id: 'nl-01',
    objet: 'Bienvenue dans la communauté CLUB AI',
    apercu: 'Merci de votre confiance. Voici comment tirer le meilleur parti de votre formation…',
    date: '2026-10-27T07:45:00',
    destinataires: 12,
    ouverture: 88,
    clics: 19,
    statut: 'ENVOYEE',
  },
]

// ------------------------------------------------------------
// HELPERS D'AFFICHAGE
// ------------------------------------------------------------

export const STATUT_META: Record<
  StatutInscription,
  { label: string; couleur: string; fond: string; point: string }
> = {
  CONFIRMEE: {
    label: 'Confirmée',
    couleur: '#0f7a52',
    fond: 'rgba(15,122,82,.1)',
    point: '#0f7a52',
  },
  EN_ATTENTE: {
    label: 'En attente',
    couleur: '#b3761a',
    fond: 'rgba(179,118,26,.12)',
    point: '#d99a2b',
  },
  ANNULEE: {
    label: 'Annulée',
    couleur: '#a13a2f',
    fond: 'rgba(161,58,47,.1)',
    point: '#a13a2f',
  },
}

const MOIS_COURTS = [
  'janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin',
  'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.',
]

export function formatDate(iso: string): string {
  const d = new Date(`${iso.slice(0, 10)}T12:00:00`)
  return `${String(d.getDate()).padStart(2, '0')} ${MOIS_COURTS[d.getMonth()]} ${d.getFullYear()}`
}

export function formatFBU(montant: number): string {
  return `${montant.toLocaleString('fr-FR').replace(/\u202f|\u00a0/g, ' ')} FBU`
}

export function formatHeure(iso: string): string {
  const d = new Date(iso)
  const hh = String(d.getHours()).padStart(2, '0')
  const mm = String(d.getMinutes()).padStart(2, '0')
  return `${String(d.getDate()).padStart(2, '0')} ${MOIS_COURTS[d.getMonth()]} · ${hh}h${mm}`
}
