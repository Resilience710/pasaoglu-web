import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { getPayloadClient } from '@/lib/payload'
import { mediaUrl, mediaAlt } from '@/lib/cn'
import { CategoryProducts } from '@/components/CategoryProducts'
import { CAT_EN } from '@/lib/enCats'

export const revalidate = 60

type Props = { params: Promise<{ slug: string }> }

async function getCategory(slug: string) {
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({ collection: 'productCategories', where: { slug: { equals: slug } }, depth: 2, limit: 1 })
    return result.docs[0] as any
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const c = await getCategory(slug)
  if (!c) return {}
  const name = CAT_EN[slug] || c.name
  return { title: `${name} | Products`, description: `Paşaoğlu ${name} product group.` }
}

export async function generateStaticParams() {
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({ collection: 'productCategories', limit: 50 })
    return result.docs.map((d: any) => ({ slug: d.slug }))
  } catch {
    return []
  }
}

export default async function CategoryPageEn({ params }: Props) {
  const { slug } = await params
  const c = await getCategory(slug)
  if (!c) notFound()

  const accent = c.accent || '#3B82F6'
  const img = mediaUrl(c.image)
  const count = (c.subGroups || []).reduce((s: number, g: any) => s + (g.products?.length || 0), 0)
  const name = CAT_EN[slug] || c.name
  const variantBg =
    c.designVariant === 'grid' ? 'bg-brand-cream'
    : c.designVariant === 'columns' ? 'bg-white'
    : c.designVariant === 'table' ? 'bg-brand-cream'
    : 'bg-white'

  return (
    <>
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-20 overflow-hidden text-white" style={{ background: `linear-gradient(135deg, ${accent}, ${accent}cc)` }}>
        {img && (
          <>
            <Image src={img} alt={mediaAlt(c.image, name)} fill className="object-cover opacity-20" priority />
            <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${accent}ee, ${accent}aa)` }} />
          </>
        )}
        <div className="absolute inset-0 opacity-[0.08] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
        <div className="relative container-x">
          <Link href="/en/urunler" className="inline-flex items-center gap-2 text-sm text-white/80 hover:text-white mb-6 transition">
            <ArrowLeft size={16} /> All Products
          </Link>
          {c.tagline && (
            <span className="block text-[11px] font-semibold uppercase tracking-[0.3em] text-white/80 mb-3">{c.tagline}</span>
          )}
          <h1 className="font-sans text-4xl md:text-6xl font-light leading-tight max-w-3xl [text-shadow:0_2px_16px_rgba(0,0,0,0.25)]">{name}</h1>
          {c.description && (
            <p className="mt-5 max-w-2xl text-white/90 leading-relaxed text-lg">{c.description}</p>
          )}
          <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold bg-white/15 backdrop-blur px-4 py-2 rounded-full">
            {(c.subGroups || []).length} subgroups · {count} products
          </div>
        </div>
      </section>

      <section className={`py-16 md:py-24 ${variantBg}`}>
        <CategoryProducts variant={c.designVariant || 'accordion'} accent={accent} subGroups={c.subGroups || []} />
      </section>

      <section className="py-16 text-center text-white" style={{ background: `linear-gradient(135deg, ${accent}, ${accent}dd)` }}>
        <div className="container-x max-w-2xl mx-auto">
          <h2 className="font-sans text-3xl md:text-4xl font-light">Request a quote for this group</h2>
          <p className="mt-4 text-white/85">Contact us for raw material quote requests, MSDS / TDS documents and samples.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href={'/en/iletisim'} className="inline-flex items-center px-6 py-3 rounded-full bg-white font-semibold" style={{ color: accent }}>
              Request Quote
            </Link>
            <Link href={'/en/iletisim'} className="inline-flex items-center px-6 py-3 rounded-full border border-white/50 text-white font-semibold hover:bg-white/10 transition">
              MSDS / TDS Request
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
