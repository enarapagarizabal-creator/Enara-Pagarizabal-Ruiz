import React, { useState } from 'react';
import { Volume2, Send, Sparkles, User, RotateCcw, HelpCircle, Loader2, Mic, MicOff } from 'lucide-react';
import { ENARA_PROFILE } from '../data/enaraProfile.ts';

export interface MessageItem {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
  audioBase64?: string;
}

interface ConversationPanelProps {
  messages: MessageItem[];
  onSendMessage: (text: string) => void;
  onPlayTts: (text: string) => void;
  onToggleVoiceInput: () => void;
  isListeningToUser: boolean;
  voiceInterimText: string;
  isSending: boolean;
  activePlayingText: string | null;
  onClearHistory: () => void;
}

export const ConversationPanel: React.FC<ConversationPanelProps> = ({
  messages,
  onSendMessage,
  onPlayTts,
  onToggleVoiceInput,
  isListeningToUser,
  voiceInterimText,
  isSending,
  activePlayingText,
  onClearHistory,
}) => {
  const [inputText, setInputText] = useState('');
  const [promptLanguage, setPromptLanguage] = useState<'both' | 'en' | 'es'>('both');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isSending) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  const filteredQuestions = ENARA_PROFILE.sampleQuestions;

  return (
    <div className="flex flex-col h-full bg-[#121316]/70 border border-white/[0.08] rounded-2xl overflow-hidden backdrop-blur-md">
      {/* Header */}
      <div className="px-5 py-3.5 border-b border-white/[0.06] flex items-center justify-between bg-white/[0.02]">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-medium text-white tracking-wide">Spoken Transcript & Dialogue</h3>
        </div>

        <div className="flex items-center gap-2">
          {messages.length > 0 && (
            <button
              onClick={onClearHistory}
              className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-zinc-200 px-2 py-1 rounded bg-white/[0.04] hover:bg-white/[0.08] transition-colors cursor-pointer"
              title="Reset conversation"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Clear</span>
            </button>
          )}
        </div>
      </div>

      {/* Suggested Quick Inquiries / Questions */}
      <div className="px-4 py-3 bg-white/[0.015] border-b border-white/[0.04]">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-medium">
            <HelpCircle className="w-3.5 h-3.5 text-amber-300" />
            <span>Suggested Inquiries for Uma:</span>
          </div>

          <div className="flex items-center gap-1 text-[11px]">
            <button
              onClick={() => setPromptLanguage('both')}
              className={`px-1.5 py-0.5 rounded cursor-pointer ${
                promptLanguage === 'both' ? 'text-amber-200 bg-amber-500/20' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setPromptLanguage('en')}
              className={`px-1.5 py-0.5 rounded cursor-pointer ${
                promptLanguage === 'en' ? 'text-amber-200 bg-amber-500/20' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setPromptLanguage('es')}
              className={`px-1.5 py-0.5 rounded cursor-pointer ${
                promptLanguage === 'es' ? 'text-amber-200 bg-amber-500/20' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              ES
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {filteredQuestions.map((q, idx) => {
            const displayPrompt =
              promptLanguage === 'es' ? q.es : promptLanguage === 'en' ? q.en : q.en;
            return (
              <button
                key={idx}
                onClick={() => onSendMessage(displayPrompt)}
                disabled={isSending}
                className="shrink-0 text-left text-xs text-zinc-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] hover:border-amber-500/30 border border-white/[0.06] rounded-lg px-3 py-1.5 transition-all max-w-[280px] truncate cursor-pointer disabled:opacity-50"
                title={displayPrompt}
              >
                <span className="text-amber-300/80 mr-1.5 text-[10px] uppercase font-semibold">
                  {q.category}
                </span>
                {displayPrompt}
              </button>
            );
          })}
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 min-h-[280px] max-h-[420px]">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-10 text-zinc-400">
            <div className="w-12 h-12 rounded-full bg-white/[0.04] border border-white/[0.06] flex items-center justify-center mb-3 text-amber-300">
              <Sparkles className="w-5 h-5" />
            </div>
            <p className="text-sm font-medium text-zinc-200">Say hello or speak to Uma</p>
            <p className="text-xs text-zinc-400 max-w-sm mt-1">
              Tap the microphone to speak your question in English or Spanish, or choose a topic above.
            </p>
          </div>
        ) : (
          messages.map((msg) => {
            const isAssistant = msg.role === 'assistant';
            const isPlayingThis = activePlayingText === msg.text;

            return (
              <div
                key={msg.id}
                className={`flex gap-3 text-sm ${
                  isAssistant ? 'items-start' : 'items-start flex-row-reverse'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 border text-xs font-serif ${
                    isAssistant
                      ? 'bg-amber-500/15 border-amber-500/30 text-amber-200'
                      : 'bg-zinc-800 border-white/10 text-zinc-300'
                  }`}
                >
                  {isAssistant ? 'U' : <User className="w-3.5 h-3.5" />}
                </div>

                <div
                  className={`relative group max-w-[85%] sm:max-w-[78%] rounded-2xl px-4 py-3 ${
                    isAssistant
                      ? 'bg-white/[0.05] border border-white/[0.08] text-zinc-200 rounded-tl-sm'
                      : 'bg-amber-500/15 border border-amber-500/25 text-amber-100 rounded-tr-sm'
                  }`}
                >
                  <p className="whitespace-pre-line leading-relaxed text-[13px] sm:text-sm">
                    {msg.text}
                  </p>

                  <div className="mt-2 pt-1 border-t border-white/[0.05] flex items-center justify-between text-[11px] text-zinc-400">
                    <span>{msg.timestamp}</span>

                    {isAssistant && (
                      <button
                        onClick={() => onPlayTts(msg.text)}
                        className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] transition-colors cursor-pointer ${
                          isPlayingThis
                            ? 'text-amber-300 bg-amber-500/20'
                            : 'text-zinc-400 hover:text-amber-200 hover:bg-white/[0.06]'
                        }`}
                        title="Listen to Uma's voice"
                      >
                        <Volume2 className={`w-3 h-3 ${isPlayingThis ? 'animate-pulse' : ''}`} />
                        <span>{isPlayingThis ? 'Speaking...' : 'Listen Voice'}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}

        {/* Live speech feedback when user is speaking */}
        {isListeningToUser && (
          <div className="flex gap-3 items-center text-amber-300 text-xs p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 animate-pulse">
            <Mic className="w-4 h-4 shrink-0 text-amber-400 animate-bounce" />
            <div className="flex-1">
              <span className="font-medium">Listening to your voice... </span>
              <span className="text-zinc-300 italic">
                {voiceInterimText ? `"${voiceInterimText}"` : 'Speak now in English or Spanish...'}
              </span>
            </div>
            <button
              onClick={onToggleVoiceInput}
              className="text-[11px] font-semibold text-rose-300 hover:underline px-2 py-0.5 rounded bg-rose-500/20 cursor-pointer"
            >
              Done Speaking
            </button>
          </div>
        )}

        {isSending && (
          <div className="flex gap-3 items-center text-zinc-400 text-xs italic">
            <div className="w-7 h-7 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-300" />
            </div>
            <span>Uma is formulating an answer in her soft woman voice...</span>
          </div>
        )}
      </div>

      {/* Input bar with Speak Microphone button */}
      <form onSubmit={handleSubmit} className="p-3 border-t border-white/[0.06] bg-black/40">
        <div className="flex items-center gap-2 bg-white/[0.04] border border-white/[0.08] focus-within:border-amber-400/50 rounded-xl px-3 py-1.5 transition-all">
          {/* Microphone Push-To-Talk Button */}
          <button
            type="button"
            onClick={onToggleVoiceInput}
            className={`p-2 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              isListeningToUser
                ? 'bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/30 animate-pulse'
                : 'text-amber-300 hover:text-amber-200 hover:bg-amber-500/20 bg-amber-500/10'
            }`}
            title={isListeningToUser ? 'Click to stop listening' : 'Click to speak to Uma with your microphone'}
          >
            {isListeningToUser ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            <span className="text-xs font-medium hidden sm:inline">
              {isListeningToUser ? 'Listening...' : 'Speak'}
            </span>
          </button>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              isListeningToUser
                ? 'Listening to you speak...'
                : 'Speak with the microphone or type here...'
            }
            className="flex-1 bg-transparent text-sm text-white placeholder-zinc-500 focus:outline-none"
            disabled={isSending}
          />

          <button
            type="submit"
            disabled={!inputText.trim() || isSending}
            className="p-2 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 disabled:opacity-40 disabled:hover:bg-transparent transition-all cursor-pointer"
            title="Send text"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
