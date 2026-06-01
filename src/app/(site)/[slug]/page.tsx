import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getPayloadClient } from '@/lib/payload'
import { BlockRenderer } from '@/components/BlockRenderer'
import { buildPageMetadata } from '@/lib/seo'

export const revalidate = 60

type Props = { params: Promise<{ slug: string }> }

async function getPage(slug: string) {
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'pages',
      where: { slug: { equals: slug } },
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
  const payload = await getPayloadClient()
  const [page, settings] = await Promise.all([
    getPage(slug),
    payload.findGlobal({ slug: 'siteSettings', depth: 1 }).catch(() => ({})),
  ])
  if (!page) return {}
  return buildPageMetadata({ page, settings, pathname: `/${slug}` })
}

export async function generateStaticParams() {
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({ collection: 'pages', limit: 100 })
    return result.docs
      .filter((d: any) => d.slug && d.slug !== 'home' && !d.slug.includes('/'))
      .map((d: any) => ({ slug: d.slug }))
  } catch {
    return []
  }
}

export default async function Page({ params }: Props) {
  const { slug } = await params
  if (slug === 'home') notFound()
  const page = await getPage(slug)
  if (!page) notFound()
  return <BlockRenderer layout={page.layout as any[]} />
}
