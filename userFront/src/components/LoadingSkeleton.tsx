import React from 'react';

interface LoadingSkeletonProps {
  count?: number;
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ count = 12 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="bg-[#2C2C2C] rounded-lg overflow-hidden animate-pulse">
          {/* Image Skeleton */}
          <div className="aspect-[3/4] bg-[#3a3a3a]" />
          
          {/* Content Skeleton */}
          <div className="p-4 space-y-3">
            {/* Title Skeleton */}
            <div className="space-y-2">
              <div className="h-4 bg-[#3a3a3a] rounded w-3/4" />
              <div className="h-4 bg-[#3a3a3a] rounded w-1/2" />
            </div>
            
            {/* Price Skeleton */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="h-6 bg-[#3a3a3a] rounded w-16" />
                <div className="h-4 bg-[#3a3a3a] rounded w-12" />
              </div>
              <div className="h-8 bg-[#3a3a3a] rounded w-12" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;