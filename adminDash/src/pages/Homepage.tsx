import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Upload, Plus, Edit, Trash2, Eye, EyeOff, Save, X, Star } from 'lucide-react';
import { Card } from '../components/UI/Card';
import { Button } from '../components/UI/Button';
import { websiteSettingsApi, type WebsiteSettings } from '../services/websiteSettingsApi';
import { FeaturedGameSelector } from '../components/FeaturedGameSelector';
import { gamesService } from '../services/api';
import type { CarouselItem } from '../types';

interface Game {
  _id: string;
  title: string;
  originalPrice: number;
  discountedPrice?: number;
  discount?: number;
  imageUrl?: string;
  platform: string;
}

export const Homepage: React.FC = () => {
  const [settings, setSettings] = useState<WebsiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showHeroForm, setShowHeroForm] = useState(false);
  const [showFeaturedGameSelector, setShowFeaturedGameSelector] = useState(false);
  const [currentFeaturedGame, setCurrentFeaturedGame] = useState<Game | null>(null);
  const [saving, setSaving] = useState(false);

  // Load website settings on component mount
  useEffect(() => {
    loadSettings();
  }, []);

  // Load current featured game when settings change
  useEffect(() => {
    if (settings?.featuredGame) {
      loadCurrentFeaturedGame();
    } else {
      setCurrentFeaturedGame(null);
    }
  }, [settings?.featuredGame]);

  const loadSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await websiteSettingsApi.getSettings();
      setSettings(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load website settings');
    } finally {
      setLoading(false);
    }
  };

  const loadCurrentFeaturedGame = async () => {
    if (!settings?.featuredGame) return;
    
    try {
      const game = await gamesService.getById(settings.featuredGame);
      setCurrentFeaturedGame(game);
    } catch (error) {
      console.error('Failed to load current featured game:', error);
      setCurrentFeaturedGame(null);
    }
  };

  const toggleCategory = async (category: string) => {
    if (!settings) return;

    const newCategories = settings.displayedCategories.includes(category)
      ? settings.displayedCategories.filter(c => c !== category)
      : [...settings.displayedCategories, category];

    await updateSettings({ displayedCategories: newCategories });
  };

  const updateSettings = async (updates: Partial<WebsiteSettings>) => {
    if (!settings) return;

    try {
      setSaving(true);
      const updatedSettings = await websiteSettingsApi.updateSettings(updates);
      setSettings(updatedSettings);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  const handleSetFeaturedGame = async (gameId: string) => {
    try {
      setSaving(true);
      const updatedSettings = await websiteSettingsApi.setFeaturedGame(gameId);
      setSettings(updatedSettings);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to set featured game');
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveFeaturedGame = async () => {
    try {
      setSaving(true);
      const updatedSettings = await websiteSettingsApi.removeFeaturedGame();
      setSettings(updatedSettings);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to remove featured game');
    } finally {
      setSaving(false);
    }
  };

  const HeroForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [heroImageUrl, setHeroImageUrl] = useState(settings?.heroImageUrl || '');

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      await updateSettings({ heroImageUrl });
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
          className="bg-[#2a2f35] border border-[#3a3f45] rounded-lg p-6 max-w-md w-full"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Update Hero Image</h2>
            <Button variant="secondary" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#c4c4c4] mb-2">Hero Image URL</label>
              <input
                type="url"
                value={heroImageUrl}
                onChange={(e) => setHeroImageUrl(e.target.value)}
                className="w-full px-4 py-2 bg-[#1b1f24] border border-[#3a3f45] rounded-lg text-white placeholder-[#c4c4c4] focus:outline-none focus:border-[#ff5100] transition-colors"
                placeholder="https://example.com/image.jpg"
                required
              />
            </div>

            {heroImageUrl && (
              <div className="aspect-[21/9] bg-[#1b1f24] rounded-lg overflow-hidden">
                <img
                  src={heroImageUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            )}

            <div className="flex gap-4 pt-4">
              <Button type="submit" className="flex-1" disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
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

  const CarouselForm: React.FC<{ item?: CarouselItem; onClose: () => void }> = ({ item, onClose }) => {
    const [formData, setFormData] = useState({
      title: item?.title || '',
      image: item?.image || '',
      link: item?.link || '',
      active: item?.active ?? true
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      // Handle form submission
      console.log('Carousel item:', formData);
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
          className="bg-[#2a2f35] border border-[#3a3f45] rounded-lg p-6 max-w-md w-full"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">
              {item ? 'Edit Carousel Item' : 'Add Carousel Item'}
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
              <label className="block text-sm font-medium text-[#c4c4c4] mb-2">Image URL</label>
              <input
                type="url"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="w-full px-4 py-2 bg-[#1b1f24] border border-[#3a3f45] rounded-lg text-white placeholder-[#c4c4c4] focus:outline-none focus:border-[#ff5100] transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#c4c4c4] mb-2">Link</label>
              <input
                type="text"
                value={formData.link}
                onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                className="w-full px-4 py-2 bg-[#1b1f24] border border-[#3a3f45] rounded-lg text-white placeholder-[#c4c4c4] focus:outline-none focus:border-[#ff5100] transition-colors"
                required
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="active"
                checked={formData.active}
                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                className="rounded border-[#3a3f45] bg-[#1b1f24] text-[#ff5100] focus:ring-[#ff5100]/20"
              />
              <label htmlFor="active" className="ml-2 text-[#c4c4c4]">Active</label>
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" className="flex-1">
                {item ? 'Update Item' : 'Add Item'}
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white">Loading website settings...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-400 text-center">
          <p>Error: {error}</p>
          <Button onClick={loadSettings} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white">No settings found</div>
      </div>
    );
  }

  const allCategories = ['pc', 'playstation', 'xbox', 'nintendo'];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-white">Website Settings</h1>
          <p className="text-[#c4c4c4] mt-1">Manage your website's hero image and category visibility</p>
        </div>
      </motion.div>

      {/* Hero Banner Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Hero Banner</h2>
            <Button 
              onClick={() => setShowHeroForm(true)}
              className="flex items-center gap-2"
              disabled={saving}
            >
              <Edit className="w-5 h-5" />
              Edit Banner
            </Button>
          </div>
          <div className="space-y-4">
            <div className="aspect-[21/9] bg-[#1b1f24] rounded-lg overflow-hidden">
              <img
                src={settings.heroImageUrl}
                alt="Hero Banner"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&h=600&fit=crop';
                }}
              />
            </div>
            <div className="text-sm text-[#c4c4c4]">
              Current URL: {settings.heroImageUrl}
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Category Visibility */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Category Visibility</h2>
            <Button 
              onClick={() => updateSettings({ displayedCategories: allCategories })}
              className="flex items-center gap-2"
              variant="secondary"
              disabled={saving}
            >
              <Save className="w-5 h-5" />
              Save Changes
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {allCategories.map((category) => {
              const isVisible = settings.displayedCategories.includes(category);
              return (
                <div key={category} className="flex items-center justify-between p-3 bg-[#1b1f24] rounded-lg">
                  <span className="text-white capitalize">{category}</span>
                  <button
                    onClick={() => toggleCategory(category)}
                    className={`p-1 rounded transition-colors ${
                      isVisible ? 'text-green-400 hover:text-green-300' : 'text-[#c4c4c4] hover:text-white'
                    }`}
                    disabled={saving}
                  >
                    {isVisible ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                  </button>
                </div>
              );
            })}
          </div>
          <div className="mt-4 text-sm text-[#c4c4c4]">
            Visible categories: {settings.displayedCategories.join(', ')}
          </div>
        </Card>
      </motion.div>

      {/* Featured Game Management */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Featured Game</h2>
            <Button
              onClick={() => setShowFeaturedGameSelector(true)}
              className="flex items-center gap-2"
              disabled={saving}
            >
              <Edit className="w-5 h-5" />
              {currentFeaturedGame ? 'Edit Featured Game' : 'Set Featured Game'}
            </Button>
          </div>
          <div className="space-y-4">
            {currentFeaturedGame ? (
              <div className="flex items-center justify-between p-4 bg-[#1b1f24] rounded-lg">
                <div className="flex items-center">
                  <img
                    src={currentFeaturedGame.imageUrl || 'https://via.placeholder.com/150'}
                    alt={currentFeaturedGame.title}
                    className="w-16 h-16 object-cover rounded mr-4"
                  />
                  <div>
                    <h3 className="text-lg font-bold text-white">{currentFeaturedGame.title}</h3>
                    <p className="text-sm text-[#c4c4c4]">
                      Platform: {currentFeaturedGame.platform}
                    </p>
                                         <p className="text-sm text-[#c4c4c4]">
                       Price: {currentFeaturedGame.discountedPrice || currentFeaturedGame.originalPrice} DZD
                     </p>
                  </div>
                </div>
                <Button
                  onClick={handleRemoveFeaturedGame}
                  className="flex items-center gap-2"
                  variant="secondary"
                  disabled={saving}
                >
                  <Trash2 className="w-5 h-5" />
                  Remove Featured Game
                </Button>
              </div>
            ) : (
              <div className="text-[#c4c4c4] text-center py-8">
                No featured game set. Click "Set Featured Game" to select one.
              </div>
            )}
          </div>
        </Card>
      </motion.div>

      {showHeroForm && (
        <HeroForm onClose={() => setShowHeroForm(false)} />
      )}

             {showFeaturedGameSelector && (
         <FeaturedGameSelector
           currentFeaturedGameId={settings?.featuredGame || null}
           onGameSelected={handleSetFeaturedGame}
           onRemoveFeatured={handleRemoveFeaturedGame}
           onClose={() => setShowFeaturedGameSelector(false)}
         />
       )}
    </div>
  );
};