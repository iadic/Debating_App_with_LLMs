import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAppContext } from '../context/AppContext';
import { CharacterIcon } from '../components/CharacterIcon';
import { Mic, Volume2, VolumeX, Home, ArrowLeft, Square, Flag } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: Date;
  audioBlob?: Blob;   // the raw webm the user recorded (for replay)
  audioUrl?: string | null; // object URL of the WAV returned by the model
}

// Decode base64 WAV → playable object URL
function b64ToAudioUrl(b64: string): string {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  const blob = new Blob([bytes.buffer], { type: 'audio/wav' });
  return URL.createObjectURL(blob);
}

// Stop whatever is playing, then play a new URL
function playAudio(
  url: string,
  audioRef: React.MutableRefObject<HTMLAudioElement | null>,
  onEnded: () => void
) {
  if (audioRef.current) {
    audioRef.current.pause();
    audioRef.current = null;
  }
  const audio = new Audio(url);
  audioRef.current = audio;
  audio.onended = onEnded;
  audio.play().catch(console.error);
}

export default function OnlyVoiceModalityPage() {
  const navigate = useNavigate();
  const { state } = useAppContext();

  const greetingText = `Hello! I'm your Debate Partner. You chose ${getLevelDescription(state.selectedLevel)}. Let's debate: "${state.debateTopic}". Shall we start?`;

  const [messages, setMessages]               = useState<Message[]>([
    { id: '1', sender: 'ai', text: greetingText, timestamp: new Date() },
  ]);
  const [isRecording, setIsRecording]         = useState(false);
  const [isProcessing, setIsProcessing]       = useState(false);
  const [activeCharacter, setActiveCharacter] = useState<'ai' | 'user' | null>('ai');
  const [challengeMode, setChallengeMode]     = useState(false);
  const [aiAudioMuted, setAiAudioMuted]       = useState(false);
  const [userAudioMuted, setUserAudioMuted]   = useState(false);

  const messagesEndRef   = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef   = useRef<Blob[]>([]);
  const currentAudioRef  = useRef<HTMLAudioElement | null>(null);
  const clickTimeoutRef  = useRef<NodeJS.Timeout | null>(null);
  const lightningTimersRef = useRef<number[]>([]);
  const [lightningActive, setLightningActive] = useState(false);
  const [flashOn, setFlashOn] = useState(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ── Play the greeting on mount via /text_tts ──────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('http://localhost:8000/text_tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: greetingText, voice: state.selectedVoice || 'alloy' }),
        });
        if (!res.ok) throw new Error(`text_tts ${res.status}`);
        const data = await res.json();
        if (!data.audio_base64) throw new Error('No audio_base64');
        const url = b64ToAudioUrl(data.audio_base64);
        setMessages(prev => prev.map((m, i) => i === 0 ? { ...m, audioUrl: url } : m));
        setActiveCharacter('ai');
        playAudio(url, currentAudioRef, () => {
          setActiveCharacter(null);
          currentAudioRef.current = null;
        });
      } catch (e) {
        console.error('Greeting TTS failed:', e);
        setActiveCharacter(null);
      }
    })();
  }, []);

  // Lightning flash cycle: flash twice, then hide for ~60s
  useEffect(() => {
    let mounted = true;
    const timers: number[] = [];

    const runCycle = (initialDelay = 0) => {
      const tStart = window.setTimeout(() => {
        if (!mounted) return;
        // show and do two quick flashes
        setLightningActive(true);
        setFlashOn(true);
        const t1 = window.setTimeout(() => setFlashOn(false), 140);
        const t2 = window.setTimeout(() => setFlashOn(true), 360);
        const t3 = window.setTimeout(() => setFlashOn(false), 520);
        const tHide = window.setTimeout(() => setLightningActive(false), 700);
        timers.push(t1, t2, t3, tHide);

        // schedule next cycle after ~60s
        const tNext = window.setTimeout(() => runCycle(), 60000);
        timers.push(tNext);
      }, initialDelay);
      timers.push(tStart);
    };

    // start after a short delay so page settles
    runCycle(1200);

    return () => {
      mounted = false;
      timers.forEach(t => clearTimeout(t));
    };
  }, []);

  // ── Record / stop ─────────────────────────────────────────────────────────
  const handleVoiceInput = async () => {
    if (isRecording) {
      mediaRecorderRef.current?.stop();
      setIsRecording(false);
      setActiveCharacter(null);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      recorder.ondataavailable = e => audioChunksRef.current.push(e.data);

      recorder.onstop = () => {
        // Collect the webm blob the browser recorded
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        stream.getTracks().forEach(t => t.stop());

        // Add a placeholder user message while we wait for the server
        const userMsg: Message = {
          id: Date.now().toString(),
          sender: 'user',
          text: '🎤 You spoke…',   // no Whisper — we just show this
          timestamp: new Date(),
          audioBlob,               // kept so the replay button works
        };
        setMessages(prev => [...prev, userMsg]);

        // Send to backend: webm → pydub converts to mp3 → gpt-4o-mini-audio-preview
        (async () => {
          try {
            setIsProcessing(true);
            const form = new FormData();
            form.append('file', audioBlob, 'recording.webm');
            form.append('level', state.selectedLevel || '1');
            form.append('topic', state.debateTopic || '');
            form.append('voice', state.selectedVoice || 'alloy');

            const res = await fetch('http://localhost:8000/audio_chat', {
              method: 'POST',
              body: form,
            });
            if (!res.ok) {
              const detail = await res.text();
              throw new Error(`audio_chat ${res.status}: ${detail}`);
            }

            const data = await res.json();
            // data.ai_text  = the AI's reply as text  (for the chat bubble)
            // data.audio_base64 = base64 WAV of the AI's voice

            const audioUrl = data.audio_base64 ? b64ToAudioUrl(data.audio_base64) : null;

            const aiMsg: Message = {
              id: (Date.now() + 1).toString(),
              sender: 'ai',
              text: data.ai_text || '',
              timestamp: new Date(),
              audioUrl,
            };
            setMessages(prev => [...prev, aiMsg]);

            // Auto-play the AI's voice reply
            if (audioUrl && !aiAudioMuted) {
              setActiveCharacter('ai');
              playAudio(audioUrl, currentAudioRef, () => {
                setActiveCharacter(null);
                currentAudioRef.current = null;
              });
            }
          } catch (err) {
            console.error('audio_chat error:', err);
            setMessages(prev => [...prev, {
              id: 'err-' + Date.now(),
              sender: 'ai',
              text: `⚠️ ${String(err)}`,
              timestamp: new Date(),
            }]);
          } finally {
            setIsProcessing(false);
          }
        })();
      };

      recorder.start();
      setIsRecording(true);
      setActiveCharacter('user');
    } catch (err) {
      console.error('Mic error:', err);
      alert('Could not access microphone. Please grant permission.');
    }
  };

  // ── AI volume: single click = replay, double click = mute toggle ──────────
  const handleAIAudioClick = () => {
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
      clickTimeoutRef.current = null;
      if (!aiAudioMuted) {
        currentAudioRef.current?.pause();
        currentAudioRef.current = null;
        setActiveCharacter(null);
      }
      setAiAudioMuted(v => !v);
      return;
    }
    clickTimeoutRef.current = setTimeout(() => {
      clickTimeoutRef.current = null;
      if (aiAudioMuted) return;
      const last = [...messages].reverse().find(m => m.sender === 'ai' && m.audioUrl);
      if (last?.audioUrl) {
        setActiveCharacter('ai');
        playAudio(last.audioUrl, currentAudioRef, () => {
          setActiveCharacter(null);
          currentAudioRef.current = null;
        });
      }
    }, 250);
  };

  // ── User volume: single click = replay raw recording, double click = mute ─
  const handleUserAudioClick = () => {
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
      clickTimeoutRef.current = null;
      if (!userAudioMuted) {
        currentAudioRef.current?.pause();
        currentAudioRef.current = null;
        setActiveCharacter(null);
      }
      setUserAudioMuted(v => !v);
      return;
    }
    clickTimeoutRef.current = setTimeout(() => {
      clickTimeoutRef.current = null;
      if (userAudioMuted) return;
      const last = [...messages].reverse().find(m => m.sender === 'user' && m.audioBlob);
      if (last?.audioBlob) {
        const url = URL.createObjectURL(last.audioBlob);
        setActiveCharacter('user');
        playAudio(url, currentAudioRef, () => {
          setActiveCharacter(null);
          currentAudioRef.current = null;
          URL.revokeObjectURL(url);
        });
      }
    }, 250);
  };

  const handleEndDebate = () => navigate('/debate/summary', { state: { messages } });

  // ── Theme ──────────────────────────────────────────────────────────────────
  const dark = challengeMode && state.selectedLevel === '3';
  const bgGradient = dark ? 'from-gray-900 via-black to-gray-900' : 'from-blue-50 via-green-50 to-blue-100';
  const headerBg   = dark ? 'bg-gray-900/90' : 'bg-white/70';

  const lecternColor = (s: 'ai' | 'user') =>
    dark ? 'from-red-600 to-red-800'
         : s === 'ai' ? 'from-blue-200 to-blue-400' : 'from-green-200 to-green-400';

  const avatarGlow = (s: 'ai' | 'user', active: boolean) => {
    if (dark) return active
      ? 'from-red-500 via-red-600 to-red-700 ring-8 ring-red-500/50 shadow-2xl shadow-red-500/50'
      : 'from-gray-700 via-gray-800 to-gray-900 opacity-60';
    if (active) return s === 'ai'
      ? 'from-blue-400 via-blue-500 to-blue-600 ring-8 ring-blue-300 ring-opacity-50'
      : 'from-green-400 via-green-500 to-green-600 ring-8 ring-green-300 ring-opacity-50';
    return s === 'ai'
      ? 'from-blue-400/50 via-blue-500/50 to-blue-600/50'
      : 'from-green-400/50 via-green-500/50 to-green-600/50';
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${bgGradient} flex flex-col`}>
      {/* Header */}
      <div className={`${headerBg} backdrop-blur-md shadow-lg px-6 py-4 flex items-center justify-between`}>
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/extra-info')} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft className={`w-6 h-6 ${dark ? 'text-red-400' : 'text-gray-600'}`} />
          </button>
          <div>
            <h1 className={`text-xl font-bold ${dark ? 'text-red-400' : 'text-gray-800'}`}>Voice-Only Debate</h1>
            <p className={`text-sm ${dark ? 'text-red-300' : 'text-gray-600'}`}>
              {dark ? 'Challenge Mode' : `Level ${state.selectedLevel}`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {state.selectedLevel === '3' && (
            <div className="flex items-center gap-2">
              <span className={`text-sm font-medium ${dark ? 'text-red-400' : 'text-gray-700'}`}>Challenge Mode</span>
              <button
                onClick={() => setChallengeMode(v => !v)}
                className={`relative w-14 h-7 rounded-full transition-colors ${dark ? 'bg-red-500' : 'bg-gray-300'}`}
              >
                <div className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow transition-transform ${dark ? 'translate-x-7' : ''}`} />
              </button>
            </div>
          )}
          <button onClick={handleEndDebate}
            className="flex items-center gap-2 px-4 py-2 bg-orange-400 text-white rounded-full hover:bg-orange-500 transition-all">
            <Flag className="w-4 h-4" /> End Debate
          </button>
          <button onClick={() => navigate('/')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
              dark ? 'bg-gray-800 text-red-400 hover:bg-gray-700' : 'bg-gradient-to-r from-blue-500 to-green-500 text-white hover:shadow-lg'
            }`}>
            <Home className="w-4 h-4" /> Home
          </button>
        </div>
      </div>

      {/* Characters */}
      <div className="flex-1 overflow-y-auto p-12">
        <div className="max-w-7xl mx-auto">
          <div className="relative grid grid-cols-2 gap-24 items-end min-h-[500px]">

            {/* Lightning separator */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none w-96">
              <svg width="380" height="80" viewBox="0 0 380 80" className="mx-auto">
                <defs>
                  <linearGradient id="lightningGrad" x1="0%" y1="50%" x2="100%" y2="50%">
                    {dark ? (
                      <>
                        <stop offset="0%" stopColor="#dc2626" />
                        <stop offset="50%" stopColor="#ef4444" />
                        <stop offset="100%" stopColor="#b91c1c" />
                      </>
                    ) : (
                      <>
                        <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.9" />
                        <stop offset="50%" stopColor="#34d399" stopOpacity="0.9" />
                        <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.9" />
                      </>
                    )}
                  </linearGradient>
                  {dark && (
                    <filter id="glowHoriz">
                      <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
                      <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
                    </filter>
                  )}
                </defs>
                <path
                  d="M 20 40 L 100 20 L 80 40 L 150 25 L 130 40 L 200 30 L 180 40 L 250 25 L 230 40 L 300 30 L 280 40 L 360 40"
                  fill="none" stroke="url(#lightningGrad)" strokeWidth="4"
                  strokeLinecap="round" strokeLinejoin="round"
                  filter={dark ? 'url(#glowHoriz)' : undefined}
                  style={{ opacity: lightningActive ? (flashOn ? 1 : 0.12) : 0, transition: 'opacity 140ms linear' }}
                />
              </svg>
            </div>

            {/* AI + User characters */}
            {(['ai', 'user'] as const).map(sender => (
              <motion.div
                key={sender}
                className="flex flex-col items-center relative z-10"
                animate={{ scale: activeCharacter === sender ? 1.03 : 1 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <div className={`w-48 h-48 rounded-full shadow-2xl flex items-center justify-center transition-all duration-500 relative mb-6 bg-gradient-to-br ${avatarGlow(sender, activeCharacter === sender)}`}>
                  <CharacterIcon
                    type={sender === 'ai' ? state.aiCharacter : state.userCharacter}
                    size={90} className="text-white"
                  />
                  {activeCharacter === sender && (
                    <motion.div
                      className={`absolute inset-0 rounded-full ${dark ? 'bg-red-500' : sender === 'ai' ? 'bg-blue-400' : 'bg-green-400'}`}
                      animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.2, 0.5] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                    />
                  )}
                </div>

                {/* Lectern */}
                <div className="relative w-full flex flex-col items-center">
                  <div className={`w-72 h-6 bg-gradient-to-r ${lecternColor(sender)} rounded-t-xl shadow-xl relative overflow-hidden`}>
                    <div className={`absolute inset-0 bg-gradient-to-br ${dark ? 'from-red-400/30' : 'from-white/30'} to-transparent`} />
                  </div>
                  <div className={`w-20 h-40 bg-gradient-to-b ${lecternColor(sender)} shadow-2xl relative`}>
                    <div className={`absolute inset-0 bg-gradient-to-r ${dark ? 'from-red-300/20' : 'from-white/20'} to-transparent`} />
                  </div>
                  <div className={`w-32 h-8 bg-gradient-to-b ${lecternColor(sender)} rounded-b-xl shadow-xl`} />
                </div>

                <h3 className={`text-2xl font-bold mt-6 ${dark ? 'text-red-400' : 'text-gray-800'}`}>
                  {sender === 'ai' ? state.aiCharacterName : state.userCharacterName}
                </h3>

                {/* Volume button — always show for AI, show for user once they've spoken */}
                {(sender === 'ai' || messages.length > 1) && (
                  <button
                    onClick={sender === 'ai' ? handleAIAudioClick : handleUserAudioClick}
                    className={`mt-4 p-3 rounded-full transition-colors ${
                      dark
                        ? (sender === 'ai' ? aiAudioMuted : userAudioMuted)
                          ? 'bg-red-900 hover:bg-red-800' : 'bg-gray-800 hover:bg-gray-700'
                        : (sender === 'ai' ? aiAudioMuted : userAudioMuted)
                          ? 'bg-red-200 hover:bg-red-300'
                          : sender === 'ai' ? 'bg-blue-100 hover:bg-blue-200' : 'bg-green-100 hover:bg-green-200'
                    }`}
                    title="Single click: replay | Double click: mute/unmute"
                  >
                    {(sender === 'ai' ? aiAudioMuted : userAudioMuted) ? (
                      <VolumeX className={`w-6 h-6 ${dark ? 'text-red-500' : 'text-red-600'}`} />
                    ) : (
                      <Volume2 className={`w-6 h-6 ${dark ? 'text-red-400' : sender === 'ai' ? 'text-blue-600' : 'text-green-600'}`} />
                    )}
                  </button>
                )}
              </motion.div>
            ))}
          </div>

          {/* Speaking / status indicator */}
          <div className="text-center mt-12">
            <AnimatePresence mode="wait">
              {activeCharacter === 'ai' && (
                <motion.div key="ai-speaking"
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                  className={`text-xl font-semibold ${dark ? 'text-red-400' : 'text-blue-600'}`}>
                  🎤 {state.aiCharacterName} is speaking...
                </motion.div>
              )}
              {activeCharacter === 'user' && isRecording && (
                <motion.div key="user-recording"
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                  className={`text-xl font-semibold ${dark ? 'text-red-400' : 'text-green-600'}`}>
                  🎤 Recording...
                </motion.div>
              )}
              {activeCharacter === 'user' && !isRecording && (
                <motion.div key="user-playing"
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                  className={`text-xl font-semibold ${dark ? 'text-red-400' : 'text-green-600'}`}>
                  🔊 Playing your recording...
                </motion.div>
              )}
              {isProcessing && (
                <motion.div key="processing"
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                  className={`text-xl font-semibold ${dark ? 'text-red-300' : 'text-blue-500'}`}>
                  ⏳ Processing...
                </motion.div>
              )}
              {!activeCharacter && !isProcessing && (
                <motion.div key="waiting"
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                  className={`text-xl font-semibold ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
                  Waiting for input...
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        <div ref={messagesEndRef} />
      </div>

      {/* Mic button */}
      <div className={`${dark ? 'bg-gray-900/90' : 'bg-white/70'} backdrop-blur-md shadow-lg p-8`}>
        <div className="max-w-2xl mx-auto text-center">
          <motion.button
            onClick={handleVoiceInput}
            disabled={isProcessing}
            whileHover={{ scale: isProcessing ? 1 : 1.05 }}
            whileTap={{ scale: isProcessing ? 1 : 0.95 }}
            className={`w-32 h-32 rounded-full shadow-2xl transition-all duration-300 disabled:opacity-50 ${
              isRecording ? 'bg-red-500 hover:bg-red-600'
              : dark ? 'bg-gradient-to-br from-red-600 to-red-800'
              : 'bg-gradient-to-br from-blue-500 to-green-500 hover:shadow-xl'
            }`}
          >
            {isRecording
              ? <Square className="w-12 h-12 text-white mx-auto" fill="white" />
              : <Mic className="w-12 h-12 text-white mx-auto" />
            }
          </motion.button>
          <p className={`mt-6 text-lg ${dark ? 'text-gray-400' : 'text-gray-600'}`}>
            {isProcessing ? 'Processing your argument…'
              : isRecording ? 'Click to stop and send'
              : 'Click the microphone to record your response'}
          </p>
        </div>
      </div>
    </div>
  );
}

function getLevelDescription(level: string | null): string {
  switch (level) {
    case '1': return "Level 1: Guided Coach";
    case '2': return "Level 2: Sparring Partner";
    case '3': return "Level 3: Grandmaster";
    default:  return "a debate level";
  }
}