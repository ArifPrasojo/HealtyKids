import React, { useEffect, useState } from 'react';
import ProfileDropdown from './ProfileDropdown'; // Import komponen gabungan tadi
import logo from '../../assets/images/logo.png';

interface HeaderProps {
  onLogout?: () => void;
  hideLogoMobile?: boolean;
}

const Header: React.FC<HeaderProps> = ({ onLogout, hideLogoMobile = false }) => {
  // Default role string kosong
  const [userRole, setUserRole] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Ambil data user dari localStorage
    const storedUser = localStorage.getItem('user');
    
    // DEBUG: Cek apa isi localStorage di console
    console.log("🛠️ [Header] Raw localStorage 'user':", storedUser);

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        
        // Cek variasi kemungkinan nama field role (role, roles, type, dll)
        // Sesuaikan 'role' di bawah dengan response LOGIN API Anda
        const roleFromStorage = parsedUser.role || parsedUser.roles || 'siswa';
        
        console.log("🛠️ [Header] Detected Role:", roleFromStorage);
        setUserRole(roleFromStorage);
      } catch (error) {
        console.error("Error parsing user data:", error);
        setUserRole('siswa'); // Fallback
      }
    } else {
        // Jika tidak ada data user, cek apakah ada token admin? 
        // Ini fallback logic jika user object hilang tapi token ada
        const token = localStorage.getItem('token');
        if (token) {
            // Logika darurat: asumsi siswa dulu, nanti dropdown akan menyesuaikan jika error
            setUserRole('siswa');
        }
    }
    setIsLoading(false);
  }, []);

  return (
    <header className={`sticky top-0 bg-white border-b border-gray-200 px-4 md:px-6 py-4 flex items-center shadow-sm z-40 ${hideLogoMobile ? 'justify-end md:justify-between' : 'justify-between'}`}>
      
      {!hideLogoMobile && (
        <div className="flex items-center space-x-3">
          <img src={logo} alt="HealthyKids Logo" className="w-10 h-10 object-contain rounded-xl" />
        </div>
      )}

      {hideLogoMobile && (
        <div className="hidden md:flex items-center space-x-3">
          <img src={logo} alt="HealthyKids Logo" className="w-10 h-10 object-contain rounded-xl" />
        </div>
      )}

      {/* Profile Dropdown */}
      <div className="flex items-center">
        {!isLoading && (
            <ProfileDropdown 
              role={userRole} 
              onLogout={onLogout} 
            />
        )}
      </div>
    </header>
  );
};

export default Header;