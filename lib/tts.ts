/**
 * Text-to-speech helper designed for elderly accessibility.
 * Speaks slowly, clearly, with a gentle pitch.
 */
export function speakText(text: string, onEnd?: () => void): void {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    console.warn("Speech synthesis is not supported in this browser.");
    if (onEnd) onEnd();
    return;
  }

  // Cancel any ongoing speech first
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.88; // Slightly slower for elderly clarity
  utterance.pitch = 1.0;
  utterance.volume = 1.0;

  // Prefer natural English voices if available
  const voices = window.speechSynthesis.getVoices();
  const preferredVoice = voices.find(
    (v) =>
      (v.name.includes("Google") || v.name.includes("Natural") || v.name.includes("Samantha") || v.name.includes("Daniel")) &&
      v.lang.startsWith("en")
  );
  if (preferredVoice) {
    utterance.voice = preferredVoice;
  }

  if (onEnd) {
    utterance.onend = () => onEnd();
    utterance.onerror = () => onEnd();
  }

  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking(): void {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}
