import React from 'react';
import ProfileDropdown from './ProfileDropdown';

interface HeaderProps {
  onLogout?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogout }) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 w-full sticky top-0 z-50 backdrop-blur-sm bg-white/95">
      <div className="w-full px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">H</span>
            </div>
            <span className="text-xl font-bold text-gray-800">HealthyKids</span>
          </div>

          {/* User Profile Dropdown */}
          <ProfileDropdown 
            userName="Budi Santoso"
            userClass="XII IPA 1"
            onLogout={onLogout}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;