# CLUB AI — Plateforme d'inscription aux formations IA

Site public + espace d'administration de la plateforme de formations en intelligence
artificielle de **CLUB AI**, Bujumbura, Burundi.

Le dépôt contient **deux applications Next.js** :

| Dossier | Rôle | Port dev |
|---------|------|----------|
| `/` (racine) | Frontend public + espace `/admin` | 3000 |
| `/backend` | API REST (formations, inscriptions, participants, webhooks) | 3001 |

---

## Stack

- **Next.js 14** (App Router) + **React 18** + **TypeScript** (strict)
- **Tailwind CSS** — thème « Espresso / Café Premium »
- **lucide-react** — icônes
- **Backend** : Next.js Route Handlers, **Prisma 5** + **PostgreSQL**, **Zod**, Nodemailer
- **Automatisation** : webhook Make (Sheets + Gemini + Gmail)

---

## Architecture

```
planteforme/
├── app/
│   ├── (site)/                     # Site public (header + footer)
│   │   ├── page.tsx                # Accueil /
│   │   ├── formations/
│   │   │   ├── page.tsx            # Liste /formations (client)
│   │   │   ├── layout.tsx          # Metadata de /formations
│   │   │   └── [slug]/page.tsx     # Détail /formations/[slug] (SSG)
│   │   ├── inscription/
│   │   │   ├── page.tsx            # Formulaire /inscription
│   │   │   └── succes/page.tsx     # Confirmation /inscription/succes
│   │   └── contact/page.tsx        # /contact
│   ├── admin/                      # Espace protégé (session cookie)
│   │   ├── layout.tsx              # Vérifie la session + AdminShell
│   │   ├── page.tsx                # Vue d'ensemble (KPI, graphiques)
│   │   ├── inscriptions/           # Suivi + export CSV
│   │   ├── participants/           # Répertoire
│   │   ├── formations/             # Catalogue + remplissage
│   │   ├── messages/               # Messagerie (démo)
│   │   ├── newsletter/             # Campagnes (démo)
│   │   ├── acces/                  # Équipe (admin uniquement)
│   │   └── parametres/             # Réglages du compte
│   ├── connexion/page.tsx          # /connexion
│   ├── api/auth/                   # login / logout (cookie de session)
│   ├── layout.tsx                  # Layout racine (polices, metadata)
│   ├── globals.css                 # Thème, animations, utilitaires
│   └── not-found.tsx               # 404
│
├── components/
│   ├── layout/                     # Header, Footer
│   ├── ui/                         # Button, Badge, SectionTitle, ThemePicker…
│   ├── form/                       # Champs de formulaire accessibles
│   ├── forms/RegistrationForm.tsx  # Formulaire d'inscription
│   ├── formations/                 # Carte, hero, modules, infos pratiques
│   ├── sections/                   # Hero, formations, stats, CTA, succès
│   └── admin/                      # AdminShell, LoginForm, SettingsForm
│
├── data/
│   ├── formations.ts               # SOURCE UNIQUE des formations (frontend)
│   └── admin.ts                    # Données de démonstration du dashboard
│
├── services/api.ts                 # SEULE interface réseau du frontend
├── lib/auth.ts                     # Session admin (cookie base64url)
├── middleware.ts                   # Protège /admin/*
├── types/index.ts                  # Types partagés
│
└── backend/
    ├── app/api/                    # formations, inscriptions, participants, webhooks
    ├── services/                   # Logique métier (formation, inscription, participant)
    ├── lib/                        # prisma, validations Zod, make, email, logger, reference
    ├── prisma/schema.prisma        # Modèles Formation / Participant / Inscription
    ├── prisma/seed.ts              # Seed aligné sur data/formations.ts
    └── __tests__/                  # Jest (28 tests)
```

---

## Démarrage

### 1. Frontend

```bash
npm install
npm run dev          # http://localhost:3000
```

Variables (`.env.local`) :

```bash
NEXT_PUBLIC_API_URL=http://localhost:3001
```

> Si `NEXT_PUBLIC_API_URL` est vide, `services/api.ts` bascule en **mode mock**
> (données locales, délai simulé, aucune inscription persistée).

### 2. Backend

```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev     # ou : npm run prisma:migrate
npm run seed               # insère / met à jour les formations
npm run dev                # http://localhost:3001
```

Variables principales (`backend/.env.local`) : `DATABASE_URL`, `MAKE_WEBHOOK_URL`,
`SMTP_*`, `WEBHOOK_SECRET`, `WHATSAPP_GROUP_*`.

