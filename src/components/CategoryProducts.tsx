'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/cn'

type SubGroup = { title: string; products: { name: string }[] }
type Props = { variant: string; accent: string; subGroups: SubGroup[] }

export function CategoryProducts({ variant, accent, subGroups }: Props) {
  const style = { ['--cat-accent' as any]: accent } as React.CSSProperties

  if (variant === 'grid') return <GridLayout subGroups={subGroups} style={style} accent={accent} />
  if (variant === 'columns') return <ColumnsLayout subGroups={subGroups} style={style} accent={accent} />
  if (variant === 'table') return <TableLayout subGroups={subGroups} style={style} accent={accent} />
  return <AccordionLayout subGroups={subGroups} style={style} accent={accent} />
}

/* ===== 1. ACCORDION — aç-kapa alt gruplar ===== */
function AccordionLayout({ subGroups, style, accent }: { subGroups: SubGroup[]; style: any; accent: string }) {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <div className="container-x max-w-4xl space-y-3" style={style}>
      {subGroups.map((g, i) => {
        const isOpen = open === i
        return (
          <div key={i} className={cn('rounded-2xl border bg-white overflow-hidden transition', isOpen && 'card-shadow')} style={{ borderColor: isOpen ? accent : '#E2E8F0' }}>
            <button onClick={() => setOpen(isOpen ? null : i)} className="w-full flex items-center justify-between gap-4 p-5 text-left">
              <div className="flex items-center gap-4">
                <span className="font-mono text-sm" style={{ color: accent }}>{String(i + 1).padStart(2, '0')}</span>
                <h3 className="font-sans text-lg md:text-xl text-brand-navy font-semibold">{g.title}</h3>
                <span className="text-xs text-brand-muted">({g.products.length})</span>
              </div>
              <ChevronDown className={cn('shrink-0 transition', isOpen && 'rotate-180')} style={{ color: isOpen ? accent : '#94A3B8' }} />
            </button>
            <div className={cn('overflow-hidden transition-all', isOpen ? 'max-h-[3000px]' : 'max-h-0')}>
              <ul className="px-5 pb-5 pt-1 grid sm:grid-cols-2 gap-x-6 gap-y-2 border-t border-brand-line">
                {g.products.map((p, pi) => (
                  <li key={pi} className="flex items-start gap-2 text-sm text-brand-muted pt-2">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full shrink-0" style={{ background: accent }} />
                    {p.name}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )
      })}
    </div>
  )
}

/* ===== 2. GRID — alt grup kartları + ürün chipleri ===== */
function GridLayout({ subGroups, style, accent }: { subGroups: SubGroup[]; style: any; accent: string }) {
  return (
    <div className="container-x grid gap-6 md:grid-cols-2" style={style}>
      {subGroups.map((g, i) => (
        <div key={i} className="rounded-2xl border border-brand-line bg-white p-6 hover:card-shadow transition">
          <div className="flex items-center gap-3 mb-4">
            <span className="h-8 w-8 rounded-lg flex items-center justify-center text-white text-xs font-bold" style={{ background: accent }}>
              {String(i + 1).padStart(2, '0')}
            </span>
            <h3 className="font-sans text-lg text-brand-navy font-semibold">{g.title}</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {g.products.map((p, pi) => (
              <span key={pi} className="text-xs px-3 py-1.5 rounded-full border bg-brand-cream text-brand-navy" style={{ borderColor: `${accent}33` }}>
                {p.name}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

/* ===== 3. COLUMNS — 3 sütun masonry liste ===== */
function ColumnsLayout({ subGroups, style, accent }: { subGroups: SubGroup[]; style: any; accent: string }) {
  return (
    <div className="container-x" style={style}>
      <div className="columns-1 md:columns-2 lg:columns-3 gap-6 [column-fill:balance]">
        {subGroups.map((g, i) => (
          <div key={i} className="mb-6 break-inside-avoid rounded-2xl border border-brand-line bg-white p-5">
            <h3 className="font-sans text-base font-semibold text-brand-navy pb-3 mb-3 border-b-2" style={{ borderColor: accent }}>
              {g.title}
            </h3>
            <ul className="space-y-1.5">
              {g.products.map((p, pi) => (
                <li key={pi} className="text-sm text-brand-muted flex items-start gap-2">
                  <span className="mt-1.5 h-1 w-1 rounded-full shrink-0" style={{ background: accent }} />
                  {p.name}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ===== 4. TABLE — tek liste, alfabetik, sütunlu ===== */
function TableLayout({ subGroups, style, accent }: { subGroups: SubGroup[]; style: any; accent: string }) {
  const all = subGroups.flatMap((g) => g.products.map((p) => p.name)).sort((a, b) => a.localeCompare(b, 'tr'))
  return (
    <div className="container-x max-w-4xl" style={style}>
      <div className="rounded-2xl border border-brand-line bg-white overflow-hidden">
        <div className="px-6 py-4 flex items-center justify-between" style={{ background: `${accent}10` }}>
          <span className="font-semibold text-brand-navy">Ürün Listesi</span>
          <span className="text-sm text-brand-muted">{all.length} ürün</span>
        </div>
        <ul className="grid sm:grid-cols-2 lg:grid-cols-3">
          {all.map((name, i) => (
            <li key={i} className="flex items-center gap-2 text-sm text-brand-navy px-6 py-3 border-t border-brand-line">
              <span className="h-1.5 w-1.5 rounded-full shrink-0" style={{ background: accent }} />
              {name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
