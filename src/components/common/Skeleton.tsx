import React from 'react';

interface SkeletonProps {
  className?: string;
  count?: number;
}

const Skeleton: React.FC<SkeletonProps> = ({ className = '', count = 1 }) => {
  return (
    <>
      {[...Array(count)].map((_, i) => (
        <div
          key={i}
          className={`animate-pulse bg-gray-200 rounded-2xl ${className}`}
          style={{ 
            animationDuration: '1.5s',
            animationIterationCount: 'infinite'
          }}
        />
      ))}
    </>
  );
};

export const ArtworkSkeleton = () => (
  <div className="bg-white rounded-[2rem] p-4 border border-gray-50 shadow-sm">
    <Skeleton className="aspect-[3/4] mb-4" />
    <div className="px-2 pb-2 space-y-3">
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-3 w-1/4" />
    </div>
  </div>
);

export const ProfileSkeleton = () => (
  <div className="flex items-center gap-6 p-8 bg-white rounded-3xl border border-gray-100">
    <Skeleton className="w-20 h-20 rounded-2xl" />
    <div className="flex-1 space-y-3">
       <Skeleton className="h-8 w-1/2" />
       <Skeleton className="h-4 w-1/4" />
    </div>
  </div>
);

export default Skeleton;
