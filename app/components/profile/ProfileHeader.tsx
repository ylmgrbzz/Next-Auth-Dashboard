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
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      await onAvatarUpdate(file);
    } catch (error) {
      console.error('Avatar yükleme hatası:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <div className="flex flex-col sm:flex-row items-center gap-6">
        <div 
          className="relative"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <div className="w-32 h-32 rounded-full overflow-hidden relative">
            <Image
              src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&size=128&background=random`}
              alt={user.name}
              width={128}
              height={128}
              className="object-cover"
            />
            {isHovering && !uploading && (
              <div 
                className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <span className="text-white text-sm">Fotoğrafı Değiştir</span>
              </div>
            )}
            {uploading && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
              </div>
            )}
          </div>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>
        <div className="flex-1 text-center sm:text-left">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {user.name}
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            {user.email}
          </p>
          <div className="mt-4 flex flex-wrap gap-2 justify-center sm:justify-start">
            <span className="px-3 py-1 text-sm bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 rounded-full">
              Aktif Kullanıcı
            </span>
            <span className="px-3 py-1 text-sm bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 rounded-full">
              Email Doğrulandı
            </span>
          </div>
        </div>
      </div>
    </div>
  );
} 