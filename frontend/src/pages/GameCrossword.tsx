import React from 'react';
import { useNavigate } from 'react-router-dom';
import HealthCrossword from '../components/games/HealthCrossword';
import { Button } from '../components/ui/Button';
import CloudBackground from '../components/layouts/CloudBackground';

const GameCrossword: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative">
      {/* Cloud Background */}
      <CloudBackground />
      
      {/* Game component */}
      <div className="relative z-10">
        <HealthCrossword />
      </div>
    </div>
  );
};

export default GameCrossword;