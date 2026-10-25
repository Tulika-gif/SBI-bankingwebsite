import React, { useState } from 'react';
import { useVoiceBanking } from '../hooks/useVoiceBanking';
import { useAccessibility } from '../context/AccessibilityContext';
import { useBanking } from '../context/BankingContext';
import { SUPPORTED_LANGUAGES, SAMPLE_VOICE_COMMANDS } from '../data/mockData';
import {
  Mic,
  MicOff,
  Square,
  Volume2,
  Globe,
  Sliders,
  Type,
  Eye,
  EyeOff,
  Sparkles,
  Keyboard,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Send,
  MessageSquare,
  HelpCircle,
} from 'lucide-react';

export const Help: React.FC = () => {
  const {
    isListening,
    isProcessing,
    transcript,
    lastResponse,
    errorMessage,
    isSupported,
    selectedLanguage,
    setSelectedLanguage,
    startListening,
    stopListening,
    processCommand,
    speakText,
  } = useVoiceBanking();

  const {
    settings,
    setTextSize,
    toggleHighContrast,
    toggleScreenReaderOptimized,
    toggleReducedMotion,
    toggleVoiceFeedback,
    setIsKeyboardGuideOpen,
    announce,
  } = useAccessibility();

  const { formatCurrency } = useBanking();
  const [textCommandInput, setTextCommandInput] = useState('');

  const currentLangObj =
    SUPPORTED_LANGUAGES.find((l) => l.code === selectedLanguage) ||
    SUPPORTED_LANGUAGES[0];

  const handleLanguageChange = (code: string) => {
    setSelectedLanguage(code);
    const lang = SUPPORTED_LANGUAGES.find((l) => l.code === code);
    if (lang) {
      announce(`Language switched to ${lang.label}`);
      speakText(lang.greeting, code);
    }
  };

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textCommandInput.trim()) return;
    processCommand(textCommandInput.trim());
    setTextCommandInput('');
  };

  const handleSampleClick = (cmd: string) => {
    announce(`Executing command: ${cmd}`);
    processCommand(cmd);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Page Title */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EDF5FF] text-[#1458F5] text-xs font-bold border border-[#DCE8FA] mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>SIGNATURE ACCESSIBILITY</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#082B78] tracking-tight">
          Voice Banking & Support
        </h1>
        <p className="text-sm font-semibold text-[#1458F5] mt-1">
          Banking, now in your voice.
        </p>
        <p className="text-xs text-[#64748B] max-w-2xl mt-1 leading-relaxed">
          Ask, speak, get things done. Our voice assistant helps you navigate the experience in your preferred language without complex manual navigation.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Voice Assistant Panel (Oversized Mic, Rings, Waveforms) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl border border-[#DCE8FA] p-8 shadow-xs text-center space-y-6 relative overflow-hidden">
            {/* Language Selector Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-[#F5F8FF] rounded-2xl border border-[#DCE8FA]">
              <div className="flex items-center gap-2 text-xs font-bold text-[#082B78]">
                <Globe className="w-4 h-4 text-[#1458F5]" />
                <span>Voice Language:</span>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => handleLanguageChange(lang.code)}
                    className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-colors ${
                      selectedLanguage === lang.code
                        ? 'bg-[#1458F5] text-white shadow-xs'
                        : 'bg-white text-[#64748B] hover:text-[#102451] border border-[#DCE8FA]'
                    }`}
                  >
                    {lang.native}
                  </button>
                ))}
              </div>
            </div>

            {/* Concentric Microphone Ring Visualizer */}
            <div className="py-6 flex flex-col items-center justify-center relative">
              {/* Outer Pulse Rings (visible when listening) */}
              <div
                className={`absolute w-64 h-64 rounded-full border-2 border-blue-200 transition-all duration-700 pointer-events-none ${
                  isListening ? 'scale-110 opacity-70 animate-ping' : 'opacity-20'
                }`}
              />
              <div
                className={`absolute w-48 h-48 rounded-full border-4 border-blue-300 transition-all duration-500 pointer-events-none ${
                  isListening ? 'scale-105 opacity-80' : 'opacity-40'
                }`}
              />
              <div
                className={`absolute w-36 h-36 rounded-full bg-[#EDF5FF] transition-all duration-300 pointer-events-none ${
                  isListening ? 'scale-110' : ''
                }`}
              />

              {/* Oversized Royal-Blue Microphone Button */}
              <button
                type="button"
                onClick={isListening ? stopListening : startListening}
                className={`relative z-10 w-24 h-24 sm:w-28 sm:h-28 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl focus:outline-hidden focus:ring-4 focus:ring-[#1458F5]/40 ${
                  isListening
                    ? 'bg-rose-600 hover:bg-rose-700 text-white scale-105 ring-4 ring-rose-300 animate-pulse'
                    : isProcessing
                    ? 'bg-amber-600 text-white'
                    : 'bg-[#1458F5] hover:bg-[#082B78] text-white hover:scale-105'
                }`}
                aria-label={
                  isListening
                    ? 'Stop listening to voice command'
                    : 'Activate microphone and speak banking command'
                }
              >
                {isListening ? (
                  <Square className="w-9 h-9 fill-current" />
                ) : (
                  <Mic className="w-10 h-10 sm:w-12 sm:h-12" />
                )}
              </button>

              {/* Status Text */}
              <div className="mt-8 space-y-1">
                <span className="text-base sm:text-lg font-extrabold text-[#082B78] block">
                  {isListening
                    ? 'Listening... Speak now'
                    : isProcessing
                    ? 'Understanding your request...'
                    : 'Tap microphone to speak or say a command'}
                </span>
                <p className="text-xs text-[#64748B]">
                  {isListening
                    ? 'Tap the red button anytime to stop recording'
                    : `Active Language: ${currentLangObj.label}`}
                </p>
              </div>

              {/* Waveform indicator */}
              {isListening && (
                <div className="flex items-center gap-1.5 mt-4" aria-label="Audio level visualizer">
                  {[12, 28, 44, 20, 36, 48, 24, 16, 32].map((height, i) => (
                    <span
                      key={i}
                      className="w-1.5 bg-[#1458F5] rounded-full animate-bounce"
                      style={{
                        height: `${height}px`,
                        animationDelay: `${i * 80}ms`,
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Error or Browser Warning fallback */}
            {errorMessage && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 text-left flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Fallback Text Input for full keyboard / non-mic users */}
            <form onSubmit={handleTextSubmit} className="pt-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={textCommandInput}
                  onChange={(e) => setTextCommandInput(e.target.value)}
                  placeholder='Or type a command, e.g. "Check my balance", "Transfer money"'
                  className="flex-1 px-4 py-2.5 text-xs bg-[#F5F8FF] border border-[#DCE8FA] rounded-xl text-[#102451] focus:outline-hidden focus:ring-2 focus:ring-[#1458F5]"
                  aria-label="Text command fallback input"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-[#1458F5] hover:bg-[#082B78] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors shadow-2xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Execute</span>
                </button>
              </div>
            </form>

            {/* Sample Clickable Command Chips */}
            <div className="pt-4 border-t border-[#DCE8FA] text-left">
              <span className="text-xs font-bold text-[#64748B] block mb-2">
                Try clicking a sample voice command:
              </span>
              <div className="flex flex-wrap gap-2">
                {SAMPLE_VOICE_COMMANDS.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSampleClick(item.command)}
                    className="px-3 py-1.5 bg-[#EDF5FF] hover:bg-[#1458F5] hover:text-white text-[#1458F5] text-xs font-semibold rounded-xl border border-[#DCE8FA] transition-all flex items-center gap-1.5 group"
                  >
                    <MessageSquare className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100" />
                    <span>"{item.command}"</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Assistant Response Box */}
            {lastResponse && (
              <div className="p-5 rounded-2xl bg-[#F5F8FF] border border-[#1458F5]/40 text-left space-y-3 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <h4 className="text-sm font-bold text-[#082B78]">
                      {lastResponse.displayTitle}
                    </h4>
                  </div>
                  <button
                    type="button"
                    onClick={() => speakText(lastResponse.spokenText)}
                    className="text-xs text-[#1458F5] hover:underline flex items-center gap-1 font-bold"
                    aria-label="Repeat assistant spoken audio response"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>Repeat Audio</span>
                  </button>
                </div>

                <p className="text-xs text-[#102451] leading-relaxed">
                  {lastResponse.displayContent}
                </p>

                {/* Additional interactive data payload */}
                {lastResponse.dataSnippet?.accounts && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2">
                    {lastResponse.dataSnippet.accounts.map((acc: any, i: number) => (
                      <div key={i} className="p-2.5 bg-white rounded-xl border border-[#DCE8FA] text-xs">
                        <span className="text-[#64748B] text-[10px] block">{acc.name}</span>
                        <span className="font-extrabold text-[#082B78] tabular-nums font-mono">{acc.balance}</span>
                      </div>
                    ))}
                  </div>
                )}

                {lastResponse.dataSnippet?.transactions && (
                  <div className="space-y-1.5 pt-2">
                    {lastResponse.dataSnippet.transactions.map((tx: any, i: number) => (
                      <div key={i} className="p-2 bg-white rounded-lg border border-[#DCE8FA] text-xs flex justify-between">
                        <span className="text-[#102451] line-clamp-1">{tx.description}</span>
                        <span className="font-bold text-[#082B78] tabular-nums shrink-0 ml-2 font-mono">{formatCurrency(tx.amount)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Full Accessibility Controls & Guidelines */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl border border-[#DCE8FA] p-6 shadow-xs space-y-6">
            <div className="flex items-center gap-2 pb-3 border-b border-[#DCE8FA]">
              <div className="w-8 h-8 rounded-lg bg-[#EDF5FF] text-[#1458F5] flex items-center justify-center border border-[#DCE8FA]">
                <Sliders className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#082B78]">Accessibility Controls</h3>
                <p className="text-xs text-[#64748B]">Personalize your visual and cognitive comfort</p>
              </div>
            </div>

            {/* 1. Text Size Scaling */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#102451] flex items-center gap-1.5">
                <Type className="w-4 h-4 text-[#1458F5]" />
                <span>Text Sizing Scale</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'normal', label: 'Standard (A-)' },
                  { id: 'large', label: 'Large (A)' },
                  { id: 'larger', label: 'Extra Large (A+)' },
                ].map((size) => (
                  <button
                    key={size.id}
                    type="button"
                    onClick={() => setTextSize(size.id as any)}
                    className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all text-center ${
                      settings.textSize === size.id
                        ? 'bg-[#1458F5] text-white border-[#1458F5] shadow-xs'
                        : 'bg-[#F5F8FF] hover:bg-[#EDF5FF] text-[#102451] border-[#DCE8FA]'
                    }`}
                  >
                    {size.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. High Contrast Mode Toggle */}
            <div className="flex items-center justify-between p-3.5 bg-[#F5F8FF] rounded-2xl border border-[#DCE8FA]">
              <div>
                <h4 className="text-xs font-bold text-[#102451]">High Contrast Mode</h4>
                <p className="text-[11px] text-[#64748B]">Boosts contrast ratio beyond WCAG AAA standards</p>
              </div>
              <button
                type="button"
                onClick={toggleHighContrast}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                  settings.highContrast ? 'bg-black' : 'bg-slate-300'
                }`}
                aria-pressed={settings.highContrast}
                aria-label="Toggle high contrast mode"
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    settings.highContrast ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* 3. Screen Reader Friendly Mode */}
            <div className="flex items-center justify-between p-3.5 bg-[#F5F8FF] rounded-2xl border border-[#DCE8FA]">
              <div>
                <h4 className="text-xs font-bold text-[#102451]">Screen Reader Optimizer</h4>
                <p className="text-[11px] text-[#64748B]">Enhanced semantic ARIA live tags & announcements</p>
              </div>
              <button
                type="button"
                onClick={toggleScreenReaderOptimized}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                  settings.screenReaderOptimized ? 'bg-[#1458F5]' : 'bg-slate-300'
                }`}
                aria-pressed={settings.screenReaderOptimized}
                aria-label="Toggle screen reader optimization"
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    settings.screenReaderOptimized ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* 4. Reduced Motion Option */}
            <div className="flex items-center justify-between p-3.5 bg-[#F5F8FF] rounded-2xl border border-[#DCE8FA]">
              <div>
                <h4 className="text-xs font-bold text-[#102451]">Reduced Motion</h4>
                <p className="text-[11px] text-[#64748B]">Disables all page transitions and waveform animations</p>
              </div>
              <button
                type="button"
                onClick={toggleReducedMotion}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                  settings.reducedMotion ? 'bg-[#1458F5]' : 'bg-slate-300'
                }`}
                aria-pressed={settings.reducedMotion}
                aria-label="Toggle reduced motion"
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    settings.reducedMotion ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* 5. Voice Audio Readout */}
            <div className="flex items-center justify-between p-3.5 bg-[#F5F8FF] rounded-2xl border border-[#DCE8FA]">
              <div>
                <h4 className="text-xs font-bold text-[#102451]">Audio Voice Feedback</h4>
                <p className="text-[11px] text-[#64748B]">Audibly reads notifications and page actions</p>
              </div>
              <button
                type="button"
                onClick={toggleVoiceFeedback}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                  settings.voiceFeedback ? 'bg-[#1458F5]' : 'bg-slate-300'
                }`}
                aria-pressed={settings.voiceFeedback}
                aria-label="Toggle voice feedback"
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    settings.voiceFeedback ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Keyboard Guidance Button */}
            <button
              type="button"
              onClick={() => setIsKeyboardGuideOpen(true)}
              className="w-full py-3 bg-[#EDF5FF] hover:bg-[#DCE8FA] text-[#082B78] rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 border border-[#DCE8FA]"
            >
              <Keyboard className="w-4 h-4 text-[#1458F5]" />
              <span>Open Keyboard Navigation Shortcuts</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
