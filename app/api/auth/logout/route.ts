import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const response = NextResponse.json(
      { message: 'Başarıyla çıkış yapıldı' },
      { status: 200 }
    );

    // Token'ı temizle
    response.cookies.delete('token');

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { message: 'Çıkış yapılırken hata oluştu', error: error.message },
      { status: 500 }
    );
  }
} 