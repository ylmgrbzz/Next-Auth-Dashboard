'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '../components/layout/DashboardLayout';
import StatsCards from '../components/dashboard/StatsCards';
import RecentActivity from '../components/dashboard/RecentActivity';

interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('Stored token:', token);

    const fetchUserData = async () => {
      try {
        if (!token) {
          console.log('Token bulunamadı, login sayfasına yönlendiriliyor...');
          router.push('/login');
          return;
        }

        const res = await fetch('/api/auth/user', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        const data = await res.json();
        
        if (!res.ok) {
          throw new Error(data.message);
        }

        console.log('Token:', token);
        console.log('Kullanıcı bilgileri:', data.user);
        setUser(data.user);
      } catch (error) {
        console.error('Kullanıcı bilgileri alınamadı:', error);
        localStorage.removeItem('token');
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  const handleLogout = async () => {
    try {
      localStorage.removeItem('token');
      
      const res = await fetch('/api/auth/logout', {
        method: 'POST',
      });

      if (res.ok) {
        console.log('Başarıyla çıkış yapıldı');
        router.push('/login');
      } else {
        throw new Error('Çıkış yapılırken bir hata oluştu');
      }
    } catch (error) {
      console.error('Çıkış yapılırken hata oluştu:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <DashboardLayout user={user} onLogout={handleLogout}>
      <StatsCards />
      <RecentActivity />
    </DashboardLayout>
  );
} 