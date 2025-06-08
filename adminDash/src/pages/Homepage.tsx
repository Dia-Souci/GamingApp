import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { Card } from '../components/UI/Card';
import { Button } from '../components/UI/Button';
import { mockHomepageContent } from '../data/mockData';
import type { CarouselItem } from '../types';

export const Homepage: React.FC = () => {
  const [content, setContent] = useState(mockHomepageContent);
  const [showCarouselForm, setShowCarouselForm] = useState(false);
  const [editingCarousel, setEditingCarousel] = useState<CarouselItem | null>(null);

  const toggleCategory = (category: keyof typeof content.categories) => {
    setContent(prev => ({
      ...prev,
      categories: {
        ...prev.categories,
        [category]: !prev.categories[category]
      }
    }));
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

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-white">Homepage Content</h1>
          <p className="text-[#c4c4c4] mt-1">Manage your homepage banner and featured content</p>
        </div>
      </motion.div>

      {/* Hero Banner Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <h2 className="text-xl font-semibold text-white mb-4">Hero Banner</h2>
          <div className="space-y-4">
            <div className="aspect-[21/9] bg-[#1b1f24] rounded-lg overflow-hidden">
              <img
                src={content.heroBanner}
                alt="Hero Banner"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex justify-center">
              <Button className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Change Banner
              </Button>
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
          <h2 className="text-xl font-semibold text-white mb-4">Category Visibility</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(content.categories).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between p-3 bg-[#1b1f24] rounded-lg">
                <span className="text-white capitalize">{key}</span>
                <button
                  onClick={() => toggleCategory(key as keyof typeof content.categories)}
                  className={`p-1 rounded ${value ? 'text-green-400' : 'text-[#c4c4c4]'}`}
                >
                  {value ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                </button>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Carousel Management */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Featured Carousel</h2>
            <Button
              onClick={() => setShowCarouselForm(true)}
              className="flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Item
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {content.carousel.map((item) => (
              <div key={item.id} className="bg-[#1b1f24] rounded-lg p-4">
                <div className="aspect-video bg-[#2a2f35] rounded-lg mb-3 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-medium">{item.title}</h3>
                    <p className="text-[#c4c4c4] text-sm">{item.link}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${item.active ? 'bg-green-400' : 'bg-gray-400'}`} />
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => {
                        setEditingCarousel(item);
                        setShowCarouselForm(true);
                      }}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="danger">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      {showCarouselForm && (
        <CarouselForm
          item={editingCarousel || undefined}
          onClose={() => {
            setShowCarouselForm(false);
            setEditingCarousel(null);
          }}
        />
      )}
    </div>
  );
};