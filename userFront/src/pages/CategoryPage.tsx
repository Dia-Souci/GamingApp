import React, { useEffect, useCallback } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Monitor, Gamepad2, Gamepad } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import GameGrid from '../components/GameGrid';
import SearchBar from '../components/SearchBar';
import Pagination from '../components/Pagination';
import LoadingSkeleton from '../components/LoadingSkeleton';

const platformConfig = {
  pc: {
    name: 'PC Games',
    icon: Monitor,
    color: 'from-blue-500 to-cyan-500',
    description: 'Discover the latest PC games with the best deals and instant delivery'
  },
  playstation: {
    name: 'PlayStation Games',
    icon: Gamepad2,
    color: 'from-blue-600 to-blue-800',
    description: 'Exclusive PlayStation titles and the hottest console games'
  },
  xbox: {
    name: 'Xbox Games',
    icon: Gamepad,
    color: 'from-green-500 to-green-700',
    description: 'Xbox exclusives and Game Pass favorites at unbeatable prices'
  },
  nintendo: {
    name: 'Nintendo Games',
    icon: Gamepad2,
    color: 'from-red-500 to-red-700',
    description: 'Nintendo Switch games and family-friendly adventures'
  }
};

const CategoryPage: React.FC = () => {
  const { platform } = useParams<{ platform: string }>();
  const {
    filteredGames,
    currentPage,
    searchQuery,
    isLoading,
    setSelectedPlatform,
    setCurrentPage,
    setSearchQuery,
    getPaginatedGames,
    getTotalPages
  } = useGameStore();

  // Validate platform parameter
  if (!platform || !platformConfig[platform as keyof typeof platformConfig]) {
    return <Navigate to="/\" replace />;
  }

  const config = platformConfig[platform as keyof typeof platformConfig];
  const Icon = config.icon;
  const paginatedGames = getPaginatedGames();
  const totalPages = getTotalPages();

  useEffect(() => {
    setSelectedPlatform(platform);
    
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [platform, setSelectedPlatform]);

  useEffect(() => {
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, [setSearchQuery]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <>
      <Helmet>
        <title>{config.name} - InstantGaming</title>
        <meta name="description" content={config.description} />
      </Helmet>

      <div className="min-h-screen bg-[#1E1E1E] pt-16">

        {/* Category Header */}
        <section className="bg-[#1E1E1E] py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${config.color} mb-4`}>
                <Icon className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                {config.name}
              </h1>
              <p className="text-[#DDDDDD] text-lg max-w-2xl mx-auto">
                {config.description}
              </p>
            </div>

            {/* Search Bar */}
            <div className="flex justify-center mb-8">
              <SearchBar 
                onSearch={handleSearch}
                placeholder={`Search ${config.name.toLowerCase()}...`}
              />
            </div>

            {/* Results Info */}
            <div className="flex items-center justify-between mb-6">
              <div className="text-[#DDDDDD]">
                {searchQuery ? (
                  filteredGames.length > 0 ? (
                    <span>
                      Found <span className="text-white font-semibold">{filteredGames.length}</span> results 
                      {searchQuery && (
                        <span> for "<span className="text-[#FF6600]">{searchQuery}</span>"</span>
                      )}
                    </span>
                  ) : (
                    <span className="text-red-400">
                      No results found for "<span className="text-white">{searchQuery}</span>"
                    </span>
                  )
                ) : (
                  <span>
                    Showing <span className="text-white font-semibold">{filteredGames.length}</span> games
                  </span>
                )}
              </div>
              
              {totalPages > 1 && (
                <div className="text-[#DDDDDD] text-sm">
                  Page {currentPage} of {totalPages}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Games Grid */}
        <section className="bg-[#1E1E1E] pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {isLoading ? (
              <LoadingSkeleton count={30} />
            ) : filteredGames.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-[#2C2C2C] rounded-full flex items-center justify-center mx-auto mb-6">
                  <Icon className="w-12 h-12 text-[#DDDDDD]" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">No games found</h3>
                <p className="text-[#DDDDDD] mb-8">
                  {searchQuery 
                    ? `Try adjusting your search terms or browse all ${config.name.toLowerCase()}.`
                    : `No ${config.name.toLowerCase()} available at the moment.`
                  }
                </p>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="bg-[#FF6600] hover:bg-[#e55a00] text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
                  >
                    Clear Search
                  </button>
                )}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-6">
                  {paginatedGames.map((game) => (
                    <GameGrid key={game.id} games={[game]} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                )}
              </>
            )}
          </div>
        </section>
      </div>
    </>
  );
};

export default CategoryPage;