import React, { useState, useEffect } from 'react';
import { CharacterClass } from '../App';
import { Heart, Coins, Swords, ShieldAlert, Zap, ShoppingBag } from 'lucide-react';
import Enemy from './Enemy';
import Shop from './Shop';

interface GameWorldProps {
  characterClass: CharacterClass;
}

interface InventoryItem {
  name: string;
  quantity: number;
}

interface Quest {
  id: number;
  name: string;
  description: string;
  completed: boolean;
  reward: number;
  progress: number;
  goal: number;
}

const GameWorld: React.FC<GameWorldProps> = ({ characterClass }) => {
  const [health, setHealth] = useState(100);
  const [mana, setMana] = useState(100);
  const [gold, setGold] = useState(50);
  const [level, setLevel] = useState(1);
  const [experience, setExperience] = useState(0);
  const [inventory, setInventory] = useState<InventoryItem[]>([
    { name: 'Health Potion', quantity: 3 },
    { name: 'Mana Potion', quantity: 3 },
  ]);
  const [enemy, setEnemy] = useState({ name: 'Goblin', health: 50, maxHealth: 50 });
  const [combatLog, setCombatLog] = useState<string[]>([]);
  const [quests, setQuests] = useState<Quest[]>([
    { id: 1, name: 'Goblin Slayer', description: 'Defeat 5 Goblins', completed: false, reward: 50, progress: 0, goal: 5 },
    { id: 2, name: 'Orc Hunter', description: 'Defeat 3 Orcs', completed: false, reward: 75, progress: 0, goal: 3 },
    { id: 3, name: 'Skeleton Crusher', description: 'Defeat 4 Skeletons', completed: false, reward: 100, progress: 0, goal: 4 },
  ]);
  const [enemiesDefeated, setEnemiesDefeated] = useState(0);
  const [showShop, setShowShop] = useState(false);

  useEffect(() => {
    const gameLoop = setInterval(() => {
      setGold((prevGold) => prevGold + 1);
      setExperience((prevExp) => {
        if (prevExp + 1 >= level * 100) {
          setLevel((prevLevel) => prevLevel + 1);
          return 0;
        }
        return prevExp + 1;
      });
    }, 1000);

    return () => clearInterval(gameLoop);
  }, [level]);

  const attackEnemy = () => {
    const damage = Math.floor(Math.random() * 10) + 1;
    setEnemy((prevEnemy) => ({
      ...prevEnemy,
      health: Math.max(prevEnemy.health - damage, 0),
    }));
    setCombatLog((prevLog) => [...prevLog, `You dealt ${damage} damage to the ${enemy.name}!`]);

    if (enemy.health - damage <= 0) {
      const expGain = 20;
      const goldGain = 10;
      setExperience((prevExp) => prevExp + expGain);
      setGold((prevGold) => prevGold + goldGain);
      setCombatLog((prevLog) => [
        ...prevLog,
        `You defeated the ${enemy.name}!`,
        `Gained ${expGain} XP and ${goldGain} gold!`,
      ]);
      setEnemiesDefeated((prev) => prev + 1);
      updateQuestProgress(enemy.name);
      checkQuestCompletion();
      spawnNewEnemy();
    } else {
      const enemyDamage = Math.floor(Math.random() * 5) + 1;
      setHealth((prevHealth) => Math.max(prevHealth - enemyDamage, 0));
      setCombatLog((prevLog) => [
        ...prevLog,
        `The ${enemy.name} dealt ${enemyDamage} damage to you!`,
      ]);
    }
  };

  const useSpecialAbility = () => {
    if (mana >= 20) {
      let damage = 0;
      let manaCost = 20;
      let abilityName = '';

      switch (characterClass) {
        case 'warrior':
          damage = Math.floor(Math.random() * 20) + 10;
          abilityName = 'Mighty Slash';
          break;
        case 'mage':
          damage = Math.floor(Math.random() * 30) + 15;
          abilityName = 'Fireball';
          break;
        case 'rogue':
          damage = Math.floor(Math.random() * 25) + 12;
          abilityName = 'Backstab';
          break;
      }

      setEnemy((prevEnemy) => ({
        ...prevEnemy,
        health: Math.max(prevEnemy.health - damage, 0),
      }));
      setMana((prevMana) => prevMana - manaCost);
      setCombatLog((prevLog) => [
        ...prevLog,
        `You used ${abilityName} and dealt ${damage} damage to the ${enemy.name}!`,
      ]);

      if (enemy.health - damage <= 0) {
        const expGain = 30;
        const goldGain = 15;
        setExperience((prevExp) => prevExp + expGain);
        setGold((prevGold) => prevGold + goldGain);
        setCombatLog((prevLog) => [
          ...prevLog,
          `You defeated the ${enemy.name}!`,
          `Gained ${expGain} XP and ${goldGain} gold!`,
        ]);
        setEnemiesDefeated((prev) => prev + 1);
        updateQuestProgress(enemy.name);
        checkQuestCompletion();
        spawnNewEnemy();
      }
    } else {
      setCombatLog((prevLog) => [...prevLog, 'Not enough mana to use special ability!']);
    }
  };

  const spawnNewEnemy = () => {
    const enemies = ['Goblin', 'Orc', 'Skeleton', 'Wolf'];
    const randomEnemy = enemies[Math.floor(Math.random() * enemies.length)];
    setEnemy({
      name: randomEnemy,
      health: 50 + Math.floor(Math.random() * 20),
      maxHealth: 50 + Math.floor(Math.random() * 20),
    });
  };

  const useHealthPotion = () => {
    usePotion('Health Potion', 20, setHealth);
  };

  const useManaPotion = () => {
    usePotion('Mana Potion', 20, setMana);
  };

  const usePotion = (potionName: string, restoreAmount: number, setStateFn: React.Dispatch<React.SetStateAction<number>>) => {
    const potion = inventory.find((item) => item.name === potionName);
    if (potion && potion.quantity > 0) {
      setStateFn((prevValue) => Math.min(prevValue + restoreAmount, 100));
      setInventory((prevInventory) =>
        prevInventory.map((item) =>
          item.name === potionName
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
      );
      setCombatLog((prevLog) => [...prevLog, `You used a ${potionName} and restored ${restoreAmount} points!`]);
    } else {
      setCombatLog((prevLog) => [...prevLog, `You don't have any ${potionName}s left!`]);
    }
  };

  const updateQuestProgress = (enemyName: string) => {
    setQuests((prevQuests) =>
      prevQuests.map((quest) => {
        if (
          (quest.name === 'Goblin Slayer' && enemyName === 'Goblin') ||
          (quest.name === 'Orc Hunter' && enemyName === 'Orc') ||
          (quest.name === 'Skeleton Crusher' && enemyName === 'Skeleton')
        ) {
          return { ...quest, progress: Math.min(quest.progress + 1, quest.goal) };
        }
        return quest;
      })
    );
  };

  const checkQuestCompletion = () => {
    setQuests((prevQuests) =>
      prevQuests.map((quest) => {
        if (quest.progress >= quest.goal && !quest.completed) {
          setGold((prevGold) => prevGold + quest.reward);
          setCombatLog((prevLog) => [
            ...prevLog,
            `Quest completed: ${quest.name}`,
            `Received ${quest.reward} gold as a reward!`,
          ]);
          return { ...quest, completed: true };
        }
        return quest;
      })
    );
  };

  const buyItem = (item: { name: string; price: number }) => {
    if (gold >= item.price) {
      setGold((prevGold) => prevGold - item.price);
      setInventory((prevInventory) => {
        const existingItem = prevInventory.find((invItem) => invItem.name === item.name);
        if (existingItem) {
          return prevInventory.map((invItem) =>
            invItem.name === item.name
              ? { ...invItem, quantity: invItem.quantity + 1 }
              : invItem
          );
        } else {
          return [...prevInventory, { name: item.name, quantity: 1 }];
        }
      });
      setCombatLog((prevLog) => [...prevLog, `You bought a ${item.name} for ${item.price} gold.`]);
    } else {
      setCombatLog((prevLog) => [...prevLog, `Not enough gold to buy ${item.name}.`]);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-2">Welcome, {characterClass}!</h1>
        <p className="text-xl">Explore the world, fight enemies, and complete quests</p>
      </div>
      <div className="flex w-full max-w-4xl">
        <div className="w-1/3 mr-4">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Heart className="text-red-500 mr-2" />
                <span>{health}/100</span>
              </div>
              <div className="flex items-center">
                <Zap className="text-blue-500 mr-2" />
                <span>{mana}/100</span>
              </div>
              <div className="flex items-center">
                <Coins className="text-yellow-500 mr-2" />
                <span>{gold}</span>
              </div>
            </div>
            <div className="mb-4">
              <p className="text-lg font-semibold">Level: {level}</p>
              <div className="w-full bg-gray-700 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: `${(experience / (level * 100)) * 100}%` }}
                ></div>
              </div>
            </div>
            <button
              onClick={useHealthPotion}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-2"
            >
              Use Health Potion ({inventory.find((item) => item.name === 'Health Potion')?.quantity})
            </button>
            <button
              onClick={useManaPotion}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-2"
            >
              Use Mana Potion ({inventory.find((item) => item.name === 'Mana Potion')?.quantity})
            </button>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-4">
            <h2 className="text-xl font-semibold mb-2">Inventory</h2>
            <ul>
              {inventory.map((item, index) => (
                <li key={index} className="flex justify-between">
                  <span>{item.name}</span>
                  <span>{item.quantity}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-4">
            <h2 className="text-xl font-semibold mb-2">Quests</h2>
            <ul>
              {quests.map((quest) => (
                <li key={quest.id} className={`mb-2 ${quest.completed ? 'text-green-500' : ''}`}>
                  <p className="font-semibold">{quest.name}</p>
                  <p className="text-sm">{quest.description}</p>
                  <p className="text-xs">Progress: {quest.progress}/{quest.goal}</p>
                  <p className="text-xs">Reward: {quest.reward} gold</p>
                </li>
              ))}
            </ul>
          </div>
          <button
            onClick={() => setShowShop(!showShop)}
            className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded mb-4"
          >
            <ShoppingBag className="inline-block mr-2" />
            {showShop ? 'Close Shop' : 'Open Shop'}
          </button>
        </div>
        <div className="w-2/3">
          {showShop ? (
            <Shop buyItem={buyItem} gold={gold} />
          ) : (
            <>
              <Enemy
                name={enemy.name}
                health={enemy.health}
                maxHealth={enemy.maxHealth}
                onAttack={attackEnemy}
              />
              <button
                onClick={useSpecialAbility}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded mb-4"
              >
                Use Special Ability (20 Mana)
              </button>
            </>
          )}
          <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-2">Combat Log</h2>
            <div className="h-40 overflow-y-auto">
              {combatLog.map((log, index) => (
                <p key={index} className="mb-1">
                  {log}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameWorld;