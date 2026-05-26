import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getPayloadClient } from '@/lib/payload'
import { BlockRenderer } from '@/components/BlockRenderer'

export const revalidate = 60

type Props = { params: Promise<{ slug: string }> }

async function getSector(slug: string) {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'sectors',
    where: { slug: { equals: slug } },
    depth: 3,
    limit: 1,
  })
  return result.docs[0]
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const s: any = await getSector(slug)
  if (!s) return {}
  return { title: s.meta?.title || s.name, description: s.meta?.description }
}

export async function generateStaticParams() {
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({ collection: 'sectors', limit: 10 })
    return result.docs.map((d: any) => ({ slug: d.slug }))
  } catch {
    return []
  }
}

export default async function SectorPage({ params }: Props) {
  const { slug } = await params
  const sector: any = await getSector(slug)
  if (!sector) notFound()

  return (
    <div data-theme={sector.theme}>
      <BlockRenderer layout={sector.layout as any[]} />
    </div>
  )
}
