'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  BarChart3,
  BriefcaseBusiness,
  Files,
  FolderOpen,
  House,
  Images,
  LayoutDashboard,
  LayoutGrid,
  LayoutTemplate,
  LogOut,
  Mail,
  Newspaper,
  PanelsTopLeft,
  Send,
  Settings,
  Shapes,
  User,
} from 'lucide-react'

type NavItem = {
  groupLabel: string
  href: string
  label: string
  slug: string
  type: 'collection' | 'global'
}

type Props = {
  dashboardHref: string
  homeHref: string
  items: NavItem[]
  userEmail?: string
  userName?: string
}

function isActivePath(pathname: string, href: string) {
  if (href === pathname) return true
  return pathname.startsWith(`${href}/`)
}

const iconMap: Record<string, any> = {
  users: User,
  media: Images,
  pages: Files,
  sectors: Shapes,
  productCategories: LayoutGrid,
  documents: FolderOpen,
  jobOpenings: BriefcaseBusiness,
  newsArticles: Newspaper,
  siteSettings: Settings,
  mainNav: PanelsTopLeft,
  contactSubmissions: Mail,
  careerApplications: Send,
}

export default function AdminTopNavClient({
  dashboardHref,
  homeHref,
  items,
  userEmail,
  userName,
}: Props) {
  const pathname = usePathname()
  const visibleItems = items.filter((item) => item.label !== 'Yönetici Kullanıcılar')

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar__header">
        <Link
          className="admin-sidebar__brand"
          href={dashboardHref}
          prefetch={false}
        >
          <strong>Paşaoğlu Group</strong>
          <span>Yönetim Paneli</span>
        </Link>
      </div>

      <nav aria-label="Yönetim menüsü" className="admin-sidebar__nav">
        <Link
          className={['admin-sidebar__link', pathname === dashboardHref && 'is-active'].filter(Boolean).join(' ')}
          href={dashboardHref}
          prefetch={false}
        >
          <LayoutDashboard className="admin-sidebar__icon" />
          <span>Anasayfa</span>
        </Link>

        <Link
          className={['admin-sidebar__link', isActivePath(pathname, '/admin/duzenle/ana-sayfa') && 'is-active'].filter(Boolean).join(' ')}
          href="/admin/duzenle/ana-sayfa"
          prefetch={false}
        >
          <LayoutTemplate className="admin-sidebar__icon" />
          <span>Ana Sayfayı Düzenle</span>
        </Link>

        {visibleItems.map((item) => {
          const Icon = iconMap[item.slug] || BarChart3
          const isActive = isActivePath(pathname, item.href)

          return (
            <Link
              className={['admin-sidebar__link', isActive && 'is-active'].filter(Boolean).join(' ')}
              href={item.href}
              key={item.href}
              prefetch={false}
            >
              <Icon className="admin-sidebar__icon" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="admin-sidebar__footer">
        <Link className="admin-sidebar__back" href={homeHref} prefetch={false}>
          <House className="admin-sidebar__footer-icon" />
          <span>Siteye Dön</span>
        </Link>

        <div className="admin-sidebar__profile">
          <div className="admin-sidebar__avatar">
            {(userName || 'Y').slice(0, 1).toUpperCase()}
          </div>

          <div className="admin-sidebar__profile-copy">
            <strong>{userName || 'Yönetici'}</strong>
            <span>{userEmail || 'yönetici'}</span>
          </div>

          <Link className="admin-sidebar__logout" href="/admin/logout" prefetch={false} title="Çıkış Yap">
            <LogOut className="admin-sidebar__footer-icon" />
          </Link>
        </div>
      </div>
    </aside>
  )
}
