'use client';

import React from 'react';
import Image from 'next/image';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: string;
}

interface UsersListProps {
  users: User[];
}

export default function UsersList({ users }: UsersListProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Tüm Kullanıcılar
        </h3>
      </div>
      <div className="p-4">
        <div className="flow-root">
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {users.map((user) => (
              <li key={user.id} className="py-4">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <Image
                      className="w-10 h-10 rounded-full"
                      src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`}
                      alt={user.name}
                      width={40}
                      height={40}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                      {user.name}
                    </p>
                    <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                      {user.email}
                    </p>
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(user.createdAt).toLocaleDateString('tr-TR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
} 