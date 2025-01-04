import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import User from '@/models/User';

export async function GET() {
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
                avatar: user.avatar,
                createdAt: user.createdAt
            }))
        });
    } catch (error: any) {
        return NextResponse.json(
            { message: 'Kullanıcılar alınırken hata oluştu', error: error.message },
            { status: 500 }
        );
    }
} 