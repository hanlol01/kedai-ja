'use client';

import Link from 'next/link';
import { ArrowLeft, Shield } from 'lucide-react';
import Footer from '@/components/ui/Footer';

export default function PrivacyPolicy() {
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
              <Shield className="h-8 w-8 text-orange-500 mr-2" />
              <span className="text-xl font-bold text-gray-900">Privacy Policy</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              Terakhir diperbarui: {new Date().toLocaleDateString('id-ID')}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Informasi yang Kami Kumpulkan</h2>
              <p className="text-gray-700 mb-4">
                Kami mengumpulkan informasi yang Anda berikan secara langsung kepada kami, seperti:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Nama dan informasi kontak</li>
                <li>Email untuk newsletter</li>
                <li>Testimoni dan rating</li>
                <li>Informasi komunikasi lainnya</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Bagaimana Kami Menggunakan Informasi</h2>
              <p className="text-gray-700 mb-4">
                Kami menggunakan informasi yang dikumpulkan untuk:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Memberikan layanan yang Anda minta</li>
                <li>Mengirim newsletter dan update</li>
                <li>Meningkatkan layanan kami</li>
                <li>Merespons pertanyaan dan permintaan Anda</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Perlindungan Informasi</h2>
              <p className="text-gray-700">
                Kami mengambil langkah-langkah keamanan yang wajar untuk melindungi informasi pribadi Anda 
                dari akses, penggunaan, atau pengungkapan yang tidak sah.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Hak Anda</h2>
              <p className="text-gray-700 mb-4">
                Anda memiliki hak untuk:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Mengakses informasi pribadi Anda</li>
                <li>Memperbarui atau mengoreksi informasi</li>
                <li>Menghapus informasi pribadi Anda</li>
                <li>Berhenti berlangganan newsletter</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Hubungi Kami</h2>
              <p className="text-gray-700">
                Jika Anda memiliki pertanyaan tentang Privacy Policy ini, silakan hubungi kami di:
              </p>
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-700">
                  <strong>Email:</strong> privacy@kedai-ja.com<br />
                  <strong>Telepon:</strong> 081234567890<br />
                  <strong>Alamat:</strong> Jl. Raya Leles No.45, Garut
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}