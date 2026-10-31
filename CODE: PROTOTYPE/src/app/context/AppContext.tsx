import { createContext, useContext, useState, ReactNode } from 'react';

export type CharacterType = 'robot' | 'person' | 'owl' | 'alien';
export type LevelType = '1' | '2' | '3';

export type ModalityType = 'audio' | 'text' | 'multimodal';

interface AppState {
  // Character personalization
  aiCharacter: CharacterType;
  aiCharacterName: string;
  userCharacter: CharacterType;
  userCharacterName: string;
  
  // Level and topic
  selectedLevel: LevelType | null;
  debateTopic: string;
  
  // Modality
  selectedModality: ModalityType | null;
  // Voice choice for audio preview / TTS
  selectedVoice: 'alloy' | 'shimmer' | 'echo' | null;
}

interface AppContextType {
  state: AppState;
  setAICharacter: (character: CharacterType, name: string) => void;
  setUserCharacter: (character: CharacterType, name: string) => void;
  setLevel: (level: LevelType) => void;
  setTopic: (topic: string) => void;
  setModality: (modality: ModalityType) => void;
  setVoice: (voice: 'alloy' | 'shimmer' | 'echo') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>({
    aiCharacter: 'robot',
    aiCharacterName: 'AI Debater',
    userCharacter: 'person',
    userCharacterName: 'You',
    selectedLevel: null,
    debateTopic: '',
    selectedModality: null,
    selectedVoice: null,
  });

  const setAICharacter = (character: CharacterType, name: string) => {
    setState(prev => ({ ...prev, aiCharacter: character, aiCharacterName: name }));
  };

  const setUserCharacter = (character: CharacterType, name: string) => {
    setState(prev => ({ ...prev, userCharacter: character, userCharacterName: name }));
  };

  const setLevel = (level: LevelType) => {
    setState(prev => ({ ...prev, selectedLevel: level }));
  };

  const setTopic = (topic: string) => {
    setState(prev => ({ ...prev, debateTopic: topic }));
  };

  const setModality = (modality: ModalityType) => {
    setState(prev => ({ ...prev, selectedModality: modality }));
  };

  const setVoice = (voice: 'alloy' | 'shimmer' | 'echo') => {
    setState(prev => ({ ...prev, selectedVoice: voice }));
  };

  return (
    <AppContext.Provider 
      value={{ 
        state, 
        setAICharacter, 
        setUserCharacter, 
        setLevel, 
        setTopic, 
        setModality,
        setVoice,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
}