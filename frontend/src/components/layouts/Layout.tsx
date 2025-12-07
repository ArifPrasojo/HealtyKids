import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileDropdown from './ProfileDropdown';

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
  onLogout?: () => void;
  hideLogoMobile?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, className = '', onLogout, hideLogoMobile = false }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className={`sticky top-0 bg-white border-b border-gray-200 px-4 md:px-6 py-4 flex items-center shadow-sm z-40 ${hideLogoMobile ? 'justify-end md:justify-between' : 'justify-between'}`}>
          {/* Logo - Kondisional berdasarkan hideLogoMobile */}
          {!hideLogoMobile && (
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white text-xl font-bold">H</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent hidden sm:block">
                HealthyKids
              </span>
            </div>
          )}

          {/* Spacer untuk desktop ketika logo hidden */}
          {hideLogoMobile && (
            <div className="hidden md:flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white text-xl font-bold">H</span>
              </div>
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

        <main className={`flex-1 overflow-y-auto ${className}`}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;