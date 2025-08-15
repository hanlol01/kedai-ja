'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChefHat, Users, Clock, Star, TrendingUp, Menu } from 'lucide-react';

interface DashboardStats {
  totalMenuItems: number;
  availableItems: number;
  foodItems: number;
  drinkItems: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalMenuItems: 0,
    availableItems: 0,
    foodItems: 0,
    drinkItems: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/menu', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.status === 401) {
        router.push('/admin/login');
        return;
      }
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.menuItems && Array.isArray(data.menuItems)) {
        const totalMenuItems = data.menuItems.length;
        const availableItems = data.menuItems.filter((item: any) => item.available).length;
        const foodItems = data.menuItems.filter((item: any) => item.category === 'Makanan').length;
        const drinkItems = data.menuItems.filter((item: any) => item.category === 'Minuman').length;
        
        setStats({
          totalMenuItems,
          availableItems,
          foodItems,
          drinkItems,
        });
      } else {
        setStats({
          totalMenuItems: 0,
          availableItems: 0,
          foodItems: 0,
          drinkItems: 0,
        });
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching stats:', error);
      setError(error instanceof Error ? error.message : 'Failed to load dashboard data');
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Menu Items',
      value: stats.totalMenuItems,
      icon: Menu,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
    },
    {
      title: 'Available Items',
      value: stats.availableItems,
      icon: Star,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
    },
    {
      title: 'Food Items',
      value: stats.foodItems,
      icon: ChefHat,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600',
    },
    {
      title: 'Drink Items',
      value: stats.drinkItems,
      icon: Users,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
    },
  ];

  if (loading) {
    return (
      <div className="w-full">
        <div className="text-center py-16">
          <div className="relative mx-auto">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-200/20 border-t-primary-500 mx-auto"></div>
            <div className="absolute inset-0 rounded-full h-16 w-16 border-4 border-transparent border-t-secondary-400/50 animate-pulse mx-auto"></div>
          </div>
          <p className="mt-6 text-gray-300">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full">
        <div className="text-center py-16">
          <div className="bg-red-900/30 border border-red-700/30 rounded-lg p-6 backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-red-300 mb-2">Error Loading Dashboard</h3>
            <p className="text-red-200 mb-4">{error}</p>
            <button
              onClick={fetchStats}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-300 mt-2">Selamat datang di panel admin Kedai J.A</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.title} className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl shadow-lg p-6 hover:bg-gray-700/50 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-300">{card.title}</p>
                  <p className="text-3xl font-bold text-white mt-1">{card.value}</p>
                </div>
                <div className="bg-gray-900/70 rounded-xl p-3 border border-gray-700/50">
                  <Icon className="h-6 w-6 text-primary-400" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <a
              href="/admin/menu"
              className="flex items-center space-x-3 p-3 bg-primary-900/30 rounded-lg hover:bg-primary-800/50 transition-colors duration-200 border border-primary-700/30"
            >
              <Menu className="h-5 w-5 text-primary-400" />
              <span className="text-gray-200">Kelola Menu</span>
            </a>
            <a
              href="/admin/settings"
              className="flex items-center space-x-3 p-3 bg-gray-700/50 rounded-lg hover:bg-gray-600/50 transition-colors duration-200 border border-gray-600/30"
            >
              <Users className="h-5 w-5 text-gray-300" />
              <span className="text-gray-200">Pengaturan Restoran</span>
            </a>
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-white mb-4">Recent Activity</h2>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-gray-700/50 rounded-lg border border-gray-600/30">
              <TrendingUp className="h-5 w-5 text-green-400" />
              <div>
                <p className="text-sm font-medium text-gray-200">Dashboard accessed</p>
                <p className="text-xs text-gray-400">Just now</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-700/50 rounded-lg border border-gray-600/30">
              <Clock className="h-5 w-5 text-blue-400" />
              <div>
                <p className="text-sm font-medium text-gray-200">System status: Online</p>
                <p className="text-xs text-gray-400">All services running</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-white mb-4">System Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-300">Database Connected</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-300">API Services Running</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-300">Admin Panel Active</span>
          </div>
        </div>
      </div>
    </div>
  );
}