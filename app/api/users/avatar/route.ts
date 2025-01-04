import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get('avatar') as File;

        if (!file) {
            return NextResponse.json(
                { message: 'Dosya yüklenemedi' },
                { status: 400 }
            );
        }

        // Token kontrolü
        const cookieStore = cookies();
        const token = cookieStore.get('token')?.value;
        if (!token) {
            return NextResponse.json(
                { message: 'Yetkilendirme hatası' },
                { status: 401 }
            );
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };
        await connectDB();

        // Dosya uzantısı kontrolü
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json(
                { message: 'Sadece JPEG, PNG ve WEBP formatları desteklenir' },
                { status: 400 }
            );
        }

        // Dosya boyutu kontrolü (5MB)
        if (file.size > 5 * 1024 * 1024) {
            return NextResponse.json(
                { message: 'Dosya boyutu 5MB\'dan büyük olamaz' },
                { status: 400 }
            );
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Uploads klasörünü kontrol et ve yoksa oluştur
        const uploadsDir = join(process.cwd(), 'public', 'uploads');
        try {
            await mkdir(uploadsDir, { recursive: true });
        } catch (err) {
            console.log('Uploads klasörü zaten var veya oluşturuldu');
        }

        // Dosya adı oluştur
        const fileName = `avatar-${decoded.id}-${Date.now()}.${file.type.split('/')[1]}`;
        const filePath = join(uploadsDir, fileName);

        // Dosyayı kaydet
        await writeFile(filePath, buffer);
        console.log('Dosya başarıyla kaydedildi:', filePath);

        // Eski avatarı temizle
        const oldUser = await User.findById(decoded.id);
        if (oldUser?.avatar) {
            const oldAvatarPath = join(process.cwd(), 'public', oldUser.avatar);
            try {
                await unlink(oldAvatarPath);
                console.log('Eski avatar silindi:', oldAvatarPath);
            } catch (err) {
                console.log('Eski avatar silinirken hata oluştu veya bulunamadı');
            }
        }

        // Kullanıcı bilgilerini güncelle
        const user = await User.findByIdAndUpdate(
            decoded.id,
            { avatar: `/uploads/${fileName}` },
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
            message: 'Avatar başarıyla güncellendi',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar
            }
        });

    } catch (error: any) {
        console.error('Avatar yükleme hatası:', error);
        return NextResponse.json(
            { message: 'Avatar yüklenirken hata oluştu', error: error.message },
            { status: 500 }
        );
    }
} 