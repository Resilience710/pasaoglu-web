import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'
import { mediaUrl, mediaAlt } from '@/lib/cn'

function formatDate(d?: string) {
  if (!d) return ''
  try {
    return new Date(d).toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' })
  } catch { return '' }
}

export function NewsGrid({ block }: { block: any }) {
  const items = block.items || []
  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="container-x">
        <div className="text-center mb-12 md:mb-16 max-w-2xl mx-auto">
          {block.eyebrow && <span className="eyebrow">{block.eyebrow}</span>}
          {block.title && (
            <h2 className="font-sans text-3xl md:text-5xl text-brand-navy font-light mt-3">{block.title}</h2>
          )}
          <div className="mt-6 mx-auto h-px w-16 bg-themed-accent" />
          {block.description && <p className="body-lead mt-6">{block.description}</p>}
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((n: any, i: number) => {
            const img = mediaUrl(n.image)
            const Wrapper: any = n.href ? Link : 'article'
            const wrapperProps: any = n.href ? { href: n.href } : {}
            return (
              <Wrapper
                key={i}
                {...wrapperProps}
                className="group block bg-white rounded-2xl overflow-hidden border border-brand-line hover:border-themed-accent hover:-translate-y-1 transition-all"
              >
                <div className="relative aspect-[5/3] bg-brand-cream overflow-hidden">
                  {img ? (
                    <Image src={img} alt={mediaAlt(n.image, n.title)} fill className="object-cover group-hover:scale-105 transition duration-700" />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-cream to-brand-line" />
                  )}
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider mb-2">
                    {n.date && <span className="text-themed-accent font-semibold">{formatDate(n.date)}</span>}
                    {n.date && n.category && <span className="text-brand-muted/40">·</span>}
                    {n.category && <span className="text-brand-muted">{n.category}</span>}
                  </div>
                  <h3 className="font-sans text-base md:text-lg text-brand-navy font-semibold leading-snug line-clamp-3">
                    {n.title}
                  </h3>
                  {n.excerpt && (
                    <p className="mt-3 text-sm text-brand-muted leading-relaxed line-clamp-3">{n.excerpt}</p>
                  )}
                  {n.href && (
                    <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-brand-navy group-hover:text-themed-accent transition">
                      Devamı <ArrowUpRight size={14} />
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
