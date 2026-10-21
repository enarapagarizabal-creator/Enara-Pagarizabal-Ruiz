import React, { useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, Sparkles, Radio, Play, RotateCcw, Info, Activity } from 'lucide-react';

interface VoiceOrbProps {
  isLiveActive: boolean;
  isConnecting: boolean;
  isModelSpeaking: boolean;
  isUserSpeaking: boolean;
  isListeningToUser: boolean;
  errorMessage: string | null;
  micPermissionDenied: boolean;
  onToggleVoiceSpeech: () => void;
  onStartLive: () => void;
  onStopLive: () => void;
  onPlayIntro: () => void;
  onClearError: () => void;
  statusText: string;
}

export const VoiceOrb: React.FC<VoiceOrbProps> = ({
  isLiveActive,
  isConnecting,
  isModelSpeaking,
  isUserSpeaking,
  isListeningToUser,
  errorMessage,
  micPermissionDenied,
  onToggleVoiceSpeech,
  onStartLive,
  onStopLive,
  onPlayIntro,
  onClearError,
  statusText,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Animated visualizer waveform when speaking or listening
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let phase = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const width = canvas.width;
      const height = canvas.height;
      const centerY = height / 2;

      const userActive = isUserSpeaking || isListeningToUser;
      const isActive = isModelSpeaking || userActive;
      const baseAmplitude = isModelSpeaking ? 30 : userActive ? 24 : isLiveActive ? 8 : 4;
      const barCount = 36;
      const step = width / barCount;

      ctx.save();
      for (let i = 0; i < barCount; i++) {
        const x = i * step + step / 2;
        const normalizedDist = 1 - Math.abs(i - barCount / 2) / (barCount / 2);
        const wave = Math.sin(phase + i * 0.3) * Math.cos(phase * 0.7 + i * 0.2);
        const barHeight = Math.max(3, (wave * baseAmplitude + baseAmplitude * 0.5) * normalizedDist);

        const gradient = ctx.createLinearGradient(0, centerY - barHeight, 0, centerY + barHeight);
        if (isModelSpeaking) {
          gradient.addColorStop(0, 'rgba(251, 191, 36, 0.95)');
          gradient.addColorStop(0.5, 'rgba(245, 158, 11, 0.75)');
          gradient.addColorStop(1, 'rgba(251, 191, 36, 0.2)');
        } else if (userActive) {
          gradient.addColorStop(0, 'rgba(56, 189, 248, 0.95)');
          gradient.addColorStop(0.5, 'rgba(14, 165, 233, 0.75)');
          gradient.addColorStop(1, 'rgba(56, 189, 248, 0.25)');
        } else if (isLiveActive) {
          gradient.addColorStop(0, 'rgba(217, 119, 6, 0.6)');
          gradient.addColorStop(1, 'rgba(255, 255, 255, 0.1)');
        } else {
          gradient.addColorStop(0, 'rgba(255, 255, 255, 0.25)');
          gradient.addColorStop(1, 'rgba(255, 255, 255, 0.05)');
        }

        ctx.fillStyle = gradient;
        ctx.fillRect(x - 2, centerY - barHeight / 2, 4, barHeight);
      }
      ctx.restore();

      phase += isActive ? 0.09 : 0.03;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isLiveActive, isModelSpeaking, isUserSpeaking, isListeningToUser]);

  const userActive = isUserSpeaking || isListeningToUser;

  return (
    <div className="relative flex flex-col items-center justify-center p-6 sm:p-10 rounded-2xl bg-gradient-to-b from-white/[0.04] to-transparent border border-white/[0.08] shadow-2xl backdrop-blur-md overflow-hidden">
      {/* Background ambient radial glow */}
      <div
        className={`absolute -top-24 w-80 h-80 rounded-full blur-[90px] transition-all duration-700 pointer-events-none ${
          isModelSpeaking
            ? 'bg-amber-500/25 scale-125'
            : userActive
            ? 'bg-sky-500/25 scale-120'
            : isLiveActive
            ? 'bg-amber-600/15 scale-100'
            : 'bg-white/5 scale-90'
        }`}
      />

      {/* Voice Mode Badge */}
      <div className="flex items-center gap-2 mb-6">
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium tracking-wide transition-all ${
            isModelSpeaking
              ? 'bg-amber-500/20 text-amber-200 border border-amber-500/30'
              : userActive
              ? 'bg-sky-500/20 text-sky-200 border border-sky-500/30 animate-pulse'
              : isLiveActive
              ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
              : 'bg-white/[0.06] text-zinc-400 border border-white/[0.08]'
          }`}
        >
          {userActive ? (
            <Activity className="w-3 h-3 text-sky-300 animate-pulse" />
          ) : (
            <Radio className={`w-3 h-3 ${isLiveActive || isModelSpeaking ? 'animate-pulse text-amber-300' : ''}`} />
          )}
          {isModelSpeaking
            ? 'Uma is Speaking'
            : userActive
            ? 'Listening to you... Speak now'
            : isLiveActive
            ? 'Live Stream Active'
            : 'Voice Assistant Ready'}
        </span>
      </div>

      {/* Central Interactive Voice Orb */}
      <div className="relative flex items-center justify-center w-48 h-48 sm:w-56 sm:h-56 my-2">
        {/* Pulsing outer aura ring */}
        <div
          className={`absolute inset-0 rounded-full border transition-all duration-700 ${
            isModelSpeaking
              ? 'border-amber-400/50 scale-110 animate-ripple'
              : userActive
              ? 'border-sky-400/50 scale-110 animate-ripple'
              : isLiveActive
              ? 'border-white/20 animate-pulse-subtle'
              : 'border-white/10 hover:border-amber-400/30'
          }`}
        />

        {/* Secondary rotating ring */}
        <div
          className={`absolute inset-3 rounded-full border border-dashed transition-all duration-1000 ${
            isLiveActive || isModelSpeaking || userActive
              ? 'border-amber-400/30 animate-spin-slow'
              : 'border-white/5'
          }`}
          style={{ animationDuration: '24s' }}
        />

        {/* Core luminous orb - Click to Speak! */}
        <div
          className={`relative flex items-center justify-center w-36 h-36 sm:w-42 sm:h-42 rounded-full shadow-2xl transition-all duration-500 overflow-hidden cursor-pointer ${
            isModelSpeaking
              ? 'bg-gradient-to-tr from-amber-600 via-amber-400 to-amber-200 shadow-amber-500/30 scale-105'
              : userActive
              ? 'bg-gradient-to-tr from-sky-600 via-sky-400 to-cyan-200 shadow-sky-500/30 scale-105'
              : isLiveActive
              ? 'bg-gradient-to-tr from-zinc-800 via-amber-900/40 to-amber-600/30 border border-amber-500/40'
              : 'bg-gradient-to-tr from-zinc-900 via-zinc-800 to-zinc-700/80 border border-white/10 hover:border-amber-400/50 hover:scale-102 shadow-lg shadow-black/40'
          }`}
          onClick={isLiveActive ? onStopLive : onToggleVoiceSpeech}
          title={
            isLiveActive
              ? 'Click to end live session'
              : userActive
              ? 'Click to stop speaking and send'
              : 'Click to speak to Uma'
          }
        >
          {/* Glass reflection */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/15 to-transparent pointer-events-none" />

          {/* Central Icon */}
          <div className="flex flex-col items-center justify-center text-center z-10 select-none">
            {isConnecting ? (
              <div className="flex flex-col items-center gap-1.5 text-zinc-300">
                <div className="w-6 h-6 border-2 border-amber-300 border-t-transparent rounded-full animate-spin" />
                <span className="text-[11px] font-medium tracking-wide">Connecting</span>
              </div>
            ) : isModelSpeaking ? (
              <div className="flex flex-col items-center gap-1 text-black">
                <Volume2 className="w-9 h-9 text-black/90 animate-pulse" />
                <span className="text-[11px] font-semibold tracking-wider uppercase text-black/80 font-serif">
                  Uma Speaking
                </span>
              </div>
            ) : userActive ? (
              <div className="flex flex-col items-center gap-1 text-sky-950">
                <Mic className="w-9 h-9 text-sky-950 animate-bounce" />
                <span className="text-[11px] font-bold tracking-wider uppercase text-sky-950">
                  Listening...
                </span>
              </div>
            ) : isLiveActive ? (
              <div className="flex flex-col items-center gap-1 text-white">
                <Mic className="w-8 h-8 text-amber-200 animate-pulse" />
                <span className="text-[11px] font-medium tracking-wider uppercase text-zinc-200">
                  Live Stream
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-1.5 text-zinc-200 group-hover:text-amber-200 transition-colors">
                <div className="p-3 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300">
                  <Mic className="w-7 h-7" />
                </div>
                <span className="text-xs font-semibold tracking-wide text-amber-200">
                  Tap to Speak
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Audio Waveform Canvas */}
      <div className="w-full max-w-xs h-12 my-3 flex items-center justify-center">
        <canvas ref={canvasRef} width={280} height={48} className="w-full h-full" />
      </div>

      {/* Spoken Language & Voice Signature */}
      <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-zinc-400 font-light max-w-md text-center">
        <span className="inline-flex items-center gap-1 text-zinc-300">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          Soft Woman Voice
        </span>
        <span className="text-zinc-600">•</span>
        <span>English (American)</span>
        <span className="text-zinc-600">•</span>
        <span>Español (España)</span>
      </div>

      {/* Dynamic Status message */}
      <p className="mt-3 text-xs text-zinc-300 font-normal tracking-wide text-center min-h-[1.25rem]">
        {statusText}
      </p>

      {/* Primary Action Controls */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        {!isLiveActive ? (
          <>
            {/* Primary Tap to Speak Button */}
            <button
              onClick={onToggleVoiceSpeech}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-xs sm:text-sm shadow-lg transition-all cursor-pointer ${
                userActive
                  ? 'bg-sky-400 hover:bg-sky-300 text-zinc-950 shadow-sky-400/30 animate-pulse'
                  : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 shadow-amber-500/20 hover:shadow-amber-500/30'
              }`}
            >
              {userActive ? (
                <>
                  <MicOff className="w-4 h-4" />
                  <span>Stop & Send Speech</span>
                </>
              ) : (
                <>
                  <Mic className="w-4 h-4" />
                  <span>Tap to Speak to Uma</span>
                </>
              )}
            </button>

            {/* Hear Sample Voice Intro */}
            <button
              onClick={onPlayIntro}
              disabled={isModelSpeaking || userActive}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] text-zinc-200 border border-white/[0.1] font-medium text-xs sm:text-sm transition-all cursor-pointer disabled:opacity-40"
              title="Hear Uma introduce herself out loud"
            >
              <Volume2 className="w-3.5 h-3.5 text-amber-300" />
              <span>Hear Voice Sample</span>
            </button>

            {/* Continuous Live Streaming Mode */}
            <button
              onClick={onStartLive}
              disabled={isConnecting || userActive}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-zinc-400 hover:text-zinc-200 border border-white/[0.06] text-xs transition-all cursor-pointer disabled:opacity-40"
              title="Start continuous live streaming audio call with Gemini 3.8 Live"
            >
              <Radio className="w-3 h-3 text-emerald-400" />
              <span>Continuous Live Call</span>
            </button>
          </>
        ) : (
          <button
            onClick={onStopLive}
            className="flex items-center gap-2.5 px-6 py-2.5 rounded-full bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 font-medium text-sm transition-all cursor-pointer"
          >
            <MicOff className="w-4 h-4" />
            <span>End Live Session</span>
          </button>
        )}
      </div>

      {/* Mic permission or status notice */}
      {micPermissionDenied && (
        <div className="mt-5 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 max-w-md text-left flex items-start gap-2.5">
          <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-medium text-white">Allow Microphone to Speak</p>
            <p className="text-zinc-300 leading-relaxed text-[11px]">
              If your browser prompted for microphone access, click "Allow". You can also click "Retry Microphone" below, or choose any suggested inquiry to hear Uma answer aloud.
            </p>
            <div className="pt-1 flex items-center gap-2">
              <button
                onClick={onToggleVoiceSpeech}
                className="inline-flex items-center gap-1 text-[11px] text-amber-300 hover:underline font-medium cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Retry Microphone</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* General informational notice */}
      {errorMessage && !micPermissionDenied && (
        <div className="mt-4 flex items-center justify-between gap-2 px-4 py-2.5 rounded-lg bg-zinc-800/90 border border-white/[0.08] text-zinc-300 text-xs max-w-md">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 shrink-0 text-amber-400" />
            <span>{errorMessage}</span>
          </div>
          <button
            onClick={onClearError}
            className="text-[10px] text-zinc-500 hover:text-zinc-300 uppercase font-semibold cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
};
