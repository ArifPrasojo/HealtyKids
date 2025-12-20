import React, { useState, useMemo } from 'react';
import { Plus, Edit, Trash2, X, Search, Menu, ChevronDown } from 'lucide-react';

interface UserItem {
  id: number;
  name: string;
  username: string;
  phone: string;
  role: string;
  status: string;
  joinedAt: string;
}

const ManageUsers = () => {
  const [userList, setUserList] = useState<UserItem[]>([
    {
      id: 1,
      name: 'John Doe',
      username: 'john.doe@example.com',
      phone: '+62 812-3456-7890',
      role: 'Admin',
      status: 'Active',
      joinedAt: '2024-01-15'
    },
    {
      id: 2,
      name: 'Jane Smith',
      username: 'jane.smith@example.com',
      phone: '+62 812-9876-5432',
      role: 'Teacher',
      status: 'Active',
      joinedAt: '2024-01-20'
    },
    {
      id: 3,
      name: 'Ahmad Rahman',
      username: 'ahmad.rahman@example.com',
      phone: '+62 812-1111-2222',
      role: 'Student',
      status: 'Inactive',
      joinedAt: '2024-01-25'
    },
    {
      id: 4,
      name: 'Siti Nurhaliza',
      username: 'siti.nurhaliza@example.com',
      phone: '+62 812-3333-4444',
      role: 'Teacher',
      status: 'Active',
      joinedAt: '2024-02-01'
    },
    {
      id: 5,
      name: 'Budi Santoso',
      username: 'budi.santoso@example.com',
      phone: '+62 812-5555-6666',
      role: 'Student',
      status: 'Active',
      joinedAt: '2024-02-05'
    }
  ]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserItem | null>(null);
  const [userToDelete, setUserToDelete] = useState<UserItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('All');
  const [expandedUser, setExpandedUser] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    username: '',
    phone: '',
    role: 'Student',
    status: 'Active'
  });

  // Filter dan search
  const filteredUsers = useMemo(() => {
    return userList.filter(user => {
      const matchesRole = selectedRole === 'All' || user.role === selectedRole;
      const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           user.username.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesRole && matchesSearch;
    });
  }, [userList, selectedRole, searchQuery]);

  const handleAddUser = () => {
    setFormData({ 
      name: '', 
      username: '', 
      phone: '', 
      role: 'Student',
      status: 'Active'
    });
    setIsAddModalOpen(true);
  };

  const handleEditUser = (user: UserItem) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      username: user.username,
      phone: user.phone,
      role: user.role,
      status: user.status
    });
    setIsEditModalOpen(true);
  };

  const handleDeleteUser = (user: UserItem) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (userToDelete) {
      setUserList(userList.filter(u => u.id !== userToDelete.id));
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
    }
  };

  const handleSubmitAdd = () => {
    if (!formData.name || !formData.username || !formData.phone) return;
    
    const newUser: UserItem = {
      id: Math.max(...userList.map(u => u.id), 0) + 1,
      name: formData.name,
      username: formData.username,
      phone: formData.phone,
      role: formData.role,
      status: formData.status,
      joinedAt: new Date().toISOString().split('T')[0]
    };
    setUserList([...userList, newUser]);
    setIsAddModalOpen(false);
    setFormData({ 
      name: '', 
      username: '', 
      phone: '', 
      role: 'Student',
      status: 'Active'
    });
  };

  const handleSubmitEdit = () => {
    if (!formData.name || !formData.username || !formData.phone) return;
    
    if (editingUser) {
      setUserList(userList.map(u => 
        u.id === editingUser.id 
          ? { 
              ...u, 
              name: formData.name, 
              username: formData.username, 
              phone: formData.phone,
              role: formData.role,
              status: formData.status
            }
          : u
      ));
    }
    setIsEditModalOpen(false);
    setEditingUser(null);
    setFormData({ 
      name: '', 
      username: '', 
      phone: '', 
      role: 'Student',
      status: 'Active'
    });
  };

  const getStatusColor = (status: string) => {
    return status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const getRoleColor = (role: string) => {
    switch(role) {
      case 'Admin': return 'bg-purple-100 text-purple-800';
      case 'Teacher': return 'bg-blue-100 text-blue-800';
      case 'Student': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 md:px-6 py-4 md:py-6 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto">
          {/* Top Section */}
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Manajemen Pengguna</h1>
              <p className="text-gray-600 text-xs md:text-sm mt-1">Kelola data dan hak akses pengguna sistem</p>
            </div>
            <button
              onClick={handleAddUser}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 md:px-6 py-2 md:py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors text-sm md:text-base whitespace-nowrap"
            >
              <Plus size={18} className="md:w-5 md:h-5" />
              <span className="hidden sm:inline">Tambah Pengguna</span>
              <span className="sm:hidden">Tambah</span>
            </button>
          </div>

          {/* Search dan Filter */}
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
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="px-3 md:px-4 py-2 md:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white transition-all"
            >
              <option value="All">Semua Role</option>
              <option value="Admin">Admin</option>
              <option value="Teacher">Teacher</option>
              <option value="Student">Student</option>
            </select>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
        {filteredUsers.length === 0 ? (
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
                      <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-semibold text-gray-800">username</th>
                      <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-semibold text-gray-800">No. Telepon</th>
                      <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-semibold text-gray-800">Role</th>
                      <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-semibold text-gray-800">Status</th>
                      <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-semibold text-gray-800">Bergabung</th>
                      <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-semibold text-gray-800">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 md:px-6 py-3 md:py-4 text-xs md:text-sm font-medium text-gray-800">{user.name}</td>
                        <td className="px-4 md:px-6 py-3 md:py-4 text-xs md:text-sm text-gray-600 break-all">{user.username}</td>
                        <td className="px-4 md:px-6 py-3 md:py-4 text-xs md:text-sm text-gray-600">{user.phone}</td>
                        <td className="px-4 md:px-6 py-3 md:py-4">
                          <span className={`inline-block px-2 md:px-3 py-1 rounded-full text-xs font-semibold ${getRoleColor(user.role)}`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-4 md:px-6 py-3 md:py-4">
                          <span className={`inline-block px-2 md:px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(user.status)}`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="px-4 md:px-6 py-3 md:py-4 text-xs md:text-sm text-gray-600">{user.joinedAt}</td>
                        <td className="px-4 md:px-6 py-3 md:py-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditUser(user)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
                        <p className="text-xs md:text-sm text-gray-600 truncate">{user.username}</p>
                        <div className="flex gap-2 mt-2 flex-wrap">
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${getRoleColor(user.role)}`}>
                            {user.role}
                          </span>
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(user.status)}`}>
                            {user.status}
                          </span>
                        </div>
                      </div>
                      <ChevronDown 
                        size={20} 
                        className={`text-gray-400 flex-shrink-0 transition-transform ${expandedUser === user.id ? 'rotate-180' : ''}`}
                      />
                    </div>
                  </div>

                  {expandedUser === user.id && (
                    <div className="border-t border-gray-200 px-4 py-4 bg-gray-50 space-y-3">
                      <div>
                        <p className="text-xs text-gray-500 font-medium">username</p>
                        <p className="text-sm text-gray-800 break-all">{user.username}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium">No. Telepon</p>
                        <p className="text-sm text-gray-800">{user.phone}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium">Bergabung</p>
                        <p className="text-sm text-gray-800">{user.joinedAt}</p>
                      </div>
                      <div className="flex gap-2 pt-3">
                        <button
                          onClick={() => {
                            handleEditUser(user);
                            setExpandedUser(null);
                          }}
                          className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium text-sm flex items-center justify-center gap-2"
                        >
                          <Edit size={16} />
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            handleDeleteUser(user);
                            setExpandedUser(null);
                          }}
                          className="flex-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium text-sm flex items-center justify-center gap-2"
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md border border-gray-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-200 sticky top-0 bg-white">
              <h2 className="text-lg md:text-xl font-semibold text-gray-800">Tambah Pengguna Baru</h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
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
                />
              </div>

              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">username</label>
                <input
                  type="username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="Masukkan username"
                />
              </div>

              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Nomor Telepon</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="Masukkan nomor telepon"
                />
              </div>

              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  <option value="Admin">Admin</option>
                  <option value="Teacher">Teacher</option>
                  <option value="Student">Student</option>
                </select>
              </div>

              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 px-3 md:px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-colors text-sm"
                >
                  Batal
                </button>
                <button
                  onClick={handleSubmitAdd}
                  className="flex-1 px-3 md:px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors text-sm"
                >
                  Tambah
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Edit Pengguna */}
      {isEditModalOpen && editingUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md border border-gray-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-200 sticky top-0 bg-white">
              <h2 className="text-lg md:text-xl font-semibold text-gray-800">Edit Pengguna</h2>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
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
                />
              </div>

              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Username</label>
                <input
                  type="username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>

              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Nomor Telepon</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>

              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  <option value="Admin">Admin</option>
                  <option value="Teacher">Teacher</option>
                  <option value="Student">Student</option>
                </select>
              </div>

              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 px-3 md:px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-colors text-sm"
                >
                  Batal
                </button>
                <button
                  onClick={handleSubmitEdit}
                  className="flex-1 px-3 md:px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors text-sm"
                >
                  Simpan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Hapus */}
      {isDeleteModalOpen && userToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-sm border border-gray-200">
            <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-200">
              <h2 className="text-lg md:text-xl font-semibold text-gray-800">Konfirmasi Hapus</h2>
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-4 md:p-6 space-y-4">
              <div className="text-center">
                <Trash2 size={32} className="text-red-600 mx-auto mb-3" />
                <h3 className="text-base md:text-lg font-medium text-gray-800 mb-2">Hapus Pengguna?</h3>
                <p className="text-gray-600 text-xs md:text-sm">
                  Apakah Anda yakin ingin menghapus pengguna "<strong>{userToDelete.name}</strong>"? Tindakan ini tidak dapat dibatalkan.
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="flex-1 px-3 md:px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-colors text-sm"
                >
                  Batal
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-3 md:px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors text-sm"
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;