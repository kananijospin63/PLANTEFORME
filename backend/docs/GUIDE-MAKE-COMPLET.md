# 🚀 Guide Make Complet — CLUB AI
## Automatisation Inscription → Google Sheets → Gemini AI → Gmail

> **Pour débutants** — Chaque étape est expliquée en détail.  
> Temps estimé : 45 à 90 minutes.

---

## SCHÉMA VISUEL DU WORKFLOW

```
┌─────────────────────────────────────────────────────────────────────┐
│                      SCENARIO MAKE — CLUB AI                     │
│                                                                     │
│                                                                     │
│  ┌──────────────┐                                                   │
│  │  MODULE 1    │                                                   │
│  │  Webhooks    │  ← Reçoit les données du backend CLUB AI       │
│  │  Custom      │                                                   │
│  │  Webhook     │                                                   │
│  └──────┬───────┘                                                   │
│         │                                                           │
│         ▼                                                           │
│  ┌──────────────┐                                                   │
│  │  MODULE 2    │                                                   │
│  │  Google      │  ← Enregistre l'inscription dans le tableur       │
│  │  Sheets      │                                                   │
│  │  Add a Row   │                                                   │
│  └──────┬───────┘                                                   │
│         │                                                           │
│         ▼                                                           │
│  ┌──────────────┐                                                   │
│  │  MODULE 3    │                                                   │
│  │  HTTP        │  ← Appelle l'API Gemini pour générer le message   │
│  │  Make a      │                                                   │
│  │  Request     │                                                   │
│  └──────┬───────┘                                                   │
│         │                                                           │
│         ▼                                                           │
│  ┌──────────────┐                                                   │
│  │  MODULE 4    │                                                   │
│  │  Gmail       │  ← Envoie l'email HTML au participant             │
│  │  Send an     │                                                   │
│  │  Email       │                                                   │
│  └──────┬───────┘                                                   │
│         │                                                           │
│         ▼                                                           │
│  ┌──────────────┐                                                   │
│  │  MODULE 5    │                                                   │
│  │  Gmail       │  ← Notifie CLUB AI d'une nouvelle inscription  │
│  │  Send an     │                                                   │
│  │  Email       │                                                   │
│  └──────────────┘                                                   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## PRÉ-REQUIS AVANT DE COMMENCER

Avant d'ouvrir Make, assure-toi d'avoir :

- [ ] Un compte Google (Gmail + Google Sheets)
- [ ] La clé API Gemini (obtenir sur https://aistudio.google.com/app/apikey)
- [ ] Le backend CLUB AI qui tourne
- [ ] Le fichier `.env.local` du backend accessible

---

## PARTIE 1 — CRÉER TON COMPTE MAKE

### Étape 1.1 — Inscription

1. Aller sur **https://make.com**
2. Cliquer **Sign up for free**
3. Créer un compte avec ton email Google (clubai@gmail.com)
4. Confirmer l'email
5. Choisir le plan **Free** (suffisant pour commencer)

### Étape 1.2 — Créer une organisation

1. Une fois connecté → cliquer sur ton nom en haut à droite
2. **Create a new organization**
3. Nom : `CLUB AI`
4. Confirmer

---

## PARTIE 2 — CRÉER LE SCÉNARIO

### Étape 2.1 — Nouveau scénario

1. Dans le menu gauche → cliquer **Scenarios**
2. Cliquer le bouton **+ Create a new scenario** (bouton bleu en haut à droite)
3. Tu vois un écran vide avec un grand cercle au centre
4. Cliquer sur le **grand "+" au centre** de l'écran

---

## PARTIE 3 — MODULE 1 : WEBHOOK (DÉCLENCHEUR)

### Étape 3.1 — Ajouter le Webhook

1. Dans la barre de recherche qui apparaît, taper : `Webhooks`
2. Cliquer sur **Webhooks** (l'icône orange)
3. Sélectionner **Custom Webhook**

### Étape 3.2 — Créer le Webhook

1. Une fenêtre s'ouvre → cliquer **Add**
2. **Webhook name** : `clubai-inscription`
3. Laisser les autres champs vides
4. Cliquer **Save**
5. Make affiche une URL du type :
   ```
   https://hook.eu1.make.com/XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
   ```
6. ⚠️ **COPIER CETTE URL** — tu en auras besoin pour le backend

### Étape 3.3 — Configurer le backend

1. Ouvrir le fichier `backend/.env.local`
2. Ajouter la ligne :
   ```
   MAKE_WEBHOOK_URL=https://hook.eu1.make.com/VOTRE_URL_COPIEE
   ```
3. Redémarrer le backend : `npm run dev`

### Étape 3.4 — Recevoir le premier payload

1. Dans Make → sur le module Webhook → cliquer **Run once**
   (Make se met en attente d'une requête)
2. Sur ton site CLUB AI → faire une inscription test
3. Make affiche : **"1 bundle received"**
4. Cliquer sur le petit bulle qui apparaît sur le module
5. Tu verras toutes les données du payload
6. Cliquer **OK**

> ✅ **Le Webhook est opérationnel !**

---

## PARTIE 4 — MODULE 2 : GOOGLE SHEETS

### Étape 4.1 — Préparer le Google Sheet

**AVANT d'ajouter le module dans Make :**

1. Aller sur **https://sheets.google.com**
2. Cliquer **Créer un nouveau document**
3. Nommer la feuille : `CLUB AI – Inscriptions 2026`
4. Dans la **ligne 1**, créer exactement ces 16 colonnes :

```
A1 : Référence
B1 : Date inscription
C1 : Nom
D1 : Prénom
E1 : Email
F1 : Téléphone
G1 : Fonction
H1 : Entreprise
I1 : Niveau IA
J1 : Formation
K1 : Date Formation
L1 : Heure
M1 : Lieu
N1 : Prix
O1 : Motivation
P1 : Statut
```

5. Mettre ces titres en **gras**
6. Optionnel : fixer la ligne 1 (Affichage → Figer → 1 ligne)
7. Copier l'**ID du document** depuis l'URL :
   ```
   https://docs.google.com/spreadsheets/d/ ← CECI EST L'ID → /edit
   ```

### Étape 4.2 — Ajouter le module Google Sheets dans Make

1. Cliquer sur le **petit cercle** à droite du module Webhook
   (ou le **"+"** sur la connexion)
2. Rechercher : `Google Sheets`
3. Sélectionner **Google Sheets**
4. Choisir **Add a Row**

### Étape 4.3 — Connecter ton compte Google

1. Cliquer **Add** dans le champ "Connection"
2. Une fenêtre Google s'ouvre → choisir **clubai@gmail.com**
3. Autoriser Make à accéder à Google Sheets
4. La connexion apparaît → cliquer **Save**

### Étape 4.4 — Configurer le module

1. **Spreadsheet ID** : cliquer sur le champ → chercher **CLUB AI – Inscriptions 2026**
   (ou coller l'ID manuellement)
2. **Sheet Name** : sélectionner **Feuille 1**
3. **Column headers row** : `1`
4. **Use first row as headers** : `Yes`

### Étape 4.5 — Mapper les champs (IMPORTANT)

Pour chaque colonne, cliquer sur le champ et mapper la variable Make :

| Colonne Google Sheets | Variable Make à mapper |
|----------------------|----------------------|
| **A — Référence** | Cliquer → `{{1.sheets.reference}}` |
| **B — Date inscription** | `{{1.sheets.dateInscription}}` |
| **C — Nom** | `{{1.sheets.nom}}` |
| **D — Prénom** | `{{1.sheets.prenom}}` |
| **E — Email** | `{{1.sheets.email}}` |
| **F — Téléphone** | `{{1.sheets.telephone}}` |
| **G — Fonction** | `{{1.sheets.fonction}}` |
| **H — Entreprise** | `{{1.sheets.entreprise}}` |
| **I — Niveau IA** | `{{1.sheets.niveauIA}}` |
| **J — Formation** | `{{1.sheets.formation}}` |
| **K — Date Formation** | `{{1.sheets.dateFormation}}` |
| **L — Heure** | `{{1.sheets.heure}}` |
| **M — Lieu** | `{{1.sheets.lieu}}` |
| **N — Prix** | `{{1.sheets.prix}}` |
| **O — Motivation** | `{{1.sheets.motivation}}` |
| **P — Statut** | `{{1.sheets.statut}}` |

> **Comment mapper :** Cliquer sur un champ vide → une liste apparaît
> → cliquer sur "1. Webhooks" → naviguer dans l'arborescence jusqu'à
> "sheets" → choisir la bonne propriété.

5. Cliquer **OK**

> ✅ **Google Sheets est configuré !**

---

## PARTIE 5 — MODULE 3 : GEMINI AI

### Étape 5.1 — Obtenir la clé API Gemini

1. Aller sur **https://aistudio.google.com/app/apikey**
2. Cliquer **Create API key**
3. Sélectionner ton projet Google
4. Copier la clé (format : `AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXX`)
5. Garder cette clé en sécurité

### Étape 5.2 — Ajouter le module HTTP dans Make

1. Cliquer sur **"+"** après Google Sheets
2. Rechercher : `HTTP`
3. Sélectionner **HTTP**
4. Choisir **Make a request**

### Étape 5.3 — Configurer la requête Gemini

Remplir les champs comme suit :

**URL :**
```
https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=VOTRE_CLE_API_ICI
```
> Remplacer `VOTRE_CLE_API_ICI` par ta vraie clé Gemini

**Method :** `POST`

**Headers :**
- Cliquer **Add item**
- **Name** : `Content-Type`
- **Value** : `application/json`

**Body type :** `Raw`

**Content type :** `JSON (application/json)`

**Request content :**
```json
{
  "contents": [
    {
      "parts": [
        {
          "text": "{{1.gemini.prompt}}"
        }
      ]
    }
  ],
  "generationConfig": {
    "temperature": 0.8,
    "maxOutputTokens": 500,
    "topP": 0.95
  }
}
```

> **Note :** `{{1.gemini.prompt}}` est le prompt complet envoyé par le backend.
> Il contient déjà toutes les instructions pour Gemini.

**Parse response :** `Yes`

5. Cliquer **OK**

### Étape 5.4 — Identifier la variable de réponse Gemini

Après avoir testé, la réponse Gemini sera accessible via :
```
{{3.candidates[].content.parts[].text}}
```
> Le "3" correspond au numéro du module HTTP dans Make.
> Tu verras ce numéro sur le module après l'avoir créé.

> ✅ **Gemini AI est configuré !**

---

## PARTIE 6 — MODULE 4 : GMAIL (EMAIL AU PARTICIPANT)

### Étape 6.1 — Ajouter le module Gmail

1. Cliquer sur **"+"** après le module HTTP
2. Rechercher : `Gmail`
3. Sélectionner **Gmail**
4. Choisir **Send an Email**

### Étape 6.2 — Connecter Gmail

1. **Connection** → cliquer **Add**
2. Choisir **clubai@gmail.com**
3. Autoriser Make à envoyer des emails
4. Cliquer **Save**

### Étape 6.3 — Configurer l'email

**To :**
```
{{1.email}}
```

**Subject :**
```
✅ {{1.prenom}}, votre inscription à "{{1.formation.titre}}" est confirmée — CLUB AI
```

**Content type :** `HTML`

**Content :**
> Copier-coller le contenu du fichier `templates/email-confirmation.html`
> Puis remplacer chaque `{{variable}}` par la variable Make correspondante :

| Variable HTML | Variable Make |
|--------------|--------------|
| `{{prenom}}` | `{{1.prenom}}` |
| `{{nom}}` | `{{1.nom}}` |
| `{{reference}}` | `{{1.reference}}` |
| `{{geminiMessage}}` | `{{3.candidates[].content.parts[].text}}` |
| `{{formationTitre}}` | `{{1.formation.titre}}` |
| `{{formationDate}}` | `{{1.formation.date}}` |
| `{{formationHeure}}` | `{{1.formation.heure}}` |
| `{{formationLieu}}` | `{{1.formation.lieu}}` |
| `{{formationPrix}}` | `{{1.formation.prix}}` |
| `{{whatsappGroupUrl}}` | `{{1.whatsappGroupUrl}}` |

**From name :** `CLUB AI`

**Reply-to :** `clubai@gmail.com`

5. Cliquer **OK**

> ✅ **Email participant configuré !**

---

## PARTIE 7 — MODULE 5 : GMAIL (NOTIFICATION ADMIN)

### Étape 7.1 — Ajouter un second module Gmail

1. Cliquer sur **"+"** après le 4ème module
2. Rechercher : `Gmail` → **Send an Email**
3. Utiliser la même connexion Google

### Étape 7.2 — Configurer la notification admin

**To :** `clubai@gmail.com`

**Subject :**
```
🆕 Nouvelle inscription — {{1.prenom}} {{1.nom}} — {{1.formation.titre}}
```

**Content type :** `HTML`

**Content :**
```html
<!DOCTYPE html>
<html>
<body style="font-family:Arial,sans-serif; max-width:500px; margin:0 auto; padding:20px; background:#f8fafc;">
  <div style="background:#0F172A; border-radius:12px; padding:24px; color:white; margin-bottom:16px;">
    <h2 style="margin:0; font-size:18px;">🆕 Nouvelle inscription reçue</h2>
  </div>
  <div style="background:white; border-radius:12px; padding:24px; border:1px solid #e2e8f0;">
    <table style="width:100%; border-collapse:collapse;">
      <tr><td style="padding:8px 0; border-bottom:1px solid #f1f5f9; color:#64748b; font-size:12px; font-weight:600; text-transform:uppercase;">Référence</td><td style="padding:8px 0; border-bottom:1px solid #f1f5f9; font-weight:700; color:#F59E0B;">{{1.reference}}</td></tr>
      <tr><td style="padding:8px 0; border-bottom:1px solid #f1f5f9; color:#64748b; font-size:12px; font-weight:600; text-transform:uppercase;">Participant</td><td style="padding:8px 0; border-bottom:1px solid #f1f5f9; font-weight:600;">{{1.prenom}} {{1.nom}}</td></tr>
      <tr><td style="padding:8px 0; border-bottom:1px solid #f1f5f9; color:#64748b; font-size:12px; font-weight:600; text-transform:uppercase;">Email</td><td style="padding:8px 0; border-bottom:1px solid #f1f5f9;">{{1.email}}</td></tr>
      <tr><td style="padding:8px 0; border-bottom:1px solid #f1f5f9; color:#64748b; font-size:12px; font-weight:600; text-transform:uppercase;">Téléphone</td><td style="padding:8px 0; border-bottom:1px solid #f1f5f9;">{{1.telephone}}</td></tr>
      <tr><td style="padding:8px 0; border-bottom:1px solid #f1f5f9; color:#64748b; font-size:12px; font-weight:600; text-transform:uppercase;">Formation</td><td style="padding:8px 0; border-bottom:1px solid #f1f5f9; font-weight:600; color:#0F172A;">{{1.formation.titre}}</td></tr>
      <tr><td style="padding:8px 0; border-bottom:1px solid #f1f5f9; color:#64748b; font-size:12px; font-weight:600; text-transform:uppercase;">Date</td><td style="padding:8px 0; border-bottom:1px solid #f1f5f9;">{{1.formation.date}}</td></tr>
      <tr><td style="padding:8px 0; border-bottom:1px solid #f1f5f9; color:#64748b; font-size:12px; font-weight:600; text-transform:uppercase;">Niveau IA</td><td style="padding:8px 0; border-bottom:1px solid #f1f5f9;">{{1.niveauIALabel}}</td></tr>
      <tr><td style="padding:8px 0; color:#64748b; font-size:12px; font-weight:600; text-transform:uppercase;">Motivation</td><td style="padding:8px 0; color:#475569; font-style:italic;">{{1.motivation}}</td></tr>
    </table>
    <div style="margin-top:20px; text-align:center;">
      <a href="https://club-ai.com/admin/inscriptions"
         style="background:#0F172A; color:white; padding:12px 24px; border-radius:8px; text-decoration:none; font-weight:600; font-size:14px;">
        Voir dans le dashboard
      </a>
    </div>
  </div>
