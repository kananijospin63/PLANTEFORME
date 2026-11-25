# CLUB AI — Backend API

Backend complet de la plateforme d'inscription aux formations en Intelligence Artificielle de **CLUB AI**, Bujumbura, Burundi.

---

## Stack technique

| Technologie | Version | Rôle |
|-------------|---------|------|
| Next.js | 14.2.5 | App Router + Route Handlers |
| TypeScript | 5.5.3 | Typage statique |
| PostgreSQL | 14+ | Base de données |
| Prisma ORM | 5.16.1 | ORM + migrations |
| Zod | 3.23.8 | Validation des données |
| Nodemailer | 6.9.14 | Email (préparé) |
| Jest + ts-jest | 29.x | Tests |

---

## Architecture

```
backend/
├── app/
│   └── api/
│       ├── formations/
│       │   ├── route.ts              # GET /api/formations
│       │   └── [slug]/
│       │       └── route.ts          # GET /api/formations/:slug
│       ├── inscriptions/
│       │   └── route.ts              # POST /api/inscriptions
│       ├── participants/
│       │   └── route.ts              # GET /api/participants
│       └── webhooks/
│           └── make/
│               └── route.ts          # POST /api/webhooks/make
│
├── lib/
│   ├── prisma.ts         # Client Prisma singleton
│   ├── validations.ts    # Schémas Zod centralisés
│   ├── make.ts           # Intégration Make webhook
│   ├── email.ts          # Module Nodemailer (préparé)
│   ├── reference.ts      # Générateur de référence CLUBAI-AAAA-XXXX
│   ├── responses.ts      # Helpers réponses API uniformes
│   └── logger.ts         # Système de logging
│
├── services/
│   ├── formation.service.ts     # Logique métier formations
│   ├── inscription.service.ts   # Logique métier inscriptions
│   └── participant.service.ts   # Logique métier participants
│
├── types/
│   └── api.ts            # Types TypeScript API
│
├── prisma/
│   ├── schema.prisma     # Schéma base de données
│   ├── seed.ts           # Données initiales
│   └── migrations/       # Migrations Prisma
│
├── __tests__/
│   ├── reference.test.ts
│   ├── validations.test.ts
│   ├── formations.test.ts
│   └── inscriptions.test.ts
│
├── .env.example
├── next.config.js
├── package.json
└── tsconfig.json
```

---

## Installation

### 1. Prérequis

- Node.js >= 18.x
- PostgreSQL >= 14 (local ou cloud)
- npm >= 9.x

### 2. Cloner et installer

```bash
cd backend
npm install
```

### 3. Configurer les variables d'environnement

```bash
cp .env.example .env.local
```

Puis éditer `.env.local` :

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/jovim_tech"
MAKE_WEBHOOK_URL=                  # Laisser vide pour désactiver
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=votre@email.com
SMTP_PASS=votre_mot_de_passe
NEXT_PUBLIC_APP_URL=http://localhost:3001
```

### 4. Créer la base de données PostgreSQL

```sql
-- Dans psql ou pgAdmin
CREATE DATABASE jovim_tech;
```

### 5. Lancer les migrations Prisma

```bash
npx prisma migrate dev --name init
```

### 6. Générer le client Prisma

```bash
npx prisma generate
```

### 7. Insérer les données initiales (formations)

```bash
npm run seed
```

### 8. Démarrer le serveur

```bash
npm run dev
```

Le backend démarre sur : **http://localhost:3001**

---

## Routes API

### Formations

| Méthode | Route | Description |
|---------|-------|-------------|
| `GET` | `/api/formations` | Liste toutes les formations actives |
| `GET` | `/api/formations/:slug` | Retourne une formation par slug |

**Exemple GET /api/formations**

```json
{
  "success": true,
  "data": [
    {
      "id": "...",
      "slug": "maitriser-chatgpt-gemini-claude",
      "titre": "MAÎTRISER CHATGPT, GEMINI & CLAUDE",
      "date": "05 OCTOBRE 2026",
      "heureDebut": "14H00",
      "heureFin": "17H00",
      "prixAffiche": "150 000 FBU",
      ...
    }
  ]
}
```

---

### Inscriptions

| Méthode | Route | Description |
|---------|-------|-------------|
| `POST` | `/api/inscriptions` | Crée une nouvelle inscription |

**Corps de la requête**

```json
{
  "nom": "Dupont",
  "prenom": "Jean",
  "dateNaissance": "1990-05-15",
  "email": "jean.dupont@example.com",
  "telephone": "+257 77 123456",
  "fonction": "Entrepreneur",
  "entreprise": "ACME SARL",
  "niveauIA": "DEBUTANT",
  "formationSlug": "maitriser-chatgpt-gemini-claude",
  "motivation": "Je souhaite apprendre à utiliser l'IA pour mon activité."
}
```

**Réponse succès (201)**

```json
{
  "success": true,
  "message": "Votre inscription a été enregistrée avec succès.",
  "data": {
    "id": "...",
    "reference": "CLUBAI-2026-0001",
    "formation": {
      "titre": "MAÎTRISER CHATGPT, GEMINI & CLAUDE",
      "date": "05 OCTOBRE 2026",
      ...
    },
    "participant": {
      "nom": "Dupont",
      "prenom": "Jean",
      "email": "jean.dupont@example.com"
    },
    "statut": "EN_ATTENTE",
    "createdAt": "2026-09-01T10:00:00.000Z"
  }
}
```

**Réponse doublon (409)**

```json
{
  "success": false,
  "message": "Vous êtes déjà inscrit à cette formation.",
  "code": "CONFLICT"
}
```

**Réponse validation (422)**

```json
{
  "success": false,
  "message": "Veuillez renseigner une adresse email valide.",
  "errors": {
    "email": ["Veuillez renseigner une adresse email valide."]
  }
}
```

---

### Participants

| Méthode | Route | Description |
|---------|-------|-------------|
| `GET` | `/api/participants` | Liste les participants (paginée) |

**Query params**

| Param | Type | Description |
|-------|------|-------------|
| `page` | number | Page (défaut: 1) |
| `limit` | number | Éléments par page (défaut: 20, max: 100) |
| `search` | string | Recherche sur nom, prénom, email |
| `sort` | string | Champ de tri (createdAt, nom, prenom, email) |
| `order` | string | Direction (asc, desc) |
| `niveauIA` | string | Filtre par niveau (DEBUTANT, INTERMEDIAIRE, AVANCE) |
| `formation` | string | Filtre par slug de formation |

**Exemple : GET /api/participants?page=1&limit=10&search=jean**

```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 42,
    "totalPages": 5,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

