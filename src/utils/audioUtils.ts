/**
 * Audio utilities for Gemini Live API (16kHz PCM input, 24kHz PCM output)
 * and Web Audio playback.
 */

// Convert Float32Array from AudioBuffer to 16-bit PCM Base64 for Gemini Live input
export function float32To16BitPCMBase64(inputData: Float32Array): string {
  const buffer = new ArrayBuffer(inputData.length * 2);
  const view = new DataView(buffer);
  let offset = 0;
  for (let i = 0; i < inputData.length; i++, offset += 2) {
    const s = Math.max(-1, Math.min(1, inputData[i]));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true); // little-endian
  }

  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// Convert Base64 16-bit PCM little-endian (24kHz) to Float32Array for AudioContext playback
export function base64PCMToFloat32Array(base64: string): Float32Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  const int16 = new Int16Array(bytes.buffer);
  const float32 = new Float32Array(int16.length);
  for (let i = 0; i < int16.length; i++) {
    float32[i] = int16[i] / 32768.0;
  }
  return float32;
}

// Gapless PCM Stream Audio Player using Web Audio API
export class LiveAudioPlayer {
  private audioCtx: AudioContext | null = null;
  private nextStartTime: number = 0;
  private isPlaying: boolean = false;
  private scheduledSources: AudioBufferSourceNode[] = [];
  public analyser: AnalyserNode | null = null;

  constructor() {
    // initialize on demand after user interaction
  }