### 3. Scripts utiles

| Commande | Effet |
|----------|-------|
| `npm run type-check` | `tsc --noEmit` (frontend) |
| `npm run lint` | ESLint `next/core-web-vitals` |
| `npm run build` | Build de production |
| `cd backend && npm test` | Tests Jest |
| `cd backend && npm run prisma:studio` | Explorateur de base |

---

## Pages

| URL | Description |
|-----|-------------|
| `/` | Accueil : hero 3D, formations, chiffres, CTA |
| `/formations` | Liste des formations avec filtres par catégorie |
| `/formations/[slug]` | Détail d'une formation (SSG, 4 slugs générés) |
| `/inscription` | Formulaire d'inscription (`?formation=<slug>` pré-sélectionne) |
| `/inscription/succes` | Confirmation (données via `sessionStorage`) |
| `/contact` | Contact WhatsApp + lieu |
| `/connexion` | Connexion à l'espace admin |
| `/admin/*` | Tableau de bord (session requise, `robots: noindex`) |

Les comptes de démonstration de l'espace admin sont définis dans `lib/auth.ts`
(`DEMO_ACCOUNTS`). Le cookie de session est `httpOnly`, `sameSite=lax`, 8 h.

---

## Données des formations

`data/formations.ts` est la **source unique** côté frontend. Ne jamais dupliquer
ces informations dans un composant ou une page.

```ts
export const DATE_COMMUNE    = '01 – 19 DÉCEMBRE 2026'
export const PERIODE_GLOBALE = 'Du 01 au 19 décembre 2026'
export const HORAIRE_COMMUN  = 'Matin & après-midi'
export const PRIX_COMMUN     = '150 000 FBU'
```

Le backend doit rester aligné : `backend/prisma/seed.ts` reprend les mêmes
dates, horaires, prix et modules (4 formations) et utilise `upsert` — relancer
`npm run seed` met donc à jour une base existante.

---

## Contrat API

| Méthode | Endpoint | Réponse |
|---------|----------|---------|
| `GET` | `/api/formations` | `{ success, data: Formation[] }` |
| `GET` | `/api/formations/:slug` | `{ success, data: Formation }` |
| `POST` | `/api/inscriptions` | `{ success, message, data: { reference, formation, participant, … } }` |
| `GET` | `/api/participants` | `{ success, data, pagination }` |
| `POST` | `/api/webhooks/make` | Retour Make (`EMAIL_SENT`, `INSCRIPTION_CONFIRMEE`…) |

Références d'inscription : format **`CLUBAI-AAAA-XXXX`** (ex. `CLUBAI-2026-0001`),
générées par `backend/lib/reference.ts` et validées par le webhook.

### Flux d'inscription

```
RegistrationForm → services/api.ts → POST /api/inscriptions
    → validation Zod → upsert participant → anti-doublon
    → création inscription (statut EN_ATTENTE)
    → webhook Make (non bloquant) → Sheets + Gemini + Gmail
    → réponse normalisée → /inscription/succes
```

Un échec Make **n'annule jamais** l'inscription en base : l'erreur est loggée
et `makeNotified` reste à `false`.

---

## Identité visuelle

| Nom | Valeur | Usage |
|-----|--------|-------|
| Espresso | `#1a100d` | Fonds sombres, textes |
| Crème | `#f4eee5` / `#fff4e8` | Fonds clairs |
| Gold | `#efc98c` (`--gold`) | Accents, CTA |
| Copper | `#ae5837` (`--copper`) | Accents secondaires |

Polices : **Unbounded** (titres, `--font-unbounded`) et **Manrope** (texte,
`--font-manrope`). Les variables `--gold-rgb` / `--copper-rgb` alimentent les
classes Tailwind (`bg-gold`, `text-copper/40`…) et sont modifiables à chaud via
`ThemePicker` (localStorage).

---

## Accessibilité

- Lien d'évitement clavier, `aria-current` sur la navigation
- Labels associés à tous les champs, erreurs `role="alert"` + `aria-describedby`
- Focus visibles, `prefers-reduced-motion` respecté (animations et hero 3D)

---

## Limites connues

- L'espace `/admin` fonctionne sur des **données de démonstration**
  (`data/admin.ts`) : les actions (statuts, invitations, newsletter) ne sont pas
  persistées et aucun endpoint d'écriture n'existe encore côté backend.
- Aucun système de paiement n'est branché (`150 000 FBU` réglés sur place).
