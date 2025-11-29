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
      <div className="mb-12">
        <img 
          src="/src/assets/images/logo.png" 
          alt="HealthyKids Logo" 
          className="w-50 h-50 rounded-2xl object-cover shadow-lg"
        />
      </div>

      {/* Progress Bar */}
      <div className="w-72">
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;