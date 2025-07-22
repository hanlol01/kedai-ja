'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChefHat, Home, Menu, Settings, LogOut, User, MenuIcon, X, Star, Mail } from 'lucide-react';

export default function AdminNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const settingsTimeout = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/logout', {
        method: 'POST',
      });
      router.push('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const navItems = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: Home },
    { name: 'Menu', href: '/admin/menu', icon: Menu },
    { name: 'Testimonials', href: '/admin/testimonials', icon: Star },
    { name: 'Pesan Pengguna', href: '/admin/contact', icon: Mail },
    // Settings handled separately as dropdown
  ];

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 w-full">
          {/* Logo kiri */}
          <div className="flex items-center flex-shrink-0 mr-6">
            <Link href="/admin/dashboard" className="flex items-center space-x-2">
              <ChefHat className="h-8 w-8 text-orange-500" />
              <span className="text-xl font-bold text-gray-900">Kedai J.A Admin</span>
            </Link>
          </div>
          {/* Menu tengah (hidden di mobile) */}
          <div className="hidden md:flex items-center flex-1 justify-center">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center space-x-2 text-gray-700 hover:text-orange-500 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
            {/* Settings Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => {
                if (window.innerWidth >= 768) {
                  if (settingsTimeout.current) clearTimeout(settingsTimeout.current);
                  setIsSettingsOpen(true);
                }
              }}
              onMouseLeave={() => {
                if (window.innerWidth >= 768) {
                  settingsTimeout.current = setTimeout(() => setIsSettingsOpen(false), 200);
                }
              }}
            >
              <button
                onClick={() => setIsSettingsOpen((prev) => !prev)}
                className="flex items-center space-x-2 text-gray-700 hover:text-orange-500 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 focus:outline-none"
              >
                <Settings className="h-4 w-4" />
                <span>Pengaturan</span>
                <svg className={`h-4 w-4 ml-1 transition-transform ${isSettingsOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
              </button>
              {isSettingsOpen && (
                <div className="absolute right-0 top-full w-40 bg-white border border-gray-100 shadow-sm rounded-md z-50 p-0.5 pt-0"
                  onMouseEnter={() => { if (settingsTimeout.current) clearTimeout(settingsTimeout.current); }}
                  onMouseLeave={() => { settingsTimeout.current = setTimeout(() => setIsSettingsOpen(false), 200); }}
                >
                  <Link
                    href="/admin/settings"
                    className="block px-3 py-1.5 text-gray-700 hover:bg-gray-100 rounded transition-colors duration-150 text-sm"
                    onClick={() => setIsSettingsOpen(false)}
                  >
                    Profile Kedai
                  </Link>
                  <Link
                    href="/admin/about-us"
                    className="block px-3 py-1.5 text-gray-700 hover:bg-gray-100 rounded transition-colors duration-150 text-sm"
                    onClick={() => setIsSettingsOpen(false)}
                  >
                    Tentang Kami
                  </Link>
                </div>
              )}
            </div>
            {/* End Settings Dropdown */}
          </div>
          {/* Admin & Logout kanan */}
          <div className="flex items-center space-x-4 flex-shrink-0 ml-auto">
            <div className="flex items-center space-x-2 text-gray-700">
              <User className="h-4 w-4" />
              <span className="text-sm">Admin</span>
            </div>
            <button
              onClick={handleLogout}
              className="hidden md:flex items-center space-x-2 text-gray-700 hover:text-red-500 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
          {/* Hamburger menu mobile */}
          <div className="md:hidden ml-2">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-orange-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-orange-500"
            >
              {isMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <MenuIcon className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center space-x-2 text-gray-700 hover:text-orange-500 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
              {/* Settings Dropdown Mobile */}
              <div
                className="relative"
                onMouseEnter={() => {
                  if (window.innerWidth >= 768) {
                    if (settingsTimeout.current) clearTimeout(settingsTimeout.current);
                    setIsSettingsOpen(true);
                  }
                }}
                onMouseLeave={() => {
                  if (window.innerWidth >= 768) {
                    settingsTimeout.current = setTimeout(() => setIsSettingsOpen(false), 200);
                  }
                }}
              >
                <button
                  onClick={() => setIsSettingsOpen((prev) => !prev)}
                  className="flex items-center w-full space-x-2 text-gray-700 hover:text-orange-500 px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 focus:outline-none"
                >
                  <Settings className="h-4 w-4" />
                  <span>Pengaturan</span>
                  <svg className={`h-4 w-4 ml-1 transition-transform ${isSettingsOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                </button>
                {isSettingsOpen && (
                  <div className="mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                    <Link
                      href="/admin/settings"
                      className="block px-4 py-2 text-gray-700 hover:bg-orange-100 hover:text-orange-600 rounded-t-lg transition-colors duration-200"
                      onClick={() => { setIsSettingsOpen(false); setIsMenuOpen(false); }}
                    >
                      Profile Kedai
                    </Link>
                    <Link
                      href="/admin/about-us"
                      className="block px-4 py-2 text-gray-700 hover:bg-orange-100 hover:text-orange-600 rounded-b-lg transition-colors duration-200"
                      onClick={() => { setIsSettingsOpen(false); setIsMenuOpen(false); }}
                    >
                      Tentang Kami
                    </Link>
                  </div>
                )}
              </div>
              {/* End Settings Dropdown Mobile */}
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-700 hover:text-red-500 w-full px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}