import React, { useState, useEffect } from 'react';
import { 
  Plus, Edit, Trash2, X, Search, Loader, 
  Video, Image as ImageIcon, ArrowLeft, UploadCloud,
  CheckCircle, AlertCircle, ExternalLink 
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';

// --- IMPORT REACT QUILL ---
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

import { subMaterialService } from '../../services/api/subMaterialService';
import type { SubMaterialItem, SubMaterialFormData } from '../../services/api/subMaterialService';
import CloudBackground from '../../components/layouts/CloudBackground';

const BACKEND_URL = import.meta.env?.VITE_API_URL || 'http://localhost:3000';

// --- KONFIGURASI TOOLBAR EDITOR ---
const quillModules = {
  toolbar: [
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    [{ 'font': [] }],
    [{ 'size': ['small', false, 'large', 'huge'] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'script': 'sub'}, { 'script': 'super' }],
    [{ 'color': [] }, { 'background': [] }],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'indent': '-1'}, { 'indent': '+1' }],
    [{ 'align': [] }],
    ['blockquote', 'code-block'],
    ['link', 'image'],
    ['clean']
  ],
};

const ManageSubMaterial = () => {
  const { materialId } = useParams<{ materialId: string }>();
  const navigate = useNavigate();

  // --- States ---
  const [dataList, setDataList] = useState<SubMaterialItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); 
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Selection State
  const [editingItem, setEditingItem] = useState<SubMaterialItem | null>(null);
  const [deleteItem, setDeleteItem] = useState<SubMaterialItem | null>(null);

  // Form State
  const [formData, setFormData] = useState<SubMaterialFormData>({
    title: '',
    contentCategory: 'video',
    contentUrl: '',
    content: ''
  });

  // --- Effects ---
  useEffect(() => {
    if (materialId) fetchData();
  }, [materialId]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // --- Functions ---
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null); 
      const res = await subMaterialService.getAllSubMaterials(Number(materialId));
      if (res.success && res.data) {
        setDataList(res.data);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const stripHtml = (html: string) => {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  const getFullImageUrl = (path: string) => {
    if (!path) return 'https://placehold.co/150?text=No+Image'; 
    if (path.startsWith('http') || path.startsWith('data:')) return path;
    
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    const baseUrl = BACKEND_URL.endsWith('/') ? BACKEND_URL.slice(0, -1) : BACKEND_URL;
    
    return `${baseUrl}${cleanPath}`;
  };

  const handleReset = () => {
    setFormData({ title: '', contentCategory: 'video', contentUrl: '', content: '' });
    setEditingItem(null);
    setIsFormOpen(false);
    setActionError(null);
  };

  const handleEdit = (item: SubMaterialItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      contentCategory: item.contentCategory,
      contentUrl: item.contentUrl, 
      content: item.content 
    });
    setSuccessMessage(null);
    setActionError(null);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (item: SubMaterialItem) => {
    setDeleteItem(item);
    setSuccessMessage(null);
    setActionError(null);
    setIsDeleteOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
          setActionError("Ukuran file terlalu besar (Max 2MB)");
          return;
      }
      setActionError(null);

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, contentUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

const handleSubmit = async () => {
    if (!formData.title) {
        setActionError("Judul wajib diisi");
        return;
    }
    
    // Validasi URL/Foto hanya jika BUKAN mode edit atau jika user mengganti foto
    // Jika edit mode dan fotonya masih sama dengan yang lama, kita skip validasi ini
    const isEditingPhoto = editingItem && formData.contentCategory === 'photo';
    const isPhotoUnchanged = isEditingPhoto && formData.contentUrl === editingItem?.contentUrl;

    if (!formData.contentUrl && !isPhotoUnchanged) {
        setActionError("Video URL atau Foto wajib diisi");
        return;
    }

    try {
      setIsSubmitting(true);
      setActionError(null);

      // --- PERBAIKAN LOGIKA PAYLOAD ---
      // Siapkan payload dasar
      const payload: Partial<SubMaterialFormData> = {
        title: formData.title,
        contentCategory: formData.contentCategory,
        content: formData.content
      };

      if (editingItem) {
        // === MODE UPDATE ===
        
        // Logika: Hanya kirim contentUrl jika:
        // 1. Kategori adalah 'video' (karena video berupa text url biasa)
        // 2. ATAU Kategori 'photo' TAPI url-nya berbeda dengan data lama (artinya user upload baru)
        
        if (formData.contentCategory === 'video') {
            payload.contentUrl = formData.contentUrl;
        } else {
            // Kategori Photo
            if (formData.contentUrl !== editingItem.contentUrl) {
                // User upload foto baru (Base64 string berbeda dengan path lama)
                payload.contentUrl = formData.contentUrl;
            } else {
                // User TIDAK ganti foto, JANGAN kirim property contentUrl
                // Biarkan payload.contentUrl undefined agar tidak terkirim ke JSON
            }
        }

        await subMaterialService.updateSubMaterial(Number(materialId), editingItem.id, payload);
        setSuccessMessage("Sub materi berhasil diperbarui!");
      } else {
        // === MODE CREATE ===
        // Selalu kirim full data termasuk contentUrl
        await subMaterialService.createSubMaterial(Number(materialId), formData);
        setSuccessMessage("Sub materi baru berhasil ditambahkan!");
      }
      
      handleReset();
      fetchData();
    } catch (err: any) {
      console.error("Submit Error:", err);
      setActionError(err.message || "Terjadi kesalahan saat menyimpan data.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteItem) return;
    try {
      setIsSubmitting(true);
      setActionError(null);
      await subMaterialService.deleteSubMaterial(Number(materialId), deleteItem.id);
      setSuccessMessage("Sub materi berhasil dihapus.");
      setIsDeleteOpen(false);
      setDeleteItem(null);
      fetchData();
    } catch (err: any) {
      setActionError(err.message || "Gagal menghapus data.");
      setIsDeleteOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredList = dataList.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 overflow-hidden">
      <CloudBackground 
        cloudImage="./src/assets/images/awanhijau.png"
        showCityBottom={true}
        showPlane={true}
        planeSize="medium"
        planeCount={2}
      />
      
      <div className="relative z-10 min-h-screen p-4 md:p-6">
        <div className="max-w-6xl mx-auto">
          <button onClick={() => navigate('/admin/managemateri')} className="group flex items-center gap-2 text-gray-600 hover:text-blue-700 transition-colors mb-6 text-sm font-medium w-fit hover:bg-blue-50 px-3 py-2 rounded-lg">
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            Kembali
          </button>

          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Sub Materi</h1>
              <p className="text-gray-500 text-sm">Kelola video dan foto untuk materi ini</p>
            </div>
            <button 
              onClick={() => { handleReset(); setSuccessMessage(null); setActionError(null); setIsFormOpen(true); }}
              className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-3 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Plus size={22} />
              Tambah
            </button>
          </div>

          {/* --- ALERT NOTIFICATIONS --- */}
          <div className="space-y-4 mb-6">
            {successMessage && (
              <div className="p-4 bg-green-50 border-l-4 border-green-500 rounded-xl flex items-start gap-3 shadow-sm animate-fade-in">
                <CheckCircle size={24} className="text-green-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="text-green-900 font-semibold text-sm">Berhasil!</h3>
                  <p className="text-green-800 text-sm mt-1">{successMessage}</p>
                </div>
                <button onClick={() => setSuccessMessage(null)} className="text-green-500 hover:text-green-700 p-1 rounded-full hover:bg-green-100 transition-colors">
                  <X size={18} />
                </button>
              </div>
            )}
            
            {actionError && !isFormOpen && (
              <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-xl flex items-start gap-3 shadow-sm animate-fade-in">
                <AlertCircle size={24} className="text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="text-red-900 font-semibold text-sm">Gagal!</h3>
                  <p className="text-red-800 text-sm mt-1">{actionError}</p>
                </div>
                <button onClick={() => setActionError(null)} className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100 transition-colors">
                  <X size={18} />
                </button>
              </div>
            )}
          </div>

          {/* Main Content Area */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden">
            {/* Search Bar */}
            <div className="p-4 md:p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
              <div className="relative max-w-lg w-full">
                <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
                <input 
                  type="text"
                  placeholder="Cari sub materi..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-transparent outline-none transition-all text-base shadow-sm"
                />
              </div>
            </div>

            {loading ? (
              <div className="py-24 text-center">
                <Loader size={48} className="mx-auto text-blue-600 animate-spin mb-6" />
                <p className="text-gray-600 font-medium text-lg">Memuat data sub materi...</p>
              </div>
            ) : error ? (
              <div className="py-24 text-center bg-red-50/50">
                <div className="text-red-500 text-lg font-semibold">{error}</div>
              </div>
            ) : filteredList.length === 0 ? (
              <div className="py-24 text-center bg-gray-50/50">
                <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Video size={40} className="text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Data Tidak Ditemukan</h3>
                <p className="text-gray-600 text-base max-w-md mx-auto">
                  {searchQuery ? `Tidak ada hasil untuk "${searchQuery}"` : "Belum ada sub materi yang ditambahkan."}
                </p>
              </div>
            ) : (
              <>
                {/* === TAMPILAN DESKTOP (TABLE) === */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gradient-to-r from-gray-100 to-gray-50 border-b border-gray-200 text-sm font-semibold text-gray-600 uppercase tracking-wider">
                        <th className="px-8 py-5">Judul</th>
                        <th className="px-8 py-5">Deskripsi Singkat</th>
                        <th className="px-8 py-5">Kategori</th>
                        <th className="px-8 py-5">Media</th>
                        <th className="px-8 py-5 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredList.map((item) => (
                        <tr key={item.id} className="hover:bg-blue-50/50 transition-colors">
                          <td className="px-8 py-5 font-medium text-gray-900">{item.title}</td>
                          <td className="px-8 py-5 text-gray-500 text-sm max-w-xs truncate">
                              {stripHtml(item.content)}
                          </td>
                          <td className="px-8 py-5">
                            <span className={`px-3 py-1 rounded-lg text-xs font-medium ${
                              item.contentCategory === 'video' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                            }`}>
                              {item.contentCategory === 'video' ? 'Video' : 'Foto'}
                            </span>
                          </td>
                          <td className="px-8 py-5">
                            {item.contentCategory === 'video' ? (
                              <a href={item.contentUrl} target="_blank" rel="noreferrer" className="text-blue-600 underline hover:text-blue-800 transition-colors">
                                Link Video
                              </a>
                            ) : (
                              <img 
                                src={getFullImageUrl(item.contentUrl)} 
                                alt="Preview" 
                                className="h-12 w-20 object-cover rounded border bg-gray-200"
                                onError={(e) => {
                                  (e.currentTarget as HTMLImageElement).src = "https://placehold.co/150?text=Error";
                                }} 
                              />
                            )}
                          </td>
                          <td className="px-8 py-5 text-right">
                            <div className="flex justify-end gap-2">
                              <button onClick={() => handleEdit(item)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                <Edit size={18} />
                              </button>
                              <button onClick={() => handleDeleteClick(item)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* === TAMPILAN MOBILE (CARDS) === */}
                <div className="md:hidden p-4 space-y-4">
                  {filteredList.map((item) => (
                    <div key={item.id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1 pr-2">
                            <h3 className="font-bold text-gray-900 text-lg line-clamp-2 leading-tight">{item.title}</h3>
                            <span className={`inline-block mt-2 px-2.5 py-1 rounded-md text-xs font-semibold ${
                              item.contentCategory === 'video' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-blue-50 text-blue-600 border border-blue-100'
                            }`}>
                              {item.contentCategory === 'video' ? 'Video' : 'Foto'}
                            </span>
                        </div>
                        <div className="flex gap-1 shrink-0">
                          <button onClick={() => handleEdit(item)} className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                            <Edit size={18} />
                          </button>
                          <button onClick={() => handleDeleteClick(item)} className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                      <div className="text-gray-500 text-sm mb-4 line-clamp-2">
                          {stripHtml(item.content) || "Tidak ada deskripsi."}
                      </div>
                      <div className="pt-3 border-t border-gray-50">
                          {item.contentCategory === 'video' ? (
                             <a 
                                href={item.contentUrl} 
                                target="_blank" 
                                rel="noreferrer" 
                                className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-800 bg-blue-50/50 p-2 rounded-lg"
                             >
                               <ExternalLink size={16} />
                               Buka Link Video
                             </a>
                          ) : (
                             <div className="w-full h-40 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                               <img 
                                 src={getFullImageUrl(item.contentUrl)} 
                                 alt={item.title}
                                 className="w-full h-full object-cover"
                                 onError={(e) => {
                                   (e.currentTarget as HTMLImageElement).src = "https://placehold.co/300x200?text=Error+Loading";
                                 }}
                               />
                             </div>
                          )}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* --- MODAL FORM --- */}
        {isFormOpen && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl border border-gray-200 overflow-hidden transform transition-all scale-100 flex flex-col max-h-[90vh]">
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-gray-50 to-white shrink-0">
                <h3 className="font-bold text-gray-800">{editingItem ? 'Edit Sub Materi' : 'Tambah Sub Materi'}</h3>
                <button onClick={handleReset}><X size={24} className="text-gray-400" /></button>
              </div>
              
              <div className="p-6 space-y-6 overflow-y-auto">
                {actionError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-start gap-3 animate-fade-in shadow-sm">
                      <AlertCircle size={20} className="mt-0.5 shrink-0" />
                      <div>
                        <p className="font-semibold text-sm">Gagal Menyimpan</p>
                        <p className="text-sm mt-0.5">{actionError}</p>
                      </div>
                  </div>
                )}

                <div>
                  <label className="block text-base font-semibold text-gray-800 mb-3">Judul</label>
                  <input 
                    type="text" 
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-base shadow-sm"
                  />
                </div>

                <div>
                  <label className="block text-base font-semibold text-gray-800 mb-3">Tipe Konten</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer border px-3 py-2 rounded hover:bg-gray-50">
                      <input 
                        type="radio" 
                        checked={formData.contentCategory === 'video'} 
                        onChange={() => setFormData({...formData, contentCategory: 'video', contentUrl: ''})}
                      />
                      <Video size={16} /> Video
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer border px-3 py-2 rounded hover:bg-gray-50">
                      <input 
                        type="radio" 
                        checked={formData.contentCategory === 'photo'} 
                        onChange={() => setFormData({...formData, contentCategory: 'photo', contentUrl: ''})}
                      />
                      <ImageIcon size={16} /> Foto
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-base font-semibold text-gray-800 mb-3">
                    {formData.contentCategory === 'video' ? 'Link Video Youtube' : 'Upload Foto'}
                  </label>
                  
                  {formData.contentCategory === 'video' ? (
                    <input 
                      type="url" 
                      value={formData.contentUrl}
                      onChange={(e) => setFormData({...formData, contentUrl: e.target.value})}
                      className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-base shadow-sm"
                      placeholder="https://www.youtube.com/..."
                    />
                  ) : (
                    <div className="border-2 border-dashed rounded-xl p-6 text-center hover:bg-gray-50 transition">
                      <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" id="fileUpload" />
                      <label htmlFor="fileUpload" className="cursor-pointer flex flex-col items-center gap-2 text-gray-500">
                        {formData.contentUrl ? (
                           <img 
                             src={getFullImageUrl(formData.contentUrl)} 
                             alt="Preview" 
                             className="h-32 object-contain mx-auto"
                             onError={(e) => { (e.currentTarget as HTMLImageElement).src = "https://placehold.co/150?text=Error"; }}
                           />
                        ) : (
                          <>
                            <UploadCloud size={32} />
                            <span className="text-sm">Klik untuk upload foto</span>
                          </>
                        )}
                      </label>
                      {formData.contentUrl && (
                        <button 
                          onClick={() => document.getElementById('fileUpload')?.click()} 
                          className="text-xs text-blue-600 mt-2 underline"
                        >
                          Ganti Foto
                        </button>
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-base font-semibold text-gray-800 mb-3">Deskripsi</label>

                  {/* --- PERBAIKAN: Menambahkan Scrollbar Internal --- */}
                  <div className="bg-white rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-500/20 transition-all shadow-sm
                    [&_.ql-toolbar]:border-b-gray-200 
                    [&_.ql-container]:h-[300px] 
                    [&_.ql-editor]:h-full 
                    [&_.ql-editor]:overflow-y-auto">

                    <ReactQuill
                      theme="snow"
                      value={formData.content}
                      onChange={(content) => setFormData({ ...formData, content: content })}
                      modules={quillModules}
                      className="mb-0"
                    />
                  </div>
                </div>

              </div>

              <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex gap-4 justify-end shrink-0">
                <button onClick={handleReset} className="px-6 py-3 text-base font-medium text-gray-600 hover:bg-gray-200 rounded-xl transition-colors">
                  Batal
                </button>
                <button 
                  onClick={handleSubmit} 
                  disabled={isSubmitting}
                  className="px-6 py-3 text-base font-medium bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-blue-400 disabled:to-blue-500 text-white rounded-xl transition-all shadow-lg flex items-center gap-2"
                >
                  {isSubmitting && <Loader size={18} className="animate-spin" />}
                  Simpan
                </button>
              </div>
            </div>
          </div>
        )}

        {/* --- MODAL DELETE --- */}
        {isDeleteOpen && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-gray-200 overflow-hidden text-center p-8">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 text-red-600">
                <Trash2 size={32} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Hapus Item?</h3>
              <p className="text-gray-600 text-base mb-8 leading-relaxed">
                Yakin ingin menghapus <strong>"{deleteItem?.title}"</strong>?
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setIsDeleteOpen(false)}
                  disabled={isSubmitting}
                  className="flex-1 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 font-medium text-base transition-colors shadow-sm"
                >
                  Batal
                </button>
                <button
                  onClick={handleConfirmDelete}
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

export default ManageSubMaterial;