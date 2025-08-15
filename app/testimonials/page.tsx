'use client';

import { useState, useEffect } from 'react';
import { Star, Quote, MessageCircle } from 'lucide-react';
import MainLayout from '@/components/ui/MainLayout';
import AOS from 'aos';

interface Testimonial {
  _id: string;
  name: string;
  email: string;
  rating: number;
  message: string;
  createdAt: string;
}

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch testimonials data with timeout
  const fetchWithTimeout = (url: string, timeout: number = 1500) => {
    return Promise.race([
      fetch(url),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Timeout')), timeout)
      )
    ]);
  };

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const response = await fetchWithTimeout('/api/testimonials');
      if (response.ok) {
        const data = await response.json();
        setTestimonials(data.testimonials || []);
      } else {
        console.error('Failed to fetch testimonials');
        setTestimonials([]);
      }
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      setTestimonials([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true,
      mirror: false,
    });

    fetchTestimonials();
  }, []);

  // Render star rating
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-5 w-5 ${
          index < rating
            ? 'text-yellow-400 fill-yellow-400'
            : 'text-gray-400 fill-gray-400'
        }`}
      />
    ));
  };

  // Get rating color
  const getRatingColor = (rating: number) => {
    if (rating >= 5) return 'from-green-500 to-green-600';
    if (rating >= 4) return 'from-blue-500 to-blue-600';
    if (rating >= 3) return 'from-yellow-500 to-yellow-600';
    if (rating >= 2) return 'from-orange-500 to-orange-600';
    return 'from-red-500 to-red-600';
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-200/20 border-t-primary-500 mx-auto"></div>
              <div className="absolute inset-0 rounded-full h-16 w-16 border-4 border-transparent border-t-secondary-400/50 animate-pulse mx-auto"></div>
            </div>
            <div className="mt-6 space-y-2">
              <p className="text-lg font-medium text-white">Memuat testimonials...</p>
              <p className="text-sm text-gray-300">Menyiapkan ulasan pelanggan untuk Anda</p>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen py-24">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-16" data-aos="fade-up">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-primary-400 via-secondary-400 to-primary-600 bg-clip-text text-transparent">
                Testimonials
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Dengarkan cerita dan pengalaman dari pelanggan setia Kedai J.A. Kepuasan Anda adalah prioritas utama kami.
            </p>
          </div>

          {testimonials.length === 0 ? (
            <div className="text-center py-20" data-aos="fade-up" data-aos-delay="200">
              <MessageCircle className="h-32 w-32 text-gray-400 mx-auto mb-6" />
              <h3 className="text-2xl font-semibold text-white mb-4">Belum Ada Testimonial</h3>
              <p className="text-gray-400 text-lg max-w-md mx-auto">
                Jadilah yang pertama memberikan testimonial untuk Kedai J.A. Pengalaman Anda sangat berharga bagi kami.
              </p>
            </div>
          ) : (
            <>
              {/* Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                <div className="text-center" data-aos="fade-up" data-aos-delay="100">
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-xl">
                    <div className="text-4xl font-bold text-primary-400 mb-2">
                      {testimonials.length}
                    </div>
                    <div className="text-gray-300 font-medium">Total Testimonials</div>
                  </div>
                </div>
                <div className="text-center" data-aos="fade-up" data-aos-delay="200">
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-xl">
                    <div className="text-4xl font-bold text-yellow-400 mb-2">
                      {testimonials.length > 0 
                        ? (testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length).toFixed(1)
                        : '0.0'
                      }
                    </div>
                    <div className="text-gray-300 font-medium">Average Rating</div>
                  </div>
                </div>
                <div className="text-center" data-aos="fade-up" data-aos-delay="300">
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-xl">
                    <div className="text-4xl font-bold text-green-400 mb-2">
                      {testimonials.filter(t => t.rating >= 4).length}
                    </div>
                    <div className="text-gray-300 font-medium">Happy Customers</div>
                  </div>
                </div>
              </div>

              {/* Testimonials Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {testimonials.map((testimonial, index) => (
                  <div
                    key={testimonial._id}
                    className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group relative overflow-hidden"
                    data-aos="fade-up"
                    data-aos-delay={index * 100}
                  >
                    {/* Gradient background effect */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${getRatingColor(testimonial.rating)} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                    
                    {/* Quote icon */}
                    <div className="absolute top-6 right-6 opacity-20 group-hover:opacity-30 transition-opacity duration-300">
                      <Quote className="h-8 w-8 text-white" />
                    </div>

                    {/* Rating */}
                    <div className="flex items-center space-x-1 mb-4">
                      {renderStars(testimonial.rating)}
                      <span className="ml-2 text-sm text-gray-300 font-medium">
                        ({testimonial.rating}/5)
                      </span>
                    </div>

                    {/* Message */}
                    <div className="mb-6">
                      <p className="text-white leading-relaxed text-lg">
                        "{testimonial.message}"
                      </p>
                    </div>

                    {/* Author */}
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-xl font-semibold text-white mb-1">
                          {testimonial.name}
                        </h4>
                        <p className="text-gray-400 text-sm">
                          {new Date(testimonial.createdAt).toLocaleDateString('id-ID', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                      <div className={`w-12 h-12 bg-gradient-to-br ${getRatingColor(testimonial.rating)} rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
                        {testimonial.name.charAt(0).toUpperCase()}
                      </div>
                    </div>

                    {/* Hover effect border */}
                    <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-white/20 transition-colors duration-300" />
                  </div>
                ))}
              </div>

              {/* Call to Action */}
              <div className="text-center mt-20" data-aos="fade-up" data-aos-delay="400">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-12 border border-white/20 shadow-xl max-w-4xl mx-auto">
                  <h3 className="text-3xl font-bold text-white mb-4">
                    Bagikan Pengalaman Anda
                  </h3>
                  <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
                    Apakah Anda pernah menikmati hidangan di Kedai J.A? Kami akan senang mendengar cerita Anda. 
                    Testimoni Anda akan membantu calon pelanggan lain untuk merasakan pengalaman yang sama.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a
                      href="/contact"
                      className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-primary-500/25 hover:-translate-y-1"
                    >
                      Hubungi Kami
                    </a>
                    <a
                      href="/"
                      className="bg-white/20 hover:bg-white/30 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg hover:-translate-y-1"
                    >
                      Kembali ke Beranda
                    </a>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </MainLayout>
  );
}