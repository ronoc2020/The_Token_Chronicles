import React from 'react';
import { Skull } from 'lucide-react';

interface EnemyProps {
  name: string;
  health: number;
  maxHealth: number;
  onAttack: () => void;
}

const Enemy: React.FC<EnemyProps> = ({ name, health, maxHealth, onAttack }) => {
  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg mb-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-lg font-semibold">{name}</span>
        <Skull size={24} className="text-red-500" />
      </div>
      <div className="w-full bg-gray-700 rounded-full h-2.5 mb-4">
        <div
          className="bg-red-600 h-2.5 rounded-full"
          style={{ width: `${(health / maxHealth) * 100}%` }}
        ></div>
      </div>
      <button
        onClick={onAttack}
        className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
      >
        Attack
      </button>
    </div>
  );
};

export default Enemy;