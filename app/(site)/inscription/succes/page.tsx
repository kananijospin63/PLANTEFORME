'use client'

// ============================================================
// Page Confirmation d'inscription — CLUB AI
// URL : /inscription/succes
// ============================================================

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import SuccessMessage from '@/components/sections/SuccessMessage'
import LoadingState from '@/components/ui/LoadingState'
import type { SuccessPageData } from '@/types'

export default function SuccessPage() {
  const router = useRouter()
  const [data, setData] = useState<SuccessPageData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    try {
      // Récupérer les données stockées après soumission du formulaire
      const stored = sessionStorage.getItem('clubai_inscription')

      if (stored) {
        const parsed = JSON.parse(stored) as SuccessPageData
        setData(parsed)
        // Nettoyer sessionStorage après lecture (une seule lecture)
        sessionStorage.removeItem('clubai_inscription')
        setIsLoading(false)
        return
      }

      // Accès direct à l'URL sans inscription : aucune confirmation à afficher.
      // On renvoie vers le formulaire plutôt que d'inventer une référence.
      router.replace('/inscription')
    } catch {
      router.replace('/inscription')
    }
  }, [router])

  if (isLoading || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f4eee5]">
        <LoadingState message="Chargement de votre confirmation..." size="lg" />
      </div>
    )
  }

  return <SuccessMessage data={data} />
}
