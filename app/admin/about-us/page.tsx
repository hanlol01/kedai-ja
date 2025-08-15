'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Save, AlertCircle, Upload, X, Image as ImageIcon, Plus, Trash2 } from 'lucide-react';

interface AboutUsData {
  title: string;
  subtitle: string;
  description: string;
  secondDescription: string;
  companyDescription: string;
  yearsOfExperience: number;
  masterChefs: number;
  images: {
    image1?: string;
    image2?: string;
    image3?: string;
    image4?: string;
    lingkunganKedai: string[];
    spotTempatDuduk: string[];
  };
}

export default function AdminAboutUs() {
  const [aboutUs, setAboutUs] = useState<AboutUsData>({
    title: '',
    subtitle: '',
    description: '',
    secondDescription: '',
    companyDescription: '',
    yearsOfExperience: 0,
    masterChefs: 0,
    images: {
      image1: '',
      image2: '',
      image3: '',
      image4: '',
      lingkunganKedai: [],
      spotTempatDuduk: []
    }
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState<'basic' | 'company'>('basic');
  const [imageFiles, setImageFiles] = useState<{[key: string]: File | null}>({
    image1: null,
    image2: null,
    image3: null,
    image4: null,
    lingkunganKedai: null,
    spotTempatDuduk: null
  });

  // Helper untuk cek apakah sedang berjalan di Vercel
  const isVercel = typeof window !== 'undefined' && !!process.env.NEXT_PUBLIC_VERCEL;

  const isValidImageFile = (file: File) => {
    const isImage = file.type.startsWith('image/');
    // Di Vercel batasi 4MB, di non-Vercel 15MB
    const maxSize = isVercel ? 4 * 1024 * 1024 : 15 * 1024 * 1024;
    const isSmallEnough = file.size <= maxSize;
    return { isImage, isSmallEnough, maxSize };
  };

  // Upload gambar ke GridFS tanpa kompresi
  const uploadToGridFS = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch('/api/uploads/gridfs', {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Gagal mengunggah gambar');
    }
    
    const result = await response.json();
    return result.url; // URL ke file di GridFS
  };
  
  // Kompresi gambar di sisi client untuk galeri saja (bukan untuk gambar utama)
  const compressImage = (file: File, maxWidth = 800, quality = 0.6): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ratio = img.width / img.height;
        const targetWidth = Math.min(maxWidth, img.width);
        const targetHeight = Math.round(targetWidth / ratio);
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context not available'));
          return;
        }
        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
        const mimeType = 'image/jpeg';
        const dataUrl = canvas.toDataURL(mimeType, quality);
        resolve(dataUrl);
      };
      img.onerror = reject;
      const reader = new FileReader();
      reader.onload = () => {
        img.src = reader.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  useEffect(() => {
    fetchAboutUs();
  }, []);

  const fetchAboutUs = async () => {
    try {
      const response = await fetch('/api/about-us');
      const data = await response.json();
      setAboutUs(data.aboutUs || {
        title: 'About Us',
        subtitle: 'Welcome to Kedai J.A',
        description: 'Kedai J.A adalah destinasi kuliner yang menghadirkan cita rasa autentik Indonesia dengan sentuhan modern.',
        secondDescription: 'Dengan pengalaman bertahun-tahun di industri kuliner, kami terus berinovasi untuk memberikan pengalaman dining yang tak terlupakan.',
        companyDescription: 'Kedai J.A adalah destinasi kuliner yang menghadirkan cita rasa autentik Indonesia dengan sentuhan modern.',
        yearsOfExperience: 7,
        masterChefs: 25,
        images: {
          image1: '',
          image2: '',
          image3: '',
          image4: '',
          lingkunganKedai: [],
          spotTempatDuduk: []
        }
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching about us:', error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    // Implementasi fungsi retry
    const fetchWithRetry = async (url: string, options: RequestInit, maxRetries = 2) => {
      let retries = 0;
      while (retries <= maxRetries) {
        try {
          const response = await fetch(url, options);
          const data = await response.json();
          
          if (!response.ok) {
            // Jika server timeout/503, coba lagi
            if (response.status === 503 && retries < maxRetries) {
              retries++;
              // Tunggu 2 detik sebelum mencoba lagi
              await new Promise(resolve => setTimeout(resolve, 2000));
              continue;
            }
            throw new Error(data.error || 'Gagal menyimpan. Mohon coba lagi.');
          }
          
          return { response, data };
        } catch (err) {
          if (retries === maxRetries) throw err;
          retries++;
          // Tunggu sebelum mencoba lagi (exponential backoff)
          await new Promise(resolve => setTimeout(resolve, 2000 * retries));
        }
      }
      throw new Error('Gagal melakukan request setelah beberapa percobaan');
    };

    try {
      // Convert image files to base64 if they exist
      const updatedImages = { ...aboutUs.images };
      
      for (const [key, file] of Object.entries(imageFiles)) {
        if (file && ['image1', 'image2', 'image3', 'image4'].includes(key)) {
          // Validasi 4MB saat di Vercel
          const { isImage, isSmallEnough, maxSize } = isValidImageFile(file);
          if (!isImage) {
            setError('File harus berupa gambar');
            return;
          }
          if (!isSmallEnough) {
            const limitMb = Math.round(maxSize / (1024 * 1024));
            setError(`Ukuran gambar terlalu besar (maks ${limitMb}MB)`);
            if (isVercel) alert(`Ukuran gambar terlalu besar (maks ${limitMb}MB di Vercel)`);
            return;
          }

          // Upload gambar ke GridFS tanpa kompresi, simpan URL-nya
          const fileUrl = await uploadToGridFS(file);
          updatedImages[key as 'image1' | 'image2' | 'image3' | 'image4'] = fileUrl;
        }
      }

      const { response, data } = await fetchWithRetry('/api/about-us', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...aboutUs,
          images: updatedImages
        }),
      });

      setSuccess('Data tentang kami berhasil disimpan');
      setImageFiles({
        image1: null,
        image2: null,
        image3: null,
        image4: null,
        lingkunganKedai: null,
        spotTempatDuduk: null
      });
      
      // Update local state with new data
      setAboutUs(data.aboutUs);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Terjadi kesalahan saat menyimpan data.');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: keyof AboutUsData, value: string | number) => {
    setAboutUs(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageChange = (imageKey: string, file: File | null) => {
    if (file) {
      const { isImage, isSmallEnough, maxSize } = isValidImageFile(file);
      if (!isImage) {
        setError('File harus berupa gambar');
        return;
      }
      if (!isSmallEnough) {
        const limitMb = Math.round(maxSize / (1024 * 1024));
        setError(`Ukuran gambar terlalu besar (maks ${limitMb}MB)`);
        if (isVercel) alert(`Ukuran gambar terlalu besar (maks ${limitMb}MB di Vercel)`);
        return;
      }
    }
    setImageFiles(prev => ({
      ...prev,
      [imageKey]: file
    }));
  };

  const removeImage = (imageKey: string) => {
    if (imageKey.includes('lingkunganKedai') || imageKey.includes('spotTempatDuduk')) {
      const [category, indexStr] = imageKey.split('-');
      const index = parseInt(indexStr);
      setAboutUs(prev => ({
        ...prev,
        images: {
          ...prev.images,
          [category]: Array.isArray(prev.images[category as keyof typeof prev.images])
            ? (prev.images[category as keyof typeof prev.images] as string[]).filter((_, i) => i !== index)
            : prev.images[category as keyof typeof prev.images]
        }
      }));
    } else {
      setAboutUs(prev => ({
        ...prev,
        images: {
          ...prev.images,
          [imageKey]: ''
        }
      }));
    }
    setImageFiles(prev => ({
      ...prev,
      [imageKey]: null
    }));
  };

  const addGalleryImage = async (category: 'lingkunganKedai' | 'spotTempatDuduk', file: File) => {
    try {
      const { isImage, isSmallEnough, maxSize } = isValidImageFile(file);
      if (!isImage) {
        setError('File harus berupa gambar');
        return;
      }
      if (!isSmallEnough) {
        const limitMb = Math.round(maxSize / (1024 * 1024));
        setError(`Ukuran gambar terlalu besar (maks ${limitMb}MB)`);
        if (isVercel) alert(`Ukuran gambar terlalu besar (maks ${limitMb}MB di Vercel)`);
        return;
      }
      // Kompres sebelum ditambahkan ke galeri (lebih kecil untuk performa)
      const base64Image = await compressImage(file, 600, 0.5);

      setAboutUs(prev => ({
        ...prev,
        images: {
          ...prev.images,
          [category]: [...prev.images[category], base64Image]
        }
      }));
    } catch (error) {
      setError('Gagal menambahkan gambar');
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat data tentang kami...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-white-900">Pengaturan Tentang Kami</h1>
        <p className="text-white-600 mt-2">Kelola konten, gambar, dan galeri untuk bagian tentang kami</p>
      </div>

      {/* Tab Navigation */}
      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex justify-center space-x-8">
            <button
              onClick={() => setActiveTab('basic')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'basic'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-white-500 hover:text-white-700 hover:border-white-300'
              }`}
            >
              Informasi Dasar
            </button>
            <button
              onClick={() => setActiveTab('company')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'company'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-white-500 hover:text-white-700 hover:border-white-300'
              }`}
            >
              Informasi Tentang Kami
            </button>
            <Link
              href="/admin/faq"
              className="py-2 px-1 border-b-2 font-medium text-sm border-transparent text-white-500 hover:text-white-700 hover:border-white-300"
            >
              FAQ
            </Link>
          </nav>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
          <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
          <span className="text-red-700">{error}</span>
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <span className="text-green-700">{success}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {activeTab === 'basic' && (
          <>
            {/* Basic Information */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Informasi Dasar</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Judul
                  </label>
                  <input
                    type="text"
                    value={aboutUs.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-black"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subjudul
                  </label>
                  <input
                    type="text"
                    value={aboutUs.subtitle}
                    onChange={(e) => handleInputChange('subtitle', e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-black"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Deskripsi Pertama
                  </label>
                  <textarea
                    value={aboutUs.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    required
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-black"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Deskripsi Kedua
                  </label>
                  <textarea
                    value={aboutUs.secondDescription}
                    onChange={(e) => handleInputChange('secondDescription', e.target.value)}
                    required
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-black"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tahun Pengalaman
                    </label>
                    <input
                      type="number"
                      value={aboutUs.yearsOfExperience}
                      onChange={(e) => handleInputChange('yearsOfExperience', Number(e.target.value))}
                      required
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-black"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Jumlah Spot Tempat Duduk
                    </label>
                    <input
                      type="number"
                      value={aboutUs.masterChefs}
                      onChange={(e) => handleInputChange('masterChefs', Number(e.target.value))}
                      required
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-black"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Images Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 text-white">Gambar Tentang Kami (Homepage)</h2>
              <p className="text-gray-600 mb-6">Upload 4 gambar untuk ditampilkan di bagian tentang kami di homepage</p>
              
              {/* Informasi Dasar: Upload 4 gambar (max 4, horizontal scroll) */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Gambar Tentang Kami (Homepage)</label>
                <div className="flex items-center space-x-2 overflow-x-auto pb-2">
                  {[1, 2, 3, 4].map((num) => {
                    const imageKey = `image${num}` as 'image1' | 'image2' | 'image3' | 'image4';
                    const currentImage = aboutUs.images[imageKey];
                    const selectedFile = imageFiles[imageKey];
                    return (
                      (currentImage || selectedFile) ? (
                        <div key={imageKey} className="relative w-24 h-24 rounded-lg overflow-hidden border bg-white flex-shrink-0">
                          <img
                            src={selectedFile ? URL.createObjectURL(selectedFile) : (typeof currentImage === 'string' ? currentImage : '')}
                            alt={`About us ${num}`}
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(imageKey)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors z-10"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ) : null
                    );
                  })}
                  {/* Tombol upload jika jumlah gambar < 4 */}
                  {Array.from({length: 4}).filter((_, i) => {
                    const imageKey = `image${i+1}` as 'image1' | 'image2' | 'image3' | 'image4';
                    return !(aboutUs.images[imageKey] || imageFiles[imageKey]);
                  }).length > 0 && (
                    <label className="w-24 h-24 flex flex-col justify-center items-center text-center border-2 border-dashed border-orange-400 rounded-lg cursor-pointer bg-gray-50 hover:bg-orange-50 flex-shrink-0">
                      <Upload className="w-8 h-8 mb-1 text-orange-400" />
                      <span className="text-xs text-orange-500 font-semibold">Tambahkan Foto ({[1,2,3,4].filter(num => aboutUs.images[`image${num}` as 'image1' | 'image2' | 'image3' | 'image4'] || imageFiles[`image${num}` as 'image1' | 'image2' | 'image3' | 'image4']).length}/4)</span>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files && e.target.files[0] ? e.target.files[0] : null;
                          // Cari slot kosong pertama
                          for (let i = 1; i <= 4; i++) {
                            const key = `image${i}` as 'image1' | 'image2' | 'image3' | 'image4';
                            if (!aboutUs.images[key] && !imageFiles[key]) {
                              handleImageChange(key, file);
                              break;
                            }
                          }
                        }}
                      />
                    </label>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'company' && (
          <>
            {/* Company Information */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Deskripsi Perusahaan</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Deskripsi Perusahaan (untuk halaman /about)
                  </label>
                  <textarea
                    value={aboutUs.companyDescription}
                    onChange={(e) => handleInputChange('companyDescription', e.target.value)}
                    required
                    rows={8}
                    placeholder="Masukkan deskripsi lengkap tentang perusahaan..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-black"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Deskripsi ini akan ditampilkan di halaman "Tentang Kami" (/about)
                  </p>
                </div>
              </div>
            </div>

            {/* Gallery Images */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Galeri Gambar</h2>
              <p className="text-gray-600 mb-6">Upload gambar untuk galeri di halaman "Tentang Kami"</p>
              
              {/* Informasi Tentang Kami: Galeri lingkunganKedai dan spotTempatDuduk (tanpa batasan, horizontal scroll) */}
              {/* Lingkungan Kedai Gallery */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Galeri Lingkungan Kedai</h3>
                <div className="flex items-center space-x-2 overflow-x-auto pb-2">
                  {aboutUs.images.lingkunganKedai.map((image, index) => (
                    <div key={index} className="relative w-24 h-24 rounded-lg overflow-hidden border bg-white flex-shrink-0">
                      <img
                        src={image}
                        alt={`Lingkungan Kedai ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(`lingkunganKedai-${index}`)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors z-10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  {/* Tombol upload selalu ada */}
                  <label className="w-24 h-24 flex flex-col justify-center items-center text-center border-2 border-dashed border-orange-400 rounded-lg cursor-pointer bg-gray-50 hover:bg-orange-50 flex-shrink-0">
                    <Upload className="w-8 h-8 mb-1 text-orange-400" />
                    <span className="text-xs text-orange-500 font-semibold">Tambah Foto</span>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files && e.target.files[0] ? e.target.files[0] : null;
                        if (file) {
                          addGalleryImage('lingkunganKedai', file);
                        }
                      }}
                    />
                  </label>
                </div>
              </div>
              {/* Spot Tempat Duduk Gallery */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Galeri Spot Tempat Duduk</h3>
                <div className="flex items-center space-x-2 overflow-x-auto pb-2">
                  {aboutUs.images.spotTempatDuduk.map((image, index) => (
                    <div key={index} className="relative w-24 h-24 rounded-lg overflow-hidden border bg-white flex-shrink-0">
                      <img
                        src={image}
                        alt={`Spot Tempat Duduk ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(`spotTempatDuduk-${index}`)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors z-10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  {/* Tombol upload selalu ada */}
                  <label className="w-24 h-24 flex flex-col justify-center items-center text-center border-2 border-dashed border-orange-400 rounded-lg cursor-pointer bg-gray-50 hover:bg-orange-50 flex-shrink-0">
                    <Upload className="w-8 h-8 mb-1 text-orange-400" />
                    <span className="text-xs text-orange-500 font-semibold">Tambah Foto</span>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files && e.target.files[0] ? e.target.files[0] : null;
                        if (file) {
                          addGalleryImage('spotTempatDuduk', file);
                        }
                      }}
                    />
                  </label>
                </div>
              </div>
            </div>
          </>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center"
          >
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </div>
      </form>
    </div>
  );
}