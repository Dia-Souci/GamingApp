import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Search, User, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Header: React.FC = () => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <header className="bg-[#2a2f35] border-b border-[#3a3f45] h-16 fixed top-0 left-64 right-0 z-30">
      <div className="flex items-center justify-between h-full px-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="w-5 h-5 text-[#c4c4c4] absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-[#1b1f24] border border-[#3a3f45] rounded-lg pl-10 pr-4 py-2 text-white placeholder-[#c4c4c4] focus:outline-none focus:border-[#ff5100] transition-colors"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative p-2 rounded-lg bg-[#1b1f24] border border-[#3a3f45] hover:border-[#ff5100] transition-colors"
          >
            <Bell className="w-5 h-5 text-[#c4c4c4]" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#ff5100] rounded-full"></span>
          </motion.button>

          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-3 p-2 rounded-lg bg-[#1b1f24] border border-[#3a3f45] hover:border-[#ff5100] transition-colors"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-[#ff5100] to-[#e64400] rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="text-left hidden md:block">
                <p className="text-sm font-medium text-white">Admin User</p>
                <p className="text-xs text-[#c4c4c4]">admin@gaming.com</p>
              </div>
            </motion.button>

            {showUserMenu && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute right-0 top-12 w-48 bg-[#2a2f35] border border-[#3a3f45] rounded-lg shadow-lg py-2"
              >
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full px-4 py-2 text-left text-[#c4c4c4] hover:bg-[#3a3f45] hover:text-white transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};