'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';

interface ProfileHeaderProps {
  user: {
    name: string;
    email: string;
    avatar?: string;
  };
  onAvatarUpdate: (file: File) => Promise<void>;
}

export default function ProfileHeader({ user, onAvatarUpdate }: ProfileHeaderProps) {
  const [isHovering, setIsHovering] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      await onAvatarUpdate(file);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="relative mb-24 sm:mb-32">
      {/* Kapak Fotoğrafı */}
      <div className="h-48 sm:h-64 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-xl overflow-hidden relative">
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
      </div>

      {/* Profil Bilgileri Container */}
      <div className="absolute -bottom-16 sm:-bottom-24 left-1/2 transform -translate-x-1/2 w-full px-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-4 sm:p-6 max-w-3xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
            {/* Avatar */}
            <div
              className="relative group"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
            >
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full ring-4 ring-white dark:ring-gray-800 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600">
                {user.avatar ? (
                  <Image
                    src={user.avatar}
                    alt={user.name}
                    width={128}
                    height={128}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Image
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&size=128&background=random`}
                    alt={user.name}
                    width={128}
                    height={128}
                    className="w-full h-full object-cover"
                  />
                )}
                <div
                  className={`absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center transition-all duration-300 cursor-pointer ${
                    isHovering || uploading ? 'opacity-100' : 'opacity-0'
                  }`}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {uploading ? (
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent"></div>
                  ) : (
                    <div className="text-white text-center">
                      <svg className="w-6 h-6 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-xs">Değiştir</span>
                    </div>
                  )}
                </div>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
                disabled={uploading}
              />
            </div>

            {/* Kullanıcı Bilgileri */}
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1">
                {user.name}
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base">
                {user.email}
              </p>
            </div>

            {/* Sağ Taraf İstatistikler */}
            <div className="flex gap-6 items-center">
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">28</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Gönderi</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">2.4K</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Takipçi</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 