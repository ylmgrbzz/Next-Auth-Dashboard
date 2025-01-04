import { NextResponse } from 'next/server';
import { connectDB } from '../../../lib/db';
import User from '../../../models/User';

export async function POST(req: Request) {
    try {
        await connectDB();

        // Tüm kullanıcılara varsayılan rol atama
        await User.updateMany(
            { role: { $exists: false } },
            { $set: { role: 'user' } }
        );

        // Admin kullanıcısı oluşturma
        const { email, password, name } = await req.json();

        // Email kontrolü
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            // Eğer kullanıcı varsa, admin rolü ver
            existingUser.role = 'admin';
            await existingUser.save();

            return NextResponse.json({
                success: true,
                message: 'Mevcut kullanıcı admin yapıldı',
                user: {
                    id: existingUser._id,
                    name: existingUser.name,
                    email: existingUser.email,
                    role: existingUser.role
                }
            });
        }

        // Yeni admin kullanıcısı oluştur
        const adminUser = await User.create({
            name,
            email,
            password,
            role: 'admin'
        });

        return NextResponse.json({
            success: true,
            message: 'Admin kullanıcısı oluşturuldu',
            user: {
                id: adminUser._id,
                name: adminUser.name,
                email: adminUser.email,
                role: adminUser.role
            }
        });

    } catch (error: any) {
        console.error('Admin kurulum hatası:', error);
        return NextResponse.json(
            { message: 'Admin kurulumu sırasında hata oluştu', error: error.message },
            { status: 500 }
        );
    }
} 