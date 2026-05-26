import { MapPin, Phone, Mail } from 'lucide-react'

export function ContactBlock({ block }: { block: any }) {
  const offices = block.offices || []
  return (
    <section className="py-20">
      <div className="container-x">
        {block.title && <h2 className="section-title mb-10">{block.title}</h2>}
        <div className="grid gap-8 md:grid-cols-2">
          {offices.map((o: any, i: number) => (
            <div key={i} className="bg-white border border-brand-line rounded-2xl overflow-hidden card-shadow">
              <div className="p-6 space-y-3">
                <h3 className="font-serif text-2xl text-brand-navy">{o.name}</h3>
                <p className="flex items-start gap-2 text-brand-muted text-sm">
                  <MapPin className="shrink-0 text-themed-accent mt-0.5" size={16} />
                  <span className="whitespace-pre-line">{o.address}</span>
                </p>
                {o.phone && (
                  <p className="flex items-center gap-2 text-brand-muted text-sm">
                    <Phone className="text-themed-accent" size={16} />
                    <a href={`tel:${o.phone}`} className="hover:text-brand-navy">{o.phone}</a>
                  </p>
                )}
                {o.email && (
                  <p className="flex items-center gap-2 text-brand-muted text-sm">
                    <Mail className="text-themed-accent" size={16} />
                    <a href={`mailto:${o.email}`} className="hover:text-brand-navy">{o.email}</a>
                  </p>
                )}
              </div>
              {o.mapEmbed && (
                <div className="aspect-[16/10]">
                  <iframe
                    src={o.mapEmbed}
                    className="h-full w-full border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    allowFullScreen
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
