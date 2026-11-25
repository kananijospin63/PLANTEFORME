'use client'

// ============================================================
// RegistrationForm — Formulaire d'inscription complet
// ============================================================

import { useState, useCallback, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { User, Briefcase, BookOpen, MessageSquare, Shield } from 'lucide-react'
import FormField from '@/components/form/FormField'
import SelectField from '@/components/form/SelectField'
import TextareaField from '@/components/form/TextareaField'
import CheckboxField from '@/components/form/CheckboxField'
import Button from '@/components/ui/Button'
import ErrorMessage from '@/components/ui/ErrorMessage'
import { submitRegistration } from '@/services/api'
import { FORMATION_SELECT_OPTIONS, NIVEAU_IA_OPTIONS } from '@/data/formations'
import type {
  RegistrationFormData,
  FormErrors,
  FormStatus,
  NiveauIA,
} from '@/types'

// ── Valeurs initiales ──
/** Âge minimum pour suivre une formation — doit rester aligné sur le backend. */
const AGE_MINIMUM = 18

/**
 * Date maximale sélectionnable dans le calendrier : aujourd'hui moins
 * 18 ans. Empêche de choisir une date qui rendrait le formulaire
 * invalide après coup.
 */
function dateMaxNaissance(): string {
  const d = new Date()
  d.setFullYear(d.getFullYear() - AGE_MINIMUM)
  const mois = String(d.getMonth() + 1).padStart(2, '0')
  const jour = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${mois}-${jour}`
}

const INITIAL_FORM: RegistrationFormData = {
  nom: '',
  prenom: '',
  dateNaissance: '',
  email: '',
  telephone: '',
  profession: '',
  entreprise: '',
  niveauIA: '',
  formationChoisie: '',
  motivation: '',
  consentement: false,
}

// ── Validation ──
function validate(data: RegistrationFormData): FormErrors {
  const errors: FormErrors = {}

  if (!data.nom.trim()) {
    errors.nom = 'Veuillez renseigner votre nom.'
  }

  if (!data.prenom.trim()) {
    errors.prenom = 'Veuillez renseigner votre prénom.'
  }

  if (!data.dateNaissance) {
    errors.dateNaissance = 'Veuillez indiquer votre date de naissance.'
  } else {
    const dob = new Date(`${data.dateNaissance}T00:00:00`)
    if (Number.isNaN(dob.getTime())) {
      errors.dateNaissance = 'La date de naissance est invalide.'
    } else {
      const today = new Date()
      // Comparaison exacte (mois + jour) : une personne née en décembre
      // 2008 n'a pas 18 ans en novembre 2026.
      const limite = new Date(
        today.getFullYear() - AGE_MINIMUM,
        today.getMonth(),
        today.getDate()
      )

      if (dob > today) {
        errors.dateNaissance = 'La date de naissance ne peut pas être dans le futur.'
      } else if (dob > limite) {
        errors.dateNaissance = `Vous devez avoir au moins ${AGE_MINIMUM} ans pour vous inscrire.`
      }
    }
  }

  if (!data.email.trim()) {
    errors.email = 'Veuillez renseigner votre adresse email.'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = "L'adresse email n'est pas valide."
  }

  if (!data.telephone.trim()) {
    errors.telephone = 'Veuillez renseigner votre numéro WhatsApp ou téléphone.'
  } else if (!/^[+\d][\d\s\-().]{6,19}$/.test(data.telephone.trim())) {
    errors.telephone = 'Le numéro de téléphone ne semble pas valide.'
  }

  if (!data.profession.trim()) {
    errors.profession = 'Veuillez indiquer votre fonction ou profession.'
  }

  if (!data.niveauIA) {
    errors.niveauIA = "Veuillez sélectionner votre niveau en intelligence artificielle."
  }

  if (!data.formationChoisie) {
    errors.formationChoisie = 'Veuillez choisir une formation.'
  }

  if (!data.motivation.trim()) {
    errors.motivation = 'Veuillez indiquer votre motivation.'
  } else if (data.motivation.trim().length < 20) {
    errors.motivation = 'Votre message de motivation est trop court (20 caractères minimum).'
  }

  if (!data.consentement) {
    errors.consentement =
      'Vous devez accepter les conditions pour finaliser votre inscription.'
  }

  return errors
}

// ── Composant section de formulaire ──
function FormSection({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ElementType
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="bg-white rounded-xl border border-[#1A1A1A]/8 overflow-hidden">
      {/* En-tête section */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-[#1A1A1A]/6 bg-[#f4eee5]">
        <div className="w-7 h-7 rounded bg-[rgba(174,88,55,.1)] flex items-center justify-center shrink-0">
          <Icon size={14} className="text-[color:var(--copper)]" aria-hidden="true" />
        </div>
        <h2 className="text-xs font-bold tracking-[0.12em] uppercase text-[#1A1A1A]/60">
          {title}
        </h2>
      </div>
      {/* Corps section */}
      <div className="px-6 py-6">
        {children}
      </div>
    </div>
  )
}

// ── Composant principal ──
export default function RegistrationForm() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [form, setForm] = useState<RegistrationFormData>(() => {
    // Pré-sélectionner la formation si elle est passée en query param
    const slug = searchParams.get('formation') ?? ''
    const isValidSlug = FORMATION_SELECT_OPTIONS.some((o) => o.value === slug)
    return {
      ...INITIAL_FORM,
      formationChoisie: isValidSlug ? slug : '',
    }
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [touched, setTouched] = useState<Set<string>>(new Set())
  const [status, setStatus] = useState<FormStatus>('idle')
  const [apiError, setApiError] = useState<string>('')

  // Bornée après le montage : évite tout écart d'hydratation entre le
  // rendu serveur (date de build) et le rendu client (date réelle).
  const [maxNaissance, setMaxNaissance] = useState<string | undefined>(undefined)
  useEffect(() => {
    setMaxNaissance(dateMaxNaissance())
  }, [])

  // Mise à jour dynamique si le query param change
  useEffect(() => {
    const slug = searchParams.get('formation') ?? ''
    const isValidSlug = FORMATION_SELECT_OPTIONS.some((o) => o.value === slug)
    if (isValidSlug) {
      setForm((prev) => ({ ...prev, formationChoisie: slug }))
    }
  }, [searchParams])

  // Gestion des changements de champs
  const handleChange = useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >
    ) => {
      const { name, value, type } = e.target
      const checked =
        type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined

      setForm((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }))

      // Effacer l'erreur du champ dès qu'il est modifié
      if (errors[name as keyof FormErrors]) {
        setErrors((prev) => {
          const next = { ...prev }
          delete next[name as keyof FormErrors]
          return next
        })
      }
    },
    [errors]
  )

  // Marquer un champ comme touché au blur → validation immédiate
  const handleBlur = useCallback(
    (
      e: React.FocusEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >
    ) => {
      const { name } = e.target
      setTouched((prev) => new Set(prev).add(name))

      // Valider seulement ce champ
      const fieldErrors = validate(form)
      if (fieldErrors[name as keyof FormErrors]) {
        setErrors((prev) => ({
          ...prev,
          [name]: fieldErrors[name as keyof FormErrors],
        }))
      }
    },
    [form]
  )

  // Soumission du formulaire
  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      setApiError('')

      // Validation complète
      const validationErrors = validate(form)
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors)
        // Marquer tous les champs comme touchés
        setTouched(
          new Set(Object.keys(validationErrors) as (keyof RegistrationFormData)[])
        )

        // Scroll vers la première erreur
        const firstErrorKey = Object.keys(validationErrors)[0]
        const firstErrorEl = document.querySelector(
          `[name="${firstErrorKey}"]`
        ) as HTMLElement
        if (firstErrorEl) {
          firstErrorEl.scrollIntoView({ behavior: 'smooth', block: 'center' })
          firstErrorEl.focus()
        }
        return
      }

      setStatus('loading')

      try {
        const response = await submitRegistration(form)

        if (response.success && response.data) {
          // Stocker les données de confirmation dans sessionStorage
          sessionStorage.setItem(
            'clubai_inscription',
            JSON.stringify({
              reference: response.data.reference,
              nom: response.data.nom,
              prenom: response.data.prenom,
              formationTitre: response.data.formation.titre,
              date: response.data.formation.date,
              horaire: response.data.formation.horaire,
              lieu: `${response.data.formation.lieu.nom}, ${response.data.formation.lieu.ville}`,
              prix: response.data.formation.prix,
              whatsappGroupUrl: response.data.whatsappGroupUrl,
            })
          )
          router.push('/inscription/succes')
        } else {
          setStatus('error')
          setApiError(
            response.error ??
              'Une erreur est survenue lors de votre inscription. Veuillez réessayer.'
          )
        }
      } catch {
        setStatus('error')
        setApiError(
          'La connexion au serveur a échoué. Vérifiez votre connexion internet et réessayez.'
        )
      }
    },
    [form, router]
  )

  const isLoading = status === 'loading'

  return (
    <form
      id="inscription-form"
      onSubmit={handleSubmit}
      noValidate
      aria-label="Formulaire d'inscription à une formation CLUB AI"
      className="flex flex-col gap-5"
    >
      {/* ── Erreur API globale ── */}
      {status === 'error' && apiError && (
        <ErrorMessage
          title="L'inscription n'a pas pu être enregistrée"
          message={apiError}
          onRetry={() => {
            setStatus('idle')
            setApiError('')
          }}
        />
      )}

      {/* ── 1. Informations personnelles ── */}
      <FormSection icon={User} title="Informations personnelles">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <FormField
            label="Nom"
            name="nom"
            value={form.nom}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.has('nom') ? errors.nom : undefined}
            required
            autoComplete="family-name"
            placeholder="Votre nom de famille"
          />
          <FormField
            label="Prénom"
            name="prenom"
            value={form.prenom}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.has('prenom') ? errors.prenom : undefined}
            required
            autoComplete="given-name"
            placeholder="Votre prénom"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5">
          <FormField
            label="Date de naissance"
            name="dateNaissance"
            type="date"
            value={form.dateNaissance}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.has('dateNaissance') ? errors.dateNaissance : undefined}
            required
            autoComplete="bday"
            max={maxNaissance}
            hint={`Vous devez avoir au moins ${AGE_MINIMUM} ans.`}
          />
          <FormField
            label="Adresse email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.has('email') ? errors.email : undefined}
            required
            autoComplete="email"
            placeholder="exemple@email.com"
          />
        </div>

        <div className="mt-5">
          <FormField
            label="WhatsApp / Téléphone"
            name="telephone"
            type="tel"
            value={form.telephone}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.has('telephone') ? errors.telephone : undefined}
            required
            autoComplete="tel"
            placeholder="+257 77 000 000"
            hint="Numéro sur lequel vous pouvez être contacté(e) via WhatsApp."
          />
        </div>
      </FormSection>

      {/* ── 2. Profil professionnel ── */}
      <FormSection icon={Briefcase} title="Profil professionnel">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <FormField
            label="Fonction / Profession"
            name="profession"
            value={form.profession}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.has('profession') ? errors.profession : undefined}
            required
            autoComplete="organization-title"
            placeholder="Ex : Entrepreneur, Comptable, Manager..."
          />
          <FormField
            label="Entreprise / Organisation"
            name="entreprise"
            value={form.entreprise}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.has('entreprise') ? errors.entreprise : undefined}
            autoComplete="organization"
            placeholder="Optionnel"
          />
        </div>
      </FormSection>

      {/* ── 3. Niveau & formation ── */}
      <FormSection icon={BookOpen} title="Niveau et formation">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <SelectField
            label="Niveau en intelligence artificielle"
            name="niveauIA"
            value={form.niveauIA}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.has('niveauIA') ? errors.niveauIA : undefined}
            options={NIVEAU_IA_OPTIONS as { value: string; label: string }[]}
            required
            placeholder="Votre niveau actuel"
          />
          <SelectField
            label="Formation choisie"
            name="formationChoisie"
            value={form.formationChoisie}
            onChange={handleChange}
            onBlur={handleBlur}
            error={
              touched.has('formationChoisie') ? errors.formationChoisie : undefined
            }
            options={FORMATION_SELECT_OPTIONS}
            required
            placeholder="Sélectionnez une formation"
          />
        </div>
      </FormSection>

      {/* ── 4. Motivation ── */}
      <FormSection icon={MessageSquare} title="Motivation">
        <TextareaField
          label="Pourquoi souhaitez-vous suivre cette formation ?"
          name="motivation"
          value={form.motivation}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.has('motivation') ? errors.motivation : undefined}
          required
          rows={5}
          maxLength={2000}
          placeholder="Décrivez brièvement ce qui vous motive à rejoindre cette formation et ce que vous souhaitez accomplir..."
          hint="Minimum 20 caractères."
        />
      </FormSection>

      {/* ── 5. Consentement & soumission ── */}
      <div className="bg-white rounded-xl border border-[#1A1A1A]/8 px-6 py-6">
        <div className="flex items-start gap-3 mb-6">
          <div className="w-7 h-7 rounded bg-[rgba(174,88,55,.1)] flex items-center justify-center shrink-0 mt-0.5">
            <Shield size={14} className="text-[color:var(--copper)]" aria-hidden="true" />
          </div>
          <h2 className="text-xs font-bold tracking-[0.12em] uppercase text-[#1A1A1A]/60 mt-1.5">
            Consentement
          </h2>
        </div>

        <CheckboxField
          label="J'accepte que mes informations soient utilisées pour traiter mon inscription."
          name="consentement"
          checked={form.consentement}
          onChange={handleChange}
          error={touched.has('consentement') ? errors.consentement : undefined}
          required
        />

        {/* Note confidentialité */}
        <p className="text-xs text-[#404040]/50 mt-4 leading-relaxed">
          Vos informations personnelles sont utilisées uniquement dans le cadre de votre
          inscription aux formations CLUB AI et ne seront pas transmises à des tiers.
        </p>

        {/* Bouton de soumission */}
        <div className="mt-6 pt-5 border-t border-[#1A1A1A]/6">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={isLoading}
            disabled={isLoading}
            fullWidth
            ariaLabel="Confirmer mon inscription"
          >
            {isLoading ? 'Inscription en cours...' : 'CONFIRMER MON INSCRIPTION'}
          </Button>

          <p className="text-xs text-[#404040]/45 text-center mt-4">
            Un email de confirmation vous sera envoyé après validation de votre
            inscription.
          </p>
        </div>
      </div>
    </form>
  )
}
