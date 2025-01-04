"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileInfo from "@/components/profile/ProfileInfo";
import UsersList from "@/components/profile/UsersList";

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: string;
}

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        // Kullanıcı bilgilerini al
        const userRes = await fetch("/api/auth/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!userRes.ok) {
          throw new Error("Kullanıcı bilgileri alınamadı");
        }

        const userData = await userRes.json();
        setUser(userData.user);

        // Tüm kullanıcıları al
        const usersRes = await fetch("/api/users");
        if (!usersRes.ok) {
          throw new Error("Kullanıcı listesi alınamadı");
        }

        const usersData = await usersRes.json();
        setUsers(usersData.users);
      } catch (error) {
        console.error("Veri alınırken hata:", error);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const handleLogout = async () => {
    try {
      localStorage.removeItem("token");
      const res = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (res.ok) {
        router.push("/login");
      }
    } catch (error) {
      console.error("Çıkış yapılırken hata:", error);
    }
  };

  const handleAvatarUpdate = async (file: File) => {
    if (!user) return;

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const res = await fetch(`/api/users/${user.id}/avatar`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Avatar güncellenirken hata oluştu");
      }

      const data = await res.json();
      setUser(data.user);
    } catch (error) {
      console.error("Avatar güncellenirken hata:", error);
    }
  };

  const handleProfileUpdate = async (data: { name: string }) => {
    if (!user) return;

    try {
      const res = await fetch(`/api/users/${user.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error("Profil güncellenirken hata oluştu");
      }

      const responseData = await res.json();
      setUser(responseData.user);
    } catch (error) {
      console.error("Profil güncellenirken hata:", error);
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
        <ProfileHeader user={user} onAvatarUpdate={handleAvatarUpdate} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <ProfileInfo user={user} onUpdate={handleProfileUpdate} />
          </div>
          <div className="lg:col-span-2">
            <UsersList users={users} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
