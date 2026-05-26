import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { mediaUrl, mediaAlt, cn } from '@/lib/cn'

export function FeatureCards({ block }: { block: any }) {
  const cards = block.cards || []
  const cols = block.columns || '3'
  const gridCls = cn(
    'grid gap-6',
    cols === '2' && 'md:grid-cols-2',
    cols === '3' && 'md:grid-cols-3',
    cols === '4' && 'md:grid-cols-2 lg:grid-cols-4',
  )

  return (
    <section className="py-20 md:py-24">
      <div className="container-x">
        {(block.eyebrow || block.title) && (
          <div className="max-w-2xl mx-auto text-center mb-12">
            {block.eyebrow && <span className="eyebrow">{block.eyebrow}</span>}
            {block.title && <h2 className="section-title mt-3">{block.title}</h2>}
            {block.description && <p className="body-lead mt-4">{block.description}</p>}
          </div>
        )}
        <div className={gridCls}>
          {cards.map((c: any, i: number) => {
            const imgSrc = mediaUrl(c.image)
            const Wrapper: any = c.href ? Link : 'div'
            const wrapperProps: any = c.href ? { href: c.href } : {}
            return (
              <Wrapper
                key={i}
                {...wrapperProps}
                className="group block bg-white rounded-2xl overflow-hidden border border-brand-line hover:-translate-y-1 hover:card-shadow transition-all"
              >
                {imgSrc && (
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image src={imgSrc} alt={mediaAlt(c.image, c.title)} fill className="object-cover group-hover:scale-105 transition duration-700" />
                  </div>
                )}
                <div className="p-6">
                  <h3 className="font-serif text-2xl text-brand-navy">{c.title}</h3>
                  {c.description && <p className="mt-2 text-sm text-brand-muted leading-relaxed">{c.description}</p>}
                  {c.href && (
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-brand-gold group-hover:gap-2 transition-all">
                      Detayları gör <ArrowRight size={14} />
                    </span>
                  )}
                </div>
              </Wrapper>
            )
          })}
        </div>
      </div>
    </section>
  )
}
