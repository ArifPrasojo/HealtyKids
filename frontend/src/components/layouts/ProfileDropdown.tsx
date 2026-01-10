import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { profileService } from '../../services/api/profileService';
import type { ProfileData } from '../../services/api/profileService';

interface ProfileDropdownProps {
  onLogout?: () => void;
  role: 'admin' | 'siswa' | string;
}

const ProfileDropdown: React.FC<ProfileDropdownProps> = ({
  onLogout,
  role
}) => {
  // --- STATE ---
  const [isOpen, setIsOpen] = useState(false); // State Dropdown Menu
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // State Modal Edit
  const [isLoading, setIsLoading] = useState(false); // Loading saat simpan
  
  // Data Profile Utama (Tampil di Navbar)
  const [profile, setProfile] = useState<ProfileData>({
    name: role.toLowerCase().includes('admin') ? 'Administrator' : 'Siswa',
    username: ''
  });

  // Data Form saat Edit (Temporary)
  const [formData, setFormData] = useState<ProfileData>({
    name: '',
    username: ''
  });

  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // --- 1. LOAD DATA (GET) ---
  useEffect(() => {
    let isMounted = true;
    const loadProfile = async () => {
      try {
        const data = await profileService.getProfile(role);
        if (isMounted && data) {
          setProfile(data);
        }
      } catch (error) {
        console.error("Gagal load profile", error);
      }
    };
    loadProfile();
    return () => { isMounted = false; };
  }, [role]);

  // --- 2. HANDLER KLIK LUAR (Tutup Dropdown) ---
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // --- 3. LOGIKA TOMBOL ---
  
  // Klik tombol "Edit Profile" di menu
  const openEditModal = () => {
    setFormData(profile); // Copy data saat ini ke form
    setIsOpen(false);     // Tutup dropdown
    setIsEditModalOpen(true); // Buka modal
  };

  const handleLogout = () => {
    setIsOpen(false);
    localStorage.clear();
    sessionStorage.clear();
    if (onLogout) onLogout();
    setTimeout(() => navigate('/login'), 100);
  };

  // --- 4. LOGIKA SAVE (PUT / AJAX) ---
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Panggil API Update yang baru dibuat
      const updatedData = await profileService.updateProfile(role, formData);
      
      if (updatedData) {
        // 1. Update tampilan Navbar langsung tanpa refresh
        setProfile(updatedData); 
        // 2. Tutup Modal
        setIsEditModalOpen(false);
        alert("Profile berhasil diperbarui!");
      }
    } catch (error) {
      alert("Gagal memperbarui profile. Cek koneksi atau coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  // Helper Variables
  const isSiswa = !role.toLowerCase().includes('admin');
  const badgeColor = isSiswa ? 'bg-green-50 text-green-600' : 'bg-indigo-50 text-indigo-600';
  const badgeText = isSiswa ? 'Siswa' : 'Administrator';
  const avatarBg = isSiswa ? 'from-green-500 to-emerald-600' : 'from-indigo-600 to-blue-600';

  return (
    <>
      {/* --- NAVBAR ITEM & DROPDOWN --- */}
      <div className="relative z-50" ref={dropdownRef}>
        {/* Trigger Button */}
        <div 
          className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 rounded-xl px-2 py-2 md:px-3 transition-all duration-200"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="hidden md:flex flex-col items-end text-right">
            <span className="text-sm text-gray-700 font-medium truncate max-w-[120px]">
              {profile.name}
            </span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full ${badgeColor}`}>
              {badgeText}
            </span>
          </div>
          <div className={`w-8 h-8 md:w-9 md:h-9 bg-gradient-to-r ${avatarBg} rounded-full flex items-center justify-center border-2 border-gray-200 shadow-sm`}>
            <span className="text-white text-xs md:text-sm font-semibold">
              {profile.name ? profile.name.charAt(0).toUpperCase() : '?'}
            </span>
          </div>
        </div>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 animate-in fade-in slide-in-from-top-2">
            {/* Header Info */}
            <div className="px-4 py-4 border-b border-gray-100 flex items-center space-x-3">
              <div className={`w-10 h-10 bg-gradient-to-r ${avatarBg} rounded-full flex items-center justify-center text-white font-bold`}>
                {profile.name ? profile.name.charAt(0).toUpperCase() : '?'}
              </div>
              <div className="overflow-hidden">
                <h3 className="font-semibold text-gray-800 text-sm truncate">{profile.name}</h3>
                <p className="text-xs text-gray-500 truncate">{profile.username || 'user'}</p>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-2">
              <button 
                onClick={openEditModal} // <--- Membuka Modal Edit
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3"
              >
                <span className="p-1 bg-blue-50 rounded text-blue-600">✎</span>
                <span>Edit Profil</span>
              </button>
            </div>

            <div className="py-2 border-t border-gray-100">
              <button 
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-3"
              >
                <span className="p-1 bg-red-50 rounded text-red-600">🚪</span>
                <span>Keluar</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* --- MODAL EDIT PROFILE (Overlay) --- */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden scale-100">
            {/* Modal Header */}
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-800">Edit Profil</h3>
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Modal Body (Form) */}
            <form onSubmit={handleSaveProfile} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="Nama Anda"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <input 
                  type="text" 
                  required
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="Username login"
                />
              </div>

              {/* Modal Footer (Actions) */}
              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
                >
                  {isLoading ? (
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></span>
                  ) : null}
                  {isLoading ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ProfileDropdown;