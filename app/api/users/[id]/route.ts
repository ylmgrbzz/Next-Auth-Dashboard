import { NextResponse } from 'next/server';
import { connectDB } from '../../../lib/db';
import User from '../../../models/User';
import { requireAuth, requireAdmin, isAdmin } from '../../../middleware/authMiddleware';

// Kullanıcı bilgilerini getir
export const GET = requireAuth(async (req: Request, currentUser: any, context: { params: { id: string } }) => {
    try {
        const { id } = await Promise.resolve(context.params);
        await connectDB();

        // Admin tüm kullanıcıları görebilir, normal kullanıcı sadece kendini
        if (currentUser.role !== 'admin' && currentUser._id.toString() !== id) {
            return NextResponse.json(
                { message: 'Bu kullanıcının bilgilerini görüntüleme yetkiniz yok' },
                { status: 403 }
            );
        }

        const user = await User.findById(id).select('-password');

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
                role: user.role,
                avatar: user.avatar,
                createdAt: user.createdAt
            }
        });
    } catch (error: any) {
        return NextResponse.json(
            { message: 'Kullanıcı bilgileri alınırken hata oluştu', error: error.message },
            { status: 500 }
        );
    }
});

// Kullanıcı bilgilerini güncelle
export const PATCH = requireAuth(async (req: Request, currentUser: any, context: { params: { id: string } }) => {
    try {
        const { id } = await Promise.resolve(context.params);
        await connectDB();

        // Admin tüm kullanıcıları güncelleyebilir, normal kullanıcı sadece kendini
        if (currentUser.role !== 'admin' && currentUser._id.toString() !== id) {
            return NextResponse.json(
                { message: 'Bu kullanıcının bilgilerini güncelleme yetkiniz yok' },
                { status: 403 }
            );
        }

        const { name, email, role } = await req.json();
        const updateData: any = {};

        if (name) updateData.name = name;
        if (email) {
            // Email formatını kontrol et
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return NextResponse.json(
                    { message: 'Geçersiz email formatı' },
                    { status: 400 }
                );
            }

            // Email benzersiz mi kontrol et
            const existingUser = await User.findOne({ email, _id: { $ne: id } });
            if (existingUser) {
                return NextResponse.json(
                    { message: 'Bu email adresi başka bir kullanıcı tarafından kullanılıyor' },
                    { status: 400 }
                );
            }
            updateData.email = email;
        }

        // Sadece admin rol değiştirebilir
        if (role && currentUser.role === 'admin') {
            updateData.role = role;
        }

        const user = await User.findByIdAndUpdate(
            id,
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
                role: user.role,
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
});

// Kullanıcıyı sil (Sadece admin)
export const DELETE = requireAdmin(async (req: Request, context: { params: { id: string } }) => {
    try {
        const { id } = await Promise.resolve(context.params);
        await connectDB();

        const user = await User.findByIdAndDelete(id);

        if (!user) {
            return NextResponse.json(
                { message: 'Kullanıcı bulunamadı' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Kullanıcı başarıyla silindi'
        });
    } catch (error: any) {
        return NextResponse.json(
            { message: 'Kullanıcı silinirken hata oluştu', error: error.message },
            { status: 500 }
        );
    }
}); 