import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { useTheme } from '../ThemeContext';
import { useNavigate } from 'react-router-dom';

export default function AppNavbar() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  return (
    <div style={{
      position: 'fixed',
      top: '24px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '85vw',
      maxWidth: '1500px',
      zIndex: 1000,
      borderRadius: '18px',
      boxShadow: '0 6px 32px rgba(124,58,237,0.13)',
      background: 'var(--color-surface)',
      border: '1px solid var(--color-border)',
      overflow: 'hidden',
    }}>
      <Navbar className="shadow" style={{ backgroundColor: 'transparent', fontFamily: 'Poppins, sans-serif', minHeight: '72px', padding: '0 32px', border: 'none' }}>
        <Container fluid>
          <Navbar.Brand href="/" className="fw-bold" style={{ color: 'var(--color-primary)', fontFamily: 'Poppins, sans-serif', letterSpacing: '1.5px', fontSize: '2.2rem', transition: 'color 0.3s', marginRight: '32px' }}>MurffyLab</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="/" style={{ color: 'var(--color-text)', fontFamily: 'Poppins, sans-serif', transition: 'color 0.3s' }}>Home</Nav.Link>
            <Nav.Link href="/about" style={{ color: 'var(--color-text)', fontFamily: 'Poppins, sans-serif', transition: 'color 0.3s' }}>About Us</Nav.Link>
          </Nav>
          <Button variant="outline-primary" onClick={() => navigate('/analyze')} style={{ background: 'linear-gradient(135deg, #7c3aed 70%, #a78bfa 100%)', borderColor: '#7c3aed', color: 'var(--color-surface)', fontWeight: 600, borderRadius: '7px', padding: '10px 28px', transition: 'all 0.3s ease', boxShadow: '0 4px 15px rgba(124,58,237,0.18)', fontSize: '1.08rem', marginLeft: '16px', letterSpacing: '0.5px' }}>Try Now</Button>
          <Button
            variant="link"
            onClick={toggleTheme}
            className="ms-3"
            style={{ color: 'var(--color-text)', fontSize: '1.5rem', marginLeft: '12px' }}
          >
            {theme === 'light' ? <i className="bi bi-moon-fill"></i> : <i className="bi bi-sun-fill"></i>}
          </Button>
        </Container>
      </Navbar>
    </div>
  );
}