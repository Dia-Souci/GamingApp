import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  onSearch, 
  placeholder = "Search games..." 
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('search') || '');

  useEffect(() => {
    const searchQuery = searchParams.get('search') || '';
    setQuery(searchQuery);
    onSearch(searchQuery);
  }, [searchParams, onSearch]);

  const handleSearch = (value: string) => {
    setQuery(value);
    
    // Update URL with search parameter
    if (value.trim()) {
      setSearchParams(prev => {
        const newParams = new URLSearchParams(prev);
        newParams.set('search', value.trim());
        return newParams;
      });
    } else {
      setSearchParams(prev => {
        const newParams = new URLSearchParams(prev);
        newParams.delete('search');
        return newParams;
      });
    }
    
    onSearch(value);
  };

  const clearSearch = () => {
    handleSearch('');
  };

  return (
    <div className="relative max-w-md w-full">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#DDDDDD]" />
        <input
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-3 bg-[#2C2C2C] border border-[#3a3a3a] rounded-lg text-white placeholder-[#DDDDDD]/60 focus:outline-none focus:border-[#FF6600] focus:ring-2 focus:ring-[#FF6600]/20 transition-all duration-200"
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-[#DDDDDD] hover:text-white transition-colors duration-200"
            title="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;