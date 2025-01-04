import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { connectDB } from '../../../lib/db';
import User from '../../../models/User';

export async function GET() {
    try {
        const token = cookies().get('token')?.value;

        if (!token) {
            return NextResponse.json(
                { message: 'Yetkilendirme hatası' },
                { status: 401 }
            );
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };
        await connectDB();

        const user = await User.findById(decoded.id).select('-password');

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
                createdAt: user.createdAt
            }
        });
    } catch (error: any) {
        return NextResponse.json(
            { message: 'Sunucu hatası', error: error.message },
            { status: 500 }
        );
    }
} 