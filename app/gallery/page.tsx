'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, X, Camera, Play } from 'lucide-react';
import MainLayout from '@/components/ui/MainLayout';
import AOS from 'aos';

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

export default function GalleryPage() {
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [filteredGallery, setFilteredGallery] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'image' | 'video'>('all');
  // Removed complex video state management - using simple HTML5 video controls now

  // Fetch gallery data with timeout
  const fetchWithTimeout = (url: string, timeout: number = 1500) => {
    return Promise.race([
      fetch(url),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Timeout')), timeout)
      )
    ]);
  };

  const fetchGallery = async () => {
    try {
      setLoading(true);
      const response = await fetchWithTimeout('/api/gallery');
      if (response.ok) {
        const data = await response.json();
        // Filter hanya item yang aktif
        const activeItems = data.filter((item: GalleryItem) => item.isActive);
        setGallery(activeItems);
        setFilteredGallery(activeItems);
      } else {
        console.error('Failed to fetch gallery');
        setGallery([]);
        setFilteredGallery([]);
      }
    } catch (error) {
      console.error('Error fetching gallery:', error);
      setGallery([]);
      setFilteredGallery([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true,
      mirror: false,
    });

    fetchGallery();
  }, []);

  // Filter function
  const handleFilter = (filterType: 'all' | 'image' | 'video') => {
    setActiveFilter(filterType);
    
    if (filterType === 'all') {
      setFilteredGallery(gallery);
    } else {
      const filtered = gallery.filter(item => item.fileType === filterType);
      setFilteredGallery(filtered);
    }
    
    // Reset selected image when filter changes
    setSelectedImage(null);
  };

  // Update filtered gallery when gallery data changes
  useEffect(() => {
    handleFilter(activeFilter);
  }, [gallery, activeFilter]);

  // Simplified video handling - using native HTML5 video controls

  const openImageModal = (index: number) => {
    setSelectedImage(index);
    document.body.style.overflow = 'hidden';
  };

  const closeImageModal = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'unset';
  };

  const navigateImage = (direction: 'prev' | 'next') => {
    if (selectedImage === null) return;
    
    if (direction === 'prev') {
        setSelectedImage(selectedImage === 0 ? filteredGallery.length - 1 : selectedImage - 1);
    } else {
        setSelectedImage(selectedImage === filteredGallery.length - 1 ? 0 : selectedImage + 1);
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (selectedImage === null) return;
    
    if (e.key === 'Escape') closeImageModal();
    if (e.key === 'ArrowLeft') navigateImage('prev');
    if (e.key === 'ArrowRight') navigateImage('next');
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage]);

  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-200/20 border-t-primary-500 mx-auto"></div>
              <div className="absolute inset-0 rounded-full h-16 w-16 border-4 border-transparent border-t-secondary-400/50 animate-pulse mx-auto"></div>
            </div>
            <div className="mt-6 space-y-2">
              <p className="text-lg font-medium text-white">Memuat gallery...</p>
              <p className="text-sm text-gray-300">Menyiapkan galeri foto untuk Anda</p>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen py-24">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-16" data-aos="fade-up">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-primary-400 via-secondary-400 to-primary-600 bg-clip-text text-transparent">
                Gallery Kedai J.A
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-8">
              Jelajahi koleksi foto dan video terbaik dari Kedai J.A. Lihat suasana restoran, hidangan lezat, dan momen-momen spesial bersama kami.
            </p>
            
            {/* Filter badges */}
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => handleFilter('all')}
                className={`backdrop-blur-md border rounded-full px-4 py-2 text-sm transition-all duration-300 hover:scale-105 ${
                  activeFilter === 'all'
                    ? 'bg-primary-500/30 border-primary-400/50 text-primary-200'
                    : 'bg-white/10 border-white/20 text-gray-300 hover:bg-white/20'
                }`}
              >
                ✨ {gallery.length} Semua
              </button>
              <button
                onClick={() => handleFilter('image')}
                className={`backdrop-blur-md border rounded-full px-4 py-2 text-sm transition-all duration-300 hover:scale-105 ${
                  activeFilter === 'image'
                    ? 'bg-blue-500/30 border-blue-400/50 text-blue-200'
                    : 'bg-white/10 border-white/20 text-gray-300 hover:bg-white/20'
                }`}
              >
                📸 {gallery.filter(item => item.fileType === 'image').length} Foto
              </button>
              <button
                onClick={() => handleFilter('video')}
                className={`backdrop-blur-md border rounded-full px-4 py-2 text-sm transition-all duration-300 hover:scale-105 ${
                  activeFilter === 'video'
                    ? 'bg-red-500/30 border-red-400/50 text-red-200'
                    : 'bg-white/10 border-white/20 text-gray-300 hover:bg-white/20'
                }`}
              >
                🎥 {gallery.filter(item => item.fileType === 'video').length} Video
              </button>
            </div>
          </div>

          {filteredGallery.length === 0 ? (
            <div className="text-center py-20" data-aos="fade-up" data-aos-delay="200">
              <Camera className="h-32 w-32 text-gray-400 mx-auto mb-6" />
              <h3 className="text-2xl font-semibold text-white mb-4">
                {gallery.length === 0 ? 'Gallery Sedang Dipersiapkan' : 'Tidak Ada Media Ditemukan'}
              </h3>
              <p className="text-gray-400 text-lg max-w-md mx-auto">
                {gallery.length === 0 
                  ? 'Kami sedang menyiapkan koleksi foto terbaik untuk Anda. Silakan kembali lagi nanti.'
                  : `Tidak ada ${activeFilter === 'image' ? 'foto' : activeFilter === 'video' ? 'video' : 'media'} yang ditemukan. Coba filter lain.`
                }
              </p>
            </div>
          ) : (
            <>
              {/* Gallery Grid - Masonry Layout */}
              <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
                {filteredGallery.map((item, index) => {
                  // Random height untuk masonry effect
                  const heights = ['aspect-square', 'aspect-[4/5]', 'aspect-[3/4]', 'aspect-[5/4]'];
                  const randomHeight = heights[index % heights.length];
                  
                  return (
                  <div
                    key={item._id}
                      className="group cursor-pointer break-inside-avoid mb-6"
                    data-aos="fade-up"
                      data-aos-delay={(index * 50) % 400}
                    onClick={() => openImageModal(index)}
                  >
                      <div className={`relative ${randomHeight} overflow-hidden rounded-3xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl border border-white/10 shadow-2xl hover:shadow-primary-500/20 transition-all duration-700 hover:scale-[1.02] hover:border-primary-400/30`}>
                        {item.fileType === 'image' ? (
                      <img
                            src={item.fileUrl}
                        alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        loading="lazy"
                      />
                                                ) : (
                          <div className="et_pb_module et_pb_video et_pb_video_0 w-full h-full">
                            <div className="et_pb_video_box w-full h-full">
                              <video
                                controls
                                className="w-full h-full object-cover rounded-xl"
                                preload="metadata"
                                playsInline
                                poster=""
                              >
                                <source type={item.mimeType || 'video/mp4'} src={item.fileUrl} />
                                Browser Anda tidak mendukung video HTML5.
                              </video>
                            </div>
                          </div>
                        )}
                        
                                                {/* Enhanced gradient overlay - only for images */}
                        {item.fileType === 'image' && (
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
                        )}
                        
                        {/* Enhanced content overlay - only show for images */}
                        {item.fileType === 'image' && (
                          <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-8 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                            <div className="space-y-2">
                              <h3 className="text-lg font-bold tracking-wide">{item.title}</h3>
                              {item.description && (
                                <p className="text-sm text-gray-200 line-clamp-2 leading-relaxed">
                                  {item.description}
                                </p>
                              )}
                              <div className="flex items-center justify-between pt-2">
                                <span className="text-xs text-primary-300 font-medium">
                                  {item.fileType === 'image' ? 'Foto' : 'Video'}
                                </span>
                                <div className="flex items-center space-x-2">
                                  <div className="w-2 h-2 bg-primary-400 rounded-full animate-pulse"></div>
                                  <span className="text-xs text-gray-300">
                                    {new Date(item.createdAt).toLocaleDateString('id-ID')}
                                  </span>
                        </div>
                      </div>
                    </div>
                  </div>
                        )}
                        
                        {/* Floating action button - only for images */}
                        {item.fileType === 'image' && (
                          <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-y-2 group-hover:translate-y-0">
                            <div className="bg-primary-500/80 backdrop-blur-md text-white p-2 rounded-full shadow-lg">
                              <Camera className="h-4 w-4" />
                            </div>
                          </div>
                        )}
                        
                        {/* Glow effect on hover */}
                        <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-primary-500/20 via-secondary-500/20 to-primary-500/20 blur-xl"></div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Image Modal */}
              {selectedImage !== null && (
                <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
                  {/* Close button */}
                  <button
                    onClick={closeImageModal}
                    className="absolute top-6 right-6 bg-white/20 backdrop-blur-md text-white p-3 rounded-full hover:bg-white/30 transition-colors duration-200 z-10"
                  >
                    <X className="h-6 w-6" />
                  </button>

                  {/* Navigation buttons */}
                  {filteredGallery.length > 1 && (
                    <>
                      <button
                        onClick={() => navigateImage('prev')}
                        className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md text-white p-3 rounded-full hover:bg-white/30 transition-colors duration-200 z-10"
                      >
                        <ArrowLeft className="h-6 w-6" />
                      </button>
                      <button
                        onClick={() => navigateImage('next')}
                        className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md text-white p-3 rounded-full hover:bg-white/30 transition-colors duration-200 z-10"
                      >
                        <ArrowRight className="h-6 w-6" />
                      </button>
                    </>
                  )}

                  {/* Image counter */}
                  {filteredGallery.length > 1 && (
                    <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-medium">
                      {selectedImage + 1} / {filteredGallery.length}
                    </div>
                  )}

                  {/* Main media */}
                  <div className="max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center">
                    <div className="relative">
                      {filteredGallery[selectedImage].fileType === 'image' ? (
                      <img
                          src={filteredGallery[selectedImage].fileUrl}
                          alt={filteredGallery[selectedImage].title}
                        className="max-w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl"
                        style={{ maxWidth: '100%', maxHeight: '80vh' }}
                      />
                      ) : (
                        <div className="et_pb_module et_pb_video et_pb_video_0 max-w-full max-h-[80vh]">
                          <div className="et_pb_video_box">
                            <video
                              controls
                              autoPlay
                              muted={false}
                              playsInline
                              className="modal-video max-w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl"
                              style={{ maxWidth: '100%', maxHeight: '80vh' }}
                              onLoadedData={(e) => {
                                const video = e.target as HTMLVideoElement;
                                video.play().catch(console.error);
                              }}
                              onPlay={() => {
                                // Pause all other videos when modal video plays
                                document.querySelectorAll('video').forEach(v => {
                                  if (v !== document.querySelector('.modal-video')) {
                                    v.pause();
                                  }
                                });
                              }}
                            >
                              <source 
                                type={filteredGallery[selectedImage].mimeType || 'video/mp4'} 
                                src={filteredGallery[selectedImage].fileUrl} 
                              />
                              Browser Anda tidak mendukung video HTML5.
                            </video>
                          </div>
                        </div>
                      )}
                      
                      {/* Media info */}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 rounded-b-2xl">
                        <h3 className="text-2xl font-bold text-white mb-2">
                          {filteredGallery[selectedImage].title}
                        </h3>
                        {filteredGallery[selectedImage].description && (
                          <p className="text-gray-200 text-lg">
                            {filteredGallery[selectedImage].description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Click outside to close */}
                  <div
                    className="absolute inset-0 -z-10"
                    onClick={closeImageModal}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </MainLayout>
  );
}