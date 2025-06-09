import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Monitor, Gamepad2, Gamepad, Zap } from 'lucide-react';

const categories = [
  { 
    id: 'all', 
    name: 'All Games', 
    path: '/', 
    icon: Zap,
    color: 'from-purple-500 to-pink-500'
  },
  { 
    id: 'pc', 
    name: 'PC Games', 
    path: '/category/pc', 
    icon: Monitor,
    color: 'from-blue-500 to-cyan-500'
  },
  { 
    id: 'playstation', 
    name: 'PlayStation', 
    path: '/category/playstation', 
    icon: Gamepad2,
    color: 'from-blue-600 to-blue-800'
  },
  { 
    id: 'xbox', 
    name: 'Xbox', 
    path: '/category/xbox', 
    icon: Gamepad,
    color: 'from-green-500 to-green-700'
  },
  { 
    id: 'nintendo', 
    name: 'Nintendo', 
    path: '/category/nintendo', 
    icon: Gamepad2,
    color: 'from-red-500 to-red-700'
  }
];

const CategoryNavigation: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/' || (!location.pathname.startsWith('/category/'));
    }
    return location.pathname === path;
  };

  return (
    <div className="bg-[#2C2C2C] border-b border-[#3a3a3a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-1 overflow-x-auto py-4">
          {categories.map((category) => {
            const Icon = category.icon;
            const active = isActive(category.path);
            
            return (
              <Link
                key={category.id}
                to={category.path}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 whitespace-nowrap ${
                  active
                    ? `bg-gradient-to-r ${category.color} text-white shadow-lg transform scale-105`
                    : 'text-[#DDDDDD] hover:text-white hover:bg-[#3a3a3a]'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{category.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CategoryNavigation;