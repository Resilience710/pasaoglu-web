import type { MetadataRoute } from 'next'
import { getPayloadClient } from '@/lib/payload'

const SITE = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let pages: any[] = []
  let sectors: any[] = []
  let news: any[] = []
  try {
    const payload = await getPayloadClient()
    const [pgs, scs, ns] = await Promise.all([
      payload.find({ collection: 'pages', limit: 200, where: { 'meta.noindex': { not_equals: true } } }),
      payload.find({ collection: 'sectors', limit: 20 }),
      payload.find({ collection: 'newsArticles', limit: 200 }).catch(() => ({ docs: [] })),
    ])
    pages = pgs.docs
    sectors = scs.docs
    news = ns.docs
  } catch {}

  const pageUrls = pages.map((p: any) => ({
    url: p.slug === 'home' ? SITE : `${SITE}/${p.slug}`,
    lastModified: new Date(p.updatedAt),
    changeFrequency: 'monthly' as const,
    priority: p.slug === 'home' ? 1.0 : 0.7,
  }))

  const sectorUrls = sectors.map((s: any) => ({
    url: `${SITE}/sektorler/${s.slug}`,
    lastModified: new Date(s.updatedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  const newsUrls = news.map((n: any) => ({
    url: `${SITE}/haberler/${n.slug}`,
    lastModified: new Date(n.updatedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  return [
    { url: `${SITE}/sektorler`, changeFrequency: 'monthly', priority: 0.9, lastModified: new Date() },
    { url: `${SITE}/haberler`, changeFrequency: 'weekly', priority: 0.8, lastModified: new Date() },
    ...pageUrls,
    ...sectorUrls,
    ...newsUrls,
  ]
}
