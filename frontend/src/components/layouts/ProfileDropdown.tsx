import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface UserData {
  name: string;
  username: string;
  role: string;
  avatar?: string;
  // Tambahkan field lain sesuai respon API Anda
}

interface ProfileDropdownProps {
  onLogout?: () => void;
}

const ProfileDropdown: React.FC<ProfileDropdownProps> = ({ onLogout }) => {
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  
  // Mengambil URL dari env variable (sama seperti di Login.tsx)
  const API_BASE_URL = import.meta.env?.VITE_API_URL;

  // State untuk data user
  const [userData, setUserData] = useState<UserData>({
    name: "Loading...",
    username: "",
    role: "Guest"
  });

  // --- 1. LOGIKA FETCH DATA USER ---
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Ambil token yang disimpan saat Login
        const token = localStorage.getItem('token');
        
        // Cek data awal dari LocalStorage (agar tampilan tidak kosong saat loading)
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUserData({
            name: parsedUser.name || parsedUser.username || "User",
            username: parsedUser.username,
            role: parsedUser.role || "Siswa",
            avatar: parsedUser.avatar
          });
        }

        if (!token) {
          // Jika tidak ada token, arahkan ke login (opsional)
          return;
        }

        // Fetch Data Terbaru dari Server
        // PENTING: Ganti '/me' dengan endpoint profile di backend Anda (misal: /profile, /auth/user, dll)
        const response = await fetch(`${API_BASE_URL}/me`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`, // Mengirim token sebagai otentikasi
            'Accept': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          // Update state dengan data terbaru dari server
          setUserData({
            name: data.name || data.username || "User", // Fallback jika field name kosong
            username: data.username,
            role: data.role || "Siswa",
            avatar: data.avatar
          });
          
          // Opsional: Update localStorage agar tetap sinkron
          localStorage.setItem('user', JSON.stringify(data));
        } else {
          // Jika token expired atau invalid
          if (response.status === 401) {
            handleLogout();
          }
        }
      } catch (error) {
        console.error("Gagal mengambil data profile:", error);
      }
    };

    fetchUserData();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleProfileClick = () => setIsOpen(!isOpen);

  // --- 2. LOGIKA LOGOUT (DISESUAIKAN DENGAN LOGIN.TSX) ---
  const handleLogout = () => {
    setIsOpen(false);
    
    // Hapus token dan data user yang diset di Login.tsx
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Call callback prop if exists
    if (onLogout) onLogout();
    
    // Redirect ke halaman login
    navigate('/'); 
  };

  // Helper untuk inisial nama
  const getInitials = (name: string) => {
    return name
      ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
      : 'U';
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Trigger */}
      <div 
        className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 rounded-xl px-3 py-2 transition-all duration-200"
        onClick={handleProfileClick}
      >
        <div className="text-right hidden md:block">
          <div className="text-sm font-semibold text-gray-700">
            {userData.name}
          </div>
          <div className="text-xs text-green-600 font-medium capitalize">
            {userData.role}
          </div>
        </div>
        
        {/* Avatar */}
        <div className="relative">
          {userData.avatar ? (
            <img 
              src={userData.avatar} 
              alt={userData.name}
              className="w-10 h-10 rounded-full object-cover border-2 border-gray-200 hover:border-green-300 transition-colors"
            />
          ) : (
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center border-2 border-gray-200 hover:border-green-300 transition-colors shadow-sm">
              <span className="text-white text-sm font-bold">
                {getInitials(userData.name)}
              </span>
            </div>
          )}
          
          {/* Online indicator */}
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
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
          {/* User Info Header (Mobile/Detail View) */}
          <div className="px-4 py-4 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              {userData.avatar ? (
                <img 
                  src={userData.avatar} 
                  alt={userData.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                />
              ) : (
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-lg font-bold">
                    {getInitials(userData.name)}
                  </span>
                </div>
              )}
              <div className="flex-1 overflow-hidden">
                <h3 className="font-bold text-gray-800 text-sm truncate">{userData.name}</h3>
                <p className="text-xs text-gray-500 truncate">{userData.username}</p>
                <span className="inline-block mt-1 px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold rounded-full uppercase tracking-wider">
                  {userData.role}
                </span>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            {/* Logout Section */}
            <div className="px-4 py-2 mt-1">
              <button 
                onClick={handleLogout}
                className="w-full text-left px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors flex items-center space-x-3 font-medium group"
              >
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center group-hover:bg-red-200 transition-colors">
                  <span className="text-red-600 text-lg">🚪</span>
                </div>
                <div>
                  <div className="text-gray-900 font-semibold group-hover:text-red-700">Keluar</div>
                  <div className="text-xs text-red-500">Akhiri sesi ini</div>
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