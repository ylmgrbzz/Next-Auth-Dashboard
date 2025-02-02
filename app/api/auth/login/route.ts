import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import User from '../../../models/User';
import { connectDB } from '../../../lib/db';

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRE = process.env.JWT_EXPIRE || '30d';

export async function POST(req: Request) {
  try {
    await connectDB();
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Lütfen tüm alanları doldurun' },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return NextResponse.json(
        { message: 'Geçersiz email veya şifre' },
        { status: 401 }
      );
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return NextResponse.json(
        { message: 'Geçersiz email veya şifre' },
        { status: 401 }
      );
    }

    const token = jwt.sign(
      { id: user._id.toString() },
      JWT_SECRET as string,
      { expiresIn: JWT_EXPIRE }
    );

    const response = NextResponse.json(
      {
        success: true,
        message: 'Giriş başarılı',
        user: {
          id: user._id,
          name: user.name,
          email: user.email
        },
        token
      },
      { status: 200 }
    );

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 gün
    });

    return response;

  } catch (error: any) {
    console.error('Login hatası:', error);
    return NextResponse.json(
      { message: 'Sunucu hatası', error: error.message },
      { status: 500 }
    );
  }
} 