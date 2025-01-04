'use client';

import React, { useState } from 'react';
import Sidebar from '../dashboard/Sidebar';
import Topbar from '../dashboard/Topbar';

interface DashboardLayoutProps {
  children: React.ReactNode;
  user: {
    name: string;
    email: string;
  } | null;
  onLogout: () => void;
}

export default function DashboardLayout({ children, user, onLogout }: DashboardLayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar isMenuOpen={isMenuOpen} onLogout={onLogout} />
      
      <div className="p-4 sm:ml-64">
        <div className="p-4">
          <Topbar user={user} onMenuToggle={() => setIsMenuOpen(!isMenuOpen)} />
          <main>
            {children}
          </main>
        </div>
      </div>
    </div>
  );
} 