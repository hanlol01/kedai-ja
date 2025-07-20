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
}

export default function Footer() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [email, setEmail] = useState('');
  const [newsletterLoading, setNewsletterLoading] = useState(false);
  const [newsletterMessage, setNewsletterMessage] = useState('');
  const [newsletterError, setNewsletterError] = useState('');
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
        hours: 'Senin - Minggu, 09.00 - 21.00'
      });
    } catch (error) {
      console.error('Error fetching settings:', error);
      setSettings({
        restaurantName: 'Kedai J.A',
        description: 'Nikmati cita rasa autentik Indonesia dengan resep turun-temurun yang telah diwariskan dari generasi ke generasi',
        address: 'Jl. Raya Leles No.45, Garut',
        contact: '081234567890',
        hours: 'Senin - Minggu, 09.00 - 21.00'
      });
    }
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNewsletterLoading(true);
    setNewsletterMessage('');
    setNewsletterError('');

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      setNewsletterMessage('Terima kasih! Anda telah berhasil berlangganan newsletter.');
      setEmail('');
    } catch (error) {
      setNewsletterError(error instanceof Error ? error.message : 'Something went wrong');
    } finally {
      setNewsletterLoading(false);
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
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Column */}
            <div>
              <h3 className="text-lg font-semibold mb-6 text-orange-400">Perusahaan</h3>
              <ul className="space-y-3">
                {companyLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-300 hover:text-orange-400 transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Column */}
            <div>
              <h3 className="text-lg font-semibold mb-6 text-orange-400">Kontak</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-orange-400 mt-1 flex-shrink-0" />
                  <span className="text-gray-300">{settings.address}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-orange-400 flex-shrink-0" />
                  <span className="text-gray-300">{settings.contact}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-orange-400 flex-shrink-0" />
                  <span className="text-gray-300">info@kedai-ja.com</span>
                </div>
              </div>

              {/* Newsletter Subscription */}
              <div className="mt-6">
                <h4 className="text-sm font-semibold mb-3 text-orange-400">Newsletter</h4>
                <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                  <div className="flex">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email Anda"
                      required
                      className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-l-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-white"
                    />
                    <button
                      type="submit"
                      disabled={newsletterLoading}
                      className="bg-orange-500 text-white px-4 py-2 rounded-r-md hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                      {newsletterLoading ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {newsletterMessage && (
                    <p className="text-green-400 text-sm">{newsletterMessage}</p>
                  )}
                  {newsletterError && (
                    <p className="text-red-400 text-sm flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {newsletterError}
                    </p>
                  )}
                </form>
              </div>

              {/* Social Media */}
              <div className="mt-6">
                <h4 className="text-sm font-semibold mb-3 text-orange-400">Ikuti Kami</h4>
                <div className="flex space-x-4">
                  {socialLinks.map((social) => {
                    const Icon = social.icon;
                    return (
                      <a
                        key={social.name}
                        href={social.href}
                        className={`text-gray-400 ${social.color} transition-colors duration-200`}
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
              <h3 className="text-lg font-semibold mb-6 text-orange-400">Jam Buka</h3>
              <div className="flex items-start space-x-3">
                <Clock className="h-5 w-5 text-orange-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-300">{settings.hours}</p>
                  <p className="text-sm text-gray-400 mt-2">
                    Kami siap melayani Anda setiap hari dengan menu terbaik
                  </p>
                </div>
              </div>
            </div>

            {/* Rating Column */}
            <div>
              <h3 className="text-lg font-semibold mb-6 text-orange-400">Beri Rating Kami</h3>
              <div className="space-y-4">
                <p className="text-gray-300 text-sm">
                  Bagikan pengalaman Anda dan bantu kami memberikan pelayanan yang lebih baik
                </p>
                <Link
                  href="/testimonial"
                  className="inline-flex items-center space-x-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors duration-200"
                >
                  <Star className="h-4 w-4" />
                  <span>Beri Rating</span>
                </Link>
                <div className="text-sm text-gray-400">
                  <p>Testimoni Anda sangat berarti bagi kami</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center mb-4 md:mb-0">
                <ChefHat className="h-6 w-6 text-orange-500 mr-2" />
                <span className="text-lg font-bold">{settings.restaurantName}</span>
              </div>
              
              <div className="flex flex-wrap justify-center md:justify-end space-x-6 mb-4 md:mb-0">
                {bottomLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="text-gray-400 hover:text-orange-400 transition-colors duration-200 text-sm"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
            
            <div className="text-center mt-4 pt-4 border-t border-gray-800">
              <p className="text-gray-400 text-sm">
                &copy; 2024 {settings.restaurantName}. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-20 right-4 bg-orange-500 text-white p-3 rounded-full shadow-lg hover:bg-orange-600 transition-all duration-300 z-40"
          aria-label="Back to top"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      )}
    </>
  );
}