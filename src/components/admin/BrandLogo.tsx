export default function BrandLogo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '4px 0' }}>
      <div style={{
        width: 36, height: 36,
        background: 'linear-gradient(135deg, #3B82F6, #2563EB)',
        borderRadius: 9,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#ffffff',
        fontWeight: 800,
        fontSize: 17,
        letterSpacing: '-0.04em',
        boxShadow: '0 4px 12px rgba(59,130,246,0.35)',
      }}>P</div>
      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15 }}>
        <strong style={{ fontSize: 15, color: '#ffffff', letterSpacing: '-0.01em' }}>
          Paşaoğlu Group
        </strong>
        <span style={{ fontSize: 10.5, color: 'rgba(203,213,225,0.7)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          Yönetim Paneli
        </span>
      </div>
    </div>
  )
}
