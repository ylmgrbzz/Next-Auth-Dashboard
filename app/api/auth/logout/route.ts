import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
    try {
        const response = NextResponse.json(
            { message: 'Başarıyla çıkış yapıldı' },
            { status: 200 }
        );

        // Token'ı temizle
        response.cookies.delete('token');

        console.log('Token başarıyla temizlendi');

        return response;
    } catch (error: any) {
        console.error('Çıkış hatası:', error);
        return NextResponse.json(
            { message: 'Çıkış yapılırken hata oluştu', error: error.message },
            { status: 500 }
        );
    }
} 