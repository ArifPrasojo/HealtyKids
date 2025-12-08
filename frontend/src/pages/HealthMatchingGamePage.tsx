import React from 'react';
import { useNavigate } from 'react-router-dom';
import HealthMatchingGame from '../components/games/HealthMatchingGame';
import { Button } from '../components/ui/Button';
import CloudBackground from '../components/layouts/CloudBackground';

const HealthMatchingGamePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative">
      {/* Cloud Background */}
      <CloudBackground />
      
      {/* Game component */}
      <div className="relative z-10">
        <HealthMatchingGame />
      </div>
    </div>
  );
};

export default HealthMatchingGamePage;