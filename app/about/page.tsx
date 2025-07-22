'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChefHat, Heart, Users, Award, ArrowLeft } from 'lucide-react';
import Footer from '@/components/ui/Footer';

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

export default function About() {
  const [aboutUs, setAboutUs] = useState<AboutUsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState({
    lingkungan: 0,
    spot: 0
  });

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
    try {
      const response = await fetch('/api/about-us');
      const data = await response.json();
      setAboutUs(data.aboutUs || {
        title: 'About Us',
        subtitle: 'Welcome to Kedai J.A',
        companyDescription: 'Kedai J.A adalah destinasi kuliner yang menghadirkan cita rasa autentik Indonesia dengan sentuhan modern.',
        yearsOfExperience: 7,
        masterChefs: 25,
        images: {
          lingkunganKedai: [],
          spotTempatDuduk: []
        }
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching about us:', error);
      setAboutUs({
        title: 'About Us',
        subtitle: 'Welcome to Kedai J.A',
        companyDescription: 'Kedai J.A adalah destinasi kuliner yang menghadirkan cita rasa autentik Indonesia dengan sentuhan modern.',
        yearsOfExperience: 7,
        masterChefs: 25,
        images: {
          lingkunganKedai: [],
          spotTempatDuduk: []
        }
      });
      setLoading(false);
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat informasi tentang kami...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center text-gray-600 hover:text-orange-500 transition-colors duration-200"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Kembali ke Home
            </Link>
            <div className="flex items-center">
              <ChefHat className="h-8 w-8 text-orange-500 mr-2" />
              <span className="text-xl font-bold text-gray-900">{aboutUs?.title}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {aboutUs?.title}
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            {aboutUs?.subtitle}
          </p>
        </div>

        {/* Company Description */}
        <div className="mb-16">
          <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Cerita Kami</h2>
            <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed text-justify">
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
            <div className="flex-1 bg-gradient-to-br from-orange-400 to-red-400 rounded-xl p-8 text-white flex flex-col items-center shadow-md">
              <div className="text-5xl font-bold mb-2">{aboutUs?.yearsOfExperience}</div>
              <div className="text-xl font-semibold mb-2">Tahun Berdiri</div>
              <p className="text-center text-white/90 text-base">Kedai J.A berdiri sejak tahun {aboutUs?.yearsOfExperience}. Berawal dari kecintaan terhadap kuliner nusantara, kami berkomitmen melestarikan warisan resep turun-temurun dan menghadirkan pengalaman makan yang hangat serta penuh makna bagi setiap pelanggan.</p>
            </div>
            {/* Spot Tempat Duduk */}
            <div className="flex-1 bg-gradient-to-br from-orange-400 to-pink-400 rounded-xl p-8 text-white flex flex-col items-center shadow-md">
              <div className="text-5xl font-bold mb-2">{aboutUs?.masterChefs}</div>
              <div className="text-xl font-semibold mb-2">Spot Tempat Duduk</div>
              <p className="text-center text-white/90 text-base">Tersedia banyak spot tempat duduk outdoor yang nyaman dan asri, cocok untuk bersantai bersama keluarga, teman, atau sekadar menikmati suasana. Setiap sudut Kedai J.A dirancang agar Anda bisa merasakan kehangatan dan ketenangan di alam terbuka.</p>
            </div>
          </div>
        </div>

        {/* Image Galleries */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Lingkungan Kedai Gallery */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 text-center">Lingkungan Kedai</h3>
            </div>
            <div className="relative h-80">
              {aboutUs?.images.lingkunganKedai && aboutUs.images.lingkunganKedai.length > 0 ? (
                <>
                  <img
                    src={aboutUs.images.lingkunganKedai[currentSlide.lingkungan]}
                    alt={`Lingkungan Kedai ${currentSlide.lingkungan + 1}`}
                    className="w-full h-full object-cover"
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
                </>
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-orange-400 to-red-400 flex items-center justify-center">
                  <div className="text-center text-white">
                    <ChefHat className="h-16 w-16 mx-auto mb-4 opacity-80" />
                    <p className="text-lg">Galeri Lingkungan Kedai</p>
                    <p className="text-sm opacity-80">Segera hadir</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Spot Tempat Duduk Gallery */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 text-center">Spot Tempat Duduk</h3>
            </div>
            <div className="relative h-80">
              {aboutUs?.images.spotTempatDuduk && aboutUs.images.spotTempatDuduk.length > 0 ? (
                <>
                  <img
                    src={aboutUs.images.spotTempatDuduk[currentSlide.spot]}
                    alt={`Spot Tempat Duduk ${currentSlide.spot + 1}`}
                    className="w-full h-full object-cover"
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
                </>
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center">
                  <div className="text-center text-white">
                    <Users className="h-16 w-16 mx-auto mb-4 opacity-80" />
                    <p className="text-lg">Galeri Spot Tempat Duduk</p>
                    <p className="text-sm opacity-80">Segera hadir</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Nilai-Nilai Kami</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center bg-white p-6 rounded-lg shadow-md">
              <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <ChefHat className="h-8 w-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Autentisitas</h3>
              <p className="text-gray-600">
                Mempertahankan keaslian resep dan cita rasa tradisional Indonesia
              </p>
            </div>

            <div className="text-center bg-white p-6 rounded-lg shadow-md">
              <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Keramahan</h3>
              <p className="text-gray-600">
                Melayani setiap pelanggan dengan kehangatan dan keramahan keluarga
              </p>
            </div>

            <div className="text-center bg-white p-6 rounded-lg shadow-md">
              <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Komunitas</h3>
              <p className="text-gray-600">
                Menjadi bagian dari komunitas lokal dan mendukung pertumbuhan bersama
              </p>
            </div>

            <div className="text-center bg-white p-6 rounded-lg shadow-md">
              <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Kualitas</h3>
              <p className="text-gray-600">
                Komitmen pada kualitas terbaik dalam setiap aspek pengalaman kuliner
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}