import Link from 'next/link'
import Image from 'next/image'

export function Footer({ settings }: { settings: any }) {
  // Footer koyu arkaplan — beyaz marka logosu (repo'ya gömülü statik dosya)
  const logoSrc = '/brand/logo-footer.png'
  const year = new Date().getFullYear()

  return (
    <footer className="bg-brand-deep text-white/80">
      <div className="container-x py-16 grid gap-10 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div>
          <Image src={logoSrc} alt="Paşaoğlu Group" width={260} height={100} className="h-12 w-auto" />
          <p className="mt-5 text-sm leading-relaxed">
            {settings?.footer?.description || 'Paşaoğlu Group; kimya, yapı ve gıda sektörlerinde kurumsal çözümler sunan bir holding yapılanmasıdır.'}
          </p>
        </div>

        {(settings?.footer?.columns || []).map((col: any, i: number) => (
          <div key={i}>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">{col.title}</h4>
            <ul className="space-y-2 text-sm">
              {(col.links || []).map((l: any) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-themed-accent transition">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10">
        <div className="container-x py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
          <span>{settings?.footer?.copyright || `© ${year} Paşaoğlu Group. Tüm hakları saklıdır.`}</span>
          <div className="flex items-center gap-4">
            {(settings?.social || []).map((s: any) => (
              <a key={s.url} href={s.url} target="_blank" rel="noopener" className="hover:text-themed-accent capitalize">
                {s.platform}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
