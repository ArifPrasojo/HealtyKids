import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface ProfileDropdownProps {
  userName?: string;
  userClass?: string;
  userAvatar?: string;
  onLogout?: () => void;
}

const ProfileDropdown: React.FC<ProfileDropdownProps> = ({
  userName = "Admin User",
  userClass = "XII IPA 1",
  userAvatar,
  onLogout
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleProfileClick = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    setIsOpen(false);
    
    // Clear any stored authentication data
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    sessionStorage.clear();
    
    // Call the onLogout callback if provided
    if (onLogout) {
      onLogout();
    }
    
    // Navigate to login page
    setTimeout(() => {
      navigate('/login');
    }, 100);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Trigger */}
      <div 
        className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 rounded-xl px-3 py-2 transition-all duration-200"
        onClick={handleProfileClick}
      >
        <span className="text-sm text-gray-600 hidden md:block font-medium">
          {userName}
        </span>
        
        {/* Avatar */}
        <div className="relative">
          {userAvatar ? (
            <img 
              src={userAvatar} 
              alt={userName}
              className="w-9 h-9 rounded-full object-cover border-2 border-gray-200 hover:border-indigo-300 transition-colors"
            />
          ) : (
            <div className="w-9 h-9 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center border-2 border-gray-200 hover:border-indigo-300 transition-colors">
              <span className="text-white text-sm font-semibold">
                {userName.split(' ').map(n => n[0]).join('').toUpperCase()}
              </span>
            </div>
          )}
          
          {/* Online indicator */}
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
        </div>

        {/* Dropdown Arrow */}
        <svg 
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in duration-200">
          {/* User Info Header */}
          <div className="px-4 py-4 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              {userAvatar ? (
                <img 
                  src={userAvatar} 
                  alt={userName}
                  className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                />
              ) : (
                <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-lg font-bold">
                    {userName.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </span>
                </div>
              )}
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800 text-sm">{userName}</h3>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            {/* Logout Section */}
            <div className="px-4 py-2 border-t border-gray-100">
              <button 
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center space-x-3 font-medium"
              >
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                  <span className="text-red-600">🚪</span>
                </div>
                <div>
                  <div>Keluar</div>
                  <div className="text-xs text-red-500">Logout dari akun</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;