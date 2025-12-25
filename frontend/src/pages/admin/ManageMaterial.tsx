// src/pages/admin/ManageMaterial.tsx

import React, { useState, useMemo, useEffect } from 'react';
import { 
  Plus, Edit, Trash2, X, Search, Loader, AlertCircle, 
  FileText, FolderOpen, ChevronDown, ChevronUp, ArrowLeft 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { materialService } from '../../services/api/materialService';
import type { MaterialItem, MaterialFormData } from '../../services/api/materialService';

const ManageMaterials = () => {
  const navigate = useNavigate();
  
  // --- STATE ---
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

  // --- LOGIC ---
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
    setFormData({ title: '', description: '' });
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
        fetchMaterials();
      } else {
        setError(response.message || 'Gagal menambah materi');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
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
        fetchMaterials();
      } else {
        setError(response.message || 'Gagal mengubah materi');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
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
        fetchMaterials();
      } else {
        setError(response.message || 'Gagal menghapus materi');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat menghapus');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', { 
      year: 'numeric', month: 'long', day: 'numeric' 
    });
  };

  // --- RENDER ---
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      
      {/* Header Container */}
      <div className="max-w-6xl mx-auto mb-6">
        
        {/* --- TOMBOL KEMBALI (BARU) --- */}
        <button 
          onClick={() => navigate('/admin/dashboard')} 
          className="group flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors mb-4 text-sm font-medium w-fit"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Kembali
        </button>
        {/* ----------------------------- */}

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Manajemen Materi</h1>
            <p className="text-gray-500 text-sm mt-1">Kelola data materi utama pembelajaran</p>
          </div>
          <button
            onClick={handleAddMaterial}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-all shadow-sm"
          >
            <Plus size={20} />
            <span>Tambah Materi</span>
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 animate-fade-in">
            <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-red-800 text-sm font-semibold">Terjadi Kesalahan</h3>
              <p className="text-red-700 text-sm mt-0.5">{error}</p>
            </div>
            <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700">
              <X size={18} />
            </button>
          </div>
        )}

        {/* Search & Content Container */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          
          {/* Search Bar */}
          <div className="p-4 border-b border-gray-100 bg-white">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Cari judul atau deskripsi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-transparent outline-none transition-all text-sm"
              />
            </div>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="py-20 text-center">
              <Loader size={40} className="mx-auto text-blue-600 animate-spin mb-4" />
              <p className="text-gray-500 font-medium">Memuat data materi...</p>
            </div>
          ) : filteredMaterials.length === 0 ? (
            // Empty State
            <div className="py-20 text-center bg-gray-50/50">
              <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText size={32} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">Data Tidak Ditemukan</h3>
              <p className="text-gray-500 text-sm mt-1 max-w-xs mx-auto">
                {searchQuery ? `Tidak ada hasil untuk "${searchQuery}"` : "Belum ada materi yang ditambahkan."}
              </p>
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50/80 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      <th className="px-6 py-4 w-1/4">Judul</th>
                      <th className="px-6 py-4 w-1/3">Deskripsi</th>
                      <th className="px-6 py-4">Tanggal Dibuat</th>
                      <th className="px-6 py-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredMaterials.map((material) => (
                      <tr key={material.id} className="hover:bg-blue-50/30 transition-colors group">
                        <td className="px-6 py-4">
                           <div className="font-medium text-gray-900">{material.title}</div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                            {material.description}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-500 whitespace-nowrap bg-gray-100 px-2 py-1 rounded text-xs">
                             {formatDate(material.createdAt)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-100">
                            {/* Tombol Sub Materi (Distinct) */}
                            <button
                              onClick={() => navigate(`/admin/materials/${material.id}/sub-materials`)}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-md text-xs font-medium transition-colors border border-indigo-100"
                              title="Kelola Sub Materi"
                            >
                              <FolderOpen size={14} />
                              Sub Materi
                            </button>
                            
                            <div className="w-px h-4 bg-gray-300 mx-1"></div>

                            <button
                              onClick={() => handleEditMaterial(material)}
                              className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                              title="Edit"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteMaterial(material)}
                              className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                              title="Hapus"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="lg:hidden bg-gray-50 p-4 space-y-4">
                {filteredMaterials.map((material) => (
                  <div key={material.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div 
                      onClick={() => setExpandedMaterial(expandedMaterial === material.id ? null : material.id)}
                      className="p-4 cursor-pointer active:bg-gray-50 transition-colors"
                    >
                      <div className="flex justify-between items-start gap-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800 text-base">{material.title}</h3>
                          <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                            {formatDate(material.createdAt)}
                          </p>
                        </div>
                        {expandedMaterial === material.id ? 
                          <ChevronUp size={20} className="text-gray-400" /> : 
                          <ChevronDown size={20} className="text-gray-400" />
                        }
                      </div>
                      {/* Preview Deskripsi Singkat jika collapsed */}
                      {expandedMaterial !== material.id && (
                        <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                            {material.description}
                        </p>
                      )}
                    </div>

                    {/* Expanded Content */}
                    {expandedMaterial === material.id && (
                      <div className="px-4 pb-4 pt-0 animate-fade-in">
                        <div className="pt-3 border-t border-gray-100">
                           <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Deskripsi Lengkap</p>
                           <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 p-3 rounded-lg border border-gray-100">
                             {material.description}
                           </p>
                        </div>
                        
                        <div className="flex flex-col gap-2 mt-4">
                           <button
                             onClick={(e) => {
                               e.stopPropagation();
                               navigate(`/admin/materials/${material.id}/sub-materials`);
                             }}
                             className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg text-sm font-medium transition-colors border border-indigo-100"
                           >
                             <FolderOpen size={16} /> Kelola Sub Materi
                           </button>
                           
                           <div className="flex gap-2">
                              <button
                                onClick={(e) => { e.stopPropagation(); handleEditMaterial(material); }}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-lg text-sm font-medium"
                              >
                                <Edit size={16} /> Edit
                              </button>
                              <button
                                onClick={(e) => { e.stopPropagation(); handleDeleteMaterial(material); }}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-white border border-red-200 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium"
                              >
                                <Trash2 size={16} /> Hapus
                              </button>
                           </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* --- MODALS --- */}
      
      {/* Modal Tambah/Edit */}
      {(isAddModalOpen || isEditModalOpen) && (
        <ModalForm
          title={isAddModalOpen ? "Tambah Materi Baru" : "Edit Materi"}
          formData={formData}
          setFormData={setFormData}
          onSubmit={isAddModalOpen ? handleSubmitAdd : handleSubmitEdit}
          onClose={() => {
            setIsAddModalOpen(false);
            setIsEditModalOpen(false);
          }}
          isSubmitting={isSubmitting}
          submitText={isAddModalOpen ? "Simpan Materi" : "Simpan Perubahan"}
        />
      )}

      {/* Modal Delete */}
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

// --- COMPONENTS ---

const ModalForm: React.FC<any> = ({ title, formData, setFormData, onSubmit, onClose, isSubmitting, submitText }) => (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
    <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg border border-gray-200 overflow-hidden transform transition-all scale-100">
      <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
        <h2 className="text-lg font-bold text-gray-800">{title}</h2>
        <button onClick={onClose} disabled={isSubmitting} className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-200">
          <X size={20} />
        </button>
      </div>

      <div className="p-6 space-y-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Judul Materi</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm"
            placeholder="Contoh: Matematika Dasar - Bab 1"
            disabled={isSubmitting}
            autoFocus
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Deskripsi</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm min-h-[120px] resize-y"
            placeholder="Jelaskan secara singkat isi materi ini..."
            disabled={isSubmitting}
          />
        </div>
      </div>

      <div className="p-4 border-t border-gray-100 bg-gray-50 flex gap-3 justify-end">
        <button
          onClick={onClose}
          disabled={isSubmitting}
          className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
        >
          Batal
        </button>
        <button
          onClick={onSubmit}
          disabled={isSubmitting}
          className="px-5 py-2.5 text-sm font-medium bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-all shadow-sm flex items-center gap-2"
        >
          {isSubmitting && <Loader size={16} className="animate-spin" />}
          {submitText}
        </button>
      </div>
    </div>
  </div>
);

const ModalDelete: React.FC<any> = ({ materialTitle, onConfirm, onClose, isSubmitting }) => (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm border border-gray-200 overflow-hidden text-center p-6">
      <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600">
        <Trash2 size={28} />
      </div>
      
      <h3 className="text-xl font-bold text-gray-900 mb-2">Hapus Materi?</h3>
      <p className="text-gray-500 text-sm mb-6 leading-relaxed">
        Anda yakin ingin menghapus <strong>"{materialTitle}"</strong>? <br/>
        Data yang dihapus beserta sub-materinya tidak dapat dikembalikan.
      </p>

      <div className="flex gap-3">
        <button
          onClick={onClose}
          disabled={isSubmitting}
          className="flex-1 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium text-sm transition-colors"
        >
          Batal
        </button>
        <button
          onClick={onConfirm}
          disabled={isSubmitting}
          className="flex-1 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium text-sm transition-colors flex items-center justify-center gap-2 shadow-sm"
        >
          {isSubmitting && <Loader size={16} className="animate-spin" />}
          Hapus
        </button>
      </div>
    </div>
  </div>
);

export default ManageMaterials;