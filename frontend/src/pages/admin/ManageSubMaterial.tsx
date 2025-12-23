// src/pages/admin/ManageSubMaterial.tsx

import React, { useState, useMemo, useEffect } from 'react';
import { Plus, Edit, Trash2, X, Search, Loader, AlertCircle, FileText, Video, ArrowLeft } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { subMaterialService } from '../../services/api/subMaterialService';
import { materialService } from '../../services/api/materialService';
import type { SubMaterialItem, SubMaterialFormData } from '../../services/api/subMaterialService';
import type { MaterialItem } from '../../services/api/materialService';

const ManageSubMaterials = () => {
  const { materialId } = useParams<{ materialId: string }>();
  const navigate = useNavigate();
  
  const [subMaterialList, setSubMaterialList] = useState<SubMaterialItem[]>([]);
  const [materialInfo, setMaterialInfo] = useState<MaterialItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingSubMaterial, setEditingSubMaterial] = useState<SubMaterialItem | null>(null);
  const [subMaterialToDelete, setSubMaterialToDelete] = useState<SubMaterialItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSubMaterial, setExpandedSubMaterial] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<SubMaterialFormData>({
    title: '',
    videoUrl: '',
    content: ''
  });

  useEffect(() => {
    if (materialId) {
      fetchMaterialInfo();
      fetchSubMaterials();
    }
  }, [materialId]);

  const fetchMaterialInfo = async () => {
    try {
      const response = await materialService.getMaterialById(Number(materialId));
      if (response.success && response.data) {
        setMaterialInfo(response.data);
      }
    } catch (err) {
      console.error('Failed to fetch material info:', err);
    }
  };

  const fetchSubMaterials = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await subMaterialService.getAllSubMaterials(Number(materialId));
      
      if (response.success && Array.isArray(response.data)) {
        setSubMaterialList(response.data);
      } else {
        setSubMaterialList([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredSubMaterials = useMemo(() => {
    return subMaterialList.filter(subMaterial => {
      const matchesSearch = subMaterial.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           subMaterial.content.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [subMaterialList, searchQuery]);

  const resetForm = () => {
    setFormData({ 
      title: '', 
      videoUrl: '',
      content: ''
    });
  };

  const handleAddSubMaterial = () => {
    resetForm();
    setIsAddModalOpen(true);
  };

  const handleEditSubMaterial = (subMaterial: SubMaterialItem) => {
    setEditingSubMaterial(subMaterial);
    setFormData({
      title: subMaterial.title,
      videoUrl: subMaterial.videoUrl,
      content: subMaterial.content
    });
    setIsEditModalOpen(true);
  };

  const handleDeleteSubMaterial = (subMaterial: SubMaterialItem) => {
    setSubMaterialToDelete(subMaterial);
    setIsDeleteModalOpen(true);
  };

  const validateForm = (): boolean => {
    if (!formData.title || !formData.videoUrl || !formData.content) {
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
      
      const response = await subMaterialService.createSubMaterial(Number(materialId), formData);

      if (response.success) {
        setIsAddModalOpen(false);
        resetForm();
        await new Promise(resolve => setTimeout(resolve, 500));
        await fetchSubMaterials();
      } else {
        setError(response.message || 'Gagal menambah sub materi');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
      console.error('Add error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitEdit = async () => {
    if (!validateForm() || !editingSubMaterial) return;

    try {
      setIsSubmitting(true);
      setError(null);

      const response = await subMaterialService.updateSubMaterial(
        Number(materialId), 
        editingSubMaterial.id, 
        formData
      );

      if (response.success) {
        setIsEditModalOpen(false);
        setEditingSubMaterial(null);
        resetForm();
        await new Promise(resolve => setTimeout(resolve, 500));
        await fetchSubMaterials();
      } else {
        setError(response.message || 'Gagal mengubah sub materi');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
      console.error('Edit error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!subMaterialToDelete) return;

    try {
      setIsSubmitting(true);
      setError(null);

      const response = await subMaterialService.deleteSubMaterial(
        Number(materialId), 
        subMaterialToDelete.id
      );
      
      if (response.success) {
        setIsDeleteModalOpen(false);
        setSubMaterialToDelete(null);
        await new Promise(resolve => setTimeout(resolve, 500));
        await fetchSubMaterials();
      } else {
        setError(response.message || 'Gagal menghapus sub materi');
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
          {/* Breadcrumb */}
          <button
            onClick={() => navigate('/admin/materials')}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-3 text-sm font-medium"
          >
            <ArrowLeft size={16} />
            Kembali ke Materi
          </button>

          <div className="flex items-center justify-between mb-4 md:mb-6">
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Sub Materi</h1>
              <p className="text-gray-600 text-xs md:text-sm mt-1">
                {materialInfo ? `Materi: ${materialInfo.title}` : 'Kelola sub materi pembelajaran'}
              </p>
            </div>
            <button
              onClick={handleAddSubMaterial}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-3 md:px-6 py-2 md:py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors text-sm md:text-base whitespace-nowrap"
            >
              <Plus size={18} />
              <span className="hidden sm:inline">Tambah Sub Materi</span>
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
                placeholder="Cari judul atau konten sub materi..."
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
            <p className="text-gray-600 text-base md:text-lg">Memuat data sub materi...</p>
          </div>
        ) : filteredSubMaterials.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 py-8 md:py-12 text-center">
            <FileText size={48} className="mx-auto mb-3 text-gray-400" />
            <p className="text-gray-500 text-base md:text-lg">Tidak ada sub materi yang ditemukan</p>
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
                      <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-semibold text-gray-800">Video URL</th>
                      <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-semibold text-gray-800">Konten</th>
                      <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-semibold text-gray-800">Tanggal Dibuat</th>
                      <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-semibold text-gray-800">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredSubMaterials.map((subMaterial) => (
                      <tr key={subMaterial.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 md:px-6 py-3 md:py-4 text-xs md:text-sm font-medium text-gray-800">{subMaterial.title}</td>
                        <td className="px-4 md:px-6 py-3 md:py-4 text-xs md:text-sm text-blue-600">
                          <a href={subMaterial.videoUrl} target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-1">
                            <Video size={14} />
                            <span className="max-w-xs truncate">Link Video</span>
                          </a>
                        </td>
                        <td className="px-4 md:px-6 py-3 md:py-4 text-xs md:text-sm text-gray-600">
                          <div className="max-w-xs truncate">{subMaterial.content}</div>
                        </td>
                        <td className="px-4 md:px-6 py-3 md:py-4 text-xs md:text-sm text-gray-600">{formatDate(subMaterial.createdAt)}</td>
                        <td className="px-4 md:px-6 py-3 md:py-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditSubMaterial(subMaterial)}
                              disabled={isSubmitting}
                              className="p-2 text-blue-600 hover:bg-blue-50 disabled:text-gray-400 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={() => handleDeleteSubMaterial(subMaterial)}
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
              {filteredSubMaterials.map((subMaterial) => (
                <div key={subMaterial.id} className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                  <div 
                    onClick={() => setExpandedSubMaterial(expandedSubMaterial === subMaterial.id ? null : subMaterial.id)}
                    className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-800 text-sm md:text-base truncate">{subMaterial.title}</h3>
                        <p className="text-xs md:text-sm text-gray-600 line-clamp-2 mt-1">{subMaterial.content}</p>
                        <p className="text-xs text-gray-500 mt-2">Dibuat: {formatDate(subMaterial.createdAt)}</p>
                      </div>
                      <ChevronDown 
                        size={20} 
                        className={`text-gray-400 transition-transform ${expandedSubMaterial === subMaterial.id ? 'rotate-180' : ''}`}
                      />
                    </div>
                  </div>

                  {expandedSubMaterial === subMaterial.id && (
                    <div className="border-t border-gray-200 px-4 py-4 bg-gray-50 space-y-3">
                      <div>
                        <p className="text-xs text-gray-500 font-medium">Video URL</p>
                        <a href={subMaterial.videoUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline break-all">
                          {subMaterial.videoUrl}
                        </a>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium">Konten Lengkap</p>
                        <p className="text-sm text-gray-800 mt-1">{subMaterial.content}</p>
                      </div>
                      <div className="flex gap-2 pt-3">
                        <button
                          onClick={() => {
                            handleEditSubMaterial(subMaterial);
                            setExpandedSubMaterial(null);
                          }}
                          disabled={isSubmitting}
                          className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors font-medium text-sm flex items-center justify-center gap-2"
                        >
                          <Edit size={16} />
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            handleDeleteSubMaterial(subMaterial);
                            setExpandedSubMaterial(null);
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
          Menampilkan {filteredSubMaterials.length} dari {subMaterialList.length} sub materi
        </div>
      </div>

      {/* Modal Tambah Sub Materi */}
      {isAddModalOpen && (
        <ModalForm
          title="Tambah Sub Materi Baru"
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleSubmitAdd}
          onClose={() => setIsAddModalOpen(false)}
          isSubmitting={isSubmitting}
          submitText="Tambah"
        />
      )}

      {/* Modal Edit Sub Materi */}
      {isEditModalOpen && editingSubMaterial && (
        <ModalForm
          title="Edit Sub Materi"
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleSubmitEdit}
          onClose={() => setIsEditModalOpen(false)}
          isSubmitting={isSubmitting}
          submitText="Simpan"
        />
      )}

      {/* Modal Konfirmasi Hapus */}
      {isDeleteModalOpen && subMaterialToDelete && (
        <ModalDelete
          subMaterialTitle={subMaterialToDelete.title}
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
  formData: SubMaterialFormData;
  setFormData: React.Dispatch<React.SetStateAction<SubMaterialFormData>>;
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
          <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Judul Sub Materi</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            placeholder="Masukkan judul sub materi"
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Video URL</label>
          <input
            type="url"
            value={formData.videoUrl}
            onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
            className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            placeholder="https://youtube.com/..."
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Konten</label>
          <textarea
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
            placeholder="Masukkan konten sub materi"
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
  subMaterialTitle: string;
  onConfirm: () => void;
  onClose: () => void;
  isSubmitting: boolean;
}

const ModalDelete: React.FC<ModalDeleteProps> = ({ subMaterialTitle, onConfirm, onClose, isSubmitting }) => (
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
          <h3 className="text-base md:text-lg font-medium text-gray-800 mb-2">Hapus Sub Materi?</h3>
          <p className="text-gray-600 text-xs md:text-sm">
            Apakah Anda yakin ingin menghapus sub materi "<strong>{subMaterialTitle}</strong>"? Tindakan ini tidak dapat dibatalkan.
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

export default ManageSubMaterials;