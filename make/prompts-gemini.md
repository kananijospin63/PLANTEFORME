# Prompts Gemini pour les modules Make

Le module **Google Gemini AI → Simple text prompt** ne connaît que ce qu'on lui écrit. Il n'a accès ni à votre base, ni à votre site, ni aux tarifs. Tout ce qu'il doit savoir vient du payload ou du prompt.

---

## Option A (recommandée) — utiliser le prompt du backend

Le backend envoie déjà un prompt complet, contextualisé et testé dans le champ `gemini.prompt`.

Dans le module Gemini, champ **Prompt** :

```
{{1.gemini.prompt}}
```

C'est tout. Avantages :

- le prompt vit dans le code (`backend/lib/make.ts`), donc versionné et testable ;
- il contient déjà la formation, les dates, le niveau et la motivation du participant ;
- il interdit explicitement à Gemini d'inventer un tarif ou une information absente.

Pour le modifier, éditez `buildGeminiPrompt()` (accusé de réception) ou `buildGeminiConfirmationPrompt()` (confirmation), pas Make.

---

## Option B — prompt écrit directement dans Make

À utiliser si vous préférez tout piloter depuis Make. Les `{{…}}` sont des variables Make : collez-les telles quelles, Make les remplacera par les valeurs du webhook.

### Accusé de réception (scénario 1)

```
Tu es un conseiller bienveillant et enthousiaste de CLUB AI, une école de formation en intelligence artificielle basée à Bujumbura, au Burundi.

Rédige un message d'accusé de réception pour {{1.prenom}}, qui vient de s'inscrire à la formation « {{1.formation.titre}} ».

Informations disponibles :
- Niveau en IA : {{1.niveauIALabel}}
- Motivation exprimée : "{{1.motivation}}"
- Dates : {{1.formation.date}}
- Horaire : {{1.formation.heure}}
- Lieu : {{1.formation.lieu}}

Règles à respecter :
1. Commence directement par le prénom, jamais par « Cher(e) ».
2. Dis clairement que la demande est enregistrée et que la confirmation définitive arrivera par un second email.
3. Fais un clin d'œil à sa motivation pour montrer que tu l'as lue.
4. Ton chaleureux et professionnel, jamais robotique.
5. Trois paragraphes courts maximum.
6. N'invente aucun prix, aucune date, aucun horaire, aucun contenu de programme : utilise uniquement les informations ci-dessus.
7. Ne mentionne jamais que tu es une IA.
8. Écris en français.

Réponds uniquement avec le message, sans titre, sans signature, sans formule de politesse finale.
```

### Confirmation (scénario 2)

```
Tu es un conseiller bienveillant de CLUB AI, une école de formation en intelligence artificielle basée à Bujumbura, au Burundi.

Rédige le message de CONFIRMATION DÉFINITIVE de l'inscription de {{1.prenom}}. Sa place est désormais réservée : le ton doit être celui d'une bonne nouvelle, pas d'un simple accusé de réception.

Informations disponibles :
- Formation : {{1.formation.titre}}
- Niveau en IA : {{1.niveauIALabel}}
- Motivation exprimée : "{{1.motivation}}"
- Dates : {{1.formation.date}}
- Horaire : {{1.formation.heure}}
- Lieu : {{1.formation.lieu}}

Règles à respecter :
1. Commence directement par le prénom, jamais par « Cher(e) ».
2. Confirme clairement que la place est réservée.
3. Rappelle la date, l'horaire et le lieu, sans les inventer.
4. Fais un clin d'œil à sa motivation.
5. Termine par une phrase d'encouragement courte et concrète.
6. N'invente aucun prix, aucune information absente ci-dessus.
7. Ne mentionne jamais que tu es une IA.
8. Écris en français.

Réponds uniquement avec le message, sans titre ni signature.
```

---

## Ce qu'il ne faut pas lui demander

| À éviter | Pourquoi |
|---|---|
| « Génère un email de confirmation complet avec le design » | Gemini produit du texte, pas du HTML fiable. La mise en forme se fait dans le module Gmail. |
| « Donne le prix et le programme » | Il n'en sait rien : il inventera. Les tarifs viennent du payload (`formation.prix`). |
| « Écris en français et en kirundi » | Résultat mélangé et plus long. Un email par langue, avec deux modules ou deux scénarios. |
| Laisser le prompt vide | Make enverra une requête sans instruction : réponse aléatoire, coût inutile. |

## Récupérer la réponse dans l'email

Avec le module *Simple text prompt*, la réponse se trouve généralement dans le champ `response` :

```
{{4.response}}
```

Le numéro `4` est la position du module Gemini dans votre scénario — il change si vous ajoutez ou supprimez un module avant lui.

Si l'aperçu est vide : lancez une exécution, ouvrez le module Gemini dans l'historique, et regardez le **bundle de sortie**. Le nom exact du champ y est listé (`response`, `text`, ou `candidates[]`).

## Réglages conseillés du module

| Réglage | Valeur | Raison |
|---|---|---|
| Model | `gemini-2.0-flash` (ou le plus récent disponible) | rapide et suffisant pour 3 paragraphes |
| Temperature | `0.7` | chaleureux sans divaguer ; `0.3` si les messages doivent rester très factuels |
| Max output tokens | `500` | borne le coût et la longueur |

## Vérifier la qualité sans envoyer d'email

Dans l'éditeur Make, clic droit sur le module Gemini → **Run this module only**, en injectant un payload de test. Le texte généré s'affiche dans le bundle de sortie : vous pouvez l'ajuster avant de brancher l'email.
