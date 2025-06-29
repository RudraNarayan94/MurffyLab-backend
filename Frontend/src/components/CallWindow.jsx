import React, { useState } from "react";
import { Button, Form, InputGroup, Spinner, Alert } from "react-bootstrap";

export default function CallWindow({
  summary,
  criticalObservations = [],
  precautions = "",
  onTranslate,
}) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedVoice, setSelectedVoice] = useState("en-US‑ken");
  const [selectedLocale, setSelectedLocale] = useState("en-US");
  const [audioUrl, setAudioUrl] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState(null);
  const [audioElement, setAudioElement] = useState(null);
  const [callStatus, setCallStatus] = useState(null);
  const [translatedTexts, setTranslatedTexts] = useState(null);

  // Separate loading states for each action
  const [isTranslating, setIsTranslating] = useState(false);
  const [isTtsLoading, setIsTtsLoading] = useState(false);
  const [isCallLoading, setIsCallLoading] = useState(false);

  // Define available voices
  const murfVoices = [
    { name: "English – India", locale: "en-IN", voiceId: "en-IN-arav" },
    { name: "English – US", locale: "en-US", voiceId: "en-US-en" },
    { name: "Spanish – Spain", locale: "es-ES", voiceId: "es-ES-ablo" },
    { name: "French – France", locale: "fr-FR", voiceId: "fr-FR-arie" },
    { name: "German – Germany", locale: "de-DE", voiceId: "de-DE-einolf" },
    { name: "Hindi – India", locale: "hi-IN", voiceId: "hi-IN-eerja" },
    { name: "Tamil – India", locale: "ta-IN", voiceId: "ta-IN-njali" },
    { name: "Japanese – Japan", locale: "ja-JP", voiceId: "ja-JP-chiro" },
    { name: "Portuguese – Brazil", locale: "pt-BR", voiceId: "pt-BR-na" },
    { name: "Bengali – India", locale: "bn-IN", voiceId: "bn-IN-rup" },
  ];

  // Prepare texts for API calls
  const prepareTexts = () => {
    return [
      { key: "summary", value: summary },
      {
        key: "critical_observations",
        value: Array.isArray(criticalObservations)
          ? criticalObservations.join("\n")
          : criticalObservations,
      },
      { key: "precautions", value: precautions },
    ];
  };

  // Handle voice selection change
  const handleVoiceChange = (e) => {
    const selectedVoiceId = e.target.value;
    setSelectedVoice(selectedVoiceId);

    // Update locale based on selected voice
    const voice = murfVoices.find((v) => v.voiceId === selectedVoiceId);
    if (voice) {
      setSelectedLocale(voice.locale);
    }

    // Reset audio if language changes
    if (audioUrl) {
      stopAudio();
      setAudioUrl(null);
    }

    // Reset translations
    setTranslatedTexts(null);
  };

  // Handle translation
  const handleTranslate = async () => {
    try {
      setIsTranslating(true);
      setError(null);

      const texts = prepareTexts();

      const response = await fetch("http://localhost:8000/translate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          texts: texts,
          target_language: selectedLocale,
        }),
      });

      if (!response.ok) {
        throw new Error(`Translation failed: ${response.statusText}`);
      }

      const data = await response.json();
      setTranslatedTexts(data.translations);

      // Call the onTranslate callback to update the parent component
      if (onTranslate) {
        onTranslate(data.translations);
      }

      // Reset audio when language changes
      if (audioUrl) {
        stopAudio();
        setAudioUrl(null);
      }
    } catch (err) {
      setError(`Translation error: ${err.message}`);
    } finally {
      setIsTranslating(false);
    }
  };

  // Handle text-to-speech
  const handleTextToSpeech = async () => {
    try {
      // If we already have audio for this language, just play it
      if (audioUrl) {
        playAudio();
        return;
      }

      setIsTtsLoading(true);
      setError(null);

      // Use translated texts if available, otherwise use original
      const texts = translatedTexts
        ? translatedTexts.map((t) => ({ key: t.key, value: t.translation }))
        : prepareTexts();

      console.log(
        "TTS Request:",
        JSON.stringify(
          {
            texts: texts,
            voice_id: selectedVoice,
          },
          null,
          2
        )
      );

      const response = await fetch("http://localhost:8000/tts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          texts: texts,
          voice_id: selectedVoice,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("TTS Error Response:", errorText);
        throw new Error(
          `TTS failed: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      console.log("TTS Response:", data);

      if (!data.audio_url) {
        throw new Error("No audio URL returned from server");
      }

      setAudioUrl(data.audio_url);

      // Play the audio
      playAudio(data.audio_url);
    } catch (err) {
      console.error("TTS Error:", err);
      setError(`TTS error: ${err.message}`);
    } finally {
      setIsTtsLoading(false);
    }
  };

  // Play audio
  const playAudio = (url = null) => {
    const audioSrc = url || audioUrl;
    if (!audioSrc) return;

    if (audioElement) {
      audioElement.pause();
      audioElement.remove();
    }

    const audio = new Audio(audioSrc);
    audio.onplay = () => setIsPlaying(true);
    audio.onpause = () => setIsPlaying(false);
    audio.onended = () => setIsPlaying(false);
    audio.onerror = () => {
      setError("Error playing audio");
      setIsPlaying(false);
    };

    setAudioElement(audio);
    audio.play();
  };

  // Stop audio
  const stopAudio = () => {
    if (audioElement) {
      audioElement.pause();
      setIsPlaying(false);
    }
  };

  // Handle call
  const handleCall = async () => {
    if (!phoneNumber) {
      setError("Please enter a phone number");
      return;
    }

    try {
      setIsCallLoading(true);
      setError(null);
      setCallStatus("Initiating call...");

      // Use translated texts if available, otherwise use original
      const texts = translatedTexts
        ? translatedTexts.map((t) => ({ key: t.key, value: t.translation }))
        : prepareTexts();

      const response = await fetch("http://localhost:8000/call", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text_body: texts,
          audio_url: audioUrl,
        }),
      });

      if (!response.ok) {
        throw new Error(`Call failed: ${response.statusText}`);
      }

      const callSid = await response.json();
      setCallStatus(`Call initiated successfully! SID: ${callSid}`);
    } catch (err) {
      setError(`Call error: ${err.message}`);
      setCallStatus("Call failed");
    } finally {
      setIsCallLoading(false);
    }
  };

  return (
    <div
      className="p-4 rounded shadow-lg text-center d-flex flex-column align-items-center justify-content-center"
      style={{
        backgroundColor: "var(--color-surface)",
        color: "var(--color-text)",
        fontFamily: "Poppins, sans-serif",
        animation: "fadeIn 1s",
        maxWidth: "430px",
        minWidth: "320px",
        width: "95%",
        minHeight: "300px",
        borderRadius: "15px",
        boxShadow: "0 10px 30px rgba(var(--color-primary-rgb), 0.08)",
      }}>
      <h3
        style={{
          color: "var(--color-primary)",
          marginBottom: "18px",
          marginTop: 0,
          fontWeight: 700,
          letterSpacing: "0.5px",
        }}>
        Communication Center
      </h3>

      {error && (
        <Alert
          variant="danger"
          className="w-100 mb-3"
          onClose={() => setError(null)}
          dismissible>
          {error}
        </Alert>
      )}

      {callStatus && !error && (
        <Alert
          variant="success"
          className="w-100 mb-3"
          onClose={() => setCallStatus(null)}
          dismissible>
          {callStatus}
        </Alert>
      )}

      <Form.Group
        className="mb-3 w-100"
        style={{ maxWidth: 350, margin: "0 auto" }}>
        <Form.Label style={{ color: "var(--color-text-secondary)" }}>
          Select Language & Voice
        </Form.Label>
        <Form.Select
          value={selectedVoice}
          onChange={handleVoiceChange}
          disabled={isTranslating || isTtsLoading || isCallLoading}
          style={{
            backgroundColor: "var(--color-card-background)",
            color: "var(--color-text)",
            borderColor: "var(--color-primary)",
          }}>
          {murfVoices.map((voice) => (
            <option key={voice.voiceId} value={voice.voiceId}>
              {voice.name}
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      <div
        className="d-flex gap-2 mb-3 w-100"
        style={{ maxWidth: 350, margin: "0 auto" }}>
        <Button
          onClick={handleTranslate}
          disabled={isTranslating || isTtsLoading || isCallLoading}
          style={{
            flex: 1,
            background: "linear-gradient(135deg, #3a7ced 70%, #8ba7fa 100%)",
            borderColor: "#3a7ced",
            color: "var(--color-surface)",
            boxShadow: "0 8px 25px rgba(58,124,237,0.3)",
            fontWeight: 600,
            letterSpacing: "0.5px",
            fontSize: "0.95rem",
            transition: "background 0.3s, color 0.3s, box-shadow 0.3s",
          }}>
          {isTranslating ? (
            <Spinner size="sm" animation="border" />
          ) : (
            <i className="bi bi-translate me-2"></i>
          )}
          Translate
        </Button>

        <Button
          onClick={isPlaying ? stopAudio : handleTextToSpeech}
          disabled={
            (isTtsLoading && !isPlaying) || isTranslating || isCallLoading
          }
          style={{
            flex: 1,
            background: isPlaying
              ? "linear-gradient(135deg, #ed3a7c 70%, #fa8ba7 100%)"
              : "linear-gradient(135deg, #7c3aed 70%, #a78bfa 100%)",
            borderColor: isPlaying ? "#ed3a7c" : "#7c3aed",
            color: "var(--color-surface)",
            boxShadow: isPlaying
              ? "0 8px 25px rgba(237,58,124,0.3)"
              : "0 8px 25px rgba(124,58,237,0.3)",
            fontWeight: 600,
            letterSpacing: "0.5px",
            fontSize: "0.95rem",
            transition: "background 0.3s, color 0.3s, box-shadow 0.3s",
          }}>
          {isTtsLoading && !isPlaying ? (
            <Spinner size="sm" animation="border" />
          ) : (
            <i
              className={`bi ${
                isPlaying ? "bi-stop-fill" : "bi-play-fill"
              } me-2`}></i>
          )}
          {isPlaying ? "Stop" : "Play"}
        </Button>
      </div>

      <InputGroup
        className="mb-3 w-100"
        style={{ maxWidth: 350, margin: "0 auto" }}>
        <Form.Control
          type="text"
          placeholder="Enter phone number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          disabled={isTranslating || isTtsLoading || isCallLoading}
          style={{
            backgroundColor: "var(--color-card-background)",
            color: "var(--color-text)",
            borderColor: "var(--color-primary)",
          }}
        />
        <Button
          onClick={handleCall}
          disabled={isCallLoading || isTranslating || isTtsLoading}
          style={{
            background: "linear-gradient(135deg, #3aed7c 70%, #8bfaa7 100%)",
            borderColor: "#3aed7c",
            color: "var(--color-surface)",
            boxShadow: "0 8px 25px rgba(58,237,124,0.3)",
            fontWeight: 600,
            letterSpacing: "0.5px",
            minWidth: 120,
            fontSize: "0.95rem",
            transition: "background 0.3s, color 0.3s, box-shadow 0.3s",
          }}>
          {isCallLoading ? (
            <Spinner size="sm" animation="border" />
          ) : (
            <i className="bi bi-telephone-fill me-2"></i>
          )}
          Call
        </Button>
      </InputGroup>

      {translatedTexts && (
        <div
          className="mt-2 text-start w-100"
          style={{ maxWidth: 350, margin: "0 auto", fontSize: "0.8rem" }}>
          <p className="text-muted mb-1">
            <i className="bi bi-info-circle me-1"></i>
            Translated to{" "}
            {murfVoices.find((v) => v.locale === selectedLocale)?.name}
          </p>
        </div>
      )}
    </div>
  );
}
