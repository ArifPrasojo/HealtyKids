import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { profileService } from '../../services/api/profileService';
import type { ProfileData, QuizResultData, AdminQuizResultData } from '../../services/api/profileService';
// --- IMPORT DATA REFRENSI ---
import { referenceList } from '../../utils/refrensi';
// --- IMPORT ICONS ---
import { Edit, Trophy, BookOpen, LogOut, X, Search, Download } from 'lucide-react';

interface ProfileDropdownProps {
  onLogout?: () => void;
  role: 'admin' | 'siswa' | string;
}

const ProfileDropdown: React.FC<ProfileDropdownProps> = ({
  onLogout,
  role
}) => {
  // --- STATE ---
  const [isOpen, setIsOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // --- STATE QUIZ ---
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [quizHistory, setQuizHistory] = useState<(QuizResultData | AdminQuizResultData)[]>([]); 
  const [isQuizLoading, setIsQuizLoading] = useState(false);

  // --- STATE REFRENSI ---
  const [isRefModalOpen, setIsRefModalOpen] = useState(false);

  // --- STATE SEARCH & FILTER ---
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const isAdmin = role.toLowerCase().includes('admin');

  // Data Profile
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

  // --- ACTIONS ---
  const openEditModal = () => {
    setFormData(profile);
    setIsOpen(false);
    setIsEditModalOpen(true);
  };

  const openQuizHistoryModal = async () => {
    setIsOpen(false);
    setIsQuizModalOpen(true);
    setIsQuizLoading(true);
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

  const openRefModal = () => {
    setIsOpen(false);
    setIsRefModalOpen(true);
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

  // --- FILTER LOGIC ---
  const filteredHistory = quizHistory.filter((item) => {
    const searchLower = searchTerm.toLowerCase();
    let matchesSearch = false;
    
    if (isAdmin) {
      const studentName = (item as AdminQuizResultData).studentName?.toLowerCase() || '';
      const quizName = item.quizName?.toLowerCase() || '';
      matchesSearch = studentName.includes(searchLower) || quizName.includes(searchLower);
    } else {
      const quizName = item.quizName?.toLowerCase() || '';
      matchesSearch = quizName.includes(searchLower);
    }

    let matchesFilter = true;
    if (filterType === 'high') matchesFilter = item.score >= 80;
    else if (filterType === 'medium') matchesFilter = item.score >= 60 && item.score < 80;
    else if (filterType === 'low') matchesFilter = item.score < 60;

    return matchesSearch && matchesFilter;
  });

  // --- PERBAIKAN FORMATTER WAKTU ---
  const formatDate = (dateString: string) => {
    if (!dateString) return '-';

    // FIX: Hapus karakter 'Z' (UTC indicator) atau '+00:00'
    // Ini memaksa browser membaca string sebagai "Local Time" (apa adanya),
    // bukan mengonversinya dari UTC ke WIB lagi (yang bikin jam jadi maju 7 jam).
    const localString = dateString.replace('Z', '').replace(/\+00:00$/, '');

    const date = new Date(localString);
    
    if (isNaN(date.getTime())) return '-';

    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(date).replace(/\./g, ':');
  };

  // --- EXPORT EXCEL (HTML TABLE METHOD) ---
  const handleExportExcel = () => {
    if (!filteredHistory || filteredHistory.length === 0) {
      alert("Tidak ada data untuk diexport");
      return;
    }

    let tableRows = '';
    
    filteredHistory.forEach((item, index) => {
      const studentName = (item as AdminQuizResultData).studentName || '-';
      const quizName = item.quizName || '-';
      const score = item.score;
      // Gunakan formatDate yang sudah diperbaiki
      const time = formatDate(item.finishedAt);
      
      const bgRow = index % 2 === 0 ? '#ffffff' : '#f9fafb';
      const scoreColor = score >= 80 ? '#16a34a' : (score >= 60 ? '#ca8a04' : '#dc2626');

      tableRows += `
        <tr style="background-color: ${bgRow};">
          <td style="padding: 10px; border: 1px solid #d1d5db; text-align: center;">${index + 1}</td>
          <td style="padding: 10px; border: 1px solid #d1d5db;">${studentName}</td>
          <td style="padding: 10px; border: 1px solid #d1d5db;">${quizName}</td>
          <td style="padding: 10px; border: 1px solid #d1d5db; text-align: center; color: ${scoreColor}; font-weight: bold;">${score}</td>
          <td style="padding: 10px; border: 1px solid #d1d5db; text-align: center;">${time}</td>
        </tr>
      `;
    });

    const tableTemplate = `
      <html xmlns:x="urn:schemas-microsoft-com:office:excel">
        <head>
          <meta http-equiv="content-type" content="text/plain; charset=UTF-8"/>
        </head>
        <body>
          <h2 style="font-family: Arial, sans-serif; color: #4338ca;">Laporan Hasil Quiz Siswa</h2>
          <p style="font-family: Arial, sans-serif;">Diexport pada: ${new Date().toLocaleString('id-ID', { hour12: false }).replace(/\./g, ':')}</p>
          <br/>
          <table border="1" style="border-collapse: collapse; width: 100%; font-family: Arial, sans-serif;">
            <thead>
              <tr style="background-color: #4f46e5; color: #ffffff;">
                <th style="padding: 12px; border: 1px solid #3730a3; width: 50px;">No</th>
                <th style="padding: 12px; border: 1px solid #3730a3; width: 250px;">Nama Siswa</th>
                <th style="padding: 12px; border: 1px solid #3730a3; width: 250px;">Nama Quiz</th>
                <th style="padding: 12px; border: 1px solid #3730a3; width: 80px;">Nilai</th>
                <th style="padding: 12px; border: 1px solid #3730a3; width: 150px;">Waktu Selesai</th>
              </tr>
            </thead>
            <tbody>
              ${tableRows}
            </tbody>
          </table>
        </body>
      </html>
    `;

    const blob = new Blob([tableTemplate], { type: "application/vnd.ms-excel" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Laporan_Hasil_Quiz_${new Date().toISOString().slice(0,10)}.xls`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const badgeColor = !isAdmin ? 'bg-green-50 text-green-600' : 'bg-indigo-50 text-indigo-600';
  const badgeText = !isAdmin ? 'Siswa' : 'Administrator';
  const avatarBg = !isAdmin ? 'from-green-500 to-emerald-600' : 'from-indigo-600 to-blue-600';

  return (
    <>
      {/* --- NAVBAR ITEM --- */}
      <div className="relative z-50" ref={dropdownRef}>
        <div 
          className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 rounded-xl px-2 py-2 md:px-3 transition-all duration-200 hover:shadow-sm"
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
          <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="px-4 py-4 border-b border-gray-100 flex items-center space-x-3">
              <div className={`w-10 h-10 bg-gradient-to-r ${avatarBg} rounded-full flex items-center justify-center text-white font-bold shadow-sm`}>
                {profile.name ? profile.name.charAt(0).toUpperCase() : '?'}
              </div>
              <div className="overflow-hidden">
                <h3 className="font-semibold text-gray-800 text-sm truncate">{profile.name}</h3>
                <p className="text-xs text-gray-500 truncate">{profile.username || 'user'}</p>
              </div>
            </div>

            <div className="py-2">
              <button onClick={openEditModal} className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 flex items-center space-x-3 transition-all duration-200 rounded-lg mx-2">
                <span className="p-1.5 bg-blue-50 rounded-lg text-blue-600"><Edit size={16} /></span>
                <span>Edit Profil</span>
              </button>
              <button onClick={openQuizHistoryModal} className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-yellow-50 hover:text-yellow-700 flex items-center space-x-3 transition-all duration-200 rounded-lg mx-2">
                <span className="p-1.5 bg-yellow-50 rounded-lg text-yellow-600"><Trophy size={16} /></span>
                <span>{isAdmin ? 'Hasil Quiz Siswa' : 'Riwayat Quiz'}</span>
              </button>
              <button onClick={openRefModal} className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 flex items-center space-x-3 transition-all duration-200 rounded-lg mx-2">
                <span className="p-1.5 bg-purple-50 rounded-lg text-purple-600"><BookOpen size={16} /></span>
                <span>Daftar Pustaka</span>
              </button>
            </div>

            <div className="py-2 border-t border-gray-100">
              <button onClick={handleLogout} className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 flex items-center space-x-3 transition-all duration-200 rounded-lg mx-2">
                <span className="p-1.5 bg-red-50 rounded-lg text-red-600"><LogOut size={16} /></span>
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
              <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <form onSubmit={handleSaveProfile} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="Nama Anda" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <input type="text" required value={formData.username} onChange={(e) => setFormData({...formData, username: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="Username login" />
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium">Batal</button>
                <button type="submit" disabled={isLoading} className="flex-1 px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-medium disabled:opacity-70">{isLoading ? 'Menyimpan...' : 'Simpan'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL QUIZ RESULT --- */}
      {isQuizModalOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden scale-100 flex flex-col max-h-[80vh]">
            
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center shrink-0">
              <h3 className="text-lg font-bold text-gray-800">
                {isAdmin ? 'Hasil Pengerjaan Siswa' : 'Riwayat Quiz Saya'}
              </h3>
              <button onClick={() => setIsQuizModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>

            <div className="px-6 py-3 bg-white border-b border-gray-100 flex flex-wrap gap-2 shadow-sm z-10">
              <div className="relative flex-1 min-w-[150px]">
                <span className="absolute left-3 top-2.5 text-gray-400"><Search size={16} /></span>
                <input 
                  type="text"
                  placeholder={isAdmin ? "Cari siswa/quiz..." : "Cari nama quiz..."}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select 
                className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-600"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="all">Semua Nilai</option>
                <option value="high">≥ 80</option>
                <option value="medium">60 - 79</option>
                <option value="low">&lt; 60</option>
              </select>

              {/* TOMBOL EXPORT EXCEL (HANYA ADMIN) */}
              {isAdmin && (
                <button
                  onClick={handleExportExcel}
                  className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-1 shadow-sm"
                  title="Export data ke Excel (.xls)"
                >
                  <Download size={14} /> <span className="hidden sm:inline">Excel</span>
                </button>
              )}
            </div>

            <div className="p-6 overflow-y-auto custom-scrollbar bg-gray-50/50">
              {isQuizLoading ? (
                <div className="flex flex-col items-center justify-center py-10">
                  <span className="w-6 h-6 border-2 border-gray-200 border-t-blue-500 rounded-full animate-spin mb-2"></span>
                  <p className="text-gray-400 text-xs">Memuat data...</p>
                </div>
              ) : filteredHistory.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <p className="text-sm">Tidak ada riwayat quiz ditemukan.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredHistory.map((item, index) => {
                    const studentName = (item as AdminQuizResultData).studentName; 
                    const quizDesc = (item as QuizResultData).quizDescription;
                    
                    let scoreColor = 'text-gray-600';
                    let borderColor = 'border-gray-200';
                    
                    if (item.score >= 80) { scoreColor = 'text-green-600'; borderColor = 'hover:border-green-300'; }
                    else if (item.score >= 60) { scoreColor = 'text-yellow-600'; borderColor = 'hover:border-yellow-300'; }
                    else { scoreColor = 'text-red-500'; borderColor = 'hover:border-red-300'; }

                    return (
                      <div key={index} className={`bg-white border border-gray-200 rounded-xl p-4 transition-all duration-200 ${borderColor} hover:shadow-sm`}>
                        <div className="flex justify-between items-center gap-4">
                          
                          {/* Left: Info */}
                          <div className="flex-1 min-w-0">
                            {isAdmin ? (
                              <div className="flex flex-col">
                                <span className="text-xs font-semibold text-gray-500 mb-0.5">{studentName}</span>
                                <h4 className="font-bold text-gray-800 text-sm truncate">{item.quizName}</h4>
                              </div>
                            ) : (
                              <div className="flex flex-col">
                                <h4 className="font-bold text-gray-800 text-sm truncate">{item.quizName}</h4>
                                <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">{quizDesc || 'Quiz interaktif'}</p>
                              </div>
                            )}
                            
                            <div className="flex items-center gap-1.5 mt-2 text-gray-400 text-[11px]">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                              <span>{formatDate(item.finishedAt)}</span>
                            </div>
                          </div>

                          {/* Right: Score */}
                          <div className="flex flex-col items-end pl-3 border-l border-gray-100">
                             <span className={`text-2xl font-bold ${scoreColor} leading-none`}>
                                {item.score}
                             </span>
                             <span className="text-[10px] text-gray-400 font-medium mt-1 uppercase tracking-wider">
                                Nilai
                             </span>
                          </div>

                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            
            <div className="bg-gray-50 px-6 py-3 border-t border-gray-100 shrink-0 text-right">
                <button onClick={() => setIsQuizModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors">
                  Tutup
                </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL REFRENSI --- */}
      {isRefModalOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden scale-100 flex flex-col max-h-[85vh]">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center shrink-0">
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <BookOpen className="text-purple-600" size={20} /> Daftar Pustaka & Referensi
              </h3>
              <button onClick={() => setIsRefModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            
            <div className="p-6 overflow-y-auto custom-scrollbar bg-white">
               <div className="space-y-3">
                  {referenceList.map((ref, index) => (
                    <div key={index} className="group relative p-4 bg-white border border-gray-100 rounded-xl hover:border-purple-200 hover:shadow-sm transition-all duration-200">
                       <div className="flex gap-4 items-start">
                          <div className="shrink-0 w-8 h-8 flex items-center justify-center rounded-lg bg-purple-50 text-purple-600 font-bold text-xs group-hover:bg-purple-600 group-hover:text-white transition-colors duration-200">
                             {index + 1}
                          </div>
                          <div className="flex-1">
                             <p className="text-sm text-gray-600 leading-relaxed group-hover:text-gray-900 transition-colors">
                                {ref}
                             </p>
                          </div>
                       </div>
                    </div>
                  ))}
               </div>
            </div>

            <div className="bg-gray-50 px-6 py-3 border-t border-gray-100 shrink-0 text-right">
                <button onClick={() => setIsRefModalOpen(false)} className="px-4 py-2 text-white bg-purple-600 hover:bg-purple-700 rounded-lg text-sm font-medium transition-colors shadow-sm shadow-purple-200">
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