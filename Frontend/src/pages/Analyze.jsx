import Navbar from '../components/Navbar';
import UploadCard from '../components/UploadCard';
import Footer from '../components/Footer';
import { Container, Row, Col } from 'react-bootstrap';

export default function Analyze() {
  return (
    <div className="analyze-container d-flex flex-column align-items-center justify-content-start" style={{ minHeight: '100vh', backgroundColor: 'var(--color-background)', color: 'var(--color-text)', fontFamily: 'Poppins, sans-serif' }}>
      <Navbar />
      <div style={{ minHeight: '100vh', background: 'var(--color-background)', color: 'var(--color-text)', fontFamily: 'Poppins, sans-serif', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingTop: '110px', paddingBottom: '90px', width: '100vw' }}>
        <Container fluid style={{ width: '100%', maxWidth: '1200px', margin: '0 auto', paddingTop: '32px', paddingBottom: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Row className="w-100 justify-content-center align-items-center" style={{ minHeight: 400 }}>
            <Col xs={12} className="d-flex align-items-center justify-content-center" style={{ width: '100%' }}>
              <UploadCard />
            </Col>
          </Row>
        </Container>
      </div>
      <Footer />
    </div>
  );
}
