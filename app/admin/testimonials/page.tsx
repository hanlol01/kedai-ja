'use client';

import { useEffect, useState } from 'react';
import { Star, MessageSquare, User, Mail, Calendar } from 'lucide-react';

interface Testimonial {
  _id: string;
  name: string;
  email: string;
  rating: number;
  message: string;
  createdAt: string;
}

export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const response = await fetch('/api/testimonials');
      const data = await response.json();
      setTestimonials(data.testimonials || []);
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

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading testimonials...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center py-16">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Testimonials</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchTestimonials}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-200"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const ratingDistribution = getRatingDistribution();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Testimonials</h1>
        <p className="text-gray-600 mt-2">Lihat semua testimoni dan rating dari pelanggan</p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Testimoni</p>
              <p className="text-3xl font-bold text-gray-900">{testimonials.length}</p>
            </div>
            <div className="bg-blue-100 rounded-full p-3">
              <MessageSquare className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Rating Rata-rata</p>
              <div className="flex items-center">
                <p className="text-3xl font-bold text-gray-900 mr-2">{getAverageRating().toFixed(1)}</p>
                <div className="flex">
                  {renderStars(Math.round(parseFloat(getAverageRating().toString())))}
                </div>
              </div>
            </div>
            <div className="bg-yellow-100 rounded-full p-3">
              <Star className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Rating Tertinggi</p>
              <div className="flex items-center">
                <p className="text-3xl font-bold text-gray-900 mr-2">5</p>
                <span className="text-sm text-gray-500">({ratingDistribution[5]} testimoni)</span>
              </div>
            </div>
            <div className="bg-green-100 rounded-full p-3">
              <Star className="h-6 w-6 text-green-600 fill-current" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Rating Terendah</p>
              <div className="flex items-center">
                <p className="text-3xl font-bold text-gray-900 mr-2">1</p>
                <span className="text-sm text-gray-500">({ratingDistribution[1]} testimoni)</span>
              </div>
            </div>
            <div className="bg-red-100 rounded-full p-3">
              <Star className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Rating Distribution */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Distribusi Rating</h2>
        <div className="space-y-3">
          {[5, 4, 3, 2, 1].map(rating => {
            const count = ratingDistribution[rating as keyof typeof ratingDistribution];
            const percentage = testimonials.length > 0 ? (count / testimonials.length) * 100 : 0;
            
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
      {testimonials.length === 0 ? (
        <div className="text-center py-16">
          <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Belum ada testimoni</h3>
          <p className="text-gray-600">Testimoni dari pelanggan akan muncul di sini</p>
        </div>
      ) : (
        <div className="space-y-6">
          {testimonials.map((testimonial) => (
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
                <div className="text-right">
                  <div className="flex items-center space-x-1 mb-1">
                    {renderStars(testimonial.rating)}
                  </div>
                  <p className="text-sm text-gray-600">{getRatingText(testimonial.rating)}</p>
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