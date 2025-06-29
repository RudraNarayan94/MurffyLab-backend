export default function HeroSection() {
  return (
    <div
      className="container py-5 hero-section-bg"
      style={{
        backgroundColor: 'var(--color-surface)',
        color: 'var(--color-text)',
        fontFamily: 'Poppins, sans-serif',
        animation: 'fadeIn 1.2s',
        letterSpacing: '0.5px',
        borderRadius: '20px',
        boxShadow: '0 12px 36px rgba(var(--color-primary-rgb), 0.12)',
        position: 'relative',
        overflow: 'hidden',
        padding: '48px 32px',
        marginTop: '32px',
        marginBottom: '32px',
        maxWidth: '1100px',
      }}
    >
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        background: 'linear-gradient(120deg, rgba(124,58,237,0.12) 0%, rgba(245,158,66,0.04) 100%)',
      }}></div>
      <div className="row align-items-center" style={{ position: 'relative', zIndex: 1 }}>
        <div className="col-md-6 text-center">
          <div style={{
            display: 'inline-block',
            background: 'linear-gradient(135deg, #7c3aed 60%, #a78bfa 100%)',
            borderRadius: '24px',
            padding: '20px',
            boxShadow: '0 8px 32px 0 rgba(124,58,237,0.13)',
            border: '2.5px solid #a78bfa',
            marginBottom: '20px',
            minWidth: '300px',
            minHeight: '300px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <img
              src="/hero.gif"
              alt="Hero GIF"
              className="img-fluid"
              style={{ borderRadius: '8px', maxWidth: '240px', maxHeight: '240px', background: 'linear-gradient(135deg, #ede9fe 60%, #c7d2fe 100%)', border: '1.5px solid #7c3aed', boxShadow: '0 2px 12px rgba(124,58,237,0.10)' }}
            />
          </div>
        </div>
        <div className="col-md-6 text-center text-md-start mt-4 mt-md-0">
          <h1 className="display-4 fw-bold mb-3" style={{ background: 'linear-gradient(135deg, #7c3aed 70%, #a78bfa 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontSize: '2.8rem', letterSpacing: '1px', marginBottom: '1.2rem' }}>
            MurffyLab
          </h1>
          <p className="lead mb-4" style={{ fontWeight: 500, fontSize: '1.35rem', color: 'var(--color-text-secondary)', marginBottom: '1.2rem' }}>Your lab reports. Finally explained.</p>
          <p className="mb-4" style={{ fontSize: '1.08rem', color: 'var(--color-text-secondary)', maxWidth: '480px', margin: '0 auto 1.5rem auto', lineHeight: 1.7 }}>
            No more confusion, no more Googling medical terms.<br/>
            <span style={{ color: '#7c3aed', fontWeight: 600 }}>MurffyLab</span> reads your lab report, breaks it down, speaks it in your language, and helps you actually understand what it means.<br/>
            <span style={{ color: '#a78bfa', fontWeight: 500 }}>Upload once. Get clarity forever.</span>
          </p>
        </div>
      </div>
    </div>   
  );
}
