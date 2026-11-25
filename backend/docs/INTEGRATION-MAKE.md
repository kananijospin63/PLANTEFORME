# CLUB AI — Guide d'intégration Make complète

## Vue d'ensemble

```
Utilisateur
     ↓
Formulaire frontend (Next.js)
     ↓
POST /api/inscriptions (Backend)
     ↓
PostgreSQL (inscription enregistrée)
     ↓
Webhook Make  ← sendRegistrationToMake()
     ↓
┌────────────────────────────────────┐
│ Scenario Make                      │
│                                    │
│ 1. Webhook (déclencheur)           │
│ 2. Google Sheets (enregistrement)  │
│ 3. Gemini AI (message perso)       │
│ 4. Gmail (email HTML)              │
│ 5. Notification admin              │
└────────────────────────────────────┘
     ↓
Email → Participant
```

---

## ÉTAPE 1 — Créer le compte Make

1. Aller sur [make.com](https://make.com)
2. Créer un compte gratuit
3. Créer une nouvelle **Organisation**

---

## ÉTAPE 2 — Créer le Webhook Make

1. Dans Make → **Scenarios** → **Create a new scenario**
2. Ajouter le premier module : **Webhooks** → **Custom Webhook**
3. Cliquer **Add** → nommer le webhook `clubai-inscription`
4. Copier l'URL générée (format : `https://hook.eu1.make.com/XXXX...`)
5. Dans le fichier `.env.local` du backend :
   ```
   MAKE_WEBHOOK_URL=https://hook.eu1.make.com/VOTRE_URL_ICI
   ```
6. Cliquer **OK** et **Run once** dans Make pour écouter
7. Faire une inscription de test sur le frontend
8. Make recevra le payload — cliquer **OK** pour valider la structure

---

## ÉTAPE 3 — Connecter Google Sheets

### 3.1 Préparer le Google Sheet

1. Aller sur [sheets.google.com](https://sheets.google.com)
2. Créer un nouveau document nommé : **CLUB AI – Inscriptions 2026**
3. Créer les colonnes dans la ligne 1 :

| A | B | C | D | E | F | G | H | I | J | K | L | M | N | O | P |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Référence | Date inscription | Nom | Prénom | Email | Téléphone | Fonction | Entreprise | Niveau IA | Formation | Date Formation | Heure | Lieu | Prix | Motivation | Statut |

4. Copier l'ID du document depuis l'URL :
   `https://docs.google.com/spreadsheets/d/**ID_ICI**/edit`
5. Dans `.env.local` :
   ```
   GOOGLE_SHEET_ID=VOTRE_ID_ICI
   ```

### 3.2 Dans Make

1. Après le module Webhook, ajouter : **Google Sheets** → **Add a Row**
2. Connecter votre compte Google
3. Sélectionner le spreadsheet **CLUB AI – Inscriptions 2026**
4. Sélectionner la feuille **Feuille 1**
5. Mapper les colonnes avec les données du payload :

```
A (Référence)       → {{1.sheets.reference}}
B (Date inscription)→ {{1.sheets.dateInscription}}
C (Nom)             → {{1.sheets.nom}}
D (Prénom)          → {{1.sheets.prenom}}
E (Email)           → {{1.sheets.email}}
F (Téléphone)       → {{1.sheets.telephone}}
G (Fonction)        → {{1.sheets.fonction}}
H (Entreprise)      → {{1.sheets.entreprise}}
I (Niveau IA)       → {{1.sheets.niveauIA}}
J (Formation)       → {{1.sheets.formation}}
K (Date Formation)  → {{1.sheets.dateFormation}}
L (Heure)           → {{1.sheets.heure}}
M (Lieu)            → {{1.sheets.lieu}}
N (Prix)            → {{1.sheets.prix}}
O (Motivation)      → {{1.sheets.motivation}}
P (Statut)          → {{1.sheets.statut}}
```

---

## ÉTAPE 4 — Connecter Gemini AI

### 4.1 Obtenir la clé API

1. Aller sur [aistudio.google.com](https://aistudio.google.com/app/apikey)
2. Cliquer **Create API key**
3. Copier la clé générée
4. Dans `.env.local` (pour référence uniquement — utilisée dans Make) :
   ```
   GEMINI_API_KEY=AIzaSy...VOTRE_CLE_ICI
   ```

### 4.2 Dans Make — Module HTTP (Gemini)

1. Ajouter un module **HTTP** → **Make a request**
2. Configurer :
   - **URL** : `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=VOTRE_CLE`
   - **Méthode** : POST
   - **Headers** : `Content-Type: application/json`
   - **Body type** : Raw
   - **Body** :
   ```json
   {
     "contents": [{
       "parts": [{
         "text": "{{1.gemini.prompt}}"
       }]
     }],
     "generationConfig": {
       "temperature": 0.8,
       "maxOutputTokens": 500
     }
   }
   ```

3. La réponse Gemini sera dans :
   `{{module_number.candidates[].content.parts[].text}}`

### 4.3 Prompt optimisé (déjà envoyé par le backend)

Le backend envoie automatiquement le prompt dans `{{1.gemini.prompt}}`.
Le prompt demande à Gemini de générer un message :
- Chaleureux et humain
- Personnalisé avec le prénom et la motivation
- Adapté au niveau IA (rassurant pour débutant, stimulant pour avancé)
- Jamais robotique
- 4 paragraphes maximum

---

## ÉTAPE 5 — Connecter Gmail

### 5.1 Dans Make — Module Gmail

1. Ajouter un module **Gmail** → **Send an Email**
2. Connecter votre compte Google (clubai@gmail.com)
3. Configurer :
   - **To** : `{{1.email}}`
   - **Subject** : `✅ {{1.prenom}}, votre inscription à "{{1.formation.titre}}" est confirmée — CLUB AI`
   - **Content type** : HTML
   - **Content** : Coller le contenu de `templates/email-confirmation.html`

4. Remplacer les `{{variables}}` HTML par les variables Make :

```
{{prenom}}          → {{1.prenom}}
{{nom}}             → {{1.nom}}
{{reference}}       → {{1.reference}}
{{geminiMessage}}   → {{NUMERO_MODULE_GEMINI.candidates[].content.parts[].text}}
{{formationTitre}}  → {{1.formation.titre}}
{{formationDate}}   → {{1.formation.date}}
{{formationHeure}}  → {{1.formation.heure}}
{{formationLieu}}   → {{1.formation.lieu}}
{{formationPrix}}   → {{1.formation.prix}}
{{whatsappGroupUrl}}→ {{1.whatsappGroupUrl}}
```

---

## ÉTAPE 6 — Notification Admin CLUB AI

1. Après Gmail, ajouter un autre module **Gmail** → **Send an Email**
2. Configurer :
   - **To** : `clubai@gmail.com`
   - **Subject** : `🆕 Nouvelle inscription — {{1.prenom}} {{1.nom}} — {{1.formation.titre}}`
   - **Content** :
   ```
   Nouvelle inscription reçue !

   Référence   : {{1.reference}}
   Participant : {{1.prenom}} {{1.nom}}
   Email       : {{1.email}}
   Téléphone   : {{1.telephone}}
   Formation   : {{1.formation.titre}}
   Date        : {{1.formation.date}}
   Niveau IA   : {{1.niveauIALabel}}

   Voir les inscriptions : https://club-ai.com/admin/inscriptions
   ```

---

## ÉTAPE 7 — Groupes WhatsApp

### Modifier les liens dans `.env.local`

```env
WHATSAPP_GROUP_CHATGPT=https://chat.whatsapp.com/LIEN_GROUPE_1
WHATSAPP_GROUP_N8N=https://chat.whatsapp.com/LIEN_GROUPE_2
WHATSAPP_GROUP_ENTREPRENEURS=https://chat.whatsapp.com/LIEN_GROUPE_3
WHATSAPP_GROUP_GENERAL=https://chat.whatsapp.com/LIEN_GENERAL
```

### Obtenir le lien d'invitation WhatsApp

1. Ouvrir WhatsApp sur le téléphone
2. Ouvrir le groupe de la formation
3. Paramètres → Lien d'invitation au groupe
4. Copier le lien

### Dans le code (lib/whatsapp-groups.ts)

Si vous préférez coder les liens en dur (sans .env) :
```typescript
export const WHATSAPP_GROUPS = {
  'maitriser-chatgpt-gemini-claude':       'https://chat.whatsapp.com/VOTRE_LIEN_1',
  'automatiser-son-travail-n8n-make':      'https://chat.whatsapp.com/VOTRE_LIEN_2',
  'ia-pour-entrepreneurs-professionnels':  'https://chat.whatsapp.com/VOTRE_LIEN_3',
}
```

---

## ÉTAPE 8 — Réseaux sociaux

Les liens sont dans `lib/make.ts` → constante `CLUBAI_SOCIALS`.
Modifier les URLs une fois les comptes créés :

```typescript
const CLUBAI_SOCIALS = {
  facebook:  'https://facebook.com/VOTRE_PAGE',
  instagram: 'https://instagram.com/VOTRE_COMPTE',
  tiktok:    'https://tiktok.com/@VOTRE_COMPTE',
  youtube:   'https://youtube.com/@VOTRE_CHAINE',
  linkedin:  'https://linkedin.com/company/VOTRE_PAGE',
}
```

---

## ÉTAPE 9 — Tester l'intégration complète

### Test 1 — Webhook uniquement
```bash
curl -X POST https://hook.eu1.make.com/VOTRE_URL \
  -H "Content-Type: application/json" \
  -d @docs/make-payload-example.json
```

### Test 2 — Via le backend
1. Démarrer le backend : `npm run dev`
2. Faire une inscription sur le frontend
3. Vérifier dans Make → History que le scenario s'est déclenché
4. Vérifier dans Google Sheets qu'une ligne a été ajoutée
5. Vérifier la réception de l'email

### Test 3 — Vérifier les logs backend
```bash
# Les logs Make apparaissent dans la console du backend
# Chercher : "Make webhook envoyé" ou "Échec envoi Make webhook"
```

### Test 4 — Simuler un échec Make
1. Mettre une mauvaise URL dans `MAKE_WEBHOOK_URL`
2. Faire une inscription
3. L'inscription doit être enregistrée en base malgré l'échec
4. Le log doit afficher l'erreur sans planter le serveur

---

## Scenario Make — Ordre des modules

```
[1] Webhook (Custom Webhook)
         ↓
[2] Google Sheets → Add a Row
         ↓
[3] HTTP → Gemini API (générer message)
         ↓
[4] Gmail → Send Email (au participant)
         ↓
[5] Gmail → Send Email (notification admin)
```

---

## Variables d'environnement requises

| Variable | Obligatoire | Description |
|----------|-------------|-------------|
| `DATABASE_URL` | ✅ | URL PostgreSQL |
| `MAKE_WEBHOOK_URL` | ✅ | URL du webhook Make |
| `GEMINI_API_KEY` | ⬜ Make | Clé API Gemini (dans Make) |
| `GOOGLE_SHEET_ID` | ⬜ Make | ID du Google Sheet (dans Make) |
| `WHATSAPP_GROUP_CHATGPT` | ⬜ | Lien groupe ChatGPT |
| `WHATSAPP_GROUP_N8N` | ⬜ | Lien groupe n8n & Make |
| `WHATSAPP_GROUP_ENTREPRENEURS` | ⬜ | Lien groupe Entrepreneurs |

> ⬜ = Configuré dans Make, pas obligatoire dans `.env.local`

---

## Structure des fichiers créés

```
backend/
├── lib/
│   ├── make.ts                 ← Webhook + payload builder
│   ├── whatsapp-groups.ts      ← Groupes WhatsApp par formation
│   └── email-template.ts      ← Template HTML généré par code
├── services/
│   └── inscription.service.ts ← Appel Make intégré
├── templates/
│   └── email-confirmation.html ← Template HTML pour Make
├── docs/
│   ├── INTEGRATION-MAKE.md    ← Ce fichier
│   └── make-payload-example.json ← Exemple payload complet
└── .env.example               ← Toutes les variables
```
