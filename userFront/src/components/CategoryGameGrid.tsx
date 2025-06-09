import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import GameCard from './GameCard';
import Pagination from './Pagination';
import { useGameStore, Game } from '../store/gameStore';

const ITEMS_PER_PAGE = 30;

const CategoryGameGrid: React.FC = () => {
  const { platform } = useParams<{ platform: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredGames, setFilteredGames] = useState<Game[]>([]);
  const [displayedGames, setDisplayedGames] = useState<Game[]>([]);

  const { getGamesByPlatform, searchGames } = useGameStore();

  // Update filtered games when platform or search changes
  useEffect(() => {
    let games: Game[];
    if (platform) {
      games = getGamesByPlatform(platform);
      if (searchQuery) {
        games = searchGames(searchQuery, platform);
      }
    } else {
      games = searchQuery ? searchGames(searchQuery) : [];
    }
    setFilteredGames(games);
    setCurrentPage(1); // Reset to first page when filters change
  }, [platform, searchQuery, getGamesByPlatform, searchGames]);

  // Update displayed games when filtered games or page changes
  useEffect(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const games = filteredGames.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    setDisplayedGames(games);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [filteredGames, currentPage]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query) {
      setSearchParams({ search: query });
    } else {
      setSearchParams({});
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchParams({});
  };

  const totalPages = Math.ceil(filteredGames.length / ITEMS_PER_PAGE);

  const getCategoryTitle = () => {
    if (!platform) return 'All Games';
    const titles: Record<string, string> = {
      pc: 'PC Games',
      playstation: 'PlayStation Games',
      xbox: 'Xbox Games',
      nintendo: 'Nintendo Games'
    };
    return titles[platform] || 'Games';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Category Title */}
      <h1 className="text-3xl font-bold text-white mb-8">{getCategoryTitle()}</h1>

      {/* Search Bar */}
      <div className="relative mb-8">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search games..."
            className="w-full px-4 py-3 pl-12 bg-[#2C2C2C] border border-[#3a3a3a] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#FF6600] focus:ring-1 focus:ring-[#FF6600] transition-all duration-200"
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          {searchQuery && (
            <button
              onClick={handleClearSearch}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      {/* Results Count */}
      <div className="text-[#DDDDDD] mb-6">
        {filteredGames.length === 0 ? (
          <p>No games found{searchQuery ? ` for "${searchQuery}"` : ''}</p>
        ) : (
          <p>Showing {displayedGames.length} of {filteredGames.length} games</p>
        )}
      </div>

      {/* Game Grid */}
      {displayedGames.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {displayedGames.map((game) => (
            <GameCard key={game.id} {...game} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-[#DDDDDD] text-lg">
            {searchQuery
              ? `No games found matching "${searchQuery}"`
              : 'No games available in this category'}
          </p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
};

export default CategoryGameGrid;