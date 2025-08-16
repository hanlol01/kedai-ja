'use client';

import { useEffect, useState } from 'react';
import { Upload, X, Camera, Video, Image as ImageIcon, Trash2, Edit, Save, AlertCircle, Play } from 'lucide-react';

interface GalleryItem {
  _id: string;
  title: string;
  description?: string;
  fileUrl: string;
  fileType: 'image' | 'video';
  fileName: string;
  fileSize: number;
  mimeType: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function AdminGallery() {
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ title: '', description: '' });

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/gallery');
      const data = await response.json();
      setGallery(data);
    } catch (error) {
      console.error('Error fetching gallery:', error);
      setError('Gagal memuat gallery');
    } finally {
      setLoading(false);
    }
  };

  const uploadFile = async (file: File): Promise<{ fileUrl: string; id: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', file.name.replace(/\.[^/.]+$/, ''));
    formData.append('description', '');
    
    // Determine upload endpoint based on file type
    const isVideo = file.type.startsWith('video/');
    const uploadEndpoint = isVideo ? '/api/uploads/video' : '/api/uploads/image';
    
    console.log(`Uploading ${isVideo ? 'video' : 'image'}: ${file.name}`);
    
    const response = await fetch(uploadEndpoint, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Upload gagal');
    }
    
    const result = await response.json();
    return { fileUrl: result.data.fileUrl, id: result.data.id };
  };

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setError('');
    setSuccess('');
    setUploading(true);

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        // Validasi file
        const isImage = file.type.startsWith('image/');
        const isVideo = file.type.startsWith('video/');
        
        if (!isImage && !isVideo) {
          throw new Error(`File ${file.name} bukan gambar atau video yang valid`);
        }

        // Batas ukuran: 50MB untuk video, 10MB untuk gambar
        const maxSize = isVideo ? 50 * 1024 * 1024 : 10 * 1024 * 1024;
        if (file.size > maxSize) {
          const maxSizeMB = maxSize / (1024 * 1024);
          throw new Error(`File ${file.name} terlalu besar (maksimal ${maxSizeMB}MB)`);
        }

        // Upload file (akan otomatis save ke database juga)
        const uploadResult = await uploadFile(file);
        
        console.log(`Successfully uploaded: ${file.name} -> ${uploadResult.fileUrl}`);
        
        return uploadResult;
      });

      await Promise.all(uploadPromises);
      
      setSuccess(`Berhasil mengupload ${files.length} file`);
      fetchGallery();
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Terjadi kesalahan saat upload');
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (item: GalleryItem) => {
    setEditingItem(item._id);
    setEditForm({
      title: item.title,
      description: item.description || ''
    });
  };

  const handleSaveEdit = async (id: string) => {
    try {
      const response = await fetch(`/api/gallery/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editForm),
      });

      if (!response.ok) {
        throw new Error('Gagal mengupdate item');
      }

      setSuccess('Item berhasil diupdate');
      setEditingItem(null);
      fetchGallery();
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Gagal mengupdate item');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus item ini?')) return;

    try {
      const response = await fetch(`/api/gallery/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Gagal menghapus item');
      }

      setSuccess('Item berhasil dihapus');
      fetchGallery();
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Gagal menghapus item');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        <p className="ml-4 text-gray-600">Memuat gallery...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-white">Gallery Management</h1>
        <p className="text-gray-300 mt-2">Upload dan kelola gambar serta video untuk gallery</p>
      </div>

      {/* Upload Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Upload File Baru</h2>
        
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-orange-400 transition-colors">
          <div className="space-y-4">
            <div className="flex justify-center space-x-2">
              <Camera className="h-12 w-12 text-gray-400" />
              <Video className="h-12 w-12 text-gray-400" />
            </div>
            <div>
              <label htmlFor="file-upload" className="cursor-pointer">
                <span className="text-lg font-medium text-gray-900">
                  Klik untuk upload file
                </span>
                <p className="text-gray-500 mt-2">
                  Drag & drop file atau klik untuk memilih
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  Mendukung gambar (max 10MB) dan video (max 50MB)
                </p>
              </label>
              <input
                id="file-upload"
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={(e) => handleFileUpload(e.target.files)}
                className="hidden"
                disabled={uploading}
              />
            </div>
            {uploading && (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500"></div>
                <span className="ml-2 text-orange-600">Uploading...</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
          <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
          <span className="text-red-700">{error}</span>
          <button
            onClick={() => setError('')}
            className="ml-auto text-red-500 hover:text-red-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
          <span className="text-green-700">{success}</span>
          <button
            onClick={() => setSuccess('')}
            className="ml-auto text-green-500 hover:text-green-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Gallery Grid */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Gallery Items ({gallery.length})</h2>
        
        {gallery.length === 0 ? (
          <div className="text-center py-12">
            <Camera className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Belum ada item di gallery</p>
            <p className="text-gray-400">Upload file pertama Anda untuk memulai</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {gallery.map((item) => (
              <div key={item._id} className="bg-gray-50 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                {/* Media Preview */}
                <div className="aspect-square relative bg-gray-200">
                  {item.fileType === 'image' ? (
                    <img
                      src={item.fileUrl}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="relative w-full h-full bg-gray-800">
                      <video
                        src={item.fileUrl}
                        className="w-full h-full object-cover"
                        muted
                        preload="metadata"
                        onLoadedMetadata={(e) => {
                          const video = e.target as HTMLVideoElement;
                          video.currentTime = 2; // Set to 2 seconds for thumbnail
                        }}
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <div className="bg-white/20 backdrop-blur-md rounded-full p-3 border border-white/30">
                          <Play className="h-8 w-8 text-white" />
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* File type indicator */}
                  <div className="absolute top-2 left-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      item.fileType === 'image' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-purple-100 text-purple-800'
                    }`}>
                      {item.fileType === 'image' ? (
                        <ImageIcon className="h-3 w-3 mr-1" />
                      ) : (
                        <Video className="h-3 w-3 mr-1" />
                      )}
                      {item.fileType}
                    </span>
                  </div>

                  {/* Action buttons */}
                  <div className="absolute top-2 right-2 flex space-x-1">
                    <button
                      onClick={() => handleEdit(item)}
                      className="p-1.5 bg-white/80 hover:bg-white rounded-full transition-colors"
                    >
                      <Edit className="h-4 w-4 text-gray-600" />
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="p-1.5 bg-white/80 hover:bg-white rounded-full transition-colors"
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  {editingItem === item._id ? (
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={editForm.title}
                        onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-black"
                        placeholder="Judul"
                      />
                      <textarea
                        value={editForm.description}
                        onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-black"
                        rows={2}
                        placeholder="Deskripsi"
                      />
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleSaveEdit(item._id)}
                          className="flex-1 bg-green-600 text-white px-3 py-1.5 rounded-md text-sm hover:bg-green-700 transition-colors flex items-center justify-center"
                        >
                          <Save className="h-4 w-4 mr-1" />
                          Simpan
                        </button>
                        <button
                          onClick={() => setEditingItem(null)}
                          className="flex-1 bg-gray-300 text-gray-700 px-3 py-1.5 rounded-md text-sm hover:bg-gray-400 transition-colors"
                        >
                          Batal
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <h3 className="font-medium text-gray-900 truncate" title={item.title}>
                        {item.title}
                      </h3>
                      {item.description && (
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2" title={item.description}>
                          {item.description}
                        </p>
                      )}
                      <div className="mt-2 text-xs text-gray-500">
                        <p>{formatFileSize(item.fileSize)}</p>
                        <p>{new Date(item.createdAt).toLocaleDateString('id-ID')}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
