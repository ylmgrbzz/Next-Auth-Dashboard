import React from 'react';

export default function AdminSetup() {
    const handleUpdateRoles = async () => {
        try {
            const response = await fetch('/api/admin/update-roles');
            const data = await response.json();
            alert(data.message);
        } catch (error) {
            alert('Hata oluştu');
        }
    };

    const handleMakeAdmin = async () => {
        try {
            const response = await fetch('/api/admin/make-admin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: 'ylmgrbz@gmail.com'
                })
            });
            const data = await response.json();
            alert(data.message);
        } catch (error) {
            alert('Hata oluştu');
        }
    };

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Admin Kurulum</h1>
            
            <div className="space-y-4">
                <div>
                    <h2 className="text-xl mb-2">1. Tüm Kullanıcılara Rol Ekle</h2>
                    <button 
                        onClick={handleUpdateRoles}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Rolleri Güncelle
                    </button>
                </div>

                <div>
                    <h2 className="text-xl mb-2">2. Admin Yap</h2>
                    <button 
                        onClick={handleMakeAdmin}
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    >
                        ylmgrbz@gmail.com kullanıcısını admin yap
                    </button>
                </div>
            </div>
        </div>
    );
} 