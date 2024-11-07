import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(req: Request) {
  const { name, email, password, isAdmin } = await req.json();

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      return NextResponse.json({ message: 'User already exists' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        isAdmin: Boolean(isAdmin), // Make sure to control access to this field
      },
    });

    const token = jwt.sign({ id: user.id, isAdmin: user.isAdmin }, JWT_SECRET, { expiresIn: '1h' });

    return NextResponse.json({ token, user: { id: user.id, name: user.name, email: user.email, isAdmin: user.isAdmin } }, { status: 201 });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ message: 'Registration failed' }, { status: 500 });
  }
}
