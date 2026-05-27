import Link from 'next/link'
import Image from 'next/image'
import { ChevronDown } from 'lucide-react'
import { mediaUrl } from '@/lib/cn'

function HeroButton({ b }: { b: any }) {
  const cls =
    b.variant === 'ghost' ? 'btn btn-ghost'
    : b.variant === 'accent' ? 'btn btn-accent'
    : 'btn btn-gold'
  return <Link href={b.href} className={cls}>{b.label}</Link>
}

export function HeroVideo({ block }: { block: any }) {
  const videoSrc = mediaUrl(block.video)
  const posterSrc = mediaUrl(block.poster)
  const variant = block.variant || 'centered'

  const bgMedia = (
    <>
      {videoSrc ? (
        <video
          autoPlay muted loop playsInline
          poster={posterSrc}
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src={videoSrc} />
        </video>
      ) : posterSrc ? (
        <Image src={posterSrc} alt="" fill priority className="object-cover" />
      ) : (
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-navy via-brand-deep to-black" />
          <div className="absolute inset-0 opacity-30" style={{
            backgroundImage: 'radial-gradient(circle at 20% 30%, rgba(59,130,246,0.35), transparent 50%), radial-gradient(circle at 80% 70%, rgba(96,165,250,0.25), transparent 55%)',
          }} />
          <div className="absolute inset-0 opacity-[0.07]" style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }} />
        </div>
      )}
    </>
  )

  // === VARIANT: CENTERED (Veskim style) ===
  if (variant === 'centered') {
    return (
      <section className="relative min-h-[100vh] w-full overflow-hidden bg-brand-deep">
        {bgMedia}
        <div className="absolute inset-0 bg-gradient-to-b from-brand-deep/70 via-brand-deep/60 to-brand-deep/85" />

        <div className="relative z-10 container-x flex min-h-[100vh] flex-col items-center justify-center text-center text-white py-32">
          {block.eyebrow && (
            <span className="text-[11px] font-light uppercase tracking-[0.4em] text-white/70 mb-8">
              {block.eyebrow}
            </span>
          )}
          <h1 className="font-sans text-[2.4rem] sm:text-5xl md:text-6xl lg:text-7xl leading-[1.05] font-light max-w-4xl">
            {block.title}
            {block.titleAccent && (
              <>
                <br />
                <span className="font-bold">{block.titleAccent}</span>
              </>
            )}
          </h1>
          <div className="mt-6 md:mt-8 h-px w-20 md:w-24 bg-white/40" />

          {block.description && (
            <p className="mt-6 md:mt-8 max-w-xl text-sm md:text-base text-white/80 leading-relaxed px-2">{block.description}</p>
          )}

          {block.certifications?.length ? (
            <div className="mt-10 md:mt-14 w-full max-w-5xl">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-5 gap-x-4 gap-y-5 md:gap-x-8 md:gap-y-7 border-t border-white/15 pt-8 md:pt-10">
                {block.certifications.slice(0, 10).map((c: any, i: number) => (
                  <div key={i} className="text-center">
                    <div className="text-xs sm:text-sm md:text-base font-semibold tracking-wider text-white">
                      {c.name}
                    </div>
                    {c.description && (
                      <div className="mt-1 text-[9px] sm:text-[10px] uppercase tracking-[0.18em] text-white/55 leading-tight">
                        {c.description}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {block.buttons?.length ? (
            <div className="mt-10 flex flex-wrap gap-3 justify-center">
              {block.buttons.map((b: any, i: number) => <HeroButton key={i} b={b} />)}
            </div>
          ) : null}
        </div>

        {block.showScrollIndicator && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce text-white/70">
            <ChevronDown size={28} />
          </div>
        )}
      </section>
    )
  }

  // === VARIANT: SIDE PANEL (Ergun Holding style) ===
  if (variant === 'sidePanel') {
    const sp = block.sidePanel || {}
    return (
      <section className="relative min-h-[88vh] w-full overflow-hidden bg-brand-deep">
        {bgMedia}
        <div className="absolute inset-0 bg-gradient-to-r from-brand-deep/20 to-brand-deep/55" />

        <div className="relative z-10 container-x grid min-h-[88vh] grid-cols-1 lg:grid-cols-2 items-center gap-10 py-20">
          <div className="text-white max-w-xl">
            {block.eyebrow && (
              <span className="text-[11px] font-light uppercase tracking-[0.35em] text-white/80 mb-5 block">
                {block.eyebrow}
              </span>
            )}
            <h1 className="font-sans text-4xl md:text-5xl leading-tight font-light">
              {block.title}
              {block.titleAccent && (
                <> <span className="font-bold text-themed-accent">{block.titleAccent}</span></>
              )}
            </h1>
            {block.description && (
              <p className="mt-6 text-white/85 leading-relaxed text-lg">{block.description}</p>
            )}
            {block.buttons?.length ? (
              <div className="mt-8 flex flex-wrap gap-3">
                {block.buttons.map((b: any, i: number) => <HeroButton key={i} b={b} />)}
              </div>
            ) : null}
          </div>

          <div className="lg:justify-self-end w-full max-w-md">
            <div className="bg-white/95 backdrop-blur rounded-2xl p-8 card-shadow">
              {sp.panelTitle && (
                <h3 className="font-serif text-2xl text-brand-navy mb-3">{sp.panelTitle}</h3>
              )}
              {sp.panelText && <p className="text-brand-muted leading-relaxed">{sp.panelText}</p>}
              {sp.panelCtaLabel && sp.panelCtaHref && (
                <Link href={sp.panelCtaHref} className="btn btn-primary mt-6">{sp.panelCtaLabel}</Link>
              )}
              {!sp.panelTitle && !sp.panelText && !sp.panelCtaLabel && (
                <p className="text-brand-muted text-sm">Bu paneli admin panelinden düzenleyebilirsiniz.</p>
              )}
            </div>
          </div>
        </div>
      </section>
    )
  }

  // === VARIANT: FULL IMAGE (Gıda) — minimal, ferah ===
  if (variant === 'fullImage') {
    return (
      <section className="relative min-h-[80vh] w-full overflow-hidden bg-white">
        {bgMedia}
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent" />

        <div className="relative z-10 container-x flex min-h-[80vh] flex-col justify-end pb-24">
          <div className="max-w-2xl">
            {block.eyebrow && (
              <span className="text-[11px] font-light uppercase tracking-[0.35em] text-brand-navy/70 mb-4 block">
                {block.eyebrow}
              </span>
            )}
            <h1 className="font-sans text-4xl md:text-6xl leading-[1.05] text-brand-navy font-light">
              {block.title}
              {block.titleAccent && (
                <> <span className="font-bold" style={{ color: 'rgb(var(--accent))' }}>{block.titleAccent}</span></>
              )}
            </h1>
            {block.description && (
              <p className="mt-6 text-brand-muted leading-relaxed max-w-xl text-lg">{block.description}</p>
            )}
            {block.buttons?.length ? (
              <div className="mt-8 flex flex-wrap gap-3">
                {block.buttons.map((b: any, i: number) => <HeroButton key={i} b={b} />)}
              </div>
            ) : null}
          </div>
        </div>
      </section>
    )
  }

  // === VARIANT: LEFT ALIGNED (classic / Yapı) ===
  return (
    <section className="relative h-[88vh] min-h-[560px] w-full overflow-hidden bg-brand-deep">
      {bgMedia}
      <div className="absolute inset-0 bg-gradient-to-r from-brand-deep/85 via-brand-deep/55 to-brand-deep/20" />

      <div className="relative z-10 container-x flex h-full items-center">
        <div className="max-w-2xl text-white">
          {block.eyebrow && (
            <span className="inline-block text-xs font-semibold uppercase tracking-[0.18em] text-themed-accent mb-4">
              {block.eyebrow}
            </span>
          )}
          <h1 className="font-serif text-4xl md:text-6xl leading-tight mb-5">
            {block.title}
            {block.titleAccent && <> <span className="text-themed-accent">{block.titleAccent}</span></>}
          </h1>
          {block.description && (
            <p className="text-base md:text-lg text-white/85 leading-relaxed max-w-xl">{block.description}</p>
          )}
          {block.buttons?.length ? (
            <div className="mt-8 flex flex-wrap gap-3">
              {block.buttons.map((b: any, i: number) => <HeroButton key={i} b={b} />)}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}
