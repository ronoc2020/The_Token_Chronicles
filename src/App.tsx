import React, { useState } from 'react';
import CharacterSelection from './components/CharacterSelection';
import GameWorld from './components/GameWorld';
import { Sword, Wand, Footprints } from 'lucide-react';

export type CharacterClass = 'warrior' | 'mage' | 'rogue';

const App: React.FC = () => {
  const [selectedClass, setSelectedClass] = useState<CharacterClass | null>(null);

  const characterClasses: { type: CharacterClass; name: string; icon: React.ReactNode }[] = [
    { type: 'warrior', name: 'Warrior', icon: <Sword size={24} /> },
    { type: 'mage', name: 'Mage', icon: <Wand size={24} /> },
    { type: 'rogue', name: 'Rogue', icon: <Footprints size={24} /> },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {!selectedClass ? (
        <CharacterSelection
          characterClasses={characterClasses}
          onSelectClass={setSelectedClass}
        />
      ) : (
        <GameWorld characterClass={selectedClass} />
      )}
    </div>
  );
};

export default App;