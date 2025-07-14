'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChefHat, Star, Clock, MapPin, Phone, ArrowRight, Menu, X } from 'lucide-react';
import Chatbot from "@/components/ui/chatbot";

interface MenuItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: 'Makanan' | 'Minuman';
  image?: string;
  available: boolean;
}

interface Settings {
  restaurantName: string;
  description: string;
  address: string;
  contact: string;
  hours: string;
}

export default function Home() {
  const [featuredItems, setFeaturedItems] = useState<MenuItem[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [menuResponse, settingsResponse] = await Promise.all([
        fetch('/api/menu').catch(() => ({ ok: false, json: () => Promise.resolve({ menuItems: [] }) })),
        fetch('/api/settings').catch(() => ({ ok: false, json: () => Promise.resolve({ settings: null }) }))
      ]);

      const menuData = await menuResponse.json();
      const settingsData = await settingsResponse.json();

      const availableItems = menuData.menuItems?.filter((item: MenuItem) => item.available) || [];
      setFeaturedItems(availableItems.slice(0, 3));
      setSettings(settingsData.settings || {
        restaurantName: 'Kedai J.A',
        description: 'Nikmati cita rasa autentik Indonesia dengan resep turun-temurun yang telah diwariskan dari generasi ke generasi',
        address: 'Jl. Raya Leles No.45, Garut',
        contact: '081234567890',
        hours: 'Senin - Minggu, 09.00 - 21.00'
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setSettings({
        restaurantName: 'Kedai J.A',
        description: 'Nikmati cita rasa autentik Indonesia dengan resep turun-temurun yang telah diwariskan dari generasi ke generasi',
        address: 'Jl. Raya Leles No.45, Garut',
        contact: '081234567890',
        hours: 'Senin - Minggu, 09.00 - 21.00'
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <ChefHat className="h-8 w-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Resep Autentik</h3>
              <p className="text-gray-600">
                Menggunakan resep turun-temurun yang telah diwariskan dari generasi ke generasi
              </p>
            </div>

            <div className="text-center">
              <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Kualitas Terjamin</h3>
              <p className="text-gray-600">
                Menggunakan bahan-bahan segar dan berkualitas tinggi untuk setiap hidangan
              </p>
            </div>

            <div className="text-center">
              <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Pelayanan Cepat</h3>
              <p className="text-gray-600">
                Melayani dengan cepat dan ramah untuk memberikan pengalaman terbaik
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Menu Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Menu Unggulan
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Cicipi hidangan terbaik kami yang telah menjadi favorit pelanggan
            </p>
          </div>

          {featuredItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {featuredItems.map((item) => (
                <div key={item._id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  <div className="h-48 bg-gradient-to-br from-orange-400 to-red-400 flex items-center justify-center">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <ChefHat className="h-16 w-16 text-white" />
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.name}</h3>
                    <p className="text-gray-600 mb-4">{item.description}</p>
                    <div className="flex items-center justify-between">
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
          ) : (
            <div className="text-center py-12">
              <ChefHat className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Menu unggulan akan segera hadir</p>
            </div>
          )}

          <div className="text-center">
            <Link
              href="/menu"
              className="bg-orange-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors duration-200 inline-flex items-center"
            >
              Lihat Semua Menu
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Info Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Kunjungi Kami
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Kami siap melayani Anda dengan sepenuh hati
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                <MapPin className="h-6 w-6 text-orange-500 mr-3" />
                <h3 className="text-xl font-semibold">Alamat</h3>
              </div>
              <p className="text-gray-300">
                {settings?.address}
              </p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                <Phone className="h-6 w-6 text-orange-500 mr-3" />
                <h3 className="text-xl font-semibold">Telepon</h3>
              </div>
              <p className="text-gray-300">
                {settings?.contact}
              </p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                <Clock className="h-6 w-6 text-orange-500 mr-3" />
                <h3 className="text-xl font-semibold">Jam Buka</h3>
              </div>
              <p className="text-gray-300">
                {settings?.hours}
              </p>
            </div>
          </div>

          <div className="text-center mt-8">
            <Link
              href="/contact"
              className="bg-orange-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors duration-200 inline-flex items-center"
            >
              Info Lengkap
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <ChefHat className="h-8 w-8 text-orange-500 mr-2" />
              <span className="text-xl font-bold">{settings?.restaurantName}</span>
            </div>
            <p className="text-gray-400 mb-4">
              &copy; 2024 {settings?.restaurantName}. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      <Chatbot />
    </div>
  );
}