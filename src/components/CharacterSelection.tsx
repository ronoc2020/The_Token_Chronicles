import React from 'react';
import { CharacterClass } from '../App';

interface CharacterSelectionProps {
  characterClasses: { type: CharacterClass; name: string; icon: React.ReactNode }[];
  onSelectClass: (characterClass: CharacterClass) => void;
}

const CharacterSelection: React.FC<CharacterSelectionProps> = ({ characterClasses, onSelectClass }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-8">Choose Your Character</h1>
      <div className="flex space-x-4">
        {characterClasses.map((characterClass) => (
          <button
            key={characterClass.type}
            onClick={() => onSelectClass(characterClass.type)}
            className="flex flex-col items-center bg-gray-800 hover:bg-gray-700 text-white font-bold py-4 px-8 rounded-lg transition duration-300"
          >
            <div className="mb-2">{characterClass.icon}</div>
            <span>{characterClass.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CharacterSelection;