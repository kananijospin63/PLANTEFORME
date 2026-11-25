// ============================================================
// CLUB AI — Source de données centralisée des formations
// ============================================================
// IMPORTANT : Toutes les informations sur les formations
// proviennent UNIQUEMENT de cette source. Ne jamais dupliquer
// ces données dans des composants ou des pages.
// Quand le backend sera prêt, remplacer par des appels API.
// ============================================================

import type { Formation, LieuFormation, MomentFormation } from '@/types'

// ------------------------------------------------------------
// INFORMATIONS COMMUNES À TOUTES LES FORMATIONS
// ------------------------------------------------------------

export const LIEU_COMMUN: LieuFormation = {
  nom: 'Centre CEPRODILUC',
  adresse: 'Centre-ville',
  ville: 'Bujumbura',
  pays: 'Burundi',
}

/** Plage globale de la session — utilisée par le footer et les métadonnées. */
export const DATE_COMMUNE    = '01 – 19 DÉCEMBRE 2026'
/** Même plage, en casse normale, pour les phrases et les métadonnées SEO. */
export const DATE_COMMUNE_LONG = '01 – 19 décembre 2026'
/** Version phrase, pour le footer. */
export const PERIODE_GLOBALE = 'Du 01 au 19 décembre 2026'
export const HORAIRE_COMMUN  = 'Matin & après-midi'
export const PRIX_COMMUN     = '150 000 FBU'
export const FORMATEUR_COMMUN = 'CLUB AI'

export const CONTACTS = {
  whatsapp: ['+257 77 165741', '+257 79 49 08 06'],
  label: 'WhatsApp',
}

// ------------------------------------------------------------
// FORMATIONS
// ------------------------------------------------------------

