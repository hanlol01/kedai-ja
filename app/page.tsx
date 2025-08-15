'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChefHat, Star, Clock, MapPin, Phone, ArrowRight, ShoppingCart, Headphones, Utensils, User, Camera } from 'lucide-react';
import AboutUsSection from '@/components/ui/aboutussection';
import MainLayout from '@/components/ui/MainLayout';
import MediaCarousel from '@/components/ui/MediaCarousel';
import AOS from 'aos';
import 'aos/dist/aos.css';

type MenuItem = {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: 'Makanan' | 'Minuman';
  image?: string;
  available: boolean;
  isBestSeller?: boolean;
};

interface Settings {
  restaurantName: string;
  description: string;
  address: string;
  contact: string;
  hours: string;
  email: string;
}

// Testimonial type
interface Testimonial {
  _id: string;
  name: string;
  rating: number;
  message: string;
  createdAt: string;
}

export default function Home() {
  const [bestSellerItems, setBestSellerItems] = useState<MenuItem[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Data media untuk carousel
  const restoMedia = [
    {
      type: 'image' as const,
      src: '/resto1.JPG',
      alt: 'RestoOutdoor 1',
      fallbackSrc: '/hero-bg.jpg'
    },
    {
      type: 'image' as const,
      src: '/resto2.JPG',
      alt: 'RestoOutdoor 2',
      fallbackSrc: '/hero-bg.jpg'
    },
    {
      type: 'image' as const,
      src: '/resto3.JPG',
      alt: 'RestoOutdoor 3',
      fallbackSrc: '/hero-bg.jpg'
    },
    {
      type: 'image' as const,
      src: '/resto4.jpg',
      alt: 'RestoOutdoor 4',
      fallbackSrc: '/hero-bg.jpg'
    },
    {
      type: 'image' as const,
      src: '/resto5.jpg',
      alt: 'RestoOutdoor 5',
      fallbackSrc: '/hero-bg.jpg'
    },
    // Tambahkan video jika ada
    // {
    //   type: 'video' as const,
    //   src: '/resto-preview.mp4',
    //   alt: 'Resto Video Preview'
    // }
  ];

  const venueMedia = [
    {
      type: 'image' as const,
      src: '/wedding1.jpg',
      alt: 'Acara Wedding 1',
      fallbackSrc: '/hero-bg(3).jpg'
    },
    {
      type: 'image' as const,
      src: '/wedding2.jpg',
      alt: 'Acara Wedding 2',
      fallbackSrc: '/hero-bg(3).jpg'
    },
    {
      type: 'image' as const,
      src: '/wedding3.jpg',
      alt: 'Acara Wedding 3',
      fallbackSrc: '/hero-bg(3).jpg'
    },
    {
      type: 'image' as const,
      src: '/wedding4.jpg',
      alt: 'Acara Wedding 4',
      fallbackSrc: '/hero-bg(3).jpg'
    },
    // Tambahkan video jika ada
    // {
    //   type: 'video' as const,
    //   src: '/venue-preview.mp4',
    //   alt: 'Video Preview Venue'
    // }
  ];

  useEffect(() => {
    // Initialize AOS with enhanced configuration
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: true,
      offset: 120,
      delay: 0,
      anchorPlacement: 'top-bottom',
      mirror: false,
      startEvent: 'DOMContentLoaded',
      useClassNames: false,
      disableMutationObserver: false,
      throttleDelay: 99,
      debounceDelay: 50
    });

    fetchData();
  }, []);

  // Default data untuk mengurangi waktu loading
  const defaultSettings = {
    restaurantName: 'Kedai J.A',
    description: 'Nikmati cita rasa autentik Indonesia dengan resep turun-temurun yang telah diwariskan dari generasi ke generasi',
    address: 'Jl. Raya Leles No.45, Garut',
    contact: '081234567890',
    hours: 'Senin - Minggu, 09.00 - 21.00',
    email: 'info@kedai-ja.com'
  };

  const fetchData = async () => {
    // Gunakan default data terlebih dahulu untuk mempercepat rendering
    setSettings(defaultSettings);
    
    try {
      // Helper fetch dengan timeout + abort (tidak melempar Error('Timeout') ke global)
      const fetchWithTimeout = (url: string, timeout = 2000, init?: RequestInit) => {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), timeout);
        return fetch(url, { signal: controller.signal, ...(init || {}) })
          .finally(() => clearTimeout(timer));
      };

      // Fetch data secara paralel
      Promise.all([
        // Best seller biasanya lebih cepat, 3s cukup
        fetchWithTimeout('/api/menu/best-seller', 3000)
          .then(res => res.json())
          .then(data => {
            setBestSellerItems(data.bestSellers || []);
          })
          .catch(() => {
            console.log('Using default best sellers');
            setBestSellerItems([]);
          }),
          
        // Settings cenderung lambat di beberapa mesin lokal, beri 4s
        fetchWithTimeout('/api/settings', 4000)
          .then(res => res.json())
          .then(data => {
            if (data.settings) {
              setSettings(data.settings);
            }
          })
          .catch(() => {
            console.log('Using default settings');
            setSettings(defaultSettings);
          }),
          
        // Testimonial dashboard (ambil 3) bisa lebih lambat, beri 4.5s
        fetchWithTimeout('/api/testimonials/dashboard', 4500, { cache: 'no-store', headers: { 'Cache-Control': 'no-cache' } })
          .then(res => res.json())
          .then(data => {
            setTestimonials(data.testimonials || []);
          })
          .catch(() => {
            console.log('Using default testimonials');
            setTestimonials([]);
          })
      ])
      .finally(() => {
        // Setelah semua fetch selesai atau timeout, matikan loading state
        setLoading(false);
      });
      
      // Matikan loading setelah 1.5 detik meskipun fetch belum selesai
      // untuk memastikan UI tidak terjebak dalam loading state
      setTimeout(() => {
        setLoading(false);
      }, 1500);
      
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Menu', href: '/menu' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-200/20 border-t-primary-500 mx-auto"></div>
            <div className="absolute inset-0 rounded-full h-16 w-16 border-4 border-transparent border-t-secondary-400/50 animate-pulse mx-auto"></div>
          </div>
          <div className="mt-6 space-y-2">
            <p className="text-lg font-medium text-white">Memuat halaman...</p>
            <p className="text-sm text-gray-300">Menyiapkan pengalaman terbaik untuk Anda</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <MainLayout>

      {/* Hero Section */}
      <section className="relative min-h-[100vh] flex items-center justify-center overflow-hidden pt-16">
        {/* Background with Parallax Effect */}
        <div 
          className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url('/hero-bg(3).jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/60"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-primary-900/30 via-transparent to-secondary-900/20"></div>
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 z-10">
          <div className="absolute top-20 left-10 w-32 h-32 bg-secondary-400/10 rounded-full blur-xl animate-float"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-primary-400/10 rounded-full blur-xl animate-float" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-32 left-20 w-40 h-40 bg-secondary-300/10 rounded-full blur-xl animate-float" style={{animationDelay: '2s'}}></div>
        </div>

        {/* Main Content */}
        <div className="relative z-20 container-fluid text-center text-white">
          {/* Logo with Animation */}
          <div className="mb-8" data-aos="scale-up" data-aos-duration="800">
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full blur-lg opacity-50 animate-pulse-soft"></div>
              <img
                src="/logo-bg.png"
                alt="Logo Kedai J.A"
                className="relative h-24 w-24 mx-auto drop-shadow-2xl"
                style={{objectFit: 'contain'}}
              />
            </div>
          </div>

          {/* Main Heading */}
          <div className="space-y-6 mb-12">
            <h1 className="heading-primary text-5xl md:text-7xl lg:text-7xl mb-6 text-white" 
                data-aos="fade-up" data-aos-delay="200" data-aos-duration="1000">
              Selamat Datang di{" "}
              <span className="text-gradient bg-gradient-to-r from-secondary-300 to-secondary-400 bg-clip-text text-transparent">
                Kedai J.A
              </span>
            </h1>
            
            <p className="heading-secondary text-xl md:text-2xl lg:text-3xl max-w-4xl mx-auto leading-relaxed text-gray-100" 
               data-aos="fade-up" data-aos-delay="400" data-aos-duration="1000">
              {settings?.description}
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16" 
               data-aos="fade-up" data-aos-delay="600" data-aos-duration="1000">
              <Link
                href="/menu"
              className="group relative px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold text-lg rounded-2xl shadow-2xl hover:shadow-primary-500/25 transition-all duration-500 hover:scale-105 min-w-[200px]"
              >
              <span className="relative z-10 flex items-center justify-center">
                Lihat Menu
                <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
            
              <Link
                href="/contact"
              className="group relative px-8 py-4 bg-white/10 backdrop-blur-md text-white font-semibold text-lg rounded-2xl border-2 border-white/30 hover:bg-white hover:text-primary-600 transition-all duration-500 hover:scale-105 min-w-[200px]"
              >
              <span className="flex items-center justify-center">
                Hubungi Kami
                <Phone className="ml-3 h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
              </span>
              </Link>
          </div>

          {/* Statistics/Features Quick Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto" 
               data-aos="fade-up" data-aos-delay="800" data-aos-duration="1000">
            <div className="glass-effect rounded-2xl p-6 text-center group hover:scale-105 transition-transform duration-300">
              <Star className="h-8 w-8 text-secondary-400 mx-auto mb-3 group-hover:rotate-12 transition-transform duration-300" />
              <h3 className="font-semibold text-lg mb-2">Kualitas Terbaik</h3>
              <p className="text-gray-300 text-sm">Cita rasa autentik Indonesia</p>
            </div>
            
            <div className="glass-effect rounded-2xl p-6 text-center group hover:scale-105 transition-transform duration-300">
              <Clock className="h-8 w-8 text-secondary-400 mx-auto mb-3 group-hover:rotate-12 transition-transform duration-300" />
              <h3 className="font-semibold text-lg mb-2">Pelayanan Cepat</h3>
              <p className="text-gray-300 text-sm">Siap melayani setiap hari</p>
            </div>
            
            <div className="glass-effect rounded-2xl p-6 text-center group hover:scale-105 transition-transform duration-300">
              <MapPin className="h-8 w-8 text-secondary-400 mx-auto mb-3 group-hover:rotate-12 transition-transform duration-300" />
              <h3 className="font-semibold text-lg mb-2">Lokasi Strategis</h3>
              <p className="text-gray-300 text-sm">Mudah dijangkau di Garut</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Menu Section */}
      <section className="section-spacing bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute inset-0">
          <div className="absolute top-10 right-10 w-64 h-64 bg-secondary-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-80 h-80 bg-primary-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="container-fluid relative z-10">
          <div className="text-center mb-16" data-aos="fade-up" data-aos-duration="800">
            <h2 className="heading-primary text-4xl md:text-5xl lg:text-6xl text-white mb-6">
              Menu{" "}
              <span className="text-gradient bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
                Best Seller
              </span>
            </h2>
            <p className="heading-secondary text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
              Cicipi hidangan terbaik kami yang telah menjadi favorit pelanggan
            </p>
          </div>

          {bestSellerItems.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {bestSellerItems.map((item, index) => (
                <div key={item._id} 
                       className="group relative bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl shadow-lg overflow-hidden hover:-translate-y-3 hover:shadow-primary-500/20 transition-all duration-500"
                       data-aos="scale-up" data-aos-delay={200 + (index * 100)} data-aos-duration="600">
                    
                    {/* Image Container */}
                    <div className="relative h-64 overflow-hidden">
                    {item.image ? (
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 flex items-center justify-center">
                          <ChefHat className="h-20 w-20 text-primary-300 opacity-80 group-hover:scale-110 transition-transform duration-500 animate-float" />
                        </div>
                      )}
                      
                      {/* Best Seller Badge */}
                      <div className="absolute top-4 right-4">
                        <div className="bg-gradient-to-r from-secondary-500 to-secondary-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg group-hover:scale-110 transition-transform duration-300">
                      BEST SELLER
                    </div>
                  </div>

                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-30 group-hover:opacity-60 transition-opacity duration-300"></div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="heading-secondary text-xl font-bold text-white mb-2 group-hover:text-primary-400 transition-colors duration-300">
                            {item.name}
                          </h3>
                          <p className="text-body text-gray-300 text-sm leading-relaxed line-clamp-2">
                            {item.description}
                          </p>
                        </div>
                        <span className={`ml-3 px-3 py-1 rounded-full text-xs font-semibold flex-shrink-0 ${
                        item.category === 'Makanan' 
                            ? 'bg-primary-900/70 text-primary-300 border border-primary-700/50' 
                            : 'bg-blue-900/70 text-blue-300 border border-blue-700/50'
                      }`}>
                        {item.category}
                      </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-primary-400">
                          Rp {item.price.toLocaleString('id-ID')}
                        </span>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <Link
                            href="/menu"
                            className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-primary-600 hover:to-primary-700 transition-all duration-300 flex items-center shadow-lg hover:shadow-primary-500/25"
                          >
                            Pesan
                            <ArrowRight className="ml-1 h-4 w-4" />
                          </Link>
                        </div>
                      </div>
                  </div>
                </div>
              ))}
            </div>
            </>
          ) : (
            <div className="text-center py-20" data-aos="fade-up" data-aos-delay="300">
              <div className="relative inline-block mb-6">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full blur-lg opacity-40 animate-pulse-soft"></div>
                <ChefHat className="relative h-20 w-20 text-primary-400 mx-auto animate-float" />
              </div>
              <h3 className="heading-secondary text-xl text-white mb-2">Menu Best Seller Akan Segera Hadir</h3>
              <p className="text-body text-gray-300">Kami sedang menyiapkan hidangan terbaik untuk Anda</p>
            </div>
          )}

          <div className="text-center" data-aos="fade-up" data-aos-delay="400">
            <Link
              href="/menu"
              className="group relative px-10 py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold text-lg rounded-2xl shadow-2xl hover:shadow-primary-500/25 transition-all duration-500 hover:scale-105 inline-flex items-center"
            >
              <span className="relative z-10 flex items-center justify-center">
              Lihat Semua Menu
                <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
          </div>
        </div>
      </section>

      {/* Services Grid Section */}
      <section className="section-spacing bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-secondary-500/5 rounded-full blur-3xl"></div>
        </div>

        <div className="container-fluid relative z-10">
          <div className="text-center mb-16" data-aos="fade-up" data-aos-duration="800">
            <h2 className="heading-primary text-4xl md:text-5xl lg:text-6xl text-white mb-6">
              Apa yang dapat{" "}
              <span className="text-gradient bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
                kami berikan?
              </span>
            </h2>
            <p className="heading-secondary text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
              Berbagai layanan terbaik untuk memenuhi kebutuhan kuliner Anda
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Corporate Events */}
            <div className="bg-gradient-to-br from-green-800 to-green-900 p-8 rounded-2xl shadow-lg border border-green-700/30 hover:-translate-y-2 hover:shadow-green-500/20 transition-all duration-500 group"
                 data-aos="fade-up" data-aos-delay="200" data-aos-duration="600">
              <div className="mb-6">
                <div className="w-16 h-16 bg-orange-500/20 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-orange-300 transition-colors duration-300">
                  Corporate Events
                </h3>
              </div>
              <p className="text-gray-200 leading-relaxed mb-6">
                Anda memiliki rencana untuk mengadakan acara perusahaan/ corporate? kami menghadirkan kebersamaan keluarga dengan paket Nasi Box atau Menu Paket untuk anda.
              </p>
              <p className="text-gray-200 leading-relaxed">
                Biarkan kami merencanakan dan mengelola acara anda sehingga anda bisa lebih rileks dan menikmati momen bersama tim anda.
              </p>
            </div>

            {/* Catering Istimewa */}
            <div className="bg-gradient-to-br from-green-800 to-green-900 p-8 rounded-2xl shadow-lg border border-green-700/30 hover:-translate-y-2 hover:shadow-green-500/20 transition-all duration-500 group"
                 data-aos="fade-up" data-aos-delay="300" data-aos-duration="600">
              <div className="mb-6">
                                <div className="w-16 h-16 bg-orange-500/20 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-orange-300 transition-colors duration-300">
                  Paket Nasi Box
                </h3>
              </div>
              <p className="text-gray-200 leading-relaxed mb-6">
                Paket nasi box kami adalah pilihan yang sempurna. Kami menyajikan dan menghantarkan hidangan-hidangan sederhana namun terbaik ke acara anda melalui menu nasi box yang bervariasi dan kami bisa antarkan ke semua wilayah Kota Garut.
              </p>
              <p className="text-gray-200 leading-relaxed">
                Tersedia juga home service catering.
              </p>
            </div>

            {/* Drop Off Catering */}
            <div className="bg-gradient-to-br from-green-800 to-green-900 p-8 rounded-2xl shadow-lg border border-green-700/30 hover:-translate-y-2 hover:shadow-green-500/20 transition-all duration-500 group"
                 data-aos="fade-up" data-aos-delay="400" data-aos-duration="600">
              <div className="mb-6">
                <div className="w-16 h-16 bg-orange-500/20 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M9 21V9l-6-2m6 2l6 2m-6 0v10" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-orange-300 transition-colors duration-300">
                  Drop Off Catering
                </h3>
              </div>
              <p className="text-gray-200 leading-relaxed mb-6">
                Tim kami berkomitmen untuk memberikan servis yang fast respons, fasilitas lengkap sampai dan terjamin kualitas makanan pasti memuaskan selera Anda.
              </p>
              <p className="text-orange-400 font-semibold mb-4">
                Segera hubungi kami via Whatsapp:
              </p>
              <a 
                href="https://wa.me/6282117306379" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-500/25"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                </svg>
                Hubungi kami via WhatsApp
              </a>
            </div>

            {/* Menu yang Variatif */}
            <div className="bg-gradient-to-br from-green-800 to-green-900 p-8 rounded-2xl shadow-lg border border-green-700/30 hover:-translate-y-2 hover:shadow-green-500/20 transition-all duration-500 group"
                 data-aos="fade-up" data-aos-delay="500" data-aos-duration="600">
              <div className="mb-6">
                <div className="w-16 h-16 bg-orange-500/20 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-orange-300 transition-colors duration-300">
                  Reservasi Wedding Venue
                </h3>
              </div>
              <p className="text-gray-200 leading-relaxed">
              Kami juga menyediakan fasilitas tempat untuk acara pernikahan, serta bekerja sama dengan berbagai vendor dan wedding organizer profesional yang siap membantu mewujudkan acara pernikahan anda dengan layanan yang terkoordinasi dan berkualitas.
              </p>
            </div>

            {/* Restoran */}
            <div className="bg-gradient-to-br from-green-800 to-green-900 p-8 rounded-2xl shadow-lg border border-green-700/30 hover:-translate-y-2 hover:shadow-green-500/20 transition-all duration-500 group"
                 data-aos="fade-up" data-aos-delay="600" data-aos-duration="600">
              <div className="mb-6">
                <div className="w-16 h-16 bg-orange-500/20 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-orange-300 transition-colors duration-300">
                  Restoran
                </h3>
              </div>
              <p className="text-gray-200 leading-relaxed mb-6">
                Kami menghadirkan suasana yang nyaman dan ramah untuk anda nikmati bersama keluarga dan teman-teman.
              </p>
              <p className="text-gray-200 leading-relaxed mb-6">
              Kami menyediakan area outdoor yang menghadirkan suasana damai dan tenang, sehingga Anda dapat menikmati hidangan dengan nyaman sambil merasakan keindahan lingkungan sekitar.
              </p>
              <p className="text-orange-400 font-semibold">
                Hubungi kami untuk booking reservasi.
              </p>
            </div>

            {/* Hampers & Snack Box */}
            <div className="bg-gradient-to-br from-green-800 to-green-900 p-8 rounded-2xl shadow-lg border border-green-700/30 hover:-translate-y-2 hover:shadow-green-500/20 transition-all duration-500 group"
                 data-aos="fade-up" data-aos-delay="700" data-aos-duration="600">
              <div className="mb-6">
                <div className="w-16 h-16 bg-orange-500/20 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-orange-300 transition-colors duration-300">
                  Pemesanan Online
                </h3>
              </div>
              <p className="text-gray-200 leading-relaxed mb-6">
              Lapar? Malas keluar rumah? Klik tombol di bawah, bisa pesan lewat GoFood, dan makanan lezat Kedai J.A siap diantar oleh mitra driver Gojek!
              </p>
              <p className="text-gray-200 leading-relaxed mb-6">
                Pesan menu favorit Kedai J.A sekarang juga tanpa ribet! Klik tombol di bawah untuk order langsung via GoFood dan nikmati hidangan lezat kami di rumah Anda.
              </p>
              
              <div className="text-center">
                <a
                  href="https://gofood.co.id/garut/restaurant/kedai-j-a-d8768ea9-598b-4bb0-9702-bd64600ae2d1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-green-500/25 hover:-translate-y-1 transition-all duration-300 group"
                >
                  <img 
                    src="/logo-gojek.png" 
                    alt="GoFood" 
                    className="w-6 h-6 mr-3 object-contain"
                  />
                  <span className="text-lg">Pesan via GoFood</span>
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
                
                <div className="mt-3 text-center">
                  <p className="text-green-300 text-sm font-medium">Gratis Ongkir</p>
                  <p className="text-gray-400 text-xs">Cek voucher di akun Gojek anda!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Layanan Kami Section */}
      <section className="section-spacing bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute inset-0">
          <div className="absolute top-20 right-10 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-10 w-80 h-80 bg-secondary-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="container-fluid relative z-10">
          <div className="text-center mb-16" data-aos="fade-up" data-aos-duration="800">
            <h2 className="heading-primary text-4xl md:text-5xl lg:text-6xl text-white mb-6">
              Layanan{" "}
              <span className="text-gradient bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
                Kami
              </span>
            </h2>
            <p className="heading-secondary text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
              Dua kategori layanan utama yang kami tawarkan untuk Anda
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* RESTO Card */}
            <div className="bg-white/95 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-gray-200/50 hover:-translate-y-2 hover:shadow-3xl transition-all duration-500 group"
                 data-aos="fade-up" data-aos-delay="200" data-aos-duration="600">
              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold text-gray-800 mb-4 group-hover:text-primary-600 transition-colors duration-300">
                  RESTO
                </h3>
              </div>
              
              {/* Media Carousel */}
              <div className="mb-8">
                <MediaCarousel
                  items={restoMedia}
                  autoPlay={true}
                  interval={4000}
                  showControls={true}
                  showIndicators={true}
                  aspectRatio="video"
                  overlayText="Galeri Outdoor Resto Kami"
                />
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3 group/item hover:bg-gray-50 p-2 rounded-lg transition-colors duration-200">
                  <div className="w-2 h-2 bg-primary-500 rounded-full group-hover/item:scale-125 transition-transform duration-200"></div>
                  <span className="text-gray-700 group-hover/item:text-gray-900 transition-colors duration-200">Menu Paketan Ayam / Ikan</span>
                </div>
                <div className="flex items-center space-x-3 group/item hover:bg-gray-50 p-2 rounded-lg transition-colors duration-200">
                  <div className="w-2 h-2 bg-primary-500 rounded-full group-hover/item:scale-125 transition-transform duration-200"></div>
                  <span className="text-gray-700 group-hover/item:text-gray-900 transition-colors duration-200">Aneka Nasi & Rice Bowl</span>
                </div>
                <div className="flex items-center space-x-3 group/item hover:bg-gray-50 p-2 rounded-lg transition-colors duration-200">
                  <div className="w-2 h-2 bg-primary-500 rounded-full group-hover/item:scale-125 transition-transform duration-200"></div>
                  <span className="text-gray-700 group-hover/item:text-gray-900 transition-colors duration-200">Aneka Mie</span>
                </div>
                <div className="flex items-center space-x-3 group/item hover:bg-gray-50 p-2 rounded-lg transition-colors duration-200">
                  <div className="w-2 h-2 bg-primary-500 rounded-full group-hover/item:scale-125 transition-transform duration-200"></div>
                  <span className="text-gray-700 group-hover/item:text-gray-900 transition-colors duration-200">Aneka Tumis</span>
                </div>
                <div className="flex items-center space-x-3 group/item hover:bg-gray-50 p-2 rounded-lg transition-colors duration-200">
                  <div className="w-2 h-2 bg-primary-500 rounded-full group-hover/item:scale-125 transition-transform duration-200"></div>
                  <span className="text-gray-700 group-hover/item:text-gray-900 transition-colors duration-200">Aneka Snack</span>
                </div>
                <div className="flex items-center space-x-3 group/item hover:bg-gray-50 p-2 rounded-lg transition-colors duration-200">
                  <div className="w-2 h-2 bg-primary-500 rounded-full group-hover/item:scale-125 transition-transform duration-200"></div>
                  <span className="text-gray-700 group-hover/item:text-gray-900 transition-colors duration-200">Aneka Desserts</span>
                </div>
                <div className="flex items-center space-x-3 group/item hover:bg-gray-50 p-2 rounded-lg transition-colors duration-200">
                  <div className="w-2 h-2 bg-primary-500 rounded-full group-hover/item:scale-125 transition-transform duration-200"></div>
                  <span className="text-gray-700 group-hover/item:text-gray-900 transition-colors duration-200">Aneka Minuman</span>
                </div>
                <div className="flex items-center space-x-3 group/item hover:bg-gray-50 p-2 rounded-lg transition-colors duration-200">
                  <div className="w-2 h-2 bg-primary-500 rounded-full group-hover/item:scale-125 transition-transform duration-200"></div>
                  <span className="text-gray-700 group-hover/item:text-gray-900 transition-colors duration-200">Aneka Jus</span>
                </div>
                <div className="flex items-center space-x-3 group/item hover:bg-gray-50 p-2 rounded-lg transition-colors duration-200">
                  <div className="w-2 h-2 bg-primary-500 rounded-full group-hover/item:scale-125 transition-transform duration-200"></div>
                  <span className="text-gray-700 group-hover/item:text-gray-900 transition-colors duration-200">Paket Nasi Box min order.100 pax</span>
                </div>
              </div>
            </div>

            {/* CATERING Card */}
            <div className="bg-white/95 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-gray-200/50 hover:-translate-y-2 hover:shadow-3xl transition-all duration-500 group"
                 data-aos="fade-up" data-aos-delay="400" data-aos-duration="600">
              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold text-gray-800 mb-4 group-hover:text-secondary-600 transition-colors duration-300">
                RESERVASI SEWA TEMPAT 
                </h3>
              </div>
              
              {/* Media Carousel */}
              <div className="mb-8">
                <MediaCarousel
                  items={venueMedia}
                  autoPlay={true}
                  interval={4000}
                  showControls={true}
                  showIndicators={true}
                  aspectRatio="video"
                  overlayText="Galeri Acara Wedding & Event"
                />
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3 group/item hover:bg-gray-50 p-2 rounded-lg transition-colors duration-200">
                  <div className="w-2 h-2 bg-secondary-500 rounded-full group-hover/item:scale-125 transition-transform duration-200"></div>
                  <span className="text-gray-700 group-hover/item:text-gray-900 transition-colors duration-200">Pernikahan</span>
                </div>
                <div className="flex items-center space-x-3 group/item hover:bg-gray-50 p-2 rounded-lg transition-colors duration-200">
                  <div className="w-2 h-2 bg-secondary-500 rounded-full group-hover/item:scale-125 transition-transform duration-200"></div>
                  <span className="text-gray-700 group-hover/item:text-gray-900 transition-colors duration-200">Resepsi / Akad Nikah</span>
                </div>
                <div className="flex items-center space-x-3 group/item hover:bg-gray-50 p-2 rounded-lg transition-colors duration-200">
                  <div className="w-2 h-2 bg-secondary-500 rounded-full group-hover/item:scale-125 transition-transform duration-200"></div>
                  <span className="text-gray-700 group-hover/item:text-gray-900 transition-colors duration-200">Acara Ulang Tahun</span>
                </div>
                <div className="flex items-center space-x-3 group/item hover:bg-gray-50 p-2 rounded-lg transition-colors duration-200">
                  <div className="w-2 h-2 bg-secondary-500 rounded-full group-hover/item:scale-125 transition-transform duration-200"></div>
                  <span className="text-gray-700 group-hover/item:text-gray-900 transition-colors duration-200">Gathering Keluarga / Komunitas</span>
                </div>
                <div className="flex items-center space-x-3 group/item hover:bg-gray-50 p-2 rounded-lg transition-colors duration-200">
                  <div className="w-2 h-2 bg-secondary-500 rounded-full group-hover/item:scale-125 transition-transform duration-200"></div>
                  <span className="text-gray-700 group-hover/item:text-gray-900 transition-colors duration-200">Acara Wisuda / Perpisahan</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Informasi Pemesanan Section */}
      <section className="section-spacing bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-secondary-500/5 rounded-full blur-3xl"></div>
        </div>

        <div className="container-fluid relative z-10">
          <div className="text-center mb-16" data-aos="fade-up" data-aos-duration="800">
            <h2 className="heading-primary text-4xl md:text-5xl lg:text-6xl text-white mb-6">
              Informasi{" "}
              <span className="text-gradient bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
                Pemesanan
              </span>
            </h2>
            <p className="heading-secondary text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
              Panduan lengkap untuk proses pemesanan yang mudah dan praktis
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Pemesanan - Blue */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-8 min-h-[240px] rounded-2xl shadow-2xl border border-blue-500/30 hover:-translate-y-2 hover:shadow-blue-500/20 transition-all duration-500 group relative overflow-hidden"
                 data-aos="fade-up" data-aos-delay="200" data-aos-duration="600">
              {/* Arrow Icon */}
              <div className="absolute top-6 right-6">
                <div className="w-8 h-8 border-2 border-white/50 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <ArrowRight className="h-4 w-4 text-white/70 rotate-[-45deg]" />
                </div>
              </div>
              
              <div className="border-b border-white/20 pb-4 mb-6">
                <h3 className="text-2xl font-bold text-white group-hover:text-blue-200 transition-colors duration-300">
                  Pemesanan
                </h3>
              </div>
              
              <div className="space-y-4 text-white/90">
                <p className="leading-relaxed">
                  Pemesanan dapat dilakukan melalui Asisten Chatbot atau melalui Kontak Admin WhatsApp.
                </p>
                <div className="space-y-2">
                  <p className="font-medium">Restoran Open Senin – Minggu: 09.00 – 21.00</p>
                  <p className="font-medium">Reservasi Sewa Tempat Sabtu – Minggu 07.00 – 15.00</p>
                </div>
              </div>
            </div>

            {/* Pengiriman - Green */}
            <div className="bg-gradient-to-br from-green-600 to-green-800 p-8 min-h-[240px] rounded-2xl shadow-2xl border border-green-500/30 hover:-translate-y-2 hover:shadow-green-500/20 transition-all duration-500 group relative overflow-hidden"
                 data-aos="fade-up" data-aos-delay="300" data-aos-duration="600">
              {/* Arrow Icon */}
              <div className="absolute top-6 right-6">
                <div className="w-8 h-8 border-2 border-white/50 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <ArrowRight className="h-4 w-4 text-white/70 rotate-[-45deg]" />
                </div>
              </div>
              
              <div className="border-b border-white/20 pb-4 mb-6">
                <h3 className="text-2xl font-bold text-white group-hover:text-green-200 transition-colors duration-300">
                  Pengiriman
                </h3>
              </div>
              
              <div className="space-y-4 text-white/90">
                <p className="leading-relaxed">
                  Pemesanan sebaiknya dilakukan H-7 agar mendapat ketersediaan jadwal pengiriman.
                </p>
                <p className="leading-relaxed">
                  Biaya pengiriman kami GRATIS, namun bergantung area pengiriman dan quantity.
                </p>
              </div>
            </div>

            {/* Pembayaran - Yellow */}
            <div className="bg-gradient-to-br from-yellow-500 to-yellow-700 p-8 min-h-[240px] rounded-2xl shadow-2xl border border-yellow-400/30 hover:-translate-y-2 hover:shadow-yellow-500/20 transition-all duration-500 group relative overflow-hidden"
                 data-aos="fade-up" data-aos-delay="400" data-aos-duration="600">
              {/* Arrow Icon */}
              <div className="absolute top-6 right-6">
                <div className="w-8 h-8 border-2 border-white/50 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <ArrowRight className="h-4 w-4 text-white/70 rotate-[-45deg]" />
                </div>
              </div>
              
              <div className="border-b border-white/20 pb-4 mb-6">
                <h3 className="text-2xl font-bold text-white group-hover:text-yellow-200 transition-colors duration-300">
                  Pembayaran
                </h3>
              </div>
              
              <div className="space-y-4 text-white/90">
                <p className="leading-relaxed">
                  Metode pembayaran dapat dilakukan dengan transfer bank, Tunai di kasir, QRIS.
                </p>
                <p className="leading-relaxed">
                  Pembayaran harus lunas sebelum waktu pengiriman.
                </p>
                <p className="leading-relaxed">
                  Pemesanan diharapkan memberikan <span className="font-semibold text-yellow-200">DP 50%</span> pada hari pemesanan dan melakukan pelunasan di H-1
                </p>
              </div>
            </div>

            {/* Chatbot - Cyan */}
            <div className="bg-gradient-to-br from-cyan-600 to-cyan-800 p-8 min-h-[240px] rounded-2xl shadow-2xl border border-cyan-500/30 hover:-translate-y-2 hover:shadow-cyan-500/20 transition-all duration-500 group relative overflow-hidden"
                 data-aos="fade-up" data-aos-delay="500" data-aos-duration="600">
              {/* Arrow Icon */}
              <div className="absolute top-6 right-6">
                <div className="w-8 h-8 border-2 border-white/50 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <ArrowRight className="h-4 w-4 text-white/70 rotate-[-45deg]" />
                </div>
              </div>

              <div className="border-b border-white/20 pb-4 mb-6">
                <h3 className="text-2xl font-bold text-white group-hover:text-cyan-200 transition-colors duration-300">
                  Chatbot
                </h3>
              </div>

              <div className="space-y-4 text-white/90">
                <p className="leading-relaxed">
                  Jika anda ingin menanyakan hal lain anda dapat menekan tombol chatbot di bawah kanan bawah, anda juga dapat melakukan pemesanan atau reservasi melalui Asisten Chatbot.
                </p>
              </div>
            </div>

            {/* Pembatalan - Red */}
            <div className="bg-gradient-to-br from-red-600 to-red-800 p-8 min-h-[240px] rounded-2xl shadow-2xl border border-red-500/30 hover:-translate-y-2 hover:shadow-red-500/20 transition-all duration-500 group relative overflow-hidden lg:col-start-2"
                 data-aos="fade-up" data-aos-delay="600" data-aos-duration="600">
              {/* Arrow Icon */}
              <div className="absolute top-6 right-6">
                <div className="w-8 h-8 border-2 border-white/50 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <ArrowRight className="h-4 w-4 text-white/70 rotate-[-45deg]" />
                </div>
              </div>
              
              <div className="border-b border-white/20 pb-4 mb-6">
                <h3 className="text-2xl font-bold text-white group-hover:text-red-200 transition-colors duration-300">
                  Pembatalan
                </h3>
              </div>
              
              <div className="space-y-4 text-white/90">
                <p className="leading-relaxed">
                  Pembatalan/perubahan pesanan harus dilakukan via telepon H-1, Whatsapp H-1 dan email H-1 sebelum jam 12.00 dan tidak dapat dilakukan pada hari H atau hari pengiriman makanan.
                </p>
                <p className="leading-relaxed">
                  Kami akan melakukan konfirmasi final melalui telepon pada H-1 pemesanan.
                </p>
                <p className="leading-relaxed">
                  Kami tidak bertanggung jawab pembatalan/pembatalan dadakan dari pemesan.
                </p>
              </div>
            </div>

            {/* Harga & Biaya - Purple */}
            <div className="bg-gradient-to-br from-purple-600 to-purple-800 p-8 min-h-[240px] rounded-2xl shadow-2xl border border-purple-500/30 hover:-translate-y-2 hover:shadow-purple-500/20 transition-all duration-500 group relative overflow-hidden lg:col-start-3"
                 data-aos="fade-up" data-aos-delay="700" data-aos-duration="600">
              {/* Arrow Icon */}
              <div className="absolute top-6 right-6">
                <div className="w-8 h-8 border-2 border-white/50 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <ArrowRight className="h-4 w-4 text-white/70 rotate-[-45deg]" />
                </div>
              </div>
              
              <div className="border-b border-white/20 pb-4 mb-6">
                <h3 className="text-2xl font-bold text-white group-hover:text-purple-200 transition-colors duration-300">
                  Harga & Biaya
                </h3>
              </div>
              
              <div className="space-y-4 text-white/90">
                <p className="leading-relaxed">
                  Harga dapat berubah sewaktu-waktu. Informasi lebih lanjut untuk tiap layanan makanan dapat ditanyakan lebih lanjut saat proses pemesanan.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="section-spacing bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute inset-0">
          <div className="absolute top-10 right-10 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-80 h-80 bg-secondary-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="container-fluid relative z-10">
          <div className="text-center mb-16" data-aos="fade-up" data-aos-duration="800">
            <h2 className="heading-primary text-4xl md:text-5xl lg:text-6xl text-white mb-6">
              Gallery{" "}
              <span className="text-gradient bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
                Kedai J.A
              </span>
            </h2>
            <p className="heading-secondary text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
              Jelajahi koleksi foto terbaik dari suasana restoran, hidangan lezat, dan momen spesial bersama kami
            </p>
          </div>

          {/* Gallery Preview Grid - Show first 6 images */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {Array.from({ length: 6 }, (_, index) => (
              <div
                key={index}
                className="group relative aspect-square overflow-hidden rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer"
                data-aos="fade-up"
                data-aos-delay={200 + (index * 100)}
                data-aos-duration="600"
              >
                {/* Placeholder for now - will be replaced with actual gallery images */}
                <div className="w-full h-full bg-gradient-to-br from-primary-600/20 via-secondary-600/20 to-primary-800/20 flex items-center justify-center">
                  <Camera className="h-16 w-16 text-white/50 group-hover:scale-110 transition-transform duration-500" />
                </div>
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Hover Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <h3 className="text-lg font-semibold mb-2">Gallery Image {index + 1}</h3>
                  <p className="text-sm text-gray-200">Koleksi foto dari Kedai J.A</p>
                </div>
                
                {/* Hover overlay icon */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-white/20 backdrop-blur-md rounded-full p-4">
                    <Camera className="h-8 w-8 text-white" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="text-center" data-aos="fade-up" data-aos-delay="800">
            <Link
              href="/gallery"
              className="group relative px-10 py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold text-lg rounded-2xl shadow-2xl hover:shadow-primary-500/25 transition-all duration-500 hover:scale-105 inline-flex items-center"
            >
              <span className="relative z-10 flex items-center justify-center">
                Lihat Semua Gallery
                <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section-spacing bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute inset-0">
          <div className="absolute top-20 right-10 w-72 h-72 bg-secondary-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-10 w-80 h-80 bg-primary-500/5 rounded-full blur-3xl"></div>
        </div>

        <div className="container-fluid relative z-10">
          <div className="text-center mb-16" data-aos="fade-up" data-aos-duration="800">
            <h2 className="heading-primary text-4xl md:text-5xl lg:text-6xl text-white mb-6">
              Apa Kata{" "}
              <span className="text-gradient bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
                Pelanggan?
              </span>
            </h2>
            <p className="heading-secondary text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
              Dengarkan pengalaman nyata dari pelanggan setia Kedai J.A yang telah merasakan layanan kami
            </p>
          </div>

          {/* Testimonials Preview Grid - Show testimonials from API */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {testimonials.length > 0 ? testimonials.map((testimonial, index) => (
              <div
                key={testimonial._id}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group relative overflow-hidden"
                data-aos="fade-up"
                data-aos-delay={200 + (index * 150)}
                data-aos-duration="600"
              >
                {/* Quote icon */}
                <div className="absolute top-6 right-6 opacity-20 group-hover:opacity-30 transition-opacity duration-300">
                  <svg className="h-8 w-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
                  </svg>
                </div>

                {/* Rating Stars */}
                <div className="flex items-center space-x-1 mb-4">
                  {Array.from({ length: 5 }, (_, starIndex) => (
                    <Star
                      key={starIndex}
                      className={`h-5 w-5 ${
                        starIndex < testimonial.rating 
                          ? 'text-yellow-400 fill-yellow-400' 
                          : 'text-gray-400 fill-gray-400/20'
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-sm text-gray-300 font-medium">({testimonial.rating}/5)</span>
                </div>

                {/* Testimonial Message */}
                <div className="mb-6">
                  <p className="text-white leading-relaxed text-lg">
                    "{testimonial.message}"
                  </p>
                </div>

                {/* Customer Info */}
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xl font-semibold text-white mb-1">
                      {testimonial.name}
                    </h4>
                    <p className="text-gray-400 text-sm">
                      {new Date(testimonial.createdAt).toLocaleDateString('id-ID', {
                        year: 'numeric',
                        month: 'short'
                      })}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {testimonial.name.charAt(0).toUpperCase()}
                  </div>
                </div>

                {/* Hover effect border */}
                <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-white/20 transition-colors duration-300" />
              </div>
            )) : Array.from({ length: 3 }, (_, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group relative overflow-hidden"
                data-aos="fade-up"
                data-aos-delay={200 + (index * 150)}
                data-aos-duration="600"
              >
                {/* Quote icon */}
                <div className="absolute top-6 right-6 opacity-20 group-hover:opacity-30 transition-opacity duration-300">
                  <svg className="h-8 w-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
                  </svg>
                </div>

                {/* Rating Stars */}
                <div className="flex items-center space-x-1 mb-4">
                  {Array.from({ length: 5 }, (_, starIndex) => (
                    <Star
                      key={starIndex}
                      className="h-5 w-5 text-yellow-400 fill-yellow-400"
                    />
                  ))}
                  <span className="ml-2 text-sm text-gray-300 font-medium">(5/5)</span>
                </div>

                {/* Testimonial Message */}
                <div className="mb-6">
                  <p className="text-white leading-relaxed text-lg">
                    "Makanan di Kedai J.A sangat lezat dan pelayanannya memuaskan. Suasana restorannya juga nyaman untuk berkumpul bersama keluarga."
                  </p>
                </div>

                {/* Customer Info */}
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xl font-semibold text-white mb-1">
                      Pelanggan {index + 1}
                    </h4>
                    <p className="text-gray-400 text-sm">
                      Pelanggan Setia
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {String.fromCharCode(65 + index)}
                  </div>
                </div>

                {/* Hover effect border */}
                <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-white/20 transition-colors duration-300" />
              </div>
            ))}
          </div>

          {/* Spacer */}
          <div className="py-4"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-spacing bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="container-fluid relative z-10">
          <div className="text-center mb-16" data-aos="fade-up" data-aos-duration="800">
            <h2 className="heading-primary text-4xl md:text-5xl lg:text-6xl text-white mb-6">
              Mengapa Memilih{" "}
              <span className="text-gradient bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
                Kami?
              </span>
            </h2>
            <p className="heading-secondary text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
              Kami berkomitmen memberikan pengalaman kuliner terbaik dengan kualitas dan pelayanan yang tak tertandingi
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Pelayanan Terbaik */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 p-8 rounded-xl shadow-lg text-center group hover:-translate-y-2 hover:shadow-primary-500/20 transition-all duration-500"
                 data-aos="fade-up" data-aos-delay="200" data-aos-duration="600">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full opacity-0 group-hover:opacity-30 transition-all duration-500 blur-md"></div>
                <div className="relative bg-primary-900/70 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-500 border border-primary-700/50">
                  <Star className="h-10 w-10 text-primary-400 group-hover:text-primary-300 transition-colors duration-500" />
                </div>
              </div>
              <h3 className="heading-secondary text-xl font-bold text-white mb-4 group-hover:text-primary-400 transition-colors duration-300">
                Pelayanan Terbaik
              </h3>
              <p className="text-body text-gray-300 leading-relaxed">
                Siap memberikan pengalaman pelayanan yang terbaik terhadap pelanggan yang baik
              </p>
            </div>

            {/* Quality Food */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 p-8 rounded-xl shadow-lg text-center group hover:-translate-y-2 hover:shadow-secondary-500/20 transition-all duration-500"
                 data-aos="fade-up" data-aos-delay="300" data-aos-duration="600">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-gradient-to-r from-secondary-500 to-secondary-600 rounded-full opacity-0 group-hover:opacity-30 transition-all duration-500 blur-md"></div>
                <div className="relative bg-secondary-900/70 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-500 border border-secondary-700/50">
                  <Utensils className="h-10 w-10 text-secondary-400 group-hover:text-secondary-300 transition-colors duration-500" />
                </div>
              </div>
              <h3 className="heading-secondary text-xl font-bold text-white mb-4 group-hover:text-secondary-400 transition-colors duration-300">
                Kualitas Hidangan
              </h3>
              <p className="text-body text-gray-300 leading-relaxed">
                Nikmati cita rasa autentik lokal dengan resep turun-temurun untuk generasi ke generasi
              </p>
            </div>

            {/* Online Order */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 p-8 rounded-xl shadow-lg text-center group hover:-translate-y-2 hover:shadow-green-500/20 transition-all duration-500"
                 data-aos="fade-up" data-aos-delay="400" data-aos-duration="600">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-green-600 rounded-full opacity-0 group-hover:opacity-30 transition-all duration-500 blur-md"></div>
                <div className="relative bg-green-900/70 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-500 border border-green-700/50">
                  <ShoppingCart className="h-10 w-10 text-green-400 group-hover:text-green-300 transition-colors duration-500" />
                </div>
              </div>
              <h3 className="heading-secondary text-xl font-bold text-white mb-4 group-hover:text-green-400 transition-colors duration-300">
                Pemesanan Online
              </h3>
              <p className="text-body text-gray-300 leading-relaxed">
                Dapatkan pengalaman kuliner yang lebih praktis dengan pemesanan online
              </p>
            </div>

            {/* 24/7 Service */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 p-8 rounded-xl shadow-lg text-center group hover:-translate-y-2 hover:shadow-blue-500/20 transition-all duration-500"
                 data-aos="fade-up" data-aos-delay="500" data-aos-duration="600">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full opacity-0 group-hover:opacity-30 transition-all duration-500 blur-md"></div>
                <div className="relative bg-blue-900/70 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-500 border border-blue-700/50">
                  <Headphones className="h-10 w-10 text-blue-400 group-hover:text-blue-300 transition-colors duration-500" />
                </div>
              </div>
              <h3 className="heading-secondary text-xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors duration-300">
                24/7 Service
              </h3>
              <p className="text-body text-gray-300 leading-relaxed">
                Kami siap mendengarkan anda, hubungi kami melalui kontak yang tersedia
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="section-spacing bg-gradient-to-br from-white-900 to-white-800 relative">
        <div className="absolute inset-0">
          <div className="absolute top-20 right-10 w-64 h-64 bg-primary-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-10 w-80 h-80 bg-secondary-500/5 rounded-full blur-3xl"></div>
        </div>
        <div className="container-fluid relative z-10">
          <div data-aos="fade-up" data-aos-duration="800">
          <AboutUsSection />
          </div>
        </div>
      </section>

      {/* Featured Menu Section */}
      <section className="section-spacing bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute inset-0">
          <div className="absolute top-10 right-10 w-64 h-64 bg-secondary-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-80 h-80 bg-primary-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="container-fluid relative z-10">
          <div className="text-center mb-16" data-aos="fade-up" data-aos-duration="800">
            <h2 className="heading-primary text-4xl md:text-5xl lg:text-6xl text-white mb-6">
              Menu{" "}
              <span className="text-gradient bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
                Best Seller
              </span>
            </h2>
            <p className="heading-secondary text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
              Cicipi hidangan terbaik kami yang telah menjadi favorit pelanggan
            </p>
          </div>

          {bestSellerItems.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {bestSellerItems.map((item, index) => (
                <div key={item._id} 
                       className="group relative bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl shadow-lg overflow-hidden hover:-translate-y-3 hover:shadow-primary-500/20 transition-all duration-500"
                       data-aos="scale-up" data-aos-delay={200 + (index * 100)} data-aos-duration="600">
                    
                    {/* Image Container */}
                    <div className="relative h-64 overflow-hidden">
                    {item.image ? (
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 flex items-center justify-center">
                          <ChefHat className="h-20 w-20 text-primary-300 opacity-80 group-hover:scale-110 transition-transform duration-500 animate-float" />
                        </div>
                      )}
                      
                      {/* Best Seller Badge */}
                      <div className="absolute top-4 right-4">
                        <div className="bg-gradient-to-r from-secondary-500 to-secondary-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg group-hover:scale-110 transition-transform duration-300">
                      BEST SELLER
                    </div>
                  </div>

                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-30 group-hover:opacity-60 transition-opacity duration-300"></div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="heading-secondary text-xl font-bold text-white mb-2 group-hover:text-primary-400 transition-colors duration-300">
                            {item.name}
                          </h3>
                          <p className="text-body text-gray-300 text-sm leading-relaxed line-clamp-2">
                            {item.description}
                          </p>
                        </div>
                        <span className={`ml-3 px-3 py-1 rounded-full text-xs font-semibold flex-shrink-0 ${
                        item.category === 'Makanan' 
                            ? 'bg-primary-900/70 text-primary-300 border border-primary-700/50' 
                            : 'bg-blue-900/70 text-blue-300 border border-blue-700/50'
                      }`}>
                        {item.category}
                      </span>
                    </div>

                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-primary-400">
                          Rp {item.price.toLocaleString('id-ID')}
                        </span>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <Link
                            href="/menu"
                            className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-primary-600 hover:to-primary-700 transition-all duration-300 flex items-center shadow-lg hover:shadow-primary-500/25"
                          >
                            Pesan
                            <ArrowRight className="ml-1 h-4 w-4" />
                          </Link>
                        </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            </>
          ) : (
            <div className="text-center py-20" data-aos="fade-up" data-aos-delay="300">
              <div className="relative inline-block mb-6">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full blur-lg opacity-40 animate-pulse-soft"></div>
                <ChefHat className="relative h-20 w-20 text-primary-400 mx-auto animate-float" />
              </div>
              <h3 className="heading-secondary text-xl text-white mb-2">Menu Best Seller Akan Segera Hadir</h3>
              <p className="text-body text-gray-300">Kami sedang menyiapkan hidangan terbaik untuk Anda</p>
            </div>
          )}

          <div className="text-center" data-aos="fade-up" data-aos-delay="400">
            <Link
              href="/menu"
              className="group relative px-10 py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold text-lg rounded-2xl shadow-2xl hover:shadow-primary-500/25 transition-all duration-500 hover:scale-105 inline-flex items-center"
            >
              <span className="relative z-10 flex items-center justify-center">
              Lihat Semua Menu
                <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
          </div>
        </div>
      </section>

    </MainLayout>
  );
}