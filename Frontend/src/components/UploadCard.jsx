import { useState } from "react";
import { Card, Button, Spinner, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Document, Page, pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();
export default function UploadCard() {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [numPages, setNumPages] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      setFileUrl(URL.createObjectURL(droppedFile));
    }
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;

    setLoading(true);
    setShowModal(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("http://localhost:8000/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      const data = await response.json();

      // Store the response data in localStorage to access it in the result page
      localStorage.setItem("reportData", JSON.stringify(data));

      setLoading(false);
      setShowModal(false);
      navigate("/result");
    } catch (err) {
      setError(err.message);
      setLoading(false);
      // Keep modal open to show error
    }
  };

  return (
    <div
      className="p-4"
      style={{
        backgroundColor: "var(--color-card-background)",
        color: "var(--color-text)",
        minHeight: 420,
        height: 520,
        fontFamily: "Poppins, sans-serif",
        animation: "fadeIn 1s",
        borderRadius: "15px",
        boxShadow: "0 10px 30px rgba(var(--color-primary-rgb), 0.08)",
        width: "100%",
        maxWidth: 900,
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 32,
      }}>
      {/* Upload Card on the left */}
      <div
        style={{
          flex: "1 1 0",
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "stretch",
          height: 420,
          gap: 32,
          width: "100%",
        }}>
        {/* Upload Area */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}>
          <h2
            className="text-center fw-bold"
            style={{
              fontFamily: "Poppins, sans-serif",
              letterSpacing: "0.5px",
              fontWeight: 700,
              background: "linear-gradient(135deg, #7c3aed 70%, #a78bfa 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textShadow: "0 2px 8px rgba(124,58,237,0.08)",
              marginBottom: 18,
              marginTop: 0,
            }}>
            Upload Your Health Report
          </h2>
          <Card
            className={`mx-auto mb-4 shadow text-center ${
              isDragging ? "border-primary pulse-border" : ""
            }`}
            style={{
              width: "100%",
              maxWidth: 350,
              minHeight: 320,
              height: 320,
              background: "linear-gradient(135deg, #f8fafc 80%, #ede9fe 100%)",
              color: "var(--color-text)",
              border: isDragging
                ? "2.5px dashed #7c3aed"
                : "2.5px dashed var(--color-border)",
              cursor: "pointer",
              fontFamily: "Poppins, sans-serif",
              transition: "border 0.3s, box-shadow 0.3s",
              animation: "fadeIn 1.2s",
              borderRadius: "16px",
              boxShadow: isDragging
                ? "0 8px 32px rgba(124,58,237,0.18)"
                : "0 4px 15px rgba(var(--color-primary-rgb), 0.1)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              overflow: "hidden",
              position: "relative",
            }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => document.getElementById("fileInput").click()}>
            <Card.Body
              className="py-5"
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                padding: 0,
              }}>
              <input
                type="file"
                id="fileInput"
                className="d-none"
                onChange={handleFileSelect}
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              />
              <div className="mb-3">
                <i
                  className="bi bi-cloud-upload"
                  style={{
                    fontSize: "2.5rem",
                    background:
                      "linear-gradient(135deg, #7c3aed 70%, #a78bfa 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    filter: isDragging
                      ? "drop-shadow(0 0 8px #a78bfa)"
                      : "none",
                    transition: "filter 0.3s",
                  }}></i>
              </div>
              <p
                className="mb-0"
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 500,
                  color: isDragging ? "#7c3aed" : "var(--color-text)",
                  fontSize: "1.08rem",
                  transition: "color 0.3s",
                }}>
                {file
                  ? `Selected: ${file.name}`
                  : isDragging
                  ? "Drop your file here!"
                  : "Drag & drop or click to upload your health report"}
              </p>
              {!file && (
                <small
                  style={{
                    color: "#a78bfa",
                    fontSize: "0.97rem",
                    marginTop: 8,
                  }}>
                  PDF, Word, or Image files accepted
                </small>
              )}
            </Card.Body>
          </Card>
          <div className="d-flex justify-content-center gap-3">
            <Button
              variant="primary"
              onClick={handleAnalyze}
              disabled={!file || loading}
              style={{
                background: file
                  ? "linear-gradient(135deg, #7c3aed 70%, #a78bfa 100%)"
                  : "linear-gradient(135deg, #e0e7ff 70%, #ede9fe 100%)",
                borderColor: file ? "#7c3aed" : "#ede9fe",
                color: file ? "var(--color-surface)" : "#a78bfa",
                minWidth: 120,
                boxShadow: file ? "0 8px 25px rgba(124,58,237,0.22)" : "none",
                fontFamily: "Poppins, sans-serif",
                fontWeight: 600,
                letterSpacing: "0.5px",
                fontSize: "1.1rem",
                transition: "background 0.3s, color 0.3s, box-shadow 0.3s",
                animation: "fadeIn 1.5s",
                opacity: file ? 1 : 0.7,
                cursor: file ? "pointer" : "not-allowed",
              }}>
              {loading ? (
                <Spinner
                  animation="border"
                  size="sm"
                  style={{ marginRight: 8, color: "#fff" }}
                />
              ) : (
                "Analyze"
              )}
            </Button>
          </div>
        </div>
        {/* Preview Area visually matching Upload Area */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}>
          <h4
            className="text-center"
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 600,
              color: "#7c3aed",
              letterSpacing: "0.5px",
              marginBottom: 18,
              marginTop: 0,
            }}>
            Preview
          </h4>
          <Card
            className="mx-auto mb-4 shadow text-center"
            style={{
              width: "100%",
              maxWidth: 350,
              minHeight: 320,
              height: 320,
              background: "linear-gradient(135deg, #f8fafc 80%, #ede9fe 100%)",
              color: "var(--color-text)",
              border: file
                ? "2.5px solid #a78bfa"
                : "2.5px dashed var(--color-border)",
              borderRadius: "16px",
              boxShadow: file
                ? "0 8px 32px rgba(124,58,237,0.10)"
                : "0 4px 15px rgba(var(--color-primary-rgb), 0.1)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              overflow: "hidden",
              position: "relative",
              transition: "border 0.3s, box-shadow 0.3s",
            }}>
            <Card.Body
              className="py-5"
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                padding: 0,
              }}>
              {file && fileUrl ? (
                file.type.startsWith("image/") ? (
                  <img
                    src={fileUrl}
                    alt="Preview"
                    style={{
                      maxWidth: "100%",
                      maxHeight: "100%",
                      objectFit: "contain",
                      display: "block",
                      borderRadius: 12,
                      boxShadow: "0 2px 8px #a78bfa22",
                    }}
                  />
                ) : file.type === "application/pdf" ? (
                  <Document
                    file={fileUrl}
                    onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                    loading={<span>Loading PDF...</span>}>
                    <Page
                      pageNumber={1}
                      width={300}
                      height={300}
                      renderTextLayer={false}
                      renderAnnotationLayer={false}
                    />
                  </Document>
                ) : (
                  <span style={{ color: "#aaa" }}>No preview available</span>
                )
              ) : (
                <span style={{ color: "#aaa" }}>No file selected</span>
              )}
            </Card.Body>
          </Card>
        </div>
      </div>
      <Modal
        show={showModal}
        centered
        backdrop="static"
        keyboard={false}
        dialogClassName="custom-modal">
        <Modal.Body
          className="text-center"
          style={{
            backgroundColor: "var(--color-card-background)",
            color: "var(--color-text)",
            borderRadius: "8px",
            padding: "30px",
            boxShadow: "0 10px 30px rgba(var(--color-primary-rgb), 0.08)",
          }}>
          <Spinner
            animation="border"
            style={{
              color: "var(--color-primary)",
              width: "3rem",
              height: "3rem",
            }}
          />
          <p
            className="mt-3 mb-0"
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: "1.2rem",
              fontWeight: 500,
            }}>
            Analyzing your file, please wait...
          </p>
        </Modal.Body>
      </Modal>
    </div>
  );
}
