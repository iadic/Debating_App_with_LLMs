import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { useAppContext, ModalityType } from '../context/AppContext';
import { MessageSquare, Mic, Layers } from 'lucide-react';

const modalities = [
  {
    id: 'text' as ModalityType,
    name: 'Text Only',
    description: 'Type your arguments and read AI responses',
    icon: MessageSquare,
    color: 'from-blue-400 to-blue-600',
    route: '/debate/text',
  },
  {
    id: 'audio' as ModalityType,
    name: 'Voice Only',
    description: 'Speak your arguments and hear AI responses',
    icon: Mic,
    color: 'from-green-400 to-green-600',
    route: '/debate/voice',
  },
  {
    id: 'multimodal' as ModalityType,
    name: 'Multimodal',
    description: 'Use text, voice, and file uploads together',
    icon: Layers,
    color: 'from-purple-400 to-purple-600',
    route: '/debate/multimodal',
  },
];

export default function ExtraInfoPage() {
  const navigate = useNavigate();
  const { state, setTopic, setModality } = useAppContext();
  const [topic, setTopicInput] = useState(state.debateTopic);

  const handleModalitySelect = (modalityId: ModalityType, route: string) => {
    if (!topic.trim()) {
      alert('Please enter a debate topic first!');
      return;
    }
    setTopic(topic);
    setModality(modalityId);
    navigate(route);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-blue-100 p-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <button
            onClick={() => navigate('/levels')}
            className="text-blue-600 hover:text-blue-700 mb-6 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Levels
          </button>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent mb-4">
            Setup Your Debate
          </h1>
          <p className="text-gray-600 text-lg">Choose a topic and select your preferred debate modality</p>
        </motion.div>

        {/* Topic Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <div className="bg-white/70 backdrop-blur-md rounded-3xl p-8 shadow-xl">
            <label className="block text-xl font-bold text-gray-800 mb-4">
              What topic would you like to debate?
            </label>
            <textarea
              value={topic}
              onChange={(e) => setTopicInput(e.target.value)}
              placeholder="e.g., Should billionaires exist? Is artificial intelligence more beneficial or harmful to society? Should voting be mandatory?"
              rows={4}
              className="w-full px-6 py-4 rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors resize-none text-lg"
            />
            <p className="text-sm text-gray-500 mt-3">
              Be specific! A clear topic leads to better debate practice.
            </p>
          </div>
        </motion.div>

        {/* Modality Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Select Your Modality</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {modalities.map((modality, index) => {
              const Icon = modality.icon;
              return (
                <motion.button
                  key={modality.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  onClick={() => handleModalitySelect(modality.id, modality.route)}
                  className="group relative overflow-hidden rounded-3xl bg-white/70 backdrop-blur-md p-6 shadow-xl hover:shadow-2xl transition-all duration-300"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${modality.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                  
                  <div className="relative z-10">
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${modality.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-8 h-8 text-white" strokeWidth={2} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{modality.name}</h3>
                    <p className="text-sm text-gray-600">{modality.description}</p>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Level Info Display */}
        {state.selectedLevel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-8 text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 backdrop-blur-sm">
              <span className="text-sm text-gray-600">Selected Level:</span>
              <span className="font-bold text-blue-600">Level {state.selectedLevel}</span>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