export const FORMATIONS: Formation[] = [
  // ----------------------------------------------------------
  // FORMATION 1 — ChatGPT, Gemini & Claude
  // ----------------------------------------------------------
  {
    id: 'formation-001',
    slug: 'maitriser-chatgpt-gemini-claude',
    titre: "MAÎTRISER CHATGPT, GEMINI & CLAUDE ET CRÉER DES VIDÉOS AVEC L'IA",
    titreCourt: 'ChatGPT, Gemini, Claude & Vidéos IA',
    description:
      "Utilisez l'IA pour travailler plus vite, produire mieux, gagner en productivité — et créer des vidéos avec l'IA.",
    objectif:
      "Utilisez l'IA pour travailler plus vite, produire mieux et gagner en productivité, puis créez des vidéos professionnelles avec Vids AI.",
    modules: [
      {
        id: 'mod-1-1',
        titre: 'Prompting',
        description:
          "Maîtriser l'art de formuler des instructions efficaces pour obtenir des résultats précis et pertinents.",
      },
      {
        id: 'mod-1-2',
        titre: 'Analyse de documents',
        description:
          "Utiliser l'IA pour analyser, résumer et extraire les informations essentielles de tout type de document.",
      },
      {
        id: 'mod-1-3',
        titre: 'Recherche & synthèse',
        description:
          "Accélérer la recherche d'informations et produire des synthèses claires grâce aux outils IA.",
      },
      {
        id: 'mod-1-4',
        titre: 'Création de contenus',
        description:
          "Générer des contenus de qualité — textes, présentations, emails — adaptés à vos besoins professionnels.",
      },
      {
        id: 'mod-1-5',
        titre: 'Productivité',
        description:
          "Intégrer les outils IA dans votre flux de travail quotidien pour gagner du temps et être plus efficace.",
      },
      {
        id: 'mod-1-6',
        titre: "Créer des vidéos avec l'IA (Vids AI)",
        description:
          "Produire une vidéo de A à Z avec Vids AI : script assisté par IA, voix off, sélection des plans, montage automatique et habillage — sans logiciel de montage.",
      },
    ],
    projetFinal: 'Projet final concret et directement réutilisable',
    date: '01 – 05 DÉCEMBRE 2026',
    periode: 'Du 01 au 05 décembre 2026',
    horaire: '15H30 – 19H30',
    moment: 'apres-midi',
    lieu: LIEU_COMMUN,
    prix: PRIX_COMMUN,
    formateur: FORMATEUR_COMMUN,
    categorie: 'outils-ia',
    niveau: ['debutant', 'intermediaire'],
    duree: '5 jours',
    disponible: true,
  },

  // ----------------------------------------------------------
  // FORMATION 2 — Automatisation n8n & Make
  // ----------------------------------------------------------
  {
    id: 'formation-002',
    slug: 'automatiser-son-travail-n8n-make',
    titre: 'AUTOMATISER SON TRAVAIL AVEC n8n & MAKE',
    titreCourt: 'Automatisation n8n & Make',
    description:
      "Automatisez les tâches répétitives, connectez vos outils et intégrez l'intelligence artificielle dans vos workflows.",
    objectif:
      "Apprendre à automatiser les tâches répétitives en connectant différentes applications entre elles et en intégrant l'intelligence artificielle dans des workflows.",
    modules: [
      {
        id: 'mod-2-1',
        titre: "Comprendre l'automatisation",
        description:
          "Identifier les tâches automatisables et comprendre les principes fondamentaux de l'automatisation des processus.",
      },
      {
        id: 'mod-2-2',
        titre: 'Découverte de Make et de n8n',
        description:
          "Prendre en main les deux principales plateformes d'automatisation sans code et comprendre leurs forces respectives.",
      },
      {
        id: 'mod-2-3',
        titre: 'Connecter les applications',
        description:
          "Créer des flux entre vos applications quotidiennes — Gmail, Notion, Sheets, Slack, WhatsApp et bien d'autres.",
      },
      {
        id: 'mod-2-4',
        titre: "Ajouter l'intelligence artificielle",
        description:
          "Intégrer ChatGPT, Gemini ou Claude dans vos automatisations pour rendre vos workflows intelligents.",
      },
      {
        id: 'mod-2-5',
        titre: 'Réponses automatiques intelligentes',
        description:
          "Construire des systèmes de réponse automatique capables d'analyser des messages et d'agir en conséquence.",
      },
      {
        id: 'mod-2-6',
        titre: 'Gestion des données',
        description:
          "Automatiser la collecte, le traitement et le stockage de données entre vos différents outils.",
      },
    ],
    projetFinal:
      "Chaque participant identifie une tâche répétitive issue de son travail ou de son activité, et construit une automatisation fonctionnelle avec n8n ou avec Make.",
    date: '08 – 12 DÉCEMBRE 2026',
    periode: 'Du 08 au 12 décembre 2026',
    horaire: '08H30 – 12H00',
    moment: 'avant-midi',
    lieu: LIEU_COMMUN,
    prix: PRIX_COMMUN,
    formateur: FORMATEUR_COMMUN,
    categorie: 'automatisation',
    niveau: ['debutant', 'intermediaire', 'avance'],
    duree: '5 jours',
    disponible: true,
  },

  // ----------------------------------------------------------
  // FORMATION 3 — IA pour entrepreneurs & professionnels
  // ----------------------------------------------------------
  {
    id: 'formation-003',
    slug: 'ia-pour-entrepreneurs-professionnels',
    titre: 'IA POUR ENTREPRENEURS & PROFESSIONNELS',
    titreCourt: 'IA pour Entrepreneurs',
    description:
      "Utilisez l'IA pour développer votre activité, mieux comprendre vos clients, améliorer votre marketing et soutenir vos ventes.",
    objectif:
      "Montrer aux entrepreneurs et professionnels comment utiliser l'intelligence artificielle pour développer leur activité, mieux comprendre leurs clients, améliorer leur marketing, augmenter leur productivité et soutenir leurs ventes.",
    modules: [
      {
        id: 'mod-3-1',
        titre: "Comprendre l'IA pour l'entreprise et trouver des idées de business",
        description:
          "Identifier les opportunités offertes par l'IA pour votre secteur et générer des idées de business pertinentes.",
      },
      {
        id: 'mod-3-2',
        titre: 'Étude de marché et stratégie marketing',
        description:
          "Utiliser l'IA pour analyser votre marché, comprendre vos clients et élaborer une stratégie marketing efficace.",
      },
      {
        id: 'mod-3-3',
        titre: 'Réseaux sociaux et publicité',
        description:
          "Créer et optimiser votre présence sur les réseaux sociaux avec l'aide de l'IA pour maximiser votre impact.",
      },
      {
        id: 'mod-3-4',
        titre: 'IA pour les ventes et le service client',
        description:
          "Améliorer votre processus de vente et offrir un service client de qualité grâce aux outils d'intelligence artificielle.",
      },
      {
        id: 'mod-3-5',
        titre: "Productivité de l'entrepreneur et automatisation",
        description:
          "Optimiser votre temps, déléguer les tâches répétitives et vous concentrer sur ce qui crée de la valeur.",
      },
    ],
    projetFinal:
      "Chaque participant choisit une activité réelle ou imaginaire et construit une stratégie complète assistée par IA : présentation du business, clients, marché, proposition de valeur, marketing, réseaux sociaux, vente, service client, productivité et automatisation.",
    date: '08 – 12 DÉCEMBRE 2026',
    periode: 'Du 08 au 12 décembre 2026',
    horaire: '15H30 – 18H30',
    moment: 'apres-midi',
    lieu: LIEU_COMMUN,
    prix: PRIX_COMMUN,
    formateur: FORMATEUR_COMMUN,
    categorie: 'entrepreneuriat',
    niveau: ['debutant', 'intermediaire', 'avance'],
    duree: '5 jours',
    disponible: true,
  },
  // ----------------------------------------------------------
  // FORMATION 4 — Développement d'applications web avec l'IA
  // ----------------------------------------------------------
  {
    id:         'formation-004',
    slug:       'dev-applications-web-ia',
    titre:      "DÉVELOPPEMENT D'APPLICATIONS WEB AVEC L'IA",
    titreCourt: "Dev Web avec l'IA",
    description:
      "Construisez des applications web complètes en utilisant l'IA comme copilote : de la conception UI/UX jusqu'au déploiement en production.",
    objectif:
      "Apprendre à développer des applications web modernes en s'appuyant sur l'IA à chaque étape : cadrage, frontend, backend, tests, intégration d'APIs IA et mise en production.",
    modules: [
      {
        id:    'mod-4-1',
        titre: 'Fondamentaux, Cadrage & Prompt Engineering pour le code',
        description:
          "Comprendre comment cadrer un projet web avec l'IA, maîtriser les prompts techniques et poser les bases d'une architecture solide.",
      },
      {
        id:    'mod-4-2',
        titre: 'UI/UX & Développement Frontend assisté par IA',
        description:
          "Concevoir des interfaces modernes et générer du code frontend (HTML, CSS, JavaScript/React) avec l'aide de l'IA.",
      },
      {
        id:    'mod-4-3',
        titre: "Backend, API & Base de données avec l'IA",
        description:
          "Construire un backend fonctionnel, créer des APIs REST et concevoir une base de données avec l'assistance de l'IA.",
      },
      {
        id:    'mod-4-4',
        titre: 'Qualité, Débogage, Tests & Sécurité',
        description:
          "Utiliser l'IA pour détecter les bugs, écrire des tests automatisés et renforcer la sécurité de l'application.",
      },
      {
        id:    'mod-4-5',
        titre: "Intégration d'APIs IA & Automatisation des workflows",
        description:
          "Intégrer des APIs comme OpenAI ou Gemini dans une application web et automatiser les workflows de développement.",
      },
      {
        id:    'mod-4-6',
        titre: 'Déploiement, Mise en production & Soutenance du projet fil rouge',
        description:
          "Déployer l'application en production et présenter le projet fil rouge développé tout au long de la semaine.",
      },
    ],
    sessions: [
      { numero: 1, titre: "Fondamentaux, Cadrage & Prompt Engineering pour le code", date: 'Lundi 14 décembre 2026',    horaire: '15H30 – 18H30' },
      { numero: 2, titre: "UI/UX & Développement Frontend assisté par IA",           date: 'Mardi 15 décembre 2026',    horaire: '15H30 – 18H30' },
      { numero: 3, titre: "Backend, API & Base de données avec l'IA",                date: 'Mercredi 16 décembre 2026', horaire: '15H30 – 18H30' },
      { numero: 4, titre: "Qualité, Débogage, Tests & Sécurité",                     date: 'Jeudi 17 décembre 2026',    horaire: '15H30 – 18H30' },
      { numero: 5, titre: "Intégration d'APIs IA & Automatisation des workflows",    date: 'Vendredi 18 décembre 2026', horaire: '15H30 – 18H30' },
      { numero: 6, titre: 'Déploiement, Mise en production & Soutenance',            date: 'Samedi 19 décembre 2026',   horaire: '15H30 – 18H30' },
    ],
    projetFinal:
      "Chaque participant développe une application web complète (de la conception au déploiement) avec l'IA comme copilote, et la présente lors de la soutenance finale.",
    date:      '14 – 19 DÉCEMBRE 2026',
    periode:   'Du 14 au 19 décembre 2026',
    horaire:   '15H30 – 18H30',
    moment:    'apres-midi',
    lieu:      LIEU_COMMUN,
    prix:      PRIX_COMMUN,
    formateur: FORMATEUR_COMMUN,
    categorie: 'outils-ia',
    niveau:    ['intermediaire', 'avance'],
    duree:     '6 jours',
    disponible: true,
  },
]

