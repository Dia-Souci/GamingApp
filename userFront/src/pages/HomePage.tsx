import React from 'react';
import Hero from '../components/Hero';
import CategoryGameGrid from '../components/CategoryGameGrid';

const HomePage: React.FC = () => {
  return (
    <>
      <Hero />
      <CategoryGameGrid />
      
      {/* Footer */}
      <footer className="bg-[#121212] py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-[#DDDDDD] text-sm">
              © 2024 InstantGaming Clone. Built with React & Tailwind CSS.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default HomePage;