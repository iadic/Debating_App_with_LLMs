import { useState, useRef, useEffect } from 'react';

// Funny debate-themed loading messages
const LOADING_PHRASES = [
  "Formulating a devastating counter-argument...",
  "Searching for logical fallacies in your logic...",
  "Consulting the Great Library of Rhetoric...",
  "Sharpening my wit...",
  "Checking my facts (and your feelings)...",
  "Preparing to respectfully disagree...",
  "Deconstructing your premise..."
];
import { useNavigate } from 'react-router';
import { useAppContext } from '../context/AppContext';
import { CharacterIcon } from '../components/CharacterIcon';
import { Send, Mic, Upload, Volume2, VolumeX, Home, ArrowLeft, Flag, Square } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  audioUrl?: string | null;
  audioBlob?: Blob;        // stored for user voice messages so they can be replayed
  timestamp: Date;
}

// ── Audio helpers ─────────────────────────────────────────────────────────────

function b64ToAudioUrl(b64: string): string {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  const blob = new Blob([bytes.buffer], { type: 'audio/wav' });
  return URL.createObjectURL(blob);
}

async function fetchTTS(text: string): Promise<string | null> {
  try {
    const res = await fetch('http://localhost:8000/text_tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.audio_base64 ? b64ToAudioUrl(data.audio_base64) : null;
  } catch {
    return null;
  }
}

export default function AllModalitiesPage() {
  const navigate = useNavigate();
  const { state } = useAppContext();

  const greetingText = `Hello! I'm your Debate Partner. You chose ${getLevelDescription(state.selectedLevel)}. Let's debate: "${state.debateTopic}". Shall we start?`;

  const [messages, setMessages]           = useState<Message[]>([
    { id: '1', sender: 'ai', text: greetingText, timestamp: new Date() },
  ]);
  const [inputText, setInputText]         = useState('');
  const [isRecording, setIsRecording]     = useState(false);
  const [isProcessing, setIsProcessing]   = useState(false);
  const [challengeMode, setChallengeMode] = useState(false);
  const [mutedIds, setMutedIds]           = useState<Set<string>>(new Set());
  const [playingId, setPlayingId]         = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState('');

  const messagesEndRef   = useRef<HTMLDivElement>(null);
  const fileInputRef     = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef   = useRef<Blob[]>([]);
  const currentAudioRef  = useRef<HTMLAudioElement | null>(null);
  const clickTimeoutRef  = useRef<Record<string, NodeJS.Timeout>>({});
  const prevLenRef       = useRef(1);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Auto-play greeting on mount
  useEffect(() => {
    (async () => {
      const url = await fetchTTS(greetingText);
      if (url) {
        setMessages(prev => prev.map((m, i) => i === 0 ? { ...m, audioUrl: url } : m));
        playUrl(url, '1');
      }
    })();
  }, []);

  // Auto-play new AI messages
  useEffect(() => {
    const last = messages[messages.length - 1];
    if (messages.length > prevLenRef.current && last?.sender === 'ai' && !mutedIds.has(last.id)) {
      playMessage(last);
    }
    prevLenRef.current = messages.length;
  }, [messages]);

  // ── Playback ───────────────────────────────────────────────────────────────
  function stopCurrent() {
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
    }
    setPlayingId(null);
  }

  function playUrl(url: string, msgId: string, revoke = false) {
    stopCurrent();
    const audio = new Audio(url);
    currentAudioRef.current = audio;
    setPlayingId(msgId);
    audio.onended = () => {
      setPlayingId(null);
      currentAudioRef.current = null;
      if (revoke) URL.revokeObjectURL(url);
    };
    audio.play().catch(console.error);
  }

  async function playMessage(msg: Message) {
    if (mutedIds.has(msg.id)) return;
// Funny debate-themed loading messages
const LOADING_PHRASES = [
  "Formulating a devastating counter-argument...",
  "Searching for logical fallacies in your logic...",
  "Consulting the Great Library of Rhetoric...",
  "Sharpening my wit...",
  "Checking my facts (and your feelings)...",
  "Preparing to respectfully disagree...",
  "Deconstructing your premise..."
];

    // User voice message → replay their raw webm recording
    if (msg.sender === 'user' && msg.audioBlob) {
      const url = URL.createObjectURL(msg.audioBlob);
      playUrl(url, msg.id, /* revoke after */ true);
      return;
    }

    // User typed message → free browser built-in speech synthesis, no API call
    if (msg.sender === 'user' && !msg.audioBlob) {
      stopCurrent();
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(msg.text);
      setPlayingId(msg.id);
      utterance.onend = () => setPlayingId(null);
      utterance.onerror = () => setPlayingId(null);
      window.speechSynthesis.speak(utterance);
      return;
    }

    // AI message → use cached audioUrl (already returned from backend)
    const url = msg.audioUrl ?? null;
    if (url) playUrl(url, msg.id);
  }

  // Single click = replay, double click = toggle mute
  function handleVolumeClick(msg: Message) {
    if (clickTimeoutRef.current[msg.id]) {
      clearTimeout(clickTimeoutRef.current[msg.id]);
      delete clickTimeoutRef.current[msg.id];
      setMutedIds(prev => {
        const next = new Set(prev);
        if (next.has(msg.id)) { next.delete(msg.id); }
        else { stopCurrent(); next.add(msg.id); }
        return next;
      });
      return;
    }
    clickTimeoutRef.current[msg.id] = setTimeout(() => {
      delete clickTimeoutRef.current[msg.id];
      playMessage(msg);
    }, 250);
  }

  // ── Shared: add AI message from any API response ───────────────────────────
  function addAiMessage(data: { ai_text?: string; audio_base64?: string }) {
    const aiMsg: Message = {
      id: (Date.now() + 1).toString(),
      sender: 'ai',
      text: data.ai_text || '',
      timestamp: new Date(),
      audioUrl: data.audio_base64 ? b64ToAudioUrl(data.audio_base64) : null,
    };
    setMessages(prev => [...prev, aiMsg]);
  }

  // ── Text send → /text_chat ─────────────────────────────────────────────────
  const handleSend = async () => {
    const text = inputText.trim();
    if (!text || isProcessing) return;
    setInputText('');
    setMessages(prev => [...prev, {
      id: Date.now().toString(), sender: 'user', text, timestamp: new Date(),
    }]);
    setIsProcessing(true);
    try {
      const res = await fetch('http://localhost:8000/text_chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, level: state.selectedLevel, topic: state.debateTopic, voice: state.selectedVoice }),
      });
      if (!res.ok) throw new Error(`text_chat ${res.status}: ${await res.text()}`);
      addAiMessage(await res.json());
    } catch (e) {
      setMessages(prev => [...prev, {
        id: 'err-' + Date.now(), sender: 'ai', text: `⚠️ ${String(e)}`, timestamp: new Date(),
      }]);
    } finally {
      setIsProcessing(false);
    }
  };

  // ── Voice record → /audio_chat (backend: webm → mp3 via pydub → OpenAI) ───
  const handleVoiceInput = async () => {
    if (isRecording) {
      mediaRecorderRef.current?.stop();
      setIsRecording(false);
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];
      recorder.ondataavailable = e => audioChunksRef.current.push(e.data);

      recorder.onstop = async () => {
        stream.getTracks().forEach(t => t.stop());
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });

        const userMsgId = Date.now().toString();
        // Store audioBlob on the message so the volume button can replay it later
        setMessages(prev => [...prev, {
          id: userMsgId,
          sender: 'user',
          text: '🎤 You spoke…',
          timestamp: new Date(),
          audioBlob: blob,
        }]);
        setIsProcessing(true);

        try {
          const form = new FormData();
          form.append('file', blob, 'recording.webm');

          form.append('level', state.selectedLevel || '1');
          form.append('topic', state.debateTopic || '');
          if (state.selectedVoice) form.append('voice', state.selectedVoice);

          const res = await fetch('http://localhost:8000/audio_chat', { method: 'POST', body: form });
          if (!res.ok) throw new Error(`audio_chat ${res.status}: ${await res.text()}`);

          const data = await res.json();
          addAiMessage(data);
        } catch (e) {
          setMessages(prev => [
            ...prev.map(m => m.id === userMsgId ? { ...m, text: '[recording failed]' } : m),
            { id: 'err-' + Date.now(), sender: 'ai', text: `⚠️ ${String(e)}`, timestamp: new Date() },
          ]);
        } finally {
          setIsProcessing(false);
        }
      };

      recorder.start();
      setIsRecording(true);
    } catch {
      alert('Could not access microphone. Please grant permission.');
    }
  };

  // ── File upload → /text_chat ───────────────────────────────────────────────
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type.startsWith('text/') || file.name.endsWith('.txt')) {
      const reader = new FileReader();
      reader.onload = async ev => {
        const text = ev.target?.result as string;
        setMessages(prev => [...prev, {
          id: Date.now().toString(), sender: 'user', text: `[File: ${file.name}]`, timestamp: new Date(),
        }]);
        setIsProcessing(true);
        try {
          const res = await fetch('http://localhost:8000/text_chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: text, level: state.selectedLevel, topic: state.debateTopic, voice: state.selectedVoice }),
          });
          if (!res.ok) throw new Error(`text_chat ${res.status}`);
          addAiMessage(await res.json());
        } catch (e) {
          setMessages(prev => [...prev, {
            id: 'err-' + Date.now(), sender: 'ai', text: `⚠️ ${String(e)}`, timestamp: new Date(),
          }]);
        } finally {
          setIsProcessing(false);
        }
      };
      reader.readAsText(file);
    } else {
      setInputText(`[Uploaded: ${file.name} — ${(file.size / 1024).toFixed(1)} KB]`);
    }
    e.target.value = '';
  };

  // ── Theme ──────────────────────────────────────────────────────────────────

  // Force all text to be white in Challenge Mode (on or off)
  const allWhite = challengeMode;
  const bgGradient = allWhite ? 'from-gray-900 via-gray-800 to-black' : 'from-blue-50 via-green-50 to-blue-100';
  const headerBg   = allWhite ? 'bg-gray-900/90' : 'bg-white/70';
  const bubbleBg   = (s: 'ai' | 'user') =>
    challengeMode && state.selectedLevel === '3'
      ? s === 'ai' ? 'bg-red-900/80 text-white border border-red-500'
                   : 'bg-gray-800/80 text-white border border-gray-600'
      : s === 'ai' ? 'bg-white text-gray-800'
                   : 'bg-gradient-to-br from-green-100 to-blue-100 text-gray-800';

  return (
    <div className={`min-h-screen bg-gradient-to-br ${bgGradient} flex flex-col`}>
      {/* Header */}

      <div className={`${headerBg} backdrop-blur-md shadow-lg px-6 py-4 flex items-center justify-between`}>
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/extra-info')} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft className={`w-6 h-6 ${allWhite ? 'text-white' : 'text-gray-600'}`} />
          </button>
          <div>
            <h1 className={`text-xl font-bold ${allWhite ? 'text-white' : 'text-gray-800'}`}>Multimodal Debate</h1>
            <p className={`text-sm ${allWhite ? 'text-white' : 'text-gray-600'}`}>Level {state.selectedLevel}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {state.selectedLevel === '3' && (
            <div className="flex items-center gap-2">
              <span className={`text-sm font-medium ${challengeMode ? 'text-white' : 'text-gray-700'}`}>Challenge Mode</span>
              <button
                onClick={() => setChallengeMode(v => !v)}
                className={`relative w-14 h-7 rounded-full transition-colors ${challengeMode ? 'bg-red-500' : 'bg-gray-300'}`}
              >
                <div className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow transition-transform ${challengeMode ? 'transform translate-x-7' : ''}`} />
              </button>
            </div>
          )}
          <button onClick={() => navigate('/debate/summary', { state: { messages } })}
            className="flex items-center gap-2 px-4 py-2 bg-orange-400 text-white rounded-full hover:bg-orange-500 transition-all">
            <Flag className="w-4 h-4" /> End Debate
          </button>
          <button onClick={() => navigate('/')}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-full hover:shadow-lg transition-all">
            <Home className="w-4 h-4" /> Home
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <AnimatePresence>
          {messages.map(msg => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              className={`flex gap-4 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              <div className={`flex-shrink-0 w-20 h-20 rounded-full shadow-lg flex items-center justify-center ${
                msg.sender === 'ai'
                  ? 'bg-gradient-to-br from-blue-400 to-blue-600'
                  : 'bg-gradient-to-br from-green-400 to-green-600'
              }`}>
                <CharacterIcon
                  type={msg.sender === 'ai' ? state.aiCharacter : state.userCharacter}
                  size={50} className="text-white"
                />
              </div>

              {/* Bubble */}
              <div className={`flex-1 max-w-3xl ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}> 
                <div className={`inline-block p-6 rounded-3xl shadow-xl ${bubbleBg(msg.sender)}`}> 
                  <p className={`text-lg leading-relaxed ${allWhite ? 'text-white' : ''}`}>{msg.text}</p>
                  <div className={`flex items-center gap-3 mt-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}> 
                    <span className={`text-sm ${allWhite ? 'text-white' : 'text-gray-500'}`}>
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <button
                      onClick={() => handleVolumeClick(msg)}
                      className={`p-1 ${allWhite ? 'hover:bg-gray-700' : 'hover:bg-gray-200'} rounded-full transition-colors`}
                      title={
                        msg.audioBlob
                          ? 'Single click: replay recording | Double click: mute/unmute'
                          : 'Single click: replay | Double click: mute/unmute'
                      }
                    >
                      {mutedIds.has(msg.id)
                        ? <VolumeX className={`w-4 h-4 ${allWhite ? 'text-red-300' : 'text-red-500'}`} />
                        : <Volume2 className={`w-4 h-4 ${playingId === msg.id ? (allWhite ? 'text-blue-200 animate-pulse' : 'text-blue-500 animate-pulse') : (allWhite ? 'text-gray-300' : 'text-gray-500')}`} />
                      }
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isProcessing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-center">
            <span className={`text-sm font-medium italic ${challengeMode && state.selectedLevel === '3' ? 'text-red-300' : 'text-blue-500'}`}>{loadingMessage || LOADING_PHRASES[Math.floor(Math.random() * LOADING_PHRASES.length)]}</span>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className={`${allWhite ? 'bg-gray-900/90' : 'bg-white/70'} backdrop-blur-md shadow-lg p-6`}>
        <div className="max-w-6xl mx-auto">
          <div className="flex gap-3 items-end">
            <button
              onClick={handleVoiceInput}
              disabled={isProcessing && !isRecording}
              className={`p-4 rounded-2xl shadow-lg transition-all disabled:opacity-50 ${
                isRecording
                  ? 'bg-red-500 text-white scale-110'
                  : 'bg-gradient-to-br from-blue-500 to-blue-600 text-white hover:shadow-xl'
              }`}
              title={isRecording ? 'Stop recording' : 'Record audio'}
            >
              {isRecording ? <Square className="w-6 h-6" fill="white" /> : <Mic className="w-6 h-6" />}
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessing}
              className="p-4 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
              title="Upload text file"
            >
              <Upload className="w-6 h-6" />
            </button>
            <input ref={fileInputRef} type="file" onChange={handleFileUpload} className="hidden" accept=".txt,text/*" />

            <textarea
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
              placeholder="Type your argument, or use the mic / file upload…"
              rows={3}
              disabled={isProcessing}
              className={`flex-1 px-6 py-4 rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors resize-none disabled:opacity-50 ${allWhite ? 'text-white placeholder-white' : ''}`}
            />

            <button
              onClick={handleSend}
              disabled={!inputText.trim() || isProcessing}
              className="p-4 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-6 h-6" />
            </button>
          </div>
          <p className={`text-sm text-center mt-3 ${allWhite ? 'text-white' : 'text-gray-400'}`}>
            🎤 Record audio &nbsp;|&nbsp; 📄 Upload a text file &nbsp;|&nbsp; ⌨️ Type your message
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