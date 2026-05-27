import type { Metadata } from 'next'
import { mediaUrl } from './cn'

const SITE = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

export function buildPageMetadata(args: {
  page: any
  settings: any
  pathname: string
}): Metadata {
  const { page, settings, pathname } = args
  const seo = settings?.seo || {}
  const meta = page?.meta || {}

  const title = meta.title || page?.title || page?.name
  const description = meta.description || seo.defaultDescription
  const ogTitle = meta.ogTitle || title
  const ogDescription = meta.ogDescription || description
  const ogImage = mediaUrl(meta.image) || mediaUrl(seo.defaultOgImage)
  const absoluteOgImage = ogImage?.startsWith('http') ? ogImage : ogImage ? `${SITE}${ogImage}` : undefined
  const canonical = meta.canonicalUrl || `${SITE}${pathname}`
  const keywords = meta.keywords ? String(meta.keywords).split(',').map((k: string) => k.trim()) : undefined

  return {
    title,
    description,
    keywords,
    metadataBase: new URL(SITE),
    alternates: { canonical },
    robots: meta.noindex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      type: 'website',
      url: canonical,
      siteName: seo.siteName || 'Paşaoğlu Group',
      title: ogTitle,
      description: ogDescription,
      locale: 'tr_TR',
      images: absoluteOgImage ? [{ url: absoluteOgImage, width: 1200, height: 630 }] : undefined,
    },
    twitter: {
      card: absoluteOgImage ? 'summary_large_image' : 'summary',
      title: ogTitle,
      description: ogDescription,
      site: seo.twitterHandle ? `@${seo.twitterHandle}` : undefined,
      images: absoluteOgImage ? [absoluteOgImage] : undefined,
    },
  }
}

export function organizationJsonLd(settings: any) {
  const seo = settings?.seo || {}
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: seo.organizationLegalName || seo.siteName || 'Paşaoğlu Group',
    url: SITE,
    logo: mediaUrl(settings?.logo) ? `${SITE}${mediaUrl(settings?.logo)}` : undefined,
    telephone: settings?.phone,
    email: settings?.email,
    sameAs: (settings?.social || []).map((s: any) => s.url),
    address: (settings?.addresses || []).map((a: any) => ({
      '@type': 'PostalAddress',
      name: a.name,
      streetAddress: a.address,
      addressCountry: 'TR',
    })),
  }
}
