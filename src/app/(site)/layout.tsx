import type { Metadata, Viewport } from 'next'
import Script from 'next/script'
import { Inter, Playfair_Display } from 'next/font/google'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { getPayloadClient } from '@/lib/payload'
import { organizationJsonLd } from '@/lib/seo'
import './globals.css'

const inter = Inter({ subsets: ['latin', 'latin-ext'], variable: '--font-inter', display: 'swap' })
const playfair = Playfair_Display({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-playfair',
  display: 'swap',
})

const SITE = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#0E2A47',
}

export async function generateMetadata(): Promise<Metadata> {
  let settings: any = {}
  try {
    const payload = await getPayloadClient()
    settings = await payload.findGlobal({ slug: 'siteSettings', depth: 1 })
  } catch {}
  const seo = settings?.seo || {}
  return {
    metadataBase: new URL(SITE),
    title: {
      default: seo.siteName || 'Paşaoğlu Group',
      template: seo.titleTemplate || '%s | Paşaoğlu Group',
    },
    description: seo.defaultDescription || 'Kimya, Yapı ve Gıda sektörlerinde holding yapılanmasıyla katma değer üreten kurumsal grup.',
    verification: seo.googleSiteVerification ? { google: seo.googleSiteVerification } : undefined,
  }
}

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  let settings: any = {}
  let nav: any = { items: [] }
  try {
    const payload = await getPayloadClient()
    ;[settings, nav] = await Promise.all([
      payload.findGlobal({ slug: 'siteSettings', depth: 2 }).catch(() => ({})),
      payload.findGlobal({ slug: 'mainNav', depth: 1 }).catch(() => ({ items: [] })),
    ])
  } catch {
    settings = {}
    nav = { items: [] }
  }

  const ga = (settings as any)?.seo?.googleAnalyticsId
  const jsonLd = organizationJsonLd(settings)

  return (
    <html lang="tr" className={`${inter.variable} ${playfair.variable}`}>
      <body>
        <Header nav={nav as any} settings={settings as any} />
        <main>{children}</main>
        <Footer settings={settings as any} />

        {/* JSON-LD Organization Schema */}
        <Script
          id="ld-organization"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {/* Google Analytics */}
        {ga && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${ga}`} strategy="afterInteractive" />
            <Script id="ga" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${ga}');`}
            </Script>
          </>
        )}
      </body>
    </html>
  )
}
