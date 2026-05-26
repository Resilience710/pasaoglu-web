'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/cn'

export function ProductAccordion({ block }: { block: any }) {
  const cats = (block.categories || []) as any[]
  const [open, setOpen] = useState<string | null>(cats[0]?.id || null)

  return (
    <section className="py-20 bg-brand-cream">
      <div className="container-x">
        {(block.title || block.description) && (
          <div className="text-center max-w-2xl mx-auto mb-12">
            {block.title && <h2 className="section-title">{block.title}</h2>}
            {block.description && <p className="body-lead mt-3">{block.description}</p>}
          </div>
        )}
        <div className="space-y-3">
          {cats.map((cat, idx) => {
            const isOpen = open === cat.id
            return (
              <div
                key={cat.id}
                className={cn(
                  'rounded-2xl border border-brand-line bg-white transition',
                  isOpen && 'card-shadow',
                )}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : cat.id)}
                  className="w-full flex items-center justify-between gap-4 p-6 text-left"
                >
                  <div className="flex items-center gap-5">
                    <span className="text-brand-gold font-mono text-sm">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <h3 className="font-serif text-xl md:text-2xl text-brand-navy">{cat.name}</h3>
                      {cat.description && (
                        <p className="text-sm text-brand-muted mt-1 max-w-xl">{cat.description}</p>
                      )}
                    </div>
                  </div>
                  <ChevronDown className={cn('transition shrink-0', isOpen && 'rotate-180 text-brand-gold')} />
                </button>
                <div className={cn('overflow-hidden transition-all', isOpen ? 'max-h-[2000px]' : 'max-h-0')}>
                  <div className="px-6 pb-6 pt-2 border-t border-brand-line">
                    <div className="grid gap-6 md:grid-cols-3">
                      {(cat.subGroups || []).map((sg: any, si: number) => (
                        <div key={si}>
                          <h4 className="text-sm font-semibold uppercase tracking-wider text-brand-navy mb-3">{sg.title}</h4>
                          <ul className="space-y-1 text-sm text-brand-muted">
                            {(sg.products || []).map((p: any, pi: number) => (
                              <li key={pi} className="flex items-start gap-2">
                                <span className="text-brand-gold mt-0.5">•</span>
                                <span>{p.name}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                    {(cat.cta?.quoteHref || cat.cta?.msdsHref) && (
                      <div className="mt-6 flex flex-wrap gap-3">
                        {cat.cta?.quoteHref && (
                          <Link href={cat.cta.quoteHref} className="btn btn-accent">Teklif Al</Link>
                        )}
                        {cat.cta?.msdsHref && (
                          <Link href={cat.cta.msdsHref} className="btn btn-outline">MSDS / TDS Talep</Link>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
