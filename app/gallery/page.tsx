'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, X, Camera } from 'lucide-react';
import MainLayout from '@/components/ui/MainLayout';
import AOS from 'aos';

interface GalleryItem {
  _id: string;
  title: string;
  description?: string;
  image: string;
  isActive: boolean;
  createdAt: string;
}

export default function GalleryPage() {
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

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
        setGallery(data);
      } else {
        console.error('Failed to fetch gallery');
        setGallery([]);
      }
    } catch (error) {
      console.error('Error fetching gallery:', error);
      setGallery([]);
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
      setSelectedImage(selectedImage === 0 ? gallery.length - 1 : selectedImage - 1);
    } else {
      setSelectedImage(selectedImage === gallery.length - 1 ? 0 : selectedImage + 1);
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
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Jelajahi koleksi foto terbaik dari Kedai J.A. Lihat suasana restoran, hidangan lezat, dan momen-momen spesial bersama kami.
            </p>
          </div>

          {gallery.length === 0 ? (
            <div className="text-center py-20" data-aos="fade-up" data-aos-delay="200">
              <Camera className="h-32 w-32 text-gray-400 mx-auto mb-6" />
              <h3 className="text-2xl font-semibold text-white mb-4">Gallery Sedang Dipersiapkan</h3>
              <p className="text-gray-400 text-lg max-w-md mx-auto">
                Kami sedang menyiapkan koleksi foto terbaik untuk Anda. Silakan kembali lagi nanti.
              </p>
            </div>
          ) : (
            <>
              {/* Gallery Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {gallery.map((item, index) => (
                  <div
                    key={item._id}
                    className="group cursor-pointer"
                    data-aos="fade-up"
                    data-aos-delay={index * 100}
                    onClick={() => openImageModal(index)}
                  >
                    <div className="relative aspect-square overflow-hidden rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                        {item.description && (
                          <p className="text-sm text-gray-200 line-clamp-2">{item.description}</p>
                        )}
                      </div>
                      {/* Hover overlay icon */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="bg-white/20 backdrop-blur-md rounded-full p-4">
                          <Camera className="h-8 w-8 text-white" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
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
                  {gallery.length > 1 && (
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
                  {gallery.length > 1 && (
                    <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-medium">
                      {selectedImage + 1} / {gallery.length}
                    </div>
                  )}

                  {/* Main image */}
                  <div className="max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center">
                    <div className="relative">
                      <img
                        src={gallery[selectedImage].image}
                        alt={gallery[selectedImage].title}
                        className="max-w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl"
                        style={{ maxWidth: '100%', maxHeight: '80vh' }}
                      />
                      
                      {/* Image info */}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 rounded-b-2xl">
                        <h3 className="text-2xl font-bold text-white mb-2">
                          {gallery[selectedImage].title}
                        </h3>
                        {gallery[selectedImage].description && (
                          <p className="text-gray-200 text-lg">
                            {gallery[selectedImage].description}
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