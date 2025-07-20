'use client';

import Link from 'next/link';
import { ChefHat, Heart, Users, Award, ArrowLeft } from 'lucide-react';
import Footer from '@/components/ui/Footer';

export default function About() {
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
              <ChefHat className="h-8 w-8 text-orange-500 mr-2" />
              <span className="text-xl font-bold text-gray-900">Tentang Kedai J.A</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Tentang Kedai J.A
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Perjalanan cita rasa yang dimulai dari dapur tradisional
          </p>
        </div>

        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900">Cerita Kami</h2>
            <p className="text-gray-600 leading-relaxed">
              Kedai J.A didirikan dengan visi sederhana namun mendalam: melestarikan cita rasa Indonesia yang autentik. 
              Bermula dari dapur keluarga yang kecil, kami telah berkembang menjadi destinasi kuliner yang dicintai oleh 
              masyarakat luas.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Setiap hidangan yang kami sajikan adalah hasil dari resep turun-temurun yang telah diwariskan dari generasi 
              ke generasi. Kami percaya bahwa makanan bukan hanya sekedar nutrisi, tetapi juga medium untuk berbagi 
              kehangatan dan kebersamaan.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Dengan menggunakan bahan-bahan segar dan rempah-rempah pilihan, kami berkomitmen untuk memberikan pengalaman 
              kuliner yang tak terlupakan kepada setiap pelanggan yang datang.
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-orange-400 to-red-400 rounded-lg p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Visi & Misi</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Visi</h4>
                <p className="text-orange-100">
                  Menjadi restoran Indonesia terdepan yang melestarikan dan mempromosikan kekayaan kuliner nusantara.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Misi</h4>
                <ul className="space-y-1 text-orange-100">
                  <li>• Menyajikan makanan Indonesia yang autentik dan berkualitas</li>
                  <li>• Memberikan pelayanan terbaik dengan harga yang terjangkau</li>
                  <li>• Melestarikan warisan kuliner Indonesia untuk generasi mendatang</li>
                  <li>• Menciptakan pengalaman kuliner yang berkesan</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Nilai-Nilai Kami</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center bg-white p-6 rounded-lg shadow-md">
              <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <ChefHat className="h-8 w-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Autentisitas</h3>
              <p className="text-gray-600">
                Mempertahankan keaslian resep dan cita rasa tradisional Indonesia
              </p>
            </div>

            <div className="text-center bg-white p-6 rounded-lg shadow-md">
              <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Keramahan</h3>
              <p className="text-gray-600">
                Melayani setiap pelanggan dengan kehangatan dan keramahan keluarga
              </p>
            </div>

            <div className="text-center bg-white p-6 rounded-lg shadow-md">
              <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Komunitas</h3>
              <p className="text-gray-600">
                Menjadi bagian dari komunitas lokal dan mendukung pertumbuhan bersama
              </p>
            </div>

            <div className="text-center bg-white p-6 rounded-lg shadow-md">
              <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Kualitas</h3>
              <p className="text-gray-600">
                Komitmen pada kualitas terbaik dalam setiap aspek pengalaman kuliner
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}