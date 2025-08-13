import React, { useEffect, useRef } from 'react';
import { useGameStore } from '../store/gameStore';
import Hero from '../components/Hero';
import GameGrid from '../components/GameGrid';
import Pagination from '../components/Pagination';
import LoadingSkeleton from '../components/LoadingSkeleton';

const HomePage: React.FC = () => {
  const isInitialMount = useRef(true);
  
  const {
    games,
    currentPage,
    searchQuery,
    selectedPlatform,
    isLoading,
    error,
    totalPages,
    totalGames,
    setCurrentPage,
    setSearchQuery,
    fetchGames,
    fetchFeaturedGames,
    resetFilters
  } = useGameStore();

  // Reset filters and fetch games on component mount
  useEffect(() => {
    if (isInitialMount.current) {
      // On initial mount, always reset filters to ensure clean state
      resetFilters();
      fetchGames(1);
      fetchFeaturedGames();
      isInitialMount.current = false;
    }
  }, [resetFilters, fetchGames, fetchFeaturedGames]);



  // Fetch games when filters change
  useEffect(() => {
    if (searchQuery || selectedPlatform) {
      const filters: Record<string, unknown> = {};
      if (searchQuery) filters.q = searchQuery;
      if (selectedPlatform) filters.platform = selectedPlatform;
      fetchGames(1, filters);
    } else {
      // When no filters are active, fetch all games
      fetchGames(1);
    }
  }, [searchQuery, selectedPlatform, fetchGames]);

  useEffect(() => {
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const filters: Record<string, unknown> = {};
    if (searchQuery) filters.q = searchQuery;
    if (selectedPlatform) filters.platform = selectedPlatform;
    fetchGames(page, filters);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    resetFilters();
    fetchGames(1);
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

            {/* Results Info */}
            <div className="flex items-center justify-between mb-6">
              <div className="text-[#DDDDDD]">
                {searchQuery ? (
                  totalGames > 0 ? (
                    <span>
                      Found <span className="text-white font-semibold">{totalGames}</span> results 
                      for "<span className="text-[#FF6600]">{searchQuery}</span>"
                    </span>
                  ) : (
                    <span className="text-red-400">
                      No results found for "<span className="text-white">{searchQuery}</span>"
                    </span>
                  )
                ) : (
                  <span>
                    Showing <span className="text-white font-semibold">{totalGames}</span> games
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
          
          {error && (
            <div className="text-center py-8">
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
                <p className="text-red-400">{error}</p>
                <button
                  onClick={() => fetchGames(1)}
                  className="mt-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}
          
          {isLoading ? (
            <LoadingSkeleton count={20} />
          ) : (!games || games.length === 0) ? (
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
                  onClick={handleClearSearch}
                  className="bg-[#FF6600] hover:bg-[#e55a00] text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
                >
                  Clear Search
                </button>
              )}
            </div>
          ) : (
            <>
              <GameGrid games={games} />

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
      <footer className="bg-[#121212] border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Footer Content */}
          <div className="py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {/* Company Info */}
              <div className="col-span-1 md:col-span-2">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">RH</span>
                  </div>
                  <span className="text-xl font-bold text-white">RedHawk Gaming</span>
                </div>
                <p className="text-[#DDDDDD] text-sm mb-4 max-w-md">
                  Your premier destination for digital games. Discover amazing deals on the latest titles across all platforms with instant delivery.
                </p>
                <div className="flex space-x-4">
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                    </svg>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                    </svg>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z"/>
                    </svg>
                  </a>
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h3 className="text-white font-semibold mb-4">Quick Links</h3>
                <ul className="space-y-2">
                  <li><a href="/" className="text-[#DDDDDD] hover:text-white text-sm transition-colors">All Games</a></li>
                  <li><a href="/category/pc" className="text-[#DDDDDD] hover:text-white text-sm transition-colors">PC Games</a></li>
                  <li><a href="/category/playstation" className="text-[#DDDDDD] hover:text-white text-sm transition-colors">PlayStation</a></li>
                  <li><a href="/category/xbox" className="text-[#DDDDDD] hover:text-white text-sm transition-colors">Xbox</a></li>
                  <li><a href="/category/nintendo" className="text-[#DDDDDD] hover:text-white text-sm transition-colors">Nintendo</a></li>
                </ul>
              </div>

              {/* Support */}
              <div>
                <h3 className="text-white font-semibold mb-4">Support</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-[#DDDDDD] hover:text-white text-sm transition-colors">Help Center</a></li>
                  <li><a href="#" className="text-[#DDDDDD] hover:text-white text-sm transition-colors">Contact Us</a></li>
                  <li><a href="#" className="text-[#DDDDDD] hover:text-white text-sm transition-colors">FAQ</a></li>
                  <li><a href="#" className="text-[#DDDDDD] hover:text-white text-sm transition-colors">Terms of Service</a></li>
                  <li><a href="#" className="text-[#DDDDDD] hover:text-white text-sm transition-colors">Privacy Policy</a></li>
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="border-t border-gray-800 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-[#DDDDDD] text-sm mb-4 md:mb-0">
                © 2025 RedHawk Gaming. All rights reserved.
              </div>
              <div className="text-[#DDDDDD] text-sm">
                Built with ❤️ by <span className="text-orange-500 font-semibold">Artican</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default HomePage;