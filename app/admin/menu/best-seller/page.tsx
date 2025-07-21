'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Star, ChefHat, AlertCircle, Plus } from 'lucide-react';

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
  const nonBestSellerMenus = availableMenus.filter(item => !bestSellerIds.includes(item._id));
  const bestSellerMenus = availableMenus.filter(item => bestSellerIds.includes(item._id));

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
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Link
            href="/admin/menu"
            className="flex items-center text-gray-600 hover:text-orange-500 transition-colors duration-200"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Kembali ke Menu
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Kelola Best Seller</h1>
            <p className="text-gray-600 mt-2">Pilih maksimal 6 menu terbaik untuk ditampilkan di homepage</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
          <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
          <span className="text-red-700">{error}</span>
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <span className="text-green-700">{success}</span>
        </div>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Menu Tersedia</p>
              <p className="text-3xl font-bold text-gray-900">{availableMenus.length}</p>
            </div>
            <div className="bg-blue-100 rounded-full p-3">
              <ChefHat className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Best Seller Aktif</p>
              <p className="text-3xl font-bold text-gray-900">{bestSellerIds.length}</p>
            </div>
            <div className="bg-yellow-100 rounded-full p-3">
              <Star className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Slot Tersisa</p>
              <p className="text-3xl font-bold text-gray-900">{6 - bestSellerIds.length}</p>
            </div>
            <div className="bg-green-100 rounded-full p-3">
              <Plus className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Current Best Sellers */}
      {bestSellerMenus.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Menu Best Seller Saat Ini</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bestSellerMenus.map((item) => (
              <div key={item._id} className="bg-white rounded-lg shadow-md overflow-hidden border-2 border-yellow-200">
                <div className="h-48 bg-gradient-to-br from-orange-400 to-red-400 flex items-center justify-center relative">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <ChefHat className="h-16 w-16 text-white" />
                  )}
                  <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center">
                    <Star className="h-3 w-3 mr-1" />
                    Best Seller
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.name}</h3>
                  <p className="text-gray-600 text-sm mb-2">{item.description}</p>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xl font-bold text-orange-500">
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
                  <button
                    onClick={() => handleRemoveFromBestSeller(item._id)}
                    className="w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition-colors duration-200"
                  >
                    Hapus dari Best Seller
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Available Menus to Add */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Menu Tersedia untuk Best Seller
          {bestSellerIds.length >= 6 && (
            <span className="text-sm font-normal text-red-600 ml-2">
              (Maksimal 6 best seller tercapai)
            </span>
          )}
        </h2>
        
        {nonBestSellerMenus.length === 0 ? (
          <div className="text-center py-16">
            <Star className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {bestSellerIds.length >= 6 
                ? 'Semua slot best seller sudah terisi' 
                : 'Semua menu sudah menjadi best seller'
              }
            </h3>
            <p className="text-gray-600">
              {bestSellerIds.length >= 6 
                ? 'Hapus salah satu best seller untuk menambah yang baru'
                : 'Tambahkan menu baru untuk menambah pilihan best seller'
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {nonBestSellerMenus.map((item) => (
              <div key={item._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-48 bg-gradient-to-br from-orange-400 to-red-400 flex items-center justify-center">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <ChefHat className="h-16 w-16 text-white" />
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.name}</h3>
                  <p className="text-gray-600 text-sm mb-2">{item.description}</p>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xl font-bold text-orange-500">
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
                  <button
                    onClick={() => handleAddToBestSeller(item._id)}
                    disabled={bestSellerIds.length >= 6}
                    className="w-full bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center"
                  >
                    <Star className="h-4 w-4 mr-2" />
                    Pilih sebagai Best Seller
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}