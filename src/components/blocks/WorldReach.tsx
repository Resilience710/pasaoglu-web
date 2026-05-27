export function WorldReach({ block }: { block: any }) {
  const points = block.highlightPoints || [
    { name: 'Türkiye', xPercent: 56, yPercent: 36 },
    { name: 'Almanya', xPercent: 49, yPercent: 28 },
    { name: 'Birleşik Krallık', xPercent: 46, yPercent: 25 },
    { name: 'BAE', xPercent: 62, yPercent: 42 },
    { name: 'Çin', xPercent: 78, yPercent: 38 },
    { name: 'ABD', xPercent: 22, yPercent: 35 },
    { name: 'Brezilya', xPercent: 32, yPercent: 60 },
    { name: 'Mısır', xPercent: 56, yPercent: 42 },
  ]
  const stats = block.stats || []

  return (
    <section className="relative py-24 md:py-32 bg-brand-deep text-white overflow-hidden">
      {/* dotted bg pattern */}
      <div className="absolute inset-0 opacity-[0.07] pointer-events-none" style={{
        backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
        backgroundSize: '32px 32px',
      }} />

      <div className="relative container-x text-center">
        {block.eyebrow && (
          <span className="text-[11px] font-light uppercase tracking-[0.4em] text-white/60">
            {block.eyebrow}
          </span>
        )}
        <h2 className="font-sans text-3xl md:text-5xl font-light mt-4">{block.title}</h2>
        <div className="mt-6 mx-auto h-px w-16 bg-themed-accent" />
        {block.description && (
          <p className="mt-6 max-w-xl mx-auto text-white/75 leading-relaxed">{block.description}</p>
        )}

        {/* World map */}
        <div className="relative mt-14 mx-auto max-w-4xl aspect-[2/1]">
          <WorldMapSvg />
          {points.map((p: any, i: number) => (
            <div
              key={i}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${p.xPercent}%`, top: `${p.yPercent}%` }}
            >
              <span className="block h-3 w-3 rounded-full bg-themed-accent shadow-[0_0_24px_6px_rgba(59,130,246,0.7)] animate-pulse" />
              {p.name && (
                <span className="absolute left-1/2 top-full mt-2 -translate-x-1/2 text-[10px] uppercase tracking-wider text-white/60 whitespace-nowrap pointer-events-none">
                  {p.name}
                </span>
              )}
            </div>
          ))}
        </div>

        {stats.length > 0 && (
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {stats.map((s: any, i: number) => (
              <div key={i}>
                <div className="font-sans text-2xl md:text-3xl font-semibold text-white">{s.value}</div>
                <div className="mt-1 text-[10px] uppercase tracking-[0.18em] text-white/55">{s.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

function WorldMapSvg() {
  // simplified dot-style world map using SVG
  return (
    <svg
      viewBox="0 0 1000 500"
      className="absolute inset-0 h-full w-full opacity-30"
      fill="currentColor"
      aria-hidden
    >
      {/* Generated grid of dots forming continent silhouettes (simplified) */}
      {Array.from({ length: 50 }).flatMap((_, y) =>
        Array.from({ length: 100 }).map((_, x) => {
          const cx = x * 10 + 5
          const cy = y * 10 + 5
          // rough continent shapes via mathematical regions
          const inNA = (x >= 12 && x <= 32 && y >= 12 && y <= 28) || (x >= 18 && x <= 28 && y >= 28 && y <= 38)
          const inSA = x >= 25 && x <= 38 && y >= 35 && y <= 48
          const inEU = x >= 44 && x <= 56 && y >= 14 && y <= 26
          const inAF = x >= 47 && x <= 60 && y >= 26 && y <= 46
          const inAS = (x >= 56 && x <= 86 && y >= 16 && y <= 32) || (x >= 70 && x <= 84 && y >= 32 && y <= 40)
          const inAU = x >= 78 && x <= 92 && y >= 42 && y <= 48
          if (inNA || inSA || inEU || inAF || inAS || inAU) {
            return <circle key={`${x}-${y}`} cx={cx} cy={cy} r="2" />
          }
          return null
        }),
      )}
    </svg>
  )
}
