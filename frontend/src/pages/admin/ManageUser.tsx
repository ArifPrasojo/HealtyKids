// src/pages/admin/ManageUsers.tsx

import React, { useState, useMemo, useEffect } from 'react';
import { 
  Plus, Edit, Trash2, X, Search, Loader, AlertCircle, 
  ArrowLeft 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { userService } from '../../services/api/userService';
import type { UserItem, UserFormData } from '../../services/api/userService';
import CloudBackground from '../../components/layouts/CloudBackground'; // Import CloudBackground

const ManageUsers = () => {
  const navigate = useNavigate();

  // --- STATE ---
  const [userList, setUserList] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State Error & Form
  const [globalError, setGlobalError] = useState<string | null>(null); 
  const [formErrors, setFormErrors] = useState<Record<string, string>>({}); 

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  const [editingUser, setEditingUser] = useState<UserItem | null>(null);
  const [userToDelete, setUserToDelete] = useState<UserItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form Data Default (Role disembunyikan & default 'Student')
  const initialFormState: UserFormData = {
    name: '',
    username: '',
    password: '',
    role: 'Student' 
  };
  const [formData, setFormData] = useState<UserFormData>(initialFormState);

  // --- FETCH DATA ---
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await userService.getAllUsers();
      if (response.success && Array.isArray(response.data)) {
        setUserList(response.data);
      } else {
        setUserList([]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = useMemo(() => {
    return userList.filter(user => 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [userList, searchQuery]);

  // --- HANDLERS ---

  const handleAddUser = () => {
    setEditingUser(null);
    setFormData(initialFormState);
    setFormErrors({});
    setGlobalError(null);
    setIsModalOpen(true);
  };

  const handleEditUser = (user: UserItem) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      username: user.username,
      password: '',
      role: user.role // Tetap simpan role lama di state agar tidak hilang saat update
    });
    setFormErrors({});
    setGlobalError(null);
    setIsModalOpen(true);
  };

  const handleDeleteUser = (user: UserItem) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  // --- VALIDASI ---
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    // A. Validasi Nama
    if (!formData.name || formData.name.trim() === '') {
      newErrors.name = 'Nama lengkap wajib diisi';
      isValid = false;
    }

    // B. Validasi Username
    if (!formData.username || formData.username.trim() === '') {
      newErrors.username = 'Username wajib diisi';
      isValid = false;
    } else if (/\s/.test(formData.username)) {
      newErrors.username = 'Username tidak boleh mengandung spasi';
      isValid = false;
    }

    // C. Validasi Password
    if (!editingUser) {
        if (!formData.password) {
            newErrors.password = 'Password wajib diisi untuk user baru';
            isValid = false;
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password minimal 6 karakter';
            isValid = false;
        }
    } else {
        if (formData.password && formData.password.length > 0) {
            if (formData.password.length < 6) {
                newErrors.password = 'Password baru minimal 6 karakter';
                isValid = false;
            }
        }
    }

    setFormErrors(newErrors);
    if (!isValid) setGlobalError(null); 
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setGlobalError(null);

    try {
      let response;
      if (editingUser) {
        response = await userService.updateUser(editingUser.id, formData);
      } else {
        response = await userService.createUser(formData);
      }

      if (response.success) {
        setIsModalOpen(false);
        setEditingUser(null);
        fetchUsers();
      } else {
        setGlobalError(response.message || 'Gagal menyimpan data');
      }
    } catch (err) {
      setGlobalError(err instanceof Error ? err.message : 'Terjadi kesalahan sistem');
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;
    setIsSubmitting(true);
    try {
      const response = await userService.deleteUser(userToDelete.id);
      if (response.success) {
        setIsDeleteModalOpen(false);
        setUserToDelete(null);
        fetchUsers();
      } else {
        setGlobalError(response.message || 'Gagal menghapus');
      }
    } catch (err) {
      setGlobalError('Terjadi kesalahan saat menghapus');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInputClass = (fieldName: string) => `
    w-full px-4 py-2 border rounded-lg outline-none transition-all text-sm
    ${formErrors[fieldName]
      ? 'border-red-500 bg-red-50 focus:ring-red-200 placeholder-red-300' 
      : 'border-gray-300 focus:ring-blue-100 focus:border-blue-500'
    }
  `;

  // --- RENDER ---
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 overflow-hidden">
      {/* CloudBackground sebagai background */}
      <CloudBackground 
        cloudImage="./src/assets/images/awanhijau.png"
        showCityBottom={true}
        showPlane={true}
        planeSize="medium"
        planeCount={2}
      />
      
      {/* Konten utama di atas background */}
      <div className="relative z-10 min-h-screen p-6">
        <div className="max-w-6xl mx-auto">
          <button onClick={() => navigate(-1)} className="group flex items-center gap-2 text-gray-600 hover:text-blue-700 transition-colors mb-6 text-sm font-medium w-fit hover:bg-blue-50 px-3 py-2 rounded-lg">
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            Kembali
          </button>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Manajemen Pengguna</h1>
              <p className="text-gray-600 text-base">Kelola data siswa dengan mudah dan efisien</p>
            </div>
            <button onClick={handleAddUser} className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-3 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
              <Plus size={22} />
              <span>Tambah Pengguna</span>
            </button>
          </div>

          {/* Global Error Fallback */}
          {globalError && (
            <div className="mb-8 p-5 bg-red-50 border-l-4 border-red-500 rounded-xl flex items-start gap-4 animate-fade-in shadow-sm">
              <AlertCircle size={24} className="text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-red-900 text-base font-semibold">Terjadi Kesalahan</h3>
                <p className="text-red-800 text-sm mt-1">{globalError}</p>
              </div>
              <button onClick={() => setGlobalError(null)} className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100 transition-colors">
                <X size={20} />
              </button>
            </div>
          )}

          {/* TABLE DATA */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
              <div className="relative max-w-lg">
                <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Cari nama atau username..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-transparent outline-none transition-all text-base shadow-sm"
                />
              </div>
            </div>

            {loading ? (
               <div className="py-24 text-center">
                  <Loader size={48} className="mx-auto text-blue-600 animate-spin mb-6" />
                  <p className="text-gray-600 font-medium text-lg">Memuat data pengguna...</p>
               </div>
            ) : (
              <div className="overflow-x-auto">
                {/* Desktop Table - KOLOM ROLE DIHAPUS */}
                <table className="w-full text-left hidden md:table">
                  <thead>
                    <tr className="bg-gradient-to-r from-gray-100 to-gray-50 border-b border-gray-200 text-sm font-semibold text-gray-600 uppercase tracking-wider">
                      <th className="px-8 py-5">Nama</th>
                      <th className="px-8 py-5">Username</th>
                      {/* Role Header dihapus */}
                      <th className="px-8 py-5 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-blue-50/50 transition-colors">
                        <td className="px-8 py-5 font-semibold text-gray-900 text-base">{user.name}</td>
                        <td className="px-8 py-5 text-gray-700">@{user.username}</td>
                        {/* Role Cell dihapus */}
                        <td className="px-8 py-5 text-right">
                          <div className="flex items-center justify-end gap-3">
                            <button onClick={() => handleEditUser(user)} className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                              <Edit size={18} />
                            </button>
                            <button onClick={() => handleDeleteUser(user)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Mobile View - BADGE ROLE DIHAPUS */}
                <div className="md:hidden bg-gray-50/50 p-6 space-y-6">
                   {filteredUsers.map(user => (
                      <div key={user.id} className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden p-6">
                          <div className="flex justify-between items-start gap-4 mb-4">
                              <div className="flex-1">
                                <h3 className="font-bold text-gray-900 text-lg">{user.name}</h3>
                                <p className="text-sm text-gray-500 mt-2">@{user.username}</p>
                              </div>
                          </div>
                          <div className="flex gap-3">
                              <button onClick={() => handleEditUser(user)} className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl text-base font-medium shadow-sm">
                                <Edit size={18} /> Edit
                              </button>
                              <button onClick={() => handleDeleteUser(user)} className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white border border-red-300 text-red-600 hover:bg-red-50 rounded-xl text-base font-medium shadow-sm">
                                <Trash2 size={18} /> Hapus
                              </button>
                          </div>
                      </div>
                   ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* --- MODAL FORM --- */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-gray-200 overflow-hidden transform transition-all scale-100">
              
              <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-gray-50 to-white">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingUser ? "Edit Data Pengguna" : "Tambah Pengguna Baru"}
                </h2>
                <button onClick={() => setIsModalOpen(false)} disabled={isSubmitting} className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-full hover:bg-gray-200">
                  <X size={24} />
                </button>
              </div>

              <div className="p-8">
                <form id="userForm" onSubmit={handleSubmit} className="space-y-5">
                  
                  {/* FIELD: NAMA */}
                  <div>
                    <label className="block text-base font-semibold text-gray-800 mb-3">
                      Nama Lengkap <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className={`w-full px-5 py-3 border rounded-xl outline-none transition-all text-base shadow-sm ${
                        formErrors.name
                          ? 'border-red-500 bg-red-50 focus:ring-red-200 placeholder-red-300' 
                          : 'border-gray-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500'
                      }`}
                      placeholder="Nama Siswa"
                    />
                    {formErrors.name && (
                      <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle size={12} /> {formErrors.name}
                      </p>
                    )}
                  </div>

                  {/* FIELD: USERNAME */}
                  <div>
                    <label className="block text-base font-semibold text-gray-800 mb-3">
                      Username <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      className={`w-full px-5 py-3 border rounded-xl outline-none transition-all text-base shadow-sm ${
                        formErrors.username
                          ? 'border-red-500 bg-red-50 focus:ring-red-200 placeholder-red-300' 
                          : 'border-gray-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500'
                      }`}
                      placeholder="Username tanpa spasi"
                    />
                    {formErrors.username && (
                      <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle size={12} /> {formErrors.username}
                      </p>
                    )}
                  </div>

                  {/* FIELD: PASSWORD */}
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <label className="block text-base font-semibold text-gray-800">
                        Password {editingUser && <span className="text-gray-400 font-normal text-xs ml-1">(Opsional)</span>}
                      </label>
                      {!editingUser && <span className="text-red-500 text-xs font-bold">* Wajib</span>}
                    </div>
                    
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className={`w-full px-5 py-3 border rounded-xl outline-none transition-all text-base shadow-sm ${
                        formErrors.password
                          ? 'border-red-500 bg-red-50 focus:ring-red-200 placeholder-red-300' 
                          : 'border-gray-300 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500'
                      }`}
                      placeholder={editingUser ? "Kosongkan jika tidak ingin mengubah" : "Minimal 6 karakter"}
                    />
                    
                    {formErrors.password && (
                      <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                        <AlertCircle size={12} /> {formErrors.password}
                      </p>
                    )}
                  </div>

                </form>
              </div>

              <div className="p-6 border-t border-gray-100 bg-gray-50 flex gap-4 justify-end">
                <button 
                  onClick={() => setIsModalOpen(false)} 
                  type="button"
                  className="px-6 py-3 text-base font-medium text-gray-600 hover:bg-gray-200 rounded-xl transition-colors"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  form="userForm"
                  disabled={isSubmitting}
                  className="px-6 py-3 text-base font-medium bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-blue-400 disabled:to-blue-500 text-white rounded-xl transition-all shadow-lg flex items-center gap-2"
                >
                  {isSubmitting && <Loader size={18} className="animate-spin" />}
                  {editingUser ? "Simpan Perubahan" : "Simpan Data"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL DELETE */}
        {isDeleteModalOpen && userToDelete && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-gray-200 overflow-hidden text-center p-8">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 text-red-600">
                  <Trash2 size={32} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Hapus User?</h3>
              <p className="text-gray-600 text-base mb-8 leading-relaxed">
                User <strong>{userToDelete.name}</strong> akan dihapus permanen.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  disabled={isSubmitting}
                  className="flex-1 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 font-medium text-base transition-colors shadow-sm"
                >
                  Batal
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={isSubmitting}
                  className="flex-1 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-xl font-medium text-base transition-colors flex items-center justify-center gap-2 shadow-lg"
                >
                  {isSubmitting && <Loader size={18} className="animate-spin" />}
                  Hapus
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageUsers;