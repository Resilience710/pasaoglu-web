import Link from 'next/link'
import Image from 'next/image'
import { mediaUrl, mediaAlt } from '@/lib/cn'
import { RichText } from '@/components/RichText'

export function SplitTextImage({ block }: { block: any }) {
  const imageRight = block.mediaSide !== 'left'
  const imgSrc = mediaUrl(block.image)

  return (
    <section className="py-20 md:py-28">
      <div className="container-x grid gap-12 md:grid-cols-2 items-center">
        <div className={imageRight ? 'md:order-1' : 'md:order-2'}>
          {block.eyebrow && <span className="eyebrow mb-3">{block.eyebrow}</span>}
          <h2 className="section-title mt-2 mb-5">{block.title}</h2>
          {block.body && <div className="body-lead"><RichText content={block.body} /></div>}
          {block.features?.length ? (
            <div className="mt-7 grid sm:grid-cols-2 gap-5">
              {block.features.map((f: any, i: number) => (
                <div key={i} className="border-l-2 border-brand-gold pl-4">
                  <h4 className="font-semibold text-brand-navy mb-1">{f.title}</h4>
                  {f.description && <p className="text-sm text-brand-muted">{f.description}</p>}
                </div>
              ))}
            </div>
          ) : null}
          {block.button?.label && block.button?.href && (
            <Link href={block.button.href} className="btn btn-primary mt-8">{block.button.label}</Link>
          )}
        </div>
        {imgSrc && (
          <div className={imageRight ? 'md:order-2' : 'md:order-1'}>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl card-shadow">
              <Image src={imgSrc} alt={mediaAlt(block.image)} fill className="object-cover" />
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
