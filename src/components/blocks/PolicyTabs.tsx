'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/cn'
import { RichText } from '@/components/RichText'

export function PolicyTabs({ block }: { block: any }) {
  const tabs = block.tabs || []
  const [active, setActive] = useState(0)
  const cur = tabs[active]

  return (
    <section className="py-20 md:py-28 bg-brand-cream">
      <div className="container-x">
        <div className="text-center mb-14">
          {block.sectionEyebrow && <span className="eyebrow">{block.sectionEyebrow}</span>}
          <h2 className="font-sans text-4xl md:text-5xl text-brand-navy font-light mt-3">
            {block.sectionTitle}
          </h2>
          <div className="mt-6 mx-auto h-px w-16 bg-brand-gold" />
        </div>

        <div className="grid gap-8 md:grid-cols-[280px_1fr]">
          <nav className="flex md:flex-col gap-1 overflow-x-auto md:overflow-visible">
            {tabs.map((t: any, i: number) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={cn(
                  'shrink-0 text-left px-5 py-4 rounded-xl transition border whitespace-nowrap md:whitespace-normal',
                  active === i
                    ? 'bg-white border-brand-line text-brand-navy card-shadow'
                    : 'bg-transparent border-transparent text-brand-muted hover:text-brand-navy hover:bg-white/40',
                )}
              >
                <span className={cn('text-xs uppercase tracking-wider block mb-1', active === i ? 'text-brand-gold' : 'text-brand-muted/60')}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="font-medium text-sm md:text-base">{t.title}</span>
              </button>
            ))}
          </nav>

          {cur && (
            <div className="bg-white rounded-2xl card-shadow p-8 md:p-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px w-10 bg-brand-gold" />
                <span className="text-xs uppercase tracking-[0.2em] text-brand-gold">Politika</span>
              </div>
              <h3 className="font-sans text-3xl text-brand-navy font-light mb-6">{cur.title}</h3>
              <div className="prose prose-sm max-w-none text-brand-muted leading-relaxed">
                <RichText content={cur.body} />
              </div>
              {cur.detailHref && (
                <Link
                  href={cur.detailHref}
                  className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-brand-navy hover:text-brand-gold transition"
                >
                  Detay sayfası <ArrowRight size={14} />
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
