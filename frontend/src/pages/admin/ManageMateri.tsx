import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/layouts/Layout';
import { Button } from '../../components/ui/Button';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import CloudBackground from '../../components/layouts/CloudBackground';

interface MateriItem {
  id: number;
  title: string;
  description: string;
  createdAt: string;
}

const ManageMateri: React.FC = () => {
  const navigate = useNavigate();
  const [materiList, setMateriList] = useState<MateriItem[]>([
    {
      id: 1,
      title: 'Dasar-Dasar Game Development',
      description: 'Pelajari konsep dasar dalam pengembangan game, mulai dari sejarah hingga genre-game yang ada.',
      createdAt: '2024-01-15'
    },
    {
      id: 2,
      title: 'Tools & Software untuk Game Dev',
      description: 'Pengenalan berbagai engine dan tools yang digunakan dalam industri game development.',
      createdAt: '2024-01-20'
    },
    {
      id: 3,
      title: 'Game Art & Design Principles',
      description: 'Belajar tentang desain visual dan prinsip-prinsip dalam membuat game yang menarik.',
      createdAt: '2024-01-25'
    }
  ]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingMateri, setEditingMateri] = useState<MateriItem | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  });

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [materiToDelete, setMateriToDelete] = useState<MateriItem | null>(null);

  const handleAddMateri = () => {
    setFormData({ title: '', description: '' });
    setIsAddModalOpen(true);
  };

  const handleEditMateri = (materi: MateriItem) => {
    setEditingMateri(materi);
    setFormData({
      title: materi.title,
      description: materi.description
    });
    setIsEditModalOpen(true);
  };

  const handleDeleteMateri = (materi: MateriItem) => {
    setMateriToDelete(materi);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (materiToDelete) {
      setMateriList(materiList.filter(m => m.id !== materiToDelete.id));
      setIsDeleteModalOpen(false);
      setMateriToDelete(null);
    }
  };

  const handleSubmitAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const newMateri: MateriItem = {
      id: Math.max(...materiList.map(m => m.id)) + 1,
      title: formData.title,
      description: formData.description,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setMateriList([...materiList, newMateri]);
    setIsAddModalOpen(false);
    setFormData({ title: '', description: '' });
  };

  const handleSubmitEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingMateri) {
      setMateriList(materiList.map(m => 
        m.id === editingMateri.id 
          ? { ...m, title: formData.title, description: formData.description }
          : m
      ));
    }
    setIsEditModalOpen(false);
    setEditingMateri(null);
    setFormData({ title: '', description: '' });
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  const handleSubMateri = (materi: MateriItem) => {
    navigate(`/admin/submateri${materi.id}`);
  };

  return (
    <Layout>
      <div className="min-h-screen relative">
        {/* Cloud Background dengan Tema Anak-Anak */}
        <CloudBackground 
          showCityBottom={true}
          showPlane={true}
          planeCount={3}
          planeSize="medium"
        />

        <div className="relative z-10 w-full px-4 md:px-6 py-4 md:py-8">
          {/* Header dengan Desain Lebih Clean */}
          <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-6 md:p-8 mb-8 border border-gray-200">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">📚</span>
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                    Manajemen Materi
                  </h1>
                  <p className="text-gray-600 text-lg">
                    Kelola dan atur materi pembelajaran untuk siswa
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Tombol Tambah Materi dengan Desain Clean */}
                <Button
                  onClick={handleBackToDashboard}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-xl font-semibold shadow-md flex items-center space-x-2 transition-all duration-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  <span>Kembali ke Dashboard</span>
                </Button>
                <Button
                  onClick={handleAddMateri}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow-md flex items-center space-x-2 transition-all duration-200"
                >
                  <Plus size={20} />
                  <span>Tambah Materi</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Materi Cards Grid dengan Tema Anak-Anak - Sesuai dengan MateriHome */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {materiList.map((materi, index) => (
              <div
                key={materi.id}
                className="bg-transparent backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border border-white/20 group flex flex-col"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Content Area */}
                <div className="p-8 flex-grow flex flex-col">
                  {/* Icon */}
                  <div className="mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <span className="text-3xl">📚</span>
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {materi.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-6">
                    {materi.description}
                  </p>

                  {/* Spacer untuk push button ke bawah */}
                  <div className="mt-auto">
                    {/* Action Buttons dengan Tema - 3 Buttons */}
                    <div className="grid grid-cols-3 gap-2">
                      <Button
                        onClick={() => handleSubMateri(materi)}
                        className="bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-white px-3 py-2 rounded-xl font-bold shadow-md flex items-center justify-center space-x-1 transform hover:scale-105 transition-all duration-300"
                      >
                        <span className="text-xs">Sub</span>
                      </Button>
                      
                      <Button
                        onClick={() => handleEditMateri(materi)}
                        className="bg-gradient-to-r from-blue-400 to-indigo-500 hover:from-blue-500 hover:to-indigo-600 text-white px-3 py-2 rounded-xl font-bold shadow-md flex items-center justify-center space-x-1 transform hover:scale-105 transition-all duration-300"
                      >
                        <Edit size={14} />
                      </Button>
                      
                      <Button
                        onClick={() => handleDeleteMateri(materi)}
                        className="bg-gradient-to-r from-red-400 to-pink-500 hover:from-red-500 hover:to-pink-600 text-white px-3 py-2 rounded-xl font-bold shadow-md flex items-center justify-center space-x-1 transform hover:scale-105 transition-all duration-300"
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Bottom Accent Line */}
                <div className="h-1 bg-gradient-to-r from-blue-400 to-indigo-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
              </div>
            ))}
          </div>

          {/* Modal untuk Tambah Materi - Minimalis dan Elegan */}
          {isAddModalOpen && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl shadow-xl w-full max-w-md border border-gray-200">
                <div className="bg-gray-50 p-6 flex items-center justify-between rounded-t-2xl border-b border-gray-200">
                  <h2 className="text-gray-800 font-semibold text-xl">
                    Tambah Materi Baru
                  </h2>
                  <button
                    onClick={() => setIsAddModalOpen(false)}
                    className="text-gray-400 hover:text-gray-600 rounded-full p-1 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={handleSubmitAdd} className="p-6 space-y-5 rounded-b-2xl">
                  <div>
                    <label htmlFor="title-add" className="block text-sm font-medium text-gray-700 mb-2">
                      Judul Materi
                    </label>
                    <input
                      type="text"
                      id="title-add"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="Masukkan judul materi"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="description-add" className="block text-sm font-medium text-gray-700 mb-2">
                      Deskripsi Materi
                    </label>
                    <textarea
                      id="description-add"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                      placeholder="Masukkan deskripsi materi"
                      required
                    />
                  </div>

                  <div className="flex space-x-3">
                    <Button
                      type="button"
                      onClick={() => setIsAddModalOpen(false)}
                      className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-3 rounded-lg font-medium transition-colors"
                    >
                      Batal
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-medium shadow-md transition-colors"
                    >
                      Tambah Materi
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Modal untuk Edit Materi - Minimalis dan Elegan */}
          {isEditModalOpen && editingMateri && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl shadow-xl w-full max-w-md border border-gray-200">
                <div className="bg-gray-50 p-6 flex items-center justify-between rounded-t-2xl border-b border-gray-200">
                  <h2 className="text-gray-800 font-semibold text-xl">
                    Edit Materi
                  </h2>
                  <button
                    onClick={() => setIsEditModalOpen(false)}
                    className="text-gray-400 hover:text-gray-600 rounded-full p-1 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={handleSubmitEdit} className="p-6 space-y-5 rounded-b-2xl">
                  <div>
                    <label htmlFor="title-edit" className="block text-sm font-medium text-gray-700 mb-2">
                      Judul Materi
                    </label>
                    <input
                      type="text"
                      id="title-edit"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="Masukkan judul materi"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="description-edit" className="block text-sm font-medium text-gray-700 mb-2">
                      Deskripsi Materi
                    </label>
                    <textarea
                      id="description-edit"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                      placeholder="Masukkan deskripsi materi"
                      required
                    />
                  </div>

                  <div className="flex space-x-3">
                    <Button
                      type="button"
                      onClick={() => setIsEditModalOpen(false)}
                      className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-3 rounded-lg font-medium transition-colors"
                    >
                      Batal
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-medium shadow-md transition-colors"
                    >
                      Simpan Perubahan
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Modal untuk Konfirmasi Hapus - Minimalis dan Elegan */}
          {isDeleteModalOpen && materiToDelete && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm border border-gray-200">
                <div className="bg-gray-50 p-6 flex items-center justify-between rounded-t-2xl border-b border-gray-200">
                  <h2 className="text-gray-800 font-semibold text-xl">
                    Konfirmasi Hapus
                  </h2>
                  <button
                    onClick={() => setIsDeleteModalOpen(false)}
                    className="text-gray-400 hover:text-gray-600 rounded-full p-1 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="p-6 space-y-5 rounded-b-2xl">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Trash2 size={24} className="text-red-600" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">
                      Hapus Materi?
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Apakah Anda yakin ingin menghapus materi "<strong className="text-gray-800">{materiToDelete.title}</strong>"? Tindakan ini tidak dapat dibatalkan.
                    </p>
                  </div>

                  <div className="flex space-x-3">
                    <Button
                      type="button"
                      onClick={() => setIsDeleteModalOpen(false)}
                      className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-3 rounded-lg font-medium transition-colors"
                    >
                      Batal
                    </Button>
                    <Button
                      onClick={confirmDelete}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg font-medium shadow-md transition-colors"
                    >
                      Hapus Materi
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ManageMateri;