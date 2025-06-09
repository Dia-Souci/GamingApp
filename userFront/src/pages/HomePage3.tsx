import React, { useEffect, useCallback } from 'react';
import { useGameStore } from '../store/gameStore';
import Hero from '../components/Hero';
import GameGrid from '../components/GameGrid';
import SearchBar from '../components/SearchBar';
import Pagination from '../components/Pagination';
import LoadingSkeleton from '../components/LoadingSkeleton';

const HomePage: React.FC = () => {
  const {
    filteredGames,
    currentPage,
    searchQuery,
    selectedPlatform,
    isLoading,
    setSelectedPlatform,
    setCurrentPage,
    setSearchQuery,
    getPaginatedGames,
    getTotalPages,
    resetFilters
  } = useGameStore();

  const paginatedGames = getPaginatedGames();
  const totalPages = getTotalPages();

  useEffect(() => {
    // Reset filters when visiting home page
    if (selectedPlatform) {
      resetFilters();
    }
  }, [selectedPlatform, resetFilters]);

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
      <Hero />
      
      {/* Featured Games Section */}
      <section className="bg-[#1E1E1E] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Featured Games
            </h2>
            <p className="text-[#DDDDDD] text-lg mb-8">
              Discover the best deals on the latest and greatest games
            </p>
            
            {/* Search Bar */}
            <div className="flex justify-center mb-8">
              <SearchBar 
                onSearch={handleSearch}
                placeholder="Search all games..."
              />
            </div>

            {/* Results Info */}
            <div className="flex items-center justify-between mb-6">
              <div className="text-[#DDDDDD]">
                {searchQuery ? (
                  filteredGames.length > 0 ? (
                    <span>
                      Found <span className="text-white font-semibold">{filteredGames.length}</span> results 
                      for "<span className="text-[#FF6600]">{searchQuery}</span>"
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
          
          {isLoading ? (
            <LoadingSkeleton count={30} />
          ) : filteredGames.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-[#2C2C2C] rounded-full flex items-center justify-center mx-auto mb-6">
                <div className="text-4xl">🎮</div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">No games found</h3>
              <p className="text-[#DDDDDD] mb-8">
                {searchQuery 
                  ? 'Try adjusting your search terms or browse our categories.'
                  : 'No games available at the moment.'
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
              <GameGrid games={paginatedGames} />

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
      
      {/* Footer */}
      <footer className="bg-[#121212] py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-[#DDDDDD] text-sm">
              © 2024 InstantGaming Clone. Built with React & Tailwind CSS.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default HomePage;