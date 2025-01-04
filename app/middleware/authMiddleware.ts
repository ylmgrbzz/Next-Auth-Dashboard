import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { connectDB } from "../lib/db";
import User from "../models/User";

export async function isAuthenticated() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return null;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: string;
    };
    await connectDB();

    const user = await User.findById(decoded.id).select("-password");
    return user;
  } catch (error) {
    return null;
  }
}

export async function isAdmin() {
  const user = await isAuthenticated();
  return user?.role === "admin";
}

export function requireAuth(handler: Function) {
  return async (req: Request, ...args: any[]) => {
    const user = await isAuthenticated();

    if (!user) {
      return NextResponse.json(
        { message: "Yetkilendirme hatası" },
        { status: 401 }
      );
    }

    return handler(req, user, ...args);
  };
}

export function requireAdmin(handler: Function) {
  return async (req: Request, ...args: any[]) => {
    const user = await isAuthenticated();

    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { message: "Bu işlem için admin yetkisi gerekiyor" },
        { status: 403 }
      );
    }

    return handler(req, user, ...args);
  };
}
