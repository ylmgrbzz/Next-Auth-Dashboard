'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '../../components/layout/DashboardLayout';
import ProfileHeader from '../../components/profile/ProfileHeader';
import UsersList from '../../components/profile/UsersList';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: string;
}

export default function Profile() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      // Mevcut kullanıcı bilgilerini al
      const userRes = await fetch('/api/auth/user', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!userRes.ok) throw new Error('Kullanıcı bilgileri alınamadı');
      
      const userData = await userRes.json();
      setCurrentUser(userData.user);

      // Tüm kullanıcıları al
      const usersRes = await fetch('/api/users');
      if (!usersRes.ok) throw new Error('Kullanıcı listesi alınamadı');
      
      const usersData = await usersRes.json();
      setAllUsers(usersData.users);

    } catch (error) {
      console.error('Veri yükleme hatası:', error);
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [router]);

  const handleAvatarUpdate = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const res = await fetch('/api/users/avatar', {
        method: 'POST',
        body: formData
      });

      if (!res.ok) {
        throw new Error('Avatar yüklenemedi');
      }

      const data = await res.json();
      
      // Avatar güncellemesinden sonra tüm kullanıcı verilerini yeniden yükle
      await fetchUserData();

      // Başarı mesajı göster
      console.log('Avatar başarıyla güncellendi');

    } catch (error) {
      console.error('Avatar yükleme hatası:', error);
      throw error;
    }
  };

  const handleLogout = async () => {
    try {
      localStorage.removeItem('token');
      
      const res = await fetch('/api/auth/logout', {
        method: 'POST',
      });

      if (res.ok) {
        router.push('/login');
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
    <DashboardLayout user={currentUser} onLogout={handleLogout}>
      <div className="space-y-6">
        {currentUser && (
          <ProfileHeader 
            user={currentUser}
            onAvatarUpdate={handleAvatarUpdate}
          />
        )}
        <UsersList users={allUsers} />
      </div>
    </DashboardLayout>
  );
} 