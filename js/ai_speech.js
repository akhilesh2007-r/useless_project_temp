// AI Mom Speech Synthesis & Recognition Handler
class AISpeechHandler {
  constructor() {
    this.recognition = null;
    this.isListening = false;
    this.onTranscriptCallback = null;
    this.onStatusCallback = null;
    this.synth = window.speechSynthesis || null;
    this.cachedVoices = [];

    if (this.synth) {
      this.cachedVoices = this.synth.getVoices();
      if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = () => {
          this.cachedVoices = this.synth.getVoices();
        };
      }
    }
  }

  isSpeechSupported() {
    return ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);
  }

  initRecognition(onTranscript, onStatus) {
    this.onTranscriptCallback = onTranscript;
    this.onStatusCallback = onStatus;

    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) return false;

    this.recognition = new SpeechRec();
    this.recognition.continuous = false;
    this.recognition.interimResults = false;
    this.recognition.lang = 'en-IN'; // Indian English / natural inflection

    this.recognition.onstart = () => {
      this.isListening = true;
      if (this.onStatusCallback) this.onStatusCallback(true, "🎙️ Listening... Speak your excuse!");
    };

    this.recognition.onresult = (event) => {
      const last = event.results.length - 1;
      const text = event.results[last][0].transcript.trim();
      if (this.onTranscriptCallback && text) {
        this.onTranscriptCallback(text);
      }
    };

    this.recognition.onerror = (e) => {
      this.isListening = false;
      if (this.onStatusCallback) this.onStatusCallback(false, `Mic error: ${e.error}`);
    };

    this.recognition.onend = () => {
      this.isListening = false;
      if (this.onStatusCallback) this.onStatusCallback(false, "Mic idle");
    };

    return true;
  }

  startListening() {
    if (!this.recognition) return;
    try {
      this.recognition.start();
    } catch (e) {
      console.warn("Speech recognition already running");
    }
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
    }
  }

  // Speak AI Mom response with modulated voice tone
  speakMomResponse(text, angerLevel = 50, personality = "strict", soundEnabled = true) {
    if (!this.synth || !soundEnabled) return;

    // Cancel ongoing speech
    this.synth.cancel();

    // Clean emojis & formatting for text-to-speech
    const cleanText = text.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '').trim();
    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);

    // Pick best female/English voice
    if (this.cachedVoices.length === 0) {
      this.cachedVoices = this.synth.getVoices();
    }
    const preferredVoice = this.cachedVoices.find(v => 
      (v.name.includes("Natural") || v.name.includes("India") || v.name.includes("Samantha") || v.name.includes("Google") || v.name.includes("Zira") || v.name.includes("Female")) && v.lang.startsWith("en")
    ) || this.cachedVoices.find(v => v.lang.startsWith("en"));

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    // Dynamic pitch and rate based on Mom's Anger & Personality
    // High anger = faster rate, sharper pitch
    const angerFactor = Math.min(1.0, Math.max(0, angerLevel / 100));
    
    if (personality === "calm") {
      utterance.rate = 0.95 + (angerFactor * 0.15);
      utterance.pitch = 1.0 + (angerFactor * 0.2);
    } else if (personality === "angry" || personality === "boss") {
      utterance.rate = 1.1 + (angerFactor * 0.35); // Very fast when furious
      utterance.pitch = 1.15 + (angerFactor * 0.35); // Sharp maternal accusation pitch
    } else if (personality === "suspicious") {
      utterance.rate = 0.9; // Slow, menacing interrogation
      utterance.pitch = 0.95;
    } else {
      utterance.rate = 1.0 + (angerFactor * 0.25);
      utterance.pitch = 1.05 + (angerFactor * 0.25);
    }

    utterance.volume = 1.0;

    this.synth.speak(utterance);
  }

  cancel() {
    if (this.synth) this.synth.cancel();
  }
}

window.aiSpeechHandler = new AISpeechHandler();
