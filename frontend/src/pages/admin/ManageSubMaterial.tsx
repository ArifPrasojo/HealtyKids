import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { 
  Plus, Edit, Trash2, X, Search, Loader, 
  Video, Image as ImageIcon, ArrowLeft, UploadCloud,
  CheckCircle, AlertCircle, ExternalLink 
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';

// --- IMPORT REACT QUILL & MODULES ---
import ReactQuill, { Quill } from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import ImageResize from 'quill-image-resize-module-react';

if (!Quill.imports['modules/imageResize']) {
  Quill.register('modules/imageResize', ImageResize);
}

import { subMaterialService } from '../../services/api/subMaterialService';
import type { SubMaterialItem, SubMaterialFormData } from '../../services/api/subMaterialService';
import CloudBackground from '../../components/layouts/CloudBackground';

const BACKEND_URL = import.meta.env?.VITE_API_URL;

// --- UTILITY: KOMPRESI GAMBAR (Mengurangi ukuran Base64) ---
const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target?.result as string;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                // Set ukuran maksimal (misal lebar 800px) untuk menjaga proporsi
                const MAX_WIDTH = 800;
                const scaleSize = MAX_WIDTH / img.width;
                const newWidth = (img.width > MAX_WIDTH) ? MAX_WIDTH : img.width;
                const newHeight = (img.width > MAX_WIDTH) ? img.height * scaleSize : img.height;

                canvas.width = newWidth;
                canvas.height = newHeight;

                const ctx = canvas.getContext('2d');
                if (ctx) {
                    ctx.drawImage(img, 0, 0, newWidth, newHeight);
                    // Kompres ke JPEG dengan kualitas 0.6 (60%)
                    // Ini akan mengurangi ukuran file secara drastis (misal 5MB -> 100KB)
                    const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.6);
                    resolve(compressedDataUrl);
                } else {
                    reject(new Error("Gagal memproses gambar"));
                }
            };
            img.onerror = (err) => reject(err);
        };
        reader.onerror = (err) => reject(err);
    });
};

// --- WHITELIST FORMATS (MENGHILANGKAN LIST LI) ---
const quillFormats = [
  'header', 'font', 'size',
  'bold', 'italic', 'underline', 'strike',
  'script', 'color', 'background',
  'indent', 'align',
  'blockquote', 'link', 'image'
];

