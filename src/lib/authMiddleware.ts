import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import { prisma } from './prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function getUserFromRequest(req: NextRequest) {
  const token = req.headers.get('Authorization')?.split(' ')[1];

  if (!token) {
    throw new Error('No token provided');
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; isAdmin: boolean }; // Include isAdmin
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });

    if (!user) {
      throw new Error('Invalid token');
    }

    // Attach isAdmin to the user object from the token
    return { ...user, isAdmin: decoded.isAdmin };
  } catch (error) {
    throw new Error('Invalid token');
  }
}
