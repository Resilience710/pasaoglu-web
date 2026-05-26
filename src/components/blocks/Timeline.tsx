'use client'

import { useState } from 'react'
import { cn } from '@/lib/cn'

export function Timeline({ block }: { block: any }) {
  const items = block.milestones || []
  const [active, setActive] = useState(0)
  const cur = items[active]

  return (
    <section className="py-24 bg-white">
      <div className="container-x">
        <div className="text-center mb-14">
          {block.title && (
            <h2 className="font-sans text-4xl md:text-5xl text-brand-navy font-light">{block.title}</h2>
          )}
          <div className="mt-6 mx-auto h-px w-16 bg-themed-accent" />
          {block.description && <p className="body-lead mt-6 max-w-2xl mx-auto">{block.description}</p>}
        </div>

        <div className="relative overflow-x-auto pb-4">
          <div className="relative min-w-[700px] md:min-w-0 px-4 py-10">
            <div className="absolute left-4 right-4 top-1/2 h-px bg-brand-line -translate-y-1/2" />
            <div className="relative grid" style={{ gridTemplateColumns: `repeat(${items.length}, 1fr)` }}>
              {items.map((m: any, i: number) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className="flex flex-col items-center group"
                >
                  <div className={cn(
                    'mb-3 text-center px-2 max-w-[120px]',
                    i % 2 === 0 ? 'order-1' : 'order-3',
                  )}>
                    <span className="text-[10px] uppercase tracking-wider text-brand-muted block">{m.title}</span>
                  </div>
                  <div className={cn(
                    'order-2 h-3 w-3 rounded-full border-2 transition relative z-10',
                    active === i
                      ? 'bg-themed-accent border-themed-accent scale-125'
                      : 'bg-white border-brand-muted/40 group-hover:border-themed-accent',
                  )} />
                  <span className={cn(
                    'mt-3 font-mono text-xs',
                    i % 2 === 0 ? 'order-3' : 'order-1 mb-3 mt-0',
                    active === i ? 'text-brand-navy font-semibold' : 'text-brand-muted',
                  )}>
                    {m.year}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {cur && (
          <div className="mt-12 text-center max-w-2xl mx-auto">
            <span className="text-xs uppercase tracking-[0.2em] text-themed-accent">{cur.year}</span>
            <h3 className="mt-3 font-sans text-2xl md:text-3xl text-brand-navy font-medium">{cur.title}</h3>
            {cur.description && <p className="mt-4 body-lead">{cur.description}</p>}
          </div>
        )}
      </div>
    </section>
  )
}
