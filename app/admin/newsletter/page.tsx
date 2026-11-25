'use client'

// ============================================================
// /admin/newsletter — campagne email vers les inscrits du site
// ============================================================

import { useMemo, useState } from 'react'
import {
  Send,
  Users,
  Mail,
  MousePointerClick,
  Check,
  AlertCircle,
  Eye,
  Sparkles,
  Loader2,
} from 'lucide-react'
import {
  INSCRIPTIONS,
  FORMATION_OPTIONS,
  NEWSLETTERS,
  AUDIENCE_LABEL,
  destinataires,
  formatHeure,
  type AudienceId,
  type Newsletter,
} from '@/data/admin'

const CARD: React.CSSProperties = {
  background: '#fff',
  border: '1px solid rgba(26,16,13,.08)',
  borderRadius: 16,
  boxShadow: '0 1px 2px rgba(26,16,13,.04)',
}

const AUDIENCES: AudienceId[] = ['TOUS', 'CONFIRMES', 'ATTENTE', 'FORMATION']

const MODELE = `Bonjour,

La session du 14 au 19 décembre approche. Voici les informations essentielles pour préparer votre participation.

• Lieu : Centre CEPRODILUC, Bujumbura
• Horaires : 15h00 – 19h00
• À apporter : un ordinateur portable et une connexion internet

Répondez directement à cet email si vous avez la moindre question.

À très bientôt,
L'équipe CLUB AI`

