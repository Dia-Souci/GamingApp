import React, { useEffect, useState } from 'react';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Heart, ShoppingCart, Users, Download, CheckCircle, Star, Loader2 } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { useCartStore } from '../store/cartStore';
import { Game } from '../store/gameStore';

const GameDetailPage: React.FC = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();
  const [game, setGame] = useState<Game | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { fetchGameById } = useGameStore();
  const addToCart = useCartStore(state => state.addToCart);
  
  useEffect(() => {
    const loadGame = async () => {
      if (!gameId) return;
      
      try {
        setIsLoading(true);
        setError(null);
        const gameData = await fetchGameById(gameId);
        if (gameData) {
          setGame(gameData);
        } else {
          setError('Game not found');
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to load game');
      } finally {
        setIsLoading(false);
      }
    };

    loadGame();
  }, [gameId, fetchGameById]);

  if (!gameId) {
    return <Navigate to="/" replace />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#2a2a2e] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#FF6600] animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">Loading game details...</p>
        </div>
      </div>
    );
  }

  if (error || !game) {
    return (
      <div className="min-h-screen bg-[#2a2a2e] flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6 mb-4">
            <p className="text-red-400 text-lg mb-4">{error || 'Game not found'}</p>
            <button
              onClick={() => navigate('/')}
              className="bg-[#FF6600] hover:bg-[#e55a00] text-white px-6 py-2 rounded transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart({
      id: game._id,
      title: game.title,
      platform: game.platform,
      originalPrice: game.originalPrice,
      discountedPrice: game.discountedPrice || game.originalPrice,
      discount: game.discount || 0,
      imageUrl: game.imageUrl || ''
    });
    
    // Navigate to cart page after adding the item
    navigate('/cart');
  };

  return (
    <>
      <Helmet>
        <title>{game.title} - RedHawk Gaming</title>
        <meta name="description" content={game.description} />
      </Helmet>

      <div className="min-h-screen bg-[#2a2a2e] ">
        {/* Hero Banner Section */}
        <section className="relative">
          <div 
            className="h-[500px] bg-cover bg-center relative"
            style={{
              backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url('${game.heroImageUrl || game.imageUrl}')`
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
            
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-end pb-8">
              {/* Floating Game Info Card */}
              <div className="bg-[#1a1a1e] rounded-lg p-6 shadow-2xl border border-gray-700 max-w-md w-full">
                {/* Platform Badge */}
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-[#ff5b00] text-white px-3 py-1 rounded-full text-sm font-medium">
                    {game.platform}
                  </div>
                  <div className="flex items-center text-green-400 text-sm">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    {game.stock > 0 ? 'In Stock' : 'Out of Stock'}
                  </div>
                </div>

                {/* Game Title */}
                <h1 className="text-2xl font-bold text-[#f2f2f2] mb-2">{game.title}</h1>
                
                {/* Delivery Method */}
                <div className="flex items-center text-gray-300 text-sm mb-2">
                  <Download className="w-4 h-4 mr-2" />
                  {game.deliveryMethod || 'Digital Download'}
                </div>

                {/* Users on Page */}
                <div className="flex items-center text-gray-300 text-sm mb-4">
                  <Users className="w-4 h-4 mr-2" />
                  {game.viewCount || 0} users viewing this page
                </div>

                {/* Price Section */}
                <div className="mb-6">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-3xl font-bold text-[#f2f2f2]">
                      {game.discountedPrice || game.originalPrice} DZD
                    </span>
                    {game.discount && game.discount > 0 && (
                      <>
                        <span className="text-lg text-gray-400 line-through">{game.originalPrice} DZD</span>
                        <span className="bg-red-600 text-white px-2 py-1 rounded text-sm font-bold">
                          -{game.discount}%
                        </span>
                      </>
                    )}
                  </div>
                  <p className="text-gray-400 text-sm">Lowest price guarantee</p>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button 
                    onClick={handleAddToCart}
                    className="w-full bg-gradient-to-r from-[#ff5b00] to-[#ff3300] hover:from-[#e54e00] hover:to-[#e52e00] text-white py-3 px-4 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-all duration-200 shadow-lg"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    <span>Add to Cart</span>
                  </button>
                  
                  <button className="w-full bg-transparent border-2 border-gray-600 hover:border-[#ff5b00] text-[#f2f2f2] py-3 px-4 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-all duration-200">
                    <Heart className="w-5 h-5" />
                    <span>Add to Wishlist</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* About Section */}
              <div className="bg-[#1a1a1e] rounded-lg p-6 border border-gray-700">
                <h2 className="text-2xl font-bold text-[#f2f2f2] mb-4">About this game</h2>
                <p className="text-gray-300 leading-relaxed">{game.description}</p>
              </div>

              {/* Tags Section */}
              <div className="bg-[#1a1a1e] rounded-lg p-6 border border-gray-700">
                <h3 className="text-xl font-bold text-[#f2f2f2] mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {game.tags?.map((tag, index) => (
                    <span 
                      key={index}
                      className="bg-[#2a2a2e] text-[#f2f2f2] px-3 py-1 rounded-full text-sm border border-gray-600 hover:border-[#ff5b00] transition-colors duration-200"
                    >
                      {tag}
                    </span>
                  )) || <span className="text-gray-400">No tags available</span>}
                </div>
              </div>

              {/* Reviews Section */}
              <div className="bg-[#1a1a1e] rounded-lg p-6 border border-gray-700">
                <h3 className="text-xl font-bold text-[#f2f2f2] mb-4">User Reviews</h3>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-[#ff5b00] to-[#ff3300] text-white font-bold text-xl">
                    {game.reviewScore || 'N/A'}
                  </div>
                  <div>
                    <div className="flex items-center space-x-1 mb-1">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-5 h-5 ${
                            i < Math.floor((game.reviewScore || 0) / 2) 
                              ? 'text-yellow-400 fill-current' 
                              : 'text-gray-400'
                          }`} 
                        />
                      ))}
                    </div>
                    <p className="text-[#f2f2f2] font-semibold">Excellent</p>
                    <p className="text-gray-400 text-sm">{(game.totalReviews || 0).toLocaleString()} reviews</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Game Details */}
              <div className="bg-[#1a1a1e] rounded-lg p-6 border border-gray-700">
                <h3 className="text-xl font-bold text-[#f2f2f2] mb-4">Game Details</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Developer:</span>
                    <span className="text-[#f2f2f2]">{game.developer}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Publisher:</span>
                    <span className="text-[#f2f2f2]">{game.publisher}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Genre:</span>
                    <span className="text-[#f2f2f2]">{game.genre?.join(', ') || 'Not specified'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Release Date:</span>
                    <span className="text-[#f2f2f2]">{game.releaseDate ? new Date(game.releaseDate).toLocaleDateString() : 'Not specified'}</span>
                  </div>
                </div>
              </div>

              {/* Activation Instructions */}
              <div className="bg-[#1a1a1e] rounded-lg p-6 border border-gray-700">
                <h3 className="text-xl font-bold text-[#f2f2f2] mb-4">Activation</h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Digital download. You will receive your game key via email after purchase.
                </p>
              </div>

              {/* System Requirements Placeholder */}
              <div className="bg-[#1a1a1e] rounded-lg p-6 border border-gray-700">
                <h3 className="text-xl font-bold text-[#f2f2f2] mb-4">System Requirements</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-400">OS:</span>
                    <span className="text-[#f2f2f2] ml-2">Windows 10 64-bit</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Processor:</span>
                    <span className="text-[#f2f2f2] ml-2">Intel Core i5-3570K</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Memory:</span>
                    <span className="text-[#f2f2f2] ml-2">8 GB RAM</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Graphics:</span>
                    <span className="text-[#f2f2f2] ml-2">NVIDIA GTX 780</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default GameDetailPage;