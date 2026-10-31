import { CharacterType } from '../context/AppContext';

// Local Image Imports
import robotImage from './Robot.png';
import personImage from './earth person.png';
import owlImage from './owl.png';
import alienImage from './Alien.png';

interface CharacterIconProps {
  type: CharacterType;
  size?: number;
  className?: string;
}

export function CharacterIcon({ type, size = 64, className = '' }: CharacterIconProps) {
  // This function maps your 'type' prop to the imported image variable
  const getCharacterImage = (characterType: CharacterType) => {
    switch (characterType) {
      case 'robot':
        return robotImage;
      case 'person':
        return personImage;
      case 'owl':
        return owlImage;
      case 'alien':
        return alienImage;
      default:
        return robotImage;
    }
  };

  return (
    <div 
      className={className}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        // The browser will now resolve the local path automatically
        backgroundImage: `url(${getCharacterImage(type)})`,
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    />
  );
}