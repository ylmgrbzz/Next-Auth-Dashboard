import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { connectDB } from '../../../lib/db';
import User from '../../../models/User';

export async function GET() {
    try {
        const cookieStore = cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            console.log('Token bulunamadı - Kullanıcı giriş yapmamış');
            return NextResponse.json(
                { message: 'Yetkilendirme hatası' },
                { status: 401 }
            );
        }

        console.log('Aktif token:', token);

        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };
        await connectDB();

        const user = await User.findById(decoded.id).select('-password');

        if (!user) {
            console.log('Token geçerli ama kullanıcı bulunamadı');
            return NextResponse.json(
                { message: 'Kullanıcı bulunamadı' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                createdAt: user.createdAt
            }
        });
    } catch (error: any) {
        console.error('Token doğrulama hatası:', error);
        return NextResponse.json(
            { message: 'Sunucu hatası', error: error.message },
            { status: 500 }
        );
    }
} 