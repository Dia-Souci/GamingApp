import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation  } from 'react-router-dom';
import { Search, X, Gamepad2, ShoppingCart ,Monitor, Gamepad, Zap } from 'lucide-react';
import { useCartStore } from '../store/cartStore';


const categories = [
  { 
    id: 'all', 
    name: 'All Games', 
    path: '/', 
    icon: Zap,
    color: 'from-purple-500 to-pink-500'
  },
  { 
    id: 'pc', 
    name: 'PC Games', 
    path: '/category/pc', 
    icon: Monitor,
    color: 'from-blue-500 to-cyan-500'
  },
  { 
    id: 'playstation', 
    name: 'PlayStation', 
    path: '/category/playstation', 
    icon: Gamepad2,
    color: 'from-blue-600 to-blue-800'
  },
  { 
    id: 'xbox', 
    name: 'Xbox', 
    path: '/category/xbox', 
    icon: Gamepad,
    color: 'from-green-500 to-green-700'
  },
  { 
    id: 'nintendo', 
    name: 'Nintendo', 
    path: '/category/nintendo', 
    icon: Gamepad2,
    color: 'from-red-500 to-red-700'
  }
];
 

const Header: React.FC = () => {
   const location = useLocation();
  
    const isActive = (path: string) => {
      if (path === '/') {
        return location.pathname === '/';
      }
      return location.pathname === path;
    };


  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  
  const getTotalItems = useCartStore(state => state.getTotalItems);
  const totalItems = getTotalItems();

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
            <Link to="/" className="flex items-center space-x-2">
              <Gamepad2 className="h-8 w-8 text-orange-500" />
              <span className="text-xl font-bold text-white">InstantGaming</span>
            </Link>

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
                  {categories.map((category) => {
                              const Icon = category.icon;
                              const active = isActive(category.path);
                              
                              return (
                                <Link
                                  key={category.id}
                                  to={category.path}
                                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 whitespace-nowrap ${
                                    active
                                      ? `bg-gradient-to-r ${category.color} text-white shadow-lg transform scale-105`
                                      : 'text-[#DDDDDD] hover:text-white hover:bg-[#3a3a3a]'
                                  }`}
                                >
                                  <Icon className="w-5 h-5" />
                                  <span>{category.name}</span>
                                </Link>
                              );
                            })}
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
              <Link 
                to="/cart"
                className="p-2 text-gray-400 hover:text-white transition-colors duration-200 relative rounded-full hover:bg-gray-700"
              >
                <ShoppingCart className="h-5 w-5" />
                {/* Cart badge */}
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                    {totalItems > 99 ? '99+' : totalItems}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;