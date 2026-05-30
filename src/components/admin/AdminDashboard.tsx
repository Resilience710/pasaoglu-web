import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'
import {
  ArrowRight,
  CheckCircle2,
  Factory,
  FileText,
  ImageIcon,
  LayoutTemplate,
  Mail,
  Package,
  PanelsTopLeft,
  Boxes,
  Settings2,
  AlertTriangle,
} from 'lucide-react'

export default async function AdminDashboard() {
  const payload = await getPayload({ config })
  const safe = async <T,>(p: Promise<T>): Promise<T | { docs: any[]; totalDocs: number }> => {
    try { return await p } catch { return { docs: [], totalDocs: 0 } as any }
  }

  const [pages, sectors, categories, contactMsgs, careerApps, settings] = await Promise.all([
    safe(payload.find({ collection: 'pages', limit: 100, sort: 'title' })),
    safe(payload.find({ collection: 'sectors', limit: 10, sort: 'name' })),
    safe(payload.find({ collection: 'productCategories', limit: 50, sort: 'sortOrder' })),
    safe(payload.find({ collection: 'contactSubmissions', limit: 1 })),
    safe(payload.find({ collection: 'careerApplications', limit: 1 })),
    safe(payload.findGlobal ? payload.findGlobal({ slug: 'siteSettings' }) : Promise.resolve(null as any)),
  ])

  const catDocs: any[] = (categories as any).docs || []
  const totalProducts = catDocs.reduce((sum, c) => {
    const inGroups = (c.subGroups || []).reduce((s: number, g: any) => s + ((g.products || []).length), 0)
    return sum + inGroups
  }, 0)

  const kpis = [
    { label: 'Sayfa', value: (pages as any).totalDocs ?? (pages as any).docs.length, href: '/admin/collections/pages', Icon: FileText },
    { label: 'Sektör', value: (sectors as any).totalDocs ?? (sectors as any).docs.length, href: '/admin/collections/sectors', Icon: Factory },
    { label: 'Ürün Kategorisi', value: (categories as any).totalDocs ?? catDocs.length, href: '/admin/collections/productCategories', Icon: Boxes },
    { label: 'Toplam Ürün', value: totalProducts, href: '/admin/collections/productCategories', Icon: Package },
    { label: 'Form Gönderisi', value: ((contactMsgs as any).totalDocs ?? 0) + ((careerApps as any).totalDocs ?? 0), href: '/admin/collections/contactSubmissions', Icon: Mail },
  ]

  const quickLinks = [
    { title: 'Ana Sayfayı Düzenle', desc: 'Hero, sektör kartları ve tüm ana sayfa bölümleri.', href: '/admin/duzenle/ana-sayfa', Icon: LayoutTemplate },
    { title: 'Ürün Kategorileri', desc: 'Kategoriler, alt gruplar ve ürün listeleri.', href: '/admin/collections/productCategories', Icon: Boxes },
    { title: 'Site Ayarları', desc: 'Logo, footer, iletişim ve SEO ayarları.', href: '/admin/globals/siteSettings', Icon: Settings2 },
    { title: 'Üst Menü', desc: 'Header navigasyonu ve alt menüler.', href: '/admin/globals/mainNav', Icon: PanelsTopLeft },
    { title: 'Medya Kütüphanesi', desc: 'Görsel, video ve PDF dosyaları.', href: '/admin/collections/media', Icon: ImageIcon },
    { title: 'Sayfalar', desc: 'Hakkımızda, iletişim, politikalar ve diğer sayfalar.', href: '/admin/collections/pages', Icon: FileText },
  ]

  /* ---- İçerik sağlığı kontrolleri ---- */
  const health: { text: string; href: string; cta: string }[] = []
  const home = ((pages as any).docs as any[]).find((p) => p.slug === 'home')
  if (home) {
    const hero = (home.layout || []).find((b: any) => b.blockType === 'heroVideo')
    if (hero && !hero.video && !hero.poster) {
      health.push({ text: 'Ana sayfa hero bölümünde video/görsel eksik.', href: '/admin/duzenle/ana-sayfa', cta: 'Düzenle' })
    }
  }
  const st: any = settings
  const phone = st?.phone || st?.contact?.phone || ''
  if (!phone || /0{3,}/.test(String(phone))) {
    health.push({ text: 'Site ayarlarındaki telefon numarası eksik veya placeholder.', href: '/admin/globals/siteSettings', cta: 'Ayarları aç' })
  }
  if (home && !home?.meta?.description) {
    health.push({ text: 'Ana sayfada SEO açıklaması (meta description) boş.', href: `/admin/collections/pages/${home.id}`, cta: 'Düzenle' })
  }
  const noImgCat = catDocs.filter((c) => !c.image).slice(0, 1)
  if (noImgCat.length) {
    health.push({ text: `"${noImgCat[0].name}" kategorisinde kapak görseli yok.`, href: `/admin/collections/productCategories/${noImgCat[0].id}`, cta: 'Düzenle' })
  }

  return (
    <div className="dash2">
      {/* Hero */}
      <section className="dash2__hero">
        <div className="dash2__hero-inner">
          <p className="dash2__eyebrow">Paşaoğlu Group · Yönetim Paneli</p>
          <h1>Hoş geldiniz 👋</h1>
          <p>Sitenizin içeriğini buradan yönetin. Ana sayfayı tek ekrandan düzenleyebilir, ürün ve sayfalarınızı güncelleyebilirsiniz.</p>
          <div className="dash2__hero-actions">
            <Link className="dash2__hero-btn dash2__hero-btn--primary" href="/admin/duzenle/ana-sayfa">
              <LayoutTemplate size={16} /> Ana Sayfayı Düzenle
            </Link>
            <Link className="dash2__hero-btn dash2__hero-btn--ghost" href="/" target="_blank">
              Siteyi Görüntüle <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* KPI */}
      <section className="dash2__kpis">
        {kpis.map(({ href, label, value, Icon }) => (
          <Link className="dash2__kpi" href={href} key={label}>
            <div className="dash2__kpi-icon"><Icon size={22} /></div>
            <div>
              <div className="dash2__kpi-val">{value}</div>
              <div className="dash2__kpi-label">{label}</div>
            </div>
          </Link>
        ))}
      </section>

      {/* Hızlı erişim */}
      <p className="dash2__section-label">Hızlı Erişim</p>
      <section className="dash2__quick">
        {quickLinks.map(({ href, title, desc, Icon }) => (
          <Link className="dash2__quick-card" href={href} key={href}>
            <div className="dash2__quick-icon"><Icon size={20} /></div>
            <div>
              <strong>{title}</strong>
              <p>{desc}</p>
            </div>
          </Link>
        ))}
      </section>

      {/* İçerik sağlığı */}
      <p className="dash2__section-label">İçerik Sağlığı</p>
      <section className="dash2__health">
        {health.length === 0 ? (
          <div className="dash2__health-ok">
            <CheckCircle2 size={20} /> Her şey yolunda — eksik içerik bulunamadı.
          </div>
        ) : (
          health.map((h, i) => (
            <div className="dash2__health-item" key={i}>
              <span className="dash2__health-dot" style={{ background: '#F59E0B' }} />
              <AlertTriangle size={16} style={{ color: '#F59E0B', flexShrink: 0, marginTop: 1 }} />
              <span>{h.text}</span>
              <Link href={h.href}>{h.cta} →</Link>
            </div>
          ))
        )}
      </section>
    </div>
  )
}
