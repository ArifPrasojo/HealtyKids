import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { profileService } from '../../services/api/profileService';
import type { ProfileData, QuizResultData, AdminQuizResultData } from '../../services/api/profileService';

interface ProfileDropdownProps {
  onLogout?: () => void;
  role: 'admin' | 'siswa' | string;
}

const ProfileDropdown: React.FC<ProfileDropdownProps> = ({
  onLogout,
  role
}) => {
  // --- STATE EXISTING ---
  const [isOpen, setIsOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // --- STATE QUIZ ---
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [quizHistory, setQuizHistory] = useState<(QuizResultData | AdminQuizResultData)[]>([]); 
  const [isQuizLoading, setIsQuizLoading] = useState(false);

  // --- STATE BARU: SEARCH & FILTER ---
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all', 'high', 'medium', 'low'

  const isAdmin = role.toLowerCase().includes('admin');

  // Data Profile Utama
  const [profile, setProfile] = useState<ProfileData>({
    name: isAdmin ? 'Administrator' : 'Siswa',
    username: ''
  });

  const [formData, setFormData] = useState<ProfileData>({
    name: '',
    username: ''
  });

  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // --- LOAD PROFILE ---
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

  // --- CLICK OUTSIDE ---
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // --- LOGIKA TOMBOL ---
  const openEditModal = () => {
    setFormData(profile);
    setIsOpen(false);
    setIsEditModalOpen(true);
  };

  const openQuizHistoryModal = async () => {
    setIsOpen(false);
    setIsQuizModalOpen(true);
    setIsQuizLoading(true);
    
    // Reset filter saat modal dibuka
    setSearchTerm('');
    setFilterType('all');

    try {
      const data = await profileService.getQuizHistory(role);
      setQuizHistory(data);
    } catch (error) {
      console.error("Failed to load quiz history", error);
    } finally {
      setIsQuizLoading(false);
    }
  };

  const handleLogout = () => {
    setIsOpen(false);

    localStorage.clear();
    sessionStorage.clear();

    if (onLogout) onLogout();
    window.location.href = '/login';
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const updatedData = await profileService.updateProfile(role, formData);
      if (updatedData) {
        setProfile(updatedData); 
        setIsEditModalOpen(false);
        alert("Profile berhasil diperbarui!");
      }
    } catch (error) {
      alert("Gagal memperbarui profile.");
    } finally {
      setIsLoading(false);
    }
  };

  // --- LOGIKA FILTERING DATA ---
  const filteredHistory = quizHistory.filter((item) => {
    // 1. Filter Search (Nama Siswa atau Nama Quiz)
    const searchLower = searchTerm.toLowerCase();
    
    let matchesSearch = false;
    if (isAdmin) {
      // Jika Admin: Cari berdasarkan Nama Siswa ATAU Nama Quiz
      const studentName = (item as AdminQuizResultData).studentName?.toLowerCase() || '';
      const quizName = item.quizName?.toLowerCase() || '';
      matchesSearch = studentName.includes(searchLower) || quizName.includes(searchLower);
    } else {
      // Jika Siswa: Cari berdasarkan Nama Quiz
      const quizName = item.quizName?.toLowerCase() || '';
      matchesSearch = quizName.includes(searchLower);
    }

    // 2. Filter Kategori Nilai
    let matchesFilter = true;
    if (filterType === 'high') matchesFilter = item.score >= 80;
    else if (filterType === 'medium') matchesFilter = item.score >= 60 && item.score < 80;
    else if (filterType === 'low') matchesFilter = item.score < 60;

    return matchesSearch && matchesFilter;
  });

  // Helper Variables Styling
  const badgeColor = !isAdmin ? 'bg-green-50 text-green-600' : 'bg-indigo-50 text-indigo-600';
  const badgeText = !isAdmin ? 'Siswa' : 'Administrator';
  const avatarBg = !isAdmin ? 'from-green-500 to-emerald-600' : 'from-indigo-600 to-blue-600';

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { 
      day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' 
    });
  };

  return (
    <>
      {/* --- NAVBAR ITEM --- */}
      <div className="relative z-50" ref={dropdownRef}>
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
            <div className="px-4 py-4 border-b border-gray-100 flex items-center space-x-3">
              <div className={`w-10 h-10 bg-gradient-to-r ${avatarBg} rounded-full flex items-center justify-center text-white font-bold`}>
                {profile.name ? profile.name.charAt(0).toUpperCase() : '?'}
              </div>
              <div className="overflow-hidden">
                <h3 className="font-semibold text-gray-800 text-sm truncate">{profile.name}</h3>
                <p className="text-xs text-gray-500 truncate">{profile.username || 'user'}</p>
              </div>
            </div>

            <div className="py-2">
              <button 
                onClick={openEditModal}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3"
              >
                <span className="p-1 bg-blue-50 rounded text-blue-600">✎</span>
                <span>Edit Profil</span>
              </button>

              <button 
                onClick={openQuizHistoryModal}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3"
              >
                <span className="p-1 bg-yellow-50 rounded text-yellow-600">🏆</span>
                <span>{isAdmin ? 'Hasil Quiz Siswa' : 'Riwayat Quiz'}</span>
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

      {/* --- MODAL EDIT PROFILE --- */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden scale-100">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-800">Edit Profil</h3>
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                ✕
              </button>
            </div>
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
                  {isLoading ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL QUIZ RESULT (ADMIN & SISWA) --- */}
      {isQuizModalOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden scale-100 flex flex-col max-h-[80vh]">
            
            {/* Header Modal */}
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center shrink-0">
              <h3 className="text-lg font-bold text-gray-800">
                {isAdmin ? 'Hasil Pengerjaan Siswa' : 'Riwayat Quiz Saya'}
              </h3>
              <button 
                onClick={() => setIsQuizModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* --- AREA SEARCH & FILTER (BARU) --- */}
            <div className="px-6 py-3 bg-gray-50/50 border-b border-gray-100 flex gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
                <input 
                  type="text"
                  placeholder={isAdmin ? "Cari siswa atau quiz..." : "Cari nama quiz..."}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select 
                className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white text-gray-600"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="all">Semua Nilai</option>
                <option value="high">Nilai Tinggi (≥80)</option>
                <option value="medium">Nilai Sedang (60-79)</option>
                <option value="low">Nilai Rendah (&lt;60)</option>
              </select>
            </div>

            {/* List Quiz */}
            <div className="p-6 overflow-y-auto custom-scrollbar">
              {isQuizLoading ? (
                <div className="flex flex-col items-center justify-center py-10">
                  <span className="w-8 h-8 border-4 border-blue-100 border-t-blue-500 rounded-full animate-spin mb-3"></span>
                  <p className="text-gray-500 text-sm">Memuat data...</p>
                </div>
              ) : filteredHistory.length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                  <p>Data tidak ditemukan.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredHistory.map((item, index) => {
                    const studentName = (item as AdminQuizResultData).studentName; 
                    const quizDesc = (item as QuizResultData).quizDescription;

                    return (
                      <div key={index} className="border border-gray-100 rounded-xl p-4 bg-gray-50 hover:bg-white hover:shadow-md transition-all">
                        <div className="flex justify-between items-start">
                          <div>
                            {isAdmin ? (
                              // --- TAMPILAN ADMIN ---
                              <>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-xs font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                                        {studentName}
                                    </span>
                                </div>
                                <h4 className="font-bold text-gray-800">{item.quizName}</h4>
                                <p className="text-[10px] text-gray-400 mt-1">
                                  Selesai: {formatDate(item.finishedAt)}
                                </p>
                              </>
                            ) : (
                              // --- TAMPILAN SISWA ---
                              <>
                                <h4 className="font-bold text-gray-800">{item.quizName}</h4>
                                <p className="text-xs text-gray-500 mt-1 line-clamp-1">{quizDesc || 'Quiz interaktif'}</p>
                                <p className="text-[10px] text-gray-400 mt-2">
                                  Selesai: {formatDate(item.finishedAt)}
                                </p>
                              </>
                            )}
                          </div>

                          {/* Score Badge */}
                          <div className={`flex flex-col items-center justify-center w-12 h-12 rounded-lg shrink-0 ml-3 ${
                              item.score >= 80 ? 'bg-green-100 text-green-700' : 
                              item.score >= 60 ? 'bg-yellow-100 text-yellow-700' : 
                              'bg-red-100 text-red-700'
                            }`}>
                            <span className="text-lg font-bold">{item.score}</span>
                            <span className="text-[9px] font-medium">Nilai</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            
            {/* Footer Modal */}
            <div className="bg-gray-50 px-6 py-3 border-t border-gray-100 shrink-0 text-right">
                <button
                  type="button"
                  onClick={() => setIsQuizModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
                >
                  Tutup
                </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProfileDropdown;