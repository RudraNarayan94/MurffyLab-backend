import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import SummaryPanel from "../components/SummaryPanel";
import { Container, Row, Col, Alert } from "react-bootstrap";
import Footer from "../components/Footer";
import CallWindow from "../components/CallWindow";
import { useNavigate } from "react-router-dom";

export default function Result() {
  const [reportData, setReportData] = useState(null);
  const [error, setError] = useState(null);
  const [translatedTexts, setTranslatedTexts] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get the report data from localStorage
    try {
      const data = localStorage.getItem("reportData");
      if (data) {
        setReportData(JSON.parse(data));
      } else {
        setError("No report data found. Please upload a lab report first.");
      }
    } catch (err) {
      setError("Error loading report data: " + err.message);
    }
  }, []);

  // Redirect to home if no data and user tries to view this page directly
  useEffect(() => {
    if (error && !reportData) {
      const timer = setTimeout(() => {
        navigate("/");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, reportData, navigate]);

  // Handle translations from CallWindow
  const handleTranslation = (translations) => {
    setTranslatedTexts(translations);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--color-background)",
        color: "var(--color-text)",
        display: "flex",
        flexDirection: "column",
        fontFamily: "Poppins, sans-serif",
        alignItems: "stretch",
        justifyContent: "flex-start",
      }}>
      <Navbar />
      <div
        style={{
          minHeight: "100vh",
          background: "var(--color-background)",
          color: "var(--color-text)",
          fontFamily: "Poppins, sans-serif",
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          justifyContent: "center",
          paddingTop: "110px",
          paddingBottom: "90px",
        }}>
        <Container
          fluid
          style={{
            width: "100%",
            margin: 0,
            paddingTop: "32px",
            paddingBottom: "32px",
            paddingLeft: "32px",
            paddingRight: "32px",
            display: "flex",
            flexDirection: "row",
            alignItems: "stretch",
            justifyContent: "stretch",
          }}>
          {error ? (
            <Alert variant="danger" className="w-100">
              {error}
              <div className="mt-2">Redirecting to home page...</div>
            </Alert>
          ) : !reportData ? (
            <div className="d-flex justify-content-center align-items-center w-100">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <Row
              className="w-100 flex-nowrap gx-5 gy-4"
              style={{ minHeight: 420, width: "100%" }}>
              <Col
                xs={12}
                md={7}
                className="d-flex align-items-stretch justify-content-center mb-4 mb-md-0"
                style={{ paddingRight: "0", paddingLeft: "12px", minWidth: 0 }}>
                <SummaryPanel
                  fullSummary={reportData.summary}
                  keyTerms={reportData.key_medical_terms}
                  criticalObservations={reportData.critical_observations}
                  precautions={reportData.precautions}
                  chatId={reportData.chat_id}
                  translatedTexts={translatedTexts}
                />
              </Col>
              <Col
                xs={12}
                md={5}
                className="d-flex align-items-stretch justify-content-center mb-4 mb-md-0"
                style={{ paddingLeft: "0", paddingRight: "12px", minWidth: 0 }}>
                <CallWindow
                  summary={reportData.summary}
                  criticalObservations={reportData.critical_observations}
                  precautions={reportData.precautions}
                  onTranslate={handleTranslation}
                />
              </Col>
            </Row>
          )}
        </Container>
      </div>
      <Footer />
    </div>
  );
}
