// ============================================================
// /admin/parametres — réglages du compte et de la session
// ============================================================

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import SettingsForm from '@/components/admin/SettingsForm'
import { decodeSession, SESSION_COOKIE } from '@/lib/auth'

export default async function AdminParametresPage() {
  const session = await decodeSession(cookies().get(SESSION_COOKIE)?.value)

  if (!session) redirect('/connexion')

  return (
    <div className="max-w-[820px] flex flex-col gap-4">
      <SettingsForm user={session} />
    </div>
  )
}
