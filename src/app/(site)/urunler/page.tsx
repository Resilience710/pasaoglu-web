import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { ArrowUpRight } from 'lucide-react'
import { getPayloadClient } from '@/lib/payload'
import { mediaUrl, mediaAlt } from '@/lib/cn'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Ürünler',
  description: 'Paşaoğlu Kimya ürün kategorileri — gıda, kozmetik, yapı, tarım, tekstil, endüstriyel, deri ve deterjan kimyasalları.',
}

export default async function ProductsHubPage() {
  let cats: any[] = []
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'productCategories',
      depth: 2,
      limit: 50,
      sort: 'sortOrder',
    })
    cats = result.docs as any[]
  } catch (e) {
    // Veritabanı şeması henüz hazır değilse (seed çalışmadan build) sayfa boş gelir;
    // seed sonrası ISR ile dolar. Build'i çökertmemek için yutuluyor.
    cats = []
  }
  const totalProducts = cats.reduce(
    (sum, c) => sum + (c.subGroups || []).reduce((s: number, g: any) => s + (g.products?.length || 0), 0),
    0,
  )

  return (
    <>
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-20 bg-brand-deep text-white overflow-hidden">
        <div className="absolute inset-0 opacity-[0.07] pointer-events-none" style={{
          backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }} />
        <div className="relative container-x text-center max-w-3xl mx-auto">
          <span className="text-[11px] font-semibold uppercase tracking-[0.32em] text-themed-accent">Ürün Kataloğu</span>
          <h1 className="mt-4 font-sans text-4xl md:text-6xl font-light leading-tight">
            Geniş <span className="font-semibold">Ürün Yelpazesi</span>
          </h1>
          <div className="mt-6 mx-auto h-px w-16 bg-themed-accent" />
          <p className="mt-6 text-white/75 leading-relaxed">
            {cats.length} kategoride {totalProducts}+ ürün. Kimya sektörünün ihtiyaç duyduğu tüm
            kategorilerde yüksek kaliteli hammadde ve teknik destek.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container-x grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cats.map((c) => {
            const img = mediaUrl(c.image)
            const accent = c.accent || '#3B82F6'
            const count = (c.subGroups || []).reduce((s: number, g: any) => s + (g.products?.length || 0), 0)
            return (
              <Link
                key={c.id}
                href={`/urunler/${c.slug}`}
                className="group relative block overflow-hidden rounded-2xl border border-brand-line bg-white hover:-translate-y-1 transition-all hover:card-shadow"
                style={{ ['--cat-accent' as any]: accent }}
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-brand-cream">
                  {img ? (
                    <Image src={img} alt={mediaAlt(c.image, c.name)} fill className="object-cover group-hover:scale-105 transition duration-700" />
                  ) : (
                    <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${accent}22, ${accent}05)` }} />
                  )}
                  <div className="absolute top-3 left-3 text-[11px] font-bold uppercase tracking-wider text-white px-3 py-1.5 rounded-full" style={{ background: accent }}>
                    {count} ürün
                  </div>
                </div>
                <div className="p-6">
                  <div className="h-1 w-10 rounded-full mb-4" style={{ background: accent }} />
                  <h2 className="font-sans text-xl md:text-2xl text-brand-navy font-semibold leading-snug">{c.name}</h2>
                  {c.description && (
                    <p className="mt-3 text-sm text-brand-muted leading-relaxed line-clamp-2">{c.description}</p>
                  )}
                  <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold" style={{ color: accent }}>
                    İncele <ArrowUpRight size={15} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
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
