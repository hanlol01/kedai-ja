'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Phone, MapPin, Clock, ArrowLeft, Mail, Send, AlertCircle } from 'lucide-react';
import MainLayout from '@/components/ui/MainLayout';

interface Settings {
  restaurantName: string;
  description: string;
  address: string;
  contact: string;
  hours: string;
}

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export default function Contact() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings');
      const data = await response.json();
      setSettings(data.settings || {
        restaurantName: 'Kedai J.A',
        description: 'Nikmati cita rasa autentik Indonesia dengan resep turun-temurun yang telah diwariskan dari generasi ke generasi',
        address: 'Jl. Raya Leles No.45, Garut',
        contact: '081234567890',
        hours: 'Senin - Minggu, 09.00 - 21.00'
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching settings:', error);
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

  const handleInputChange = (field: keyof ContactFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Gagal mengirim pesan');
      }

      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="relative mx-auto">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-200/20 border-t-primary-500 mx-auto"></div>
              <div className="absolute inset-0 rounded-full h-16 w-16 border-4 border-transparent border-t-secondary-400/50 animate-pulse mx-auto"></div>
            </div>
            <p className="mt-6 text-gray-300">Memuat informasi kontak...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="mb-8 flex items-center">
        <Link
          href="/"
          className="group flex items-center text-gray-300 hover:text-primary-300 transition-all duration-300 bg-white/5 hover:bg-white/10 px-4 py-2 rounded-lg mr-4"
        >
          <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
          Kembali ke Home
        </Link>
        <div className="flex-1"></div>
        <div className="flex items-center">
          <Phone className="h-8 w-8 text-primary-400 mr-2" />
          <span className="text-xl font-bold text-white">Hubungi Kami</span>
        </div>
      </div>

      <div className="container-fluid py-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="heading-primary text-5xl md:text-6xl lg:text-7xl text-white mb-6">
            Hubungi Kami
          </h1>
          <p className="heading-secondary text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Kami siap melayani Anda dengan sepenuh hati. Jangan ragu untuk menghubungi kami.
          </p>
        </div>

        {/* Contact Information Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 p-8 rounded-xl shadow-lg hover:-translate-y-2 hover:shadow-xl transition-all duration-300 group text-center">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-primary-500/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="bg-primary-900/70 rounded-xl w-20 h-20 flex items-center justify-center mx-auto relative border border-primary-700/50 group-hover:scale-110 transition-transform duration-300">
                <Phone className="h-10 w-10 text-primary-400 group-hover:text-primary-300 transition-colors duration-300" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-primary-300 transition-colors duration-300">Telepon</h3>
            <p className="text-gray-300 mb-4">Hubungi kami langsung</p>
            <a 
              href={`tel:${settings?.contact}`}
              className="text-primary-400 font-semibold hover:text-primary-300 transition-colors duration-300"
            >
              {settings?.contact}
            </a>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 p-8 rounded-xl shadow-lg hover:-translate-y-2 hover:shadow-xl transition-all duration-300 group text-center">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-secondary-500/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="bg-secondary-900/70 rounded-xl w-20 h-20 flex items-center justify-center mx-auto relative border border-secondary-700/50 group-hover:scale-110 transition-transform duration-300">
                <MapPin className="h-10 w-10 text-secondary-400 group-hover:text-secondary-300 transition-colors duration-300" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-secondary-300 transition-colors duration-300">Alamat</h3>
            <p className="text-gray-300 mb-4">Kunjungi restoran kami</p>
            <p className="text-gray-200">{settings?.address}</p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 p-8 rounded-xl shadow-lg hover:-translate-y-2 hover:shadow-xl transition-all duration-300 group text-center">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="bg-blue-900/70 rounded-xl w-20 h-20 flex items-center justify-center mx-auto relative border border-blue-700/50 group-hover:scale-110 transition-transform duration-300">
                <Clock className="h-10 w-10 text-blue-400 group-hover:text-blue-300 transition-colors duration-300" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-blue-300 transition-colors duration-300">Jam Buka</h3>
            <p className="text-gray-300 mb-4">Kami buka setiap hari</p>
            <p className="text-gray-200">{settings?.hours}</p>
          </div>
        </div>

        {/* Main Contact Section - Two Columns */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Left Column - Google Maps */}
            <div className="h-96 lg:h-auto relative">
              <div className="absolute inset-0 bg-black/20 z-10 pointer-events-none"></div>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3959.163707438323!2d107.89975277475884!3d-7.107018492896404!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68b75dc2e1bbed%3A0x3e1f3f109ee9aa06!2sKEDAI%20J.A!5e0!3m2!1sid!2sid!4v1753080907880!5m2!1sid!2sid"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: '500px' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Lokasi Kedai J.A"
                className="grayscale"
              ></iframe>
            </div>

            {/* Right Column - Contact Form */}
            <div className="p-8 lg:p-12">
              <h2 className="heading-secondary text-2xl font-bold text-white mb-6">
                Kirim Pesan Kepada Kami
              </h2>

              {submitStatus === 'success' && (
                <div className="mb-6 p-4 bg-green-900/30 border border-green-700/30 rounded-lg backdrop-blur-sm">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-green-300">
                        Pesan Anda telah berhasil dikirim! Kami akan segera merespons.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="mb-6 p-4 bg-red-900/30 border border-red-700/30 rounded-lg backdrop-blur-sm flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
                  <span className="text-red-300">
                    Terjadi kesalahan saat mengirim pesan. Silakan coba lagi.
                  </span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                      Nama Lengkap
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      required
                      maxLength={50}
                      className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 text-white placeholder-gray-400"
                      placeholder="Masukkan nama lengkap"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                      Alamat Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required
                      maxLength={75}
                      className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 text-white placeholder-gray-400"
                      placeholder="Masukkan alamat email"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                    Subjek
                  </label>
                  <input
                    type="text"
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => handleInputChange('subject', e.target.value)}
                    required
                    maxLength={50}
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 text-white placeholder-gray-400"
                    placeholder="Masukkan subjek pesan"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                    Apa yang ingin anda sampaikan kepada kami?
                  </label>
                  <textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    required
                    maxLength={500}
                    rows={6}
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 resize-none text-white placeholder-gray-400"
                    placeholder="Tulis pesan Anda di sini..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-primary-600 hover:to-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-primary-500/25"
                >
                  {isSubmitting ? (
                    <>
                      <div className="relative">
                        <div className="animate-spin rounded-full h-6 w-6 border-4 border-primary-200/20 border-t-white mr-3"></div>
                      </div>
                      Mengirim...
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5 mr-2" />
                      KIRIM PESAN
                    </>
                  )}
                </button>
              </form>

              {/* Additional Info */}
              <div className="mt-8 bg-primary-900/30 border border-primary-700/30 rounded-xl p-6 backdrop-blur-sm">
                <h3 className="font-semibold text-primary-300 mb-3">Catatan Penting:</h3>
                <ul className="text-sm text-gray-300 space-y-2">
                  <li className="flex items-start">
                    <div className="h-5 w-5 text-primary-400 mr-2 flex-shrink-0">•</div>
                    <span>Reservasi dapat dilakukan melalui WhatsApp Admin</span>
                  </li>
                  <li className="flex items-start">
                    <div className="h-5 w-5 text-primary-400 mr-2 flex-shrink-0">•</div>
                    <span>Kami menerima acara khusus dengan pemberitahuan sebelumnya</span>
                  </li>
                  <li className="flex items-start">
                    <div className="h-5 w-5 text-primary-400 mr-2 flex-shrink-0">•</div>
                    <span>Jam buka dapat berubah pada hari libur nasional</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}