import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import User from '@/models/User';

export async function PATCH(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        await connectDB();

        const { name } = await req.json();

        if (!name) {
            return NextResponse.json(
                { message: 'İsim alanı zorunludur' },
                { status: 400 }
            );
        }

        const user = await User.findByIdAndUpdate(
            params.id,
            { name },
            { new: true }
        ).select('-password');

        if (!user) {
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
        return NextResponse.json(
            { message: 'Kullanıcı güncellenirken hata oluştu', error: error.message },
            { status: 500 }
        );
    }
} 