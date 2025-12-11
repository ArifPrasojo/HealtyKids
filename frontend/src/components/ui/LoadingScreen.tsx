import React, { useState, useEffect } from 'react';

interface LoadingScreenProps {
  onLoadingComplete: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onLoadingComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const simulateLoading = () => {
      let currentProgress = 0;

      const baseSpeed = Math.random() * 50 + 25; // Random speed between 25-75ms per increment
      const networkDelay = Math.random() * 100 + 50; // Random additional delay 50-150ms

      const updateProgress = () => {
        if (currentProgress < 100) {
          // Variable increment speed to simulate real loading
          const increment = Math.random() * 5 + 2; // 2-7% increment
          currentProgress = Math.min(currentProgress + increment, 100);
          setProgress(Math.floor(currentProgress));

          // Variable delay to simulate network conditions
          const delay = baseSpeed + (Math.random() * networkDelay);
          setTimeout(updateProgress, delay);
        } else {
          setTimeout(() => {
            onLoadingComplete();
          }, 300);
        }
      };

      // Start loading after a small initial delay
      setTimeout(updateProgress, 300);
    };

    simulateLoading();
  }, [onLoadingComplete]);

  return (
    <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-50">
      {/* Logo */}
              <div className="relative inline-block">
                <h2 className="text-5xl md:text-4xl lg:text-6xl font-black text-gray-800 tracking-tight">
                  <span className="relative">
                    <span className="bg-gradient-to-t from-green-500 via-teal-400 to-slate-100 bg-clip-text text-transparent">
                      SEXOPHONE
                    </span>
                    <svg className="absolute -bottom-1 md:-bottom-2 left-0 w-full h-2 md:h-3" viewBox="0 0 200 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path 
                        d="M2 10C40 3 80 1 120 5C160 9 180 10 198 10" 
                        stroke="url(#gradient)" 
                        strokeWidth="3" 
                        strokeLinecap="round"
                        className="animate-draw-line"
                      />
                      <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#10B981" />
                          <stop offset="50%" stopColor="#2DD4BF" />
                          <stop offset="100%" stopColor="#F1F5F9" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </span>
                </h2>
              </div>

      {/* Progress Bar
      <div className="w-72">
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div> */}
    </div>
  );
};

export default LoadingScreen;