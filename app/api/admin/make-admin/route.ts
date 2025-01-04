import { NextResponse } from 'next/server';
import { connectDB } from '../../../lib/db';
import User from '../../../models/User';

export async function POST(req: Request) {
    try {
        await connectDB();
        const { email } = await req.json();

        // Kullanıcıyı bul ve admin yap
        const user = await User.findOne({ email });

        if (!user) {
            return NextResponse.json(
                { message: 'Kullanıcı bulunamadı' },
                { status: 404 }
            );
        }

        user.role = 'admin';
        await user.save();

        return NextResponse.json({
            success: true,
            message: 'Kullanıcı admin yapıldı',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error: any) {
        console.error('Admin yapma hatası:', error);
        return NextResponse.json(
            { message: 'Kullanıcı admin yapılırken hata oluştu', error: error.message },
            { status: 500 }
        );
    }
} 