</body>
</html>
```

5. Cliquer **OK**

> ✅ **Notification admin configurée !**

---

## PARTIE 8 — SAUVEGARDER ET ACTIVER

### Étape 8.1 — Nommer le scénario

1. En haut à gauche → cliquer sur **"New scenario"**
2. Renommer en : `CLUB AI — Automatisation Inscriptions`
3. Appuyer sur **Entrée**

### Étape 8.2 — Paramétrer l'exécution automatique

1. En bas de l'écran → cliquer sur l'icône **horloge** (Scheduling)
2. Choisir **Immediately as data arrives** (dès qu'une donnée arrive)
3. Cliquer **OK**

### Étape 8.3 — Activer le scénario

1. En bas de l'écran → bouton **ON/OFF**
2. Mettre sur **ON** (le bouton devient bleu)
3. Cliquer **Save** (icône disquette en bas)

> ✅ **Scénario actif et prêt !**

---

## PARTIE 9 — TABLEAU DE MAPPING COMPLET

### Backend → Make → Google Sheets

| Champ Backend | Chemin dans Make | Colonne Sheets | Type |
|--------------|-----------------|----------------|------|
| `reference` | `{{1.reference}}` | A — Référence | Texte |
| `sheets.dateInscription` | `{{1.sheets.dateInscription}}` | B — Date inscription | Date |
| `nom` | `{{1.nom}}` | C — Nom | Texte |
| `prenom` | `{{1.prenom}}` | D — Prénom | Texte |
| `email` | `{{1.email}}` | E — Email | Texte |
| `telephone` | `{{1.telephone}}` | F — Téléphone | Texte |
| `fonction` | `{{1.fonction}}` | G — Fonction | Texte |
| `entreprise` | `{{1.entreprise}}` | H — Entreprise | Texte |
| `niveauIALabel` | `{{1.niveauIALabel}}` | I — Niveau IA | Texte |
| `formation.titre` | `{{1.formation.titre}}` | J — Formation | Texte |
| `formation.date` | `{{1.formation.date}}` | K — Date Formation | Texte |
| `formation.heure` | `{{1.formation.heure}}` | L — Heure | Texte |
| `formation.lieu` | `{{1.formation.lieu}}` | M — Lieu | Texte |
| `formation.prix` | `{{1.formation.prix}}` | N — Prix | Texte |
| `motivation` | `{{1.motivation}}` | O — Motivation | Texte |
| `sheets.statut` | `{{1.sheets.statut}}` | P — Statut | Texte |

### Backend → Gemini AI

| Champ Backend | Utilisation dans Make |
|--------------|----------------------|
| `gemini.prompt` | Body de la requête HTTP → `"text": "{{1.gemini.prompt}}"` |
| `gemini.prenom` | Inclus dans le prompt automatiquement |
| `gemini.formation` | Inclus dans le prompt automatiquement |
| `gemini.niveauIA` | Inclus dans le prompt automatiquement |
| `gemini.motivation` | Inclus dans le prompt automatiquement |

### Backend → Email HTML

| Variable HTML | Source dans Make |
|--------------|-----------------|
| Prénom + Nom | `{{1.prenom}} {{1.nom}}` |
| Référence | `{{1.reference}}` |
| Message Gemini | `{{3.candidates[].content.parts[].text}}` |
| Titre formation | `{{1.formation.titre}}` |
| Date | `{{1.formation.date}}` |
| Heure | `{{1.formation.heure}}` |
| Lieu | `{{1.formation.lieu}}` |
| Prix | `{{1.formation.prix}}` |
| Lien WhatsApp | `{{1.whatsappGroupUrl}}` |

---

## PARTIE 10 — GUIDE DE TEST COMPLET

### Test 1 — Test du Webhook seul

**But :** Vérifier que Make reçoit bien les données.

1. Dans Make → sur le scénario → cliquer **Run once**
2. Utiliser cURL depuis le terminal :
```bash
curl -X POST "https://hook.eu1.make.com/VOTRE_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "reference": "CLUBAI-2026-9999",
    "prenom": "Jean",
    "nom": "Test",
    "email": "jean.test@gmail.com",
    "telephone": "+257 77 000 000",
    "fonction": "Testeur",
    "entreprise": "Test SARL",
    "niveauIA": "DEBUTANT",
    "niveauIALabel": "Débutant",
    "motivation": "Je veux apprendre l IA pour tester.",
    "formation": {
      "titre": "MAÎTRISER CHATGPT, GEMINI & CLAUDE ET CRÉER DES VIDÉOS AVEC L'IA",
      "slug": "maitriser-chatgpt-gemini-claude",
      "date": "01 – 05 DÉCEMBRE 2026",
      "heure": "15H30 – 19H30",
      "heureDebut": "15H30",
      "heureFin": "19H30",
      "lieu": "Centre CEPRODILUC, Bujumbura",
      "lieuNom": "Centre CEPRODILUC",
      "lieuVille": "Bujumbura",
      "prix": "150 000 FBU"
    },
    "whatsappGroupUrl": "https://chat.whatsapp.com/TEST",
    "sheets": {
      "reference": "CLUBAI-2026-9999",
      "dateInscription": "15/09/2026",
      "nom": "Test",
      "prenom": "Jean",
      "email": "jean.test@gmail.com",
      "telephone": "+257 77 000 000",
      "fonction": "Testeur",
      "entreprise": "Test SARL",
      "niveauIA": "Débutant",
      "formation": "MAÎTRISER CHATGPT, GEMINI & CLAUDE ET CRÉER DES VIDÉOS AVEC L'IA",
      "dateFormation": "01 – 05 DÉCEMBRE 2026",
      "heure": "15H30 – 19H30",
      "lieu": "Centre CEPRODILUC, Bujumbura",
      "prix": "150 000 FBU",
      "motivation": "Je veux apprendre l IA pour tester.",
      "statut": "EN ATTENTE"
    },
    "gemini": {
      "prompt": "Tu es un conseiller CLUB AI. Génère un message de bienvenue chaleureux et motivant pour Jean qui s inscrit à la formation MAÎTRISER CHATGPT, GEMINI & CLAUDE. Jean est débutant et sa motivation est : Je veux apprendre l IA pour tester. Maximum 3 paragraphes courts.",
      "prenom": "Jean",
      "formation": "MAÎTRISER CHATGPT, GEMINI & CLAUDE ET CRÉER DES VIDÉOS AVEC L'IA",
      "niveauIA": "Débutant",
      "motivation": "Je veux apprendre l IA pour tester."
    },
    "socials": {
      "facebook": "https://www.facebook.com/jovim.code",
      "instagram": "https://www.instagram.com/jovimcode?utm_source=qr",
      "tiktok": "https://www.tiktok.com/@jovimcode?is_from_webapp=1&sender_device=pc",
      "youtube": "https://www.youtube.com/@JovimCode",
      "linkedin": ""
    },
    "contact": {
      "email": "clubai@gmail.com",
      "whatsapp1": "+257 77 165741",
      "whatsapp2": "+257 79 49 08 06",
      "site": "https://club-ai.com"
    }
  }'
