'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '../components/layout/DashboardLayout';
import StatsCards from '../components/dashboard/StatsCards';
import UsersList from '../components/profile/UsersList';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: string;
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.log('Token bulunamadı, login sayfasına yönlendiriliyor...');
          router.push('/login');
          return;
        }

        // Kullanıcı bilgilerini al
        const userRes = await fetch('/api/auth/user', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!userRes.ok) {
          throw new Error('Kullanıcı bilgileri alınamadı');
        }

        const userData = await userRes.json();
        setUser(userData.user);

        // Tüm kullanıcıları al
        const usersRes = await fetch('/api/users');
        if (!usersRes.ok) {
          throw new Error('Kullanıcı listesi alınamadı');
        }

        const usersData = await usersRes.json();
        setUsers(usersData.users);
      } catch (error) {
        console.error('Veri alınırken hata:', error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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

  if (!user) {
    return null;
  }

  return (
    <DashboardLayout user={user} onLogout={handleLogout}>
      <div className="space-y-8">
        <StatsCards />
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <UsersList users={users} />
        </div>
      </div>
    </DashboardLayout>
  );
} 