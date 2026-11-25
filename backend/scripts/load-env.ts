// ============================================================
// scripts/load-env.ts — Charge .env.local pour les scripts ts-node
// ============================================================
// Les scripts hors Next.js ne bénéficient pas du chargement
// automatique des fichiers .env : ce module comble le manque.
// À importer EN PREMIER, avant tout module qui lit process.env
// à son initialisation (c'est le cas de lib/make.ts).
// ============================================================

import { existsSync, readFileSync } from 'fs'
import { resolve } from 'path'

const FILES = ['.env.local', '.env']

for (const file of FILES) {
  const path = resolve(process.cwd(), file)
  if (!existsSync(path)) continue

  for (const line of readFileSync(path, 'utf8').split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/)
    if (!match) continue

    const [, key, raw] = match
    if (process.env[key] !== undefined) continue

    process.env[key] = raw.trim().replace(/^["']|["']$/g, '')
  }
}
