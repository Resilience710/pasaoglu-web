import Image from 'next/image'
import { mediaUrl } from '@/lib/cn'

export function QuoteBand({ block }: { block: any }) {
  const bg = mediaUrl(block.background)
  return (
    <section className="relative py-24 bg-brand-deep text-white overflow-hidden">
      {bg && (
        <>
          <Image src={bg} alt="" fill className="object-cover opacity-25" />
          <div className="absolute inset-0 bg-brand-deep/70" />
        </>
      )}
      <div className="relative container-x max-w-3xl text-center">
        <span className="text-brand-gold text-5xl font-serif leading-none block mb-4">"</span>
        <p className="font-serif text-2xl md:text-3xl leading-snug">{block.quote}</p>
        {block.author && <p className="mt-6 text-sm uppercase tracking-wider text-white/70">— {block.author}</p>}
      </div>
    </section>
  )
}
