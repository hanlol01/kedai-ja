'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

interface HeaderProps {
  currentPath?: string;
}

export default function Header({ currentPath = '/' }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    // Handle scroll event for navbar appearance
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);
    
    // Fetch settings
    fetchSettings();
    
    // Clean up
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings');
      const data = await response.json();
      setSettings(data.settings || {
        restaurantName: 'Kedai J.A',
      });
    } catch (error) {
      console.error('Error fetching settings:', error);
      setSettings({
        restaurantName: 'Kedai J.A',
      });
    }
  };

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Menu', href: '/menu' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'py-3' : 'py-5'} bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white`}>
      <div className="container-fluid">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <img 
                  src="/logo-bg.png" 
                  alt="Logo Kedai J.A" 
                  className="h-10 w-10 transition-transform duration-300 group-hover:scale-110" 
                  style={{objectFit: 'contain'}} 
                />
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              </div>
              <span className="text-xl font-primary font-bold text-white group-hover:text-primary-300 transition-colors duration-300">
                {settings?.restaurantName || 'Kedai J.A'}
              </span>
            </Link>
          </div>

          <div className="hidden md:block">
            <div className="flex items-center space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 group
                    ${currentPath === item.href 
                      ? 'text-primary-300 bg-white/10' 
                      : 'text-gray-300 hover:text-primary-300 hover:bg-white/5'}`}
                >
                  <span className="relative z-10">{item.name}</span>
                </Link>
              ))}
              <div className="ml-4 flex items-center space-x-3">
                <Link
                  href="/menu"
                  className="group inline-flex items-center space-x-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white px-4 py-2 rounded-xl hover:from-primary-600 hover:to-primary-700 hover:shadow-lg hover:scale-105 transition-all duration-300"
                >
                  <span className="font-medium">Pesan Sekarang</span>
                </Link>
              </div>
            </div>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-gray-300 hover:text-primary-300 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-300"
            >
              {isMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4">
            <div className="px-2 pt-2 pb-3 space-y-1 border-t border-gray-700 bg-gray-800/95 backdrop-blur-md rounded-lg">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block px-3 py-3 text-base font-medium rounded-lg transition-all duration-300
                    ${currentPath === item.href 
                      ? 'text-primary-300 bg-white/10' 
                      : 'text-gray-300 hover:text-primary-300 hover:bg-white/5'}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="px-3 py-3">
                <Link
                  href="/menu"
                  className="group inline-flex items-center justify-center w-full space-x-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white px-4 py-2 rounded-xl hover:from-primary-600 hover:to-primary-700 hover:shadow-lg transition-all duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="font-medium">Pesan Sekarang</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
