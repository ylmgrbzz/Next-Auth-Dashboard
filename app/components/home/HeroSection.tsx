import React from 'react';
import Link from 'next/link';

export default function HeroSection() {
  return (
    <div className="grid md:grid-cols-2 gap-12 items-center">
      <div className="space-y-8">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white">
          Modern Auth <span className="text-indigo-600 dark:text-indigo-400">Çözümü</span>
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          Güvenli, hızlı ve kullanıcı dostu authentication sistemi. Next.js ve MongoDB ile geliştirilmiş modern bir çözüm.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/signup"
            className="px-8 py-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-center"
          >
            Hemen Başla
          </Link>
          <Link
            href="/docs"
            className="px-8 py-4 border-2 border-indigo-600 text-indigo-600 dark:text-indigo-400 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/50 transition-colors text-center"
          >
            Dökümantasyon
          </Link>
        </div>
      </div>
      <div className="relative h-[400px] hidden md:block">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl transform rotate-6 opacity-20"></div>
        <div className="absolute inset-0 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">
          <div className="h-full border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mx-auto"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mx-auto"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 