import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'
import { mediaUrl, mediaAlt } from '@/lib/cn'
import { RichText } from '@/components/RichText'

export function SplitTextImage({ block }: { block: any }) {
  const imageRight = block.mediaSide !== 'left'
  const imgSrc = mediaUrl(block.image)

  return (
    <section className="py-16 md:py-24 bg-white split-text-image">
      <div className="container-x grid items-center gap-10 lg:gap-16 md:grid-cols-12">
        {/* TEXT */}
        <div className={`md:col-span-5 ${imageRight ? 'md:order-1' : 'md:order-2 md:col-start-8'}`}>
          {block.eyebrow && (
            <div className="flex items-center gap-3 mb-4">
              <span className="h-[2px] w-7 bg-themed-accent" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-themed-accent">
                {block.eyebrow}
              </span>
            </div>
          )}
          <h2 className="font-sans text-3xl md:text-4xl lg:text-[2.6rem] text-brand-navy font-semibold leading-[1.15] tracking-tight">
            {block.title}
          </h2>

          {block.body && (
            <div className="mt-6 text-brand-muted leading-relaxed text-[15px] md:text-base">
              <RichText content={block.body} />
            </div>
          )}

          {block.features?.length ? (
            <div className="mt-8 space-y-4">
              {block.features.map((f: any, i: number) => (
                <div
                  key={i}
                  className="flex gap-4 items-start pb-4 border-b border-brand-line last:border-0 last:pb-0"
                >
                  <span className="shrink-0 mt-0.5 inline-flex h-7 w-7 items-center justify-center bg-themed-accent text-white text-[11px] font-bold rounded-sm">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h4 className="font-semibold text-brand-navy text-base">{f.title}</h4>
                    {f.description && (
                      <p className="mt-1 text-sm text-brand-muted leading-relaxed">{f.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : null}

          {block.button?.label && block.button?.href && (
            <Link
              href={block.button.href}
              className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-brand-navy hover:text-themed-accent transition group"
            >
              <span className="border-b border-brand-navy group-hover:border-themed-accent pb-0.5">
                {block.button.label}
              </span>
              <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          )}
        </div>

        {/* IMAGE */}
        {imgSrc && (
          <div className={`md:col-span-7 ${imageRight ? 'md:order-2' : 'md:order-1 md:col-start-1 md:row-start-1'}`}>
            <figure className="relative">
              {/* Soft offset accent panel behind */}
              <div
                className={`absolute -inset-3 md:-inset-5 rounded-2xl -z-0 ${imageRight ? 'md:translate-x-3' : 'md:-translate-x-3'}`}
                style={{ background: 'rgb(var(--accent-soft, 219 234 254))' }}
              />
              <div className="relative aspect-[5/4] md:aspect-[6/5] overflow-hidden rounded-2xl">
                <Image
                  src={imgSrc}
                  alt={mediaAlt(block.image)}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 60vw, 100vw"
                />
                {block.imageCaption && (
                  <figcaption className="absolute bottom-4 left-4 md:bottom-5 md:left-5 max-w-[80%] bg-white/95 backdrop-blur px-4 py-2.5 rounded-lg text-xs md:text-sm font-medium text-brand-navy shadow-sm">
                    {block.imageCaption}
                  </figcaption>
                )}
              </div>
            </figure>
          </div>
        )}
      </div>
    </section>
  )
}
