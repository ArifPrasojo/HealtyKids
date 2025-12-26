// src/pages/admin/ManageMaterial.tsx

import React, { useState, useMemo, useEffect } from 'react';
import { 
  Plus, Edit, Trash2, X, Search, Loader, AlertCircle, 
  FileText, FolderOpen, ChevronDown, ChevronUp, ArrowLeft 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { materialService } from '../../services/api/materialService';
import type { MaterialItem, MaterialFormData } from '../../services/api/materialService';
import CloudBackground from '../../components/layouts/CloudBackground'; // Import CloudBackground

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
        <div className="max-w-7xl mx-auto">
          
          {/* Header Container */}
          <div className="mb-8">
            
            {/* Tombol Kembali */}
            <button 
              onClick={() => navigate('/admin/dashboard')} 
              className="group flex items-center gap-2 text-gray-600 hover:text-blue-700 transition-colors mb-6 text-sm font-medium w-fit hover:bg-blue-50 px-3 py-2 rounded-lg"
            >
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
              Kembali
            </button>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Manajemen Materi</h1>
                <p className="text-gray-600 text-base">Kelola data materi utama pembelajaran dengan mudah dan efisien</p>
              </div>
              <button
                onClick={handleAddMaterial}
                disabled={loading}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-blue-400 disabled:to-blue-500 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-3 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Plus size={22} />
                <span>Tambah Materi</span>
              </button>
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-8 p-5 bg-red-50 border-l-4 border-red-500 rounded-xl flex items-start gap-4 animate-fade-in shadow-sm">
              <AlertCircle size={24} className="text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-red-900 text-base font-semibold">Terjadi Kesalahan</h3>
                <p className="text-red-800 text-sm mt-1">{error}</p>
              </div>
              <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100 transition-colors">
                <X size={20} />
              </button>
            </div>
          )}

          {/* Search & Content Container */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden">
            
            {/* Search Bar */}
            <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
              <div className="relative max-w-lg">
                <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Cari judul atau deskripsi materi..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-transparent outline-none transition-all text-base shadow-sm"
                />
              </div>
            </div>

            {/* Loading State */}
            {loading ? (
              <div className="py-24 text-center">
                <Loader size={48} className="mx-auto text-blue-600 animate-spin mb-6" />
                <p className="text-gray-600 font-medium text-lg">Memuat data materi...</p>
              </div>
            ) : filteredMaterials.length === 0 ? (
              // Empty State
              <div className="py-24 text-center bg-gray-50/50">
                <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FileText size={40} className="text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Data Tidak Ditemukan</h3>
                <p className="text-gray-600 text-base max-w-md mx-auto">
                  {searchQuery ? `Tidak ada hasil untuk "${searchQuery}"` : "Belum ada materi yang ditambahkan. Mulai dengan menambahkan materi baru."}
                </p>
              </div>
            ) : (
              <>
                {/* Desktop Table View */}
                <div className="hidden lg:block overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gradient-to-r from-gray-100 to-gray-50 border-b border-gray-200 text-sm font-semibold text-gray-600 uppercase tracking-wider">
                        <th className="px-8 py-5 w-1/4">Judul</th>
                        <th className="px-8 py-5 w-1/3">Deskripsi</th>
                        <th className="px-8 py-5">Tanggal Dibuat</th>
                        <th className="px-8 py-5 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredMaterials.map((material) => (
                        <tr key={material.id} className="hover:bg-blue-50/50 transition-colors group">
                          <td className="px-8 py-5">
                             <div className="font-semibold text-gray-900 text-base">{material.title}</div>
                          </td>
                          <td className="px-8 py-5">
                            <p className="text-sm text-gray-700 line-clamp-2 leading-relaxed">
                              {material.description}
                            </p>
                          </td>
                          <td className="px-8 py-5">
                            <span className="text-sm text-gray-600 whitespace-nowrap bg-gray-100 px-3 py-1 rounded-lg text-xs font-medium">
                               {formatDate(material.createdAt)}
                            </span>
                          </td>
                          <td className="px-8 py-5 text-right">
                            <div className="flex items-center justify-end gap-3 opacity-100">
                              {/* Tombol Sub Materi */}
                              <button
                                onClick={() => navigate(`/admin/materials/${material.id}/sub-materials`)}
                                className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg text-sm font-medium transition-colors border border-indigo-200 shadow-sm"
                                title="Kelola Sub Materi"
                              >
                                <FolderOpen size={16} />
                                Sub Materi
                              </button>
                              
                              <div className="w-px h-5 bg-gray-300 mx-2"></div>

                              <button
                                onClick={() => handleEditMaterial(material)}
                                className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Edit"
                              >
                                <Edit size={18} />
                              </button>
                              <button
                                onClick={() => handleDeleteMaterial(material)}
                                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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

                {/* Mobile Card View */}
                <div className="lg:hidden bg-gray-50/50 p-6 space-y-6">
                  {filteredMaterials.map((material) => (
                    <div key={material.id} className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
                      <div 
                        onClick={() => setExpandedMaterial(expandedMaterial === material.id ? null : material.id)}
                        className="p-6 cursor-pointer active:bg-gray-50 transition-colors"
                      >
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex-1">
                            <h3 className="font-bold text-gray-900 text-lg">{material.title}</h3>
                            <p className="text-sm text-gray-500 mt-2 flex items-center gap-2">
                              {formatDate(material.createdAt)}
                            </p>
                          </div>
                          {expandedMaterial === material.id ? 
                            <ChevronUp size={24} className="text-gray-400" /> : 
                            <ChevronDown size={24} className="text-gray-400" />
                          }
                        </div>
                        {/* Preview Deskripsi Singkat jika collapsed */}
                        {expandedMaterial !== material.id && (
                          <p className="text-base text-gray-700 mt-4 line-clamp-2">
                              {material.description}
                          </p>
                        )}
                      </div>

                      {/* Expanded Content */}
                      {expandedMaterial === material.id && (
                        <div className="px-6 pb-6 pt-0 animate-fade-in">
                          <div className="pt-4 border-t border-gray-100">
                             <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Deskripsi Lengkap</p>
                             <p className="text-base text-gray-800 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100">
                               {material.description}
                             </p>
                          </div>
                          
                          <div className="flex flex-col gap-3 mt-6">
                             <button
                               onClick={(e) => {
                                 e.stopPropagation();
                                 navigate(`/admin/materials/${material.id}/sub-materials`);
                               }}
                               className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-xl text-base font-medium transition-colors border border-indigo-200 shadow-sm"
                             >
                               <FolderOpen size={18} /> Kelola Sub Materi
                             </button>
                             
                             <div className="flex gap-3">
                                <button
                                  onClick={(e) => { e.stopPropagation(); handleEditMaterial(material); }}
                                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl text-base font-medium shadow-sm"
                                >
                                  <Edit size={18} /> Edit
                                </button>
                                <button
                                  onClick={(e) => { e.stopPropagation(); handleDeleteMaterial(material); }}
                                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white border border-red-300 text-red-600 hover:bg-red-50 rounded-xl text-base font-medium shadow-sm"
                                >
                                  <Trash2 size={18} /> Hapus
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
    </div>
  );
};

// --- COMPONENTS ---

const ModalForm: React.FC<any> = ({ title, formData, setFormData, onSubmit, onClose, isSubmitting, submitText }) => (
  <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-gray-200 overflow-hidden transform transition-all scale-100">
      <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-gray-50 to-white">
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        <button onClick={onClose} disabled={isSubmitting} className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-full hover:bg-gray-200">
          <X size={24} />
        </button>
      </div>

      <div className="p-8 space-y-6">
        <div>
          <label className="block text-base font-semibold text-gray-800 mb-3">Judul Materi</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-base shadow-sm"
            placeholder="Contoh: Matematika Dasar - Bab 1"
            disabled={isSubmitting}
            autoFocus
          />
        </div>

        <div>
          <label className="block text-base font-semibold text-gray-800 mb-3">Deskripsi</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-base min-h-[140px] resize-y shadow-sm"
            placeholder="Jelaskan secara singkat isi materi ini..."
            disabled={isSubmitting}
          />
        </div>
      </div>

      <div className="p-6 border-t border-gray-100 bg-gray-50 flex gap-4 justify-end">
        <button
          onClick={onClose}
          disabled={isSubmitting}
          className="px-6 py-3 text-base font-medium text-gray-600 hover:bg-gray-200 rounded-xl transition-colors"
        >
          Batal
        </button>
        <button
          onClick={onSubmit}
          disabled={isSubmitting}
          className="px-6 py-3 text-base font-medium bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-blue-400 disabled:to-blue-500 text-white rounded-xl transition-all shadow-lg flex items-center gap-2"
        >
          {isSubmitting && <Loader size={18} className="animate-spin" />}
          {submitText}
        </button>
      </div>
    </div>
  </div>
);

const ModalDelete: React.FC<any> = ({ materialTitle, onConfirm, onClose, isSubmitting }) => (
  <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-gray-200 overflow-hidden text-center p-8">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 text-red-600">
        <Trash2 size={32} />
      </div>
      
      <h3 className="text-2xl font-bold text-gray-900 mb-3">Hapus Materi?</h3>
      <p className="text-gray-600 text-base mb-8 leading-relaxed">
        Anda yakin ingin menghapus <strong>"{materialTitle}"</strong>? <br/>
        Data yang dihapus beserta sub-materinya tidak dapat dikembalikan.
      </p>

      <div className="flex gap-4">
        <button
          onClick={onClose}
          disabled={isSubmitting}
          className="flex-1 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 font-medium text-base transition-colors shadow-sm"
        >
          Batal
        </button>
        <button
          onClick={onConfirm}
          disabled={isSubmitting}
          className="flex-1 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-xl font-medium text-base transition-colors flex items-center justify-center gap-2 shadow-lg"
        >
          {isSubmitting && <Loader size={18} className="animate-spin" />}
          Hapus
        </button>
      </div>
    </div>
  </div>
);

export default ManageMaterials;