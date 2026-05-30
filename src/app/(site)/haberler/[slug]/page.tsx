import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { getPayloadClient } from '@/lib/payload'
import { mediaUrl, mediaAlt } from '@/lib/cn'
import { RichText } from '@/components/RichText'
import { buildPageMetadata } from '@/lib/seo'

export const revalidate = 60

// ⛔ Haberler bölümü şu an PASİF (bkz. /haberler/page.tsx)
const NEWS_ENABLED = false

type Props = { params: Promise<{ slug: string }> }

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
  return new Date(d).toLocaleDateString('tr-TR', { day: '2-digit', month: 'long', year: 'numeric' })
}

async function getArticle(slug: string) {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'newsArticles',
    where: { slug: { equals: slug } },
    depth: 2,
    limit: 1,
  })
  return result.docs[0] as any
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const payload = await getPayloadClient()
  const [article, settings] = await Promise.all([
    getArticle(slug),
    payload.findGlobal({ slug: 'siteSettings', depth: 1 }).catch(() => ({})),
  ])
  if (!article) return {}
  return buildPageMetadata({
    page: {
      ...article,
      meta: {
        ...(article.meta || {}),
        title: article.meta?.title || article.title,
        description: article.meta?.description || article.excerpt,
        image: article.meta?.image || article.image,
      },
    },
    settings,
    pathname: `/haberler/${slug}`,
  })
}

export async function generateStaticParams() {
  if (!NEWS_ENABLED) return []
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({ collection: 'newsArticles', limit: 100 })
    return result.docs.map((d: any) => ({ slug: d.slug }))
  } catch {
    return []
  }
}

export default async function ArticlePage({ params }: Props) {
  if (!NEWS_ENABLED) notFound()
  const { slug } = await params
  const article = await getArticle(slug)
  if (!article) notFound()

  const img = mediaUrl(article.image)

  // related
  const payload = await getPayloadClient()
  const related = await payload.find({
    collection: 'newsArticles',
    where: { id: { not_equals: article.id } },
    sort: '-date',
    limit: 3,
    depth: 2,
  })

  return (
    <>
      <article>
        {/* Hero */}
        <section className="relative pt-32 pb-12 md:pt-40 md:pb-16 bg-brand-deep text-white overflow-hidden">
          <div className="absolute inset-0 opacity-[0.07] pointer-events-none" style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }} />
          <div className="relative container-x max-w-3xl">
            <Link href="/haberler" className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white mb-6 transition">
              <ArrowLeft size={16} /> Haberler
            </Link>
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] mb-5">
              <span className="text-themed-accent font-semibold">{formatDate(article.date)}</span>
              <span className="text-white/40">·</span>
              <span className="text-white/70">{CATEGORY_LABELS[article.category] || article.category}</span>
            </div>
            <h1 className="font-sans text-3xl md:text-5xl font-semibold leading-tight">{article.title}</h1>
            <p className="mt-5 text-white/80 leading-relaxed text-lg max-w-2xl">{article.excerpt}</p>
          </div>
        </section>

        {/* Cover */}
        {img && (
          <div className="container-x -mt-8 md:-mt-12 relative z-10">
            <div className="relative aspect-[16/9] md:aspect-[21/9] rounded-2xl overflow-hidden card-shadow">
              <Image src={img} alt={mediaAlt(article.image, article.title)} fill className="object-cover" priority sizes="(min-width: 1024px) 80vw, 100vw" />
            </div>
          </div>
        )}

        {/* Body */}
        <section className="py-16 md:py-24">
          <div className="container-x max-w-3xl">
            <div className="prose prose-lg max-w-none text-brand-navy">
              <RichText content={article.body} />
            </div>
          </div>
        </section>
      </article>

      {/* Related */}
      {related.docs.length > 0 && (
        <section className="py-16 md:py-20 bg-brand-cream">
          <div className="container-x">
            <h2 className="text-xs uppercase tracking-[0.22em] text-themed-accent font-semibold mb-8">
              Diğer Haberler
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {(related.docs as any[]).map((n) => {
                const ri = mediaUrl(n.image)
                return (
                  <Link
                    key={n.id}
                    href={`/haberler/${n.slug}`}
                    className="group block bg-white rounded-2xl overflow-hidden border border-brand-line hover:border-themed-accent hover:-translate-y-1 transition-all"
                  >
                    <div className="relative aspect-[5/3] overflow-hidden">
                      {ri && <Image src={ri} alt={mediaAlt(n.image, n.title)} fill className="object-cover group-hover:scale-105 transition duration-700" />}
                    </div>
                    <div className="p-5">
                      <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider mb-2">
                        <span className="text-themed-accent font-semibold">{formatDate(n.date)}</span>
                      </div>
                      <h3 className="font-sans text-lg text-brand-navy font-semibold leading-snug line-clamp-3">{n.title}</h3>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
