import React from 'react';

const Hero: React.FC = () => {
  return (
    <section className="relative  bg-[#1E1E1E]">
      <div className="relative">
        {/* Hero Content */}
        <div className="relative bg-gradient-to-r from-purple-900/50 to-blue-900/50 min-h-[1000px] flex items-center">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
            style={{
              backgroundImage: `url('Hero.jpg')`
            }}
          />
          
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="max-w-2xl">
              {/* Featured Badge */}
              <div className="inline-flex items-center px-3 py-1 bg-[#FF6600] text-white text-sm font-medium rounded-full mb-4">
                🔥 Featured Deal
              </div>
              
              {/* Game Title */}
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
                Grand Theft Auto VI
                <span className="block text-2xl md:text-3xl text-[#DDDDDD] font-normal mt-2">
                  Enhanced Edition
                </span>
              </h1>
              
              {/* Price Section */}
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl md:text-3xl font-bold text-white">$19.99</span>
                  <span className="text-lg text-gray-400 line-through">$59.99</span>
                </div>
                <div className="bg-red-600 text-white px-3 py-1 rounded-lg text-sm font-bold">
                  -67%
                </div>
              </div>
             
              {/* CTA Button */}
             {/*  <button className="bg-[#FF6600] hover:bg-[#e55a00] text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors duration-200 shadow-lg hover:shadow-xl">
                Buy Now
              </button>*/}
            </div>
          </div>
        </div>
        
        {/* Diagonal Cut */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-64 bg-[#1E1E1E]"
          style={{
            clipPath: 'polygon(0 100%, 100% 50%, 100% 100%)'
          }}
        />
      </div>
    </section>
  );
};

export default Hero;