export default function Footer() {
  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '85vw',
      maxWidth: '1500px',
      zIndex: 1000,
      borderRadius: '18px',
      boxShadow: '0 -6px 32px rgba(124,58,237,0.13)',
      background: 'linear-gradient(135deg, #7c3aed 70%, #a78bfa 100%)',
      color: 'var(--color-surface)',
      fontFamily: 'Poppins, sans-serif',
      fontSize: '0.9rem',
      animation: 'fadeIn 1.5s',
      border: '1px solid var(--color-border)',
      overflow: 'hidden',
    }}>
      <footer className="text-center py-3 mt-auto" style={{ background: 'transparent', margin: 0 }}>
        <p style={{ margin: 0 }}>&copy; 2025 MurffyLab</p>
      </footer>
    </div>
  );
}

/* Add this to index.css or a global CSS file:
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
*/
  