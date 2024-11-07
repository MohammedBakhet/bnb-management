import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { v4 as uuidv4 } from 'uuid';
import { promises as fs } from 'fs';
import path from 'path';

const uploadDir = path.join(process.cwd(), 'public', 'uploads');
fs.mkdir(uploadDir, { recursive: true });

export async function GET() {
  try {
    const properties = await prisma.property.findMany();
    return NextResponse.json(properties);
  } catch (error) {
    console.error('Error fetching properties:', error);
    return NextResponse.json({ message: 'Failed to fetch properties', error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const name = formData.get('name')?.toString();
    const description = formData.get('description')?.toString();
    const location = formData.get('location')?.toString();
    const pricePerNight = parseFloat(formData.get('pricePerNight')?.toString() || '0');
    const ownerId = formData.get('ownerId')?.toString();
    const amenities = formData.getAll('amenities').map((item) => item.toString());

    if (!name || !description || !location || !pricePerNight || !ownerId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const images = formData.getAll('images') as File[];
    const imageUrls: string[] = [];

    for (const image of images) {
      const fileExtension = path.extname(image.name);
      const fileName = `${uuidv4()}${fileExtension}`;
      const filePath = path.join(uploadDir, fileName);

      const buffer = await image.arrayBuffer();
      await fs.writeFile(filePath, Buffer.from(buffer));
      imageUrls.push(`/uploads/${fileName}`);
    }

    const newProperty = await prisma.property.create({
      data: {
        name,
        description,
        location,
        pricePerNight,
        ownerId,
        imageUrls,
        amenities,
      },
    });

    return NextResponse.json(newProperty, { status: 201 });
  } catch (error) {
    console.error('Error creating property:', error);
    return NextResponse.json({ error: 'Failed to create property', details: (error as Error).message }, { status: 500 });
  }
}
