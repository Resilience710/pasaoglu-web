import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { ArrowUpRight } from 'lucide-react'
import { getPayloadClient } from '@/lib/payload'
import { mediaUrl, mediaAlt } from '@/lib/cn'
import { CAT_EN } from '@/lib/enCats'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Products',
  description: 'Paşaoğlu chemical product categories — food, cosmetic, construction, agriculture, textile, industrial, leather and detergent chemicals.',
}

export default async function ProductsHubPageEn() {
  let cats: any[] = []
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({ collection: 'productCategories', depth: 2, limit: 50, sort: 'sortOrder' })
    cats = result.docs as any[]
  } catch {
    cats = []
  }
  const totalProducts = cats.reduce(
    (sum, c) => sum + (c.subGroups || []).reduce((s: number, g: any) => s + (g.products?.length || 0), 0),
    0,
  )

  return (
    <>
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-20 bg-brand-deep text-white overflow-hidden">
        <div className="absolute inset-0 opacity-[0.07] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        <div className="relative container-x text-center max-w-3xl mx-auto">
          <span className="text-[11px] font-semibold uppercase tracking-[0.32em] text-themed-accent">Product Catalog</span>
          <h1 className="mt-4 font-sans text-4xl md:text-6xl font-light leading-tight">
            Wide <span className="font-semibold">Product Range</span>
          </h1>
          <div className="mt-6 mx-auto h-px w-16 bg-themed-accent" />
          <p className="mt-6 text-white/75 leading-relaxed">
            {totalProducts}+ products across {cats.length} categories. High-quality raw materials and technical
            support across every category the chemical industry needs.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container-x grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cats.map((c) => {
            const img = mediaUrl(c.image)
            const accent = c.accent || '#3B82F6'
            const count = (c.subGroups || []).reduce((s: number, g: any) => s + (g.products?.length || 0), 0)
            const name = CAT_EN[c.slug] || c.name
            return (
              <Link key={c.id} href={`/en/urunler/${c.slug}`} className="group relative block overflow-hidden rounded-2xl border border-brand-line bg-white hover:-translate-y-1 transition-all hover:card-shadow">
                <div className="relative aspect-[16/10] overflow-hidden bg-brand-cream">
                  {img ? (
                    <Image src={img} alt={mediaAlt(c.image, name)} fill className="object-cover group-hover:scale-105 transition duration-700" />
                  ) : (
                    <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${accent}22, ${accent}05)` }} />
                  )}
                  <div className="absolute top-3 left-3 text-[11px] font-bold uppercase tracking-wider text-white px-3 py-1.5 rounded-full" style={{ background: accent }}>
                    {count} products
                  </div>
                </div>
                <div className="p-6">
                  <div className="h-1 w-10 rounded-full mb-4" style={{ background: accent }} />
                  <h2 className="font-sans text-xl md:text-2xl text-brand-navy font-semibold leading-snug">{name}</h2>
                  <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold" style={{ color: accent }}>
                    Explore <ArrowUpRight size={15} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      </section>
    </>
  )
}
