import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getPayloadClient } from '@/lib/payload'
import { BlockRenderer } from '@/components/BlockRenderer'

export const revalidate = 60

type Props = { params: Promise<{ slug: string }> }

async function getPage(slug: string) {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'pages',
    where: { slug: { equals: slug } },
    depth: 3,
    limit: 1,
  })
  return result.docs[0]
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const page = await getPage(slug)
  if (!page) return {}
  return {
    title: page.meta?.title || page.title,
    description: page.meta?.description,
  }
}

export async function generateStaticParams() {
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({ collection: 'pages', limit: 100 })
    return result.docs
      .filter((d: any) => d.slug && d.slug !== 'home')
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
