import { MapPin, Phone, Mail } from 'lucide-react'
import { cn } from '@/lib/cn'

export function OfficeGrid({ block }: { block: any }) {
  const offices = block.offices || []
  const cols = block.columns || '3'
  const gridCls = cn(
    'grid gap-6',
    cols === '2' && 'md:grid-cols-2',
    cols === '3' && 'md:grid-cols-2 lg:grid-cols-3',
    cols === '4' && 'md:grid-cols-2 lg:grid-cols-4',
  )

  return (
    <section className="py-20 md:py-28">
      <div className="container-x">
        {(block.title || block.description) && (
          <div className="text-center mb-12 max-w-2xl mx-auto">
            {block.title && (
              <h2 className="font-sans text-4xl md:text-5xl text-brand-navy font-light">{block.title}</h2>
            )}
            <div className="mt-6 mx-auto h-px w-16 bg-themed-accent" />
            {block.description && <p className="body-lead mt-6">{block.description}</p>}
          </div>
        )}
        <div className={gridCls}>
          {offices.map((o: any, i: number) => (
            <div
              key={i}
              className="group bg-white rounded-2xl border border-brand-line p-7 hover:card-shadow hover:-translate-y-1 transition-all"
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="h-px w-8 bg-themed-accent" />
                <span className="text-xs uppercase tracking-[0.2em] text-themed-accent">{String(i + 1).padStart(2, '0')}</span>
              </div>
              <h3 className="font-sans text-xl text-brand-navy font-medium mb-4">{o.name}</h3>
              <div className="space-y-3 text-sm text-brand-muted">
                <p className="flex items-start gap-2">
                  <MapPin size={15} className="text-themed-accent mt-0.5 shrink-0" />
                  <span className="whitespace-pre-line leading-relaxed">{o.address}</span>
                </p>
                {o.phone && (
                  <p className="flex items-center gap-2">
                    <Phone size={15} className="text-themed-accent shrink-0" />
                    <a href={`tel:${o.phone}`} className="hover:text-brand-navy">{o.phone}</a>
                  </p>
                )}
                {o.email && (
                  <p className="flex items-center gap-2">
                    <Mail size={15} className="text-themed-accent shrink-0" />
                    <a href={`mailto:${o.email}`} className="hover:text-brand-navy">{o.email}</a>
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
