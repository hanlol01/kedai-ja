'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import Footer from '@/components/ui/Footer';

export default function FAQs() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const faqs = [
    {
      question: 'Bagaimana cara memesan makanan di Kedai J.A?',
      answer: 'Anda dapat memesan makanan dengan cara: 1) Lihat menu di website kami, 2) Hubungi kami melalui WhatsApp di 081234567890 atau telepon langsung, 3) Sebutkan pesanan Anda, 4) Konfirmasi alamat pengantaran dan metode pembayaran, 5) Tunggu konfirmasi dari kami.'
    },
    {
      question: 'Apakah ada layanan pengantaran (delivery)?',
      answer: 'Ya, kami menyediakan layanan pengantaran untuk area dalam radius 5km dari restoran. Biaya pengantaran berkisar antara Rp 5.000 - Rp 15.000 tergantung jarak. Estimasi waktu pengantaran adalah 30-45 menit.'
    },
    {
      question: 'Apa saja metode pembayaran yang tersedia?',
      answer: 'Kami menerima berbagai metode pembayaran: tunai di tempat, transfer bank (BCA, Mandiri, BRI), e-wallet (GoPay, OVO, DANA), dan pembayaran saat pengantaran (COD).'
    },
    {
      question: 'Berapa jam buka Kedai J.A?',
      answer: 'Kedai J.A buka setiap hari Senin - Minggu dari pukul 09.00 - 21.00 WIB. Kami buka setiap hari termasuk hari libur nasional. Untuk layanan delivery, kami melayani hingga pukul 20.30.'
    },
    {
      question: 'Apakah bisa pesan untuk acara khusus atau dalam jumlah banyak?',
      answer: 'Tentu saja! Kami melayani pesanan untuk acara khusus seperti ulang tahun, arisan, meeting, dll. Untuk pesanan dalam jumlah banyak, mohon hubungi kami minimal 1 hari sebelumnya agar kami dapat mempersiapkan dengan baik.'
    },
    {
      question: 'Apakah menu bisa disesuaikan dengan permintaan khusus?',
      answer: 'Ya, kami dapat menyesuaikan beberapa menu sesuai permintaan Anda seperti tingkat kepedasan, tanpa bawang, atau modifikasi lainnya. Silakan sampaikan permintaan khusus Anda saat memesan.'
    },
    {
      question: 'Bagaimana jika saya ingin membatalkan pesanan?',
      answer: 'Pembatalan pesanan dapat dilakukan maksimal 15 menit setelah konfirmasi pesanan. Jika makanan sudah dalam proses pembuatan atau pengantaran, pembatalan tidak dapat dilakukan. Silakan hubungi kami segera jika ingin membatalkan.'
    },
    {
      question: 'Apakah ada program loyalitas atau diskon untuk pelanggan tetap?',
      answer: 'Kami memiliki program khusus untuk pelanggan setia. Ikuti media sosial kami dan daftarkan email Anda di newsletter untuk mendapatkan informasi promo dan diskon terbaru.'
    },
    {
      question: 'Bagaimana cara memberikan feedback atau komplain?',
      answer: 'Kami sangat menghargai feedback Anda. Anda dapat memberikan testimoni melalui halaman "Beri Rating" di website, menghubungi kami langsung via WhatsApp, telepon, atau email. Semua feedback akan kami tanggapi dengan serius.'
    },
    {
      question: 'Apakah Kedai J.A menyediakan menu vegetarian atau halal?',
      answer: 'Ya, semua menu di Kedai J.A adalah halal dan kami juga menyediakan beberapa pilihan menu vegetarian. Silakan tanyakan kepada kami menu vegetarian yang tersedia saat memesan.'
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

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
              <span className="text-xl font-bold text-gray-900">FAQs</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Temukan jawaban untuk pertanyaan yang paling sering ditanyakan tentang Kedai J.A
          </p>
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
              >
                <h3 className="text-lg font-semibold text-gray-900 pr-4">
                  {faq.question}
                </h3>
                {openFAQ === index ? (
                  <ChevronUp className="h-5 w-5 text-orange-500 flex-shrink-0" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-orange-500 flex-shrink-0" />
                )}
              </button>
              
              {openFAQ === index && (
                <div className="px-6 pb-4">
                  <div className="border-t border-gray-200 pt-4">
                    <p className="text-gray-700 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="mt-16 bg-orange-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Tidak Menemukan Jawaban?
          </h2>
          <p className="text-gray-600 mb-6">
            Jika pertanyaan Anda tidak terjawab di atas, jangan ragu untuk menghubungi kami
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/help"
              className="bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors duration-200"
            >
              Pusat Bantuan
            </Link>
            <a
              href="https://wa.me/6281234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="border-2 border-orange-500 text-orange-500 px-6 py-3 rounded-lg font-semibold hover:bg-orange-500 hover:text-white transition-colors duration-200"
            >
              Chat WhatsApp
            </a>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}