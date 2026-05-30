import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPayloadClient } from '@/lib/payload'
import { mediaUrl, mediaAlt } from '@/lib/cn'

export const revalidate = 60

// ⛔ Haberler bölümü şu an PASİF. Kod korunuyor; tekrar açmak için
// aşağıdaki satırı silin ve mainNav'a "Haberler" linkini geri ekleyin.
const NEWS_ENABLED = false

export const metadata: Metadata = {
  title: 'Haberler & Duyurular',
  description: 'Paşaoğlu Group kurumsal haberleri, sektörel gelişmeler ve duyurular.',
}

const CATEGORY_LABELS: Record<string, string> = {
  kurumsal: 'KURUMSAL',
  sektorel: 'SEKTÖREL',
  surdurulebilirlik: 'SÜRDÜRÜLEBİLİRLİK',
  ihracat: 'İHRACAT',
  kariyer: 'KARİYER',
  arge: 'AR-GE',
  etkinlik: 'ETKİNLİK',
}

function formatDate(d: string | Date) {
  return new Date(d).toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

export default async function NewsListPage() {
  if (!NEWS_ENABLED) notFound()
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'newsArticles',
    depth: 2,
    limit: 50,
    sort: '-date',
  })
  const items = result.docs as any[]
  const featured = items.find((i) => i.featured) || items[0]
  const rest = items.filter((i) => i !== featured)

  return (
    <>
      {/* Page hero */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-20 bg-brand-deep text-white overflow-hidden">
        <div className="absolute inset-0 opacity-[0.07] pointer-events-none" style={{
          backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }} />
        <div className="relative container-x text-center">
          <span className="text-[11px] font-light uppercase tracking-[0.4em] text-white/70">Haber Bülteni</span>
          <h1 className="mt-4 font-sans text-4xl md:text-6xl font-light leading-tight">
            Paşaoğlu’dan <span className="font-bold">Haberler</span>
          </h1>
          <div className="mt-6 mx-auto h-px w-16 bg-themed-accent" />
          <p className="mt-6 max-w-xl mx-auto text-white/75 leading-relaxed">
            Kurumsal haberler, sektörel gelişmeler ve grup şirketlerimize dair duyurular.
          </p>
        </div>
      </section>

      {/* Featured */}
      {featured && (
        <section className="py-16 md:py-20">
          <div className="container-x">
            <Link href={`/haberler/${featured.slug}`} className="group grid gap-8 md:grid-cols-2 items-center">
              <div className="relative aspect-[5/4] overflow-hidden rounded-2xl">
                {mediaUrl(featured.image) && (
                  <Image
                    src={mediaUrl(featured.image)!}
                    alt={mediaAlt(featured.image, featured.title)}
                    fill
                    className="object-cover group-hover:scale-105 transition duration-700"
                    sizes="(min-width: 768px) 50vw, 100vw"
                  />
                )}
                <div className="absolute top-4 left-4 bg-themed-accent text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded">
                  Öne Çıkan
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider mb-4">
                  <span className="text-themed-accent font-semibold">{formatDate(featured.date)}</span>
                  <span className="text-brand-muted/40">·</span>
                  <span className="text-brand-muted">{CATEGORY_LABELS[featured.category] || featured.category}</span>
                </div>
                <h2 className="font-sans text-2xl md:text-4xl text-brand-navy font-semibold leading-tight">
                  {featured.title}
                </h2>
                <p className="mt-5 text-brand-muted leading-relaxed">{featured.excerpt}</p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand-navy group-hover:text-themed-accent transition">
                  <span className="border-b border-brand-navy group-hover:border-themed-accent pb-0.5">Devamını oku</span>
                  →
                </span>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* Grid */}
      <section className="py-16 md:py-20 bg-brand-cream">
        <div className="container-x">
          <h2 className="text-xs uppercase tracking-[0.22em] text-themed-accent font-semibold mb-8">
            Tüm Haberler
          </h2>
          {rest.length === 0 ? (
            <p className="text-brand-muted">Henüz yayınlanmış başka haber yok.</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((n) => {
                const img = mediaUrl(n.image)
                return (
                  <Link
                    key={n.id}
                    href={`/haberler/${n.slug}`}
                    className="group block bg-white rounded-2xl overflow-hidden border border-brand-line hover:border-themed-accent hover:-translate-y-1 transition-all"
                  >
                    <div className="relative aspect-[5/3] overflow-hidden">
                      {img && (
                        <Image
                          src={img}
                          alt={mediaAlt(n.image, n.title)}
                          fill
                          className="object-cover group-hover:scale-105 transition duration-700"
                          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        />
                      )}
                    </div>
                    <div className="p-5">
                      <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider mb-2">
                        <span className="text-themed-accent font-semibold">{formatDate(n.date)}</span>
                        <span className="text-brand-muted/40">·</span>
                        <span className="text-brand-muted">{CATEGORY_LABELS[n.category] || n.category}</span>
                      </div>
                      <h3 className="font-sans text-lg text-brand-navy font-semibold leading-snug line-clamp-3">
                        {n.title}
                      </h3>
                      <p className="mt-3 text-sm text-brand-muted leading-relaxed line-clamp-3">{n.excerpt}</p>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
