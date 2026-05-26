import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'

const cardStyle: React.CSSProperties = {
  display: 'block',
  padding: '20px 22px',
  background: 'var(--theme-elevation-50)',
  border: '1px solid var(--theme-elevation-150)',
  borderRadius: 10,
  textDecoration: 'none',
  color: 'inherit',
  transition: 'all .15s',
}

export default async function AdminDashboard() {
  const payload = await getPayload({ config })
  const [pages, sectors] = await Promise.all([
    payload.find({ collection: 'pages', limit: 50, sort: 'title' }).catch(() => ({ docs: [] })),
    payload.find({ collection: 'sectors', limit: 10, sort: 'name' }).catch(() => ({ docs: [] })),
  ])

  return (
    <div style={{ padding: '32px 24px', maxWidth: 1200, margin: '0 auto' }}>
      <header style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 600, margin: 0 }}>Hoş geldiniz 👋</h1>
        <p style={{ color: 'var(--theme-elevation-500)', marginTop: 8 }}>
          Sitenizin tüm sayfalarını ve içeriklerini buradan yönetebilirsiniz. Hızlı erişim için aşağıdaki kartları kullanın.
        </p>
      </header>

      <section style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: 16, textTransform: 'uppercase', letterSpacing: '.12em', color: 'var(--theme-elevation-500)', marginBottom: 14 }}>
          📄 Sayfalar — Tıklayın & Düzenleyin
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 }}>
          {(pages.docs as any[]).map((p) => (
            <Link key={p.id} href={`/admin/collections/pages/${p.id}`} style={cardStyle}>
              <div style={{ fontSize: 11, color: 'var(--theme-success-500, #16A34A)', fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase' }}>
                /{p.slug === 'home' ? '' : p.slug}
              </div>
              <div style={{ fontSize: 18, fontWeight: 600, marginTop: 6 }}>{p.title}</div>
              <div style={{ fontSize: 12, color: 'var(--theme-elevation-500)', marginTop: 8 }}>
                {(p.layout || []).length} bölüm · Son güncelleme {new Date(p.updatedAt).toLocaleDateString('tr-TR')}
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: 16, textTransform: 'uppercase', letterSpacing: '.12em', color: 'var(--theme-elevation-500)', marginBottom: 14 }}>
          🏭 Sektör Sayfaları
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
          {(sectors.docs as any[]).map((s) => (
            <Link key={s.id} href={`/admin/collections/sectors/${s.id}`} style={cardStyle}>
              <div style={{ fontSize: 11, color: 'var(--theme-success-500, #16A34A)', fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase' }}>
                /sektorler/{s.slug}
              </div>
              <div style={{ fontSize: 18, fontWeight: 600, marginTop: 6 }}>{s.name}</div>
              <div style={{ fontSize: 12, color: 'var(--theme-elevation-500)', marginTop: 8 }}>
                Tema: {s.theme === 'chem' ? 'Mor (Kimya)' : s.theme === 'build' ? 'Gri (Yapı)' : 'Yeşil (Gıda)'}
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 style={{ fontSize: 16, textTransform: 'uppercase', letterSpacing: '.12em', color: 'var(--theme-elevation-500)', marginBottom: 14 }}>
          ⚙️ Site Geneli Ayarlar
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 }}>
          <Link href="/admin/globals/siteSettings" style={cardStyle}>
            <div style={{ fontSize: 18, fontWeight: 600 }}>Site Ayarları</div>
            <div style={{ fontSize: 13, color: 'var(--theme-elevation-500)', marginTop: 8 }}>
              Logo, telefon, e-posta, footer, sosyal medya
            </div>
          </Link>
          <Link href="/admin/globals/mainNav" style={cardStyle}>
            <div style={{ fontSize: 18, fontWeight: 600 }}>Üst Menü</div>
            <div style={{ fontSize: 13, color: 'var(--theme-elevation-500)', marginTop: 8 }}>
              Header navigasyon ve alt menüleri
            </div>
          </Link>
          <Link href="/admin/collections/media" style={cardStyle}>
            <div style={{ fontSize: 18, fontWeight: 600 }}>Medya Kütüphanesi</div>
            <div style={{ fontSize: 13, color: 'var(--theme-elevation-500)', marginTop: 8 }}>
              Tüm görseller, videolar, PDF’ler
            </div>
          </Link>
          <Link href="/admin/collections/documents" style={cardStyle}>
            <div style={{ fontSize: 18, fontWeight: 600 }}>Belgeler & Sertifikalar</div>
            <div style={{ fontSize: 13, color: 'var(--theme-elevation-500)', marginTop: 8 }}>
              ISO, MSDS, TDS dosyaları
            </div>
          </Link>
        </div>
      </section>
    </div>
  )
}
