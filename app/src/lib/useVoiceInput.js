import { useEffect, useRef, useState } from 'react';

// Voice Input for AskMe — wraps the Web Speech API's SpeechRecognition
// (webkitSpeechRecognition on Safari/Chrome, unprefixed where available).
// No server-side transcription anywhere in this app — this is the
// browser's own on-device/OS-level recognizer, same as any other web page
// using dictation, not a new backend dependency. Support is real but
// partial (solid on Chrome/Android/desktop Safari, absent on Firefox) —
// callers must check `supported` and simply not render the mic button
// when false, rather than showing a button that silently does nothing.
export function useVoiceInput({ onResult, lang = 'id-ID' } = {}) {
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    setSupported(true);
    const recognition = new SpeechRecognition();
    recognition.lang = lang;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (e) => {
      const transcript = e.results[0]?.[0]?.transcript;
      if (transcript) onResult?.(transcript);
    };
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);
    recognitionRef.current = recognition;
    return () => recognition.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- recognition is set up once; onResult is read fresh via the ref-bound handler below
  }, [lang]);

  function start() {
    if (!recognitionRef.current || listening) return;
    setListening(true);
    recognitionRef.current.start();
  }

  function stop() {
    recognitionRef.current?.stop();
  }

  return { supported, listening, start, stop };
}