```

**Résultat attendu :**
- Make affiche : `1 bundle(s) received` ✅
- Tu vois toutes les données dans le module Webhook ✅

---

### Test 2 — Test Google Sheets

**But :** Vérifier qu'une ligne est ajoutée dans le tableur.

1. Faire le test 1 avec le scénario actif
2. Ouvrir Google Sheets
3. **Vérifier qu'une nouvelle ligne a été ajoutée** avec toutes les données

**Résultat attendu :**
```
A: CLUBAI-2026-9999
B: 15/09/2026
C: Test
D: Jean
E: jean.test@gmail.com
...
P: EN ATTENTE
```
✅

---

### Test 3 — Test Gemini AI

**But :** Vérifier que Gemini génère bien un message.

1. Faire le test 1
2. Cliquer sur le **module HTTP (module 3)** dans l'historique
3. Vérifier que la réponse contient un message en français
4. Le message doit être personnalisé avec "Jean" et la formation

**Résultat attendu :**
```json
{
  "candidates": [{
    "content": {
      "parts": [{
        "text": "Jean, bienvenue dans l'aventure CLUB AI ! ..."
      }]
    }
  }]
}
```
✅

---

### Test 4 — Test Email complet

**But :** Recevoir l'email HTML sur ta boîte.

1. Modifier `email` dans le test cURL → mettre **ton vrai email**
2. Relancer le test
3. Vérifier ta boîte de réception

**Résultat attendu :**
- Email reçu avec objet : `✅ Jean, votre inscription à "MAÎTRISER CHATGPT, GEMINI & CLAUDE..." est confirmée — CLUB AI`
- Email au design premium avec couleurs `#0F172A` et `#F59E0B`
- Message Gemini personnalisé
- Bouton WhatsApp vert
- Boutons réseaux sociaux
- Pied de page CLUB AI
✅

