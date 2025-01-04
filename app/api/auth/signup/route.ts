import { NextResponse } from 'next/server';
import User from '@/models/User';
import connectDB from '@/lib/db';

export async function POST(req: Request) {
  try {
    await connectDB();

    const { name, email, password } = await req.json();

    // Tüm alanların dolu olduğunu kontrol et
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: 'Lütfen tüm alanları doldurun' },
        { status: 400 }
      );
    }

    // Email formatını kontrol et
    const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: 'Geçerli bir email adresi girin' },
        { status: 400 }
      );
    }

    // Şifre uzunluğunu kontrol et
    if (password.length < 6) {
      return NextResponse.json(
        { message: 'Şifre en az 6 karakter olmalıdır' },
        { status: 400 }
      );
    }

    // Email'in kullanımda olup olmadığını kontrol et
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: 'Bu email adresi zaten kullanımda' },
        { status: 400 }
      );
    }

    // Yeni kullanıcı oluştur
    const user = await User.create({
      name,
      email,
      password,
    });

    return NextResponse.json(
      { 
        message: 'Hesap başarıyla oluşturuldu',
        user: {
          id: user._id,
          name: user.name,
          email: user.email
        }
      },
      { status: 201 }
    );

  } catch (error: any) {
    return NextResponse.json(
      { message: 'Sunucu hatası', error: error.message },
      { status: 500 }
    );
  }
} 