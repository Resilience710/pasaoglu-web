import type { MetadataRoute } from 'next'
import { getPayloadClient } from '@/lib/payload'

const SITE = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let pages: any[] = []
  let sectors: any[] = []
  let categories: any[] = []
  try {
    const payload = await getPayloadClient()
    const [pgs, scs, cts] = await Promise.all([
      payload.find({ collection: 'pages', limit: 200, where: { 'meta.noindex': { not_equals: true } } }),
      payload.find({ collection: 'sectors', limit: 20 }),
      payload.find({ collection: 'productCategories', limit: 50 }).catch(() => ({ docs: [] })),
    ])
    pages = pgs.docs
    sectors = scs.docs
    categories = cts.docs
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

  const categoryUrls = categories.map((c: any) => ({
    url: `${SITE}/urunler/${c.slug}`,
    lastModified: new Date(c.updatedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [
    { url: `${SITE}/sektorler`, changeFrequency: 'monthly', priority: 0.9, lastModified: new Date() },
    { url: `${SITE}/urunler`, changeFrequency: 'monthly', priority: 0.9, lastModified: new Date() },
    ...pageUrls,
    ...sectorUrls,
    ...categoryUrls,
  ]
}