---

### Test 5 — Test via le site réel

**But :** Tester le flux complet de bout en bout.

1. Ouvrir `http://localhost:3000/inscription`
2. Remplir le formulaire avec tes vraies informations
3. Cliquer **CONFIRMER MON INSCRIPTION**
4. Vérifier :
   - [ ] La page de confirmation s'affiche avec la référence
   - [ ] Google Sheets contient une nouvelle ligne
   - [ ] L'email de confirmation est reçu
   - [ ] L'email de notification admin est reçu
   - [ ] Make affiche `Success` dans l'historique

---

## PARTIE 11 — GESTION DES ERREURS

### Comment voir les erreurs dans Make

1. Dans Make → aller dans **History** (menu gauche)
2. Les exécutions sont listées avec :
   - ✅ Vert = succès
   - ❌ Rouge = erreur
3. Cliquer sur une exécution rouge pour voir le détail

### Erreurs fréquentes et solutions

#### Erreur : "Webhook not found"
```
Cause   : L'URL du webhook est incorrecte ou le scénario est OFF
Solution: Vérifier MAKE_WEBHOOK_URL dans .env.local
          Vérifier que le scénario est ON dans Make
```

#### Erreur : "Google Sheets — No access"
```
Cause   : La connexion Google n'est pas autorisée
Solution: Reconnecter le compte Google dans Make
          Settings → Connections → Google Sheets → Reconnect
```

#### Erreur : "HTTP 400 — Gemini API"
```
Cause   : La clé API Gemini est invalide ou expirée
Solution: Regénérer la clé sur aistudio.google.com
          Mettre à jour l'URL dans le module HTTP
```

#### Erreur : "Gmail — Quota exceeded"
```
Cause   : Limite journalière Gmail atteinte (500 emails/jour)
Solution: Attendre 24h ou utiliser un compte Google Workspace
```

#### Erreur : "Cannot read property of undefined"
```
Cause   : Une variable Make est mal mappée
Solution: Cliquer sur le module en erreur → vérifier les mappings
          Relancer avec Run once et vérifier les données reçues
```

### Relancer une exécution échouée

1. Dans **History** → cliquer sur l'exécution rouge
2. Cliquer **Re-run** (bouton en haut à droite)
3. L'exécution repart depuis le début

### Activer les notifications d'erreur

1. Make → Settings (engrenage) → **Notifications**
2. Activer **Email notifications for failed scenarios**
3. Entrer ton email : `clubai@gmail.com`
4. Tu recevras un email à chaque erreur

---

## PARTIE 12 — MAINTENANCE ET ÉVOLUTION

### Modifier le message Gemini

Le prompt est généré automatiquement par le backend.
Pour le modifier → éditer `backend/lib/make.ts` → fonction `buildGeminiPrompt()`.

