"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import DashboardLayout from "../../components/layout/DashboardLayout";

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: string;
  role: string;
}

export default function UserDetail() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [viewedUser, setViewedUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const params = useParams();
  const userId = params?.id as string;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        // Giriş yapmış kullanıcının bilgilerini al
        const currentUserRes = await fetch("/api/auth/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!currentUserRes.ok) {
          throw new Error("Kullanıcı bilgileri alınamadı");
        }

        const currentUserData = await currentUserRes.json();
        console.log(currentUserData);
        setCurrentUser(currentUserData.user);

        // Görüntülenen kullanıcının bilgilerini al
        const viewedUserRes = await fetch(`/api/users/${userId}`);
        if (!viewedUserRes.ok) {
          throw new Error("Kullanıcı bilgileri alınamadı");
        }

        const viewedUserData = await viewedUserRes.json();
        setViewedUser(viewedUserData.user);
      } catch (error) {
        console.error("Veri alınırken hata:", error);
        router.push("/dashboard");
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchData();
    }
  }, [router, userId]);

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

  if (loading || !currentUser || !viewedUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <DashboardLayout user={currentUser} onLogout={handleLogout}>
      <div className="space-y-8">
        {/* Kullanıcı Profil Kartı */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="relative h-32 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>
          </div>

          <div className="relative px-6 pb-6">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              {/* Avatar */}
              <div className="relative -mt-16">
                <div className="w-32 h-32 rounded-full ring-4 ring-white dark:ring-gray-800 overflow-hidden bg-white">
                  {viewedUser.avatar ? (
                    <Image
                      src={viewedUser.avatar}
                      alt={viewedUser.name}
                      width={128}
                      height={128}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Image
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                        viewedUser.name
                      )}&size=128&background=random`}
                      alt={viewedUser.name}
                      width={128}
                      height={128}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              </div>

              {/* Kullanıcı Bilgileri */}
              <div className="flex-1 text-center sm:text-left mt-4 sm:mt-0">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                  {viewedUser.name}
                </h1>
                <p className="mt-2 text-gray-500 dark:text-gray-400">
                  {viewedUser.email}
                </p>
                <div className="mt-4 flex flex-wrap gap-4 justify-center sm:justify-start">
                  <div className="bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-full">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                      Kayıt Tarihi:{" "}
                      {new Date(viewedUser.createdAt).toLocaleDateString(
                        "tr-TR",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Geri Dön Butonu */}
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Geri Dön
        </button>
      </div>
    </DashboardLayout>
  );
}
