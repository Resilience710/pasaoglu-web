export default function LoginBeforeLogin() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      marginBottom: 4,
    }}>
      <div style={{
        width: 72,
        height: 72,
        background: 'linear-gradient(135deg, #3B82F6, #2563EB)',
        borderRadius: 18,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontWeight: 800,
        fontSize: 32,
        letterSpacing: '-0.04em',
        boxShadow: '0 12px 28px rgba(59,130,246,0.35)',
        marginBottom: 18,
      }}>
        P
      </div>
      <h1 style={{
        margin: 0,
        fontSize: 26,
        fontWeight: 700,
        color: '#0E2A47',
        letterSpacing: '-0.01em',
      }}>
        Paşaoğlu Admin
      </h1>
      <p style={{
        margin: '6px 0 0',
        fontSize: 14,
        color: '#64748B',
      }}>
        İçerik yönetim paneli
      </p>
    </div>
  )
}
