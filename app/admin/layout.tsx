// ============================================================
// Layout /admin — vérifie la session puis affiche la coque
// ============================================================

import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import AdminShell from '@/components/admin/AdminShell'
import { decodeSession, SESSION_COOKIE } from '@/lib/auth'

export const metadata: Metadata = {
  title: 'Tableau de bord',
  robots: { index: false, follow: false },
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await decodeSession(cookies().get(SESSION_COOKIE)?.value)

  if (!session) redirect('/connexion')

  return <AdminShell user={session}>{children}</AdminShell>
}
