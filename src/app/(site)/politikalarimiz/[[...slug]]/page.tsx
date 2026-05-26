import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getPayloadClient } from '@/lib/payload'
import { BlockRenderer } from '@/components/BlockRenderer'

export const revalidate = 60

type Props = { params: Promise<{ slug?: string[] }> }

async function getPage(fullSlug: string) {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'pages',
    where: { slug: { equals: fullSlug } },
    depth: 3,
    limit: 1,
  })
  return result.docs[0]
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const full = slug ? `politikalarimiz/${slug.join('/')}` : 'politikalarimiz'
  const page = await getPage(full)
  if (!page) return {}
  return { title: page.meta?.title || page.title, description: page.meta?.description }
}

export default async function PolicyPage({ params }: Props) {
  const { slug } = await params
  const full = slug ? `politikalarimiz/${slug.join('/')}` : 'politikalarimiz'
  const page = await getPage(full)
  if (!page) notFound()
  return <BlockRenderer layout={page.layout as any[]} />
}
