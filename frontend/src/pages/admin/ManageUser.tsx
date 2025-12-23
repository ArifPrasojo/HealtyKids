// src/pages/admin/ManageUser.tsx

import React, { useState, useMemo, useEffect } from 'react';
import { Plus, Edit, Trash2, X, Search, Loader, AlertCircle } from 'lucide-react';
import { userService } from '../../services/api/userService';
import type { UserItem, UserFormData } from '../../services/api/userService';

const ManageUsers = () => {
  const [userList, setUserList] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserItem | null>(null);
  const [userToDelete, setUserToDelete] = useState<UserItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedUser, setExpandedUser] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<UserFormData>({
    name: '',
    username: '',
    password: '',
    role: 'Student'
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await userService.getAllUsers();
      
      if (response.success && Array.isArray(response.data)) {
        setUserList(response.data);
      } else {
        setUserList([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = useMemo(() => {
    return userList.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           user.username.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [userList, searchQuery]);

  const resetForm = () => {
    setFormData({ 
      name: '', 
      username: '', 
      password: '',
      role: 'Student'
    });
  };

  const handleAddUser = () => {
    resetForm();
    setIsAddModalOpen(true);
  };

  const handleEditUser = (user: UserItem) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      username: user.username,
      password: user.password,
      role: user.role
    });
    setIsEditModalOpen(true);
  };

  const handleDeleteUser = (user: UserItem) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const validateForm = (): boolean => {
    if (!formData.name || !formData.username || !formData.password) {
      setError('Semua field harus diisi');
      return false;
    }
    return true;
  };

  const handleSubmitAdd = async () => {
    if (!validateForm()) return;
    
    try {
      setIsSubmitting(true);
      setError(null);
      
      const response = await userService.createUser(formData);

      if (response.success) {
        setIsAddModalOpen(false);
        resetForm();
        await new Promise(resolve => setTimeout(resolve, 500));
        await fetchUsers();
      } else {
        setError(response.message || 'Gagal menambah pengguna');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
      console.error('Add error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitEdit = async () => {
    if (!validateForm() || !editingUser) return;

    try {
      setIsSubmitting(true);
      setError(null);

      const response = await userService.updateUser(editingUser.id, formData);

      if (response.success) {
        setIsEditModalOpen(false);
        setEditingUser(null);
        resetForm();
        await new Promise(resolve => setTimeout(resolve, 500));
        await fetchUsers();
      } else {
        setError(response.message || 'Gagal mengubah pengguna');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
      console.error('Edit error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;

    try {
      setIsSubmitting(true);
      setError(null);

      const response = await userService.deleteUser(userToDelete.id);
      
      if (response.success) {
        setIsDeleteModalOpen(false);
        setUserToDelete(null);
        await new Promise(resolve => setTimeout(resolve, 500));
        await fetchUsers();
      } else {
        setError(response.message || 'Gagal menghapus pengguna');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat menghapus');
      console.error('Delete error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 md:px-6 py-4 md:py-6 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Manajemen Pengguna</h1>
              <p className="text-gray-600 text-xs md:text-sm mt-1">Kelola data dan hak akses pengguna sistem</p>
            </div>
            <button
              onClick={handleAddUser}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-3 md:px-6 py-2 md:py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors text-sm md:text-base whitespace-nowrap"
            >
              <Plus size={18} />
              <span className="hidden sm:inline">Tambah Pengguna</span>
              <span className="sm:hidden">Tambah</span>
            </button>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <AlertCircle size={18} className="text-red-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-red-800 text-sm font-medium">Error</p>
                <p className="text-red-700 text-xs md:text-sm">{error}</p>
              </div>
              <button onClick={() => setError(null)} className="text-red-600 hover:text-red-800">
                <X size={16} />
              </button>
            </div>
          )}

          {/* Search */}
          <div className="flex flex-col gap-3 md:gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Cari nama atau username..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 md:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
        {loading ? (
          <div className="bg-white rounded-lg border border-gray-200 py-8 md:py-12 text-center">
            <Loader size={32} className="mx-auto mb-3 text-blue-600 animate-spin" />
            <p className="text-gray-600 text-base md:text-lg">Memuat data pengguna...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 py-8 md:py-12 text-center">
            <p className="text-gray-500 text-base md:text-lg">Tidak ada pengguna yang ditemukan</p>
          </div>
        ) : (
          <>
            {/* Desktop View - Table */}
            <div className="hidden lg:block bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-semibold text-gray-800">Nama</th>
                      <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-semibold text-gray-800">Username</th>
                      <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-semibold text-gray-800">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 md:px-6 py-3 md:py-4 text-xs md:text-sm font-medium text-gray-800">{user.name}</td>
                        <td className="px-4 md:px-6 py-3 md:py-4 text-xs md:text-sm text-gray-600">{user.username}</td>
                        <td className="px-4 md:px-6 py-3 md:py-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditUser(user)}
                              disabled={isSubmitting}
                              className="p-2 text-blue-600 hover:bg-blue-50 disabled:text-gray-400 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user)}
                              disabled={isSubmitting}
                              className="p-2 text-red-600 hover:bg-red-50 disabled:text-gray-400 rounded-lg transition-colors"
                              title="Hapus"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile View - Cards */}
            <div className="lg:hidden space-y-4">
              {filteredUsers.map((user) => (
                <div key={user.id} className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                  <div 
                    onClick={() => setExpandedUser(expandedUser === user.id ? null : user.id)}
                    className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-800 text-sm md:text-base truncate">{user.name}</h3>
                        <p className="text-xs md:text-sm text-gray-600 truncate">@{user.username}</p>
                      </div>
                      <ChevronDown 
                        size={20} 
                        className={`text-gray-400 transition-transform ${expandedUser === user.id ? 'rotate-180' : ''}`}
                      />
                    </div>
                  </div>

                  {expandedUser === user.id && (
                    <div className="border-t border-gray-200 px-4 py-4 bg-gray-50 space-y-3">
                      <div>
                        <p className="text-xs text-gray-500 font-medium">Username</p>
                        <p className="text-sm text-gray-800">{user.username}</p>
                      </div>
                      <div className="flex gap-2 pt-3">
                        <button
                          onClick={() => {
                            handleEditUser(user);
                            setExpandedUser(null);
                          }}
                          disabled={isSubmitting}
                          className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors font-medium text-sm flex items-center justify-center gap-2"
                        >
                          <Edit size={16} />
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            handleDeleteUser(user);
                            setExpandedUser(null);
                          }}
                          disabled={isSubmitting}
                          className="flex-1 px-3 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white rounded-lg transition-colors font-medium text-sm flex items-center justify-center gap-2"
                        >
                          <Trash2 size={16} />
                          Hapus
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        {/* Info */}
        <div className="mt-4 text-xs md:text-sm text-gray-600">
          Menampilkan {filteredUsers.length} dari {userList.length} pengguna
        </div>
      </div>

      {/* Modal Tambah Pengguna */}
      {isAddModalOpen && (
        <ModalForm
          title="Tambah Pengguna Baru"
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleSubmitAdd}
          onClose={() => setIsAddModalOpen(false)}
          isSubmitting={isSubmitting}
          submitText="Tambah"
        />
      )}

      {/* Modal Edit Pengguna */}
      {isEditModalOpen && editingUser && (
        <ModalForm
          title="Edit Pengguna"
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleSubmitEdit}
          onClose={() => setIsEditModalOpen(false)}
          isSubmitting={isSubmitting}
          submitText="Simpan"
        />
      )}

      {/* Modal Konfirmasi Hapus */}
      {isDeleteModalOpen && userToDelete && (
        <ModalDelete
          userName={userToDelete.name}
          onConfirm={confirmDelete}
          onClose={() => setIsDeleteModalOpen(false)}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
};

// Component untuk Modal Form (Add/Edit)
interface ModalFormProps {
  title: string;
  formData: UserFormData;
  setFormData: React.Dispatch<React.SetStateAction<UserFormData>>;
  onSubmit: () => void;
  onClose: () => void;
  isSubmitting: boolean;
  submitText: string;
}

const ModalForm: React.FC<ModalFormProps> = ({ 
  title, 
  formData, 
  setFormData, 
  onSubmit, 
  onClose, 
  isSubmitting, 
  submitText 
}) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-lg shadow-lg w-full max-w-md border border-gray-200 max-h-[90vh] overflow-y-auto">
      <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-200 sticky top-0 bg-white">
        <h2 className="text-lg md:text-xl font-semibold text-gray-800">{title}</h2>
        <button onClick={onClose} disabled={isSubmitting} className="text-gray-400 hover:text-gray-600 disabled:text-gray-300">
          <X size={20} />
        </button>
      </div>

      <div className="p-4 md:p-6 space-y-4">
        <div>
          <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            placeholder="Masukkan nama lengkap"
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Username</label>
          <input
            type="text"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            placeholder="Masukkan username"
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            placeholder="Masukkan password"
            disabled={isSubmitting}
          />
        </div>

        <div className="flex gap-3 pt-4">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1 px-3 md:px-4 py-2 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 text-gray-700 rounded-lg font-medium transition-colors text-sm"
          >
            Batal
          </button>
          <button
            onClick={onSubmit}
            disabled={isSubmitting}
            className="flex-1 px-3 md:px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors text-sm flex items-center justify-center gap-2"
          >
            {isSubmitting ? <Loader size={16} className="animate-spin" /> : null}
            {isSubmitting ? 'Menyimpan...' : submitText}
          </button>
        </div>
      </div>
    </div>
  </div>
);

// Component untuk Modal Delete
interface ModalDeleteProps {
  userName: string;
  onConfirm: () => void;
  onClose: () => void;
  isSubmitting: boolean;
}

const ModalDelete: React.FC<ModalDeleteProps> = ({ userName, onConfirm, onClose, isSubmitting }) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-lg shadow-lg w-full max-w-sm border border-gray-200">
      <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-200">
        <h2 className="text-lg md:text-xl font-semibold text-gray-800">Konfirmasi Hapus</h2>
        <button onClick={onClose} disabled={isSubmitting} className="text-gray-400 hover:text-gray-600 disabled:text-gray-300">
          <X size={20} />
        </button>
      </div>

      <div className="p-4 md:p-6 space-y-4">
        <div className="text-center">
          <Trash2 size={32} className="text-red-600 mx-auto mb-3" />
          <h3 className="text-base md:text-lg font-medium text-gray-800 mb-2">Hapus Pengguna?</h3>
          <p className="text-gray-600 text-xs md:text-sm">
            Apakah Anda yakin ingin menghapus pengguna "<strong>{userName}</strong>"? Tindakan ini tidak dapat dibatalkan.
          </p>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1 px-3 md:px-4 py-2 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 text-gray-700 rounded-lg font-medium transition-colors text-sm"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            disabled={isSubmitting}
            className="flex-1 px-3 md:px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors text-sm flex items-center justify-center gap-2"
          >
            {isSubmitting ? <Loader size={16} className="animate-spin" /> : null}
            {isSubmitting ? 'Menghapus...' : 'Hapus'}
          </button>
        </div>
      </div>
    </div>
  </div>
);

const ChevronDown = ({ size, className }: { size: number; className: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);

export default ManageUsers;