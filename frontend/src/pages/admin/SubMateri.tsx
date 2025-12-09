import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../../components/layouts/Layout';
import { Button } from '../../components/ui/Button';
import { Plus, Edit, Trash2, ArrowLeft } from 'lucide-react';
import CloudBackground from '../../components/layouts/CloudBackground';
import { Table } from '../../components/ui/Table';

interface SubMateriItem {
  id: number;
  no: number;
  subMateri: string;
}

const Submateri: React.FC = () => {
  const navigate = useNavigate();
  const { materiId } = useParams<{ materiId: string }>();

  const [subMateriList, setSubMateriList] = useState<SubMateriItem[]>([
    { id: 1, no: 1, subMateri: 'Pengenalan Game Development' },
    { id: 2, no: 2, subMateri: 'Sejarah Game Development' },
    { id: 3, no: 3, subMateri: 'Genre Game' },
  ]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<SubMateriItem | null>(null);
  const [formData, setFormData] = useState('');

  const handleAddSubMateri = () => {
    setFormData('');
    setIsAddModalOpen(true);
  };

  const handleEditSubMateri = (item: SubMateriItem) => {
    setEditingItem(item);
    setFormData(item.subMateri);
    setIsEditModalOpen(true);
  };

  const handleDeleteSubMateri = (id: number) => {
    setSubMateriList(subMateriList.filter(item => item.id !== id));
  };

  const handleSubmitAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const newItem: SubMateriItem = {
      id: Math.max(...subMateriList.map(m => m.id)) + 1,
      no: subMateriList.length + 1,
      subMateri: formData
    };
    setSubMateriList([...subMateriList, newItem]);
    setIsAddModalOpen(false);
    setFormData('');
  };

  const handleSubmitEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      setSubMateriList(subMateriList.map(item =>
        item.id === editingItem.id
          ? { ...item, subMateri: formData }
          : item
      ));
    }
    setIsEditModalOpen(false);
    setEditingItem(null);
    setFormData('');
  };

  const handleBackToMateri = () => {
    navigate('/admin/managemateri');
  };

  // Definisi kolom untuk Table
  const columns = [
    {
      key: 'no',
      header: 'NO',
      render: (item: SubMateriItem) => (
        <span className="text-center block">{item.no}</span>
      )
    },
    {
      key: 'subMateri',
      header: 'Sub Materi'
    },
    {
      key: 'aksi',
      header: 'Aksi',
      render: (item: SubMateriItem) => (
        <div className="flex items-center justify-center space-x-2">
          <button
            onClick={() => handleEditSubMateri(item)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1"
          >
            <Edit size={14} />
            <span>Edit</span>
          </button>
          <button
            onClick={() => handleDeleteSubMateri(item.id)}
            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1"
          >
            <Trash2 size={14} />
            <span>Delete</span>
          </button>
        </div>
      )
    }
  ];

  return (
    <Layout>
      <div className="min-h-screen relative">
        {/* Cloud Background */}
        <CloudBackground 
          showCityBottom={true}
          showPlane={true}
          planeCount={3}
          planeSize="medium"
        />

        <div className="relative z-10 w-full px-4 md:px-6 py-4 md:py-8">
          {/* Container Utama dengan Ukuran yang Dapat Disesuaikan */}
          <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-6 md:p-8 border border-gray-200 max-w-6xl mx-auto mb-8">
            {/* Header dengan Icon dan Button Add */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <span className="text-3xl">📚</span>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                  Sub Materi
                </h1>
              </div>
              
              <div className="flex items-center space-x-3">
                <Button
                  onClick={handleBackToMateri}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-xl font-semibold shadow-md flex items-center space-x-2 transition-all duration-200"
                >
                  <ArrowLeft size={18} />
                  <span className="hidden md:inline">Kembali</span>
                </Button>
                
                <Button
                  onClick={handleAddSubMateri}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-semibold shadow-md flex items-center space-x-2 transition-all duration-200"
                >
                  <Plus size={18} />
                  <span>Add</span>
                </Button>
              </div>
            </div>

            {/* Table dengan Komponen Table.tsx */}
            <Table
              data={subMateriList}
              columns={columns}
              className="w-full"
              onRowClick={(item) => console.log('Row clicked:', item)}
            />
          </div>

          {/* Modal Add Sub Materi */}
          {isAddModalOpen && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl shadow-xl w-full max-w-md border border-gray-200">
                <div className="bg-gray-50 p-6 flex items-center justify-between rounded-t-2xl border-b border-gray-200">
                  <h2 className="text-gray-800 font-semibold text-xl">
                    Tambah Sub Materi
                  </h2>
                  <button
                    onClick={() => setIsAddModalOpen(false)}
                    className="text-gray-400 hover:text-gray-600 rounded-full p-1 transition-colors"
                  >
                    <Plus size={20} className="rotate-45" />
                  </button>
                </div>

                <form onSubmit={handleSubmitAdd} className="p-6 space-y-5 rounded-b-2xl">
                  <div>
                    <label htmlFor="submateri-add" className="block text-sm font-medium text-gray-700 mb-2">
                      Sub Materi
                    </label>
                    <input
                      type="text"
                      id="submateri-add"
                      value={formData}
                      onChange={(e) => setFormData(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="Masukkan sub materi"
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
                      Tambah
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Modal Edit Sub Materi */}
          {isEditModalOpen && editingItem && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl shadow-xl w-full max-w-md border border-gray-200">
                <div className="bg-gray-50 p-6 flex items-center justify-between rounded-t-2xl border-b border-gray-200">
                  <h2 className="text-gray-800 font-semibold text-xl">
                    Edit Sub Materi
                  </h2>
                  <button
                    onClick={() => setIsEditModalOpen(false)}
                    className="text-gray-400 hover:text-gray-600 rounded-full p-1 transition-colors"
                  >
                    <Plus size={20} className="rotate-45" />
                  </button>
                </div>

                <form onSubmit={handleSubmitEdit} className="p-6 space-y-5 rounded-b-2xl">
                  <div>
                    <label htmlFor="submateri-edit" className="block text-sm font-medium text-gray-700 mb-2">
                      Sub Materi
                    </label>
                    <input
                      type="text"
                      id="submateri-edit"
                      value={formData}
                      onChange={(e) => setFormData(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="Masukkan sub materi"
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
                      Simpan
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Submateri;