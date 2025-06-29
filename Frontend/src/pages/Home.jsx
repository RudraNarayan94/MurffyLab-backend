import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import Footer from '../components/Footer';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--color-background)',
        color: 'var(--color-text)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
      }}
    >
      <Navbar />
      <main
        style={{
          width: '100%',
          maxWidth: '900px',
          margin: '0 auto',
          paddingTop: '110px',
          paddingBottom: '90px',
          fontFamily: 'Poppins, sans-serif',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          flex: 1,
        }}
      >
        <HeroSection />
        <div
          className="d-flex justify-content-center mb-4"
          style={{ marginTop: '12px' }}
        >
          <Button
            variant="primary"
            style={{
              background: 'linear-gradient(135deg, #7c3aed 70%, #a78bfa 100%)',
              borderColor: '#7c3aed',
              color: 'var(--color-surface)',
              minWidth: 200,
              fontWeight: 700,
              fontSize: '1.25rem',
              padding: '14px 36px',
              borderRadius: '32px',
              boxShadow: '0 8px 25px rgba(124,58,237,0.3)',
              transition: 'all 0.3s ease',
              letterSpacing: '0.5px',
            }}
            size="lg"
            onClick={() => navigate('/analyze')}
          >
            Try Out
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
