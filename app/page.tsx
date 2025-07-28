'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChefHat, Star, Clock, MapPin, Phone, ArrowRight, Menu, X, ShoppingCart, Headphones, Utensils, User } from 'lucide-react';
import Footer from '@/app/admin/components/Footer';
import AboutUsSection from '@/components/ui/aboutussection';
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

export default function Home() {
  const [bestSellerItems, setBestSellerItems] = useState<MenuItem[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    // Initialize AOS
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true,
      offset: 100,
    });

    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Set timeout for each fetch
      const fetchWithTimeout = (url: string, timeout = 3000) => {
        return Promise.race([
          fetch(url),
          new Promise<Response>((_, reject) => 
            setTimeout(() => reject(new Error('Timeout')), timeout)
          )
        ]);
      };

      const [bestSellerResponse, settingsResponse] = await Promise.allSettled([
        fetchWithTimeout('/api/menu/best-seller').then(res => res.json()).catch(() => ({ 
          success: true, 
          bestSellers: [] 
        })),
        fetchWithTimeout('/api/settings').then(res => res.json()).catch(() => ({ 
          success: true, 
          settings: {
            restaurantName: 'Kedai J.A',
            description: 'Nikmati cita rasa autentik Indonesia dengan resep turun-temurun yang telah diwariskan dari generasi ke generasi',
            address: 'Jl. Raya Leles No.45, Garut',
            contact: '081234567890',
            hours: 'Senin - Minggu, 09.00 - 21.00',
            email: 'info@kedai-ja.com'
          }
        }))
      ]);

      const bestSellerData = bestSellerResponse.status === 'fulfilled' ? bestSellerResponse.value : { success: true, bestSellers: [] };
      const settingsData = settingsResponse.status === 'fulfilled' ? settingsResponse.value : { 
        success: true, 
        settings: {
          restaurantName: 'Kedai J.A',
          description: 'Nikmati cita rasa autentik Indonesia dengan resep turun-temurun yang telah diwariskan dari generasi ke generasi',
          address: 'Jl. Raya Leles No.45, Garut',
          contact: '081234567890',
          hours: 'Senin - Minggu, 09.00 - 21.00',
          email: 'info@kedai-ja.com'
        }
      };

      // Set best seller items dari API best-seller
      setBestSellerItems(bestSellerData.bestSellers || []);
      setSettings(settingsData.settings || {
        restaurantName: 'Kedai J.A',
        description: 'Nikmati cita rasa autentik Indonesia dengan resep turun-temurun yang telah diwariskan dari generasi ke generasi',
        address: 'Jl. Raya Leles No.45, Garut',
        contact: '081234567890',
        hours: 'Senin - Minggu, 09.00 - 21.00',
        email: 'info@kedai-ja.com'
      });
      
    } catch (error) {
      console.error('Error fetching data:', error);
      setBestSellerItems([]);
      setSettings({
        restaurantName: 'Kedai J.A',
        description: 'Nikmati cita rasa autentik Indonesia dengan resep turun-temurun yang telah diwariskan dari generasi ke generasi',
        address: 'Jl. Raya Leles No.45, Garut',
        contact: '081234567890',
        hours: 'Senin - Minggu, 09.00 - 21.00',
        email: 'info@kedai-ja.com'
      });
    } finally {
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat halaman...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="bg-gray-900 text-white shadow-md sticky top-0 z-50" data-aos="fade-down">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <img src="/logo-bg.png" alt="Logo Kedai J.A" className="h-8 w-8" style={{objectFit: 'contain'}} />
                <span className="text-xl font-bold text-white">{settings?.restaurantName}</span>
              </Link>
            </div>

            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-gray-300 hover:text-orange-400 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>

            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-300 hover:text-orange-400 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-orange-500"
              >
                {isMenuOpen ? (
                  <X className="block h-6 w-6" />
                ) : (
                  <Menu className="block h-6 w-6" />
                )}
              </button>
            </div>
          </div>

          {isMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-gray-300 hover:text-orange-400 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section
        className="relative bg-gradient-to-br from-orange-400 via-red-400 to-yellow-400 text-white py-2 min-h-[320px] md:py-20 md:min-h-[400px] flex items-start justify-center"
        style={{
          backgroundImage: "url('/hero-bg(3).jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
        data-aos="fade-up"
      >
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 mt-0 md:mt-0 w-full">
          <div className="text-center">
            <div className="mb-8" data-aos="zoom-in" data-aos-delay="200">
              <img
                src="/logo-bg.png"
                alt="Logo Kedai J.A"
                className="h-20 w-20 mx-auto mb-6 drop-shadow-lg"
                style={{objectFit: 'contain'}}
              />
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 drop-shadow-2xl tracking-tight leading-tight" 
                style={{textShadow: '1px 1px 6px rgba(0,0,0,0.3)'}}
                data-aos="fade-up" data-aos-delay="300">
              Selamat Datang di <span className="text-yellow-200">Kedai J.A</span>
            </h1>
            <p className="text-2xl md:text-3xl mb-8 max-w-4xl mx-auto font-medium leading-relaxed drop-shadow-lg text-gray-100" 
               style={{textShadow: '1px 1px 6px rgba(0,0,0,0.3)'}}
               data-aos="fade-up" data-aos-delay="400">
              {settings?.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center" data-aos="fade-up" data-aos-delay="500">
              <Link
                href="/menu"
                className="w-56 px-0 py-4 rounded-xl font-bold text-lg border-2 border-white/90 bg-white/10 backdrop-blur-sm text-white hover:bg-white hover:text-orange-600 hover:shadow-2xl hover:scale-105 transition-all duration-300 shadow-xl flex items-center justify-center"
                style={{textShadow: '1px 1px 6px rgba(0,0,0,0.3)'}}
              >
                Lihat Menu
                <ArrowRight className="ml-3 h-6 w-6" />
              </Link>
              <Link
                href="/contact"
                className="w-56 px-0 py-4 rounded-xl font-bold text-lg border-2 border-white/90 bg-white/10 backdrop-blur-sm text-white hover:bg-white hover:text-orange-600 hover:shadow-2xl hover:scale-105 transition-all duration-300 shadow-xl flex items-center justify-center"
                style={{textShadow: '1px 1px 6px rgba(0,0,0,0.3)'}}
              >
                Hubungi Kami
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50" data-aos="fade-up">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12" data-aos="fade-up" data-aos-delay="100">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Mengapa Memilih Kami?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Kami berkomitmen memberikan pengalaman kuliner terbaik dengan kualitas dan pelayanan yang tak tertandingi
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {/* Pelayanan Terbaik */}
            <div className="bg-white rounded-lg shadow hover:shadow-lg transition p-8 flex flex-col items-center text-center group cursor-pointer hover:bg-orange-500 hover:text-white"
                 data-aos="fade-up" data-aos-delay="200">
              <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mb-4 group-hover:bg-white group-hover:bg-opacity-20 transition">
                <Star className="h-8 w-8 text-orange-500 group-hover:text-white transition" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-white transition">Pelayanan Terbaik</h3>
              <p className="text-gray-600 group-hover:text-orange-100 transition">
                Siap memberikan pengalaman pelayanan yang terbaik terhadap pelanggan yang baik
              </p>
            </div>
            {/* Quality Food (highlight on hover) */}
            <div className="bg-white rounded-lg shadow hover:shadow-lg transition p-8 flex flex-col items-center text-center group cursor-pointer hover:bg-orange-500 hover:text-white"
                 data-aos="fade-up" data-aos-delay="300">
              <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mb-4 group-hover:bg-white group-hover:bg-opacity-20 transition">
                <Utensils className="h-8 w-8 text-orange-500 group-hover:text-white transition" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-white transition">Kualitas Hidangan</h3>
              <p className="text-gray-600 group-hover:text-orange-100 transition">
                Nikmati cita rasa autentik lokal dengan resep turun-temurun untuk generasi ke generasi.
              </p>
            </div>
            {/* Online Order */}
            <div className="bg-white rounded-lg shadow hover:shadow-lg transition p-8 flex flex-col items-center text-center group cursor-pointer hover:bg-orange-500 hover:text-white"
                 data-aos="fade-up" data-aos-delay="400">
              <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mb-4 group-hover:bg-white group-hover:bg-opacity-20 transition">
                <ShoppingCart className="h-8 w-8 text-orange-500 group-hover:text-white transition" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-white transition">Pemesanan Online</h3>
              <p className="text-gray-600 group-hover:text-orange-100 transition">
                Dapatkan pengalaman kuliner yang lebih praktis dengan pemesanan online.
              </p>
            </div>
            {/* 24/7 Service */}
            <div className="bg-white rounded-lg shadow hover:shadow-lg transition p-8 flex flex-col items-center text-center group cursor-pointer hover:bg-orange-500 hover:text-white"
                 data-aos="fade-up" data-aos-delay="500">
              <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mb-4 group-hover:bg-white group-hover:bg-opacity-20 transition">
                <Headphones className="h-8 w-8 text-orange-500 group-hover:text-white transition" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-white transition">24/7 Service</h3>
              <p className="text-gray-600 group-hover:text-orange-100 transition">
                Kami siap mendengarkan anda, hubungi kami melalui kontak yang tersedia.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="py-16 bg-white" data-aos="fade-up">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AboutUsSection />
        </div>
      </section>

      {/* Featured Menu Section */}
      <section className="py-16 bg-gradient-to-br from-yellow-50 via-orange-100 to-pink-50" data-aos="fade-up">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12" data-aos="fade-up" data-aos-delay="100">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Menu Best Seller
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Cicipi hidangan terbaik kami yang telah menjadi favorit pelanggan
            </p>
          </div>

          {bestSellerItems.length > 0 ? (
            <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-12">
              {bestSellerItems.map((item, index) => (
                <div key={item._id} 
                     className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300 border-2 border-orange-100 relative group"
                     data-aos="fade-up" data-aos-delay={200 + (index * 100)}>
                  <div className="h-48 bg-gradient-to-br from-orange-400 to-pink-400 flex items-center justify-center relative">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <ChefHat className="h-16 w-16 text-white opacity-80" />
                    )}
                    <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold shadow group-hover:scale-110 transition-transform">
                      BEST SELLER
                    </div>
                  </div>
                  <div className="p-6 flex flex-col h-48 justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-1 truncate">{item.name}</h3>
                      <p className="text-gray-600 mb-3 text-sm truncate">{item.description}</p>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-2xl font-bold text-orange-500">
                        Rp {item.price.toLocaleString('id-ID')}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        item.category === 'Makanan' 
                          ? 'bg-orange-100 text-orange-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {item.category}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            </>
          ) : (
            <div className="text-center py-12" data-aos="fade-up" data-aos-delay="300">
              <ChefHat className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Menu best seller akan segera hadir</p>
            </div>
          )}

          <div className="text-center" data-aos="fade-up" data-aos-delay="400">
            <Link
              href="/menu"
              className="bg-orange-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors duration-200 inline-flex items-center shadow-lg"
            >
              Lihat Semua Menu
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}