import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'

const NAVY = '#0E2A47'
const BLUE = '#3B82F6'
const SOFT = '#DBEAFE'

const cardStyle: React.CSSProperties = {
  display: 'block',
  padding: '18px 20px',
  background: '#ffffff',
  border: '1px solid #E2E8F0',
  borderRadius: 12,
  textDecoration: 'none',
  color: 'inherit',
  transition: 'all .15s ease',
  boxShadow: '0 1px 2px rgba(15,42,71,0.03)',
}

const sectionTitleStyle: React.CSSProperties = {
  fontSize: 12,
  textTransform: 'uppercase',
  letterSpacing: '0.16em',
  color: '#64748B',
  fontWeight: 700,
  marginBottom: 14,
}

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

  const KPIs = [
    { label: 'Sayfa', value: (pages as any).totalDocs ?? (pages as any).docs.length, href: '/admin/collections/pages', icon: '📄' },
    { label: 'Sektör', value: (sectors as any).totalDocs ?? (sectors as any).docs.length, href: '/admin/collections/sectors', icon: '🏭' },
    { label: 'Haber', value: (news as any).totalDocs ?? (news as any).docs.length, href: '/admin/collections/newsArticles', icon: '📰' },
    { label: 'Form Mesajı', value: ((contactMsgs as any).totalDocs ?? 0) + ((careerApps as any).totalDocs ?? 0), href: '/admin/collections/contactSubmissions', icon: '✉️' },
  ]

  return (
    <div style={{ padding: '28px 32px', maxWidth: 1280, margin: '0 auto' }}>
      {/* HERO welcome band */}
      <div style={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 16,
        padding: '32px 36px',
        background: `linear-gradient(135deg, ${NAVY} 0%, #1B4F8C 100%)`,
        color: 'white',
        marginBottom: 28,
        boxShadow: '0 12px 36px rgba(14,42,71,0.18)',
      }}>
        {/* dotted bg */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.08, pointerEvents: 'none',
          backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }} />
        <div style={{ position: 'relative' }}>
          <div style={{ fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', opacity: 0.7, fontWeight: 600 }}>
            Paşaoğlu Group · Admin
          </div>
          <h1 style={{ margin: '8px 0 6px', fontSize: 30, fontWeight: 700, letterSpacing: '-0.02em' }}>
            Hoş geldiniz 👋
          </h1>
          <p style={{ margin: 0, fontSize: 14, opacity: 0.8, maxWidth: 580 }}>
            Sitenizin tüm sayfalarını, sektörlerini, haberlerini ve ayarlarını buradan yönetebilirsiniz. Hızlı erişim için aşağıdaki kartları kullanın.
          </p>

          <div style={{ marginTop: 22, display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            <Link href="/admin/collections/newsArticles/create" style={quickActionBtn(true)}>+ Yeni Haber</Link>
            <Link href="/admin/collections/pages" style={quickActionBtn(false)}>Sayfaları Düzenle</Link>
            <Link href="/admin/globals/siteSettings" style={quickActionBtn(false)}>Site Ayarları</Link>
          </div>
        </div>
      </div>

      {/* KPI ROW */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginBottom: 32 }}>
        {KPIs.map((k) => (
          <Link key={k.label} href={k.href} style={{
            ...cardStyle,
            padding: '20px 22px',
            display: 'flex',
            alignItems: 'center',
            gap: 14,
          }}>
            <div style={{
              width: 44, height: 44,
              background: SOFT, borderRadius: 10,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 22,
            }}>{k.icon}</div>
            <div>
              <div style={{ fontSize: 24, fontWeight: 800, color: NAVY, letterSpacing: '-0.02em' }}>{k.value}</div>
              <div style={{ fontSize: 12, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>{k.label}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* PAGES */}
      <section style={{ marginBottom: 32 }}>
        <h2 style={sectionTitleStyle}>📄 Sayfalar — Tıklayın & Düzenleyin</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 }}>
          {((pages as any).docs as any[]).map((p) => (
            <Link key={p.id} href={`/admin/collections/pages/${p.id}`} style={cardStyle}>
              <div style={{ fontSize: 10.5, color: BLUE, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                /{p.slug === 'home' ? '' : p.slug}
              </div>
              <div style={{ fontSize: 16, fontWeight: 700, color: NAVY, marginTop: 6 }}>{p.title}</div>
              <div style={{ fontSize: 12, color: '#64748B', marginTop: 8 }}>
                {(p.layout || []).length} bölüm · {new Date(p.updatedAt).toLocaleDateString('tr-TR')}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* SECTORS */}
      <section style={{ marginBottom: 32 }}>
        <h2 style={sectionTitleStyle}>🏭 Sektör Sayfaları</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
          {((sectors as any).docs as any[]).map((s) => {
            const themeColor = s.theme === 'chem' ? '#7C3AED' : s.theme === 'build' ? '#525252' : '#16A34A'
            const themeName = s.theme === 'chem' ? 'Mor (Kimya)' : s.theme === 'build' ? 'Gri (Yapı)' : 'Yeşil (Gıda)'
            return (
              <Link key={s.id} href={`/admin/collections/sectors/${s.id}`} style={{ ...cardStyle, borderLeft: `3px solid ${themeColor}` }}>
                <div style={{ fontSize: 10.5, color: BLUE, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  /sektorler/{s.slug}
                </div>
                <div style={{ fontSize: 16, fontWeight: 700, color: NAVY, marginTop: 6 }}>{s.name}</div>
                <div style={{ fontSize: 12, color: '#64748B', marginTop: 8 }}>Tema: {themeName}</div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* QUICK SETTINGS */}
      <section>
        <h2 style={sectionTitleStyle}>⚙️ Site Geneli Ayarlar</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12 }}>
          <Link href="/admin/globals/siteSettings" style={cardStyle}>
            <div style={{ fontSize: 15, fontWeight: 700, color: NAVY }}>Site Ayarları</div>
            <div style={{ fontSize: 12.5, color: '#64748B', marginTop: 6 }}>Logo, footer, iletişim, SEO, analytics</div>
          </Link>
          <Link href="/admin/globals/mainNav" style={cardStyle}>
            <div style={{ fontSize: 15, fontWeight: 700, color: NAVY }}>Üst Menü</div>
            <div style={{ fontSize: 12.5, color: '#64748B', marginTop: 6 }}>Header navigasyon + alt menüleri</div>
          </Link>
          <Link href="/admin/collections/media" style={cardStyle}>
            <div style={{ fontSize: 15, fontWeight: 700, color: NAVY }}>Medya Kütüphanesi</div>
            <div style={{ fontSize: 12.5, color: '#64748B', marginTop: 6 }}>Görseller, videolar, PDF dosyaları</div>
          </Link>
          <Link href="/admin/collections/documents" style={cardStyle}>
            <div style={{ fontSize: 15, fontWeight: 700, color: NAVY }}>Belgeler & Sertifikalar</div>
            <div style={{ fontSize: 12.5, color: '#64748B', marginTop: 6 }}>ISO, kalite politika dosyaları</div>
          </Link>
        </div>
      </section>
    </div>
  )
}

function quickActionBtn(primary: boolean): React.CSSProperties {
  return {
    padding: '10px 18px',
    background: primary ? 'white' : 'rgba(255,255,255,0.12)',
    color: primary ? NAVY : 'white',
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 600,
    textDecoration: 'none',
    border: primary ? 'none' : '1px solid rgba(255,255,255,0.2)',
    transition: 'all .15s',
  }
}
