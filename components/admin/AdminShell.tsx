'use client'

// ============================================================
// AdminShell — coque du tableau de bord (sidebar + topbar)
// ============================================================

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  ClipboardList,
  Users,
  GraduationCap,
  MessageSquare,
  Send,
  ShieldCheck,
  Settings,
  LogOut,
  Menu,
  X,
  ExternalLink,
  Search,
  Bell,
  ChevronDown,
  Zap,
} from 'lucide-react'
import type { SessionUser } from '@/lib/auth'
import { ROLE_LABEL } from '@/lib/auth'
import { KPI, MESSAGES } from '@/data/admin'

interface NavItem {
  href: string
  label: string
  icon: React.ElementType
  exact?: boolean
  badge?: number
  adminOnly?: boolean
}

interface NavGroup {
  titre: string
  items: NavItem[]
}

const NAV: NavGroup[] = [
  {
    titre: 'Pilotage',
    items: [
      { href: '/admin',              label: 'Vue d’ensemble', icon: LayoutDashboard, exact: true },
      { href: '/admin/inscriptions', label: 'Inscriptions',   icon: ClipboardList, badge: KPI.enAttente },
      { href: '/admin/participants', label: 'Participants',   icon: Users },
    ],
  },
  {
    titre: 'Catalogue',
    items: [
      { href: '/admin/formations', label: 'Formations', icon: GraduationCap },
    ],
  },
  {
    titre: 'Communication',
    items: [
      { href: '/admin/messages', label: 'Messages', icon: MessageSquare, badge: MESSAGES.filter((m) => !m.lu).length },
      { href: '/admin/newsletter', label: 'Newsletter', icon: Send },
    ],
  },
  {
    titre: 'Administration',
    items: [
      { href: '/admin/acces',      label: 'Gestion des accès', icon: ShieldCheck, adminOnly: true },
      { href: '/admin/parametres', label: 'Paramètres',        icon: Settings },
    ],
  },
]

const TITRES: Record<string, string> = {
  '/admin':              'Vue d’ensemble',
  '/admin/inscriptions': 'Inscriptions',
  '/admin/participants': 'Participants',
  '/admin/formations':   'Formations',
  '/admin/messages':     'Messages',
  '/admin/newsletter':   'Newsletter',
  '/admin/acces':        'Gestion des accès',
  '/admin/parametres':   'Paramètres',
}

