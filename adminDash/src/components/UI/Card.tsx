import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  hover = false 
}) => {
  return (
    <motion.div
      whileHover={hover ? { y: -2, boxShadow: '0 20px 25px -5px rgba(255, 81, 0, 0.1)' } : {}}
      className={`bg-[#2a2f35] border border-[#3a3f45] rounded-lg p-6 ${className}`}
    >
      {children}
    </motion.div>
  );
};