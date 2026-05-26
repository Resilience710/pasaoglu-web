import Image from 'next/image'
import { mediaUrl, mediaAlt } from '@/lib/cn'

export function PartnerMarquee({ block }: { block: any }) {
  const logos = block.logos || []
  if (!logos.length) return null
  const loop = [...logos, ...logos]

  return (
    <section className="py-14 border-y border-brand-line bg-white">
      <div className="container-x">
        {block.title && (
          <h3 className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-brand-muted mb-8">
            {block.title}
          </h3>
        )}
      </div>
      <div className="scroll-fade overflow-hidden">
        <div className="flex w-max animate-marquee gap-14 items-center">
          {loop.map((l: any, i: number) => {
            const src = mediaUrl(l.logo)
            if (!src) return null
            return (
              <div key={i} className="relative h-12 w-32 grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition">
                <Image src={src} alt={mediaAlt(l.logo, l.name || 'Partner')} fill className="object-contain" />
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
