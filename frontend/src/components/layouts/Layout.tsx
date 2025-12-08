import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';

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
        <Header onLogout={onLogout} hideLogoMobile={hideLogoMobile} />

        <main className={`flex-1 overflow-y-auto ${className}`}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;