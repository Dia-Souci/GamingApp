import React from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import GameCard from './GameCard';
import SearchBar from './SearchBar';

const CategoryGameGrid: React.FC = () => {
  const { platform } = useParams<{ platform: string }>();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  
  const { searchGames } = useGameStore();
  const games = searchGames(searchQuery, platform);

  const getCategoryTitle = () => {
    if (!platform) return 'All Games';
    const platformMap: Record<string, string> = {
      pc: 'PC Games',
      playstation: 'PlayStation Games',
      xbox: 'Xbox Games',
      nintendo: 'Nintendo Games'
    };
    return platformMap[platform] || 'Games';
  };

  return (
    <section className="bg-[#1E1E1E] py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                {getCategoryTitle()}
              </h2>
              <p className="text-[#DDDDDD] text-lg">
                {games.length} games found
              </p>
            </div>
            <div className="w-full md:w-auto">
              <SearchBar 
                onSearch={() => {}}
                placeholder={`Search ${getCategoryTitle().toLowerCase()}...`}
              />
            </div>
          </div>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-6">
          {games.map((game) => (
            <GameCard
              key={game._id}
              _id={game._id}
              title={game.title}
              originalPrice={game.originalPrice}
              discountedPrice={game.discountedPrice}
              discount={game.discount}
              platform={game.platform}
              imageUrl={game.imageUrl}
              videoUrl={game.videoUrl}
            />
          ))}
        </div>

        {/* No Results Message */}
        {games.length === 0 && (
          <div className="text-center py-12">
            <p className="text-[#DDDDDD] text-lg">
              No games found matching your search criteria.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default CategoryGameGrid; 