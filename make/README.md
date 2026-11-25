# Automatisation des messages — Make

Deux scénarios Make envoient les emails de la plateforme CLUB AI.

| Scénario | Déclencheur | Modules | Email envoyé |
|---|---|---|---|
| **01 — Accusé de réception** | `POST /api/inscriptions` (inscription créée) | Webhook → Google Sheets → Gemini → Gmail | « Inscription reçue, en attente de validation » |
| **02 — Confirmation** | `POST /api/inscriptions/{ref}/valider` (bouton **Confirmer** dans `/admin/inscriptions`) | Webhook → Gemini → Gmail | « Votre place est confirmée » |

Le backend envoie le payload ; Make ne fait que le mettre en forme. Aucun appel Make n'est bloquant : si Make est indisponible, l'inscription et la validation restent enregistrées en base.

---

## 1. Prérequis

- Un compte Make (région `eu1`, `eu2` ou `com` — peu importe)
- Un compte Google avec le tableur des inscriptions **et** l'adresse Gmail expéditrice
- Une clé API Gemini : <https://aistudio.google.com/app/apikey>

---

## 2. Import des blueprints

1. Dans Make : **Scenarios → Create a new scenario**
2. Menu **⋯** (en bas de l'éditeur) → **Import Blueprint**
3. Choisir `blueprint-01-accuse-reception.json`
4. Répéter pour `blueprint-02-confirmation.json`

> L'import recrée la structure du scénario, **pas les autorisations**. Les modules Google et le webhook apparaissent en rouge : c'est normal, voir l'étape 3.

---

## 3. Ce qu'il faut re-sélectionner après import

Les valeurs `REMPLACER_PAR_…` du blueprint sont des marqueurs, pas des secrets. À remplacer dans l'éditeur Make :

| Module | Champ | À faire |
|---|---|---|
| Webhook (scénario 1) | Webhook | Créer un nouveau webhook, copier l'URL → `MAKE_WEBHOOK_URL` |
| Webhook (scénario 2) | Webhook | Créer un **second** webhook, copier l'URL → `MAKE_WEBHOOK_VALIDATION_URL` |
| Google Sheets | Connexion | Se connecter avec le compte Google propriétaire du tableur |
| Google Sheets | Spreadsheet / Sheet | Choisir le fichier et l'onglet |
| HTTP (Gemini) | Header `x-goog-api-key` | Coller la clé Gemini |
| Gmail | Connexion | Se connecter avec l'adresse expéditrice |
| Gmail | `From` / `Name` | Adresse expéditrice + `CLUB AI` |

**Les deux webhooks sont différents** : le backend les appelle séparément, un seul ne suffit pas.

---

## 4. Variables d'environnement

Dans `backend/.env.local` :

```bash
MAKE_WEBHOOK_URL=https://hook.eu1.make.com/xxxxxxxxxxxxxxxx   # scénario 1
MAKE_WEBHOOK_VALIDATION_URL=https://hook.eu1.make.com/yyyyyyyyyyyyyyyy  # scénario 2
GEMINI_API_KEY=...        # utilisée par Make, pas par le backend
GOOGLE_SHEET_ID=...       # pour référence, Make la choisit dans son interface
```

Redémarrer le backend après modification (`npm run dev` dans `backend/`).

Si `MAKE_WEBHOOK_VALIDATION_URL` est absente, la validation fonctionne toujours : le statut passe à `CONFIRMEE`, seul l'email n'est pas envoyé. L'API répond alors explicitement « email non envoyé ».

---

## 5. Structure de la feuille Google Sheets

Le fichier `inscriptions-modele.csv` contient la structure exacte attendue par le scénario 1.

### Import (3 clics)

1. Ouvrir <https://sheets.new> → nommer le fichier `CLUB AI – Inscriptions 2026`
2. **Fichier → Importer → Importer un fichier** → glisser `inscriptions-modele.csv`
3. Type de séparation : **Virgule** → **Importer les données**

La ligne `CLUBAI-2026-0000` est un exemple de contrôle : vérifiez que les 16 valeurs tombent bien dans les 16 colonnes, puis **supprimez cette ligne**. L'onglet peut ensuite être renommé (ex. `Inscriptions`).

### Colonnes (l'ordre compte)

Le scénario 1 écrit **par position** : la colonne A reçoit `reference`, la B `dateInscription`, etc.

| # | Colonne | Source du payload |
|---|---|---|
| A | `reference` | `reference` |
| B | `dateInscription` | `sheets.dateInscription` |
| C | `nom` | `nom` |
| D | `prenom` | `prenom` |
| E | `email` | `email` |
| F | `telephone` | `telephone` |
| G | `fonction` | `fonction` |
| H | `entreprise` | `entreprise` |
| I | `niveauIA` | `sheets.niveauIA` |
| J | `formation` | `sheets.formation` |
| K | `dateFormation` | `sheets.dateFormation` |
| L | `heure` | `sheets.heure` |
| M | `lieu` | `sheets.lieu` |
| N | `prix` | `sheets.prix` |
| O | `motivation` | `sheets.motivation` |
| P | `statut` | `sheets.statut` (`EN ATTENTE`) |

### Conseils

- **Figer la ligne 1** (Affichage → Figer → 1 ligne) : les en-têtes restent visibles.
- **Liste déroulante sur la colonne P** : Données → Validation des données → Liste → `EN ATTENTE, CONFIRMEE, ANNULEE`.
- Ne pas insérer ni déplacer de colonne : le scénario 1 écrit par position, un décalage décale toutes les valeurs suivantes.

---

## 6. Tester

**Scénario 1** — depuis le site, remplir une inscription. Vérifier :
1. une ligne apparaît dans Google Sheets
2. l'email arrive (vérifier les spams la première fois)
3. dans les logs backend : `Make — inscription envoyée` avec la référence

**Scénario 2** — dans `/admin/inscriptions`, cliquer sur ✓ sur une inscription en attente. Vérifier :
1. le bandeau affiche « confirmé — email de confirmation envoyé »
2. le second email arrive
3. en base : `statut = CONFIRMEE` et `makeNotified = true`

Test manuel sans le frontend :

```bash
curl -X POST http://localhost:3001/api/inscriptions/CLUBAI-2026-0001/valider
```

Réponse attendue : `{"success":true,"data":{"reference":"…","statut":"CONFIRMEE","dejaConfirmee":false,"make":{"success":true}},"message":"…"}`

L'appel est **idempotent** : relancer la commande renvoie `dejaConfirmee: true` sans second email.

---

## 7. Dépannage

| Symptôme | Cause probable | Correction |
|---|---|---|
| `MAKE_WEBHOOK_URL non configuré` | Variable absente ou backend non redémarré | Renseigner `.env.local`, redémarrer |
| `Make HTTP 410` | Webhook supprimé côté Make | Recréer le webhook, mettre à jour l'URL |
| `Make HTTP 422` | Module en erreur dans le scénario | Ouvrir **History** dans Make pour voir le module fautif |
| Email vide à la place du texte Gemini | Expression de réponse mal résolue | Dans Gmail, remettre `{{2.data.candidates[1].content.parts[1].text}}` (scénario 2) / `{{3.…}}` (scénario 1) |
| Le module Sheets ne s'importe pas | Version de module indisponible sur votre compte | Recréer le module **Add a Row** à la main et remapper les 16 colonnes du tableau §5 |
| `make.success: false` mais statut `CONFIRMEE` | Comportement normal en cas d'échec Make | Corriger Make puis revalider : un second appel renvoie l'email |

---

## 8. Optionnel — synchroniser le statut dans Sheets

Le scénario 2 n'écrit pas dans Google Sheets : si vous voulez que la colonne `statut` passe à `CONFIRMEE`, ajoutez deux modules **entre le Webhook et le HTTP** :

1. **Google Sheets → Search Rows** — filtre : colonne `A` égale à `{{1.reference}}`
2. **Google Sheets → Update a Row** — `Row number` = `{{2.rowNumber}}`, colonne `P` = `{{1.sheets.statut}}`

Le payload fournit déjà `sheets.reference`, `sheets.statut` et `sheets.dateConfirmation` pour ces deux modules.

---

## 9. Modifier les messages

Trois niveaux, du plus simple au plus fin :

- **Texte rédigé par Gemini** : c'est le champ `gemini.prompt` du payload, généré dans `backend/lib/make.ts` (`buildGeminiPrompt` pour l'accusé de réception, `buildGeminiConfirmationPrompt` pour la confirmation).
- **Mise en page HTML** : directement dans le module Gmail, ou dans les blueprints (§ corps `content`).
- **Objet de l'email** : champ `subject` du module Gmail.

