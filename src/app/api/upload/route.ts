import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs/promises';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    // Retrieve the uploaded file from the FormData
    const file = formData.get('file') as File;
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Generate a unique file name using UUID
    const filename = `${uuidv4()}-${file.name}`;
    const uploadDir = path.join(process.cwd(), 'public/uploads');
    const filePath = path.join(uploadDir, filename);

    // Ensure the directory exists
    await fs.mkdir(uploadDir, { recursive: true });

    // Convert the file blob to a Buffer and save it
    const arrayBuffer = await file.arrayBuffer();
    await fs.writeFile(filePath, Buffer.from(arrayBuffer));

    // Construct the file URL
    const fileUrl = `/uploads/${filename}`;

    // Respond with the file URL
    return NextResponse.json({ fileUrl }, { status: 201 });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: 'File upload failed' }, { status: 500 });
  }
}
