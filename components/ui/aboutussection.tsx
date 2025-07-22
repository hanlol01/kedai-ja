'use client';

import { useEffect, useState, useRef } from 'react';
import { ChefHat, Users, Award, Clock, ArrowRight } from 'lucide-react';
import Link from 'next/link';

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

export default function AboutUsSection() {
  const [aboutUs, setAboutUs] = useState<AboutUsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0); // untuk slider mobile
  const [slideDirection, setSlideDirection] = useState<'left' | 'right' | null>(null); // efek transisi
  const autoSlideRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetchAboutUs();
  }, []);

  // Auto slide untuk mobile
  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      if (autoSlideRef.current) clearTimeout(autoSlideRef.current);
      autoSlideRef.current = setTimeout(() => {
        setSlideDirection('right');
        setActiveImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
      }, 5000);
      return function cleanup() {
        if (autoSlideRef.current) clearTimeout(autoSlideRef.current);
      };
    }
  }, [activeImage, aboutUs]);

  const fetchAboutUs = async () => {
    try {
      const response = await fetch('/api/about-us');
      const data = await response.json();
      setAboutUs(data.aboutUs || {
        title: 'About Us',
        subtitle: 'Welcome to Kedai J.A',
        description: 'Kedai J.A adalah destinasi kuliner yang menghadirkan cita rasa autentik Indonesia dengan sentuhan modern. Kami berkomitmen untuk menyajikan hidangan berkualitas tinggi dengan bahan-bahan segar pilihan.',
        secondDescription: 'Dengan pengalaman bertahun-tahun di industri kuliner, kami terus berinovasi untuk memberikan pengalaman dining yang tak terlupakan. Setiap hidangan dibuat dengan penuh cinta dan keahlian oleh chef berpengalaman kami.',
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
      setAboutUs({
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
    }
  };

  if (loading) {
    return (
      <div className="text-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Memuat informasi tentang kami...</p>
      </div>
    );
  }

  if (!aboutUs) return null;

  const images = [
    aboutUs.images.image1,
    aboutUs.images.image2,
    aboutUs.images.image3,
    aboutUs.images.image4
  ].filter(Boolean);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      {/* Title Section (pindah ke atas gambar) */}
      <div className="mb-4 md:mb-0 col-span-1 lg:col-span-2">
        <p className="text-orange-500 font-semibold text-lg mb-2 italic text-center">
          {aboutUs.title}
        </p>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-center">
          {aboutUs.subtitle}
        </h2>
      </div>
      {/* Left Side - Images Grid/Slider */}
      <div>
        {/* Mobile: Slider */}
        <div className="block md:hidden">
          {images.length > 0 ? (
            <div className="relative w-full h-56 overflow-hidden">
              <div
                className={`w-full h-full transition-transform duration-500 ease-in-out ${slideDirection === 'right' ? 'animate-slide-left' : slideDirection === 'left' ? 'animate-slide-right' : ''}`}
                onAnimationEnd={() => setSlideDirection(null)}
              >
                <img
                  src={images[activeImage]}
                  alt={`About us ${activeImage + 1}`}
                  className="w-full h-full object-cover rounded-lg shadow-lg"
                />
              </div>
              {/* Panah kiri */}
              {images.length > 1 && (
                <button
                  onClick={() => {
                    setSlideDirection('left');
                    setActiveImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
                  }}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-40 text-white p-2 rounded-full"
                  aria-label="Sebelumnya"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                </button>
              )}
              {/* Panah kanan */}
              {images.length > 1 && (
                <button
                  onClick={() => {
                    setSlideDirection('right');
                    setActiveImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-40 text-white p-2 rounded-full"
                  aria-label="Selanjutnya"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </button>
              )}
              {/* Dot indicator */}
              {images.length > 1 && (
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-2">
                  {images.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(idx)}
                      className={`w-2 h-2 rounded-full ${idx === activeImage ? 'bg-orange-500' : 'bg-white bg-opacity-60'}`}
                      aria-label={`Pilih gambar ${idx + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="w-full h-56 bg-gradient-to-br from-orange-400 to-red-400 flex items-center justify-center rounded-lg shadow-lg">
              <ChefHat className="h-16 w-16 text-white opacity-80" />
            </div>
          )}
        </div>
        {/* Desktop: Grid 2x2 */}
        <div className="hidden md:grid grid-cols-2 grid-rows-2 gap-4">
          {[0,1,2,3].map((idx) => (
            <div key={idx} className="h-48 rounded-lg overflow-hidden shadow-lg bg-white flex items-center justify-center">
              {images[idx] ? (
                <img
                  src={images[idx]}
                  alt={`About us ${idx+1}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-orange-400 to-red-400 flex items-center justify-center">
                  <ChefHat className="h-16 w-16 text-white opacity-80" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      {/* Right Side - Content */}
      <div className="space-y-6">
        {/* Description */}
        <div className="space-y-4">
          <p className="text-gray-600 leading-relaxed text-justify">
            {aboutUs.description}
          </p>
          <p className="text-gray-600 leading-relaxed text-justify">
            {aboutUs.secondDescription}
          </p>
        </div>

        {/* Statistics */}
        <div className="flex items-center space-x-8 py-6">
          <div className="flex items-center space-x-3">
            <div className="text-4xl font-bold text-orange-500 border-l-4 border-orange-500 pl-4">
              {aboutUs.yearsOfExperience}
            </div>
            <div>
              <p className=" font-semibold text-gray-900 uppercase tracking-wide">Tahun kami</p>
              <p className=" text-sm text-gray-500 uppercase tracking-wide">Berdiri</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="text-4xl font-bold text-orange-500 border-l-4 border-orange-500 pl-4">
              {aboutUs.masterChefs}
            </div>
            <div>
              <p className=" font-semibold text-gray-900 uppercase tracking-wide">Spot Outdoor</p>
              <p className=" text-sm text-gray-500 uppercase tracking-wide">Menikmati Hidangan</p>
            </div>
          </div>
        </div>

        {/* Read More Button */}
        <div className="flex md:block justify-center md:justify-start">
          <Link href="/about">
            <button className="bg-orange-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors duration-200 uppercase tracking-wide flex items-center gap-2">
              Lihat Selengkapnya
              <ArrowRight className="w-5 h-5" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}