'use client'

import { Link } from '@payloadcms/ui'
import { usePathname } from 'next/navigation'

type NavItem = {
  href: string
  label: string
  typeLabel: string
}

type NavGroup = {
  label: string
  items: NavItem[]
}

type Props = {
  dashboardHref: string
  groups: NavGroup[]
}

function isActivePath(pathname: string, href: string) {
  if (href === pathname) return true
  return pathname.startsWith(`${href}/`)
}

export default function AdminTopNavClient({ dashboardHref, groups }: Props) {
  const pathname = usePathname()

  return (
    <div className="admin-topnav__surface">
      <div className="admin-topnav__dashboard">
        <Link
          className={['admin-topnav__dashboard-link', pathname === dashboardHref && 'is-active']
            .filter(Boolean)
            .join(' ')}
          href={dashboardHref}
          prefetch={false}
        >
          Kontrol Merkezi
        </Link>
      </div>

      <div aria-label="Admin menüsü" className="admin-topnav__groups" role="navigation">
        {groups.map((group) => (
          <section className="admin-topnav__group" key={group.label}>
            <p className="admin-topnav__group-label">{group.label}</p>

            <div className="admin-topnav__links">
              {group.items.map((item) => {
                const isActive = isActivePath(pathname, item.href)

                return (
                  <Link
                    className={['admin-topnav__link', isActive && 'is-active'].filter(Boolean).join(' ')}
                    href={item.href}
                    key={item.href}
                    prefetch={false}
                  >
                    <span className="admin-topnav__link-title">{item.label}</span>
                    <span className="admin-topnav__link-meta">{item.typeLabel}</span>
                  </Link>
                )
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
