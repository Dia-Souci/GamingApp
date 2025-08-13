import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Utility function to extract YouTube video ID from URL
const getYouTubeVideoId = (url: string): string | null => {
  if (!url) return null;
  
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/watch\?.*v=([^&\n?#]+)/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  
  return null;
};

interface GameCardProps {
  _id: string;
  title: string;
  originalPrice: number;
  discountedPrice?: number;
  discount?: number;
  imageUrl?: string;
  platform: string;
  videoUrl?: string;
}

const GameCard: React.FC<GameCardProps> = ({
  _id,
  title,
  originalPrice,
  discountedPrice,
  discount = 0,
  imageUrl,
  platform,
  videoUrl
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // Extract YouTube video ID from videoUrl
  const youtubeVideoId = getYouTubeVideoId(videoUrl || '');
  
  // YouTube thumbnail URL (high quality) - use extracted ID or fallback
  const youtubeThumbnail = youtubeVideoId 
    ? `https://img.youtube.com/vi/${youtubeVideoId}/maxresdefault.jpg`
    : imageUrl || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=300&fit=crop';



  const finalPrice = discountedPrice || originalPrice;

  return (
    <Link 
      to={`/game/${_id}`}
      className="block bg-[#2C2C2C] rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group w-full min-w-0"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image/Video Container - Wider aspect ratio for better video preview */}
      <div className="relative aspect-[16/9] overflow-hidden">
        <img 
          src={imageUrl || youtubeThumbnail}
          alt={title}
          className={`w-full h-full object-cover transition-opacity duration-500 ${
            isHovered && youtubeVideoId ? 'opacity-0' : 'opacity-100'
          }`}
        />
        
        {/* YouTube Video Autoplay - Only show if we have a valid video URL */}
        {youtubeVideoId && (
          <div className={`absolute inset-0 transition-opacity duration-500 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}>
            {isHovered ? (
              <iframe
                src={`https://www.youtube.com/embed/${youtubeVideoId}?autoplay=1&mute=1&controls=0&showinfo=0&rel=0&modestbranding=1&loop=1&playlist=${youtubeVideoId}`}
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
        )}
        
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
                            <span className="text-white font-bold text-xl">{finalPrice} DZD</span>
                {discount > 0 && (
                  <span className="text-gray-400 line-through text-base">{originalPrice} DZD</span>
                )}
          </div>
          
          {/* Add to Cart Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              // Add to cart functionality will be handled by the parent component
            }}
            className="bg-[#FF6600] hover:bg-[#e55a00] text-white px-4 py-2 rounded-lg font-semibold transition-colors duration-200 text-sm"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </Link>
  );
};

export default GameCard;