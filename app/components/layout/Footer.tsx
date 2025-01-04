import React from 'react';

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-gray-600 dark:text-gray-400">
          &copy; {new Date().getFullYear()} AuthFlow. Tüm hakları saklıdır.
        </div>
      </div>
    </footer>
  );
} 