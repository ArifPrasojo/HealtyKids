import React from 'react';
import ProfileDropdown from './ProfileDropdown';
import logo from '../../assets/images/logo.png';

interface HeaderProps {
  onLogout?: () => void;
  hideLogoMobile?: boolean;
}

const Header: React.FC<HeaderProps> = ({ onLogout, hideLogoMobile = false }) => {
  return (
    <header className={`sticky top-0 bg-white border-b border-gray-200 px-4 md:px-6 py-4 flex items-center shadow-sm z-40 ${hideLogoMobile ? 'justify-end md:justify-between' : 'justify-between'}`}>
      {/* Logo - Kondisional berdasarkan hideLogoMobile */}
      {!hideLogoMobile && (
        <div className="flex items-center space-x-3">
          <img
            src={logo}
            alt="HealthyKids Logo"
            className="w-10 h-10 object-contain rounded-xl"
          />
          <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent hidden sm:block">
            HealthyKids
          </span>
        </div>
      )}

      {/* Spacer untuk desktop ketika logo hidden */}
      {hideLogoMobile && (
        <div className="hidden md:flex items-center space-x-3">
          <img
            src={logo}
            alt="HealthyKids Logo"
            className="w-10 h-10 object-contain rounded-xl"
          />
          <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            HealthyKids
          </span>
        </div>
      )}

      {/* Profile Dropdown - Selalu di kanan */}
      <div className="flex items-center">
        <ProfileDropdown 
          userName="Budi Santoso"
          userClass="XII IPA 1"
          onLogout={onLogout}
        />
      </div>
    </header>
  );
};

export default Header;