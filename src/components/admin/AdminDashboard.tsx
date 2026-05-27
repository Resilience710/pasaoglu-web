import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'
import {
  ArrowRight,
  Factory,
  FileStack,
  FileText,
  Globe,
  ImageIcon,
  LayoutTemplate,
  Mail,
  Newspaper,
  PanelsTopLeft,
  Settings2,
} from 'lucide-react'

export default async function AdminDashboard() {
  const payload = await getPayload({ config })
  const safe = async <T,>(p: Promise<T>): Promise<T | { docs: any[]; totalDocs: number }> => {
    try { return await p } catch { return { docs: [], totalDocs: 0 } as any }
  }
  const [pages, sectors, news, contactMsgs, careerApps] = await Promise.all([
    safe(payload.find({ collection: 'pages', limit: 50, sort: 'title' })),
    safe(payload.find({ collection: 'sectors', limit: 10, sort: 'name' })),
    safe(payload.find({ collection: 'newsArticles', limit: 5, sort: '-date' })),
    safe(payload.find({ collection: 'contactSubmissions', limit: 1 })),
    safe(payload.find({ collection: 'careerApplications', limit: 1 })),
  ])

  const kpis = [
    {
      label: 'Sayfalar',
      value: (pages as any).totalDocs ?? (pages as any).docs.length,
      href: '/admin/collections/pages',
      Icon: FileText,
    },
    {
      label: 'Sektörler',
      value: (sectors as any).totalDocs ?? (sectors as any).docs.length,
      href: '/admin/collections/sectors',
      Icon: Factory,
    },
    {
      label: 'Haberler',
      value: (news as any).totalDocs ?? (news as any).docs.length,
      href: '/admin/collections/newsArticles',
      Icon: Newspaper,
    },
    {
      label: 'Formlar',
      value: ((contactMsgs as any).totalDocs ?? 0) + ((careerApps as any).totalDocs ?? 0),
      href: '/admin/collections/contactSubmissions',
      Icon: Mail,
    },
  ]

  const quickLinks = [
    {
      title: 'Site Ayarları',
      desc: 'Logo, footer, iletişim, SEO ve analytics ayarlarını yönetin.',
      href: '/admin/globals/siteSettings',
      Icon: Settings2,
    },
    {
      title: 'Üst Menü',
      desc: 'Header navigasyonu ve alt menü akışını güncelleyin.',
      href: '/admin/globals/mainNav',
      Icon: PanelsTopLeft,
    },
    {
      title: 'Medya Kütüphanesi',
      desc: 'Görsel, video ve PDF dosyalarını tek merkezden düzenleyin.',
      href: '/admin/collections/media',
      Icon: ImageIcon,
    },
    {
      title: 'Belgeler',
      desc: 'Sertifikalar, politika dosyaları ve indirilebilir dokümanlar.',
      href: '/admin/collections/documents',
      Icon: FileStack,
    },
  ]

  return (
    <div className="admin-dashboard">
      <section className="admin-dashboard__hero">
        <div className="admin-dashboard__hero-copy">
          <p className="admin-dashboard__eyebrow">Paşaoğlu Group Yönetim Alanı</p>
          <h1>Kurumsal içerik akışını daha temiz bir panelden yönetin.</h1>
          <p className="admin-dashboard__hero-text">
            Sayfalar, sektörler, haberler ve site geneli ayarlar tek bir akış içinde.
            Düzenleme öncelikleri üstte, ikincil ayarlar daha aşağıda kalacak şekilde
            düzenlendi.
          </p>

          <div className="admin-dashboard__hero-actions">
            <Link className="admin-dashboard__button is-primary" href="/admin/collections/newsArticles/create">
              Yeni Haber
              <ArrowRight size={16} />
            </Link>
            <Link className="admin-dashboard__button" href="/admin/collections/pages">
              Sayfaları Düzenle
            </Link>
            <Link className="admin-dashboard__button" href="/admin/globals/siteSettings">
              Site Ayarları
            </Link>
          </div>
        </div>

        <div className="admin-dashboard__hero-panel">
          <div className="admin-dashboard__hero-panel-card">
            <span className="admin-dashboard__hero-panel-label">Öne çıkan iş</span>
            <strong>İçerik düzenleme</strong>
            <p>Sayfa içerikleri ve haber akışı şimdi daha doğrudan erişilebilir.</p>
          </div>
          <div className="admin-dashboard__hero-panel-card">
            <span className="admin-dashboard__hero-panel-label">Panel mantığı</span>
            <strong>Önce içerik, sonra SEO</strong>
            <p>Form sekmeleri ana iş akışını öne çıkaracak şekilde yeniden sıralandı.</p>
          </div>
        </div>
      </section>

      <section className="admin-dashboard__stats">
        {kpis.map(({ href, label, value, Icon }) => (
          <Link className="admin-dashboard__stat-card" href={href} key={label}>
            <div className="admin-dashboard__stat-icon">
              <Icon size={18} />
            </div>
            <div className="admin-dashboard__stat-value">{value}</div>
            <div className="admin-dashboard__stat-label">{label}</div>
          </Link>
        ))}
      </section>

      <div className="admin-dashboard__grid">
        <section className="admin-dashboard__panel">
          <div className="admin-dashboard__panel-head">
            <div>
              <p className="admin-dashboard__section-label">Sayfalar</p>
              <h2>Hızlı düzenleme</h2>
            </div>
            <Link className="admin-dashboard__text-link" href="/admin/collections/pages">
              Tümünü aç
            </Link>
          </div>

          <div className="admin-dashboard__list">
          {((pages as any).docs as any[]).map((p) => (
            <Link className="admin-dashboard__list-card" href={`/admin/collections/pages/${p.id}`} key={p.id}>
              <span className="admin-dashboard__list-path">/{p.slug === 'home' ? '' : p.slug}</span>
              <strong>{p.title}</strong>
              <span>{(p.layout || []).length} bölüm · {new Date(p.updatedAt).toLocaleDateString('tr-TR')}</span>
            </Link>
          ))}
          </div>
        </section>

        <section className="admin-dashboard__panel">
          <div className="admin-dashboard__panel-head">
            <div>
              <p className="admin-dashboard__section-label">Sektörler</p>
              <h2>Temalı içerik alanları</h2>
            </div>
            <Link className="admin-dashboard__text-link" href="/admin/collections/sectors">
              Sektörleri aç
            </Link>
          </div>

          <div className="admin-dashboard__list admin-dashboard__list--compact">
            {((sectors as any).docs as any[]).map((s) => (
              <Link className="admin-dashboard__list-card" href={`/admin/collections/sectors/${s.id}`} key={s.id}>
                <span className="admin-dashboard__list-path">/sektorler/{s.slug}</span>
                <strong>{s.name}</strong>
                <span>Tema: {s.theme === 'chem' ? 'Kimya' : s.theme === 'build' ? 'Yapı' : 'Gıda'}</span>
              </Link>
            ))}
          </div>
        </section>
      </div>

      <div className="admin-dashboard__grid admin-dashboard__grid--secondary">
        <section className="admin-dashboard__panel">
          <div className="admin-dashboard__panel-head">
            <div>
              <p className="admin-dashboard__section-label">Yayın akışı</p>
              <h2>Son haberler</h2>
            </div>
            <Link className="admin-dashboard__text-link" href="/admin/collections/newsArticles">
              Haberleri aç
            </Link>
          </div>

          <div className="admin-dashboard__news-list">
            {((news as any).docs as any[]).map((item) => (
              <Link className="admin-dashboard__news-card" href={`/admin/collections/newsArticles/${item.id}`} key={item.id}>
                <div>
                  <strong>{item.title}</strong>
                  <span>{new Date(item.date).toLocaleDateString('tr-TR')}</span>
                </div>
                <ArrowRight size={16} />
              </Link>
            ))}
          </div>
        </section>

        <section className="admin-dashboard__panel">
          <div className="admin-dashboard__panel-head">
            <div>
              <p className="admin-dashboard__section-label">Kısayollar</p>
              <h2>Site geneli yönetim</h2>
            </div>
          </div>

          <div className="admin-dashboard__quick-grid">
            {quickLinks.map(({ href, title, desc, Icon }) => (
              <Link className="admin-dashboard__quick-card" href={href} key={href}>
                <div className="admin-dashboard__quick-icon">
                  <Icon size={18} />
                </div>
                <div>
                  <strong>{title}</strong>
                  <p>{desc}</p>
                </div>
              </Link>
            ))}
          </div>

          <div className="admin-dashboard__focus-card">
            <div className="admin-dashboard__focus-copy">
              <span className="admin-dashboard__section-label">Yeni düzen mantığı</span>
              <strong>Özelleştirme üstte, SEO altta</strong>
              <p>
                Site ayarları ve içerik formları sekmelendi. Kullanıcı önce içerik ve görünür
                alanları düzenliyor, SEO ve teknik alanlar daha sonra geliyor.
              </p>
            </div>
            <Globe size={18} />
          </div>
        </section>
      </div>
    </div>
  )
}
