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

  // If only one game is passed, render just that game card
  if (games.length === 1) {
    const game = games[0];
    return (
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
    );
  }

  // Render full grid for multiple games
  return (
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
  );
};

export default GameGrid;