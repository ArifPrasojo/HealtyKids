import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 w-full sticky top-0 z-50 backdrop-blur-sm bg-white/95">
      <div className="w-full px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">H</span>
            </div>
            <span className="text-xl font-bold text-gray-800">HealthyKids</span>
          </div>

          {/* User Profile */}
          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-600 hidden md:block">Admin User</span>
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-gray-600 text-xs font-medium">User</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;