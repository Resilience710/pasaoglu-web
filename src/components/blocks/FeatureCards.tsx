import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'
import { mediaUrl, mediaAlt, cn } from '@/lib/cn'

export function FeatureCards({ block }: { block: any }) {
  const cards = block.cards || []
  const cols = block.columns || '3'
  const gridCls = cn(
    'grid gap-5 md:gap-6',
    cols === '2' && 'md:grid-cols-2',
    cols === '3' && 'md:grid-cols-3',
    cols === '4' && 'md:grid-cols-2 lg:grid-cols-4',
  )

  return (
    <section className="py-20 md:py-28">
      <div className="container-x">
        {(block.eyebrow || block.title) && (
          <div className="max-w-2xl mx-auto text-center mb-14">
            {block.eyebrow && <span className="eyebrow">{block.eyebrow}</span>}
            {block.title && (
              <h2 className="font-sans text-4xl md:text-5xl text-brand-navy font-light mt-3">{block.title}</h2>
            )}
            <div className="mt-6 mx-auto h-px w-16 bg-themed-accent" />
            {block.description && <p className="body-lead mt-6">{block.description}</p>}
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
                className="group relative block bg-white rounded-2xl overflow-hidden border border-brand-line hover:border-themed-accent transition-all hover:-translate-y-1 hover:card-shadow"
              >
                {imgSrc && (
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image src={imgSrc} alt={mediaAlt(c.image, c.title)} fill className="object-cover group-hover:scale-105 transition duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-deep/30 to-transparent opacity-0 group-hover:opacity-100 transition" />
                  </div>
                )}
                <div className="p-7">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xs font-mono text-themed-accent">{String(i + 1).padStart(2, '0')}</span>
                    <div className="h-px flex-1 bg-brand-line group-hover:bg-themed-accent transition" />
                  </div>
                  <h3 className="font-sans text-xl md:text-2xl text-brand-navy font-medium leading-snug">{c.title}</h3>
                  {c.description && (
                    <p className="mt-3 text-sm text-brand-muted leading-relaxed">{c.description}</p>
                  )}
                  {c.href && (
                    <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-brand-navy group-hover:text-themed-accent transition">
                      İncele <ArrowUpRight size={15} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
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
