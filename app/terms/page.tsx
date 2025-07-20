'use client';

import Link from 'next/link';
import { ArrowLeft, FileText } from 'lucide-react';
import Footer from '@/components/ui/Footer';

export default function TermsConditions() {
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
              <FileText className="h-8 w-8 text-orange-500 mr-2" />
              <span className="text-xl font-bold text-gray-900">Terms & Conditions</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms & Conditions</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              Terakhir diperbarui: {new Date().toLocaleDateString('id-ID')}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Penerimaan Syarat</h2>
              <p className="text-gray-700">
                Dengan mengakses dan menggunakan website Kedai J.A, Anda menyetujui untuk terikat 
                oleh syarat dan ketentuan ini. Jika Anda tidak setuju dengan syarat ini, 
                mohon untuk tidak menggunakan layanan kami.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Penggunaan Layanan</h2>
              <p className="text-gray-700 mb-4">
                Anda setuju untuk menggunakan layanan kami hanya untuk tujuan yang sah dan sesuai dengan:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Semua hukum dan peraturan yang berlaku</li>
                <li>Syarat dan ketentuan ini</li>
                <li>Kebijakan privasi kami</li>
                <li>Norma-norma yang berlaku di masyarakat</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Pemesanan dan Pembayaran</h2>
              <p className="text-gray-700 mb-4">
                Untuk pemesanan makanan dan minuman:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Semua pesanan harus dikonfirmasi terlebih dahulu</li>
                <li>Harga dapat berubah sewaktu-waktu tanpa pemberitahuan</li>
                <li>Pembayaran dapat dilakukan secara tunai atau transfer</li>
                <li>Kami berhak menolak pesanan dalam kondisi tertentu</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Konten Pengguna</h2>
              <p className="text-gray-700">
                Dengan mengirimkan testimoni, review, atau konten lainnya, Anda memberikan kami 
                hak untuk menggunakan, memodifikasi, dan menampilkan konten tersebut untuk 
                tujuan promosi dan pemasaran.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Batasan Tanggung Jawab</h2>
              <p className="text-gray-700">
                Kedai J.A tidak bertanggung jawab atas kerugian tidak langsung, insidental, 
                atau konsekuensial yang mungkin timbul dari penggunaan layanan kami.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Perubahan Syarat</h2>
              <p className="text-gray-700">
                Kami berhak mengubah syarat dan ketentuan ini sewaktu-waktu. Perubahan akan 
                berlaku efektif setelah dipublikasikan di website ini.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Kontak</h2>
              <p className="text-gray-700">
                Untuk pertanyaan mengenai syarat dan ketentuan ini, hubungi kami di:
              </p>
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-700">
                  <strong>Email:</strong> legal@kedai-ja.com<br />
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