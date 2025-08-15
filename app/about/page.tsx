'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChefHat, Heart, Users, Award, ArrowLeft } from 'lucide-react';
import MainLayout from '@/components/ui/MainLayout';

interface AboutUsData {
  title: string;
  subtitle: string;
  companyDescription: string;
  yearsOfExperience: number;
  masterChefs: number;
  images: {
    lingkunganKedai: string[];
    spotTempatDuduk: string[];
  };
}

interface SelectedImage {
  src: string;
  alt: string;
  title: string;
}

export default function About() {
  const [aboutUs, setAboutUs] = useState<AboutUsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState({
    lingkungan: 0,
    spot: 0
  });
  const [selectedImage, setSelectedImage] = useState<SelectedImage | null>(null);

  useEffect(() => {
    fetchAboutUs();
  }, []);

  useEffect(() => {
    // Auto slide untuk galeri
    const interval = setInterval(() => {
      if (aboutUs?.images.lingkunganKedai && aboutUs.images.lingkunganKedai.length > 0) {
        setCurrentSlide(prev => ({
          ...prev,
          lingkungan: (prev.lingkungan + 1) % aboutUs.images.lingkunganKedai.length
        }));
      }
      if (aboutUs?.images.spotTempatDuduk && aboutUs.images.spotTempatDuduk.length > 0) {
        setCurrentSlide(prev => ({
          ...prev,
          spot: (prev.spot + 1) % aboutUs.images.spotTempatDuduk.length
        }));
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [aboutUs]);

  const fetchAboutUs = async () => {
    // Default cepat agar UI segera tampil
    const defaultAbout: AboutUsData = {
      title: 'About Us',
      subtitle: 'Welcome to Kedai J.A',
      companyDescription: 'Kedai J.A adalah destinasi kuliner yang menghadirkan cita rasa autentik Indonesia dengan sentuhan modern.',
      yearsOfExperience: 7,
      masterChefs: 25,
      images: {
        lingkunganKedai: [],
        spotTempatDuduk: []
      }
    };

    setAboutUs(defaultAbout);

    try {
      const fetchWithTimeout = (url: string, timeout = 1500) => {
        return Promise.race([
          fetch(url),
          new Promise<Response>((_, reject) =>
            setTimeout(() => reject(new Error('Timeout')), timeout)
          )
        ]);
      };

      const response = await fetchWithTimeout('/api/about-us');
      const data = await response.json();
      if (data?.aboutUs) {
        setAboutUs(data.aboutUs);
      }
    } catch (error) {
      console.warn('About page: using default about data due to timeout/error');
    } finally {
      setTimeout(() => setLoading(false), 800);
    }
  };

  const nextSlide = (type: 'lingkungan' | 'spot') => {
    if (type === 'lingkungan' && aboutUs?.images.lingkunganKedai && aboutUs.images.lingkunganKedai.length > 0) {
      setCurrentSlide(prev => ({
        ...prev,
        lingkungan: (prev.lingkungan + 1) % aboutUs.images.lingkunganKedai.length
      }));
    } else if (type === 'spot' && aboutUs?.images.spotTempatDuduk && aboutUs.images.spotTempatDuduk.length > 0) {
      setCurrentSlide(prev => ({
        ...prev,
        spot: (prev.spot + 1) % aboutUs.images.spotTempatDuduk.length
      }));
    }
  };

  const prevSlide = (type: 'lingkungan' | 'spot') => {
    if (type === 'lingkungan' && aboutUs?.images.lingkunganKedai && aboutUs.images.lingkunganKedai.length > 0) {
      setCurrentSlide(prev => ({
        ...prev,
        lingkungan: prev.lingkungan === 0 ? aboutUs.images.lingkunganKedai.length - 1 : prev.lingkungan - 1
      }));
    } else if (type === 'spot' && aboutUs?.images.spotTempatDuduk && aboutUs.images.spotTempatDuduk.length > 0) {
      setCurrentSlide(prev => ({
        ...prev,
        spot: prev.spot === 0 ? aboutUs.images.spotTempatDuduk.length - 1 : prev.spot - 1
      }));
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="relative mx-auto">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-200/20 border-t-primary-500 mx-auto"></div>
              <div className="absolute inset-0 rounded-full h-16 w-16 border-4 border-transparent border-t-secondary-400/50 animate-pulse mx-auto"></div>
            </div>
            <p className="mt-6 text-gray-300">Memuat informasi tentang kami...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container-fluid py-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="heading-primary text-5xl md:text-6xl lg:text-7xl text-white mb-6">
            {aboutUs?.title}
          </h1>
          <p className="heading-secondary text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            {aboutUs?.subtitle}
          </p>
        </div>

        {/* Company Description */}
        <div className="mb-16">
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl shadow-lg p-8 md:p-12">
            <h2 className="heading-secondary text-3xl font-bold text-white mb-6 text-center">Cerita Kami</h2>
            <div className="prose prose-lg max-w-none text-white leading-relaxed text-justify">
              {aboutUs?.companyDescription.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-4">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="mb-16">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Tahun Berdiri */}
            <div className="flex-1 bg-gradient-to-br from-primary-600 to-primary-800 border border-primary-700/50 rounded-xl p-8 text-white flex flex-col items-center shadow-xl hover:shadow-primary-500/20 hover:-translate-y-1 transition-all duration-300">
              <div className="relative mb-2">
                <div className="absolute inset-0 rounded-full bg-primary-400 blur-xl opacity-20 animate-pulse-soft"></div>
                <div className="text-5xl font-bold relative">{aboutUs?.yearsOfExperience}</div>
              </div>
              <div className="text-xl font-semibold mb-4">Tahun Berdiri</div>
              <p className="text-center text-white text-base">Kedai J.A berdiri sejak tahun {aboutUs?.yearsOfExperience}. Berawal dari kecintaan terhadap kuliner nusantara, kami berkomitmen melestarikan warisan resep turun-temurun dan menghadirkan pengalaman makan yang hangat serta penuh makna bagi setiap pelanggan.</p>
            </div>
            
            {/* Spot Tempat Duduk */}
            <div className="flex-1 bg-gradient-to-br from-secondary-600 to-secondary-800 border border-secondary-700/50 rounded-xl p-8 text-white flex flex-col items-center shadow-xl hover:shadow-secondary-500/20 hover:-translate-y-1 transition-all duration-300">
              <div className="relative mb-2">
                <div className="absolute inset-0 rounded-full bg-secondary-400 blur-xl opacity-20 animate-pulse-soft"></div>
                <div className="text-5xl font-bold relative">{aboutUs?.masterChefs}</div>
              </div>
              <div className="text-xl font-semibold mb-4">Spot Tempat Duduk</div>
              <p className="text-center text-white text-base">Tersedia banyak spot tempat duduk outdoor yang nyaman dan asri, cocok untuk bersantai bersama keluarga, teman, atau sekadar menikmati suasana. Setiap sudut Kedai J.A dirancang agar Anda bisa merasakan kehangatan dan ketenangan di alam terbuka.</p>
            </div>
          </div>
        </div>

        {/* Image Galleries */}
        <div className="space-y-12 mb-16">
          {/* Lingkungan Kedai Gallery */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-700/50">
              <h3 className="text-2xl font-bold text-white text-center">Lingkungan Kedai</h3>
            </div>
            <div className="relative h-96 md:h-[500px] lg:h-[600px]">
              {aboutUs?.images.lingkunganKedai && aboutUs.images.lingkunganKedai.length > 0 ? (
                <>
                  <img
                    src={aboutUs.images.lingkunganKedai[currentSlide.lingkungan]}
                    alt={`Lingkungan Kedai ${currentSlide.lingkungan + 1}`}
                    className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                    onClick={() => setSelectedImage({
                      src: aboutUs.images.lingkunganKedai[currentSlide.lingkungan],
                      alt: `Lingkungan Kedai ${currentSlide.lingkungan + 1}`,
                      title: 'Lingkungan Kedai'
                    })}
                  />
                  {aboutUs.images.lingkunganKedai.length > 1 && (
                    <>
                      <button
                        onClick={() => prevSlide('lingkungan')}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <button
                        onClick={() => nextSlide('lingkungan')}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                        {aboutUs.images.lingkunganKedai.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentSlide(prev => ({ ...prev, lingkungan: index }))}
                            className={`w-3 h-3 rounded-full transition-all ${
                              index === currentSlide.lingkungan ? 'bg-white' : 'bg-white bg-opacity-50'
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                  {/* Click to preview overlay */}
                  <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                    Klik untuk preview
                  </div>
                </>
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center">
                  <div className="text-center text-white">
                    <ChefHat className="h-16 w-16 mx-auto mb-4 opacity-80 animate-float" />
                    <p className="text-lg">Galeri Lingkungan Kedai</p>
                    <p className="text-sm opacity-80">Segera hadir</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Spot Tempat Duduk Gallery */}
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-700/50">
              <h3 className="text-2xl font-bold text-white text-center">Spot Tempat Duduk</h3>
            </div>
            <div className="relative h-96 md:h-[500px] lg:h-[600px]">
              {aboutUs?.images.spotTempatDuduk && aboutUs.images.spotTempatDuduk.length > 0 ? (
                <>
                  <img
                    src={aboutUs.images.spotTempatDuduk[currentSlide.spot]}
                    alt={`Spot Tempat Duduk ${currentSlide.spot + 1}`}
                    className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                    onClick={() => setSelectedImage({
                      src: aboutUs.images.spotTempatDuduk[currentSlide.spot],
                      alt: `Spot Tempat Duduk ${currentSlide.spot + 1}`,
                      title: 'Spot Tempat Duduk'
                    })}
                  />
                  {aboutUs.images.spotTempatDuduk.length > 1 && (
                    <>
                      <button
                        onClick={() => prevSlide('spot')}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <button
                        onClick={() => nextSlide('spot')}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                        {aboutUs.images.spotTempatDuduk.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentSlide(prev => ({ ...prev, spot: index }))}
                            className={`w-3 h-3 rounded-full transition-all ${
                              index === currentSlide.spot ? 'bg-white' : 'bg-white bg-opacity-50'
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                  {/* Click to preview overlay */}
                  <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                    Klik untuk preview
                  </div>
                </>
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-secondary-600 to-secondary-800 flex items-center justify-center">
                  <div className="text-center text-white">
                    <Users className="h-16 w-16 mx-auto mb-4 opacity-80 animate-float" />
                    <p className="text-lg">Galeri Spot Tempat Duduk</p>
                    <p className="text-sm opacity-80">Segera hadir</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Image Preview Modal */}
        {selectedImage && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <div className="relative max-w-4xl max-h-full">
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors duration-200"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div className="bg-white rounded-lg overflow-hidden shadow-2xl">
                <div className="p-4 bg-gray-100 border-b">
                  <h3 className="text-lg font-semibold text-gray-800">{selectedImage.title}</h3>
                </div>
                <img
                  src={selectedImage.src}
                  alt={selectedImage.alt}
                  className="w-full h-auto max-h-[80vh] object-contain"
                />
              </div>
            </div>
          </div>
        )}

        {/* Values Section */}
        <div className="mb-16">
          <h2 className="heading-primary text-4xl font-bold text-white text-center mb-12">Nilai-Nilai Kami</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 p-8 rounded-xl shadow-lg hover:-translate-y-2 hover:shadow-xl transition-all duration-300 group">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-primary-500/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="bg-primary-900/70 rounded-xl w-20 h-20 flex items-center justify-center mx-auto relative border border-primary-700/50 group-hover:scale-110 transition-transform duration-300">
                  <ChefHat className="h-10 w-10 text-primary-400 group-hover:text-primary-300 transition-colors duration-300" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-primary-300 transition-colors duration-300">Autentisitas</h3>
              <p className="text-gray-300">
                Mempertahankan keaslian resep dan cita rasa tradisional Indonesia
              </p>
            </div>

            <div className="text-center bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 p-8 rounded-xl shadow-lg hover:-translate-y-2 hover:shadow-xl transition-all duration-300 group">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-secondary-500/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="bg-secondary-900/70 rounded-xl w-20 h-20 flex items-center justify-center mx-auto relative border border-secondary-700/50 group-hover:scale-110 transition-transform duration-300">
                  <Heart className="h-10 w-10 text-secondary-400 group-hover:text-secondary-300 transition-colors duration-300" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-secondary-300 transition-colors duration-300">Keramahan</h3>
              <p className="text-gray-300">
                Melayani setiap pelanggan dengan kehangatan dan keramahan keluarga
              </p>
            </div>

            <div className="text-center bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 p-8 rounded-xl shadow-lg hover:-translate-y-2 hover:shadow-xl transition-all duration-300 group">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="bg-blue-900/70 rounded-xl w-20 h-20 flex items-center justify-center mx-auto relative border border-blue-700/50 group-hover:scale-110 transition-transform duration-300">
                  <Users className="h-10 w-10 text-blue-400 group-hover:text-blue-300 transition-colors duration-300" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-blue-300 transition-colors duration-300">Komunitas</h3>
              <p className="text-gray-300">
                Menjadi bagian dari komunitas lokal dan mendukung pertumbuhan bersama
              </p>
            </div>

            <div className="text-center bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 p-8 rounded-xl shadow-lg hover:-translate-y-2 hover:shadow-xl transition-all duration-300 group">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-green-500/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="bg-green-900/70 rounded-xl w-20 h-20 flex items-center justify-center mx-auto relative border border-green-700/50 group-hover:scale-110 transition-transform duration-300">
                  <Award className="h-10 w-10 text-green-400 group-hover:text-green-300 transition-colors duration-300" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-green-300 transition-colors duration-300">Kualitas</h3>
              <p className="text-gray-300">
                Komitmen pada kualitas terbaik dalam setiap aspek pengalaman kuliner
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}