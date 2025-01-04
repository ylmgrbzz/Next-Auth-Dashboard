import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import User from '@/models/User';
import connectDB from '@/lib/db';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(req: Request) {
  try {
    await connectDB();

    const { email, password } = await req.json();

    // Email ve şifre kontrolü
    if (!email || !password) {
      return NextResponse.json(
        { message: 'Lütfen tüm alanları doldurun' },
        { status: 400 }
      );
    }

    // Kullanıcıyı bul
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return NextResponse.json(
        { message: 'Geçersiz email veya şifre' },
        { status: 401 }
      );
    }

    // Şifre kontrolü
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return NextResponse.json(
        { message: 'Geçersiz email veya şifre' },
        { status: 401 }
      );
    }

    // JWT token oluştur
    const token = jwt.sign({ id: user._id }, JWT_SECRET, {
      expiresIn: '30d',
    });

    // Response
    const response = NextResponse.json(
      { 
        message: 'Giriş başarılı',
        user: {
          id: user._id,
          name: user.name,
          email: user.email
        }
      },
      { status: 200 }
    );

    // Token'ı cookie olarak kaydet
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 gün
    });

    return response;

  } catch (error: any) {
    return NextResponse.json(
      { message: 'Sunucu hatası', error: error.message },
      { status: 500 }
    );
  }
} 