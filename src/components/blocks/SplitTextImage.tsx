import Link from 'next/link'
import Image from 'next/image'
import { mediaUrl, mediaAlt } from '@/lib/cn'
import { RichText } from '@/components/RichText'

export function SplitTextImage({ block }: { block: any }) {
  const imageRight = block.mediaSide !== 'left'
  const imgSrc = mediaUrl(block.image)

  return (
    <section className="py-20 md:py-32">
      <div className="container-x grid gap-12 lg:gap-20 md:grid-cols-2 items-center">
        <div className={imageRight ? 'md:order-1' : 'md:order-2'}>
          {block.eyebrow && (
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px w-10 bg-brand-gold" />
              <span className="text-xs font-medium uppercase tracking-[0.22em] text-brand-gold">{block.eyebrow}</span>
            </div>
          )}
          <h2 className="font-sans text-3xl md:text-5xl text-brand-navy font-light leading-[1.15]">{block.title}</h2>
          {block.body && (
            <div className="mt-7 body-lead">
              <RichText content={block.body} />
            </div>
          )}
          {block.features?.length ? (
            <div className="mt-9 grid sm:grid-cols-2 gap-x-8 gap-y-6">
              {block.features.map((f: any, i: number) => (
                <div key={i}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-mono text-brand-gold">{String(i + 1).padStart(2, '0')}</span>
                    <h4 className="font-medium text-brand-navy">{f.title}</h4>
                  </div>
                  {f.description && <p className="text-sm text-brand-muted leading-relaxed pl-7">{f.description}</p>}
                </div>
              ))}
            </div>
          ) : null}
          {block.button?.label && block.button?.href && (
            <Link href={block.button.href} className="btn btn-primary mt-9">{block.button.label}</Link>
          )}
        </div>
        {imgSrc && (
          <div className={imageRight ? 'md:order-2' : 'md:order-1'}>
            <div className="relative">
              <div className="absolute -top-4 -left-4 h-24 w-24 border-l-2 border-t-2 border-brand-gold hidden md:block" />
              <div className="absolute -bottom-4 -right-4 h-24 w-24 border-r-2 border-b-2 border-brand-gold hidden md:block" />
              <div className="relative aspect-[4/5] overflow-hidden rounded-sm">
                <Image src={imgSrc} alt={mediaAlt(block.image)} fill className="object-cover" />
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
