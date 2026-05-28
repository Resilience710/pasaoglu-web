export default function BrandLogo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '4px 0' }}>
      <div style={{
        width: 36, height: 36,
        background: 'linear-gradient(135deg, #c4a45a, #d4b36d)',
        borderRadius: 9,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#1c1c1a',
        fontWeight: 800,
        fontSize: 17,
        fontFamily: 'Georgia, "Times New Roman", serif',
        letterSpacing: '-0.04em',
        boxShadow: '0 4px 12px rgba(196,164,90,0.35)',
      }}>P</div>
      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15 }}>
        <strong style={{
          fontSize: 15,
          color: '#ffffff',
          letterSpacing: '-0.01em',
          fontFamily: 'Georgia, "Times New Roman", serif',
        }}>
          Paşaoğlu Group
        </strong>
        <span style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.55)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          Yönetim Paneli
        </span>
      </div>
    </div>
  )
}