// ------------------------------------------------------------
// HELPERS
// ------------------------------------------------------------

/**
 * Retourne toutes les formations disponibles.
 */
export function getAllFormations(): Formation[] {
  return FORMATIONS.filter((f) => f.disponible)
}

/**
 * Retourne une formation par son slug.
 * Retourne undefined si non trouvée.
 */
export function getFormationBySlug(slug: string): Formation | undefined {
  return FORMATIONS.find((f) => f.slug === slug)
}

/**
 * Retourne tous les slugs des formations (utile pour generateStaticParams).
 */
export function getAllFormationSlugs(): string[] {
  return FORMATIONS.map((f) => f.slug)
}

/**
 * Retourne le titre d'une formation à partir de son slug.
 */
export function getFormationTitreBySlug(slug: string): string {
  const formation = getFormationBySlug(slug)
  return formation?.titre ?? slug
}

/**
 * Label lisible pour un créneau horaire.
 */
export function getMomentLabel(moment?: MomentFormation): string {
  if (moment === 'avant-midi') return 'Avant-midi'
  if (moment === 'apres-midi') return 'Après-midi'
  return ''
}

/**
 * Label lisible pour une catégorie de formation.
 */
export function getCategorieLabel(categorie: Formation['categorie']): string {
  const labels: Record<Formation['categorie'], string> = {
    'outils-ia': 'Outils IA',
    'automatisation': 'Automatisation',
    'entrepreneuriat': 'Entrepreneuriat',
  }
  return labels[categorie]
}

/**
 * Options pour le select du formulaire d'inscription.
 */
export const FORMATION_SELECT_OPTIONS = FORMATIONS.map((f) => ({
  value: f.slug,
  label: f.titre,
}))

/**
 * Options de niveau IA pour le formulaire.
 */
export const NIVEAU_IA_OPTIONS = [
  { value: 'debutant', label: "Débutant — Je découvre l'intelligence artificielle" },
  {
    value: 'intermediaire',
    label: "Intermédiaire — J'utilise déjà quelques outils IA",
  },
  { value: 'avance', label: "Avancé — J'ai une bonne expérience des outils IA" },
]
