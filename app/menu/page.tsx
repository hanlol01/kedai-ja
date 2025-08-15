'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChefHat, Filter, ArrowLeft, ArrowRight } from 'lucide-react';
import MainLayout from '@/components/ui/MainLayout';

interface MenuItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: 'Makanan' | 'Minuman';
  subCategory: string;
  image?: string;
  available: boolean;
}

export default function Menu() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMenuItems();
  }, []);

  useEffect(() => {
    filterItems();
  }, [selectedCategory, menuItems]);

  const fetchMenuItems = async () => {
    try {
      // Set timeout untuk fetch yang lebih singkat
      const fetchWithTimeout = (url: string, timeout = 1500) => {
        return Promise.race([
          fetch(url),
          new Promise<Response>((_, reject) =>
            setTimeout(() => reject(new Error('Timeout')), timeout)
          )
        ]);
      };
      
      // Gunakan default data kosong untuk mempercepat rendering
      setMenuItems([]);
      
      try {
        const response = await fetchWithTimeout('/api/menu');
        const data = await response.json();
        // Tampilkan semua menu items, tidak hanya yang available
        setMenuItems(data.menuItems || []);
      } catch (timeoutError) {
        console.log('Timeout fetching menu items, trying again...');
        // Coba sekali lagi dengan timeout yang lebih lama
        try {
          const response = await fetch('/api/menu');
          const data = await response.json();
          setMenuItems(data.menuItems || []);
        } catch (retryError) {
          console.error('Error on retry:', retryError);
        }
      }
    } catch (error) {
      console.error('Error fetching menu items:', error);
    } finally {
      // Pastikan loading state dimatikan dalam waktu maksimal 2 detik
      setTimeout(() => {
        setLoading(false);
      }, 1500);
    }
  };

  const filterItems = () => {
    if (selectedCategory === 'all') {
      setFilteredItems(menuItems);
    } else {
      setFilteredItems(menuItems.filter(item => item.category === selectedCategory));
    }
  };

  const categories = [
    { id: 'all', name: 'Semua Menu' },
    { id: 'Makanan', name: 'Makanan' },
    { id: 'Minuman', name: 'Minuman' },
  ];

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="relative mx-auto">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-200/20 border-t-primary-500 mx-auto"></div>
              <div className="absolute inset-0 rounded-full h-16 w-16 border-4 border-transparent border-t-secondary-400/50 animate-pulse mx-auto"></div>
            </div>
            <p className="mt-6 text-gray-300">Memuat menu...</p>
            <p className="text-sm text-gray-400">Menyiapkan koleksi hidangan terbaik</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container-fluid py-12">
        {/* Hero Section for Menu */}
        <div className="text-center mb-16 relative">

          <div className="flex items-center justify-center mb-8">
          </div>

          <h1 className="heading-primary text-5xl md:text-6xl lg:text-7xl text-white mb-6">
            Menu{" "}
            <span className="text-gradient bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
              Kami
            </span>
          </h1>
          <p className="heading-secondary text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-8">
            Jelajahi koleksi hidangan autentik Indonesia yang telah menjadi favorit pelanggan
          </p>
          
          {/* Stats */}
          <div className="flex justify-center items-center space-x-8 text-gray-300">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-400">{filteredItems.length}</div>
              <div className="text-sm">Hidangan</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-secondary-400">100%</div>
              <div className="text-sm">Autentik</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">4.8★</div>
              <div className="text-sm">Rating</div>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`group relative px-6 py-3 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                selectedCategory === category.id
                  ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-xl shadow-primary-500/25'
                  : 'bg-white/10 text-gray-200 border-2 border-white/20 hover:border-primary-400/50 hover:text-primary-300 hover:shadow-lg'
              }`}
            >
              <div className="flex items-center">
                <Filter className={`mr-2 h-4 w-4 transition-transform duration-300 ${
                  selectedCategory === category.id ? 'rotate-180' : 'group-hover:rotate-12'
                }`} />
                {category.name}
              </div>
              {selectedCategory !== category.id && (
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              )}
            </button>
          ))}
        </div>

        {/* Menu Items */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-20">
            <div className="relative inline-block mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full blur-lg opacity-40 animate-pulse"></div>
              <ChefHat className="relative h-20 w-20 text-white/70 mx-auto" />
            </div>
            <h3 className="heading-secondary text-2xl font-bold text-white mb-4">Belum Ada Menu Tersedia</h3>
            <p className="text-body text-gray-300 max-w-md mx-auto mb-8">
              Menu untuk kategori ini sedang dalam persiapan. Silahkan coba kategori lain atau kembali lagi nanti.
            </p>
            <button
              onClick={() => setSelectedCategory('all')}
              className="group inline-flex items-center space-x-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-3 rounded-xl hover:from-primary-600 hover:to-primary-700 hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              <span className="font-medium">Lihat Semua Menu</span>
            </button>
          </div>
        ) : (
          <>
            {/* Mobile: Modern Card List */}
            <div className="block lg:hidden">
              <div className="space-y-4">
                {filteredItems.map((item, index) => (
                  <div key={item._id} 
                       className={`group bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${!item.available ? 'opacity-75' : ''}`}>
                    <div className="flex">
                      {/* Image */}
                      <div className="relative w-24 h-24 flex-shrink-0">
                        {item.image ? (
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" 
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center">
                            <ChefHat className="h-8 w-8 text-white" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 p-4 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="heading-secondary text-lg font-bold text-white group-hover:text-primary-300 transition-colors duration-300 line-clamp-1">
                              {item.name}
                            </h3>
                            <span className={`ml-2 px-2 py-1 rounded-full text-xs font-semibold flex-shrink-0 ${
                              item.category === 'Makanan' 
                                ? 'bg-primary-900/70 text-primary-300' 
                                : 'bg-blue-900/70 text-blue-300'
                            }`}>
                              {item.category}
                            </span>
                          </div>
                          <p className="text-body text-gray-300 text-sm line-clamp-2 mb-3">
                            {item.description}
                          </p>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-xl font-bold text-primary-400">
                            Rp {typeof item.price === 'number' ? item.price.toLocaleString('id-ID') : '0'}
                          </span>
                          <div className={`flex items-center text-sm font-medium ${
                            item.available ? 'text-green-400' : 'text-red-400'
                          }`}>
                            <div className={`w-2 h-2 rounded-full mr-2 ${
                              item.available ? 'bg-green-400' : 'bg-red-400'
                            }`}></div>
                            {item.available ? 'Tersedia' : 'Habis'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Desktop: Modern Grid */}
            <div className="hidden lg:grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
              {filteredItems.map((item, index) => (
                <div key={item._id} 
                     className={`group bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:-translate-y-2 hover:shadow-2xl transition-all duration-500 ${!item.available ? 'opacity-75' : ''}`}>
                  
                  {/* Image Container */}
                  <div className="relative h-64 overflow-hidden">
                    {item.image ? (
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary-400 via-secondary-400 to-primary-500 flex items-center justify-center">
                        <ChefHat className="h-20 w-20 text-white opacity-80 group-hover:scale-110 transition-transform duration-500" />
                      </div>
                    )}
                    
                    {/* Availability Badge */}
                    <div className="absolute top-4 left-4">
                      <div className={`px-3 py-1 rounded-full text-xs font-bold shadow-lg ${
                        item.available 
                          ? 'bg-green-500/80 text-white' 
                          : 'bg-red-500/80 text-white'
                      }`}>
                        {item.available ? 'Tersedia' : 'Habis'}
                      </div>
                    </div>

                    {/* Category Badge */}
                    <div className="absolute top-4 right-4">
                      <div className={`px-3 py-1 rounded-full text-xs font-bold shadow-lg ${
                        item.category === 'Makanan' 
                          ? 'bg-primary-500/80 text-white' 
                          : 'bg-blue-500/80 text-white'
                      }`}>
                        {item.category}
                      </div>
                    </div>

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="mb-4">
                      <h3 className="heading-secondary text-xl font-bold text-white mb-2 group-hover:text-primary-300 transition-colors duration-300">
                        {item.name}
                      </h3>
                      <p className="text-body text-gray-300 leading-relaxed line-clamp-3">
                        {item.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-primary-400">
                        Rp {typeof item.price === 'number' ? item.price.toLocaleString('id-ID') : '0'}
                      </span>
                      
                      {item.available && (
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <button className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-primary-600 hover:to-primary-700 transition-colors duration-300 flex items-center">
                            Pesan
                            <ArrowRight className="ml-1 h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      
    </MainLayout>
  );
}