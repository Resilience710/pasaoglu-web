import { cn } from '@/lib/cn'

export function StatsGrid({ block }: { block: any }) {
  const items = block.items || []
  const variant = block.variant || 'dark'
  const isDark = variant !== 'light'

  return (
    <section data-dark={isDark ? 'true' : undefined} className={cn('py-14 md:py-16', isDark ? 'bg-brand-deep text-white' : 'bg-brand-cream text-brand-navy')}>
      <div className="container-x">
        <div className={cn(
          'grid gap-x-6 gap-y-10 text-center',
          items.length === 5 ? 'grid-cols-2 md:grid-cols-5' :
          items.length === 4 ? 'grid-cols-2 md:grid-cols-4' :
          items.length === 3 ? 'grid-cols-1 md:grid-cols-3' :
          'grid-cols-2 md:grid-cols-4',
        )}>
          {items.map((it: any, i: number) => (
            <div key={i} className="px-2">
              <div className={cn('font-sans font-bold text-3xl md:text-5xl tracking-tight', isDark ? 'text-white' : 'text-themed-accent')}>
                {it.value}
              </div>
              <div className={cn('mt-2 text-[11px] md:text-xs font-medium uppercase tracking-[0.22em]', isDark ? 'text-white/70' : 'text-brand-muted')}>
                {it.label}
              </div>
              {it.description && (
                <p className={cn('mt-2 text-xs', isDark ? 'text-white/55' : 'text-brand-muted')}>{it.description}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
