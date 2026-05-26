'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/cn'
import { RichText } from '@/components/RichText'

export function Accordion({ block }: { block: any }) {
  const [open, setOpen] = useState<number | null>(0)
  const items = block.items || []

  return (
    <section className="py-20">
      <div className="container-x max-w-3xl">
        {(block.title || block.description) && (
          <div className="mb-10 text-center">
            {block.title && <h2 className="section-title">{block.title}</h2>}
            {block.description && <p className="body-lead mt-3">{block.description}</p>}
          </div>
        )}
        <div className="divide-y divide-brand-line border-y border-brand-line">
          {items.map((it: any, i: number) => (
            <div key={i}>
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between gap-4 py-5 text-left"
              >
                <span className="font-serif text-xl text-brand-navy">{it.title}</span>
                <ChevronDown className={cn('transition text-themed-accent', open === i && 'rotate-180')} />
              </button>
              <div className={cn('overflow-hidden transition-all', open === i ? 'max-h-[600px] pb-6' : 'max-h-0')}>
                <RichText content={it.body} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
