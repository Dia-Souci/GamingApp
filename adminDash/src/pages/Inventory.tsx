import React, { useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Edit, Trash2, Upload, AlertTriangle, Loader2 } from 'lucide-react';
import { Card } from '../components/UI/Card';
import { Button } from '../components/UI/Button';
import { StatusBadge } from '../components/UI/StatusBadge';
import { usePaginatedApi, useApiMutation } from '../hooks/useApi';
import { gamesService, apiUtils, type Game } from '../services/api';

export const Inventory: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'pc' | 'playstation' | 'xbox' | 'nintendo'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showActivationKeys, setShowActivationKeys] = useState(false);
  const [activationKeys, setActivationKeys] = useState<Array<{
    key: string;
    isUsed: boolean;
    addedAt: Date;
    usedAt?: Date;
  }>>([]);
  const [loadingKeys, setLoadingKeys] = useState(false);
  const [newKeys, setNewKeys] = useState('');
  
  // Memoize the API call function to prevent recreation on every render
  const apiCall = useCallback((page: number, limit: number) => 
    gamesService.getAll({
      page,
      limit,
      platform: activeTab !== 'all' ? activeTab : undefined,
      search: searchTerm || undefined,
    }), [activeTab, searchTerm]);

  // Memoize the filters object to prevent recreation on every render
  const filters = useMemo(() => ({
    activeTab,
    searchTerm
  }), [activeTab, searchTerm]);
  
  const {
    data: games,
    loading,
    error,
    currentPage,
    totalPages,
    goToPage,
    refetch
  } = usePaginatedApi(apiCall, 1, 12, filters);

  const { mutate: updateGame, loading: updating } = useApiMutation();
  const { mutate: deleteGame, loading: deleting } = useApiMutation();

  // Load activation keys for a game
  const loadActivationKeys = async (gameId: string) => {
    setLoadingKeys(true);
    try {
      const keys = await gamesService.getActivationKeys(gameId);
      setActivationKeys(keys);
    } catch (error) {
      console.error('Failed to load activation keys:', error);
    } finally {
      setLoadingKeys(false);
    }
  };

  // Add new activation keys
  const handleAddKeys = async () => {
    if (!selectedGame || !newKeys.trim()) return;
    
    const keysArray = newKeys.split('\n').map(key => key.trim()).filter(Boolean);
    if (keysArray.length === 0) return;

    try {
      await gamesService.addActivationKeys(selectedGame._id, keysArray);
      setNewKeys('');
      await loadActivationKeys(selectedGame._id);
    } catch (error) {
      console.error('Failed to add activation keys:', error);
    }
  };

  const GameForm: React.FC<{ game?: Game; onClose: () => void }> = ({ game, onClose }) => {
    const [formData, setFormData] = useState({
      title: game?.title || '',
      slug: game?.slug || '',
      description: game?.description || '',
      longDescription: game?.longDescription || '',
      platform: game?.platform || 'pc',
      originalPrice: game?.originalPrice || 0,
      discountedPrice: game?.discountedPrice || 0,
      stock: game?.stock || 0,
      developer: game?.developer || '',
      publisher: game?.publisher || '',
      genre: game?.genre?.join(', ') || '',
      tags: game?.tags?.join(', ') || '',
      imageUrl: game?.imageUrl || '',
      heroImageUrl: game?.heroImageUrl || '',
      screenshots: game?.screenshots?.join(', ') || '',
      videoUrl: game?.videoUrl || '',
      featured: game?.featured || false,
      status: game?.status || 'active'
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      
      const gameData = {
        ...formData,
        slug: formData.slug || apiUtils.generateSlug(formData.title),
        genre: formData.genre.split(',').map(g => g.trim()).filter(Boolean),
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
        screenshots: formData.screenshots.split(',').map(s => s.trim()).filter(Boolean),
        discount: formData.discountedPrice > 0 
          ? Math.round(((formData.originalPrice - formData.discountedPrice) / formData.originalPrice) * 100)
          : 0,
        currency: 'DZD', // Set default currency
      };

      const apiCall = game 
        ? (data: Partial<Game>) => gamesService.update(game._id, data)
        : (data: Omit<Game, '_id' | 'createdAt' | 'updatedAt'>) => gamesService.create(data);

      updateGame(apiCall as (params: unknown) => Promise<Game>, gameData as unknown).then((result) => {
        if (result) {
          refetch();
          onClose();
        }
      });
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
          className="bg-[#2a2f35] border border-[#3a3f45] rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">
              {game ? 'Edit Game' : 'Add New Game'}
            </h2>
            <Button variant="secondary" onClick={onClose}>
              Close
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#c4c4c4] mb-2">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 bg-[#1b1f24] border border-[#3a3f45] rounded-lg text-white placeholder-[#c4c4c4] focus:outline-none focus:border-[#ff5100] transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#c4c4c4] mb-2">Slug</label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                onBlur={(e) => {
                  if (!e.target.value && formData.title) {
                    setFormData({ ...formData, slug: apiUtils.generateSlug(formData.title) });
                  }
                }}
                className="w-full px-4 py-2 bg-[#1b1f24] border border-[#3a3f45] rounded-lg text-white placeholder-[#c4c4c4] focus:outline-none focus:border-[#ff5100] transition-colors"
                placeholder="Auto-generated from title"
              />
              <p className="text-xs text-[#c4c4c4] mt-1">Leave empty to auto-generate from title</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#c4c4c4] mb-2">Developer</label>
                <input
                  type="text"
                  value={formData.developer}
                  onChange={(e) => setFormData({ ...formData, developer: e.target.value })}
                  className="w-full px-4 py-2 bg-[#1b1f24] border border-[#3a3f45] rounded-lg text-white placeholder-[#c4c4c4] focus:outline-none focus:border-[#ff5100] transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#c4c4c4] mb-2">Publisher</label>
                <input
                  type="text"
                  value={formData.publisher}
                  onChange={(e) => setFormData({ ...formData, publisher: e.target.value })}
                  className="w-full px-4 py-2 bg-[#1b1f24] border border-[#3a3f45] rounded-lg text-white placeholder-[#c4c4c4] focus:outline-none focus:border-[#ff5100] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#c4c4c4] mb-2">Platform</label>
              <select
                value={formData.platform}
                onChange={(e) => setFormData({ ...formData, platform: e.target.value as 'pc' | 'playstation' | 'xbox' | 'nintendo' })}
                className="w-full px-4 py-2 bg-[#1b1f24] border border-[#3a3f45] rounded-lg text-white focus:outline-none focus:border-[#ff5100] transition-colors"
                required
              >
                <option value="pc">PC</option>
                <option value="playstation">PlayStation</option>
                <option value="xbox">Xbox</option>
                <option value="nintendo">Nintendo</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#c4c4c4] mb-2">Original Price (DZD)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.originalPrice}
                  onChange={(e) => setFormData({ ...formData, originalPrice: parseFloat(e.target.value) })}
                  className="w-full px-4 py-2 bg-[#1b1f24] border border-[#3a3f45] rounded-lg text-white placeholder-[#c4c4c4] focus:outline-none focus:border-[#ff5100] transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#c4c4c4] mb-2">Discounted Price (DZD)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.discountedPrice}
                  onChange={(e) => setFormData({ ...formData, discountedPrice: parseFloat(e.target.value) })}
                  className="w-full px-4 py-2 bg-[#1b1f24] border border-[#3a3f45] rounded-lg text-white placeholder-[#c4c4c4] focus:outline-none focus:border-[#ff5100] transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#c4c4c4] mb-2">Stock</label>
                <input
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 bg-[#1b1f24] border border-[#3a3f45] rounded-lg text-white placeholder-[#c4c4c4] focus:outline-none focus:border-[#ff5100] transition-colors"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#c4c4c4] mb-2">Genre (comma separated)</label>
                <input
                  type="text"
                  value={formData.genre}
                  onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                  className="w-full px-4 py-2 bg-[#1b1f24] border border-[#3a3f45] rounded-lg text-white placeholder-[#c4c4c4] focus:outline-none focus:border-[#ff5100] transition-colors"
                  placeholder="Action, RPG, Adventure"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#c4c4c4] mb-2">Tags (comma separated)</label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  className="w-full px-4 py-2 bg-[#1b1f24] border border-[#3a3f45] rounded-lg text-white placeholder-[#c4c4c4] focus:outline-none focus:border-[#ff5100] transition-colors"
                  placeholder="Open World, Story Rich, Multiplayer"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#c4c4c4] mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' | 'out_of_stock'})}
                  className="w-full px-4 py-2 bg-[#1b1f24] border border-[#3a3f45] rounded-lg text-white focus:outline-none focus:border-[#ff5100] transition-colors"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="out_of_stock">Out of Stock</option>
                </select>
              </div>

              <div className="flex items-center pt-6">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="rounded border-[#3a3f45] bg-[#1b1f24] text-[#ff5100] focus:ring-[#ff5100]/20"
                />
                <label htmlFor="featured" className="ml-2 text-[#c4c4c4]">Featured Game</label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#c4c4c4] mb-2">Game Image URL</label>
              <input
                type="url"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                className="w-full px-4 py-2 bg-[#1b1f24] border border-[#3a3f45] rounded-lg text-white placeholder-[#c4c4c4] focus:outline-none focus:border-[#ff5100] transition-colors"
                placeholder="https://example.com/game-image.jpg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#c4c4c4] mb-2">Hero Image URL</label>
              <input
                type="url"
                value={formData.heroImageUrl}
                onChange={(e) => setFormData({ ...formData, heroImageUrl: e.target.value })}
                className="w-full px-4 py-2 bg-[#1b1f24] border border-[#3a3f45] rounded-lg text-white placeholder-[#c4c4c4] focus:outline-none focus:border-[#ff5100] transition-colors"
                placeholder="https://example.com/hero-image.jpg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#c4c4c4] mb-2">Screenshots URLs (comma separated)</label>
              <textarea
                value={formData.screenshots}
                onChange={(e) => setFormData({ ...formData, screenshots: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 bg-[#1b1f24] border border-[#3a3f45] rounded-lg text-white placeholder-[#c4c4c4] focus:outline-none focus:border-[#ff5100] transition-colors resize-none"
                placeholder="https://example.com/screenshot1.jpg, https://example.com/screenshot2.jpg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#c4c4c4] mb-2">Video URL</label>
              <input
                type="url"
                value={formData.videoUrl}
                onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                className="w-full px-4 py-2 bg-[#1b1f24] border border-[#3a3f45] rounded-lg text-white placeholder-[#c4c4c4] focus:outline-none focus:border-[#ff5100] transition-colors"
                placeholder="https://www.youtube.com/watch?v=..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#c4c4c4] mb-2">Short Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 bg-[#1b1f24] border border-[#3a3f45] rounded-lg text-white placeholder-[#c4c4c4] focus:outline-none focus:border-[#ff5100] transition-colors resize-none"
                placeholder="Brief description of the game"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#c4c4c4] mb-2">Long Description</label>
              <textarea
                value={formData.longDescription}
                onChange={(e) => setFormData({ ...formData, longDescription: e.target.value })}
                rows={5}
                className="w-full px-4 py-2 bg-[#1b1f24] border border-[#3a3f45] rounded-lg text-white placeholder-[#c4c4c4] focus:outline-none focus:border-[#ff5100] transition-colors resize-none"
                placeholder="Detailed description of the game with features, gameplay, etc."
              />
            </div>

            {/* Media Previews */}
            {(formData.imageUrl || formData.heroImageUrl || formData.screenshots || formData.videoUrl) && (
              <div className="border-t border-[#3a3f45] pt-4">
                <h3 className="text-lg font-semibold text-white mb-3">Media Previews</h3>
                
                {/* Image Previews */}
                {(formData.imageUrl || formData.heroImageUrl || formData.screenshots) && (
                  <div className="mb-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {formData.imageUrl && (
                        <div>
                          <p className="text-sm text-[#c4c4c4] mb-2">Game Image:</p>
                          <img 
                            src={formData.imageUrl} 
                            alt="Game preview" 
                            className="w-full h-32 object-cover rounded-lg border border-[#3a3f45]"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        </div>
                      )}
                      {formData.heroImageUrl && (
                        <div>
                          <p className="text-sm text-[#c4c4c4] mb-2">Hero Image:</p>
                          <img 
                            src={formData.heroImageUrl} 
                            alt="Hero preview" 
                            className="w-full h-32 object-cover rounded-lg border border-[#3a3f45]"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        </div>
                      )}
                    </div>
                    {formData.screenshots && (
                      <div className="mt-4">
                        <p className="text-sm text-[#c4c4c4] mb-2">Screenshots:</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                          {formData.screenshots.split(',').map((url, index) => {
                            const trimmedUrl = url.trim();
                            if (!trimmedUrl) return null;
                            return (
                              <img 
                                key={index}
                                src={trimmedUrl} 
                                alt={`Screenshot ${index + 1}`} 
                                className="w-full h-20 object-cover rounded border border-[#3a3f45]"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Video Preview */}
                {formData.videoUrl && (
                  <div>
                    <p className="text-sm text-[#c4c4c4] mb-2">Video Preview:</p>
                    <div className="bg-[#1b1f24] rounded-lg p-4 border border-[#3a3f45]">
                      <p className="text-[#c4c4c4] text-sm">
                        Video URL: <a href={formData.videoUrl} target="_blank" rel="noopener noreferrer" className="text-[#ff5100] hover:underline">{formData.videoUrl}</a>
                      </p>
                      <p className="text-[#c4c4c4] text-xs mt-1">Click the link to view the video</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-4 pt-4">
              <Button type="submit" className="flex-1">
                {game ? 'Update Game' : 'Add Game'}
              </Button>
              <Button type="button" variant="secondary" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    );
  };

  // Activation Keys Modal
  const ActivationKeysModal: React.FC = () => {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={() => setShowActivationKeys(false)}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-[#2a2f35] border border-[#3a3f45] rounded-lg p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white">Activation Keys</h2>
              <p className="text-[#c4c4c4]">{selectedGame?.title}</p>
            </div>
            <Button variant="secondary" onClick={() => setShowActivationKeys(false)}>
              Close
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Add New Keys */}
            <div className="bg-[#1b1f24] rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-3">Add New Keys</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-[#c4c4c4] mb-1">
                    Activation Keys (one per line)
                  </label>
                  <textarea
                    value={newKeys}
                    onChange={(e) => setNewKeys(e.target.value)}
                    rows={6}
                    className="w-full px-3 py-2 bg-[#2a2f35] border border-[#3a3f45] rounded text-white text-sm resize-none font-mono"
                    placeholder="XXXXX-XXXXX-XXXXX-XXXXX&#10;YYYYY-YYYYY-YYYYY-YYYYY&#10;ZZZZZ-ZZZZZ-ZZZZZ-ZZZZZ"
                  />
                </div>
                <Button
                  onClick={handleAddKeys}
                  disabled={loadingKeys || !newKeys.trim()}
                  className="w-full"
                >
                  {loadingKeys ? 'Adding Keys...' : 'Add Keys'}
                </Button>
              </div>
            </div>

            {/* Existing Keys */}
            <div className="bg-[#1b1f24] rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-3">Existing Keys</h3>
              {loadingKeys ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-[#ff5100]" />
                  <span className="ml-2 text-[#c4c4c4]">Loading keys...</span>
                </div>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {activationKeys.length === 0 ? (
                    <p className="text-[#c4c4c4] text-sm text-center py-4">No activation keys found</p>
                  ) : (
                    activationKeys.map((key, index) => (
                      <div
                        key={index}
                        className={`p-2 rounded text-sm font-mono ${
                          key.isUsed
                            ? 'bg-red-900/20 text-red-400 border border-red-500/30'
                            : 'bg-green-900/20 text-green-400 border border-green-500/30'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span>{key.key}</span>
                          <span className="text-xs">
                            {key.isUsed ? 'Used' : 'Available'}
                          </span>
                        </div>
                        {key.isUsed && key.usedAt && (
                          <div className="text-xs text-[#c4c4c4] mt-1">
                            Used: {apiUtils.formatDate(key.usedAt)}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}
              
              <div className="mt-4 pt-3 border-t border-[#3a3f45]">
                <div className="flex justify-between text-sm">
                  <span className="text-[#c4c4c4]">Total Keys:</span>
                  <span className="text-white">{activationKeys.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#c4c4c4]">Available:</span>
                  <span className="text-green-400">
                    {activationKeys.filter(k => !k.isUsed).length}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#c4c4c4]">Used:</span>
                  <span className="text-red-400">
                    {activationKeys.filter(k => k.isUsed).length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  const handleDelete = async (gameId: string) => {
    if (window.confirm('Are you sure you want to delete this game?')) {
      const result = await deleteGame(
        ((id: unknown) => gamesService.delete(id as string)) as (params: unknown) => Promise<unknown>,
        gameId as unknown
      );
      
      if (result) {
        refetch();
      }
    }
  };

  if (loading && !games.length) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#ff5100] animate-spin mx-auto mb-4" />
          <p className="text-[#c4c4c4]">Loading games...</p>
        </div>
      </div>
    );
  }

  if (error && !games.length) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="text-red-400 mb-2">Failed to load games</p>
          <p className="text-[#c4c4c4] text-sm">{error}</p>
          <Button onClick={refetch} className="mt-4">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-white">Inventory Management</h1>
          <p className="text-[#c4c4c4] mt-1">Manage your game catalog and inventory</p>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Game
        </Button>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                activeTab === 'all'
                  ? 'bg-gradient-to-r from-[#ff5100] to-[#e64400] text-white'
                  : 'text-[#c4c4c4] hover:text-white hover:bg-[#3a3f45]'
              }`}
            >
              All Games
            </button>
            <button
              onClick={() => setActiveTab('pc')}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                activeTab === 'pc'
                  ? 'bg-gradient-to-r from-[#ff5100] to-[#e64400] text-white'
                  : 'text-[#c4c4c4] hover:text-white hover:bg-[#3a3f45]'
              }`}
            >
              PC
            </button>
            <button
              onClick={() => setActiveTab('playstation')}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                activeTab === 'playstation'
                  ? 'bg-gradient-to-r from-[#ff5100] to-[#e64400] text-white'
                  : 'text-[#c4c4c4] hover:text-white hover:bg-[#3a3f45]'
              }`}
            >
              PlayStation
            </button>
            <button
              onClick={() => setActiveTab('xbox')}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                activeTab === 'xbox'
                  ? 'bg-gradient-to-r from-[#ff5100] to-[#e64400] text-white'
                  : 'text-[#c4c4c4] hover:text-white hover:bg-[#3a3f45]'
              }`}
            >
              Xbox
            </button>
            <button
              onClick={() => setActiveTab('nintendo')}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                activeTab === 'nintendo'
                  ? 'bg-gradient-to-r from-[#ff5100] to-[#e64400] text-white'
                  : 'text-[#c4c4c4] hover:text-white hover:bg-[#3a3f45]'
              }`}
            >
              Nintendo
            </button>
          </div>

          <div className="mt-4">
            <div className="relative">
              <Search className="w-5 h-5 text-[#c4c4c4] absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search games..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[#1b1f24] border border-[#3a3f45] rounded-lg text-white placeholder-[#c4c4c4] focus:outline-none focus:border-[#ff5100] transition-colors"
              />
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Games Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {games.map((game, index) => (
          <motion.div
            key={game._id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card hover className="h-full">
              <div className="aspect-video bg-[#1b1f24] rounded-lg mb-4 overflow-hidden">
                {game.imageUrl ? (
                  <img
                    src={game.imageUrl}
                    alt={game.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-[#c4c4c4]">No Image</span>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <div>
                  <h3 className="text-lg font-semibold text-white">{game.title}</h3>
                  <p className="text-[#c4c4c4] text-sm">{game.developer}</p>
                  <p className="text-[#c4c4c4] text-sm capitalize">{game.platform}</p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-xl font-bold text-[#ff5100]">
                      {apiUtils.formatCurrency(game.discountedPrice || game.originalPrice, game.currency || 'DZD')}
                    </span>
                    {game.discountedPrice && game.discountedPrice < game.originalPrice && (
                      <span className="text-sm text-[#c4c4c4] line-through">
                        {apiUtils.formatCurrency(game.originalPrice, game.currency || 'DZD')}
                      </span>
                    )}
                  </div>
                  <StatusBadge status={game.status} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-[#c4c4c4] text-sm">
                    <p>Stock: {game.stock}</p>
                    <p>Views: {game.viewCount || 0}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => {
                        setSelectedGame(game);
                        setShowForm(true);
                      }}
                      disabled={updating}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => {
                        setSelectedGame(game);
                        setShowActivationKeys(true);
                        loadActivationKeys(game._id);
                      }}
                    >
                      Keys
                    </Button>
                    <Button 
                      size="sm" 
                      variant="danger"
                      onClick={() => handleDelete(game._id)}
                      disabled={deleting}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span className="text-white px-4 py-2">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}

      {games.length === 0 && !loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <p className="text-[#c4c4c4] text-lg">No games found</p>
        </motion.div>
      )}

      {/* Game Form Modal */}
      {showForm && (
        <GameForm
          game={selectedGame || undefined}
          onClose={() => {
            setShowForm(false);
            setSelectedGame(null);
          }}
        />
      )}

      {/* Activation Keys Modal */}
      {showActivationKeys && <ActivationKeysModal />}
    </div>
  );
};