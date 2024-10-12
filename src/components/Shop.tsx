import React from 'react';
import { Coins } from 'lucide-react';

interface ShopProps {
  buyItem: (item: { name: string; price: number }) => void;
  gold: number;
}

const shopItems = [
  { name: 'Health Potion', price: 20 },
  { name: 'Mana Potion', price: 20 },
  { name: 'Strength Potion', price: 50 },
  { name: 'Magic Scroll', price: 75 },
];

const Shop: React.FC<ShopProps> = ({ buyItem, gold }) => {
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-4">
      <h2 className="text-2xl font-bold mb-4">Shop</h2>
      <p className="mb-4">
        <Coins className="inline-block text-yellow-500 mr-2" />
        Your Gold: {gold}
      </p>
      <ul>
        {shopItems.map((item, index) => (
          <li key={index} className="mb-2">
            <div className="flex justify-between items-center">
              <span>{item.name}</span>
              <div>
                <span className="mr-2">{item.price} gold</span>
                <button
                  onClick={() => buyItem(item)}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-1 px-2 rounded"
                >
                  Buy
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Shop;