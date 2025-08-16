'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ChefHat, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Star,
  ArrowUp,
  Facebook,
  Twitter,
  Youtube,
  Linkedin,
  Send,
  AlertCircle
} from 'lucide-react';

interface Settings {
  restaurantName: string;
  description: string;
  address: string;
  contact: string;
  hours: string;
  email: string;
}

export default function Footer() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    fetchSettings();
    
    // Show/hide back to top button based on scroll position
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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
        hours: 'Senin - Minggu, 11.00 - 22.00',
        email: 'info@kedai-ja.com'
      });
    } catch (error) {
      console.error('Error fetching settings:', error);
      setSettings({
        restaurantName: 'Kedai J.A',
        description: 'Nikmati cita rasa autentik Indonesia dengan resep turun-temurun yang telah diwariskan dari generasi ke generasi',
        address: 'Jl. Raya Leles No.45, Garut',
        contact: '081234567890',
        hours: 'Senin - Minggu, 11.00 - 22.00',
        email: 'info@kedai-ja.com'
      });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const companyLinks = [
    { name: 'Tentang Kami', href: '/about' },
    { name: 'Kontak Kami', href: '/contact' },
    { name: 'Pesan Sekarang', href: '/menu' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms & Condition', href: '/terms' },
  ];

  const bottomLinks = [
    { name: 'Home', href: '/' },
    { name: 'Cookies', href: '/cookies' },
    { name: 'Help', href: '/help' },
    { name: 'FAQs', href: '/faqs' },
  ];

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, href: '#', color: 'hover:text-blue-600' },
    { name: 'Twitter', icon: Twitter, href: '#', color: 'hover:text-blue-400' },
    { name: 'YouTube', icon: Youtube, href: '#', color: 'hover:text-red-600' },
    { name: 'LinkedIn', icon: Linkedin, href: '#', color: 'hover:text-blue-700' },
  ];

  if (!settings) {
    return null;
  }

  return (
    <>
      <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-64 h-64 bg-primary-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-secondary-400 rounded-full blur-3xl"></div>
        </div>

        <div className="container-fluid section-spacing relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Column */}
            <div>
              <h3 className="heading-secondary text-lg font-bold mb-6 text-primary-400">Perusahaan</h3>
              <ul className="space-y-3">
                {companyLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-body text-gray-300 hover:text-primary-400 transition-all duration-300 hover:translate-x-1 inline-block"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Column */}
            <div>
              <h3 className="heading-secondary text-lg font-bold mb-6 text-primary-400">Kontak</h3>
              <div className="space-y-4">
                <div className="group flex items-start space-x-3 hover:bg-white/5 p-2 rounded-lg transition-all duration-300">
                  <MapPin className="h-5 w-5 text-primary-400 mt-1 flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />
                  <span className="text-body text-gray-300 group-hover:text-white transition-colors duration-300">{settings.address}</span>
                </div>
                <div className="group flex items-center space-x-3 hover:bg-white/5 p-2 rounded-lg transition-all duration-300">
                  <Phone className="h-5 w-5 text-primary-400 flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />
                  <span className="text-body text-gray-300 group-hover:text-white transition-colors duration-300">{settings.contact}</span>
                </div>
                <div className="group flex items-center space-x-3 hover:bg-white/5 p-2 rounded-lg transition-all duration-300">
                  <Mail className="h-5 w-5 text-primary-400 flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />
                  <span className="text-body text-gray-300 group-hover:text-white transition-colors duration-300">{settings.email}</span>
                </div>
              </div>

              {/* Social Media */}
              <div className="mt-8">
                <h4 className="text-sm font-semibold mb-4 text-primary-400">Ikuti Kami</h4>
                <div className="flex space-x-3">
                  {socialLinks.map((social) => {
                    const Icon = social.icon;
                    return (
                      <a
                        key={social.name}
                        href={social.href}
                        className={`p-2 rounded-lg bg-white/10 text-gray-400 ${social.color} hover:bg-white/20 hover:scale-110 transition-all duration-300`}
                        aria-label={social.name}
                      >
                        <Icon className="h-5 w-5" />
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Operating Hours Column */}
            <div>
              <h3 className="heading-secondary text-lg font-bold mb-6 text-primary-400">Jam Buka</h3>
              <div className="group flex items-start space-x-3 hover:bg-white/5 p-3 rounded-lg transition-all duration-300">
                <Clock className="h-6 w-6 text-primary-400 mt-1 flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />
                <div>
                  <p className="text-body text-white font-medium group-hover:text-primary-200 transition-colors duration-300">
                    {settings.hours}
                  </p>
                  <p className="text-sm text-gray-400 mt-2 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                    Kami siap melayani Anda setiap hari dengan menu terbaik
                  </p>
                </div>
              </div>
            </div>

            {/* Rating Column */}
            <div>
              <h3 className="heading-secondary text-lg font-bold mb-6 text-primary-400">Beri Rating Kami</h3>
              <div className="space-y-4">
                <p className="text-body text-gray-300 text-sm leading-relaxed">
                  Bagikan pengalaman Anda dan bantu kami memberikan pelayanan yang lebih baik
                </p>
                <Link
                  href="/testimonial"
                  className="group inline-flex items-center space-x-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-3 rounded-xl hover:from-primary-600 hover:to-primary-700 hover:shadow-lg hover:scale-105 transition-all duration-300"
                >
                  <Star className="h-4 w-4 group-hover:rotate-12 transition-transform duration-300" />
                  <span className="font-medium">Beri Rating</span>
                </Link>
                <div className="text-sm text-gray-400">
                  <p>Testimoni Anda sangat berarti bagi kami</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800/50 bg-black/20">
          <div className="container-fluid py-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center mb-6 md:mb-0 group">
                <div className="relative">
                  <ChefHat className="h-8 w-8 text-primary-500 mr-3 group-hover:rotate-12 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-primary-500 rounded-full blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                </div>
                <div>
                  <span className="text-xl font-primary font-bold text-white group-hover:text-primary-300 transition-colors duration-300">
                    {settings.restaurantName}
                  </span>
                  <p className="text-sm text-gray-400">Cita rasa autentik Indonesia</p>
                </div>
              </div>
              
              <div className="flex flex-wrap justify-center md:justify-end gap-6 mb-6 md:mb-0">
                {bottomLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="text-gray-400 hover:text-primary-400 transition-all duration-300 text-sm hover:translate-y-[-2px]"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
            
            <div className="text-center mt-8 pt-8 border-t border-gray-800/50">
              <p className="text-gray-400 text-sm">
                &copy; 2024 {settings.restaurantName}. Semua hak dilindungi undang-undang.
              </p>
              <p className="text-gray-500 text-xs mt-2">
                Dibuat dengan ❤️ untuk memberikan pengalaman kuliner terbaik
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Modern Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="group fixed bottom-24 right-8 bg-gradient-to-r from-primary-500 to-primary-600 text-white p-4 rounded-full shadow-2xl hover:shadow-primary-500/25 hover:scale-110 transition-all duration-300 z-40 border-2 border-white/20"
          aria-label="Kembali ke atas"
        >
          <ArrowUp className="h-5 w-5 group-hover:-translate-y-1 transition-transform duration-300" />
          <div className="absolute inset-0 bg-white rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
        </button>
      )}
    </>
  );
}