'use client'

// ============================================================
// /admin/inscriptions — suivi et traitement des demandes
// ============================================================

import { useEffect, useMemo, useState } from 'react'
import {
  Search,
  Download,
  Check,
  X,
  Mail,
  Phone,
  ChevronDown,
  Filter,
} from 'lucide-react'
import {
  INSCRIPTIONS,
  FORMATION_OPTIONS,
  STATUT_META,
  formatDate,
  formatFBU,
  type AdminInscription,
  type StatutInscription,
} from '@/data/admin'
import { validerInscription } from '@/services/api'

const CARD: React.CSSProperties = {
  background: '#fff',
  border: '1px solid rgba(26,16,13,.08)',
  borderRadius: 16,
  boxShadow: '0 1px 2px rgba(26,16,13,.04)',
}

const FILTRES: { valeur: 'TOUTES' | StatutInscription; label: string }[] = [
  { valeur: 'TOUTES',     label: 'Toutes' },
  { valeur: 'CONFIRMEE',  label: 'Confirmées' },
  { valeur: 'EN_ATTENTE', label: 'En attente' },
  { valeur: 'ANNULEE',    label: 'Annulées' },
]

export default function AdminInscriptionsPage() {
  const [rows, setRows] = useState<AdminInscription[]>(INSCRIPTIONS)
  const [recherche, setRecherche] = useState('')
  const [statut, setStatut] = useState<'TOUTES' | StatutInscription>('TOUTES')
  const [formation, setFormation] = useState('TOUTES')

  // Validation en cours (référence) + retour utilisateur après appel API
  const [validationEnCours, setValidationEnCours] = useState<string | null>(null)
  const [retour, setRetour] = useState<{ type: 'ok' | 'erreur'; texte: string } | null>(null)

  // Pré-filtrer depuis l'URL : /admin/inscriptions?formation=<slug>
  // (lien « Voir les inscrits » du catalogue). Le slug est validé pour
  // éviter d'afficher une liste vide sur un paramètre fantaisiste.
  useEffect(() => {
    const slug = new URLSearchParams(window.location.search).get('formation')
    if (slug && FORMATION_OPTIONS.some((f) => f.slug === slug)) {
      setFormation(slug)
    }
  }, [])

  const filtrees = useMemo(() => {
    const q = recherche.trim().toLowerCase()

    return rows.filter((row) => {
      const matchQ =
        !q ||
        `${row.prenom} ${row.nom}`.toLowerCase().includes(q) ||
        row.email.toLowerCase().includes(q) ||
        row.reference.toLowerCase().includes(q)
      const matchStatut = statut === 'TOUTES' || row.statut === statut
      const matchFormation = formation === 'TOUTES' || row.formationSlug === formation

      return matchQ && matchStatut && matchFormation
    })
  }, [rows, recherche, statut, formation])

  /**
   * Change le statut d'une inscription.
   *
   * Confirmer passe par l'API : c'est la validation qui déclenche
   * l'email de confirmation (scénario Make n°2). On n'affiche donc le
   * nouveau statut qu'après la réponse du serveur, pour ne jamais
   * montrer « confirmée » alors que l'email n'est pas parti.
   */
  async function changerStatut(row: AdminInscription, nouveau: StatutInscription) {
    // Annulation : aucun envoi d'email, simple mise à jour locale
    if (nouveau !== 'CONFIRMEE') {
      setRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, statut: nouveau } : r)))
      return
    }

    if (validationEnCours) return
    setValidationEnCours(row.reference)
    setRetour(null)

    const res = await validerInscription(row.reference)

    if (!res.success) {
      setRetour({ type: 'erreur', texte: res.error ?? 'La validation a échoué.' })
      setValidationEnCours(null)
      return
    }

    setRows((prev) =>
      prev.map((r) => (r.id === row.id ? { ...r, statut: 'CONFIRMEE' } : r))
    )

    const nomComplet = `${row.prenom} ${row.nom}`
    if (res.data?.dejaConfirmee) {
      setRetour({ type: 'ok', texte: `${nomComplet} était déjà confirmé(e) — aucun email renvoyé.` })
    } else if (res.data?.make.success) {
      setRetour({ type: 'ok', texte: `${nomComplet} confirmé(e) — email de confirmation envoyé.` })
    } else {
      setRetour({
        type: 'erreur',
        texte: `${nomComplet} confirmé(e), mais l'email n'a pas pu être envoyé. Vous pouvez réessayer.`,
      })
    }

    setValidationEnCours(null)
  }

  function exporterCSV() {
    const entetes = [
      'Référence', 'Nom', 'Prénom', 'Email', 'Téléphone',
      'Formation', 'Niveau', 'Statut', 'Date', 'Montant (FBU)',
    ]
    const lignes = filtrees.map((r) => [
      r.reference, r.nom, r.prenom, r.email, r.telephone,
      r.formation, r.niveau, STATUT_META[r.statut].label, r.date, String(r.montant),
    ])

    const csv = [entetes, ...lignes]
      .map((ligne) => ligne.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(';'))
      .join('\r\n')

    const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const lien = document.createElement('a')
    lien.href = url
    lien.download = `inscriptions-club-ai-${new Date().toISOString().slice(0, 10)}.csv`
    lien.click()
    URL.revokeObjectURL(url)
  }

  const compteur = (valeur: 'TOUTES' | StatutInscription) =>
    valeur === 'TOUTES' ? rows.length : rows.filter((r) => r.statut === valeur).length

  return (
    <div className="flex flex-col gap-4">
      {/* Barre d'outils */}
      <div className="p-4 sm:p-5" style={CARD}>
        <div className="flex flex-col lg:flex-row lg:items-center gap-3">
          {/* Recherche */}
          <div
            className="flex items-center gap-2 h-10 px-3.5 rounded-xl flex-1 min-w-0"
            style={{ background: 'rgba(26,16,13,.04)' }}
          >
            <Search size={15} style={{ color: 'rgba(26,16,13,.35)' }} aria-hidden="true" />
            <input
              type="search"
              value={recherche}
              onChange={(e) => setRecherche(e.target.value)}
              placeholder="Rechercher un nom, un email ou une référence…"
              aria-label="Rechercher une inscription"
              className="flex-1 min-w-0 bg-transparent outline-none text-[12.5px] placeholder:text-[#9a8d82]"
              style={{ color: '#1a100d' }}
            />
          </div>

          {/* Formation */}
          <div className="relative shrink-0">
            <select
              value={formation}
              onChange={(e) => setFormation(e.target.value)}
              aria-label="Filtrer par formation"
              className="h-10 pl-9 pr-8 rounded-xl text-[12.5px] outline-none appearance-none cursor-pointer"
              style={{ background: 'rgba(26,16,13,.04)', color: '#1a100d', border: 'none', minWidth: 190 }}
            >
              <option value="TOUTES">Toutes les formations</option>
              {FORMATION_OPTIONS.map((f) => (
                <option key={f.slug} value={f.slug}>{f.titre}</option>
              ))}
            </select>
            <Filter
              size={13}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: 'rgba(26,16,13,.35)' }}
              aria-hidden="true"
            />
            <ChevronDown
              size={13}
              className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: 'rgba(26,16,13,.35)' }}
              aria-hidden="true"
            />
          </div>

          {/* Export */}
          <button
            type="button"
            onClick={exporterCSV}
            className="inline-flex items-center justify-center gap-2 h-10 px-4 rounded-xl text-[12.5px] font-semibold shrink-0 transition-transform hover:-translate-y-px"
            style={{ background: '#1a100d', color: '#fff4e8' }}
          >
            <Download size={14} aria-hidden="true" />
            Exporter CSV
          </button>
        </div>

        {/* Onglets statut */}
        <div className="flex flex-wrap items-center gap-1.5 mt-3.5">
          {FILTRES.map((f) => {
            const actif = statut === f.valeur
            return (
              <button
                key={f.valeur}
                type="button"
                onClick={() => setStatut(f.valeur)}
                aria-pressed={actif}
                className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg text-[11.5px] font-semibold transition-colors"
                style={{
                  background: actif ? 'rgba(174,88,55,.1)' : 'transparent',
                  color: actif ? 'var(--copper)' : 'rgba(26,16,13,.5)',
                  border: `1px solid ${actif ? 'rgba(174,88,55,.22)' : 'rgba(26,16,13,.08)'}`,
                }}
              >
                {f.label}
                <span
                  className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                  style={{
                    background: actif ? 'rgba(174,88,55,.14)' : 'rgba(26,16,13,.05)',
                    color: actif ? 'var(--copper)' : 'rgba(26,16,13,.4)',
                  }}
                >
                  {compteur(f.valeur)}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Retour de validation */}
      {retour && (
        <div
          role="status"
          aria-live="polite"
          className="flex items-start gap-2.5 px-4 py-3 rounded-xl text-[12.5px]"
          style={{
            background: retour.type === 'ok' ? 'rgba(15,122,82,.07)' : 'rgba(161,58,47,.07)',
            border: `1px solid ${retour.type === 'ok' ? 'rgba(15,122,82,.2)' : 'rgba(161,58,47,.2)'}`,
            color: retour.type === 'ok' ? '#0f7a52' : '#a13a2f',
          }}
        >
          <span className="font-semibold shrink-0">
            {retour.type === 'ok' ? 'Validé' : 'Attention'}
          </span>
          <span className="flex-1 leading-relaxed">{retour.texte}</span>
          <button
            type="button"
            onClick={() => setRetour(null)}
            className="shrink-0 opacity-60 hover:opacity-100 transition-opacity"
            aria-label="Masquer le message"
          >
            <X size={13} />
          </button>
        </div>
      )}

      {/* Tableau */}
      <div className="overflow-hidden" style={CARD}>
        <div className="overflow-x-auto">
          <table className="w-full text-left" style={{ minWidth: 900 }}>
            <thead>
              <tr style={{ background: 'rgba(26,16,13,.02)' }}>
                {['Participant', 'Formation', 'Niveau', 'Date', 'Montant', 'Statut', 'Actions'].map((th) => (
                  <th
                    key={th}
                    className="px-4 py-3 text-[9.5px] font-bold uppercase tracking-[0.12em] whitespace-nowrap"
                    style={{ color: 'rgba(26,16,13,.4)' }}
                  >
                    {th}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtrees.map((row) => {
                const meta = STATUT_META[row.statut]
                return (
                  <tr
                    key={row.id}
                    style={{ borderTop: '1px solid rgba(26,16,13,.055)' }}
                    className="transition-colors hover:bg-black/[0.015]"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-[10.5px] font-bold shrink-0"
                          style={{ background: 'rgba(174,88,55,.1)', color: 'var(--copper)' }}
                          aria-hidden="true"
                        >
                          {row.prenom[0]}{row.nom[0]}
                        </div>
                        <div className="min-w-0">
                          <p className="text-[12.5px] font-semibold truncate" style={{ color: '#1a100d' }}>
                            {row.prenom} {row.nom}
                          </p>
                          <p className="text-[10.5px] truncate" style={{ color: 'rgba(26,16,13,.42)' }}>
                            {row.reference}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-[11.5px] max-w-[190px] truncate" style={{ color: 'rgba(26,16,13,.68)' }}>
                        {row.formation}
                      </p>
                      <p className="text-[10.5px]" style={{ color: 'rgba(26,16,13,.4)' }}>
                        {row.telephone}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-[11px] whitespace-nowrap" style={{ color: 'rgba(26,16,13,.55)' }}>
                        {row.niveau}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-[11px] whitespace-nowrap" style={{ color: 'rgba(26,16,13,.5)' }}>
                        {formatDate(row.date)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-[11.5px] font-semibold whitespace-nowrap" style={{ color: '#1a100d' }}>
                        {formatFBU(row.montant)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[10.5px] font-semibold whitespace-nowrap"
                        style={{ background: meta.fond, color: meta.couleur }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: meta.point }} aria-hidden="true" />
                        {meta.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        {row.statut !== 'CONFIRMEE' && (
                          <button
                            type="button"
                            onClick={() => changerStatut(row, 'CONFIRMEE')}
                            disabled={validationEnCours === row.reference}
                            title="Confirmer l’inscription et envoyer l’email"
                            aria-label={`Confirmer l’inscription de ${row.prenom} ${row.nom}`}
                            className="p-1.5 rounded-lg transition-colors hover:bg-[rgba(15,122,82,.1)] disabled:opacity-40 disabled:cursor-wait"
                            style={{ color: '#0f7a52' }}
                          >
                            <Check size={14} />
                          </button>
                        )}
                        {row.statut !== 'ANNULEE' && (
                          <button
                            type="button"
                            onClick={() => changerStatut(row, 'ANNULEE')}
                            title="Annuler l’inscription"
                            aria-label={`Annuler l’inscription de ${row.prenom} ${row.nom}`}
                            className="p-1.5 rounded-lg transition-colors hover:bg-[rgba(161,58,47,.1)]"
                            style={{ color: '#a13a2f' }}
                          >
                            <X size={14} />
                          </button>
                        )}
                        <a
                          href={`mailto:${row.email}`}
                          title="Envoyer un email"
                          aria-label={`Envoyer un email à ${row.prenom} ${row.nom}`}
                          className="p-1.5 rounded-lg transition-colors hover:bg-black/5"
                          style={{ color: 'rgba(26,16,13,.45)' }}
                        >
                          <Mail size={14} />
                        </a>
                        <a
                          href={`https://wa.me/${row.telephone.replace(/[^\d]/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Contacter sur WhatsApp"
                          aria-label={`Contacter ${row.prenom} ${row.nom} sur WhatsApp`}
                          className="p-1.5 rounded-lg transition-colors hover:bg-black/5"
                          style={{ color: 'rgba(26,16,13,.45)' }}
                        >
                          <Phone size={14} />
                        </a>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {filtrees.length === 0 && (
          <div className="px-6 py-14 text-center">
            <p className="text-[13px] font-semibold mb-1" style={{ color: '#1a100d' }}>
              Aucune inscription ne correspond
            </p>
            <p className="text-[12px]" style={{ color: 'rgba(26,16,13,.45)' }}>
              Modifiez votre recherche ou réinitialisez les filtres.
            </p>
            <button
              type="button"
              onClick={() => { setRecherche(''); setStatut('TOUTES'); setFormation('TOUTES') }}
              className="mt-4 h-9 px-4 rounded-xl text-[12px] font-semibold"
              style={{ background: 'rgba(26,16,13,.05)', color: 'rgba(26,16,13,.7)' }}
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}

        <div
          className="flex items-center justify-between px-4 sm:px-5 py-3 text-[11.5px]"
          style={{ borderTop: '1px solid rgba(26,16,13,.07)', color: 'rgba(26,16,13,.45)' }}
        >
          <span>
            {filtrees.length} inscription{filtrees.length > 1 ? 's' : ''} affichée{filtrees.length > 1 ? 's' : ''} sur {rows.length}
          </span>
          <span>Données de démonstration</span>
        </div>
      </div>
    </div>
  )
}