  public init() {
    if (!this.audioCtx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.audioCtx = new AudioCtx({ sampleRate: 24000 });
      this.analyser = this.audioCtx.createAnalyser();
      this.analyser.fftSize = 64;
      this.analyser.connect(this.audioCtx.destination);
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  public playChunk(base64Pcm: string) {
    this.init();
    if (!this.audioCtx || !this.analyser) return;

    try {
      const float32Data = base64PCMToFloat32Array(base64Pcm);
      const audioBuffer = this.audioCtx.createBuffer(1, float32Data.length, 24000);
      audioBuffer.getChannelData(0).set(float32Data);

      const source = this.audioCtx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(this.analyser);

      const currentTime = this.audioCtx.currentTime;
      if (this.nextStartTime < currentTime) {
        this.nextStartTime = currentTime;
      }

      source.start(this.nextStartTime);
      this.nextStartTime += audioBuffer.duration;
      this.scheduledSources.push(source);
      this.isPlaying = true;

      source.onended = () => {
        const index = this.scheduledSources.indexOf(source);
        if (index > -1) {
          this.scheduledSources.splice(index, 1);
        }
        if (this.scheduledSources.length === 0) {
          this.isPlaying = false;
        }
      };
    } catch (err) {
      console.error('Error scheduling PCM audio chunk:', err);
    }
  }

  public stopAndClear() {
    for (const source of this.scheduledSources) {
      try {
        source.stop();
        source.disconnect();
      } catch (e) {
        // already stopped
      }
    }
    this.scheduledSources = [];
    this.isPlaying = false;
    if (this.audioCtx) {
      this.nextStartTime = this.audioCtx.currentTime;
    }
  }

  public getPlaybackState(): boolean {
    return this.isPlaying;
  }
}

/**
 * Global persistent reference to prevent Chrome garbage collector from
 * killing speech synthesis utterances prematurely.
 */
let globalActiveUtterance: SpeechSynthesisUtterance | null = null;
let speechWatchdogTimer: any = null;

export function stopBrowserSpeech() {
  if (speechWatchdogTimer) {
    clearInterval(speechWatchdogTimer);
    speechWatchdogTimer = null;
  }
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch {
      // ignore
    }
  }
  globalActiveUtterance = null;
  if (typeof window !== 'undefined') {
    (window as any).__umaActiveUtterance = null;
  }
}

/**
 * Resilient, multi-browser Speech Synthesis engine for Uma.
 * Handles:
 * - Garbage collection bugs in Chrome
 * - Asynchronous voice loading in WebKit/Blink
 * - Background pause bugs with automatic resume heartbeat
 * - Natural pitch, speed, and language detection (Spanish vs English)
 */
export function speakBrowserText(
  text: string,
  onStart?: () => void,
  onEnd?: () => void
): () => void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    onEnd?.();
    return () => {};
  }

  // Clear any existing speech and timers
  stopBrowserSpeech();

  // Clean formatted text for natural pronunciation (remove asterisks, markdown, etc.)
  const cleanText = text
    .replace(/[*_#`~[\]]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (!cleanText) {
    onEnd?.();
    return () => {};
  }

  const isSpanish =
    /[áéíóúñ¿¡]/i.test(cleanText) ||
    /\b(hola|buenos|buenas|enara|estudia|estudios|idiomas|universidad|deusto|marketing|español|bilbao|curso|grado|prácticas|experiencia|ecuestre|caballos|contacto|residencia|delegada|resumen)\b/i.test(
      cleanText
    );

  const utterance = new SpeechSynthesisUtterance(cleanText);
  globalActiveUtterance = utterance;
  (window as any).__umaActiveUtterance = utterance;

  utterance.lang = isSpanish ? 'es-ES' : 'en-US';
  utterance.pitch = 1.05;
  utterance.rate = 0.98;

  let hasEnded = false;
  const finish = () => {
    if (hasEnded) return;
    hasEnded = true;
    if (speechWatchdogTimer) {
      clearInterval(speechWatchdogTimer);
      speechWatchdogTimer = null;
    }
    if (globalActiveUtterance === utterance) {
      globalActiveUtterance = null;
    }
    onEnd?.();
  };

  utterance.onstart = () => {
    try {
      window.speechSynthesis.resume();
    } catch {}
    onStart?.();

    // Chrome bug: SpeechSynthesis can pause unexpectedly on long sentences;
    // watchdog heartbeat keeps it resumed until finished.
    if (speechWatchdogTimer) clearInterval(speechWatchdogTimer);
    speechWatchdogTimer = setInterval(() => {
      if (!window.speechSynthesis.speaking) {
        clearInterval(speechWatchdogTimer);
        speechWatchdogTimer = null;
      } else if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
    }, 1500);
  };

  utterance.onend = finish;
  utterance.onerror = (e) => {
    console.warn('SpeechSynthesis event note:', e);
    finish();
  };

  const selectVoiceAndSpeak = () => {
    const voices = window.speechSynthesis.getVoices();
    if (voices && voices.length > 0) {
      if (isSpanish) {
        const esVoice =
          voices.find(
            (v) =>
              v.lang.startsWith('es') &&
              (v.name.includes('Monica') ||
                v.name.includes('Paulina') ||
                v.name.includes('Google') ||
                v.name.includes('Lucia') ||
                v.name.includes('Natural') ||
                v.name.includes('Helena') ||
                v.name.includes('Laura'))
          ) || voices.find((v) => v.lang.startsWith('es'));
        if (esVoice) utterance.voice = esVoice;
      } else {
        const enVoice =
          voices.find(
            (v) =>
              v.lang.startsWith('en') &&
              (v.name.includes('Samantha') ||
                v.name.includes('Victoria') ||
                v.name.includes('Female') ||
                v.name.includes('Google') ||
                v.name.includes('Natural') ||
                v.name.includes('Jenny') ||
                v.name.includes('Ava') ||
                v.name.includes('Karen') ||
                v.name.includes('Serena'))
          ) || voices.find((v) => v.lang.startsWith('en'));
        if (enVoice) utterance.voice = enVoice;
      }
    }

    // Small delay ensures previous speech queue in browser is flushed
    setTimeout(() => {
      try {
        window.speechSynthesis.speak(utterance);
        window.speechSynthesis.resume();
      } catch (err) {
        console.error('Failed to speak via SpeechSynthesis:', err);
        finish();
      }
    }, 50);
  };

  const voices = window.speechSynthesis.getVoices();
  if (voices && voices.length > 0) {
    selectVoiceAndSpeak();
  } else {
    // Wait for voices if loading asynchronously
    const onVoices = () => {
      window.speechSynthesis.onvoiceschanged = null;
      selectVoiceAndSpeak();
    };
    window.speechSynthesis.onvoiceschanged = onVoices;
    setTimeout(() => {
      if (!hasEnded && !window.speechSynthesis.speaking) {
        selectVoiceAndSpeak();
      }
    }, 250);
  }

  return () => {
    finish();
    stopBrowserSpeech();
  };
}
