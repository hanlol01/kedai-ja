'use client';

import { usePathname } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, ChevronRight, Home, Settings, FileText, MessageSquare, Star, Coffee, LogOut } from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  // Jika berada di halaman login, jangan tampilkan layout admin
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/logout', {
        method: 'POST',
      });
      
      if (response.ok) {
        // Redirect ke halaman login admin
        window.location.href = '/admin/login';
      } else {
        console.error('Logout failed');
        // Fallback redirect
        window.location.href = '/admin/login';
      }
    } catch (error) {
      console.error('Logout error:', error);
      // Fallback redirect
      window.location.href = '/admin/login';
    }
  };

  const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: Home },
    { name: 'Menu', href: '/admin/menu', icon: Coffee },
    { name: 'Profile', href: '/admin/settings', icon: Settings },
    { name: 'Kontak Pesan', href: '/admin/contact', icon: MessageSquare },
    { name: 'Testimoni', href: '/admin/testimonials', icon: Star },
    { name: 'Tentang Kami', href: '/admin/about-us', icon: FileText },
  ];

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 z-50 h-full w-64 transform bg-gray-800 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center justify-between bg-gray-900 px-4">
          <div className="flex items-center">
            <img src="/logo-bg.png" alt="Logo Kedai J.A" className="h-10 w-10" style={{objectFit: 'contain'}} />
            <span className="ml-3 text-xl font-bold text-white">Admin Panel</span>
          </div>
          <button
            className="lg:hidden text-gray-400 hover:text-white"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="mt-5 px-2">
          <div className="space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-primary-600 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <Icon
                    className={`mr-3 h-5 w-5 flex-shrink-0 transition-colors duration-200 ${
                      isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'
                    }`}
                  />
                  {item.name}
                  {isActive && (
                    <ChevronRight className="ml-auto h-4 w-4 text-white" />
                  )}
                </Link>
              );
            })}
          </div>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top navigation */}
        <header className="bg-gray-800 shadow-md">
          <div className="flex h-16 items-center justify-between px-4">
            <button
              className="text-gray-400 hover:text-white lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="text-lg font-semibold text-white">Kedai J.A Admin</div>
            <div className="flex items-center gap-3">
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg bg-gray-700 px-3 py-2 text-sm text-white hover:bg-gray-600 transition-colors duration-200"
              >
                Kunjungi Homepage
              </a>
              <button
                onClick={handleLogout}
                className="rounded-lg bg-red-600 px-3 py-2 text-sm text-white hover:bg-red-700 transition-colors duration-200 flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 overflow-auto p-6">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}