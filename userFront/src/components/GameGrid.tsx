import React from 'react';
import GameCard from './GameCard';
import { useGameStore } from '../store/gameStore';

const GameGrid: React.FC = () => {
  const games = useGameStore(state => state.games);

  return (
    <section className="bg-[#1E1E1E] py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Featured Games
          </h2>
          <p className="text-[#DDDDDD] text-lg">
            Discover the best deals on the latest and greatest games
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-6">
          {games.map((game) => (
            <GameCard
              key={game.id}
              id={game.id}
              title={game.title}
              originalPrice={game.originalPrice}
              discountedPrice={game.discountedPrice}
              discount={game.discount}
              platform={game.platform}
              imageUrl={game.imageUrl}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default GameGrid;