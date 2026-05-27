export default function LoginBeforeLogin() {
  return (
    <div style={{
      marginBottom: 24,
      padding: '16px 20px',
      background: 'linear-gradient(135deg, rgba(14,42,71,0.05), rgba(59,130,246,0.08))',
      borderRadius: 12,
      borderLeft: '3px solid #3B82F6',
    }}>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', color: '#3B82F6', textTransform: 'uppercase' }}>
        Paşaoğlu Group
      </div>
      <h2 style={{ margin: '8px 0 4px', fontSize: 22, fontWeight: 700, color: '#0E2A47' }}>
        İçerik Yönetim Paneli
      </h2>
      <p style={{ margin: 0, fontSize: 13, color: '#64748B', lineHeight: 1.5 }}>
        Sitenin tüm içeriklerini buradan yönetebilirsiniz.
      </p>
    </div>
  )
}
