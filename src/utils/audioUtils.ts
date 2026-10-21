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
