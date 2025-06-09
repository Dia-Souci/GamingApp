import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';

interface GameCardProps {
  id: string;
  title: string;
  originalPrice: number;
  discountedPrice: number;
  discount: number;
  imageUrl: string;
  platform: string;
}

const GameCard: React.FC<GameCardProps> = ({
  id,
  title,
  originalPrice,
  discountedPrice,
  discount,
  imageUrl,
  platform
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const addToCart = useCartStore(state => state.addToCart);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    addToCart({
      id,
      title,
      platform,
      originalPrice,
      discountedPrice,
      discount,
      imageUrl
    });
  };

  return (
    <Link 
      to={`/game/${id}`}
      className="block bg-[#2C2C2C] rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image/Video Container */}
      <div className="relative aspect-[3/4] overflow-hidden">
        <img 
          src={imageUrl}
          alt={title}
          className={`w-full h-full object-cover transition-opacity duration-500 ${
            isHovered ? 'opacity-0' : 'opacity-100'
          }`}
        />
        
        {/* Video Preview Simulation */}
        <div className={`absolute inset-0 bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center transition-opacity duration-500 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}>
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-white rounded-full flex items-center justify-center mb-2 mx-auto animate-pulse">
              <div className="w-0 h-0 border-l-[8px] border-l-white border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent ml-1"></div>
            </div>
            <span className="text-white text-sm">Video Preview</span>
          </div>
        </div>
        
        {/* Platform Badge */}
        <div className="absolute top-2 left-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs font-medium">
          {platform}
        </div>
        
        {/* Discount Badge */}
        {discount > 0 && (
          <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded text-xs font-bold">
            -{discount}%
          </div>
        )}
      </div>
      
      {/* Card Content */}
      <div className="p-4">
        <h3 className="text-white font-semibold text-sm mb-3 line-clamp-2 group-hover:text-[#FF6600] transition-colors duration-200">
          {title}
        </h3>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-white font-bold text-lg">${discountedPrice}</span>
            {discount > 0 && (
              <span className="text-gray-400 line-through text-sm">${originalPrice}</span>
            )}
          </div>
          
          <button 
            className="bg-[#FF6600] hover:bg-[#e55a00] text-white px-3 py-1 rounded text-xs font-medium transition-colors duration-200"
            onClick={handleAddToCart}
          >
            Buy
          </button>
        </div>
      </div>
    </Link>
  );
};

export default GameCard;