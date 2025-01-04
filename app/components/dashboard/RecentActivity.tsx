import React from 'react';

const activities = [
  {
    name: 'John Doe',
    action: 'Yeni hesap oluşturuldu',
    time: '5 dakika önce',
    avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=random'
  },
  {
    name: 'Jane Smith',
    action: 'Profil güncellendi',
    time: '15 dakika önce',
    avatar: 'https://ui-avatars.com/api/?name=Jane+Smith&background=random'
  }
];

export default function RecentActivity() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Son Aktiviteler
        </h3>
      </div>
      <div className="p-4">
        <div className="flow-root">
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {activities.map((activity, index) => (
              <li key={index} className="py-3">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <img className="w-8 h-8 rounded-full" src={activity.avatar} alt="user" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                      {activity.name}
                    </p>
                    <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                      {activity.action}
                    </p>
                  </div>
                  <div className="inline-flex items-center text-sm text-gray-500 dark:text-gray-400">
                    {activity.time}
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