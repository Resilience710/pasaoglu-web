'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { Menu, X, ChevronDown } from 'lucide-react'
import { cn, mediaUrl } from '@/lib/cn'

type NavItem = { label: string; href: string; children?: { label: string; href: string }[] }

export function Header({
  nav,
  settings,
}: {
  nav: { items?: NavItem[] }
  settings: any
}) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const logoSrc = mediaUrl(settings?.logo)

  return (
    <>
      <div className="hidden md:block bg-brand-deep text-white/80 text-xs">
        <div className="container-x flex items-center justify-between py-2">
          <span>{settings?.tagline || 'Üç sektör, tek güç — Paşaoğlu Group'}</span>
          <div className="flex items-center gap-5">
            {settings?.phone && <a href={`tel:${settings.phone}`} className="hover:text-themed-accent">{settings.phone}</a>}
            {settings?.email && <a href={`mailto:${settings.email}`} className="hover:text-themed-accent">{settings.email}</a>}
          </div>
        </div>
      </div>

      <header
        className={cn(
          'sticky top-0 z-40 transition-all',
          scrolled ? 'bg-white/95 backdrop-blur shadow-sm' : 'bg-white',
        )}
      >
        <div className="container-x flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-3">
            {logoSrc ? (
              <Image src={logoSrc} alt="Paşaoğlu Group" width={160} height={40} className="h-9 w-auto" />
            ) : (
              <span className="font-serif text-2xl text-brand-navy">Paşaoğlu<span className="text-themed-accent">.</span></span>
            )}
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            {(nav?.items || []).map((item) => (
              <div key={item.href} className="group relative">
                <Link
                  href={item.href}
                  className="flex items-center gap-1 text-sm font-medium text-brand-navy hover:text-themed-accent transition"
                >
                  {item.label}
                  {item.children?.length ? <ChevronDown size={14} /> : null}
                </Link>
                {item.children?.length ? (
                  <div className="absolute left-0 top-full pt-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition">
                    <div className="bg-white rounded-lg card-shadow min-w-[220px] py-2">
                      {item.children.map((c) => (
                        <Link
                          key={c.href}
                          href={c.href}
                          className="block px-5 py-2 text-sm text-brand-navy hover:bg-brand-cream hover:text-themed-accent transition"
                        >
                          {c.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <Link href="/iletisim" className="btn btn-primary">İletişim</Link>
          </div>

          <button
            onClick={() => setOpen(true)}
            className="lg:hidden p-2 text-brand-navy"
            aria-label="Menüyü aç"
          >
            <Menu />
          </button>
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-brand-deep/80" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-[88%] max-w-sm bg-white p-6 overflow-y-auto">
            <div className="flex justify-end mb-6">
              <button onClick={() => setOpen(false)} aria-label="Menüyü kapat"><X /></button>
            </div>
            <nav className="flex flex-col gap-1">
              {(nav?.items || []).map((item) => (
                <div key={item.href} className="py-2 border-b border-brand-line">
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="text-lg font-medium text-brand-navy"
                  >
                    {item.label}
                  </Link>
                  {item.children?.length ? (
                    <div className="mt-2 ml-3 flex flex-col gap-2">
                      {item.children.map((c) => (
                        <Link
                          key={c.href}
                          href={c.href}
                          onClick={() => setOpen(false)}
                          className="text-sm text-brand-muted"
                        >
                          {c.label}
                        </Link>
                      ))}
                    </div>
                  ) : null}
                </div>
              ))}
            </nav>
            <Link
              href="/iletisim"
              onClick={() => setOpen(false)}
              className="btn btn-primary mt-6 w-full"
            >
              İletişim
            </Link>
          </div>
        </div>
      )}
    </>
  )
}
