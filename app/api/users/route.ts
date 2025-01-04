import { NextResponse } from 'next/server';
import { requireAdmin, requireAuth } from '@/middleware/authMiddleware';
import { connectDB } from '@/lib/db';
import User from '@/models/User';

// Tüm kullanıcıları getir (Sadece admin)
export const GET = requireAdmin(async (req: Request, currentUser: any) => {
    try {
        await connectDB();

        const users = await User.find()
            .select('-password')
            .sort({ createdAt: -1 });

        return NextResponse.json({
            success: true,
            users: users.map(user => ({
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
                createdAt: user.createdAt
            }))
        });
    } catch (error: any) {
        console.error('Kullanıcılar alınırken hata:', error);
        return NextResponse.json(
            { message: 'Kullanıcılar alınırken hata oluştu', error: error.message },
            { status: 500 }
        );
    }
});

// Yeni kullanıcı oluştur (Sadece admin)
export const POST = requireAdmin(async (req: Request, currentUser: any) => {
    try {
        await connectDB();
        const { name, email, password, role = 'user' } = await req.json();

        // Email kontrolü
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json(
                { message: 'Bu email adresi zaten kullanılıyor' },
                { status: 400 }
            );
        }

        // Yeni kullanıcı oluştur
        const user = await User.create({
            name,
            email,
            password,
            role
        });

        return NextResponse.json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
                createdAt: user.createdAt
            }
        });
    } catch (error: any) {
        console.error('Kullanıcı oluşturulurken hata:', error);
        return NextResponse.json(
            { message: 'Kullanıcı oluşturulurken hata oluştu', error: error.message },
            { status: 500 }
        );
    }
}); 