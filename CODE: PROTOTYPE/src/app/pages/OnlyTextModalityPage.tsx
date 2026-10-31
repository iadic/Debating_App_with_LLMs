import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import ReactMarkdown from 'react-markdown';
import { useAppContext } from '../context/AppContext';
import { CharacterIcon } from '../components/CharacterIcon';
import { Send, Home, ArrowLeft, Flag, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: Date;
}

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

export default function OnlyTextModalityPage() {
  const navigate = useNavigate();
  const { state } = useAppContext();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'ai',
      text: `Hello! I'm your Debate Partner. You chose ${getLevelDescription(state.selectedLevel)}. Let's debate: "${state.debateTopic}". Shall we start?`,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [challengeMode, setChallengeMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputText,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputText;
    setInputText('');
    
    // Set a random funny loading message
    setLoadingMessage(LOADING_PHRASES[Math.floor(Math.random() * LOADING_PHRASES.length)]);
    setIsLoading(true);

    const aiMessageId = (Date.now() + 1).toString();

    try {
      const response = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: currentInput,
          level: state.selectedLevel || "1",
          topic: state.debateTopic || "General Debate"
        }),
      });

      if (!response.ok) throw new Error('Network response was not ok');
      if (!response.body) throw new Error('No response body');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullText = '';
      let hasStartedTyping = false;

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.error) throw new Error(data.error);
              if (data.text) {
                // The moment we get the first bit of text:
                if (!hasStartedTyping) {
                  hasStartedTyping = true;
                  setIsLoading(false); // Remove the loading bubble
                  setMessages(prev => [...prev, {
                    id: aiMessageId,
                    sender: 'ai',
                    text: '',
                    timestamp: new Date(),
                  }]);
                }

                fullText += data.text;
                setMessages(prev => 
                  prev.map(msg => 
                    msg.id === aiMessageId ? { ...msg, text: fullText } : msg
                  )
                );
              }
            } catch (e) {
              console.error("Error parsing stream chunk", e);
            }
          }
        }
      }

    } catch (error) {
      console.error("Error connecting to debater:", error);
      setIsLoading(false);
      const errorMessage: Message = {
        id: 'error-' + Date.now(),
        sender: 'ai',
        text: "⚠️ **Connection Error**: Check your backend.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const handleEndDebate = () => {
    navigate('/debate/summary', { state: { messages } });
  };

  const bgGradient = challengeMode && state.selectedLevel === '3'
    ? 'from-gray-900 via-gray-800 to-black'
    : 'from-blue-50 via-green-50 to-blue-100';

  const headerBg = challengeMode && state.selectedLevel === '3'
    ? 'bg-gray-900/90'
    : 'bg-white/70';

  const messageBubbleBg = (sender: 'ai' | 'user') => {
    if (challengeMode && state.selectedLevel === '3') {
      return sender === 'ai' 
        ? 'bg-red-900/80 text-white border border-red-500'
        : 'bg-gray-800/80 text-white border border-gray-600';
    }
    return sender === 'ai'
      ? 'bg-white text-gray-800 shadow-md'
      : 'bg-gradient-to-br from-green-500 to-blue-600 text-white shadow-lg';
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${bgGradient} flex flex-col transition-colors duration-500`}>
      {/* Header */}
      <div className={`${headerBg} backdrop-blur-md shadow-lg px-6 py-4 flex items-center justify-between z-10`}>
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/extra-info')} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-800">Text-Only Debate</h1>
            <p className="text-sm text-gray-600">Level {state.selectedLevel}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {state.selectedLevel === '3' && (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Challenge Mode</span>
              <button
                onClick={() => setChallengeMode(!challengeMode)}
                className={`relative w-14 h-7 rounded-full transition-colors ${challengeMode ? 'bg-red-500' : 'bg-gray-300'}`}
              >
                <div className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow transition-transform ${challengeMode ? 'transform translate-x-7' : ''}`} />
              </button>
            </div>
          )}
          <button onClick={handleEndDebate} className="flex items-center gap-2 px-4 py-2 bg-orange-400 text-white rounded-full hover:bg-orange-500 transition-all">
            <Flag className="w-4 h-4" /> End Debate
          </button>
          <button onClick={() => navigate('/')} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-full hover:shadow-lg transition-all">
            <Home className="w-4 h-4" /> Home
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        <AnimatePresence initial={false}>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-4 ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div className={`flex-shrink-0 w-16 h-16 rounded-full shadow-lg flex items-center justify-center ${
                message.sender === 'ai' ? 'bg-blue-500' : 'bg-green-500'
              }`}>
                <CharacterIcon 
                  type={message.sender === 'ai' ? state.aiCharacter : state.userCharacter} 
                  size={40} 
                  className="text-white" 
                />
              </div>

              <div className={`flex-1 max-w-4xl ${message.sender === 'user' ? 'text-right' : 'text-left'}`}>
                <div className={`inline-block p-6 rounded-3xl ${messageBubbleBg(message.sender)}`}>
                  <div className={`text-lg leading-relaxed prose prose-slate max-w-none ${challengeMode && state.selectedLevel === '3' ? 'text-white' : (message.sender === 'user' ? 'prose-invert text-white' : 'text-gray-800')}`}> 
                    <ReactMarkdown>{message.text}</ReactMarkdown>
                  </div>
                  <span className={`text-xs mt-3 block opacity-60 ${challengeMode && state.selectedLevel === '3' ? 'text-white' : (message.sender === 'user' ? 'text-white' : 'text-gray-500')}`}> 
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
          
          {/* THE LOADING BUBBLE IS HERE */}
          {isLoading && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0 }}
              className="flex gap-4"
            >
              <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
              </div>
              <div className="bg-white/50 p-6 rounded-3xl italic text-gray-500 shadow-sm border border-gray-100 flex items-center gap-3">
                {loadingMessage}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white/70 backdrop-blur-md shadow-2xl p-6 border-t border-gray-100">
        <div className="max-w-6xl mx-auto flex gap-4 items-end">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Type your response..."
            rows={2}
            className={`flex-1 px-6 py-4 rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-all resize-none text-lg shadow-inner bg-white/50 ${challengeMode && state.selectedLevel === '3' ? 'text-white placeholder-white' : ''}`}
          />
          <button
            onClick={handleSend}
            disabled={!inputText.trim() || isLoading}
            className="p-5 rounded-2xl bg-gradient-to-br from-blue-600 to-green-600 text-white shadow-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:grayscale"
          >
            {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Send className="w-6 h-6" />}
          </button>
        </div>
      </div>
    </div>
  );
}

function getLevelDescription(level: string | null): string {
  switch (level) {
    case '1': return 'Level 1: Guided Coach';
    case '2': return 'Level 2: Sparring Partner';
    case '3': return 'Level 3: Grandmaster';
    default: return 'the selected level';
  }
}