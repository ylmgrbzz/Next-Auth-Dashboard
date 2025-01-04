import { NextResponse } from 'next/server';
import { connectDB } from '../../../../lib/db';
import User from '../../../../models/User';

export async function POST(
    req: Request,
    context: { params: { id: string } }
) {
    try {
        const { id } = await Promise.resolve(context.params);
        await connectDB();

        const formData = await req.formData();
        const file = formData.get('avatar') as File;

        if (!file) {
            return NextResponse.json(
                { message: 'Dosya bulunamadı' },
                { status: 400 }
            );
        }

        // Dosya tipini kontrol et
        if (!file.type.startsWith('image/')) {
            return NextResponse.json(
                { message: 'Sadece resim dosyaları yüklenebilir' },
                { status: 400 }
            );
        }

        // Dosya boyutunu kontrol et (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            return NextResponse.json(
                { message: 'Dosya boyutu 5MB\'dan büyük olamaz' },
                { status: 400 }
            );
        }

        // Dosyayı base64'e çevir
        const buffer = await file.arrayBuffer();
        const base64 = Buffer.from(buffer).toString('base64');
        const avatar = `data:${file.type};base64,${base64}`;

        // Kullanıcıyı güncelle
        const user = await User.findByIdAndUpdate(
            id,
            { avatar },
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
        console.error('Avatar yükleme hatası:', error);
        return NextResponse.json(
            { message: 'Avatar güncellenirken hata oluştu', error: error.message },
            { status: 500 }
        );
    }
} 