export default function AdminShell({
  user,
  children,
}: {
  user: SessionUser
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [drawer, setDrawer] = useState(false)
  const [userMenu, setUserMenu] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)

  useEffect(() => {
    setDrawer(false)
    setUserMenu(false)
  }, [pathname])

  async function logout() {
    setLoggingOut(true)
    await fetch('/api/auth/logout', { method: 'POST' }).catch(() => null)
    router.replace('/connexion')
    router.refresh()
  }

  const isActive = (item: NavItem) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href)

  const titre = TITRES[pathname] ?? 'Tableau de bord'

  const initials = user.name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  const sidebar = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 h-[68px] flex items-center gap-3 shrink-0" style={{ borderBottom: '1px solid rgba(255,244,232,.07)' }}>
        <div
          className="flex items-center justify-center w-9 h-9 rounded-xl shrink-0"
          style={{ background: 'linear-gradient(135deg, #efc98c, #ae5837)', boxShadow: '0 2px 12px rgba(174,88,55,.45)' }}
          aria-hidden="true"
        >
          <Zap size={15} className="fill-current" style={{ color: '#1a100d' }} strokeWidth={2.5} />
        </div>
        <div className="flex flex-col leading-none">
          <span className="text-[14px] tracking-tight" style={{ fontFamily: 'var(--font-unbounded)', fontWeight: 700, color: '#fff4e8' }}>
            CLUB <span style={{ color: '#efc98c' }}>AI</span>
          </span>
          <span className="mt-1" style={{ fontSize: 8.5, color: 'rgba(239,201,140,.45)', fontWeight: 700, letterSpacing: '.16em', textTransform: 'uppercase' }}>
            Administration
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-5 flex flex-col gap-6" aria-label="Navigation administration">
        {NAV.map((group) => {
          const items = group.items.filter((item) => !item.adminOnly || user.role === 'ADMIN')
          if (!items.length) return null

          return (
            <div key={group.titre}>
              <p
                className="px-3 mb-2 text-[9px] font-bold uppercase tracking-[0.16em]"
                style={{ color: 'rgba(255,244,232,.25)' }}
              >
                {group.titre}
              </p>
              <div className="flex flex-col gap-0.5">
                {items.map((item) => {
                  const active = isActive(item)
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      aria-current={active ? 'page' : undefined}
                      className="group flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all"
                      style={{
                        color:      active ? '#1a100d' : 'rgba(255,244,232,.6)',
                        background: active ? 'linear-gradient(135deg,#efc98c,#d8a267)' : 'transparent',
                        boxShadow:  active ? '0 4px 14px rgba(174,88,55,.28)' : 'none',
                      }}
                      onMouseEnter={(e) => {
                        if (!active) (e.currentTarget as HTMLElement).style.background = 'rgba(255,244,232,.06)'
                      }}
                      onMouseLeave={(e) => {
                        if (!active) (e.currentTarget as HTMLElement).style.background = 'transparent'
                      }}
                    >
                      <Icon size={16} className="shrink-0" aria-hidden="true" />
                      <span className="flex-1 truncate">{item.label}</span>
                      {typeof item.badge === 'number' && item.badge > 0 && (
                        <span
                          className="text-[10px] font-bold px-1.5 py-0.5 rounded-md leading-none"
                          style={{
                            background: active ? 'rgba(26,16,13,.18)' : 'rgba(239,201,140,.15)',
                            color:      active ? '#1a100d' : '#efc98c',
                          }}
                        >
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  )
                })}
              </div>
            </div>
          )
        })}
      </nav>

      {/* Pied de sidebar */}
      <div className="p-3 shrink-0" style={{ borderTop: '1px solid rgba(255,244,232,.07)' }}>
        <Link
          href="/"
          className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[12.5px] font-medium transition-colors"
          style={{ color: 'rgba(255,244,232,.45)' }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#efc98c' }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,244,232,.45)' }}
        >
          <ExternalLink size={14} aria-hidden="true" />
          Voir le site public
        </Link>
        <div
          className="mt-1 flex items-center gap-2.5 px-3 py-2.5 rounded-xl"
          style={{ background: 'rgba(255,244,232,.04)' }}
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[11px] font-bold shrink-0"
            style={{ background: 'linear-gradient(135deg,#efc98c,#ae5837)', color: '#1a100d' }}
            aria-hidden="true"
          >
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-[12px] font-semibold truncate" style={{ color: '#fff4e8' }}>{user.name}</p>
            <p className="text-[10px] truncate" style={{ color: 'rgba(255,244,232,.35)' }}>{ROLE_LABEL[user.role]}</p>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen flex" style={{ background: '#f4eee5' }}>
      {/* ── Sidebar desktop ── */}
      <aside
        className="hidden lg:flex w-[262px] shrink-0 fixed inset-y-0 left-0 z-40"
        style={{ background: '#1a100d', borderRight: '1px solid rgba(239,201,140,.1)' }}
      >
        {sidebar}
      </aside>

      {/* ── Drawer mobile ── */}
      <div
        className="lg:hidden fixed inset-0 z-50 transition-opacity duration-300"
        style={{
          background: 'rgba(16,8,5,.6)',
          backdropFilter: 'blur(4px)',
          opacity: drawer ? 1 : 0,
          pointerEvents: drawer ? 'auto' : 'none',
        }}
        onClick={() => setDrawer(false)}
        aria-hidden="true"
      />
      <aside
        className="lg:hidden fixed inset-y-0 left-0 w-[280px] z-50 transition-transform duration-300"
        style={{
          background: '#1a100d',
          transform: drawer ? 'translateX(0)' : 'translateX(-100%)',
        }}
        aria-label="Menu administration"
      >
        <button
          type="button"
          onClick={() => setDrawer(false)}
          className="absolute top-4 right-4 p-2 rounded-lg z-10"
          style={{ color: 'rgba(255,244,232,.6)', background: 'rgba(255,244,232,.06)' }}
          aria-label="Fermer le menu"
        >
          <X size={16} />
        </button>
        {sidebar}
      </aside>

      {/* ── Contenu ── */}
      <div className="flex-1 min-w-0 lg:ml-[262px] flex flex-col">
        {/* Topbar */}
        <header
          className="sticky top-0 z-30 flex items-center gap-3 px-4 sm:px-6 h-[68px] shrink-0"
          style={{
            background: 'rgba(246,239,230,.88)',
            backdropFilter: 'blur(14px)',
            WebkitBackdropFilter: 'blur(14px)',
            borderBottom: '1px solid rgba(26,16,13,.08)',
          }}
        >
          <button
            type="button"
            onClick={() => setDrawer(true)}
            className="lg:hidden p-2 -ml-1 rounded-lg"
            style={{ color: '#1a100d', background: 'rgba(26,16,13,.05)' }}
            aria-label="Ouvrir le menu"
          >
            <Menu size={18} />
          </button>

          <div className="min-w-0">
            <h1
              className="text-[17px] leading-tight tracking-tight truncate"
              style={{ fontFamily: 'var(--font-unbounded)', fontWeight: 700, color: '#1a100d' }}
            >
              {titre}
            </h1>
            <p className="text-[11px] hidden sm:block" style={{ color: 'rgba(26,16,13,.45)' }}>
              Session du 14 – 19 décembre 2026 · Centre CEPRODILUC
            </p>
          </div>

          <div className="flex-1" />

          {/* Recherche */}
          <div className="hidden md:flex items-center gap-2 h-9 px-3 rounded-xl w-[220px]" style={{ background: 'rgba(26,16,13,.05)' }}>
            <Search size={14} style={{ color: 'rgba(26,16,13,.35)' }} aria-hidden="true" />
            <input
              type="search"
              placeholder="Rechercher…"
              aria-label="Rechercher dans le tableau de bord"
              className="flex-1 bg-transparent outline-none text-[12.5px] placeholder:text-[#9a8d82]"
              style={{ color: '#1a100d' }}
            />
          </div>

          {/* Notifications */}
          <Link
            href="/admin/messages"
            className="relative p-2 rounded-xl transition-colors hover:bg-black/5"
            aria-label={`Messages non lus : ${MESSAGES.filter((m) => !m.lu).length}`}
          >
            <Bell size={17} style={{ color: 'rgba(26,16,13,.6)' }} />
            {MESSAGES.some((m) => !m.lu) && (
              <span
                className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full"
                style={{ background: '#ae5837' }}
                aria-hidden="true"
              />
            )}
          </Link>

          {/* Menu utilisateur */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setUserMenu((v) => !v)}
              className="flex items-center gap-2 pl-1.5 pr-2 py-1.5 rounded-xl transition-colors hover:bg-black/5"
              aria-expanded={userMenu}
              aria-haspopup="menu"
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[11px] font-bold shrink-0"
                style={{ background: 'linear-gradient(135deg,#efc98c,#ae5837)', color: '#1a100d' }}
                aria-hidden="true"
              >
                {initials}
              </div>
              <ChevronDown size={13} style={{ color: 'rgba(26,16,13,.4)' }} aria-hidden="true" />
            </button>

            {userMenu && (
              <div
                role="menu"
                className="absolute right-0 top-full mt-2 w-[230px] rounded-xl overflow-hidden"
                style={{ background: '#fff', border: '1px solid rgba(26,16,13,.1)', boxShadow: '0 12px 32px rgba(26,16,13,.14)' }}
              >
                <div className="px-4 py-3" style={{ borderBottom: '1px solid rgba(26,16,13,.07)' }}>
                  <p className="text-[12.5px] font-semibold truncate" style={{ color: '#1a100d' }}>{user.name}</p>
                  <p className="text-[11px] truncate" style={{ color: 'rgba(26,16,13,.45)' }}>{user.email}</p>
                </div>
                <Link
                  href="/admin/parametres"
                  role="menuitem"
                  className="flex items-center gap-2.5 px-4 py-2.5 text-[12.5px] transition-colors hover:bg-black/[0.04]"
                  style={{ color: 'rgba(26,16,13,.7)' }}
                >
                  <Settings size={14} aria-hidden="true" />
                  Paramètres du compte
                </Link>
                <button
                  type="button"
                  role="menuitem"
                  onClick={logout}
                  disabled={loggingOut}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[12.5px] font-medium transition-colors hover:bg-black/[0.04] disabled:opacity-50"
                  style={{ color: '#a13a2f' }}
                >
                  <LogOut size={14} aria-hidden="true" />
                  {loggingOut ? 'Déconnexion…' : 'Se déconnecter'}
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Page */}
        <main id="main-content" className="flex-1 px-4 sm:px-6 py-6 sm:py-8">
          {children}
        </main>
      </div>
    </div>
  )
}
