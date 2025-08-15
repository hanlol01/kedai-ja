'use client';

import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, ChefHat, AlertCircle, X, Star, Search, Filter as FilterIcon, ArrowUpDown } from 'lucide-react';
import Link from 'next/link';

// Sub kategori options berdasarkan kategori
const SUB_CATEGORY_OPTIONS = {
  Makanan: ['Menu Paket', 'Nusantara', 'Rice Bowl', 'Mie', 'Additional Menu', 'Aneka Tumis', 'Snack'],
  Minuman: ['Coffee', 'Non Coffee', 'Tea', 'Smoothies', 'Soda', 'Fruit', 'Milkshake']
};

interface MenuItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: 'Makanan' | 'Minuman';
  subCategory: string;
  image?: string;
  available: boolean;
  createdAt?: string | Date;
}

interface MenuFormData {
  name: string;
  description: string;
  price: number;
  category: 'Makanan' | 'Minuman';
  subCategory: string;
  image: string;
  available: boolean;
}

export default function AdminMenu() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [formData, setFormData] = useState<MenuFormData>({
    name: '',
    description: '',
    price: 0,
    category: 'Makanan',
    subCategory: '',
    image: '',
    available: true,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  // Tambahkan state baru untuk file gambar
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<'all' | 'Makanan' | 'Minuman'>('all');
  const [filterSubCategory, setFilterSubCategory] = useState<string>('all');
  const [showImageModal, setShowImageModal] = useState(false);
  const [modalImageSrc, setModalImageSrc] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc'); // asc = terlama dulu
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 20;

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const response = await fetch('/api/menu');
      const data = await response.json();
      setMenuItems(data.menuItems || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching menu items:', error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    let imageBase64 = formData.image;
    if (imageFile) {
      const reader = new FileReader();
      const filePromise = new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
      });
      reader.readAsDataURL(imageFile);
      imageBase64 = await filePromise;
    }

    try {
      const url = editingItem ? `/api/menu/${editingItem._id}` : '/api/menu';
      const method = editingItem ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...formData, image: imageBase64 }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      setSuccess(editingItem ? 'Menu item updated successfully' : 'Menu item created successfully');
      setShowForm(false);
      setEditingItem(null);
      setFormData({
        name: '',
        description: '',
        price: 0,
        category: 'Makanan',
        subCategory: '',
        image: '',
        available: true,
      });
      setImageFile(null);
      fetchMenuItems();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Something went wrong');
    }
  };

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      subCategory: item.subCategory,
      image: item.image || '',
      available: item.available,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      const response = await fetch(`/api/menu/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete item');
      }

      setSuccess('Menu item deleted successfully');
      fetchMenuItems();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to delete item');
    }
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingItem(null);
    setFormData({
      name: '',
      description: '',
      price: 0,
      category: 'Makanan',
      subCategory: '',
      image: '',
      available: true,
    });
  };

  // Sort, filter, paginate
  const processedMenuItems = menuItems
    .slice()
    .sort((a, b) => {
      const at = new Date(a.createdAt || 0).getTime();
      const bt = new Date(b.createdAt || 0).getTime();
      return sortDirection === 'asc' ? at - bt : bt - at;
    })
    .filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
      const matchesSubCategory = filterSubCategory === 'all' || item.subCategory === filterSubCategory;
      return matchesSearch && matchesCategory && matchesSubCategory;
    });

  const totalPages = Math.max(1, Math.ceil(processedMenuItems.length / itemsPerPage));
  const currentPageSafe = Math.min(currentPage, totalPages);
  const pageStart = (currentPageSafe - 1) * itemsPerPage;
  const pageEnd = pageStart + itemsPerPage;
  const paginatedMenuItems = processedMenuItems.slice(pageStart, pageEnd);

  // Reset halaman ke 1 saat filter/sort/search berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterCategory, filterSubCategory, sortDirection]);

  // Get available sub categories based on current category filter
  const getAvailableSubCategories = () => {
    if (filterCategory === 'all') {
      return [...SUB_CATEGORY_OPTIONS.Makanan, ...SUB_CATEGORY_OPTIONS.Minuman];
    }
    return SUB_CATEGORY_OPTIONS[filterCategory];
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading menu items...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
          <h1 className="text-3xl font-bold text-white-900 w-full sm:w-auto">Kelola Menu</h1>
          <p className="text-white-600 mt-2 w-full sm:w-auto">Kelola menu makanan dan minuman</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-2 w-full sm:w-auto mt-4 sm:mt-0 justify-center sm:justify-end items-stretch sm:items-center">
        <button
          onClick={() => setShowForm(true)}
            className="w-full sm:w-auto bg-green-500 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 hover:bg-green-600 transition-colors duration-200 font-semibold"
        >
          <Plus className="h-4 w-4" />
            <span>Tambah Menu</span>
        </button>
          <Link
            href="/admin/menu/best-seller"
            className="w-full sm:w-auto bg-yellow-500 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 hover:bg-yellow-600 transition-colors duration-200 font-semibold"
          >
            <Star className="h-4 w-4" />
            <span>Tambah Menu Best Seller</span>
          </Link>
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

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                {editingItem ? 'Edit Menu Item' : 'Add Menu Item'}
              </h2>
              <button
                onClick={closeForm}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-black"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-black"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price (Rp)
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  required
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-black"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => {
                    const newCategory = e.target.value as 'Makanan' | 'Minuman';
                    setFormData({ ...formData, category: newCategory, subCategory: '' });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-black"
                >
                  <option value="Makanan">Makanan</option>
                  <option value="Minuman">Minuman</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sub Category *
                </label>
                <select
                  value={formData.subCategory}
                  onChange={(e) => setFormData({ ...formData, subCategory: e.target.value })}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-black"
                >
                  <option value="">Pilih Sub Kategori</option>
                  {SUB_CATEGORY_OPTIONS[formData.category].map((subCat) => (
                    <option key={subCat} value={subCat}>
                      {subCat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Image (optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => {
                    const file = e.target.files && e.target.files[0];
                    setImageFile(file || null);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-black"
                />
                {imageFile && (
                  <div className="mt-2">
                    <img src={URL.createObjectURL(imageFile)} alt="Preview" className="h-24 rounded" />
                  </div>
                )}
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="available"
                  checked={formData.available}
                  onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                  className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                />
                <label htmlFor="available" className="ml-2 block text-sm text-gray-700">
                  Tersedia
                </label>
              </div>

              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="flex-1 bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 transition-colors duration-200"
                >
                  {editingItem ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={closeForm}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="flex-1 flex items-center gap-2">
          <div className="relative w-full md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Cari menu..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-black"
            />
          </div>
        </div>
      </div>

      {/* Filter dan Sub Kategori sejajar */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        {/* Filter Category */}
        <div className="flex gap-2 flex-wrap items-center">
          <span className="text-white-700 text-sm flex items-center mr-1">
            <FilterIcon className="h-4 w-4 mr-1" />
            Filter :
          </span>
          <button
            onClick={() => {
              setFilterCategory('all');
              setFilterSubCategory('all');
            }}
            className={`px-4 py-1 rounded-full text-sm font-semibold transition-colors duration-200 focus:outline-none ${filterCategory === 'all' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-orange-100'}`}
          >
            Semua Menu
          </button>
          <button
            onClick={() => {
              setFilterCategory('Makanan');
              setFilterSubCategory('all');
            }}
            className={`px-4 py-1 rounded-full text-sm font-semibold transition-colors duration-200 focus:outline-none ${filterCategory === 'Makanan' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-orange-100'}`}
          >
            Makanan
          </button>
          <button
            onClick={() => {
              setFilterCategory('Minuman');
              setFilterSubCategory('all');
            }}
            className={`px-4 py-1 rounded-full text-sm font-semibold transition-colors duration-200 focus:outline-none ${filterCategory === 'Minuman' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-orange-100'}`}
          >
            Minuman
          </button>
        </div>

        {/* Sub Category Filter */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-white-700 text-sm flex items-center mr-1">
            <FilterIcon className="h-4 w-4 mr-1" />
            Sub Kategori :
          </span>
          <button
            onClick={() => setFilterSubCategory('all')}
            className={`px-3 py-1 rounded-full text-sm font-semibold transition-colors duration-200 focus:outline-none ${filterSubCategory === 'all' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-orange-100'}`}
          >
            Semua
          </button>
          {getAvailableSubCategories().map((subCat) => (
            <button
              key={subCat}
              onClick={() => setFilterSubCategory(subCat)}
              className={`px-3 py-1 rounded-full text-sm font-semibold transition-colors duration-200 focus:outline-none ${filterSubCategory === subCat ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-orange-100'}`}
            >
              {subCat}
            </button>
          ))}
        </div>
      </div>

      {/* Tabel untuk desktop */}
      <div className="hidden md:block">
        <div className="overflow-x-auto rounded-lg shadow bg-white">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Gambar</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  <div className="flex items-center gap-2">
                    <span>Nama</span>
                    <button
                      type="button"
                      onClick={() => setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')}
                      className={`p-1 rounded ${sortDirection==='desc' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-orange-100'}`}
                      title={sortDirection === 'desc' ? 'Urut terbaru (klik untuk ubah ke terlama)' : 'Urut terlama (klik untuk ubah ke terbaru)'}
                    >
                      <ArrowUpDown className="h-4 w-4" />
                    </button>
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Deskripsi</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Harga</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kategori</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sub Kategori</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedMenuItems.map((item) => (
                <tr key={item._id} className="align-middle">
                  <td className="px-4 py-2">
                    {item.image ? (
                      <button onClick={() => { setShowImageModal(true); setModalImageSrc(item.image!); }} className="focus:outline-none group">
                        <img src={item.image} alt={item.name} className="h-12 w-12 object-cover rounded group-hover:ring-2 group-hover:ring-orange-400 text-black transition" />
                      </button>
                    ) : (
                      <img src="/logo-bg.png" alt="Logo Kedai J.A" className="h-12 w-12" style={{objectFit: 'contain'}} />
                    )}
                  </td>
                  <td className="px-4 py-2 font-semibold align-middle text-black">{item.name}</td>
                  <td className="px-4 py-2 text-sm text-gray-600 truncate max-w-xs align-middle">{item.description}</td>
                  <td className="px-4 py-2 font-bold text-orange-500 align-middle">Rp {item.price.toLocaleString('id-ID')}</td>
                  <td className="px-4 py-2 align-middle">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      item.category === 'Makanan' ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {item.category}
                    </span>
                  </td>
                  <td className="px-4 py-2 align-middle">
                    <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-semibold">
                      {item.subCategory}
                    </span>
                  </td>
                  <td className="px-4 py-2 align-middle">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      item.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {item.available ? 'Tersedia' : 'Tidak Tersedia'}
                    </span>
                  </td>
                  <td className="px-4 py-2 align-middle">
                    <div className="flex gap-2 justify-center items-center">
                      <button
                        onClick={() => handleEdit(item)}
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-xs flex items-center"
                      >
                        <Edit className="h-4 w-4 mr-1" /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-xs flex items-center"
                      >
                        <Trash2 className="h-4 w-4 mr-1" /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal gambar besar */}
      {showImageModal && modalImageSrc && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50" onClick={() => setShowImageModal(false)}>
          <div className="bg-white rounded-lg shadow-lg p-4 max-w-lg w-full relative" onClick={e => e.stopPropagation()}>
            <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-700" onClick={() => setShowImageModal(false)}>
              <X className="h-6 w-6" />
            </button>
            <img src={modalImageSrc || ''} alt="Preview" className="w-full h-auto max-h-[70vh] object-contain rounded" />
          </div>
        </div>
      )}

      {/* Grid untuk mobile */}
      <div className="grid grid-cols-1 gap-6 md:hidden">
        {paginatedMenuItems.map((item) => (
          <div key={item._id} className="bg-white rounded-lg shadow-md overflow-hidden p-4 flex flex-col">
            <div className="h-36 bg-gradient-to-br from-orange-400 to-red-400 flex items-center justify-center">
              {item.image ? (
                <button onClick={() => { setShowImageModal(true); setModalImageSrc(item.image!); }} className="focus:outline-none group w-full h-full">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-t-lg group-hover:ring-2 group-hover:ring-orange-400 transition" />
                </button>
              ) : (
                <img src="/logo-bg.png" alt="Logo Kedai J.A" className="h-12 w-12" style={{objectFit: 'contain'}} />
              )}
            </div>
            <div className="p-2 flex-1 flex flex-col justify-between">
              <div>
              <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">{item.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-sm font-semibold ${
                  item.available 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                    {item.available ? 'Tersedia' : 'Tidak Tersedia'}
                </span>
              </div>
                <p className="text-gray-600 text-sm mb-2 truncate">{item.description}</p>
                <div className="flex items-center justify-between mb-2">
                <span className="text-xl font-bold text-orange-500">
                    Rp {typeof item.price === 'number' ? item.price.toLocaleString('id-ID') : '0'}
                </span>
                  <span className={`px-2 py-1 rounded-full text-sm font-semibold ${
                  item.category === 'Makanan' 
                    ? 'bg-orange-100 text-orange-800' 
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {item.category}
                </span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-semibold">
                  Sub: {item.subCategory}
                </span>
              </div>
              </div>
              <div className="flex space-x-2 mt-2">
                <button
                  onClick={() => handleEdit(item)}
                  className="flex-1 bg-blue-500 text-white py-2 px-3 rounded-md hover:bg-blue-600 transition-colors duration-200 flex items-center justify-center text-sm"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item._id)}
                  className="flex-1 bg-red-500 text-white py-2 px-3 rounded-md hover:bg-red-600 transition-colors duration-200 flex items-center justify-center text-sm"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {processedMenuItems.length === 0 && (
        <div className="text-center py-16">
          <img src="/logo-bg.png" alt="Logo Kedai J.A" className="h-16 w-16 text-gray-400 mx-auto mb-4" style={{objectFit: 'contain'}} />
          <h3 className="text-xl font-semibold text-white-900 mb-2">Tidak ada menu yang ditemukan</h3>
          <p className="text-white-600 mb-4">Tambahkan menu pertama Anda</p> 
          <button
            onClick={() => setShowForm(true)}
            className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors duration-200"
          >
            Tambahkan Menu Item
          </button>
        </div>
      )}

      {/* Pagination */}
      {processedMenuItems.length > itemsPerPage && (
        <div className="mt-6 flex items-center justify-center gap-2">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            className="px-3 py-1 rounded bg-gray-100 text-gray-700 hover:bg-orange-100"
            disabled={currentPageSafe === 1}
          >Prev</button>
          <span className="text-sm text-gray-700">Halaman {currentPageSafe} dari {totalPages}</span>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            className="px-3 py-1 rounded bg-gray-100 text-gray-700 hover:bg-orange-100"
            disabled={currentPageSafe === totalPages}
          >Next</button>
        </div>
      )}
    </div>
  );
}