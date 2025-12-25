// src/pages/admin/ManageUsers.tsx

import React, { useState, useMemo, useEffect } from 'react';
import { 
  Plus, Edit, Trash2, X, Search, Loader, AlertCircle, 
  ArrowLeft 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { userService } from '../../services/api/userService';
import type { UserItem, UserFormData } from '../../services/api/userService';

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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto mb-6">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-blue-600 mb-4 text-sm font-medium">
          <ArrowLeft size={18} /> Kembali
        </button>

        <div className="flex justify-between items-end mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Manajemen Pengguna</h1>
            <p className="text-gray-500 text-sm mt-1">Kelola data siswa</p>
          </div>
          <button onClick={handleAddUser} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 font-medium transition-colors shadow-sm">
            <Plus size={20} /> Tambah Pengguna
          </button>
        </div>

        {/* Global Error Fallback */}
        {globalError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700 animate-fade-in">
            <AlertCircle size={20} />
            <span className="text-sm font-medium">{globalError}</span>
            <button onClick={() => setGlobalError(null)} className="ml-auto"><X size={18} /></button>
          </div>
        )}

        {/* TABLE DATA */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-white">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Cari user..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all"
              />
            </div>
          </div>

          {loading ? (
             <div className="py-20 flex flex-col items-center justify-center text-gray-500">
                <Loader className="animate-spin mb-2 text-blue-600" size={30} />
                <span className="text-sm">Memuat data...</span>
             </div>
          ) : (
            <div className="overflow-x-auto">
              {/* Desktop Table - KOLOM ROLE DIHAPUS */}
              <table className="w-full text-left hidden md:table">
                <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold">
                  <tr>
                    <th className="px-6 py-4">Nama</th>
                    <th className="px-6 py-4">Username</th>
                    {/* Role Header dihapus */}
                    <th className="px-6 py-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">{user.name}</td>
                      <td className="px-6 py-4 text-gray-500">@{user.username}</td>
                      {/* Role Cell dihapus */}
                      <td className="px-6 py-4 text-right flex justify-end gap-2">
                        <button onClick={() => handleEditUser(user)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"><Edit size={16} /></button>
                        <button onClick={() => handleDeleteUser(user)} className="p-1.5 text-red-600 hover:bg-red-50 rounded"><Trash2 size={16} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Mobile View - BADGE ROLE DIHAPUS */}
              <div className="md:hidden">
                 {filteredUsers.map(user => (
                    <div key={user.id} className="p-4 border-b border-gray-100">
                        <div className="flex justify-between items-start mb-1">
                            <span className="font-bold text-gray-800">{user.name}</span>
                            {/* Role Badge dihapus */}
                        </div>
                        <div className="text-sm text-gray-500 mb-3">@{user.username}</div>
                        <div className="flex gap-2">
                            <button onClick={() => handleEditUser(user)} className="flex-1 py-2 border border-blue-200 text-blue-600 rounded text-sm hover:bg-blue-50">Edit</button>
                            <button onClick={() => handleDeleteUser(user)} className="flex-1 py-2 border border-red-200 text-red-600 rounded text-sm hover:bg-red-50">Hapus</button>
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
            
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h2 className="text-lg font-bold text-gray-800">
                {editingUser ? "Edit Data Pengguna" : "Tambah Pengguna Baru"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              <form id="userForm" onSubmit={handleSubmit} className="space-y-5">
                
                {/* FIELD: NAMA */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Nama Lengkap <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={getInputClass('name')}
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
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Username <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className={getInputClass('username')}
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
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-sm font-semibold text-gray-700">
                      Password {editingUser && <span className="text-gray-400 font-normal text-xs ml-1">(Opsional)</span>}
                    </label>
                    {!editingUser && <span className="text-red-500 text-xs font-bold">* Wajib</span>}
                  </div>
                  
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className={getInputClass('password')}
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

            <div className="p-4 border-t border-gray-100 bg-gray-50 flex gap-3 justify-end">
              <button 
                onClick={() => setIsModalOpen(false)} 
                type="button"
                className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-200 rounded-lg"
              >
                Batal
              </button>
              <button 
                type="submit" 
                form="userForm"
                disabled={isSubmitting}
                className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 shadow-sm transition-colors"
              >
                {isSubmitting && <Loader size={14} className="animate-spin" />}
                {editingUser ? "Simpan Perubahan" : "Simpan Data"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DELETE */}
      {isDeleteModalOpen && userToDelete && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-sm w-full text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600">
                <Trash2 size={24} />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Hapus User?</h3>
            <p className="text-gray-500 text-sm mb-6">User <strong>{userToDelete.name}</strong> akan dihapus permanen.</p>
            <div className="flex gap-3">
              <button onClick={() => setIsDeleteModalOpen(false)} disabled={isSubmitting} className="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">Batal</button>
              <button onClick={confirmDelete} disabled={isSubmitting} className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm flex justify-center gap-2">
                {isSubmitting && <Loader size={14} className="animate-spin" />} Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;