### Modifier les liens WhatsApp

Dans `.env.local` du backend :
```env
WHATSAPP_GROUP_CHATGPT=https://chat.whatsapp.com/NOUVEAU_LIEN
WHATSAPP_GROUP_N8N=https://chat.whatsapp.com/NOUVEAU_LIEN
WHATSAPP_GROUP_ENTREPRENEURS=https://chat.whatsapp.com/NOUVEAU_LIEN
```
Redémarrer le backend. Aucune modification dans Make nécessaire.

### Modifier les réseaux sociaux

Dans `backend/lib/make.ts` → constante `CLUBAI_SOCIALS`.
Les nouveaux liens seront envoyés automatiquement dans le payload.
Dans Make → mettre à jour les URLs dans le template HTML de Gmail.

### Ajouter une nouvelle colonne dans Google Sheets

1. Ajouter la colonne dans Sheets
2. Dans Make → ouvrir le module Google Sheets
3. Ajouter le nouveau champ et mapper la variable
4. Sauvegarder

### Voir les statistiques d'exécution

Make → **Dashboard** → graphique des exécutions
- Nombre d'inscriptions automatisées
- Taux de succès
- Consommation d'opérations Make

---

## RÉCAPITULATIF FINAL

### Checklist de mise en production

- [ ] Compte Make créé
- [ ] Scénario créé avec les 5 modules
- [ ] URL Webhook dans `.env.local` du backend
- [ ] Google Sheets créé avec 16 colonnes
- [ ] Compte Google connecté dans Make
- [ ] Clé Gemini dans l'URL du module HTTP
- [ ] Gmail connecté dans Make
- [ ] Template HTML collé dans le module Gmail
- [ ] Variables Make mappées dans le template HTML
- [ ] Test cURL effectué avec succès
- [ ] Test via le site effectué avec succès
- [ ] Email reçu avec message Gemini
- [ ] Ligne visible dans Google Sheets
- [ ] Scénario en ON et sauvegardé

### Limites du plan Make gratuit

| Ressource | Plan Free | Plan Core (9€/mois) |
|-----------|-----------|---------------------|
| Opérations/mois | 1 000 | 10 000 |
| Scénarios actifs | 2 | Illimité |
| Intervalle min. | 15 min | 1 min |
| Historique | 30 jours | 30 jours |

> Pour CLUB AI avec ~50 inscriptions/mois :
> Chaque inscription = ~5 opérations Make.
> 50 × 5 = 250 opérations/mois → **Plan Free suffisant** ✅

---

## SUPPORT

En cas de problème :
- **Make Help Center** : https://www.make.com/en/help
- **Make Community** : https://community.make.com
- **Email CLUB AI** : clubai@gmail.com
- **WhatsApp** : +257 77 165741
