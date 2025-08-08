'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChefHat, Filter, ArrowLeft } from 'lucide-react';
import Footer from '@/components/ui/Footer';

interface MenuItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: 'Makanan' | 'Minuman';
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
      const response = await fetch('/api/menu');
      const data = await response.json();
      // Tampilkan semua menu items, tidak hanya yang available
      setMenuItems(data.menuItems || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching menu items:', error);
      setLoading(false);
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat menu...</p>
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
              <img src="/logo-bg.png" alt="Logo Kedai J.A" className="h-8 w-8 mr-2" style={{objectFit: 'contain'}} />
              <span className="text-xl font-bold text-gray-900">Menu Kedai J.A</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Menu Kami
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Jelajahi koleksi hidangan autentik Indonesia yang telah menjadi favorit pelanggan
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-200 ${
                selectedCategory === category.id
                  ? 'bg-orange-500 text-white shadow-lg'
                  : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-orange-500 hover:text-orange-500'
              }`}
            >
              <Filter className="inline-block mr-2 h-4 w-4" />
              {category.name}
            </button>
          ))}
        </div>

        {/* Menu Items */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-16">
            <ChefHat className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Belum ada menu tersedia</h3>
            <p className="text-gray-600">Menu untuk kategori ini akan segera hadir.</p>
          </div>
        ) : (
          <>
            {/* Mobile: List minimalis */}
            <div className="block md:hidden">
              <ul className="space-y-3">
                {filteredItems.map((item) => (
                  <li key={item._id} className={`bg-white rounded-xl shadow-sm px-3 py-3 border border-gray-100 ${!item.available ? 'opacity-75' : ''}`}>
                    {/* Baris atas: gambar, info utama sejajar */}
                    <div className="flex items-center w-full">
                      <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 border mr-3">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <ChefHat className="h-8 w-8 text-orange-400 mx-auto my-auto" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col sm:flex-row">
                        <div className="flex-1 min-w-0">
                          <span className="font-bold text-gray-900 text-base truncate block">{item.name}</span>
                        </div>
                        <div className="flex flex-col items-end ml-2 min-w-[90px]">
                          <span className="text-orange-500 font-bold text-base">{typeof item.price === 'number' ? `Rp ${item.price.toLocaleString('id-ID')}` : ''}</span>
                          <span className={`text-xs mt-1 px-2 py-0.5 rounded-full font-semibold ${item.category === 'Makanan' ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800'}`}>{item.category}</span>
                          <span className={`text-xs flex items-center mt-0.5 ${item.available ? 'text-green-600' : 'text-red-600'}`}>
                            <span className={`w-2 h-2 rounded-full mr-1 ${item.available ? 'bg-green-500' : 'bg-red-500'}`}></span>
                            {item.available ? 'Tersedia' : 'Habis'}
                          </span>
                        </div>
                      </div>
                    </div>
                    {/* Deskripsi di bawah baris atas */}
                    <div className="mt-1">
                      <span className="block text-xs text-gray-500 max-w-full whitespace-normal break-words leading-snug">{item.description}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            {/* Desktop: Grid */}
            <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredItems.map((item) => (
                <div key={item._id} className={`bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 ${!item.available ? 'opacity-75' : ''}`}>
                  <div className="h-48 bg-gradient-to-br from-orange-400 to-red-400 flex items-center justify-center">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <ChefHat className="h-16 w-16 text-white" />
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">{item.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        item.category === 'Makanan' 
                          ? 'bg-orange-100 text-orange-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {item.category}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-4">{item.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-orange-500">
                        Rp {typeof item.price === 'number' ? item.price.toLocaleString('id-ID') : '0'}
                      </span>
                      <div className={`flex items-center ${item.available ? 'text-green-600' : 'text-red-600'}`}>
                        <div className={`w-2 h-2 rounded-full mr-2 ${item.available ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <span className="text-sm font-medium">{item.available ? 'Tersedia' : 'Habis'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      
      <Footer />
    </div>
  );
}