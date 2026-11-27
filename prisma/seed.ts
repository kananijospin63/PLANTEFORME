// ============================================================
// CLUB AI — Seed de la base de données
// ============================================================
// Commande : npm run seed
//
// IMPORTANT : ce fichier doit rester aligné sur la source unique
// du frontend (`data/formations.ts`). Toute modification de date,
// d'horaire, de prix ou de module doit être répercutée ici.
// Le seed utilise `upsert` : relancer la commande met à jour les
// formations existantes au lieu de les ignorer.
// ============================================================

import { PrismaClient, StatutFormation } from '@prisma/client'

const prisma = new PrismaClient()

// ── Données communes ──────────────────────────────────────────

const LIEU = {
  nom: 'Centre CEPRODILUC',
  adresse: 'Centre-ville',
  ville: 'Bujumbura',
  pays: 'Burundi',
}

const PRIX = 150000
const PRIX_AFFICHE = '150 000 FBU'
const FORMATEUR = 'CLUB AI'

// ── Formations à insérer ──────────────────────────────────────

const formations = [
  {
    slug: 'maitriser-chatgpt-gemini-claude',
    titre: "MAÎTRISER CHATGPT, GEMINI & CLAUDE ET CRÉER DES VIDÉOS AVEC L'IA",
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
    heureDebut: '15H30',
    heureFin: '19H30',
    statut: StatutFormation.ACTIVE,
  },
  {
    slug: 'automatiser-son-travail-n8n-make',
    titre: 'AUTOMATISER SON TRAVAIL AVEC n8n & MAKE',
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
    heureDebut: '08H30',
    heureFin: '12H00',
    statut: StatutFormation.ACTIVE,
  },
  {
    slug: 'ia-pour-entrepreneurs-professionnels',
    titre: 'IA POUR ENTREPRENEURS & PROFESSIONNELS',
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
    heureDebut: '15H30',
    heureFin: '18H30',
    statut: StatutFormation.ACTIVE,
  },
  {
    slug: 'dev-applications-web-ia',
    titre: "DÉVELOPPEMENT D'APPLICATIONS WEB AVEC L'IA",
    description:
      "Construisez des applications web complètes en utilisant l'IA comme copilote : de la conception UI/UX jusqu'au déploiement en production.",
    objectif:
      "Apprendre à développer des applications web modernes en s'appuyant sur l'IA à chaque étape : cadrage, frontend, backend, tests, intégration d'APIs IA et mise en production.",
    modules: [
      {
        id: 'mod-4-1',
        titre: 'Fondamentaux, Cadrage & Prompt Engineering pour le code',
        description:
          "Comprendre comment cadrer un projet web avec l'IA, maîtriser les prompts techniques et poser les bases d'une architecture solide.",
      },
      {
        id: 'mod-4-2',
        titre: 'UI/UX & Développement Frontend assisté par IA',
        description:
          "Concevoir des interfaces modernes et générer du code frontend (HTML, CSS, JavaScript/React) avec l'aide de l'IA.",
      },
      {
        id: 'mod-4-3',
        titre: "Backend, API & Base de données avec l'IA",
        description:
          "Construire un backend fonctionnel, créer des APIs REST et concevoir une base de données avec l'assistance de l'IA.",
      },
      {
        id: 'mod-4-4',
        titre: 'Qualité, Débogage, Tests & Sécurité',
        description:
          "Utiliser l'IA pour détecter les bugs, écrire des tests automatisés et renforcer la sécurité de l'application.",
      },
      {
        id: 'mod-4-5',
        titre: "Intégration d'APIs IA & Automatisation des workflows",
        description:
          "Intégrer des APIs comme OpenAI ou Gemini dans une application web et automatiser les workflows de développement.",
      },
      {
        id: 'mod-4-6',
        titre: 'Déploiement, Mise en production & Soutenance du projet fil rouge',
        description:
          "Déployer l'application en production et présenter le projet fil rouge développé tout au long de la semaine.",
      },
    ],
    projetFinal:
      "Chaque participant développe une application web complète (de la conception au déploiement) avec l'IA comme copilote, et la présente lors de la soutenance finale.",
    date: '14 – 19 DÉCEMBRE 2026',
    heureDebut: '15H30',
    heureFin: '18H30',
    statut: StatutFormation.ACTIVE,
  },
]

// ── Seed principal ────────────────────────────────────────────

async function main() {
  console.log('\n▶ Seed CLUB AI — Démarrage\n')

  for (const f of formations) {
    const payload = {
      titre: f.titre,
      description: f.description,
      objectif: f.objectif,
      modules: f.modules,
      projetFinal: f.projetFinal,
      date: f.date,
      heureDebut: f.heureDebut,
      heureFin: f.heureFin,
      lieu: LIEU,
      prix: PRIX,
      prixAffiche: PRIX_AFFICHE,
      formateur: FORMATEUR,
      statut: f.statut,
    }

    const existing = await prisma.formation.findUnique({
      where: { slug: f.slug },
      select: { id: true },
    })

    await prisma.formation.upsert({
      where: { slug: f.slug },
      update: payload,
      create: { slug: f.slug, ...payload },
    })

    console.log(
      `  ${existing ? '↻ Formation mise à jour' : '✓ Formation créée'} : ${f.titre}`
    )
  }

  const count = await prisma.formation.count()
  console.log(`\n✓ Seed terminé — ${count} formation(s) en base.\n`)
}

main()
  .catch((e) => {
    console.error('✕ Erreur lors du seed :', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
