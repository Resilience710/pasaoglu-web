import Link from 'next/link'
import { cn } from '@/lib/cn'

export function CTABand({ block }: { block: any }) {
  const isDark = (block.variant || 'dark') === 'dark'

  return (
    <section data-dark={isDark ? 'true' : undefined} className={cn('py-20', isDark ? 'bg-brand-deep text-white' : 'bg-brand-cream text-brand-navy')}>
      <div className="container-x text-center max-w-3xl mx-auto">
        {block.eyebrow && (
          <span className={cn('text-xs uppercase tracking-[0.3em]', isDark ? 'text-themed-accent' : 'text-themed-accent')}>
            {block.eyebrow}
          </span>
        )}
        <h2 className={cn('mt-4 font-sans text-3xl md:text-5xl font-light leading-tight', isDark ? 'text-white' : 'text-brand-navy')}>
          {block.title}
        </h2>
        {block.description && (
          <p className={cn('mt-5 leading-relaxed', isDark ? 'text-white/75' : 'text-brand-muted')}>
            {block.description}
          </p>
        )}
        {block.buttons?.length ? (
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {block.buttons.map((b: any, i: number) => (
              <Link
                key={i}
                href={b.href}
                className={b.variant === 'ghost'
                  ? (isDark ? 'btn btn-ghost' : 'btn btn-outline')
                  : 'btn btn-gold'}
              >
                {b.label}
              </Link>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  )
}
