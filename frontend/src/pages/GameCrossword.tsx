import React from 'react';
import { useNavigate } from 'react-router-dom';
import HealthCrossword from '../components/games/HealthCrossword';
import { Button } from '../components/ui/Button';

const GameCrossword: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 py-8">
      <div className="max-w-7xl mx-auto px-6">
        {/* Back button */}
        <div className="mb-6">
          <Button 
            variant="secondary" 
            onClick={() => navigate('/dashboard')}
            className="flex items-center space-x-2 hover:shadow-md transition-all"
          >
            <span>←</span>
            <span>Back to Dashboard</span>
          </Button>
        </div>

        {/* Game component */}
        <HealthCrossword />
      </div>
    </div>
  );
};

export default GameCrossword;