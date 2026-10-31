import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { useAppContext, LevelType } from '../context/AppContext';
import { Target, Swords, Trophy } from 'lucide-react';

const levels = [
  {
    id: '1' as LevelType,
    name: 'Guided Coach',
    description: 'Master the foundations through guided Socratic feedback and theory-driven support.',
    icon: Target,
    color: 'from-green-400 to-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-500',
  },
  {
    id: '2' as LevelType,
    name: 'The Sparring Partner',
    description: 'Learn by doing with real-time style tips and adaptive difficulty as you debate.',
    icon: Swords,
    color: 'from-blue-400 to-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-500',
  },
  {
    id: '3' as LevelType,
    name: 'The Grandmaster',
    description: "Test your grit in high-intensity simulations with a full 'flow' analysis at the end.",
    icon: Trophy,
    color: 'from-red-400 to-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-500',
  },
];

export default function LevelChoicePage() {
  const navigate = useNavigate();
  const { setLevel } = useAppContext();

  const handleLevelSelect = (levelId: LevelType) => {
    setLevel(levelId);
    navigate('/extra-info');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-blue-100 p-8">
      <div className="max-w-6xl mx-auto">
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
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent mb-4">
            Choose Your Level
          </h1>
          <p className="text-gray-600 text-lg">Select a difficulty level that matches your debate experience</p>
        </motion.div>

        <div className="grid gap-8">
          {levels.map((level, index) => {
            const Icon = level.icon;
            return (
              <motion.button
                key={level.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleLevelSelect(level.id)}
                className={`group relative overflow-hidden rounded-3xl bg-white/70 backdrop-blur-md p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:${level.borderColor}`}
              >
                <div className="flex items-start gap-6">
                  <div className={`flex-shrink-0 w-20 h-20 rounded-2xl bg-gradient-to-br ${level.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-10 h-10 text-white" strokeWidth={2} />
                  </div>
                  
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-3 mb-3">
                      <span className={`px-4 py-1 rounded-full text-sm font-bold bg-gradient-to-r ${level.color} text-white`}>
                        Level {level.id}
                      </span>
                      <h2 className="text-3xl font-bold text-gray-800">{level.name}</h2>
                    </div>
                    <p className="text-gray-600 text-lg leading-relaxed">{level.description}</p>
                  </div>

                  <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>

                <div className={`absolute inset-0 bg-gradient-to-r ${level.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none`} />
              </motion.button>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-12 text-center text-gray-500 text-sm"
        >
          <p>Not sure which level to choose? Start with Level 1 and work your way up!</p>
        </motion.div>
      </div>
    </div>
  );
}