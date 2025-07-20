'use client';

import Link from 'next/link';
import { ArrowLeft, Cookie } from 'lucide-react';
import Footer from '@/components/ui/Footer';

export default function CookiesPolicy() {
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
              <Cookie className="h-8 w-8 text-orange-500 mr-2" />
              <span className="text-xl font-bold text-gray-900">Cookies Policy</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Cookies Policy</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              Terakhir diperbarui: {new Date().toLocaleDateString('id-ID')}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Apa itu Cookies?</h2>
              <p className="text-gray-700">
                Cookies adalah file teks kecil yang disimpan di perangkat Anda ketika mengunjungi 
                website kami. Cookies membantu kami memberikan pengalaman yang lebih baik dan 
                personal untuk Anda.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Jenis Cookies yang Kami Gunakan</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">1. Cookies Esensial</h3>
                  <p className="text-gray-700">
                    Cookies yang diperlukan untuk fungsi dasar website, seperti autentikasi admin 
                    dan keamanan sesi.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">2. Cookies Fungsional</h3>
                  <p className="text-gray-700">
                    Cookies yang mengingat preferensi Anda dan meningkatkan pengalaman browsing.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">3. Cookies Analitik</h3>
                  <p className="text-gray-700">
                    Cookies yang membantu kami memahami bagaimana pengunjung berinteraksi dengan 
                    website untuk meningkatkan layanan.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Mengelola Cookies</h2>
              <p className="text-gray-700 mb-4">
                Anda dapat mengontrol dan mengelola cookies melalui pengaturan browser Anda:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Memblokir semua cookies</li>
                <li>Menerima hanya cookies tertentu</li>
                <li>Menghapus cookies yang sudah tersimpan</li>
                <li>Mengatur notifikasi sebelum cookies disimpan</li>
              </ul>
              <p className="text-gray-700 mt-4">
                <strong>Catatan:</strong> Memblokir cookies mungkin akan mempengaruhi fungsionalitas 
                website dan pengalaman browsing Anda.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Cookies Pihak Ketiga</h2>
              <p className="text-gray-700">
                Website kami mungkin menggunakan cookies dari pihak ketiga untuk layanan seperti:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mt-4">
                <li>Google Analytics untuk analisis website</li>
                <li>Media sosial untuk integrasi konten</li>
                <li>Chatbot untuk layanan pelanggan</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Perubahan Kebijakan</h2>
              <p className="text-gray-700">
                Kami dapat memperbarui kebijakan cookies ini dari waktu ke waktu. Perubahan akan 
                dipublikasikan di halaman ini dengan tanggal pembaruan yang baru.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Hubungi Kami</h2>
              <p className="text-gray-700">
                Jika Anda memiliki pertanyaan tentang penggunaan cookies, silakan hubungi kami:
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