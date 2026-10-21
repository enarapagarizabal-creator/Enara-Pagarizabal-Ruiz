/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Header } from './components/Header.tsx';
import { VoiceOrb } from './components/VoiceOrb.tsx';
import { ConversationPanel, MessageItem } from './components/ConversationPanel.tsx';
import { ResumePortfolio } from './components/ResumePortfolio.tsx';
import { PdfViewerModal } from './components/PdfViewerModal.tsx';
import { LiveAudioPlayer, float32To16BitPCMBase64, speakBrowserText, stopBrowserSpeech } from './utils/audioUtils.ts';
import { VoiceInputManager } from './utils/voiceInput.ts';
import { ENARA_PROFILE } from './data/enaraProfile.ts';
import { generateUmaFallbackReply } from './data/umaIntelligence.ts';
import { ArrowRight } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'voice' | 'profile' | 'cv'>('voice');
  const [isLiveActive, setIsLiveActive] = useState<boolean>(false);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [isModelSpeaking, setIsModelSpeaking] = useState<boolean>(false);
  const [isUserSpeaking, setIsUserSpeaking] = useState<boolean>(false);
  const [isListeningToUser, setIsListeningToUser] = useState<boolean>(false);
  const [voiceInterimText, setVoiceInterimText] = useState<string>('');
  const [micPermissionDenied, setMicPermissionDenied] = useState<boolean>(false);
  const [statusText, setStatusText] = useState<string>(
    'Uma is ready. Click "Tap to Speak" to ask your question in English or Spanish.'
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isCvModalOpen, setIsCvModalOpen] = useState<boolean>(false);

  // Chat transcript & Q&A
  const [messages, setMessages] = useState<MessageItem[]>([
    {
      id: 'welcome-1',
      role: 'assistant',
      text: "Hello! I am Uma, Enara Pagarizabal's personal voice representative. I speak English with an American accent and Spanish with a European accent. Feel free to talk to me about Enara's background in marketing, her dual degree at Deusto, the INSIDE LVMH program, or her Galope 7 equestrian discipline. How can I assist you?",
      timestamp: 'Just now',
    },
  ]);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [activePlayingText, setActivePlayingText] = useState<string | null>(null);

  // Web Audio, Voice Input and WebSocket references
  const wsRef = useRef<WebSocket | null>(null);
  const livePlayerRef = useRef<LiveAudioPlayer | null>(null);
  const voiceManagerRef = useRef<VoiceInputManager | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const inputAudioCtxRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const currentTtsAudioRef = useRef<HTMLAudioElement | null>(null);
  const modelSpeechTimerRef = useRef<any>(null);

  // Initialize audio players & voice input manager
  useEffect(() => {
    livePlayerRef.current = new LiveAudioPlayer();
    voiceManagerRef.current = new VoiceInputManager();
    return () => {
      stopLiveSession();
      if (voiceManagerRef.current) {
        voiceManagerRef.current.stopListening();
      }
    };
  }, []);

  // Stop current TTS playback
  const stopCurrentTts = useCallback(() => {
    if (currentTtsAudioRef.current) {
      try {
        currentTtsAudioRef.current.pause();
      } catch {}
      currentTtsAudioRef.current = null;
    }
    stopBrowserSpeech();
    setActivePlayingText(null);
    setIsModelSpeaking(false);
  }, []);

  // Browser SpeechSynthesis engine with resilient callback state management
  const speakWithBrowser = useCallback(
    (text: string) => {
      stopCurrentTts();
      setIsModelSpeaking(true);
      setActivePlayingText(text);
      setStatusText('Uma is speaking in a soft woman voice...');

      speakBrowserText(
        text,
        () => {
          setIsModelSpeaking(true);
          setActivePlayingText(text);
          setStatusText('Uma is speaking in a soft woman voice...');
        },
        () => {
          setIsModelSpeaking(false);
          setActivePlayingText(null);
          setStatusText('Uma is ready. Click "Tap to Speak" to continue.');
        }
      );
    },
    [stopCurrentTts]
  );

  // Play TTS audio generated from server with Aoede voice or high quality browser fallback
  const handlePlayTts = async (text: string) => {
    stopCurrentTts();
    setIsModelSpeaking(true);
    setActivePlayingText(text);
    setStatusText('Uma is speaking in a soft woman voice...');

    // Try server TTS first
    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, voiceName: 'Aoede' }),
      });

      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const data = await res.json();
        if (data.audio) {
          const audio = new Audio(`data:audio/wav;base64,${data.audio}`);
          currentTtsAudioRef.current = audio;

          audio.onended = () => {
            setIsModelSpeaking(false);
            setActivePlayingText(null);
            setStatusText('Uma is ready. Click "Tap to Speak" to continue.');
          };

          audio.onerror = () => {
            speakWithBrowser(text);
          };

          await audio.play();
          return;
        }
      }
    } catch {
      // Fall through to browser speech synthesis
    }

    // High quality resilient browser voice fallback
    speakWithBrowser(text);
  };

  // Play Uma's voice intro
  const handlePlayIntro = () => {
    const introText =
      "Hello! I am Uma, Enara Pagarizabal's personal voice representative. I speak English with an American accent and Spanish with a European accent. I am delighted to present Enara's background in marketing, customer experience, her dual degree at Deusto Business School, and her Galope 7 equestrian discipline. Would you like to converse in English or en español?";
    handlePlayTts(introText);
  };

  // Send textual inquiry to Uma & generate voice reply
  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isSending) return;

    // Proactively unlock speech synthesis in direct user flow
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.resume();
      } catch {}
    }

    const userMessage: MessageItem = {
      id: `msg-${Date.now()}`,
      role: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsSending(true);
    setStatusText('Uma is formulating a response...');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text.trim(),
          history: messages.slice(-6),
        }),
      });

      const contentType = res.headers.get('content-type') || '';
      if (!res.ok || !contentType.includes('application/json')) {
        throw new Error(`Chat API unavailable (${res.status})`);
      }

      const data = await res.json();
      const replyText = data.reply || generateUmaFallbackReply(text.trim());

      const assistantMessage: MessageItem = {
        id: `asst-${Date.now()}`,
        role: 'assistant',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setStatusText('Uma has answered.');

      // Automatically speak the response in soft woman voice
      handlePlayTts(replyText);
    } catch (err) {
      console.warn('API error, using intelligent client-side Uma response:', err);
      const fallbackReply = generateUmaFallbackReply(text.trim());

      const assistantMessage: MessageItem = {
        id: `asst-${Date.now()}`,
        role: 'assistant',
        text: fallbackReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setStatusText('Uma has answered.');

      // CRITICAL FIX: ALWAYS SPEAK THE RESPONSE EVEN ON API FALLBACK!
      handlePlayTts(fallbackReply);
    } finally {
      setIsSending(false);
    }
  };

  // Toggle Push-to-Talk Voice Speech Input
  const handleToggleVoiceSpeech = () => {
    if (!voiceManagerRef.current) return;
    stopCurrentTts();

    // Ensure audio engines are resumed upon direct user touch/click
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.resume();
      } catch {}
    }

    if (isListeningToUser) {
      voiceManagerRef.current.stopListening();
      setIsListeningToUser(false);
      setStatusText('Processing your speech...');
      return;
    }

    // Stop live streaming mode if active
    if (isLiveActive) {
      stopLiveSession();
    }

    setErrorMessage(null);
    setMicPermissionDenied(false);

    voiceManagerRef.current.startListening(
      {
        onStart: () => {
          setIsListeningToUser(true);
          setVoiceInterimText('');
          setStatusText('Listening to you... Speak now in English or Spanish.');
        },
        onInterimText: (text) => {
          setVoiceInterimText(text);
          setStatusText(`Hearing: "${text}"`);
        },
        onFinalText: (text) => {
          setIsListeningToUser(false);
          setVoiceInterimText('');
          handleSendMessage(text);
        },
        onError: (err) => {
          setIsListeningToUser(false);
          setVoiceInterimText('');
          if (err.toLowerCase().includes('denied') || err.toLowerCase().includes('permission')) {
            setMicPermissionDenied(true);
          }
          setErrorMessage(err);
          setStatusText('Could not capture voice. Click "Tap to Speak" to retry.');
        },
        onEnd: () => {
          setIsListeningToUser(false);
        },
      },
      'auto'
    );
  };

  // Start Live Gemini Voice Session via WebSocket
  const startLiveSession = async () => {
    setErrorMessage(null);
    setIsConnecting(true);
    setStatusText('Connecting to microphone and Gemini Live API...');
    stopCurrentTts();

    if (isListeningToUser && voiceManagerRef.current) {
      voiceManagerRef.current.stopListening();
      setIsListeningToUser(false);
    }

    let stream: MediaStream | null = null;
    try {
      if (!navigator?.mediaDevices?.getUserMedia) {
        setIsConnecting(false);
        setMicPermissionDenied(true);
        setStatusText('Use "Tap to Speak" to converse with Uma.');
        setErrorMessage('Microphone stream is not supported in this browser window. You can use Tap to Speak below.');
        return;
      }

      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = stream;
      setMicPermissionDenied(false);
    } catch {
      setIsConnecting(false);
      setIsLiveActive(false);
      setMicPermissionDenied(true);
      setStatusText('Microphone permission required. Tap to retry or use Voice Q&A.');
      setErrorMessage(
        'Microphone permission is restricted by your browser window. Please allow microphone access or use Tap to Speak.'
      );
      return;
    }

    try {
      // Setup 16kHz input AudioContext for speech capture
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const inputCtx = new AudioCtx({ sampleRate: 16000 });
      inputAudioCtxRef.current = inputCtx;
      if (inputCtx.state === 'suspended') {
        await inputCtx.resume();
      }

      // Initialize output player for 24kHz stream
      if (livePlayerRef.current) {
        livePlayerRef.current.init();
      }

      // Connect WebSocket to /ws/live
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/ws/live`;
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        setIsConnecting(false);
        setIsLiveActive(true);
        setStatusText('Connected to Uma. Speak naturally in English or Spanish.');

        // Setup microphone audio processing pipeline
        const source = inputCtx.createMediaStreamSource(stream!);
        const processor = inputCtx.createScriptProcessor(4096, 1, 1);
        processorRef.current = processor;

        source.connect(processor);
        processor.connect(inputCtx.destination);

        processor.onaudioprocess = (e) => {
          if (ws.readyState !== WebSocket.OPEN) return;
          const inputData = e.inputBuffer.getChannelData(0);

          let sum = 0;
          for (let i = 0; i < inputData.length; i++) {
            sum += inputData[i] * inputData[i];
          }
          const rms = Math.sqrt(sum / inputData.length);
          const isSpeakingNow = rms > 0.02;
          setIsUserSpeaking(isSpeakingNow);

          const base64Chunk = float32To16BitPCMBase64(inputData);
          ws.send(JSON.stringify({ audio: base64Chunk }));
        };
      };

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);

          if (msg.type === 'audio' && msg.audio) {
            setIsModelSpeaking(true);
            setStatusText('Uma is speaking...');
            if (livePlayerRef.current) {
              livePlayerRef.current.playChunk(msg.audio);
            }

            if (modelSpeechTimerRef.current) clearTimeout(modelSpeechTimerRef.current);
            modelSpeechTimerRef.current = setTimeout(() => {
              if (livePlayerRef.current && !livePlayerRef.current.getPlaybackState()) {
                setIsModelSpeaking(false);
                setStatusText('Uma is listening...');
              }
            }, 1200);
          }

          if (msg.type === 'transcript') {
            setMessages((prev) => {
              const last = prev[prev.length - 1];
              if (last && last.role === 'assistant' && last.id.startsWith('live-turn-')) {
                return [
                  ...prev.slice(0, -1),
                  { ...last, text: last.text + ' ' + msg.text },
                ];
              } else {
                return [
                  ...prev,
                  {
                    id: `live-turn-${Date.now()}`,
                    role: 'assistant',
                    text: msg.text,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                  },
                ];
              }
            });
          }

          if (msg.type === 'interrupted') {
            if (livePlayerRef.current) {
              livePlayerRef.current.stopAndClear();
            }
            setIsModelSpeaking(false);
            setStatusText('Listening to you...');
          }

          if (msg.type === 'turnComplete') {
            setTimeout(() => {
              if (livePlayerRef.current && !livePlayerRef.current.getPlaybackState()) {
                setIsModelSpeaking(false);
                setStatusText('Uma is listening...');
              }
            }, 600);
          }

          if (msg.type === 'error') {
            setStatusText('Voice mode ready. You can ask questions with voice playback below.');
          }
        } catch {
          // ignore parsing error
        }
      };

      ws.onerror = () => {
        stopLiveSession();
        setStatusText('Voice mode ready. Tap to Speak.');
      };

      ws.onclose = () => {
        setIsLiveActive(false);
        setIsConnecting(false);
        setStatusText('Live call ended. Click "Tap to Speak" anytime.');
      };
    } catch {
      setIsConnecting(false);
      setIsLiveActive(false);
      setStatusText('Voice mode active. Tap to Speak.');
    }
  };

  // Stop live voice session
  const stopLiveSession = () => {
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach((track) => track.stop());
      micStreamRef.current = null;
    }
    if (inputAudioCtxRef.current) {
      inputAudioCtxRef.current.close().catch(() => {});
      inputAudioCtxRef.current = null;
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    if (livePlayerRef.current) {
      livePlayerRef.current.stopAndClear();
    }
    setIsLiveActive(false);
    setIsConnecting(false);
    setIsUserSpeaking(false);
    setIsModelSpeaking(false);
    setStatusText('Uma is ready. Click "Tap to Speak" to ask your question.');
  };

  // Trigger inquiry from portfolio tabs
  const handleAskAboutTopic = (question: string) => {
    setActiveTab('voice');
    handleSendMessage(question);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0c0d0e] text-[#f4f4f5]">
      {/* Top Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isLiveActive={isLiveActive}
        onOpenCvModal={() => setIsCvModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {activeTab === 'voice' ? (
          <div className="space-y-8">
            {/* Top Minimalist Tagline */}
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs uppercase tracking-widest text-amber-300 font-semibold">
                Bilingual Voice Representative
              </span>
              <h1 className="text-2xl sm:text-3xl font-serif text-white tracking-tight">
                Speak with Uma about Enara Pagarizabal
              </h1>
              <p className="text-xs sm:text-sm text-zinc-400 font-light leading-relaxed">
                Tap the microphone orb to speak your question in English or Spanish. Uma replies out loud in a soft woman voice with American accent for English and Spanish accent for Spanish.
              </p>
            </div>

            {/* Split Grid: Left Voice Orb / Right Conversation & Inquiries */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Voice Orb & Audio Controls (5 cols) */}
              <div className="lg:col-span-5 flex flex-col gap-6 sticky top-24">
                <VoiceOrb
                  isLiveActive={isLiveActive}
                  isConnecting={isConnecting}
                  isModelSpeaking={isModelSpeaking}
                  isUserSpeaking={isUserSpeaking}
                  isListeningToUser={isListeningToUser}
                  errorMessage={errorMessage}
                  micPermissionDenied={micPermissionDenied}
                  onToggleVoiceSpeech={handleToggleVoiceSpeech}
                  onStartLive={startLiveSession}
                  onStopLive={stopLiveSession}
                  onPlayIntro={handlePlayIntro}
                  onClearError={() => {
                    setErrorMessage(null);
                    setMicPermissionDenied(false);
                  }}
                  statusText={statusText}
                />

                {/* Quick Profile Summary Card */}
                <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="text-xs font-serif text-zinc-200">
                      Enara Pagarizabal Ruiz
                    </div>
                    <div className="text-[11px] text-zinc-400">
                      ADE + Digital Business Intelligence • Deusto
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveTab('profile')}
                    className="flex items-center gap-1 text-xs text-amber-300 hover:text-amber-200 transition-colors font-medium cursor-pointer"
                  >
                    <span>View CV</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Right Column: Transcript, Dialogue & Suggested Topics (7 cols) */}
              <div className="lg:col-span-7 flex flex-col gap-4">
                <ConversationPanel
                  messages={messages}
                  onSendMessage={handleSendMessage}
                  onPlayTts={handlePlayTts}
                  onToggleVoiceInput={handleToggleVoiceSpeech}
                  isListeningToUser={isListeningToUser}
                  voiceInterimText={voiceInterimText}
                  isSending={isSending}
                  activePlayingText={activePlayingText}
                  onClearHistory={() =>
                    setMessages([
                      {
                        id: 'reset-1',
                        role: 'assistant',
                        text: "Conversation reset. You can ask me any question about Enara's experience, certifications, or leadership in English or Spanish.",
                        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                      },
                    ])
                  }
                />
              </div>
            </div>
          </div>
        ) : (
          <ResumePortfolio
            onAskUma={handleAskAboutTopic}
            onOpenCvModal={() => setIsCvModalOpen(true)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-white/[0.06] bg-[#090a0b] py-6 text-xs text-zinc-500">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-serif text-amber-200 font-medium">Uma</span>
            <span>•</span>
            <span>Enara Pagarizabal's Voice Assistant</span>
          </div>

          <div className="flex items-center gap-4 text-zinc-400">
            <span>Bilbao, Spain</span>
            <span>•</span>
            <a
              href={`mailto:${ENARA_PROFILE.email}`}
              className="hover:text-amber-300 transition-colors"
            >
              {ENARA_PROFILE.email}
            </a>
            <span>•</span>
            <button
              onClick={() => setIsCvModalOpen(true)}
              className="hover:text-amber-300 transition-colors cursor-pointer"
            >
              Curriculum PDF
            </button>
          </div>
        </div>
      </footer>

      {/* PDF Modal */}
      <PdfViewerModal
        isOpen={isCvModalOpen}
        onClose={() => setIsCvModalOpen(false)}
      />
    </div>
  );
}
