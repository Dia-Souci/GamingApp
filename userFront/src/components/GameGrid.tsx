import React from 'react';
import GameCard from './GameCard';
import { Game } from '../store/gameStore';

interface GameGridProps {
  games?: Game[];
}

const GameGrid: React.FC<GameGridProps> = ({ games }) => {
  if (!games || games.length === 0) {
    return null;
  }

  // Max 3 items per row with wider spacing and full width utilization
  return (
    <div className="w-full max-w-none">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-12 px-4">
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
  );
};

export default GameGrid;