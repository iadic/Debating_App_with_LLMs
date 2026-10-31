import { useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { useAppContext, CharacterType } from '../context/AppContext';
import { CharacterIcon } from '../components/CharacterIcon';

const characters: Array<{ id: CharacterType; name: string; description: string }> = [
    { id: 'robot', name: 'Robot', description: 'Logical & Analytical' },
    { id: 'person', name: 'Earth Person', description: 'Wise & Knowledge' },
    { id: 'owl', name: 'Owl', description: 'Strategic & Thoughtful' },
    { id: 'alien', name: 'Alien', description: 'Creative & Unique' },
  ];

export default function CharacterPersonalizationPage() {
  const navigate = useNavigate();
  const { state, setAICharacter, setUserCharacter, setVoice } = useAppContext();
  
  const [aiChar, setAiChar] = useState<CharacterType>(state.aiCharacter);
  const [aiName, setAiName] = useState(state.aiCharacterName);
  const [userChar, setUserChar] = useState<CharacterType>(state.userCharacter);
  const [userName, setUserName] = useState(state.userCharacterName);

  const handleContinue = () => {
    setAICharacter(aiChar, aiName);
    setUserCharacter(userChar, userName);
    navigate('/levels');
  };

  const handleSave = () => {
    setAICharacter(aiChar, aiName);
    setUserCharacter(userChar, userName);
    // persist voice selection already stored in context via setVoice when user chooses
    alert('Characters saved successfully!');
  };

  // Audio previews (imported via URL so Vite resolves them)
  const alloyUrl = new URL('../components/alloy.m4a', import.meta.url).href;
  const shimmerUrl = new URL('../components/shimmer.m4a', import.meta.url).href;
  const echoUrl = new URL('../components/echo.m4a', import.meta.url).href;
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [selectedVoice, setSelectedVoice] = useState<'alloy' | 'shimmer' | 'echo' | null>(state.selectedVoice ?? null);

  const playPreview = (voice: 'alloy' | 'shimmer' | 'echo') => {
    // stop existing
    if (audioRef.current) {
      try { audioRef.current.pause(); } catch {};
      audioRef.current = null;
    }
    let url = alloyUrl;
    if (voice === 'shimmer') url = shimmerUrl;
    if (voice === 'echo') url = echoUrl;
    const a = new Audio(url);
    audioRef.current = a;
    a.play().catch(console.error);
    setSelectedVoice(voice);
    setVoice(voice);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-blue-100 p-8">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <button
            onClick={() => navigate('/')}
            className="text-blue-600 hover:text-blue-700 mb-6 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </button>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">
            Personalise Your Characters
          </h1>
          <p className="text-gray-600 mt-4 text-lg">Choose avatars and names for you and your AI debate partner</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* AI Character Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/70 backdrop-blur-md rounded-3xl p-8 shadow-xl"
          >
            <h2 className="text-2xl font-bold text-blue-600 mb-6">AI Debate Partner</h2>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">Choose Character</label>
              <div className="grid grid-cols-4 gap-4">
                {characters.map((char) => (
                  <motion.button
                    key={char.id}
                    onClick={() => setAiChar(char.id)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`p-4 rounded-2xl transition-all duration-300 ${
                      aiChar === char.id
                        ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white ring-4 ring-blue-300 shadow-2xl'
                        : 'bg-white/80 hover:bg-white text-gray-800 shadow-lg hover:shadow-xl'
                    }`}
                  >
                    <CharacterIcon
                      type={char.id}
                      size={80}
                      className={aiChar === char.id ? 'mx-auto mb-2' : 'mx-auto mb-2 opacity-80'}
                    />
                    <h3 className="font-bold text-sm mb-1">{char.name}</h3>
                    <p className={`text-xs ${aiChar === char.id ? 'text-blue-100' : 'text-gray-600'}`}>
                      {char.description}
                    </p>
                  </motion.button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
              <input
                type="text"
                value={aiName}
                onChange={(e) => setAiName(e.target.value)}
                placeholder="e.g., Socrates AI"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors"
              />
            </div>
            
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Voice</label>
              <p className="text-xs text-gray-500 mb-3">Choose a voice for your AI debate partner. Click to preview.</p>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => playPreview('alloy')}
                  className={`px-4 py-2 rounded-xl transition-colors ${selectedVoice === 'alloy' ? 'bg-blue-500 text-white' : 'bg-white/80 text-gray-800 hover:bg-white'}`}
                >
                  Alloy
                </button>

                <button
                  onClick={() => playPreview('shimmer')}
                  className={`px-4 py-2 rounded-xl transition-colors ${selectedVoice === 'shimmer' ? 'bg-blue-500 text-white' : 'bg-white/80 text-gray-800 hover:bg-white'}`}
                >
                  Shimmer
                </button>

                <button
                  onClick={() => playPreview('echo')}
                  className={`px-4 py-2 rounded-xl transition-colors ${selectedVoice === 'echo' ? 'bg-blue-500 text-white' : 'bg-white/80 text-gray-800 hover:bg-white'}`}
                >
                  Echo
                </button>
              </div>
            </div>
          </motion.div>

          {/* User Character Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/70 backdrop-blur-md rounded-3xl p-8 shadow-xl"
          >
            <h2 className="text-2xl font-bold text-green-600 mb-6">Your Character</h2>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">Choose Character</label>
              <div className="grid grid-cols-4 gap-4">
                {characters.map((char) => (
                  <motion.button
                    key={char.id}
                    onClick={() => setUserChar(char.id)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`p-4 rounded-2xl transition-all duration-300 ${
                      userChar === char.id
                        ? 'bg-gradient-to-br from-green-500 to-green-600 text-white ring-4 ring-green-300 shadow-2xl'
                        : 'bg-white/80 hover:bg-white text-gray-800 shadow-lg hover:shadow-xl'
                    }`}
                  >
                    <CharacterIcon
                      type={char.id}
                      size={80}
                      className={userChar === char.id ? 'mx-auto mb-2' : 'mx-auto mb-2 opacity-80'}
                    />
                    <h3 className="font-bold text-sm mb-1">{char.name}</h3>
                    <p className={`text-xs ${userChar === char.id ? 'text-green-100' : 'text-gray-600'}`}>
                      {char.description}
                    </p>
                  </motion.button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="e.g., Alex"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:outline-none transition-colors"
              />
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12 flex justify-center"
        >
          <button
            onClick={handleContinue}
            className="px-12 py-4 bg-gradient-to-r from-blue-500 to-green-500 text-white text-xl font-bold rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
          >
            Let's Debate! →
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-4 flex justify-center"
        >
          <button
            onClick={handleSave}
            className="px-12 py-4 bg-gradient-to-r from-blue-500 to-green-500 text-white text-xl font-bold rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
          >
            Save Characters
          </button>
        </motion.div>
      </div>
    </div>
  );
}