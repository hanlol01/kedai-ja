'use client';

import { useEffect, useState } from 'react';
import { Star, MessageSquare, User, Mail, Calendar, Check } from 'lucide-react';

interface Testimonial {
  _id: string;
  name: string;
  email: string;
  rating: number;
  message: string;
  createdAt: string;
  showOnDashboard: boolean;
}

export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [showDashboardOnly, setShowDashboardOnly] = useState(false);
  const [dashboardCount, setDashboardCount] = useState(0);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  useEffect(() => {
    // Update dashboard count whenever testimonials change
    const count = testimonials.filter(t => t.showOnDashboard).length;
    setDashboardCount(count);
  }, [testimonials]);

  const fetchTestimonials = async () => {
    try {
      console.log('Fetching testimonials...');
      setLoading(true);
      const response = await fetch('/api/testimonials', { 
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache' }
      });
      console.log('Testimonials response status:', response.status);
      const data = await response.json();
      console.log('Testimonials data:', data);
      
      if (data.testimonials && Array.isArray(data.testimonials)) {
        setTestimonials(data.testimonials);
        console.log('Testimonials loaded:', data.testimonials.length);
        console.log('Testimonials with showOnDashboard:', 
          data.testimonials.filter((t: Testimonial) => t.showOnDashboard).length);
      } else {
        console.error('Invalid testimonials data format:', data);
        setTestimonials([]);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      setError('Failed to load testimonials');
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const getRatingText = (rating: number) => {
    const ratingTexts = {
      1: 'Sangat Tidak Puas',
      2: 'Tidak Puas',
      3: 'Cukup',
      4: 'Puas',
      5: 'Sangat Puas',
    };
    return ratingTexts[rating as keyof typeof ratingTexts] || '';
  };

  const getAverageRating = () => {
    if (testimonials.length === 0) return 0;
    const total = testimonials.reduce((sum, testimonial) => sum + testimonial.rating, 0);
    return total / testimonials.length;
  };

  const getRatingDistribution = () => {
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    testimonials.forEach(testimonial => {
      distribution[testimonial.rating as keyof typeof distribution]++;
    });
    return distribution;
  };

  const toggleDashboardStatus = async (testimonialId: string, currentStatus: boolean) => {
    try {
      console.log('Toggle dashboard status for ID:', testimonialId);
      console.log('Current status:', currentStatus);
      console.log('Will change to:', !currentStatus);
      
      // Tampilkan loading state
      const button = document.querySelector(`[data-testimonial-id="${testimonialId}"]`);
      if (button) {
        button.classList.add('opacity-50', 'cursor-not-allowed');
        button.setAttribute('disabled', 'true');
        if (currentStatus) {
          button.innerHTML = '<span class="animate-pulse">Menyembunyikan...</span>';
        } else {
          button.innerHTML = '<span class="animate-pulse">Menampilkan...</span>';
        }
      }
      
      // Check if we're trying to enable a testimonial for dashboard display
      if (!currentStatus) {
        // Count how many testimonials are already displayed on dashboard
        const currentDashboardCount = testimonials.filter(t => t.showOnDashboard).length;
        console.log('Current dashboard count:', currentDashboardCount);
        
        // If we already have 3 testimonials on dashboard, show warning
        if (currentDashboardCount >= 3) {
          alert('Maksimal 3 testimonial dapat ditampilkan di halaman utama. Nonaktifkan salah satu terlebih dahulu.');
          
          // Reset button state
          if (button) {
            button.classList.remove('opacity-50', 'cursor-not-allowed');
            button.removeAttribute('disabled');
            button.innerHTML = `<span class="flex items-center space-x-2">Tampilkan di Halaman Utama</span>`;
          }
          
          return;
        }
      }
      
      console.log('Sending request to API...');
      const apiUrl = `/api/testimonials/${testimonialId}/dashboard`;
      console.log('API URL:', apiUrl);
      
      const response = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        },
        body: JSON.stringify({ showOnDashboard: !currentStatus }),
      });

      console.log('Response status:', response.status);
      const responseData = await response.json();
      console.log('Response data:', responseData);

      if (response.ok) {
        console.log('Successfully updated testimonial status');
        // Update local state
        setTestimonials(prev => 
          prev.map(testimonial => 
            testimonial._id === testimonialId 
              ? { ...testimonial, showOnDashboard: !currentStatus }
              : testimonial
          )
        );
        
        // Tampilkan notifikasi sukses
        alert(currentStatus 
          ? 'Testimonial berhasil dihapus dari halaman utama' 
          : 'Testimonial berhasil ditampilkan di halaman utama');
          
        // Reload data to ensure we have the latest state
        await fetchTestimonials();
      } else {
        console.error('Failed to update testimonial dashboard status:', responseData.error);
        alert(`Gagal mengubah status testimonial: ${responseData.error || 'Unknown error'}`);
        
        // Reset button state
        if (button) {
          button.classList.remove('opacity-50', 'cursor-not-allowed');
          button.removeAttribute('disabled');
          
          if (currentStatus) {
            button.innerHTML = `<span class="flex items-center space-x-2"><span class="text-green-600">✓</span> Ditampilkan</span>`;
          } else {
            button.innerHTML = `<span class="flex items-center space-x-2">Tampilkan di Halaman Utama</span>`;
          }
        }
      }
    } catch (error) {
      console.error('Error updating testimonial dashboard status:', error);
      alert('Terjadi kesalahan saat mengubah status testimonial');
      
      // Reload to reset state
      window.location.reload();
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center py-16">
          <div className="relative mx-auto">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-blue-500 mx-auto"></div>
          </div>
          <h2 className="text-xl font-semibold text-white-900 mt-4">Memuat testimonial...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h2 className="text-lg font-semibold text-red-700 mb-2">Error</h2>
          <p className="text-red-600">{error}</p>
          <button 
            onClick={() => fetchTestimonials()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  // Filter testimonials based on rating and dashboard status
  const filteredTestimonials = testimonials.filter(testimonial => {
    const ratingMatch = filterRating === null || testimonial.rating === filterRating;
    const dashboardMatch = !showDashboardOnly || testimonial.showOnDashboard;
    return ratingMatch && dashboardMatch;
  });

  const distribution = getRatingDistribution();
  const totalRatings = Object.values(distribution).reduce((sum, count) => sum + count, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white-900 mb-2">Testimonial</h1>
          <p className="text-white-600">Kelola testimonial dari pelanggan</p>
        </div>
        
        <div className="mt-4 md:mt-0 flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4">
          <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg flex items-center">
            <span className="font-medium mr-2">Ditampilkan di Halaman Utama:</span>
            <span className="bg-blue-100 text-blue-800 font-bold px-3 py-1 rounded-full">{dashboardCount}/3</span>
          </div>
          
          <button 
            onClick={() => setShowDashboardOnly(!showDashboardOnly)}
            className={`px-4 py-2 rounded-lg flex items-center ${
              showDashboardOnly 
                ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                : 'bg-red-100 text-red-700 hover:bg-red-200'
            }`}
          >
            {showDashboardOnly ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                <span>Hanya Tampilkan di Halaman Utama</span>
              </>
            ) : (
              <>
                <span>Cek Testimoni Dashboard</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Rating Stats */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Testimoni</h3>
            <p className="text-4xl font-bold text-blue-600">{testimonials.length}</p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Rating Rata-rata</h3>
            <div className="flex items-center">
              <p className="text-4xl font-bold text-blue-600 mr-2">{getAverageRating().toFixed(1)}</p>
              <div className="flex">
                {renderStars(Math.round(getAverageRating()))}
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Rating Tertinggi</h3>
            <div className="flex items-center">
              <p className="text-4xl font-bold text-green-600 mr-2">5</p>
              <p className="text-gray-600">({distribution[5]} testimoni)</p>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Rating Terendah</h3>
            <div className="flex items-center">
              <p className="text-4xl font-bold text-red-600 mr-2">
                {Object.entries(distribution).find(([_, count]) => count > 0)?.[0] || '-'}
              </p>
              <p className="text-gray-600">
                ({Object.entries(distribution).find(([_, count]) => count > 0)?.[1] || 0} testimoni)
              </p>
            </div>
          </div>
        </div>
        
        {/* Filter Buttons */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Filter Rating :</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilterRating(null)}
              className={`px-4 py-2 rounded-lg ${
                filterRating === null ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Semua
            </button>
            {[5, 4, 3, 2, 1].map((rating) => (
              <button
                key={rating}
                onClick={() => setFilterRating(rating)}
                className={`px-4 py-2 rounded-lg flex items-center ${
                  filterRating === rating ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {rating} <Star className={`h-4 w-4 ml-1 ${filterRating === rating ? 'text-white' : 'text-yellow-500'}`} />
              </button>
            ))}
          </div>
        </div>
        
        {/* Rating Distribution */}
        <h3 className="text-lg font-semibold text-gray-700 mb-3">Distribusi Rating</h3>
        <div className="space-y-3">
          {[5, 4, 3, 2, 1].map((rating) => {
            const count = distribution[rating as keyof typeof distribution];
            const percentage = totalRatings > 0 ? (count / totalRatings) * 100 : 0;
            
            return (
              <div key={rating} className="flex items-center">
                <div className="flex items-center w-20">
                  <span className="text-sm font-medium text-gray-700 mr-2">{rating}</span>
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                </div>
                <div className="flex-1 mx-4">
                  <div className="bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
                <span className="text-sm text-gray-600 w-16 text-right">
                  {count} ({percentage.toFixed(0)}%)
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Testimonials List */}
      {filteredTestimonials.length === 0 ? (
        <div className="text-center py-16">
          <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Belum ada testimoni</h3>
          <p className="text-gray-600">Testimoni dari pelanggan akan muncul di sini</p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredTestimonials.map((testimonial) => (
            <div key={testimonial._id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-gray-100 rounded-full p-2">
                    <User className="h-6 w-6 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{testimonial.name}</h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Mail className="h-4 w-4" />
                      <span>{testimonial.email}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="flex items-center space-x-1 mb-1">
                      {renderStars(testimonial.rating)}
                    </div>
                    <p className="text-sm text-gray-600">{getRatingText(testimonial.rating)}</p>
                  </div>
                  <button
                    onClick={() => toggleDashboardStatus(testimonial._id, testimonial.showOnDashboard)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                      testimonial.showOnDashboard
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                    }`}
                    title={testimonial.showOnDashboard ? 'Hapus dari halaman utama' : 'Tampilkan di halaman utama'}
                    data-testimonial-id={testimonial._id}
                  >
                    {testimonial.showOnDashboard ? (
                      <>
                        <span className="text-green-600 font-bold mr-1">✓</span>
                        <span>Ditampilkan di Halaman Utama</span>
                      </>
                    ) : (
                      <>
                        <span>Tampilkan di Halaman Utama</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
              
              <div className="mb-4">
                <p className="text-gray-700 leading-relaxed">{testimonial.message}</p>
              </div>
              
              <div className="flex items-center text-sm text-gray-500">
                <Calendar className="h-4 w-4 mr-1" />
                <span>{formatDate(testimonial.createdAt)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}