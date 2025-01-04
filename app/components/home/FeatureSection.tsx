import React from 'react';

const features = [
  {
    title: 'Güvenli Kimlik Doğrulama',
    description: 'JWT tabanlı güvenli oturum yönetimi ve şifreleme sistemi.',
    icon: (
      <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    bgColor: 'bg-green-100 dark:bg-green-900',
    textColor: 'text-green-600 dark:text-green-400'
  },
  {
    title: 'Hızlı Entegrasyon',
    description: 'Kolay kurulum ve hızlı entegrasyon imkanı.',
    icon: (
      <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    bgColor: 'bg-blue-100 dark:bg-blue-900',
    textColor: 'text-blue-600 dark:text-blue-400'
  },
  {
    title: 'Özelleştirilebilir',
    description: 'İhtiyaçlarınıza göre özelleştirilebilir yapı.',
    icon: (
      <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
      </svg>
    ),
    bgColor: 'bg-purple-100 dark:bg-purple-900',
    textColor: 'text-purple-600 dark:text-purple-400'
  }
];

export default function FeatureSection() {
  return (
    <div className="container mx-auto px-4 py-24">
      <div className="grid md:grid-cols-3 gap-12">
        {features.map((feature, index) => (
          <div key={index} className="space-y-4">
            <div className={`w-12 h-12 ${feature.bgColor} rounded-lg flex items-center justify-center`}>
              {feature.icon}
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              {feature.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
} 