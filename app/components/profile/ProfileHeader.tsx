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
    <div className="relative mb-8">
      <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-500 rounded-t-lg"></div>
      <div className="absolute -bottom-16 left-4 sm:left-8">
        <div
          className="relative group"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <div className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 overflow-hidden bg-gray-100 dark:bg-gray-700">
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
              className={`absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center transition-opacity cursor-pointer ${
                isHovering || uploading ? 'opacity-100' : 'opacity-0'
              }`}
              onClick={() => fileInputRef.current?.click()}
            >
              {uploading ? (
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent"></div>
              ) : (
                <span className="text-white text-sm">Fotoğrafı Değiştir</span>
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
      </div>
      <div className="ml-40 pt-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{user.name}</h1>
        <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
      </div>
    </div>
  );
} 