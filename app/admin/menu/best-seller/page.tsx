'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Star, ChefHat, AlertCircle, Plus, X, Search, Filter } from 'lucide-react';

interface MenuItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: 'Makanan' | 'Minuman';
  image?: string;
  available: boolean;
}

export default function BestSellerManagement() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [bestSellerIds, setBestSellerIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'Makanan' | 'Minuman'>('all');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch semua menu items
      const menuResponse = await fetch('/api/menu');
      const menuData = await menuResponse.json();
      
      // Fetch best sellers untuk mengetahui mana yang sudah dipilih
      const bestSellerResponse = await fetch('/api/menu/best-seller');
      const bestSellerData = await bestSellerResponse.json();
      
      setMenuItems(menuData.menuItems || []);
      setBestSellerIds(bestSellerData.bestSellers?.map((item: MenuItem) => item._id) || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Gagal memuat data');
      setLoading(false);
    }
  };

  const handleAddToBestSeller = async (menuId: string) => {
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/menu/best-seller', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ menuId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Gagal menambahkan ke best seller');
      }

      setSuccess('Menu berhasil ditambahkan ke best seller');
      setBestSellerIds(prev => [...prev, menuId]);
      setShowAddModal(false);
      setSearchQuery('');
      setSelectedCategory('all');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Terjadi kesalahan');
    }
  };

  const handleRemoveFromBestSeller = async (menuId: string) => {
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`/api/menu/best-seller/${menuId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Gagal menghapus dari best seller');
      }

      setSuccess('Menu berhasil dihapus dari best seller');
      setBestSellerIds(prev => prev.filter(id => id !== menuId));
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Terjadi kesalahan');
    }
  };

  // Filter menu yang tersedia
  const availableMenus = menuItems.filter(item => item.available);
  const bestSellerMenus = availableMenus.filter(item => bestSellerIds.includes(item._id));
  
  // Filter menu untuk modal dengan search dan category
  const filteredMenusForModal = availableMenus
    .filter(item => !bestSellerIds.includes(item._id))
    .filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           item.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat data menu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-4">
          <Link
            href="/admin/menu"
            className="inline-flex items-center bg-blue-100 hover:bg-orange-100 text-gray-700 hover:text-orange-600 px-4 py-2 rounded-lg font-semibold shadow transition-colors duration-200"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Kembali ke Menu
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Kelola Best Seller</h1>
            <p className="text-gray-600 mt-2 text-sm sm:text-base">Pilih maksimal 6 menu terbaik untuk ditampilkan di homepage</p>
          </div>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          disabled={bestSellerIds.length >= 6}
          className="bg-orange-500 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 w-full sm:w-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Tambah Best Seller</span>
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
          <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
          <span className="text-red-700 text-sm">{error}</span>
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <span className="text-green-700 text-sm">{success}</span>
        </div>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">Total Menu Tersedia</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">{availableMenus.length}</p>
            </div>
            <div className="bg-blue-100 rounded-full p-2 sm:p-3">
              <ChefHat className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">Best Seller Aktif</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">{bestSellerIds.length}</p>
            </div>
            <div className="bg-yellow-100 rounded-full p-2 sm:p-3">
              <Star className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">Slot Tersisa</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">{6 - bestSellerIds.length}</p>
            </div>
            <div className="bg-green-100 rounded-full p-2 sm:p-3">
              <Plus className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Current Best Sellers - Mobile Responsive Cards */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">Menu Best Seller Saat Ini</h2>
        </div>
        
        {bestSellerMenus.length === 0 ? (
          <div className="text-center py-12">
            <Star className="h-12 sm:h-16 w-12 sm:w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Belum ada best seller</h3>
            <p className="text-gray-600 text-sm sm:text-base">Klik "Tambah Best Seller" untuk menambah menu favorit</p>
          </div>
        ) : (
          <div className="p-4 sm:p-6">
            <div className="space-y-4">
              {bestSellerMenus.map((item) => (
                <div key={item._id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex-col sm:flex-row sm:items-center sm:space-x-4 sm:space-y-0 space-y-2">
                  <div className="h-16 w-16 sm:h-20 sm:w-20 flex-shrink-0">
                    {item.image ? (
                      <img className="h-16 w-16 sm:h-20 sm:w-20 rounded-lg object-cover" src={item.image} alt={item.name} />
                    ) : (
                      <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-lg bg-gradient-to-br from-orange-400 to-red-400 flex items-center justify-center">
                        <ChefHat className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0 w-full flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="text-sm sm:text-base font-semibold text-gray-900 truncate">{item.name}</h3>
                        <Star className="h-4 w-4 text-yellow-400 fill-current flex-shrink-0" />
                      </div>
                      <p className="text-xs sm:text-sm text-gray-500 truncate mb-2">{item.description}</p>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm sm:text-base font-bold text-orange-500">
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
                    <div className="mt-2 sm:mt-0 sm:ml-4 flex-shrink-0 flex items-center justify-end">
                      <button
                        onClick={() => handleRemoveFromBestSeller(item._id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add Best Seller Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">Pilih Menu untuk Best Seller</h2>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            {/* Search and Filter */}
            <div className="p-4 sm:p-6 border-b border-gray-200 space-y-4">
              {/* Search Input */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Cari menu..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm text-black"
                />
              </div>
              
              {/* Category Filter */}
              <div className="flex flex-wrap gap-2">
                <span className="text-sm font-medium text-gray-700 flex items-center">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter:
                </span>
                {[
                  { id: 'all', name: 'Semua Menu' },
                  { id: 'Makanan', name: 'Makanan' },
                  { id: 'Minuman', name: 'Minuman' }
                ].map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id as 'all' | 'Makanan' | 'Minuman')}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${
                      selectedCategory === category.id
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="p-4 sm:p-6 overflow-y-auto max-h-[50vh]">
              {filteredMenusForModal.length === 0 ? (
                <div className="text-center py-12">
                  <Star className="h-12 sm:h-16 w-12 sm:w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                    {searchQuery || selectedCategory !== 'all' 
                      ? 'Tidak ada menu yang sesuai filter'
                      : bestSellerIds.length >= 6 
                        ? 'Semua slot best seller sudah terisi' 
                        : 'Semua menu sudah menjadi best seller'
                    }
                  </h3>
                  <p className="text-gray-600 text-sm sm:text-base">
                    {searchQuery || selectedCategory !== 'all'
                      ? 'Coba ubah kata kunci pencarian atau filter kategori'
                      : bestSellerIds.length >= 6 
                        ? 'Hapus salah satu best seller untuk menambah yang baru'
                        : 'Tambahkan menu baru untuk menambah pilihan best seller'
                    }
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredMenusForModal.map((item) => (
                    <div key={item._id} className="flex items-center space-x-4 p-3 sm:p-4 border border-gray-200 rounded-lg hover:border-orange-300 transition-colors duration-200">
                      <div className="h-12 w-12 sm:h-16 sm:w-16 flex-shrink-0">
                        {item.image ? (
                          <img className="h-12 w-12 sm:h-16 sm:w-16 rounded-lg object-cover" src={item.image} alt={item.name} />
                        ) : (
                          <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-lg bg-gradient-to-br from-orange-400 to-red-400 flex items-center justify-center">
                            <ChefHat className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm sm:text-base font-semibold text-gray-900 truncate">{item.name}</h3>
                        <p className="text-xs sm:text-sm text-gray-600 truncate">{item.description}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-sm sm:text-base font-bold text-orange-500">
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
                      <button
                        onClick={() => handleAddToBestSeller(item._id)}
                        disabled={bestSellerIds.length >= 6}
                        className="ml-2 bg-yellow-500 text-white py-2 px-3 sm:px-4 rounded-lg hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center text-xs sm:text-sm font-medium flex-shrink-0"
                      >
                        <Star className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                        Pilih
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}