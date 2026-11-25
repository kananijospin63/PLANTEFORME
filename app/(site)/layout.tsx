// ============================================================
// Layout du site public — header + footer
// (les espaces /admin et /connexion ont leur propre mise en page)
// ============================================================

import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ThemePicker from '@/components/ui/ThemePicker'

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main id="main-content" tabIndex={-1}>
        {children}
      </main>
      <Footer />
      <ThemePicker />
    </>
  )
}
