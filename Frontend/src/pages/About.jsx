import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function About() {
  return (
    <div className="about-page d-flex flex-column align-items-center justify-content-start" style={{ minHeight: '100vh', backgroundColor: 'var(--color-background)', color: 'var(--color-text)', fontFamily: 'Poppins, sans-serif' }}>
      <Navbar />
      <div style={{ minHeight: '100vh', background: 'var(--color-background)', color: 'var(--color-text)', fontFamily: 'Poppins, sans-serif', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingTop: '110px', paddingBottom: '90px' }}>
        <main style={{ width: '100%', maxWidth: '900px', margin: '0 auto', paddingTop: '32px', paddingBottom: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '18px', letterSpacing: '1.2px', color: 'var(--color-primary)' }}>About Us</h1>
          <p style={{ fontWeight: 400, fontSize: '1.15rem', color: 'var(--color-text)', maxWidth: '700px', margin: '0 auto', lineHeight: 1.7 }}>
            MurffyLab is dedicated to providing accessible, AI-powered healthcare summaries and support. Our mission is to empower users with clear, concise, and actionable health information.
          </p>
        </main>
      </div>
      <Footer />
    </div>
  );
}