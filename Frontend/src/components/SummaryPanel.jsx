import { useState, useEffect, useRef } from "react";
import { Card, Badge, ListGroup } from "react-bootstrap";

export default function SummaryPanel({
  fullSummary = "",
  keyTerms = [],
  criticalObservations = [],
  precautions = "",
  chatId = "",
  translatedTexts = null,
}) {
  const [displayedSummary, setDisplayedSummary] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const [showDetails, setShowDetails] = useState(false);

  const scrollRef = useRef(null);

  // Get the appropriate text based on translations
  const getSummaryText = () => {
    if (translatedTexts) {
      const summaryTranslation = translatedTexts.find(
        (t) => t.key === "summary"
      );
      return summaryTranslation ? summaryTranslation.translation : fullSummary;
    }
    return fullSummary;
  };

  const getObservationsText = () => {
    if (translatedTexts) {
      const obsTranslation = translatedTexts.find(
        (t) => t.key === "critical_observations"
      );
      if (obsTranslation) {
        return obsTranslation.translation.split("\n");
      }
    }
    return criticalObservations;
  };

  const getPrecautionsText = () => {
    if (translatedTexts) {
      const precTranslation = translatedTexts.find(
        (t) => t.key === "precautions"
      );
      return precTranslation ? precTranslation.translation : precautions;
    }
    return precautions;
  };

  // Reset typing animation when summary changes (original or translated)
  useEffect(() => {
    // Clear the displayed summary immediately
    setDisplayedSummary("");
    setShowDetails(false);

    const summaryToDisplay = getSummaryText();

    // Add a small delay before starting the typing animation
    // to ensure the previous text is fully cleared
    const startTypingTimeout = setTimeout(() => {
      let i = 0;
      const typingInterval = setInterval(() => {
        if (i < summaryToDisplay.length) {
          setDisplayedSummary((prev) => prev + summaryToDisplay.charAt(i));
          i++;
        } else {
          clearInterval(typingInterval);
          // Show details after typing animation completes
          setTimeout(() => setShowDetails(true), 500);
        }
      }, 50);

      return () => clearInterval(typingInterval);
    }, 100);

    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);

    return () => {
      clearTimeout(startTypingTimeout);
      clearInterval(cursorInterval);
    };
  }, [fullSummary, translatedTexts]);

  // Auto-scroll to bottom of summary as it types
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [displayedSummary]);

  return (
    <div
      className="p-4 d-flex flex-column align-items-center justify-content-center"
      style={{
        backgroundColor: "var(--color-surface)",
        color: "var(--color-text)",
        minHeight: 340,
        fontFamily: "Poppins, sans-serif",
        borderRadius: "15px",
        boxShadow: "0 10px 30px rgba(var(--color-primary-rgb), 0.08)",
        width: "100%",
      }}>
      <h2
        className="text-center mb-4 fw-bold"
        style={{
          background: "linear-gradient(135deg, #7c3aed 70%, #a78bfa 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          marginBottom: "18px",
          marginTop: 0,
        }}>
        Summary
        {chatId && (
          <Badge
            bg="light"
            text="dark"
            pill
            className="ms-2"
            style={{ fontSize: "0.5em", verticalAlign: "middle" }}>
            ID: {chatId}
          </Badge>
        )}
        {translatedTexts && (
          <Badge
            bg="info"
            text="white"
            pill
            className="ms-2"
            style={{ fontSize: "0.5em", verticalAlign: "middle" }}>
            Translated
          </Badge>
        )}
      </h2>

      <Card
        className="mx-auto mb-4 shadow"
        style={{
          maxWidth: 750,
          minWidth: 500,
          width: "90%",
          backgroundColor: "var(--color-card-background)",
          color: "var(--color-text)",
          border: "none",
          borderRadius: "14px",
          boxShadow: "0 8px 25px rgba(124,58,237,0.10)",
        }}>
        <Card.Body
          style={{
            maxHeight: "220px",
            minHeight: "180px",
            overflowY: "auto",
            whiteSpace: "pre-wrap",
            fontSize: "1.08rem",
            padding: "1.5rem",
          }}
          ref={scrollRef}>
          {displayedSummary}
          <span
            className="typing-cursor"
            style={{ opacity: showCursor ? 1 : 0 }}>
            |
          </span>
        </Card.Body>
      </Card>

      {/* Additional details that appear after typing animation */}
      {showDetails && (
        <div
          className="w-100 animate__animated animate__fadeIn"
          style={{ maxWidth: 750, margin: "0 auto" }}>
          {keyTerms && keyTerms.length > 0 && (
            <Card
              className="mb-3 shadow-sm"
              style={{ borderRadius: "12px", border: "none" }}>
              <Card.Body>
                <Card.Title className="mb-3 fs-6 fw-bold">
                  Key Medical Terms
                </Card.Title>
                <div className="d-flex flex-wrap gap-2">
                  {keyTerms.map((term, index) => (
                    <Badge
                      key={index}
                      bg="light"
                      text="dark"
                      style={{
                        padding: "8px 12px",
                        borderRadius: "20px",
                        backgroundColor: "rgba(124,58,237,0.1)",
                        color: "#7c3aed",
                      }}>
                      {term}
                    </Badge>
                  ))}
                </div>
              </Card.Body>
            </Card>
          )}

          {getObservationsText() && getObservationsText().length > 0 && (
            <Card
              className="mb-3 shadow-sm"
              style={{ borderRadius: "12px", border: "none" }}>
              <Card.Body>
                <Card.Title className="mb-3 fs-6 fw-bold">
                  Critical Observations
                </Card.Title>
                <ListGroup variant="flush">
                  {getObservationsText().map((observation, index) => (
                    <ListGroup.Item
                      key={index}
                      className="px-0 py-2 border-0 d-flex">
                      <i className="bi bi-exclamation-triangle-fill text-warning me-2 flex-shrink-0 mt-1"></i>
                      <span>{observation}</span>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Card.Body>
            </Card>
          )}

          {getPrecautionsText() && (
            <Card
              className="shadow-sm"
              style={{ borderRadius: "12px", border: "none" }}>
              <Card.Body>
                <Card.Title className="mb-3 fs-6 fw-bold">
                  Precautions
                </Card.Title>
                <Card.Text>{getPrecautionsText()}</Card.Text>
              </Card.Body>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
