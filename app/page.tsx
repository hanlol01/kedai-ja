'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChefHat, Star, Clock, MapPin, Phone, ArrowRight, Menu, X, ShoppingCart, Headphones, Utensils, User } from 'lucide-react';
import Footer from '@/app/admin/components/Footer';
import AboutUsSection from '@/components/ui/aboutussection';

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
    const timeoutId = setTimeout(() => {
      setLoading(false);
      setSettings({
        restaurantName: 'Kedai J.A',
        description: 'Nikmati cita rasa autentik Indonesia dengan resep turun-temurun yang telah diwariskan dari generasi ke generasi',
        address: 'Jl. Raya Leles No.45, Garut',
        contact: '081234567890',
        hours: 'Senin - Minggu, 09.00 - 21.00',
        email: 'tes@kedai-ja.com'
      });
    }, 10000); // 10 second timeout

    fetchData().finally(() => {
      clearTimeout(timeoutId);
    });

    return () => clearTimeout(timeoutId);
  }, []);

  const fetchData = async () => {
    try {
      // Set timeout for each fetch
      const fetchWithTimeout = (url: string, timeout = 5000) => {
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
      setLoading(false);
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
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <ChefHat className="h-8 w-8 text-orange-500" />
                <span className="text-xl font-bold text-gray-900">{settings?.restaurantName}</span>
              </Link>
            </div>

            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-gray-700 hover:text-orange-500 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>

            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-orange-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-orange-500"
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
                    className="text-gray-700 hover:text-orange-500 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
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
      <section className="relative bg-gradient-to-br from-orange-400 via-red-400 to-yellow-400 text-white py-20">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mb-8">
              <ChefHat className="h-16 w-16 mx-auto mb-4 text-white" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Selamat Datang di {settings?.restaurantName}
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              {settings?.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/menu"
                className="bg-white text-orange-500 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center"
              >
                Lihat Menu
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                href="/contact"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-orange-500 transition-colors duration-200"
              >
                Hubungi Kami
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Mengapa Memilih Kami?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Kami berkomitmen memberikan pengalaman kuliner terbaik dengan kualitas dan pelayanan yang tak tertandingi
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {/* Pelayanan Terbaik */}
            <div className="bg-white rounded-lg shadow hover:shadow-lg transition p-8 flex flex-col items-center text-center group cursor-pointer hover:bg-orange-500 hover:text-white">
              <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mb-4 group-hover:bg-white group-hover:bg-opacity-20 transition">
                <Star className="h-8 w-8 text-orange-500 group-hover:text-white transition" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-white transition">Pelayanan Terbaik</h3>
              <p className="text-gray-600 group-hover:text-orange-100 transition">
                Siap memberikan pengalaman pelayanan yang terbaik terhadap pelanggan yang baik
              </p>
            </div>
            {/* Quality Food (highlight on hover) */}
            <div className="bg-white rounded-lg shadow hover:shadow-lg transition p-8 flex flex-col items-center text-center group cursor-pointer hover:bg-orange-500 hover:text-white">
              <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mb-4 group-hover:bg-white group-hover:bg-opacity-20 transition">
                <Utensils className="h-8 w-8 text-orange-500 group-hover:text-white transition" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-white transition">Kualitas Hidangan</h3>
              <p className="text-gray-600 group-hover:text-orange-100 transition">
                Nikmati cita rasa autentik lokal dengan resep turun-temurun untuk generasi ke generasi.
              </p>
            </div>
            {/* Online Order */}
            <div className="bg-white rounded-lg shadow hover:shadow-lg transition p-8 flex flex-col items-center text-center group cursor-pointer hover:bg-orange-500 hover:text-white">
              <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mb-4 group-hover:bg-white group-hover:bg-opacity-20 transition">
                <ShoppingCart className="h-8 w-8 text-orange-500 group-hover:text-white transition" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-white transition">Pemesanan Online</h3>
              <p className="text-gray-600 group-hover:text-orange-100 transition">
                Dapatkan pengalaman kuliner yang lebih praktis dengan pemesanan online.
              </p>
            </div>
            {/* 24/7 Service */}
            <div className="bg-white rounded-lg shadow hover:shadow-lg transition p-8 flex flex-col items-center text-center group cursor-pointer hover:bg-orange-500 hover:text-white">
              <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mb-4 group-hover:bg-white group-hover:bg-opacity-20 transition">
                <Headphones className="h-8 w-8 text-orange-500 group-hover:text-white transition" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-white transition">24/7 Service</h3>
              <p className="text-gray-600 group-hover:text-orange-100 transition">
                Kami siap mendengarkan anda, hubungi kami melalui tombol Chatbot di bawah ini.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AboutUsSection />
        </div>
      </section>

      {/* Featured Menu Section */}
      <section className="py-16 bg-gradient-to-br from-yellow-50 via-orange-100 to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
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
              {bestSellerItems.map((item) => (
                <div key={item._id} className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300 border-2 border-orange-100 relative group">
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
            <div className="text-center py-12">
              <ChefHat className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Menu best seller akan segera hadir</p>
            </div>
          )}

          <div className="text-center">
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