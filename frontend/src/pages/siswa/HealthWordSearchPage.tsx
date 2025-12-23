import React from 'react';
import { useNavigate } from 'react-router-dom';
import HealthWordSearch from '../../components/games/HealthWordSearch';
import { Button } from '../../components/ui/Button';
import CloudBackground from '../../components/layouts/CloudBackground';

const HealthWordSearchPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative">
      {/* Cloud Background */}
      <CloudBackground />
      
      {/* Game component */}
      <div className="relative z-10">
        <HealthWordSearch />
      </div>
    </div>
  );
};

export default HealthWordSearchPage;
