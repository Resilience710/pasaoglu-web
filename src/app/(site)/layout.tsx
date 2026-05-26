import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { getPayloadClient } from '@/lib/payload'
import './globals.css'

const inter = Inter({ subsets: ['latin', 'latin-ext'], variable: '--font-inter', display: 'swap' })
const playfair = Playfair_Display({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-playfair',
  display: 'swap',
})

export const metadata: Metadata = {
  title: { default: 'Paşaoğlu Group', template: '%s | Paşaoğlu Group' },
  description: 'Kimya, Yapı ve Gıda sektörlerinde holding yapılanmasıyla katma değer üreten kurumsal grup.',
  metadataBase: process.env.NEXT_PUBLIC_SERVER_URL ? new URL(process.env.NEXT_PUBLIC_SERVER_URL) : undefined,
}

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const payload = await getPayloadClient()
  const [settings, nav] = await Promise.all([
    payload.findGlobal({ slug: 'siteSettings', depth: 2 }).catch(() => ({})),
    payload.findGlobal({ slug: 'mainNav', depth: 1 }).catch(() => ({ items: [] })),
  ])

  return (
    <html lang="tr" className={`${inter.variable} ${playfair.variable}`}>
      <body>
        <Header nav={nav as any} settings={settings as any} />
        <main>{children}</main>
        <Footer settings={settings as any} />
      </body>
    </html>
  )
}
