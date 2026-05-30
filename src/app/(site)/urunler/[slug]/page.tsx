import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { getPayloadClient } from '@/lib/payload'
import { mediaUrl, mediaAlt } from '@/lib/cn'
import { CategoryProducts } from '@/components/CategoryProducts'

export const revalidate = 60

type Props = { params: Promise<{ slug: string }> }

async function getCategory(slug: string) {
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'productCategories',
      where: { slug: { equals: slug } },
      depth: 2,
      limit: 1,
    })
    return result.docs[0] as any
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const c = await getCategory(slug)
  if (!c) return {}
  return {
    title: `${c.name} | Ürünler`,
    description: c.description || `Paşaoğlu Kimya ${c.name} ürün grubu.`,
  }
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

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params
  const c = await getCategory(slug)
  if (!c) notFound()

  const accent = c.accent || '#3B82F6'
  const img = mediaUrl(c.image)
  const count = (c.subGroups || []).reduce((s: number, g: any) => s + (g.products?.length || 0), 0)
  const variantBg =
    c.designVariant === 'grid' ? 'bg-brand-cream'
    : c.designVariant === 'columns' ? 'bg-white'
    : c.designVariant === 'table' ? 'bg-brand-cream'
    : 'bg-white'

  return (
    <>
      {/* HERO — kategoriye özel renk */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-20 overflow-hidden text-white" style={{ background: `linear-gradient(135deg, ${accent}, ${accent}cc)` }}>
        {img && (
          <>
            <Image src={img} alt={mediaAlt(c.image, c.name)} fill className="object-cover opacity-20" priority />
            <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${accent}ee, ${accent}aa)` }} />
          </>
        )}
        <div className="absolute inset-0 opacity-[0.08] pointer-events-none" style={{
          backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '28px 28px',
        }} />
        <div className="relative container-x">
          <Link href="/urunler" className="inline-flex items-center gap-2 text-sm text-white/80 hover:text-white mb-6 transition">
            <ArrowLeft size={16} /> Tüm Ürünler
          </Link>
          {c.tagline && (
            <span className="block text-[11px] font-semibold uppercase tracking-[0.3em] text-white/80 mb-3">{c.tagline}</span>
          )}
          <h1 className="font-sans text-4xl md:text-6xl font-light leading-tight max-w-3xl [text-shadow:0_2px_16px_rgba(0,0,0,0.25)]">
            {c.name}
          </h1>
          {c.description && (
            <p className="mt-5 max-w-2xl text-white/90 leading-relaxed text-lg">{c.description}</p>
          )}
          <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold bg-white/15 backdrop-blur px-4 py-2 rounded-full">
            {(c.subGroups || []).length} alt grup · {count} ürün
          </div>
        </div>
      </section>

      {/* ÜRÜNLER — tasarım varyantına göre */}
      <section className={`py-16 md:py-24 ${variantBg}`}>
        <CategoryProducts variant={c.designVariant || 'accordion'} accent={accent} subGroups={c.subGroups || []} />
      </section>

      {/* CTA */}
      <section className="py-16 text-center text-white" style={{ background: `linear-gradient(135deg, ${accent}, ${accent}dd)` }}>
        <div className="container-x max-w-2xl mx-auto">
          <h2 className="font-sans text-3xl md:text-4xl font-light">Bu grup için teklif alın</h2>
          <p className="mt-4 text-white/85">Hammadde teklif talepleri, MSDS / TDS dökümanları ve numune talepleri için bizimle iletişime geçin.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href={c.cta?.quoteHref || '/iletisim'} className="inline-flex items-center px-6 py-3 rounded-full bg-white font-semibold" style={{ color: accent }}>
              Teklif Al
            </Link>
            <Link href={c.cta?.msdsHref || '/iletisim'} className="inline-flex items-center px-6 py-3 rounded-full border border-white/50 text-white font-semibold hover:bg-white/10 transition">
              MSDS / TDS Talep
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
