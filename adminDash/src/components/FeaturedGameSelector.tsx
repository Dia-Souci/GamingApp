import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Star, X, Loader2 } from 'lucide-react';
import { Button } from './UI/Button';
import { Card } from './UI/Card';
import { gamesService } from '../services/api';

interface Game {
  _id: string;
  title: string;
  originalPrice: number;
  discountedPrice?: number;
  discount?: number;
  imageUrl?: string;
  platform: string;
}

interface FeaturedGameSelectorProps {
  currentFeaturedGameId?: string | null;
  onGameSelected: (gameId: string) => void;
  onRemoveFeatured: () => void;
  onClose: () => void;
}

export const FeaturedGameSelector: React.FC<FeaturedGameSelectorProps> = ({
  currentFeaturedGameId,
  onGameSelected,
  onRemoveFeatured,
  onClose
}) => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [currentFeaturedGame, setCurrentFeaturedGame] = useState<Game | null>(null);

  useEffect(() => {
    loadGames();
  }, []);

  useEffect(() => {
    if (currentFeaturedGameId) {
      loadCurrentFeaturedGame();
    }
  }, [currentFeaturedGameId]);

  const loadGames = async () => {
    try {
      setLoading(true);
      const response = await gamesService.getAll({ limit: 100 });
      setGames(response.data || []);
    } catch (error) {
      console.error('Failed to load games:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCurrentFeaturedGame = async () => {
    if (!currentFeaturedGameId) return;
    
    try {
      const game = await gamesService.getById(currentFeaturedGameId);
      setCurrentFeaturedGame(game);
    } catch (error) {
      console.error('Failed to load current featured game:', error);
    }
  };

  const filteredGames = games.filter(game =>
    game.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleGameSelect = (game: Game) => {
    setSelectedGame(game);
  };

  const handleConfirmSelection = () => {
    if (selectedGame) {
      onGameSelected(selectedGame._id);
      onClose();
    }
  };

  const handleRemoveFeatured = () => {
    onRemoveFeatured();
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-[#2a2f35] border border-[#3a3f45] rounded-lg p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Select Featured Game</h2>
          <Button variant="secondary" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Current Featured Game */}
        {currentFeaturedGame && (
          <Card className="mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-[#1b1f24] rounded-lg overflow-hidden">
                  <img
                    src={currentFeaturedGame.imageUrl || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=300&fit=crop'}
                    alt={currentFeaturedGame.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-white font-semibold">{currentFeaturedGame.title}</h3>
                  <p className="text-[#c4c4c4] text-sm capitalize">{currentFeaturedGame.platform}</p>
                  <div className="flex items-center gap-2 mt-1">
                                         <span className="text-white font-bold">
                       {currentFeaturedGame.discountedPrice || currentFeaturedGame.originalPrice} DZD
                     </span>
                     {currentFeaturedGame.discount > 0 && (
                       <span className="text-red-400 text-sm line-through">
                         {currentFeaturedGame.originalPrice} DZD
                       </span>
                     )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <span className="text-yellow-400 font-semibold">Currently Featured</span>
                <Button
                  onClick={handleRemoveFeatured}
                  variant="secondary"
                  className="text-red-400 hover:text-red-300"
                >
                  Remove
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#c4c4c4] w-5 h-5" />
            <input
              type="text"
              placeholder="Search games..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-[#1b1f24] border border-[#3a3f45] rounded-lg text-white placeholder-[#c4c4c4] focus:outline-none focus:border-[#ff5100] transition-colors"
            />
          </div>
        </div>

        {/* Games Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-[#ff5100]" />
            <span className="ml-3 text-[#c4c4c4]">Loading games...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
            {filteredGames.map((game) => (
              <div
                key={game._id}
                onClick={() => handleGameSelect(game)}
                className={`p-4 bg-[#1b1f24] rounded-lg border-2 cursor-pointer transition-all hover:border-[#ff5100] ${
                  selectedGame?._id === game._id ? 'border-[#ff5100]' : 'border-[#3a3f45]'
                }`}
              >
                <div className="aspect-video bg-[#2a2f35] rounded-lg overflow-hidden mb-3">
                  <img
                    src={game.imageUrl || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=300&fit=crop'}
                    alt={game.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-white font-semibold text-sm mb-2 line-clamp-2">{game.title}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-[#c4c4c4] text-xs capitalize">{game.platform}</span>
                  <div className="flex items-center gap-1">
                                         <span className="text-white font-bold text-sm">
                       {game.discountedPrice || game.originalPrice} DZD
                     </span>
                     {game.discount > 0 && (
                       <span className="text-red-400 text-xs line-through">
                         {game.originalPrice} DZD
                       </span>
                     )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4 mt-6 pt-4 border-t border-[#3a3f45]">
          <Button
            onClick={handleConfirmSelection}
            disabled={!selectedGame}
            className="flex-1"
          >
            Set as Featured Game
          </Button>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};
