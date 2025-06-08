import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Heart, ShoppingCart, Users, Download, CheckCircle, Star } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { useCartStore } from '../store/cartStore';

const GameDetailPage: React.FC = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const getGameById = useGameStore(state => state.getGameById);
  const addToCart = useCartStore(state => state.addToCart);
  
  if (!gameId) {
    return <Navigate to="/" replace />;
  }

  const game = getGameById(gameId);

  if (!game) {
    return <Navigate to="/" replace />;
  }

  const handleAddToCart = () => {
    addToCart({
      id: game.id,
      title: game.title,
      platform: game.platform,
      originalPrice: game.originalPrice,
      discountedPrice: game.discountedPrice,
      discount: game.discount,
      imageUrl: game.imageUrl
    });
  };

  return (
    <>
      <Helmet>
        <title>{game.title} - InstantGaming</title>
        <meta name="description" content={game.description} />
      </Helmet>

      <div className="min-h-screen bg-[#2a2a2e] ">
        {/* Hero Banner Section */}
        <section className="relative">
          <div 
            className="h-[500px] bg-cover bg-center relative"
            style={{
              backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url('${game.heroImageUrl}')`
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
                    In Stock
                  </div>
                </div>

                {/* Game Title */}
                <h1 className="text-2xl font-bold text-[#f2f2f2] mb-2">{game.title}</h1>
                
                {/* Delivery Method */}
                <div className="flex items-center text-gray-300 text-sm mb-2">
                  <Download className="w-4 h-4 mr-2" />
                  {game.deliveryMethod}
                </div>

                {/* Users on Page */}
                <div className="flex items-center text-gray-300 text-sm mb-4">
                  <Users className="w-4 h-4 mr-2" />
                  {game.usersOnPage} users viewing this page
                </div>

                {/* Price Section */}
                <div className="mb-6">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-3xl font-bold text-[#f2f2f2]">${game.discountedPrice}</span>
                    {game.discount > 0 && (
                      <>
                        <span className="text-lg text-gray-400 line-through">${game.originalPrice}</span>
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
                  {game.tags.map((tag, index) => (
                    <span 
                      key={index}
                      className="bg-[#2a2a2e] text-[#f2f2f2] px-3 py-1 rounded-full text-sm border border-gray-600 hover:border-[#ff5b00] transition-colors duration-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Reviews Section */}
              <div className="bg-[#1a1a1e] rounded-lg p-6 border border-gray-700">
                <h3 className="text-xl font-bold text-[#f2f2f2] mb-4">User Reviews</h3>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-[#ff5b00] to-[#ff3300] text-white font-bold text-xl">
                    {game.reviewScore}
                  </div>
                  <div>
                    <div className="flex items-center space-x-1 mb-1">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-5 h-5 ${
                            i < Math.floor(game.reviewScore / 2) 
                              ? 'text-yellow-400 fill-current' 
                              : 'text-gray-400'
                          }`} 
                        />
                      ))}
                    </div>
                    <p className="text-[#f2f2f2] font-semibold">Excellent</p>
                    <p className="text-gray-400 text-sm">{game.totalReviews.toLocaleString()} reviews</p>
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
                    <span className="text-[#f2f2f2]">{game.genre.join(', ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Release Date:</span>
                    <span className="text-[#f2f2f2]">{game.releaseDate}</span>
                  </div>
                </div>
              </div>

              {/* Activation Instructions */}
              <div className="bg-[#1a1a1e] rounded-lg p-6 border border-gray-700">
                <h3 className="text-xl font-bold text-[#f2f2f2] mb-4">Activation</h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {game.activationInstructions}
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