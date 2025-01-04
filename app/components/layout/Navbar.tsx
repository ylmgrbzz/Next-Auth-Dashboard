import React from 'react';
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center mb-16">
      <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
        AuthFlow
      </div>
      <div className="space-x-4">
        <Link 
          href="/login"
          className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
        >
          Giriş Yap
        </Link>
        <Link
          href="/signup"
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Üye Ol
        </Link>
      </div>
    </nav>
  );
} 