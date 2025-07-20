'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Phone, MapPin, Clock, ArrowLeft } from 'lucide-react';
import Footer from '@/components/ui/Footer';

interface Settings {
  restaurantName: string;
  description: string;
  address: string;
  contact: string;
  hours: string;
}

export default function Contact() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat informasi kontak...</p>
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
              <Phone className="h-8 w-8 text-orange-500 mr-2" />
              <span className="text-xl font-bold text-gray-900">Hubungi Kami</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Hubungi Kami
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Kami siap melayani Anda dengan sepenuh hati. Jangan ragu untuk menghubungi kami.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex items-start space-x-4 mb-6">
              <div className="bg-orange-100 rounded-full p-3">
                <Phone className="h-6 w-6 text-orange-500" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-lg">Telepon</h3>
                <p className="text-gray-600 text-xl">{settings?.contact}</p>
                <p className="text-sm text-gray-500 mt-1">
                  Hubungi kami untuk reservasi atau informasi lebih lanjut
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex items-start space-x-4 mb-6">
              <div className="bg-orange-100 rounded-full p-3">
                <MapPin className="h-6 w-6 text-orange-500" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-lg">Alamat</h3>
                <p className="text-gray-600">{settings?.address}</p>
                <p className="text-sm text-gray-500 mt-1">
                  Kunjungi restoran kami untuk pengalaman kuliner yang tak terlupakan
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex items-start space-x-4 mb-6">
              <div className="bg-orange-100 rounded-full p-3">
                <Clock className="h-6 w-6 text-orange-500" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-lg">Jam Buka</h3>
                <p className="text-gray-600">{settings?.hours}</p>
                <p className="text-sm text-gray-500 mt-1">
                  Kami buka setiap hari untuk melayani Anda
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-16">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Lokasi Kami</h2>
            <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Peta lokasi akan ditampilkan di sini</p>
                <p className="text-sm text-gray-500 mt-2">
                  Integrasi dengan Google Maps atau layanan peta lainnya
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-8 bg-orange-50 rounded-lg p-6">
          <h3 className="font-semibold text-orange-900 mb-2">Catatan Penting:</h3>
          <ul className="text-sm text-orange-800 space-y-1">
            <li>• Reservasi dapat dilakukan melalui telepon</li>
            <li>• Kami menerima acara khusus dengan pemberitahuan sebelumnya</li>
            <li>• Jam buka dapat berubah pada hari libur nasional</li>
          </ul>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}