---

### Webhooks

| Méthode | Route | Description |
|---------|-------|-------------|
| `POST` | `/api/webhooks/make` | Webhook retour depuis Make |

---

## Référence d'inscription

Format : `CLUBAI-AAAA-XXXX`

Exemples :
```
CLUBAI-2026-0001
CLUBAI-2026-0002
CLUBAI-2026-0042
```

- Incrémentale par année
- Unique (vérification en base)
- Fallback timestamp en cas de collision extrême

---

## Flux d'inscription

```
Frontend (POST /api/inscriptions)
  │
  ├─ Validation Zod
  ├─ Vérification formation (existe + active)
  ├─ Upsert participant (email unique)
  ├─ Vérification doublon (participant + formation)
  ├─ Génération référence CLUBAI-2026-XXXX
  ├─ Création inscription en base (statut: EN_ATTENTE)
  │
  ├─ [Asynchrone] sendToMake()
  │     └─ Make envoie l'email de confirmation
  │     └─ Make notifie CLUB AI
  │
  └─ Réponse 201 avec référence
```

---

## Codes d'erreur HTTP

| Code | Signification |
|------|---------------|
| 200 | Succès |
| 201 | Créé avec succès |
| 400 | Requête invalide (JSON malformé, Content-Type incorrect) |
| 404 | Ressource introuvable |
| 409 | Conflit (doublon) |
| 422 | Données invalides (validation Zod) |
| 500 | Erreur serveur interne |

---

## Tests

```bash
# Lancer tous les tests
npm test

# Mode watch
npm run test:watch

# Couverture
npm run test:coverage
```

Les tests mockent Prisma — aucune connexion PostgreSQL requise.

---

## Variables d'environnement

| Variable | Requis | Description |
|----------|--------|-------------|
| `DATABASE_URL` | ✅ | URL PostgreSQL |
| `MAKE_WEBHOOK_URL` | ❌ | URL webhook Make (désactivé si vide) |
| `SMTP_HOST` | ❌ | Serveur SMTP |
| `SMTP_PORT` | ❌ | Port SMTP (587 ou 465) |
| `SMTP_USER` | ❌ | Identifiant SMTP |
| `SMTP_PASS` | ❌ | Mot de passe SMTP |
| `SMTP_FROM` | ❌ | Adresse d'envoi |
| `NEXT_PUBLIC_APP_URL` | ❌ | URL du frontend |
| `WEBHOOK_SECRET` | ❌ | Secret pour valider les webhooks entrants |

---

## Commandes de référence

```bash
npm install                          # Installer les dépendances
npx prisma migrate dev               # Créer/appliquer les migrations
npx prisma migrate dev --name init   # Première migration
npx prisma generate                  # Regénérer le client Prisma
npm run seed                         # Insérer les formations
npm run dev                          # Démarrer en développement
npm run build                        # Build production
npm start                            # Démarrer en production
npm test                             # Lancer les tests
npx prisma studio                    # Interface visuelle Prisma
npx prisma migrate reset             # Réinitialiser la base (dev seulement)
```

---

## Slugs des formations

| Slug | Titre |
|------|-------|
| `maitriser-chatgpt-gemini-claude` | MAÎTRISER CHATGPT, GEMINI & CLAUDE |
| `automatiser-son-travail-n8n-make` | AUTOMATISER SON TRAVAIL AVEC n8n & MAKE |
| `ia-pour-entrepreneurs-professionnels` | IA POUR ENTREPRENEURS & PROFESSIONNELS |

---

## Sécurité

- Validation serveur Zod sur toutes les entrées
- Limitation taille body (64 Ko)
- Headers sécurité HTTP (X-Frame-Options, X-XSS-Protection, etc.)
- CORS configuré via `next.config.js`
- Aucune clé secrète codée en dur
- Logs sans données sensibles
- Architecture compatible Rate Limiting futur

---

## Prochaines étapes

- [ ] Authentification admin (JWT / NextAuth)
- [ ] Dashboard inscriptions
- [ ] Système de paiement (Flexpay)
- [ ] Rate Limiting (Upstash Redis)
- [ ] Notifications en temps réel
