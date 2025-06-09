import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useGameStore, Game } from '../store/gameStore';
import GameCard from './GameCard';
import SearchBar from './SearchBar';
import Pagination from './Pagination';
import LoadingSkeleton from './LoadingSkeleton';

const GAMES_PER_PAGE = 30;

const CategoryGameGrid: React.FC = () => {
  const { platform } = useParams<{ platform: string }>();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [filteredGames, setFilteredGames] = useState<Game[]>([]);
  const [displayedGames, setDisplayedGames] = useState<Game[]>([]);

  const { getGamesByPlatform, searchGames } = useGameStore();

  // Update filtered games when platform or search query changes
  useEffect(() => {
    setIsLoading(true);
    const games = platform 
      ? searchGames(searchQuery, platform)
      : searchGames(searchQuery);
    setFilteredGames(games);
    setCurrentPage(1); // Reset to first page when filter changes
    setIsLoading(false);
  }, [platform, searchQuery, searchGames]);

  // Update displayed games when filtered games or current page changes
  useEffect(() => {
    const startIndex = (currentPage - 1) * GAMES_PER_PAGE;
    const endIndex = startIndex + GAMES_PER_PAGE;
    setDisplayedGames(filteredGames.slice(startIndex, endIndex));
  }, [filteredGames, currentPage]);

  const handleSearch = (query: string) => {
    // Search is handled by the URL search params
  };

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

  const totalPages = Math.ceil(filteredGames.length / GAMES_PER_PAGE);

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
                {filteredGames.length} games found
              </p>
            </div>
            <div className="w-full md:w-auto">
              <SearchBar 
                onSearch={handleSearch}
                placeholder={`Search ${getCategoryTitle().toLowerCase()}...`}
              />
            </div>
          </div>
        </div>

        {/* Games Grid */}
        {isLoading ? (
          <LoadingSkeleton count={GAMES_PER_PAGE} />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-6">
              {displayedGames.map((game) => (
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

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}

            {/* No Results Message */}
            {filteredGames.length === 0 && !isLoading && (
              <div className="text-center py-12">
                <p className="text-[#DDDDDD] text-lg">
                  No games found matching your search criteria.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default CategoryGameGrid; 