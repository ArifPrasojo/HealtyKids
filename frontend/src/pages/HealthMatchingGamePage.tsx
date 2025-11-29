import React from 'react';
import { useNavigate } from 'react-router-dom';
import HealthMatchingGame from '../components/games/HealthMatchingGame';
import { Button } from '../components/ui/Button';

const HealthMatchingGamePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8">
      <div className="max-w-6xl mx-auto px-6">
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
        <HealthMatchingGame />
      </div>
    </div>
  );
};

export default HealthMatchingGamePage;