Le prompt de confirmation interdit explicitement à Gemini d'inventer un tarif ou une information absente : gardez cette consigne si vous le réécrivez.

---

## 10. Adapter le scénario déjà construit (6 modules)

Le scénario `8767580` existant suit cette structure :

| # | Module | Rôle |
|---|---|---|
| 1 | Nouvelle inscription — Custom webhook | reçoit le payload du backend |
| 2 | Contrôle doublon — Data store : Check the existence of a record | évite le double traitement |
| 3 | Verrou référence — Data store : Add/replace a record | réserve la référence |
| 4 | Ajouter inscription — Google Sheets : Add a Row | écrit la ligne du registre |
| 5 | Accusé réception — Gmail : Send an email | envoie l'email |

Il manque **une seule étape** par rapport au blueprint : le module Gemini. Sans lui, l'email ne peut contenir qu'un texte figé — c'est la partie « message personnalisé » de l'automatisation.

### 10.1 Corriger l'en-tête de la feuille

Dans `Feuille 1`, la cellule **B1 contient `reference`**, en doublon avec A1. Elle doit contenir `dateInscription` :

```
A1 reference | B1 dateInscription | C1 nom | D1 prenom | E1 email | F1 telephone
G1 fonction  | H1 entreprise      | I1 niveauIA | J1 formation | K1 dateFormation
L1 heure     | M1 lieu            | N1 prix | O1 motivation | P1 statut
```

