import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getPayloadClient } from '@/lib/payload'
import { BlockRenderer } from '@/components/BlockRenderer'
import { buildPageMetadata } from '@/lib/seo'

export const revalidate = 60

type Props = { params: Promise<{ slug?: string[] }> }

function fullSlugFrom(slug?: string[]) {
  const path = slug && slug.length ? slug.join('/') : 'home'
  return `en/${path}`
}

function themeFor(fullSlug: string): string | undefined {
  if (fullSlug.includes('sektorler/kimya')) return 'chem'
  if (fullSlug.includes('sektorler/yapi')) return 'build'
  if (fullSlug.includes('sektorler/gida')) return 'food'
  return undefined
}

async function getPage(fullSlug: string) {
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'pages',
      where: { slug: { equals: fullSlug } },
      depth: 3,
      limit: 1,
    })
    return result.docs[0]
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const fullSlug = fullSlugFrom(slug)
  const [page, settings] = await Promise.all([
    getPage(fullSlug),
    (async () => {
      try {
        const payload = await getPayloadClient()
        return await payload.findGlobal({ slug: 'siteSettings', depth: 1 })
      } catch {
        return {}
      }
    })(),
  ])
  if (!page) return {}
  return buildPageMetadata({ page, settings, pathname: `/${fullSlug}` })
}

export async function generateStaticParams() {
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({ collection: 'pages', limit: 200 })
    return result.docs
      .filter((d: any) => d.slug && d.slug.startsWith('en/'))
      .map((d: any) => {
        const rest = d.slug.replace(/^en\//, '')
        return { slug: rest === 'home' ? [] : rest.split('/') }
      })
  } catch {
    return []
  }
}

export default async function EnglishPage({ params }: Props) {
  const { slug } = await params
  const fullSlug = fullSlugFrom(slug)
  const page = await getPage(fullSlug)
  if (!page) notFound()

  const theme = themeFor(fullSlug)
  const content = <BlockRenderer layout={(page as any).layout as any[]} />
  return theme ? <div data-theme={theme}>{content}</div> : content
}
