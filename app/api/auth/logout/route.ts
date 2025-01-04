import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
    try {
        const cookieStore = await cookies();
        cookieStore.delete('token');

        return NextResponse.json({
            success: true,
            message: 'Başarıyla çıkış yapıldı'
        });
    } catch (error: any) {
        return NextResponse.json(
            { message: 'Çıkış yapılırken hata oluştu', error: error.message },
            { status: 500 }
        );
    }
} 