Sans cette correction, la date d'inscription s'affiche sous un en-tête « reference » et la colonne B devient illisible pour un humain (les données, elles, restent à la bonne place : Make écrit par position).

### 10.2 Re-déterminer la structure du webhook

Si le scénario a été créé avant l'ajout des champs `sheets`, `gemini` et `whatsappGroupUrl`, ces variables n'existent pas encore dans Make.

1. Ouvrir le module **Nouvelle inscription** → bouton **Re-determine data structure** (Make attend un appel)
2. Envoyer le payload de test :

```bash
curl -X POST "https://hook.eu1.make.com/VOTRE_HOOK" \
  -H "Content-Type: application/json" \
  --data @make/payload-test.json
```

3. Les 22 champs racine apparaissent, dont `sheets` (16 sous-champs) et `gemini`.

> `payload-test.json` utilise la référence `CLUBAI-2026-0001`. Si le data store la connaît déjà, le module 2 bloquera l'exécution : changez la valeur de `reference` (et `email`) avant chaque nouveau test.

### 10.3 Remapper le module « Ajouter inscription »

Les 16 colonnes, dans l'ordre de la feuille :

| Col | Champ Make | Expression |
|---|---|---|
| A | reference | `{{1.reference}}` |
| B | dateInscription | `{{1.sheets.dateInscription}}` |
| C | nom | `{{1.nom}}` |
| D | prenom | `{{1.prenom}}` |
| E | email | `{{1.email}}` |
| F | telephone | `{{1.telephone}}` |
| G | fonction | `{{1.fonction}}` |
| H | entreprise | `{{1.entreprise}}` |
| I | niveauIA | `{{1.sheets.niveauIA}}` |
| J | formation | `{{1.sheets.formation}}` |
| K | dateFormation | `{{1.sheets.dateFormation}}` |
| L | heure | `{{1.sheets.heure}}` |
| M | lieu | `{{1.sheets.lieu}}` |
| N | prix | `{{1.sheets.prix}}` |
| O | motivation | `{{1.sheets.motivation}}` |
| P | statut | `{{1.sheets.statut}}` |

### 10.4 Insérer le module Gemini

Entre **Ajouter inscription** et **Accusé réception**, cliquer sur le `+` et ajouter **HTTP → Make a request** :

| Champ | Valeur |
|---|---|
| URL | `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent` |
| Method | `POST` |
| Headers | `Content-Type: application/json` et `x-goog-api-key: VOTRE_CLE_GEMINI` |
| Body type | `Raw` |
| Content type | `JSON (application/json)` |
| Request content | `{"contents":[{"parts":[{"text":"{{1.gemini.prompt}}"}]}]}` |
| Parse response | activé |

Le texte généré est alors disponible sous `{{6.data.candidates[1].content.parts[1].text}}` (le numéro dépend de la position réelle du module).

Puis dans **Accusé réception**, remplacer le corps statique par le HTML du blueprint `blueprint-01-accuse-reception.json` (champ `content` du module Gmail), en ajustant les numéros de module si besoin.

### 10.5 Créer le scénario de confirmation

Le scénario 2 est indépendant : importer `blueprint-02-confirmation.json`, créer **son propre webhook**, puis renseigner son URL dans `MAKE_WEBHOOK_VALIDATION_URL`. Tant que cette variable est vide, le bouton ✓ de `/admin/inscriptions` confirme bien l'inscription mais n'envoie pas d'email (l'API le signale explicitement).
