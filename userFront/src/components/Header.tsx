import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Gamepad2, ShoppingCart } from 'lucide-react';

const Header: React.FC = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
        setSearchQuery('');
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (
        isSearchOpen && 
        searchContainerRef.current && 
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setIsSearchOpen(false);
        setSearchQuery('');
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSearchOpen]);

  const platforms = [
    { name: 'PC', icon: '🖥️' },
    { name: 'PlayStation', icon: '🎮' },
    { name: 'Xbox', icon: '🎮' },
    { name: 'Nintendo', icon: '🎮' }
  ];

  const handleSearchToggle = () => {
    setIsSearchOpen(!isSearchOpen);
    if (isSearchOpen) {
      setSearchQuery('');
    }
  };

  const handleSearchClose = () => {
    setIsSearchOpen(false);
    setSearchQuery('');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div 
        className={`transition-all duration-300 border-b ${
          isScrolled 
            ? 'bg-gray-900 bg-opacity-95 backdrop-blur-md border-gray-700' 
            : 'bg-transparent border-transparent'
        }`}
        style={{ 
          backdropFilter: isScrolled ? 'blur(10px)' : 'none'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <Gamepad2 className="h-8 w-8 text-orange-500" />
              <span className="text-xl font-bold text-white">InstantGaming</span>
            </div>

            {/* Center Section - Navigation or Search */}
            <div className="flex-1 flex justify-center">
              {isSearchOpen ? (
                <div 
                  ref={searchContainerRef}
                  className="flex items-center space-x-4 animate-in slide-in-from-top duration-300 w-full max-w-md"
                >
                  <div className="relative flex-1">
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search games..."
                      className="w-full px-4 py-2 pl-10 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all duration-200"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          console.log('Search for:', searchQuery);
                          // Handle search logic here
                        }
                      }}
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                  <button
                    onClick={handleSearchClose}
                    className="p-2 text-gray-400 hover:text-white transition-colors duration-200 rounded-full hover:bg-gray-700"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              ) : (
                <nav className="hidden md:flex items-center space-x-8">
                  {platforms.map((platform) => (
                    <button
                      key={platform.name}
                      className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors duration-200 px-3 py-2 rounded-md hover:bg-gray-800"
                    >
                      <span className="text-sm">{platform.icon}</span>
                      <span className="text-sm font-medium">{platform.name}</span>
                    </button>
                  ))}
                </nav>
              )}
            </div>

            {/* Right Section - Search Icon and Cart */}
            <div className="flex items-center space-x-3">
              {/* Search Toggle Button */}
              <button
                onClick={handleSearchToggle}
                className="p-2 text-gray-400 hover:text-white transition-colors duration-200 rounded-full hover:bg-gray-700"
              >
                <Search className="h-5 w-5" />
              </button>

              {/* Cart Icon */}
              <button className="p-2 text-gray-400 hover:text-white transition-colors duration-200 relative rounded-full hover:bg-gray-700">
                <ShoppingCart className="h-5 w-5" />
                {/* Cart badge */}
                <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                  3
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;