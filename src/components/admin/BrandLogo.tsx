export default function BrandLogo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 0' }}>
      <div style={{
        width: 36, height: 36,
        background: 'linear-gradient(135deg, #0E2A47, #3B82F6)',
        borderRadius: 8,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontWeight: 800,
        fontSize: 16,
        letterSpacing: '-0.02em',
      }}>P</div>
      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
        <strong style={{ fontSize: 15, color: 'var(--theme-elevation-1000)' }}>Paşaoğlu Group</strong>
        <span style={{ fontSize: 11, color: 'var(--theme-elevation-500)', letterSpacing: '0.05em' }}>İçerik Yönetimi</span>
      </div>
    </div>
  )
}
