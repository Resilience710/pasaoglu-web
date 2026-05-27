import Link from 'next/link'
import { Logout } from '@payloadcms/ui'
import { RenderServerComponent } from '@payloadcms/ui/elements/RenderServerComponent'
import { EntityType, groupNavItems } from '@payloadcms/ui/shared'
import { formatAdminURL } from 'payload/shared'

import AdminTopNavClient from './AdminTopNavClient'

type Props = {
  documentSubViewType?: string
  i18n: any
  locale?: string
  params?: any
  payload: any
  permissions: any
  searchParams?: any
  user?: any
  viewType?: string
  visibleEntities: {
    collections: string[]
    globals: string[]
  }
}

const stripLeadingDecorators = (value: string) => value.replace(/^[^\p{L}\p{N}]+/gu, '').trim()

export default function AdminTopNav(props: Props) {
  const {
    documentSubViewType,
    i18n,
    locale,
    params,
    payload,
    permissions,
    searchParams,
    user,
    viewType,
    visibleEntities,
  } = props

  if (!payload?.config) {
    return null
  }

  const {
    admin: {
      components: { logout },
    },
    collections,
    globals,
    routes: { admin: adminRoute },
  } = payload.config

  const groups = groupNavItems(
    [
      ...collections
        .filter(({ slug }: { slug: string }) => visibleEntities.collections.includes(slug))
        .map((collection: any) => ({ entity: collection, type: EntityType.collection })),
      ...globals
        .filter(({ slug }: { slug: string }) => visibleEntities.globals.includes(slug))
        .map((globalItem: any) => ({ entity: globalItem, type: EntityType.global })),
    ],
    permissions,
    i18n,
  )
    .map((group: any) => ({
      label: stripLeadingDecorators(group.label),
      items: group.entities.map((item: any) => ({
        href: formatAdminURL({
          adminRoute,
          path:
            item.type === EntityType.collection
              ? `/collections/${item.slug}`
              : `/globals/${item.slug}`,
        }),
        label: item.label,
        typeLabel: item.type === EntityType.collection ? 'İçerik alanı' : 'Genel ayar',
      })),
    }))
    .filter((group: { items: unknown[] }) => group.items.length > 0)

  const dashboardHref = formatAdminURL({ adminRoute, path: '' })

  const LogoutComponent = RenderServerComponent({
    clientProps: {
      documentSubViewType,
      viewType,
    },
    Component: logout?.Button,
    Fallback: Logout,
    importMap: payload.importMap,
    serverProps: {
      i18n,
      locale,
      params,
      payload,
      permissions,
      searchParams,
      user,
    },
  })

  return (
    <div className="admin-topnav">
      <div className="admin-topnav__inner">
        <Link className="admin-topnav__brand" href={dashboardHref} prefetch={false}>
          <span aria-hidden className="admin-topnav__brand-mark">
            P
          </span>

          <span className="admin-topnav__brand-copy">
            <strong>Paşaoğlu Group</strong>
            <span>Kurumsal içerik yönetimi</span>
          </span>
        </Link>

        <p className="admin-topnav__headline">
          Menü, içerik ve site ayarları aynı çizgide; daha hızlı düzenleme, daha net akış.
        </p>

        <div className="admin-topnav__utility">{LogoutComponent}</div>
      </div>

      <AdminTopNavClient dashboardHref={dashboardHref} groups={groups} />
    </div>
  )
}
