import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { getPayloadClient } from '@/lib/payload'
import { mediaUrl, mediaAlt } from '@/lib/cn'

export const revalidate = 60

export const metadata = { title: 'Sektörlerimiz' }

export default async function SectorsPage() {
  let sectors: any[] = []
  try {
    const payload = await getPayloadClient()
    const result = await payload.find({ collection: 'sectors', depth: 2, limit: 10 })
    sectors = result.docs as any[]
  } catch {
    sectors = []
  }

  const themeAccent: Record<string, string> = {
    chem: 'from-sector-chem/80 to-sector-chemLight/30',
    build: 'from-sector-build/80 to-sector-buildLight/30',
    food: 'from-sector-food/80 to-sector-foodLight/30',
  }

  return (
    <>
      <section className="bg-brand-deep text-white py-24">
        <div className="container-x text-center max-w-3xl mx-auto">
          <span className="eyebrow">Faaliyet Alanlarımız</span>
          <h1 className="font-serif text-4xl md:text-6xl mt-3">Üç Sektör, Tek Kurumsal Güç</h1>
          <p className="mt-5 text-white/80 leading-relaxed">
            Kimya, Yapı ve Gıda sektörlerinde uzman ekiplerimizle son kullanıcıya değer üreten çözümler geliştiriyoruz.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container-x grid gap-8 md:grid-cols-3">
          {sectors.map((s) => {
            const img = mediaUrl(s.cardImage)
            return (
              <Link
                key={s.id}
                href={`/sektorler/${s.slug}`}
                data-theme={s.theme}
                className="group relative overflow-hidden rounded-2xl aspect-[3/4] block"
              >
                {img && (
                  <Image
                    src={img}
                    alt={mediaAlt(s.cardImage, s.name)}
                    fill
                    className="object-cover group-hover:scale-105 transition duration-700"
                  />
                )}
                <div className={`absolute inset-0 bg-gradient-to-t ${themeAccent[s.theme] || themeAccent.chem}`} />
                <div className="absolute inset-x-0 bottom-0 p-7 text-white">
                  <h2 className="font-serif text-3xl">{s.name}</h2>
                  {s.shortDescription && (
                    <p className="text-sm text-white/85 mt-2 line-clamp-3">{s.shortDescription}</p>
                  )}
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium group-hover:gap-2 transition-all">
                    Sayfaya git <ArrowRight size={14} />
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
