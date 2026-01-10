import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface ProfileDropdownProps {
  onLogout?: () => void;
  role: 'admin' | 'siswa' | string; // Menerima role dari parent
}

const ProfileDropdown: React.FC<ProfileDropdownProps> = ({
  onLogout,
  role
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const [profile, setProfile] = useState({
    name: role === 'admin' ? 'Admin' : 'Siswa',
    username: ''
  });

  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env?.VITE_API_URL;

  // --- FETCH DATA (Dinamis berdasarkan Role) ---
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      // Tentukan Endpoint berdasarkan Role
      // Jika role mengandung kata 'admin', pakai endpoint admin, jika tidak pakai endpoint profil biasa
      const endpoint = role.toLowerCase().includes('admin') 
        ? `${API_BASE_URL}/admin/profile` 
        : `${API_BASE_URL}/profile`;

      console.log(`🔍 [ProfileDropdown] Fetching sebagai ${role} ke: ${endpoint}`);

      try {
        const response = await fetch(endpoint, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        });

        const data = await response.json();

        if (response.ok && data.success && data.data) {
          setProfile({
            name: data.data.name,
            username: data.data.username
          });
        } else {
            console.warn("Gagal fetch profile:", response.status);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, [API_BASE_URL, role]);

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

  const handleLogout = () => {
    setIsOpen(false);
    localStorage.clear(); // Hapus semua localstorage (token & user)
    sessionStorage.clear();
    
    if (onLogout) onLogout();
    
    setTimeout(() => {
      navigate('/login');
    }, 100);
  };

  // UI Helper variables
  const isSiswa = !role.toLowerCase().includes('admin');
  const badgeColor = isSiswa ? 'bg-green-50 text-green-600' : 'bg-indigo-50 text-indigo-600';
  const badgeText = isSiswa ? 'Siswa' : 'Administrator';
  const avatarBg = isSiswa ? 'from-green-500 to-emerald-600' : 'from-indigo-600 to-blue-600';

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger */}
      <div 
        className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 rounded-xl px-3 py-2 transition-all duration-200"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="hidden md:flex flex-col items-end">
          <span className="text-sm text-gray-700 font-medium">
            {profile.name}
          </span>
          <span className={`text-xs px-2 py-0.5 rounded-full ${badgeColor}`}>
            {badgeText}
          </span>
        </div>
        
        {/* Avatar */}
        <div className="relative">
            <div className={`w-9 h-9 bg-gradient-to-r ${avatarBg} rounded-full flex items-center justify-center border-2 border-gray-200`}>
              <span className="text-white text-sm font-semibold">
                {profile.name.charAt(0).toUpperCase()}
              </span>
            </div>
        </div>

        {/* Arrow */}
        <svg className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in duration-200">
          <div className="px-4 py-4 border-b border-gray-100">
            <div className="flex items-center space-x-3">
               <div className={`w-12 h-12 bg-gradient-to-r ${avatarBg} rounded-full flex items-center justify-center`}>
                <span className="text-white text-lg font-bold">
                  {profile.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 overflow-hidden">
                <h3 className="font-semibold text-gray-800 text-sm truncate">{profile.name}</h3>
                {profile.username && <p className="text-xs text-gray-500 truncate">@{profile.username}</p>}
              </div>
            </div>
          </div>

          <div className="py-2">
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
                  <div className="text-xs text-red-500">Logout</div>
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