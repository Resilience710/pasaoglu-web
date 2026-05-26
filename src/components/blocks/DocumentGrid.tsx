import Image from 'next/image'
import { FileDown } from 'lucide-react'
import { mediaUrl, mediaAlt } from '@/lib/cn'

export function DocumentGrid({ block }: { block: any }) {
  const docs = block.documents || []
  return (
    <section className="py-20 bg-brand-cream">
      <div className="container-x">
        {(block.title || block.description) && (
          <div className="max-w-2xl mb-10">
            {block.title && <h2 className="section-title">{block.title}</h2>}
            {block.description && <p className="body-lead mt-3">{block.description}</p>}
          </div>
        )}
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {docs.map((d: any) => {
            const cover = mediaUrl(d.cover)
            const fileUrl = mediaUrl(d.file)
            return (
              <a
                key={d.id}
                href={fileUrl || '#'}
                target="_blank"
                rel="noopener"
                className="group bg-white border border-brand-line rounded-xl p-5 flex gap-4 items-start hover:card-shadow transition"
              >
                <div className="relative h-16 w-16 shrink-0 bg-brand-cream rounded-lg overflow-hidden">
                  {cover ? (
                    <Image src={cover} alt={mediaAlt(d.cover, d.title)} fill className="object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-themed-accent">
                      <FileDown />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  {d.category && <span className="text-xs font-semibold uppercase tracking-wider text-themed-accent">{d.category}</span>}
                  <h4 className="font-serif text-lg text-brand-navy mt-1 leading-snug">{d.title}</h4>
                  {d.description && <p className="text-xs text-brand-muted mt-1 line-clamp-2">{d.description}</p>}
                </div>
              </a>
            )
          })}
        </div>
      </div>
    </section>
  )
}
