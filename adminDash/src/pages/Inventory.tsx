import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Edit, Trash2, Upload } from 'lucide-react';
import { Card } from '../components/UI/Card';
import { Button } from '../components/UI/Button';
import { StatusBadge } from '../components/UI/StatusBadge';
import { mockProducts } from '../data/mockData';
import type { Product } from '../types';

export const Inventory: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'games' | 'merchandise'>('games');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);

  const filteredProducts = mockProducts.filter(product => {
    const matchesTab = product.type === activeTab.slice(0, -1) || 
                      (activeTab === 'games' && product.type === 'game') ||
                      (activeTab === 'merchandise' && product.type === 'merchandise');
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const ProductForm: React.FC<{ product?: Product; onClose: () => void }> = ({ product, onClose }) => {
    const [formData, setFormData] = useState({
      title: product?.title || '',
      category: product?.category || '',
      platform: product?.platform || '',
      price: product?.price || 0,
      quantity: product?.quantity || 0,
      description: product?.description || ''
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      // Handle form submission
      console.log('Form submitted:', formData);
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
          className="bg-[#2a2f35] border border-[#3a3f45] rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">
              {product ? 'Edit Product' : 'Add New Product'}
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#c4c4c4] mb-2">Category</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 bg-[#1b1f24] border border-[#3a3f45] rounded-lg text-white placeholder-[#c4c4c4] focus:outline-none focus:border-[#ff5100] transition-colors"
                  required
                />
              </div>

              {activeTab === 'games' && (
                <div>
                  <label className="block text-sm font-medium text-[#c4c4c4] mb-2">Platform</label>
                  <select
                    value={formData.platform}
                    onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                    className="w-full px-4 py-2 bg-[#1b1f24] border border-[#3a3f45] rounded-lg text-white focus:outline-none focus:border-[#ff5100] transition-colors"
                  >
                    <option value="">Select Platform</option>
                    <option value="PC">PC</option>
                    <option value="PlayStation">PlayStation</option>
                    <option value="Xbox">Xbox</option>
                    <option value="Multi">Multi-Platform</option>
                  </select>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#c4c4c4] mb-2">Price ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                  className="w-full px-4 py-2 bg-[#1b1f24] border border-[#3a3f45] rounded-lg text-white placeholder-[#c4c4c4] focus:outline-none focus:border-[#ff5100] transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#c4c4c4] mb-2">Quantity</label>
                <input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 bg-[#1b1f24] border border-[#3a3f45] rounded-lg text-white placeholder-[#c4c4c4] focus:outline-none focus:border-[#ff5100] transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#c4c4c4] mb-2">Product Image</label>
              <div className="border-2 border-dashed border-[#3a3f45] rounded-lg p-6 text-center hover:border-[#ff5100] transition-colors">
                <Upload className="w-8 h-8 text-[#c4c4c4] mx-auto mb-2" />
                <p className="text-[#c4c4c4] text-sm">Drag and drop an image, or click to select</p>
                <input type="file" accept="image/*" className="hidden" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#c4c4c4] mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 bg-[#1b1f24] border border-[#3a3f45] rounded-lg text-white placeholder-[#c4c4c4] focus:outline-none focus:border-[#ff5100] transition-colors resize-none"
              />
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" className="flex-1">
                {product ? 'Update Product' : 'Add Product'}
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
          <h1 className="text-3xl font-bold text-white">Inventory Management</h1>
          <p className="text-[#c4c4c4] mt-1">Manage your games and merchandise inventory</p>
        </div>
        <Button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Product
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
              onClick={() => setActiveTab('games')}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                activeTab === 'games'
                  ? 'bg-gradient-to-r from-[#ff5100] to-[#e64400] text-white'
                  : 'text-[#c4c4c4] hover:text-white hover:bg-[#3a3f45]'
              }`}
            >
              Video Games
            </button>
            <button
              onClick={() => setActiveTab('merchandise')}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                activeTab === 'merchandise'
                  ? 'bg-gradient-to-r from-[#ff5100] to-[#e64400] text-white'
                  : 'text-[#c4c4c4] hover:text-white hover:bg-[#3a3f45]'
              }`}
            >
              Merchandise
            </button>
          </div>

          <div className="mt-4">
            <div className="relative">
              <Search className="w-5 h-5 text-[#c4c4c4] absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder={`Search ${activeTab}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[#1b1f24] border border-[#3a3f45] rounded-lg text-white placeholder-[#c4c4c4] focus:outline-none focus:border-[#ff5100] transition-colors"
              />
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Products Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filteredProducts.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card hover className="h-full">
              <div className="aspect-video bg-[#1b1f24] rounded-lg mb-4 overflow-hidden">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.title}
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
                  <h3 className="text-lg font-semibold text-white">{product.title}</h3>
                  <p className="text-[#c4c4c4] text-sm">{product.category}</p>
                  {product.platform && (
                    <p className="text-[#c4c4c4] text-sm">{product.platform}</p>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-[#ff5100]">${product.price}</span>
                  <StatusBadge status={product.status} />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[#c4c4c4] text-sm">Stock: {product.quantity}</span>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => {
                        setSelectedProduct(product);
                        setShowForm(true);
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
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {filteredProducts.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <p className="text-[#c4c4c4] text-lg">No {activeTab} found</p>
        </motion.div>
      )}

      {/* Product Form Modal */}
      {showForm && (
        <ProductForm
          product={selectedProduct || undefined}
          onClose={() => {
            setShowForm(false);
            setSelectedProduct(null);
          }}
        />
      )}
    </div>
  );
};