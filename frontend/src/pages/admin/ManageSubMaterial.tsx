import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, Edit, Trash2, X, Search, Loader, 
  Video, Image as ImageIcon, ArrowLeft, UploadCloud 
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';

// Import Service
import { subMaterialService } from '../../services/api/subMaterialService';
import type { SubMaterialItem, SubMaterialFormData } from '../../services/api/subMaterialService';

// --- KONFIGURASI PENTING ---
// Ganti URL ini sesuai dengan alamat Backend Anda berjalan!
// Jika backend jalan di port 3000, tulis 'http://localhost:3000'
// Jika backend jalan di port 5000, tulis 'http://localhost:5000'
const BACKEND_URL = 'http://localhost:3000'; 
// ---------------------------

const ManageSubMaterial = () => {
  const { materialId } = useParams<{ materialId: string }>();
  const navigate = useNavigate();

  // --- States ---
  const [dataList, setDataList] = useState<SubMaterialItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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

  // --- Functions ---
  const fetchData = async () => {
    try {
      setLoading(true);
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

  // --- LOGIC PENAMPIL GAMBAR (DIPERBAIKI) ---
  const getFullImageUrl = (path: string) => {
    if (!path) return 'https://via.placeholder.com/150?text=No+Image';
    
    // 1. Jika URL sudah lengkap (http/https) atau Base64 (data:image), kembalikan langsung
    if (path.startsWith('http') || path.startsWith('data:')) {
      return path;
    }

    // 2. Bersihkan path dari backend (misal backend kirim "uploads/..." atau "/uploads/...")
    // Kita pastikan ada "/" di depan
    const cleanPath = path.startsWith('/') ? path : `/${path}`;

    // 3. Gabungkan dengan URL Backend
    const finalUrl = `${BACKEND_URL}${cleanPath}`;
    
    // Debugging: Cek console browser (F12) untuk melihat link yang dihasilkan
    // console.log("Original Path:", path);
    // console.log("Final URL:", finalUrl);
    
    return finalUrl;
  };

  const handleReset = () => {
    setFormData({ title: '', contentCategory: 'video', contentUrl: '', content: '' });
    setEditingItem(null);
    setIsFormOpen(false);
  };

  const handleEdit = (item: SubMaterialItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      contentCategory: item.contentCategory,
      contentUrl: item.contentUrl, 
      content: item.content
    });
    setIsFormOpen(true);
  };

  const handleDeleteClick = (item: SubMaterialItem) => {
    setDeleteItem(item);
    setIsDeleteOpen(true);
  };

  // Logic Upload & Convert ke Base64
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, contentUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.content) return alert("Judul dan Konten wajib diisi");
    if (!formData.contentUrl) return alert("Video URL atau Foto wajib diisi");

    try {
      setIsSubmitting(true);
      if (editingItem) {
        await subMaterialService.updateSubMaterial(Number(materialId), editingItem.id, formData);
      } else {
        await subMaterialService.createSubMaterial(Number(materialId), formData);
      }
      handleReset();
      fetchData(); 
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteItem) return;
    try {
      setIsSubmitting(true);
      await subMaterialService.deleteSubMaterial(Number(materialId), deleteItem.id);
      setIsDeleteOpen(false);
      setDeleteItem(null);
      fetchData();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredList = dataList.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto mb-6">
        <button onClick={() => navigate('/admin/managemateri')} className="text-blue-600 flex items-center gap-1 mb-2 hover:underline">
          <ArrowLeft size={16} /> Kembali
        </button>
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Sub Materi</h1>
            <p className="text-gray-500 text-sm">Kelola video dan foto untuk materi ini</p>
          </div>
          <button 
            onClick={() => { handleReset(); setIsFormOpen(true); }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
          >
            <Plus size={18} /> Tambah
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow border p-6">
        <div className="mb-4 relative">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input 
            type="text"
            placeholder="Cari sub materi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {loading ? (
          <div className="text-center py-10"><Loader className="animate-spin mx-auto text-blue-600" /></div>
        ) : error ? (
          <div className="text-red-500 text-center py-10 bg-red-50 rounded-lg">{error}</div>
        ) : filteredList.length === 0 ? (
          <div className="text-center py-10 text-gray-500">Belum ada data.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b text-sm text-gray-600">
                  <th className="p-3">Judul</th>
                  <th className="p-3">Kategori</th>
                  <th className="p-3">Media / URL</th>
                  <th className="p-3">Tanggal</th>
                  <th className="p-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredList.map((item) => (
                  <tr key={item.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium text-gray-800">{item.title}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded text-xs flex items-center gap-1 w-fit ${
                        item.contentCategory === 'video' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {item.contentCategory === 'video' ? <Video size={12}/> : <ImageIcon size={12}/>}
                        {item.contentCategory === 'video' ? 'Video' : 'Foto'}
                      </span>
                    </td>
                    <td className="p-3">
                      {item.contentCategory === 'video' ? (
                        <a href={item.contentUrl} target="_blank" rel="noreferrer" className="text-blue-600 underline text-sm">
                          Link Video
                        </a>
                      ) : (
                        <div className="relative group">
                            {/* --- IMAGE DISPLAY --- */}
                            <img 
                              src={getFullImageUrl(item.contentUrl)} 
                              alt="Preview" 
                              className="h-12 w-20 object-cover rounded border bg-gray-200"
                              onError={(e) => {
                                // Jika error, ganti ke gambar placeholder agar tidak terlihat rusak
                                (e.currentTarget as HTMLImageElement).src = "https://via.placeholder.com/150?text=Error";
                                (e.currentTarget as HTMLImageElement).className = "h-12 w-20 object-contain bg-gray-100 border rounded text-xs text-center";
                              }} 
                            />
                        </div>
                      )}
                    </td>
                    <td className="p-3 text-sm text-gray-500">
                        {item.createdAt ? new Date(item.createdAt).toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'}) : '-'}
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => handleEdit(item)} className="p-2 text-blue-600 hover:bg-blue-50 rounded"><Edit size={16}/></button>
                        <button onClick={() => handleDeleteClick(item)} className="p-2 text-red-600 hover:bg-red-50 rounded"><Trash2 size={16}/></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* --- MODAL FORM --- */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-gray-800">{editingItem ? 'Edit Sub Materi' : 'Tambah Sub Materi'}</h3>
              <button onClick={handleReset}><X size={20} className="text-gray-400" /></button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Judul</label>
                <input 
                  type="text" 
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Tipe Konten</label>
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
                <label className="block text-sm font-medium mb-1">
                  {formData.contentCategory === 'video' ? 'Link Video Youtube' : 'Upload Foto'}
                </label>
                
                {formData.contentCategory === 'video' ? (
                  <input 
                    type="url" 
                    value={formData.contentUrl}
                    onChange={(e) => setFormData({...formData, contentUrl: e.target.value})}
                    className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                ) : (
                  <div className="border-2 border-dashed rounded-lg p-4 text-center hover:bg-gray-50 transition">
                    <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" id="fileUpload" />
                    <label htmlFor="fileUpload" className="cursor-pointer flex flex-col items-center gap-2 text-gray-500">
                      {formData.contentUrl ? (
                         <img 
                           src={getFullImageUrl(formData.contentUrl)} 
                           alt="Preview" 
                           className="h-32 object-contain mx-auto" 
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
                <label className="block text-sm font-medium mb-1">Deskripsi</label>
                <textarea 
                  rows={3}
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                />
              </div>
            </div>

            <div className="p-4 border-t bg-gray-50 flex gap-3 justify-end">
              <button onClick={handleReset} className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded">Batal</button>
              <button 
                onClick={handleSubmit} 
                disabled={isSubmitting}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2"
              >
                {isSubmitting && <Loader size={16} className="animate-spin"/>} Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL DELETE --- */}
      {isDeleteOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-sm p-6 text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="text-red-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Hapus Item?</h3>
            <p className="text-gray-500 text-sm mt-2 mb-6">Yakin ingin menghapus <b>"{deleteItem?.title}"</b>?</p>
            <div className="flex gap-3">
              <button onClick={() => setIsDeleteOpen(false)} className="flex-1 py-2 border rounded hover:bg-gray-50">Batal</button>
              <button 
                onClick={handleConfirmDelete} 
                disabled={isSubmitting}
                className="flex-1 py-2 bg-red-600 text-white rounded hover:bg-red-700 flex justify-center items-center gap-2"
              >
                {isSubmitting && <Loader size={16} className="animate-spin"/>} Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageSubMaterial;