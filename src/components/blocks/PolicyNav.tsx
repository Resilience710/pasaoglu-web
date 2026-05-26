import Link from 'next/link'

export function PolicyNav({ block }: { block: any }) {
  const links = block.links || []
  return (
    <section className="py-10 border-b border-brand-line">
      <div className="container-x flex flex-wrap gap-3 justify-center">
        {links.map((l: any) => (
          <Link
            key={l.href}
            href={l.href}
            className="btn btn-outline"
          >
            {l.label}
          </Link>
        ))}
      </div>
    </section>
  )
}