const ManageSubMaterial = () => {
  const { materialId } = useParams<{ materialId: string }>();
  const navigate = useNavigate();
  
  // Ref untuk ReactQuill
  const quillRef = useRef<ReactQuill>(null);

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

  // --- CUSTOM IMAGE HANDLER FOR QUILL ---
  // Fungsi ini akan dipanggil saat tombol gambar di toolbar diklik
  const imageHandler = useCallback(() => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files ? input.files[0] : null;
      if (file) {
        // Cek ukuran awal jika perlu, tapi kita akan kompres
        try {
            // Kompres gambar sebelum dimasukkan ke editor
            const compressedUrl = await compressImage(file);
            
            // Masukkan ke editor
            const quill = quillRef.current?.getEditor();
            if (quill) {
                const range = quill.getSelection();
                const index = range ? range.index : 0;
                quill.insertEmbed(index, 'image', compressedUrl);
                // Pindahkan kursor ke setelah gambar
                quill.setSelection(index + 1, 0); 
            }
        } catch (error) {
            console.error("Gagal memproses gambar:", error);
            setActionError("Gagal memproses gambar untuk editor.");
        }
      }
    };
  }, []);

  // --- KONFIGURASI TOOLBAR & MODULES EDITOR (INSIDE COMPONENT) ---
  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'font': [] }],
        [{ 'size': ['small', false, 'large', 'huge'] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'script': 'sub'}, { 'script': 'super' }],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'indent': '-1'}, { 'indent': '+1' }],
        [{ 'align': [] }],
        ['blockquote'],
        ['link', 'image'], // Tombol image akan menggunakan handler kustom kita
        ['clean']
      ],
      handlers: {
        image: imageHandler // Pasang handler custom di sini
      }
    },
    imageResize: {
      parchment: Quill.import('parchment'),
      modules: ['Resize', 'DisplaySize']
    }
  }), [imageHandler]);

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
    const baseUrl = BACKEND_URL && BACKEND_URL.endsWith('/') ? BACKEND_URL.slice(0, -1) : BACKEND_URL;
    
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

  // Validasi Upload File (Thumbnail Utama)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setActionError(null);

      const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!validTypes.includes(file.type)) {
        setActionError("Format file tidak valid. Harap upload gambar dengan format JPG, JPEG, atau PNG.");
        e.target.value = '';
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
          setActionError("Ukuran file terlalu besar (Maksimal 2MB). Silakan kompres gambar Anda.");
          e.target.value = '';
          return;
      }

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
    
    try {
      setIsSubmitting(true);
      setActionError(null);

      const payload: Partial<SubMaterialFormData> = {
        title: formData.title,
        contentCategory: formData.contentCategory,
        content: formData.content
      };

      if (editingItem) {
        if (formData.contentCategory === 'video') {
            payload.contentUrl = formData.contentUrl;
        } else {
            if (formData.contentUrl !== editingItem.contentUrl) {
                payload.contentUrl = formData.contentUrl;
            }
        }

        await subMaterialService.updateSubMaterial(Number(materialId), editingItem.id, payload);
        setSuccessMessage("Sub materi berhasil diperbarui!");
      } else {
        await subMaterialService.createSubMaterial(Number(materialId), formData);
        setSuccessMessage("Sub materi baru berhasil ditambahkan!");
      }
      
      handleReset();
      fetchData();
    } catch (err: any) {
      console.error("Submit Error:", err);

      const errorMessage = err.message || "";
      
      if (errorMessage.includes("Unexpected token") || errorMessage.includes("not valid JSON")) {
        setActionError("Gagal menyimpan: Ukuran data terlalu besar. Gambar di deskripsi telah dikompres otomatis, namun jika masih gagal, coba kurangi jumlah gambar.");
      } else {
        setActionError(errorMessage || "Terjadi kesalahan saat menyimpan data.");
      }
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

          {/* Header */}
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

          {/* Alerts */}
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

          {/* Content */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden">
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
                {/* Desktop Table */}
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
                          <td className="px-8 py-5 text-gray-500 text-sm max-w-xs truncate">{stripHtml(item.content)}</td>
                          <td className="px-8 py-5">
                            <span className={`px-3 py-1 rounded-lg text-xs font-medium ${
                              item.contentCategory === 'video' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                            }`}>
                              {item.contentCategory === 'video' ? 'Video' : 'Foto'}
                            </span>
                          </td>
                          <td className="px-8 py-5">
                            {!item.contentUrl ? (
                                <span className="text-gray-400 text-xs italic">Tidak ada media</span>
                            ) : item.contentCategory === 'video' ? (
                              <a href={item.contentUrl} target="_blank" rel="noreferrer" className="text-blue-600 underline hover:text-blue-800 transition-colors">Link Video</a>
                            ) : (
                              <img 
                                src={getFullImageUrl(item.contentUrl)} 
                                alt="Preview" 
                                className="h-12 w-20 object-cover rounded border bg-gray-200"
                                onError={(e) => { (e.currentTarget as HTMLImageElement).src = "https://placehold.co/150?text=Error"; }} 
                              />
                            )}
                          </td>
                          <td className="px-8 py-5 text-right">
                            <div className="flex justify-end gap-2">
                              <button onClick={() => handleEdit(item)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Edit size={18} /></button>
                              <button onClick={() => handleDeleteClick(item)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={18} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden p-4 space-y-4">
                  {filteredList.map((item) => (
                    <div key={item.id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1 pr-2">
                            <h3 className="font-bold text-gray-900 text-lg line-clamp-2 leading-tight">{item.title}</h3>
                            <span className={`inline-block mt-2 px-2.5 py-1 rounded-md text-xs font-semibold ${
                              item.contentCategory === 'video' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-blue-50 text-blue-600 border border-blue-100'
                            }`}>{item.contentCategory === 'video' ? 'Video' : 'Foto'}</span>
                        </div>
                        <div className="flex gap-1 shrink-0">
                          <button onClick={() => handleEdit(item)} className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"><Edit size={18} /></button>
                          <button onClick={() => handleDeleteClick(item)} className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"><Trash2 size={18} /></button>
                        </div>
                      </div>
                      <div className="text-gray-500 text-sm mb-4 line-clamp-2">{stripHtml(item.content) || "Tidak ada deskripsi."}</div>
                      <div className="pt-3 border-t border-gray-50">
                          {!item.contentUrl ? (
                             <span className="text-gray-400 text-xs italic">Tidak ada media</span>
                          ) : item.contentCategory === 'video' ? (
                             <a href={item.contentUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-800 bg-blue-50/50 p-2 rounded-lg"><ExternalLink size={16} />Buka Link Video</a>
                          ) : (
                             <div className="w-full h-40 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                               <img src={getFullImageUrl(item.contentUrl)} alt={item.title} className="w-full h-full object-cover" onError={(e) => { (e.currentTarget as HTMLImageElement).src = "https://placehold.co/300x200?text=Error+Loading"; }}/>
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
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl border border-gray-200 overflow-hidden transform transition-all scale-100 flex flex-col max-h-[95vh]">
              <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-blue-50 to-indigo-50 shrink-0">
                <h3 className="text-xl font-bold text-gray-800">{editingItem ? 'Edit Sub Materi' : 'Tambah Sub Materi'}</h3>
                <button onClick={handleReset} className="hover:bg-white/50 p-2 rounded-lg transition-colors"><X size={24} className="text-gray-600" /></button>
              </div>
              
              <div className="p-6 overflow-y-auto">
                {actionError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-start gap-3 animate-fade-in shadow-sm mb-6">
                      <AlertCircle size={20} className="mt-0.5 shrink-0" />
                      <div><p className="font-semibold text-sm">Gagal Menyimpan</p><p className="text-sm mt-0.5">{actionError}</p></div>
                  </div>
                )}

                {/* Container Utama: Stack Vertikal */}
                <div className="space-y-6">
                  
                  {/* Bagian Atas: Grid untuk Input Judul, Tipe, dan Upload */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Kolom Kiri: Judul dan Tipe */}
                    <div className="space-y-5">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Judul <span className="text-red-500">*</span></label>
                        <input type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm shadow-sm" placeholder="Masukkan judul sub materi" />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Tipe Konten</label>
                        <div className="flex gap-3">
                          <label className="flex-1 flex items-center justify-center gap-2 cursor-pointer border-2 px-3 py-2.5 rounded-xl hover:bg-blue-50 hover:border-blue-300 transition-all">
                            <input type="radio" checked={formData.contentCategory === 'video'} onChange={() => setFormData({...formData, contentCategory: 'video', contentUrl: ''})} className="w-4 h-4" />
                            <Video size={16} className="text-red-600" /> <span className="font-medium text-sm">Video</span>
                          </label>
                          <label className="flex-1 flex items-center justify-center gap-2 cursor-pointer border-2 px-3 py-2.5 rounded-xl hover:bg-blue-50 hover:border-blue-300 transition-all">
                            <input type="radio" checked={formData.contentCategory === 'photo'} onChange={() => setFormData({...formData, contentCategory: 'photo', contentUrl: ''})} className="w-4 h-4" />
                            <ImageIcon size={16} className="text-blue-600" /> <span className="font-medium text-sm">Foto</span>
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Kolom Kanan: Upload / URL */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">{formData.contentCategory === 'video' ? 'Link Video Youtube (Opsional)' : 'Upload Foto (Opsional)'}</label>
                      {formData.contentCategory === 'video' ? (
                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-5 text-center hover:bg-gray-50 hover:border-blue-400 transition min-h-[160px] flex flex-col justify-center">
                          <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3"><Video size={28} className="text-gray-400" /></div>
                          <input type="url" value={formData.contentUrl} onChange={(e) => setFormData({...formData, contentUrl: e.target.value})} className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm shadow-sm" placeholder="https://www.youtube.com/..." />
                          <p className="text-xs text-gray-500 mt-2">Paste link video Youtube</p>
                        </div>
                      ) : (
                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-5 text-center hover:bg-gray-50 hover:border-blue-400 transition min-h-[160px]">
                          <input type="file" accept=".jpg, .jpeg, .png" onChange={handleFileChange} className="hidden" id="fileUpload" />
                          <label htmlFor="fileUpload" className="cursor-pointer flex flex-col items-center gap-3 text-gray-500">
                            {formData.contentUrl ? (
                               <img src={getFullImageUrl(formData.contentUrl)} alt="Preview" className="h-32 w-full object-contain mx-auto rounded-lg" onError={(e) => { (e.currentTarget as HTMLImageElement).src = "https://placehold.co/150?text=Error"; }} />
                            ) : (
                              <>
                                <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center"><UploadCloud size={28} className="text-gray-400" /></div>
                                <div><p className="text-sm font-medium text-gray-700">Klik untuk upload foto</p><p className="text-xs text-gray-500 mt-1">JPG, JPEG, PNG (Max 2MB)</p></div>
                              </>
                            )}
                          </label>
                          {formData.contentUrl && (
                            <button onClick={() => document.getElementById('fileUpload')?.click()} className="text-xs text-blue-600 mt-2 underline hover:text-blue-700 font-medium">Ganti Foto</button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Bagian Bawah: Editor Deskripsi (SUPER WIDE / FULL WIDTH) */}
                  <div className="flex flex-col w-full">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Deskripsi Lengkap</label>
                    <div className="bg-white rounded-xl overflow-hidden border-2 border-gray-300 focus-within:ring-2 focus-within:ring-blue-500/30 focus-within:border-blue-500 transition-all shadow-sm h-[530px] flex flex-col w-full">
                      <ReactQuill
                        ref={quillRef} // Pasang Ref disini
                        theme="snow"
                        value={formData.content}
                        onChange={(content) => setFormData({ ...formData, content: content })}
                        modules={modules} // Gunakan modules yang ada imageHandlernya
                        formats={quillFormats}
                        className="h-full flex flex-col w-full [&_.ql-toolbar]:shrink-0 [&_.ql-toolbar]:bg-gray-50 [&_.ql-toolbar]:border-b-2 [&_.ql-toolbar]:border-gray-200 [&_.ql-container]:flex-1 [&_.ql-container]:overflow-hidden [&_.ql-editor]:h-full [&_.ql-editor]:overflow-y-auto [&_.ql-editor]:text-base [&_.ql-editor]:leading-relaxed [&_.ql-editor]:p-4 [&_.ql-editor_img]:inline-block"
                        placeholder="Tulis deskripsi lengkap untuk sub materi ini..."
                      />
                    </div>
                  </div>

                </div>
              </div>

              <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex gap-4 justify-end shrink-0">
                <button onClick={handleReset} className="px-6 py-3 text-base font-medium text-gray-600 hover:bg-gray-200 rounded-xl transition-colors">Batal</button>
                <button onClick={handleSubmit} disabled={isSubmitting} className="px-6 py-3 text-base font-medium bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-blue-400 disabled:to-blue-500 text-white rounded-xl transition-all shadow-lg flex items-center gap-2">
                  {isSubmitting && <Loader size={18} className="animate-spin" />} Simpan
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Delete */}
        {isDeleteOpen && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-gray-200 overflow-hidden text-center p-8">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 text-red-600"><Trash2 size={32} /></div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Hapus Item?</h3>
              <p className="text-gray-600 text-base mb-8 leading-relaxed">Yakin ingin menghapus <strong>"{deleteItem?.title}"</strong>?</p>
              <div className="flex gap-4">
                <button onClick={() => setIsDeleteOpen(false)} disabled={isSubmitting} className="flex-1 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 font-medium text-base transition-colors shadow-sm">Batal</button>
                <button onClick={handleConfirmDelete} disabled={isSubmitting} className="flex-1 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-xl font-medium text-base transition-colors flex items-center justify-center gap-2 shadow-lg">
                  {isSubmitting && <Loader size={18} className="animate-spin" />} Hapus
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