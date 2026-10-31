import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { motion } from 'motion/react';
import { useAppContext } from '../context/AppContext';
import { Home, RotateCcw } from 'lucide-react';

// Converts **bold** markdown to <strong> tags for display
function renderMarkdown(text: string) {
  const html = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  return <span dangerouslySetInnerHTML={{ __html: html }} />;
}

interface FeedbackData {
  user_arguments: string[];
  ai_arguments: string[];
  strengths: string[];
  feedback: string[];
  overall: string;
}

export default function DebateSummaryPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = useAppContext();

  // Messages passed from the debate page via navigate('/debate/summary', { state: { messages } })
  const messages: Array<{ sender: 'ai' | 'user'; text: string }> =
    (location.state as any)?.messages ?? [];

  const [feedback, setFeedback]   = useState<FeedbackData | null>(null);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState<string | null>(null);

  useEffect(() => {
    if (messages.length < 2) {
      setLoading(false);
      return;
    }
    (async () => {
      try {
        const res = await fetch('http://localhost:8000/debate_feedback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages,
            level: state.selectedLevel ?? '1',
            topic: state.debateTopic ?? '',
          }),
        });
        if (!res.ok) throw new Error(`feedback ${res.status}: ${await res.text()}`);
        setFeedback(await res.json());
      } catch (e) {
        setError(String(e));
      } finally {
        setLoading(false);
      }
    })();
  }, [messages, state.selectedLevel, state.debateTopic]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-blue-100 p-8">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="text-center mb-12"
        >
          <motion.div
            animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-8xl mb-6"
          >
            🤝
          </motion.div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">
            Debate Complete!
          </h1>
        </motion.div>

        {/* Topic */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="bg-white/70 backdrop-blur-md rounded-3xl p-8 shadow-xl mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Debate Topic</h2>
          <p className="text-xl text-gray-700 italic">"{state.debateTopic}"</p>
        </motion.div>

        {/* Loading state */}
        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="bg-white/70 backdrop-blur-md rounded-3xl p-12 shadow-xl mb-8 text-center">
            <div className="text-5xl mb-4 animate-bounce">🧠</div>
            <p className="text-xl text-gray-600 font-medium">Analysing your debate…</p>
            <p className="text-gray-400 mt-2">Our master debate coach is reviewing the transcript</p>
          </motion.div>
        )}

        {/* Error state */}
        {error && !loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="bg-red-50 rounded-3xl p-8 shadow-xl mb-8 text-center">
            <p className="text-red-600">⚠️ Could not load feedback: {error}</p>
          </motion.div>
        )}

        {/* No messages */}
        {!loading && !error && messages.length < 2 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="bg-white/70 backdrop-blur-md rounded-3xl p-8 shadow-xl mb-8 text-center">
            <p className="text-gray-500 italic">Not enough conversation to generate feedback.</p>
          </motion.div>
        )}

        {/* Feedback */}
        {feedback && !loading && (
          <>
            {/* Arguments grid */}
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              {/* User arguments */}
              <motion.div
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}
                className="bg-gradient-to-br from-green-50 to-blue-50 rounded-3xl p-8 shadow-xl"
              >
                <h2 className="text-2xl font-bold text-green-600 mb-6">Your Main Arguments</h2>
                <ul className="space-y-4">
                  {feedback.user_arguments.map((arg, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-bold">
                        {i + 1}
                      </span>
                      <p className="text-gray-700">{renderMarkdown(arg)}</p>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* AI counter-arguments */}
              <motion.div
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}
                className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-8 shadow-xl"
              >
                <h2 className="text-2xl font-bold text-blue-600 mb-6">Counter Arguments</h2>
                <ul className="space-y-4">
                  {feedback.ai_arguments.map((arg, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold">
                        {i + 1}
                      </span>
                      <p className="text-gray-700">{renderMarkdown(arg)}</p>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>

            {/* Strengths */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}
              className="bg-white/70 backdrop-blur-md rounded-3xl p-8 shadow-xl mb-8"
            >
              <h2 className="text-2xl font-bold text-green-600 mb-6">What You Did Well ✅</h2>
              <div className="space-y-4">
                {feedback.strengths.map((s, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                      <span className="text-green-600 font-bold">✓</span>
                    </div>
                    <p className="text-gray-700 flex-1">{renderMarkdown(s)}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Tips */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
              className="bg-white/70 backdrop-blur-md rounded-3xl p-8 shadow-xl mb-8"
            >
              <h2 className="text-2xl font-bold text-purple-600 mb-6">Feedback & Tips to Improve 💡</h2>
              <div className="space-y-4">
                {feedback.feedback.map((tip, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                      <span className="text-purple-600 font-bold">{i + 1}</span>
                    </div>
                    <p className="text-gray-700 flex-1">{renderMarkdown(tip)}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Overall assessment */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }}
              className="bg-gradient-to-br from-blue-500 to-green-500 rounded-3xl p-8 shadow-xl mb-8"
            >
              <h2 className="text-2xl font-bold text-white mb-4">Overall Assessment</h2>
              <p className="text-white text-lg leading-relaxed">{renderMarkdown(feedback.overall)}</p>
            </motion.div>
          </>
        )}

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
          className="flex justify-center gap-6"
        >
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-lg font-bold rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
          >
            <Home className="w-5 h-5" /> Back to Home
          </button>
          <button
            onClick={() => navigate('/levels')}
            className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white text-lg font-bold rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
          >
            <RotateCcw className="w-5 h-5" /> Choose New Level
          </button>
        </motion.div>

      </div>
    </div>
  );
}
