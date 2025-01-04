import { NextResponse } from 'next/server';
import { connectDB } from '../../../lib/db';
import User from '../../../models/User';

export async function GET() {
    try {
        await connectDB();

        // Role alanı olmayan kullanıcıları bul ve güncelle
        const result = await User.updateMany(
            { role: { $exists: false } },
            { $set: { role: 'user' } }
        );

        // Güncellenen kullanıcıları getir
        const updatedUsers = await User.find().select('-password');

        return NextResponse.json({
            success: true,
            message: `${result.modifiedCount} kullanıcı güncellendi`,
            users: updatedUsers.map(user => ({
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }))
        });

    } catch (error: any) {
        console.error('Rol güncelleme hatası:', error);
        return NextResponse.json(
            { message: 'Roller güncellenirken hata oluştu', error: error.message },
            { status: 500 }
        );
    }
} 