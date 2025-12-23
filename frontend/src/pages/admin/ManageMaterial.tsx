// src/pages/admin/ManageMaterial.tsx

import React, { useState, useMemo, useEffect } from 'react';
import { Plus, Edit, Trash2, X, Search, Loader, AlertCircle, FileText, FolderOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { materialService } from '../../services/api/materialService';
import type { MaterialItem, MaterialFormData } from '../../services/api/materialService';

const ManageMaterials = () => {
  const navigate = useNavigate();
  const [materialList, setMaterialList] = useState<MaterialItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<MaterialItem | null>(null);
  const [materialToDelete, setMaterialToDelete] = useState<MaterialItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedMaterial, setExpandedMaterial] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<MaterialFormData>({
    title: '',
    description: ''
  });

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await materialService.getAllMaterials();
      
      if (response.success && Array.isArray(response.data)) {
        setMaterialList(response.data);
      } else {
        setMaterialList([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredMaterials = useMemo(() => {
    return materialList.filter(material => {
      const matchesSearch = material.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           material.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [materialList, searchQuery]);

  const resetForm = () => {
    setFormData({ 
      title: '', 
      description: ''
    });
  };

  const handleAddMaterial = () => {
    resetForm();
    setIsAddModalOpen(true);
  };

  const handleEditMaterial = (material: MaterialItem) => {
    setEditingMaterial(material);
    setFormData({
      title: material.title,
      description: material.description
    });
    setIsEditModalOpen(true);
  };

  const handleDeleteMaterial = (material: MaterialItem) => {
    setMaterialToDelete(material);
    setIsDeleteModalOpen(true);
  };

  const validateForm = (): boolean => {
    if (!formData.title || !formData.description) {
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
      
      const response = await materialService.createMaterial(formData);

      if (response.success) {
        setIsAddModalOpen(false);
        resetForm();
        await new Promise(resolve => setTimeout(resolve, 500));
        await fetchMaterials();
      } else {
        setError(response.message || 'Gagal menambah materi');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
      console.error('Add error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitEdit = async () => {
    if (!validateForm() || !editingMaterial) return;

    try {
      setIsSubmitting(true);
      setError(null);

      const response = await materialService.updateMaterial(editingMaterial.id, formData);

      if (response.success) {
        setIsEditModalOpen(false);
        setEditingMaterial(null);
        resetForm();
        await new Promise(resolve => setTimeout(resolve, 500));
        await fetchMaterials();
      } else {
        setError(response.message || 'Gagal mengubah materi');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
      console.error('Edit error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!materialToDelete) return;

    try {
      setIsSubmitting(true);
      setError(null);

      const response = await materialService.deleteMaterial(materialToDelete.id);
      
      if (response.success) {
        setIsDeleteModalOpen(false);
        setMaterialToDelete(null);
        await new Promise(resolve => setTimeout(resolve, 500));
        await fetchMaterials();
      } else {
        setError(response.message || 'Gagal menghapus materi');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat menghapus');
      console.error('Delete error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 md:px-6 py-4 md:py-6 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Manajemen Materi</h1>
              <p className="text-gray-600 text-xs md:text-sm mt-1">Kelola data materi pembelajaran</p>
            </div>
            <button
              onClick={handleAddMaterial}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-3 md:px-6 py-2 md:py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors text-sm md:text-base whitespace-nowrap"
            >
              <Plus size={18} />
              <span className="hidden sm:inline">Tambah Materi</span>
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
                placeholder="Cari judul atau deskripsi materi..."
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
            <p className="text-gray-600 text-base md:text-lg">Memuat data materi...</p>
          </div>
        ) : filteredMaterials.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 py-8 md:py-12 text-center">
            <FileText size={48} className="mx-auto mb-3 text-gray-400" />
            <p className="text-gray-500 text-base md:text-lg">Tidak ada materi yang ditemukan</p>
          </div>
        ) : (
          <>
            {/* Desktop View - Table */}
            <div className="hidden lg:block bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-semibold text-gray-800">Judul</th>
                      <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-semibold text-gray-800">Deskripsi</th>
                      <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-semibold text-gray-800">Tanggal Dibuat</th>
                      <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-semibold text-gray-800">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredMaterials.map((material) => (
                      <tr key={material.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 md:px-6 py-3 md:py-4 text-xs md:text-sm font-medium text-gray-800">{material.title}</td>
                        <td className="px-4 md:px-6 py-3 md:py-4 text-xs md:text-sm text-gray-600">
                          <div className="max-w-xs truncate">{material.description}</div>
                        </td>
                        <td className="px-4 md:px-6 py-3 md:py-4 text-xs md:text-sm text-gray-600">{formatDate(material.createdAt)}</td>
                        <td className="px-4 md:px-6 py-3 md:py-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => navigate(`/admin/materials/${material.id}/sub-materials`)}
                              className="p-2 text-green-600 hover:bg-green-50 disabled:text-gray-400 rounded-lg transition-colors"
                              title="Sub Materi"
                            >
                              <FolderOpen size={18} />
                            </button>
                            <button
                              onClick={() => handleEditMaterial(material)}
                              disabled={isSubmitting}
                              className="p-2 text-blue-600 hover:bg-blue-50 disabled:text-gray-400 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={() => handleDeleteMaterial(material)}
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
              {filteredMaterials.map((material) => (
                <div key={material.id} className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                  <div 
                    onClick={() => setExpandedMaterial(expandedMaterial === material.id ? null : material.id)}
                    className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-800 text-sm md:text-base truncate">{material.title}</h3>
                        <p className="text-xs md:text-sm text-gray-600 line-clamp-2 mt-1">{material.description}</p>
                        <p className="text-xs text-gray-500 mt-2">Dibuat: {formatDate(material.createdAt)}</p>
                      </div>
                      <ChevronDown 
                        size={20} 
                        className={`text-gray-400 transition-transform ${expandedMaterial === material.id ? 'rotate-180' : ''}`}
                      />
                    </div>
                  </div>

                  {expandedMaterial === material.id && (
                    <div className="border-t border-gray-200 px-4 py-4 bg-gray-50 space-y-3">
                      <div>
                        <p className="text-xs text-gray-500 font-medium">Deskripsi Lengkap</p>
                        <p className="text-sm text-gray-800 mt-1">{material.description}</p>
                      </div>
                      <div className="flex gap-2 pt-3">
                        <button
                          onClick={() => {
                            navigate(`/admin/materials/${material.id}/sub-materials`);
                            setExpandedMaterial(null);
                          }}
                          className="flex-1 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium text-sm flex items-center justify-center gap-2"
                        >
                          <FolderOpen size={16} />
                          Sub Materi
                        </button>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            handleEditMaterial(material);
                            setExpandedMaterial(null);
                          }}
                          disabled={isSubmitting}
                          className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors font-medium text-sm flex items-center justify-center gap-2"
                        >
                          <Edit size={16} />
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            handleDeleteMaterial(material);
                            setExpandedMaterial(null);
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
          Menampilkan {filteredMaterials.length} dari {materialList.length} materi
        </div>
      </div>

      {/* Modal Tambah Materi */}
      {isAddModalOpen && (
        <ModalForm
          title="Tambah Materi Baru"
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleSubmitAdd}
          onClose={() => setIsAddModalOpen(false)}
          isSubmitting={isSubmitting}
          submitText="Tambah"
        />
      )}

      {/* Modal Edit Materi */}
      {isEditModalOpen && editingMaterial && (
        <ModalForm
          title="Edit Materi"
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleSubmitEdit}
          onClose={() => setIsEditModalOpen(false)}
          isSubmitting={isSubmitting}
          submitText="Simpan"
        />
      )}

      {/* Modal Konfirmasi Hapus */}
      {isDeleteModalOpen && materialToDelete && (
        <ModalDelete
          materialTitle={materialToDelete.title}
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
  formData: MaterialFormData;
  setFormData: React.Dispatch<React.SetStateAction<MaterialFormData>>;
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
          <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Judul Materi</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            placeholder="Masukkan judul materi"
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
            placeholder="Masukkan deskripsi materi"
            rows={4}
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
  materialTitle: string;
  onConfirm: () => void;
  onClose: () => void;
  isSubmitting: boolean;
}

const ModalDelete: React.FC<ModalDeleteProps> = ({ materialTitle, onConfirm, onClose, isSubmitting }) => (
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
          <h3 className="text-base md:text-lg font-medium text-gray-800 mb-2">Hapus Materi?</h3>
          <p className="text-gray-600 text-xs md:text-sm">
            Apakah Anda yakin ingin menghapus materi "<strong>{materialTitle}</strong>"? Tindakan ini tidak dapat dibatalkan.
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

export default ManageMaterials;