import React from 'react';

interface LoadingSkeletonProps {
  variant?: 'hero' | 'chart' | 'card';
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ variant = 'card' }) => {
  if (variant === 'hero') {
    return (
      <div className="w-full h-36 rounded-2xl animate-pulse bg-white/5 border border-white/[0.08] p-6">
        <div className="flex gap-8 h-full items-center">
          <div className="flex flex-col gap-2 flex-1">
            <div className="h-5 w-48 rounded bg-white/10" />
            <div className="h-10 w-36 rounded bg-white/10" />
            <div className="h-4 w-24 rounded bg-white/10" />
          </div>
          <div className="flex-1 h-4 rounded-full bg-white/10" />
          <div className="flex gap-4 flex-1">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex flex-col gap-1 flex-1">
                <div className="h-3 w-16 rounded bg-white/10" />
                <div className="h-5 w-20 rounded bg-white/10" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'chart') {
    return (
      <div className="w-full h-96 rounded-2xl animate-pulse bg-white/5 border border-white/[0.08]">
        <div className="h-full flex items-end gap-1 px-6 pb-6 pt-10">
          {Array.from({ length: 40 }).map((_, i) => (
            <div
              key={i}
              className="flex-1 rounded-t bg-white/10"
              style={{ height: `${20 + Math.random() * 60}%` }}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-32 rounded-2xl animate-pulse bg-white/5 border border-white/[0.08] p-4">
      <div className="flex flex-col gap-2">
        <div className="h-4 w-32 rounded bg-white/10" />
        <div className="h-6 w-24 rounded bg-white/10" />
        <div className="h-3 w-40 rounded bg-white/10" />
      </div>
    </div>
  );
};
