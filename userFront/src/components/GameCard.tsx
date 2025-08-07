import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Static YouTube Video ID
const YOUTUBE_VIDEO_ID = "VQRLujxTm3c";

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

  // YouTube thumbnail URL (high quality)
  const youtubeThumbnail = `https://img.youtube.com/vi/${YOUTUBE_VIDEO_ID}/maxresdefault.jpg`;
  const youtubeUrl = `https://www.youtube.com/watch?v=${YOUTUBE_VIDEO_ID}`;

  const handleVideoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(youtubeUrl, '_blank');
  };

  return (
    <Link 
      to={`/game/${id}`}
      className="block bg-[#2C2C2C] rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group w-full min-w-0"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image/Video Container - Wider aspect ratio for better video preview */}
      <div className="relative aspect-[16/9] overflow-hidden">
        <img 
          src={imageUrl}
          alt={title}
          className={`w-full h-full object-cover transition-opacity duration-500 ${
            isHovered ? 'opacity-0' : 'opacity-100'
          }`}
        />
        
        {/* YouTube Video Autoplay */}
        <div className={`absolute inset-0 transition-opacity duration-500 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}>
          {isHovered ? (
            <iframe
              src={`https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}?autoplay=1&mute=1&controls=0&showinfo=0&rel=0&modestbranding=1&loop=1&playlist=${YOUTUBE_VIDEO_ID}`}
              className="w-full h-full"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={`${title} trailer`}
            />
          ) : (
            <img 
              src={youtubeThumbnail}
              alt={`${title} trailer`}
              className="w-full h-full object-cover"
            />
          )}
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
      
      {/* Card Content - More padding for wider cards */}
      <div className="p-6">
        <h3 className="text-white font-semibold text-base mb-4 line-clamp-2 group-hover:text-[#FF6600] transition-colors duration-200">
          {title}
        </h3>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-white font-bold text-xl">${discountedPrice}</span>
            {discount > 0 && (
              <span className="text-gray-400 line-through text-base">${originalPrice}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default GameCard;