export default function AdminNewsletterPage() {
  const [audience, setAudience] = useState<AudienceId>('TOUS')
  const [formation, setFormation] = useState(FORMATION_OPTIONS[0]?.slug ?? '')
  const [objet, setObjet] = useState('')
  const [message, setMessage] = useState('')
  const [envoi, setEnvoi] = useState(false)
  const [succes, setSucces] = useState<string | null>(null)
  const [erreur, setErreur] = useState<string | null>(null)
  const [historique, setHistorique] = useState<Newsletter[]>(NEWSLETTERS)

  const cible = useMemo(
    () => destinataires(audience, audience === 'FORMATION' ? formation : undefined),
    [audience, formation]
  )

  const destinatairesUniques = useMemo(
    () => new Set(cible.map((c) => c.email)).size,
    [cible]
  )

  const moyenOuverture = Math.round(
    historique.reduce((s, n) => s + n.ouverture, 0) / Math.max(historique.length, 1)
  )

  function envoyer(event: React.FormEvent) {
    event.preventDefault()
    setSucces(null)
    setErreur(null)

    if (!objet.trim()) {
      setErreur('Indiquez un objet pour votre campagne.')
      return
    }
    if (message.trim().length < 20) {
      setErreur('Le message est trop court (20 caractères minimum).')
      return
    }
    if (destinatairesUniques === 0) {
      setErreur('Aucun destinataire ne correspond à cette audience.')
      return
    }

    setEnvoi(true)

    window.setTimeout(() => {
      const campagne: Newsletter = {
        id: `nl-${historique.length + 5}`,
        objet: objet.trim(),
        apercu: message.trim().slice(0, 120),
        date: new Date().toISOString(),
        destinataires: destinatairesUniques,
        ouverture: 0,
        clics: 0,
        statut: 'ENVOYEE',
      }

      setHistorique((prev) => [campagne, ...prev])
      setEnvoi(false)
      setSucces(`Campagne envoyée à ${destinatairesUniques} destinataire${destinatairesUniques > 1 ? 's' : ''} (démonstration).`)
      setObjet('')
      setMessage('')
    }, 1200)
  }

  function insererModele() {
    setMessage(MODELE)
    if (!objet) setObjet('Préparer la session du 14 décembre')
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Indicateurs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Inscrits sur le site', valeur: String(INSCRIPTIONS.length), icon: Users },
          { label: 'Taux d’ouverture moyen', valeur: `${moyenOuverture} %`, icon: Mail },
          { label: 'Campagnes envoyées', valeur: String(historique.length), icon: Send },
        ].map((item) => {
          const Icon = item.icon
          return (
            <div key={item.label} className="p-5 flex items-center gap-3.5" style={CARD}>
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: 'rgba(174,88,55,.08)' }}
                aria-hidden="true"
              >
                <Icon size={17} style={{ color: 'var(--copper)' }} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] mb-1" style={{ color: 'rgba(26,16,13,.4)' }}>
                  {item.label}
                </p>
                <p className="text-[17px] leading-none" style={{ fontFamily: 'var(--font-unbounded)', fontWeight: 700, color: '#1a100d' }}>
                  {item.valeur}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Composeur + aperçu */}
      <div className="grid grid-cols-1 xl:grid-cols-[1.35fr_1fr] gap-4 items-start">
        <form onSubmit={envoyer} className="p-5 sm:p-6 flex flex-col gap-5" style={CARD}>
          <div>
            <h2 className="text-[14px] font-bold mb-1" style={{ color: '#1a100d' }}>
              Nouvelle campagne
            </h2>
            <p className="text-[11.5px]" style={{ color: 'rgba(26,16,13,.45)' }}>
              Le message est envoyé par email à tous les inscrits du site
              correspondant à l’audience choisie.
            </p>
          </div>

          {/* Audience */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: 'rgba(26,16,13,.45)' }}>
              Destinataires
            </label>
            <div className="flex flex-wrap gap-1.5">
              {AUDIENCES.map((id) => {
                const actif = audience === id
                const total = destinataires(id, id === 'FORMATION' ? formation : undefined).length
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setAudience(id)}
                    aria-pressed={actif}
                    className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg text-[11.5px] font-semibold transition-colors"
                    style={{
                      background: actif ? 'rgba(174,88,55,.1)' : 'transparent',
                      color: actif ? 'var(--copper)' : 'rgba(26,16,13,.5)',
                      border: `1px solid ${actif ? 'rgba(174,88,55,.22)' : 'rgba(26,16,13,.08)'}`,
                    }}
                  >
                    {AUDIENCE_LABEL[id]}
                    <span
                      className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                      style={{
                        background: actif ? 'rgba(174,88,55,.14)' : 'rgba(26,16,13,.05)',
                        color: actif ? 'var(--copper)' : 'rgba(26,16,13,.4)',
                      }}
                    >
                      {total}
                    </span>
                  </button>
                )
              })}
            </div>

            {audience === 'FORMATION' && (
              <select
                value={formation}
                onChange={(e) => setFormation(e.target.value)}
                aria-label="Choisir la formation"
                className="mt-2.5 w-full h-10 px-3 rounded-xl text-[12.5px] outline-none cursor-pointer"
                style={{ background: 'rgba(26,16,13,.04)', color: '#1a100d', border: 'none' }}
              >
                {FORMATION_OPTIONS.map((f) => (
                  <option key={f.slug} value={f.slug}>{f.titre}</option>
                ))}
              </select>
            )}
          </div>

          {/* Objet */}
          <div>
            <label htmlFor="nl-objet" className="block text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: 'rgba(26,16,13,.45)' }}>
              Objet
            </label>
            <input
              id="nl-objet"
              type="text"
              value={objet}
              onChange={(e) => setObjet(e.target.value)}
              placeholder="Ex. : Préparer la session du 14 décembre"
              maxLength={120}
              className="w-full h-11 px-3.5 rounded-xl text-[12.5px] outline-none"
              style={{ background: 'rgba(26,16,13,.04)', color: '#1a100d', border: '1px solid transparent' }}
            />
          </div>

          {/* Message */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="nl-message" className="block text-[10px] font-bold uppercase tracking-wider" style={{ color: 'rgba(26,16,13,.45)' }}>
                Message
              </label>
              <button
                type="button"
                onClick={insererModele}
                className="inline-flex items-center gap-1 text-[11px] font-semibold transition-colors hover:opacity-70"
                style={{ color: 'var(--copper)' }}
              >
                <Sparkles size={11} aria-hidden="true" />
                Insérer un modèle
              </button>
            </div>
            <textarea
              id="nl-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={9}
              maxLength={4000}
              placeholder="Écrivez votre message…"
              className="w-full px-3.5 py-3 rounded-xl text-[12.5px] leading-relaxed outline-none resize-y"
              style={{ background: 'rgba(26,16,13,.04)', color: '#1a100d', border: '1px solid transparent' }}
            />
            <p className="text-[10.5px] mt-1 text-right" style={{ color: 'rgba(26,16,13,.35)' }}>
              {message.length} / 4000 caractères
            </p>
          </div>

          {erreur && (
            <div
              role="alert"
              className="flex items-start gap-2 px-3.5 py-2.5 rounded-xl text-[12px]"
              style={{ background: 'rgba(161,58,47,.08)', border: '1px solid rgba(161,58,47,.2)', color: '#a13a2f' }}
            >
              <AlertCircle size={14} className="shrink-0 mt-0.5" aria-hidden="true" />
              {erreur}
            </div>
          )}

          {succes && (
            <div
              role="status"
              className="flex items-start gap-2 px-3.5 py-2.5 rounded-xl text-[12px]"
              style={{ background: 'rgba(15,122,82,.09)', border: '1px solid rgba(15,122,82,.2)', color: '#0f7a52' }}
            >
              <Check size={14} className="shrink-0 mt-0.5" aria-hidden="true" />
              {succes}
            </div>
          )}

          {/* Envoi */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-1">
            <button
              type="submit"
              disabled={envoi}
              className="inline-flex items-center justify-center gap-2 h-11 px-5 rounded-xl text-[12.5px] font-bold transition-transform hover:-translate-y-px disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              style={{
                fontFamily: 'var(--font-unbounded)',
                background: 'linear-gradient(135deg,var(--gold),var(--copper))',
                color: '#1a100d',
                boxShadow: '0 4px 16px rgba(174,88,55,.3)',
              }}
            >
              {envoi ? (
                <>
                  <Loader2 size={14} className="animate-spin" aria-hidden="true" />
                  Envoi en cours…
                </>
              ) : (
                <>
                  <Send size={14} aria-hidden="true" />
                  Envoyer à {destinatairesUniques} destinataire{destinatairesUniques > 1 ? 's' : ''}
                </>
              )}
            </button>
            <p className="text-[11px]" style={{ color: 'rgba(26,16,13,.4)' }}>
              Démonstration : aucun email réel n’est expédié.
            </p>
          </div>
        </form>

        {/* Aperçu */}
        <div className="flex flex-col gap-4">
          <div style={CARD} className="overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-3.5" style={{ borderBottom: '1px solid rgba(26,16,13,.07)' }}>
              <Eye size={13} style={{ color: 'rgba(26,16,13,.4)' }} aria-hidden="true" />
              <p className="text-[11px] font-bold uppercase tracking-[0.12em]" style={{ color: 'rgba(26,16,13,.45)' }}>
                Aperçu de l’email
              </p>
            </div>

            <div className="p-5">
              <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(26,16,13,.08)' }}>
                {/* En-tête email */}
                <div className="px-5 py-4" style={{ background: '#1a100d' }}>
                  <p className="text-[13px]" style={{ fontFamily: 'var(--font-unbounded)', fontWeight: 700, color: '#fff4e8' }}>
                    CLUB <span style={{ color: 'var(--gold)' }}>AI</span>
                  </p>
                  <p className="text-[9px] mt-0.5" style={{ color: 'rgba(239,201,140,.55)', letterSpacing: '.12em', textTransform: 'uppercase' }}>
                    Formations en intelligence artificielle
                  </p>
                </div>

                <div className="px-5 py-4 bg-white">
                  <p className="text-[13px] font-bold mb-3" style={{ color: '#1a100d' }}>
                    {objet.trim() || 'Votre objet apparaîtra ici'}
                  </p>
                  <p
                    className="text-[11.5px] leading-relaxed whitespace-pre-wrap"
                    style={{ color: 'rgba(26,16,13,.6)', minHeight: 120 }}
                  >
                    {message.trim() || 'Votre message apparaîtra ici. Utilisez « Insérer un modèle » pour partir d’une base.'}
                  </p>
                </div>

                <div className="px-5 py-3" style={{ background: 'rgba(26,16,13,.03)', borderTop: '1px solid rgba(26,16,13,.06)' }}>
                  <p className="text-[9.5px] leading-relaxed" style={{ color: 'rgba(26,16,13,.35)' }}>
                    CLUB AI · Centre CEPRODILUC, Bujumbura · Vous recevez cet email
                    car vous êtes inscrit à une formation.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-5" style={CARD}>
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] mb-2" style={{ color: 'rgba(26,16,13,.45)' }}>
              Audience sélectionnée
            </p>
            <p className="text-[12.5px] font-semibold mb-1" style={{ color: '#1a100d' }}>
              {AUDIENCE_LABEL[audience]}
              {audience === 'FORMATION' && (
                <> — {FORMATION_OPTIONS.find((f) => f.slug === formation)?.titre}</>
              )}
            </p>
            <p className="text-[11.5px]" style={{ color: 'rgba(26,16,13,.45)' }}>
              {destinatairesUniques} adresse{destinatairesUniques > 1 ? 's' : ''} email unique
              {destinatairesUniques > 1 ? 's' : ''} sur {INSCRIPTIONS.length} inscrits.
            </p>
          </div>
        </div>
      </div>

      {/* Historique */}
      <div className="overflow-hidden" style={CARD}>
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid rgba(26,16,13,.07)' }}>
          <h2 className="text-[14px] font-bold" style={{ color: '#1a100d' }}>
            Campagnes envoyées
          </h2>
          <span className="text-[11px]" style={{ color: 'rgba(26,16,13,.4)' }}>
            {historique.length} campagne{historique.length > 1 ? 's' : ''}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left" style={{ minWidth: 640 }}>
            <thead>
              <tr style={{ background: 'rgba(26,16,13,.02)' }}>
                {['Objet', 'Envoyée le', 'Destinataires', 'Ouverture', 'Clics'].map((th) => (
                  <th
                    key={th}
                    className="px-5 py-2.5 text-[9.5px] font-bold uppercase tracking-[0.12em] whitespace-nowrap"
                    style={{ color: 'rgba(26,16,13,.4)' }}
                  >
                    {th}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {historique.map((nl) => (
                <tr key={nl.id} style={{ borderTop: '1px solid rgba(26,16,13,.055)' }}>
                  <td className="px-5 py-3">
                    <p className="text-[12.5px] font-semibold" style={{ color: '#1a100d' }}>
                      {nl.objet}
                    </p>
                    <p className="text-[10.5px] truncate max-w-[380px]" style={{ color: 'rgba(26,16,13,.42)' }}>
                      {nl.apercu}
                    </p>
                  </td>
                  <td className="px-5 py-3">
                    <span className="text-[11.5px] whitespace-nowrap" style={{ color: 'rgba(26,16,13,.5)' }}>
                      {formatHeure(nl.date)}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span className="text-[11.5px] font-semibold" style={{ color: 'rgba(26,16,13,.65)' }}>
                      {nl.destinataires}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className="inline-flex items-center gap-1.5 text-[11.5px] font-semibold"
                      style={{ color: nl.ouverture === 0 ? 'rgba(26,16,13,.35)' : '#0f7a52' }}
                    >
                      <Mail size={11} aria-hidden="true" />
                      {nl.ouverture === 0 ? 'En cours' : `${nl.ouverture} %`}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className="inline-flex items-center gap-1.5 text-[11.5px] font-semibold"
                      style={{ color: nl.clics === 0 ? 'rgba(26,16,13,.35)' : 'var(--copper)' }}
                    >
                      <MousePointerClick size={11} aria-hidden="true" />
                      {nl.clics}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
