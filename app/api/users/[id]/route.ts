import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import User from '@/models/User';

export async function PATCH(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        await connectDB();

        const { name, email } = await req.json();

        if (!name && !email) {
            return NextResponse.json(
                { message: 'Güncellenecek alan bulunamadı' },
                { status: 400 }
            );
        }

        // Email formatını kontrol et
        if (email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return NextResponse.json(
                    { message: 'Geçersiz email formatı' },
                    { status: 400 }
                );
            }

            // Email benzersiz mi kontrol et
            const existingUser = await User.findOne({ email, _id: { $ne: params.id } });
            if (existingUser) {
                return NextResponse.json(
                    { message: 'Bu email adresi başka bir kullanıcı tarafından kullanılıyor' },
                    { status: 400 }
                );
            }
        }

        const updateData: { name?: string; email?: string } = {};
        if (name) updateData.name = name;
        if (email) updateData.email = email;

        const user = await User.findByIdAndUpdate(
            params.id,
            updateData,
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