'use client';

import Link from 'next/link';
import { ArrowLeft, HelpCircle, Phone, Mail, MessageCircle } from 'lucide-react';
import Footer from '@/components/ui/Footer';

export default function Help() {
  const helpTopics = [
    {
      title: 'Cara Memesan Makanan',
      description: 'Panduan lengkap untuk memesan makanan di Kedai J.A',
      steps: [
        'Lihat menu di halaman Menu',
        'Pilih makanan atau minuman yang diinginkan',
        'Hubungi kami melalui WhatsApp atau telepon',
        'Konfirmasi pesanan dan metode pembayaran',
        'Tunggu konfirmasi dari kami'
      ]
    },
    {
      title: 'Metode Pembayaran',
      description: 'Berbagai cara pembayaran yang tersedia',
      steps: [
        'Pembayaran tunai di tempat',
        'Transfer bank (BCA, Mandiri, BRI)',
        'E-wallet (GoPay, OVO, DANA)',
        'Pembayaran saat pengantaran (COD)'
      ]
    },
    {
      title: 'Jam Operasional',
      description: 'Informasi lengkap tentang jam buka restoran',
      steps: [
        'Senin - Minggu: 09.00 - 21.00 WIB',
        'Buka setiap hari termasuk hari libur',
        'Untuk pemesanan khusus, hubungi 1 hari sebelumnya',
        'Layanan delivery tersedia hingga pukul 20.30'
      ]
    },
    {
      title: 'Lokasi dan Pengantaran',
      description: 'Informasi lokasi dan area pengantaran',
      steps: [
        'Alamat: Jl. Raya Leles No.45, Garut',
        'Area pengantaran: Radius 5km dari restoran',
        'Biaya pengantaran: Rp 5.000 - Rp 15.000',
        'Estimasi waktu pengantaran: 30-45 menit'
      ]
    }
  ];

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
              <HelpCircle className="h-8 w-8 text-orange-500 mr-2" />
              <span className="text-xl font-bold text-gray-900">Bantuan</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Pusat Bantuan
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Temukan jawaban untuk pertanyaan yang sering diajukan tentang layanan Kedai J.A
          </p>
        </div>

        {/* Quick Contact */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Phone className="h-8 w-8 text-orange-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Telepon</h3>
            <p className="text-gray-600 mb-4">Hubungi kami langsung</p>
            <a 
              href="tel:081234567890" 
              className="text-orange-500 font-semibold hover:text-orange-600"
            >
              081234567890
            </a>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="h-8 w-8 text-orange-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">WhatsApp</h3>
            <p className="text-gray-600 mb-4">Chat langsung dengan kami</p>
            <a 
              href="https://wa.me/6281234567890" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-500 font-semibold hover:text-orange-600"
            >
              Chat WhatsApp
            </a>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Mail className="h-8 w-8 text-orange-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Email</h3>
            <p className="text-gray-600 mb-4">Kirim pertanyaan via email</p>
            <a 
              href="mailto:info@kedai-ja.com" 
              className="text-orange-500 font-semibold hover:text-orange-600"
            >
              info@kedai-ja.com
            </a>
          </div>
        </div>

        {/* Help Topics */}
        <div className="space-y-8">
          {helpTopics.map((topic, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{topic.title}</h2>
              <p className="text-gray-600 mb-6">{topic.description}</p>
              <div className="space-y-3">
                {topic.steps.map((step, stepIndex) => (
                  <div key={stepIndex} className="flex items-start space-x-3">
                    <div className="bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-0.5">
                      {stepIndex + 1}
                    </div>
                    <p className="text-gray-700">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Additional Help */}
        <div className="mt-16 bg-orange-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Masih Butuh Bantuan?
          </h2>
          <p className="text-gray-600 mb-6">
            Tim customer service kami siap membantu Anda 24/7
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://wa.me/6281234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors duration-200"
            >
              Chat WhatsApp
            </a>
            <a
              href="tel:081234567890"
              className="border-2 border-orange-500 text-orange-500 px-6 py-3 rounded-lg font-semibold hover:bg-orange-500 hover:text-white transition-colors duration-200"
            >
              Telepon Sekarang
            </a>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}