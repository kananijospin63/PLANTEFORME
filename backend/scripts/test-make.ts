// ============================================================
// scripts/test-make.ts — Test du chemin d'envoi vers Make
// ============================================================
// Construit un payload avec le VRAI builder du backend puis
// l'envoie au webhook Make, sans passer par PostgreSQL.
//
// Usage :
//   npm run test:make
//   npm run test:make -- CLUBAI-2026-0123 mon@adresse.com
// ============================================================

// Charge .env.local AVANT lib/make.ts (qui lit process.env à l'import)
import './load-env'

import {
  buildMakePayload,
  sendRegistrationToMake,
  isMakeConfigured,
} from '@/lib/make'

const reference =
  process.argv[2] ?? `CLUBAI-2026-${String(Math.floor(Math.random() * 9000) + 1000)}`
const email = process.argv[3] ?? 'clubai@gmail.com'

async function main(): Promise<void> {
  if (!isMakeConfigured()) {
    console.error('MAKE_WEBHOOK_URL est absente : impossible de tester.')
    process.exit(1)
  }

  const payload = buildMakePayload({
    reference,
    nom:           'Test',
    prenom:        'Verification',
    email,
    telephone:     '+257 77 165741',
    fonction:      'Testeur',
    entreprise:    'CLUB AI',
    niveauIA:      'DEBUTANT',
    formationTitre: "MAÎTRISER CHATGPT, GEMINI & CLAUDE ET CRÉER DES VIDÉOS AVEC L'IA",
    formationSlug:  'maitriser-chatgpt-gemini-claude',
    date:          '01 – 05 DÉCEMBRE 2026',
    heureDebut:    '15H30',
    heureFin:      '19H30',
    lieuNom:       'Centre CEPRODILUC',
    lieuVille:     'Bujumbura',
    prix:          '150 000 FBU',
    motivation:    "Test technique de l'automatisation Make.",
    createdAt:     new Date().toISOString(),
  })

  console.log('Référence :', reference)
  console.log('Destinataire :', email)
  console.log('Champs du payload :', Object.keys(payload).length, 'racine,', Object.keys(payload.sheets).length, 'colonnes Sheets')
  console.log('Envoi vers Make…')

  const result = await sendRegistrationToMake(payload)

  if (result.success) {
    console.log('SUCCES — le webhook a accepté le payload (HTTP 2xx).')
    console.log('Vérifier maintenant dans Make : History → dernière exécution.')
  } else {
    console.log('ECHEC —', result.error)
    process.exit(1)
  }
}

main().catch((err) => {
  console.error('Erreur inattendue :', err)
  process.exit(1)
})
