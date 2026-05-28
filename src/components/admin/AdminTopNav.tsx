import { EntityType, groupNavItems } from '@payloadcms/ui/shared'
import { formatAdminURL } from 'payload/shared'

import AdminTopNavClient from './AdminTopNavClient'

type Props = {
  i18n: any
  payload: any
  permissions: any
  user?: any
  visibleEntities: {
    collections: string[]
    globals: string[]
  }
}

const stripLeadingDecorators = (value: string) => value.replace(/^[^\p{L}\p{N}]+/gu, '').trim()

export default function AdminTopNav(props: Props) {
  const {
    i18n,
    payload,
    permissions,
    user,
    visibleEntities,
  } = props

  if (!payload?.config) {
    return null
  }

  const {
    collections,
    globals,
    routes: { admin: adminRoute },
  } = payload.config

  const items = groupNavItems(
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
    .flatMap((group: any) =>
      group.entities.map((item: any) => ({
        groupLabel: stripLeadingDecorators(group.label),
        href: formatAdminURL({
          adminRoute,
          path:
            item.type === EntityType.collection
              ? `/collections/${item.slug}`
              : `/globals/${item.slug}`,
        }),
        label: stripLeadingDecorators(item.label),
        slug: item.slug,
        type: item.type === EntityType.collection ? 'collection' : 'global',
      })),
    )

  const dashboardHref = formatAdminURL({ adminRoute, path: '' })

  return (
    <AdminTopNavClient
      dashboardHref={dashboardHref}
      homeHref="/"
      items={items}
      userEmail={user?.email}
      userName={user?.email || 'Admin'}
    />
  )
}
