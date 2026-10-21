/**
 * Robust Voice Input Handler supporting:
 * 1. Web Speech API (webkitSpeechRecognition / SpeechRecognition) for zero-latency streaming text
 * 2. MediaRecorder fallback sending audio to Gemini 3.5 Transcribe (/api/transcribe)
 */

export interface VoiceInputCallbacks {
  onStart?: () => void;
  onInterimText?: (text: string) => void;
  onFinalText?: (text: string) => void;
  onError?: (error: string) => void;
  onEnd?: () => void;
}

export class VoiceInputManager {
  private recognition: any = null;
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private mediaStream: MediaStream | null = null;
  private isListening: boolean = false;
  private currentFinalText: string = '';

  constructor() {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = true;
        this.recognition.maxAlternatives = 1;
      } catch (e) {
        this.recognition = null;
      }
    }
  }

  public getIsListening(): boolean {
    return this.isListening;
  }

  public async startListening(callbacks: VoiceInputCallbacks, preferredLanguage: 'en' | 'es' | 'auto' = 'auto') {
    if (this.isListening) {
      this.stopListening();
      return;
    }

    this.isListening = true;
    this.currentFinalText = '';
    callbacks.onStart?.();

    // Prefer Web Speech API if supported
    if (this.recognition) {
      this.recognition.lang =
        preferredLanguage === 'es' ? 'es-ES' : preferredLanguage === 'en' ? 'en-US' : navigator.language || 'en-US';

      this.recognition.onresult = (event: any) => {
        let interimText = '';
        let finalText = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const item = event.results[i];
          if (item.isFinal) {
            finalText += item[0].transcript;
          } else {
            interimText += item[0].transcript;
          }
        }

        if (finalText) {
          this.currentFinalText = finalText.trim();
          callbacks.onInterimText?.(finalText.trim());
        } else if (interimText) {
          callbacks.onInterimText?.(interimText.trim());
        }
      };

      this.recognition.onerror = async (event: any) => {
        console.warn('SpeechRecognition event error:', event.error);
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          callbacks.onError?.('Microphone access was denied. Please allow microphone in browser.');
          this.isListening = false;
          callbacks.onEnd?.();
          return;
        }

        // On recognition network or no-speech error, fall back to MediaRecorder
        if (this.isListening && !this.currentFinalText) {
          try {
            await this.startMediaRecorder(callbacks);
          } catch (e: any) {
            callbacks.onError?.(e?.message || 'Could not access microphone');
            this.isListening = false;
            callbacks.onEnd?.();
          }
        } else {
          this.isListening = false;
          callbacks.onEnd?.();
        }
      };

      this.recognition.onend = () => {
        this.isListening = false;
        if (this.currentFinalText) {
          callbacks.onFinalText?.(this.currentFinalText);
        }
        callbacks.onEnd?.();
      };

      try {
        this.recognition.start();
        return;
      } catch (err) {
        console.warn('Could not start SpeechRecognition, trying MediaRecorder fallback:', err);
      }
    }

    // Fallback: MediaRecorder with server transcription via Gemini 3.5 Transcribe
    try {
      await this.startMediaRecorder(callbacks);
    } catch (err: any) {
      this.isListening = false;
      callbacks.onError?.(err?.message || 'Microphone access denied or unavailable.');
      callbacks.onEnd?.();
    }
  }

  private async startMediaRecorder(callbacks: VoiceInputCallbacks) {
    if (!navigator.mediaDevices?.getUserMedia) {
      throw new Error('Microphone not supported on this browser.');
    }

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    this.mediaStream = stream;
    this.audioChunks = [];

    const mimeType = MediaRecorder.isTypeSupported('audio/webm')
      ? 'audio/webm'
      : MediaRecorder.isTypeSupported('audio/mp4')
      ? 'audio/mp4'
      : 'audio/wav';

    const recorder = new MediaRecorder(stream);
    this.mediaRecorder = recorder;

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        this.audioChunks.push(e.data);
      }
    };

    recorder.onstop = async () => {
      this.cleanupStream();
      if (this.audioChunks.length === 0) {
        callbacks.onEnd?.();
        return;
      }

      const audioBlob = new Blob(this.audioChunks, { type: mimeType });
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const base64Data = (reader.result as string).split(',')[1];
          callbacks.onInterimText?.('Transcribing your speech with Gemini...');

          const res = await fetch('/api/transcribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              audio: base64Data,
              mimeType,
            }),
          });

          if (res.ok) {
            const data = await res.json();
            if (data.text) {
              callbacks.onFinalText?.(data.text);
            } else {
              callbacks.onError?.('No speech detected. Please try again.');
            }
          } else {
            callbacks.onError?.('Transcription failed. Please try speaking again.');
          }
        } catch (e: any) {
          callbacks.onError?.(e?.message || 'Failed to process audio.');
        } finally {
          this.isListening = false;
          callbacks.onEnd?.();
        }
      };
      reader.readAsDataURL(audioBlob);
    };

    recorder.start();
  }

  public stopListening() {
    this.isListening = false;

    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (e) {
        // ignore
      }
    }

    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      try {
        this.mediaRecorder.stop();
      } catch (e) {
        // ignore
      }
    }

    this.cleanupStream();
  }

  private cleanupStream() {
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => track.stop());
      this.mediaStream = null;
    }
  }
}
