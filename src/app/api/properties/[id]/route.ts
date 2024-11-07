import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/authMiddleware';
import { v4 as uuidv4 } from 'uuid';
import { promises as fs } from 'fs';
import path from 'path';

const uploadDir = path.join(process.cwd(), 'public', 'uploads');
fs.mkdir(uploadDir, { recursive: true });

// PUT method for updating property details, including images
export async function PUT(req: NextRequest) {
  const id = req.nextUrl.pathname.split('/').pop();
  if (!id) return NextResponse.json({ message: 'Property ID is required' }, { status: 400 });

  try {
    const user = await getUserFromRequest(req);
    const formData = await req.formData();
    const name = formData.get('name')?.toString();
    const description = formData.get('description')?.toString();
    const location = formData.get('location')?.toString();
    const pricePerNight = parseFloat(formData.get('pricePerNight')?.toString() || '0');
    const amenities = formData.getAll('amenities').map((item) => item.toString());

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

    const property = await prisma.property.findUnique({ where: { id } });
    if (!property) return NextResponse.json({ message: 'Property not found' }, { status: 404 });

    // Authorization check for admins and property owners
    if (!user.isAdmin && property.ownerId !== user.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    const updatedProperty = await prisma.property.update({
      where: { id },
      data: {
        name,
        description,
        location,
        pricePerNight,
        amenities,
        imageUrls: imageUrls.length > 0 ? imageUrls : property.imageUrls,
      },
    });

    return NextResponse.json(updatedProperty, { status: 200 });
  } catch (error) {
    console.error('Error updating property:', error);
    return NextResponse.json(
      { message: 'Failed to update property', error: (error as Error).message },
      { status: 500 }
    );
  }
}


// DELETE method for deleting properties with admin and owner authorization
export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.pathname.split('/').pop();
  if (!id) return NextResponse.json({ message: 'Property ID is required' }, { status: 400 });

  try {
    const user = await getUserFromRequest(req);
    const property = await prisma.property.findUnique({ where: { id } });
    if (!property) return NextResponse.json({ message: 'Property not found' }, { status: 404 });

    // Allow only admins or property owners to delete
    if (!user.isAdmin && property.ownerId !== user.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    await prisma.property.delete({ where: { id } });
    return NextResponse.json({ message: 'Property deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting property:', error);
    return NextResponse.json(
      { message: 'Failed to delete property', error: (error as Error).message },
      { status: 500 }
    );
  }
}


// GET method to fetch individual property details
export async function GET(req: NextRequest) {
  const id = req.nextUrl.pathname.split('/').pop();
  if (!id) {
    return NextResponse.json({ message: 'Property ID is required' }, { status: 400 });
  }

  try {
    const property = await prisma.property.findUnique({ where: { id } });
    if (!property) {
      return NextResponse.json({ message: 'Property not found' }, { status: 404 });
    }

    return NextResponse.json(property, { status: 200 });
  } catch (error) {
    console.error('Error fetching property:', error);
    return NextResponse.json(
      { message: 'Failed to fetch property', error: (error as Error).message },
      { status: 500 }
    );
  }
}
