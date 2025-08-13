import React, { useState, useEffect } from 'react';
import { websiteSettingsApi, type WebsiteSettings } from '../services/websiteSettingsApi';
import { gameService } from '../services/api';

interface Game {
  _id: string;
  title: string;
  originalPrice: number;
  discountedPrice?: number;
  discount?: number;
  imageUrl?: string;
  platform: string;
}

const Hero: React.FC = () => {
  const [settings, setSettings] = useState<WebsiteSettings | null>(null);
  const [featuredGame, setFeaturedGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await websiteSettingsApi.getSettings();
        setSettings(data);
        
        // Load featured game if one is set
        if (data.featuredGame) {
          try {
            const game = await gameService.getById(data.featuredGame);
            setFeaturedGame(game);
          } catch (error) {
            console.error('Failed to load featured game:', error);
          }
        }
      } catch (error) {
        console.error('Failed to load website settings:', error);
        // Use default settings if API fails
        setSettings({
          name: 'main',
          heroImageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&h=600&fit=crop',
          displayedCategories: ['pc', 'playstation', 'xbox', 'nintendo'],
          featuredGame: null,
          isActive: true,
        });
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  if (loading) {
    return (
      <section className="relative bg-[#1E1E1E]">
        <div className="relative">
          <div className="relative bg-gradient-to-r from-purple-900/50 to-blue-900/50 min-h-[1000px] flex items-center">
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
              <div className="animate-pulse">
                <div className="h-8 bg-gray-700 rounded-full w-32 mb-4"></div>
                <div className="h-16 bg-gray-700 rounded w-96 mb-4"></div>
                <div className="h-8 bg-gray-700 rounded w-64"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative bg-[#1E1E1E]">
      <div className="relative">
        {/* Hero Content */}
        <div className="relative bg-gradient-to-r from-purple-900/50 to-blue-900/50 min-h-[1000px] flex items-center">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
            style={{
              backgroundImage: `url('${settings?.heroImageUrl || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&h=600&fit=crop'}')`
            }}
          />
          
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="max-w-2xl">
              {featuredGame ? (
                <>
                  {/* Featured Badge */}
                  <div className="inline-flex items-center px-3 py-1 bg-[#FF6600] text-white text-sm font-medium rounded-full mb-4">
                    🔥 Featured Deal
                  </div>
                  
                  {/* Game Title */}
                  <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
                    {featuredGame.title}
                    <span className="block text-2xl md:text-3xl text-[#DDDDDD] font-normal mt-2 capitalize">
                      {featuredGame.platform}
                    </span>
                  </h1>
                  
                  {/* Price Section */}
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl md:text-3xl font-bold text-white">
                        {featuredGame.discountedPrice || featuredGame.originalPrice} DZD
                      </span>
                      {featuredGame.discount > 0 && (
                        <span className="text-lg text-gray-400 line-through">
                          {featuredGame.originalPrice} DZD
                        </span>
                      )}
                    </div>
                    {featuredGame.discount > 0 && (
                      <div className="bg-red-600 text-white px-3 py-1 rounded-lg text-sm font-bold">
                        -{featuredGame.discount}%
                      </div>
                    )}
                  </div>
                  

                </>
              ) : (
                <>
                  {/* Default Hero Content */}
                  <div className="inline-flex items-center px-3 py-1 bg-[#FF6600] text-white text-sm font-medium rounded-full mb-4">
                    🎮 Welcome to RedHawk Gaming
                  </div>
                  
                  <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
                    Discover Amazing Games
                    <span className="block text-2xl md:text-3xl text-[#DDDDDD] font-normal mt-2">
                      Best Deals on Digital Games
                    </span>
                  </h1>
                  
                  <p className="text-lg text-[#DDDDDD] mb-6">
                    Explore our collection of premium games with exclusive discounts and instant delivery.
                  </p>
                  
                  <button className="bg-[#FF6600] hover:bg-[#e55a00] text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors duration-200 shadow-lg hover:shadow-xl">
                    Browse Games
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
        
        {/* Diagonal Cut */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-64 bg-[#1E1E1E]"
          style={{
            clipPath: 'polygon(0 100%, 100% 50%, 100% 100%)'
          }}
        />
      </div>
    </section>
  );
};

export default Hero;