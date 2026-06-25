import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

// POST /api/upload — Handle file uploads (images + audio)
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    const imageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
    const audioTypes = ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp4', 'audio/x-m4a', 'audio/flac', 'audio/aac'];

    const isImage = imageTypes.includes(file.type);
    const isAudio = audioTypes.includes(file.type);

    if (!isImage && !isAudio) {
      return NextResponse.json(
        { error: 'Invalid file type. Allowed: images (jpg, png, gif, webp) and audio (mp3, wav, ogg, m4a, flac)' },
        { status: 400 }
      );
    }

    // Validate file size
    const maxImageSize = 10 * 1024 * 1024; // 10MB
    const maxAudioSize = 50 * 1024 * 1024; // 50MB

    if (isImage && file.size > maxImageSize) {
      return NextResponse.json({ error: 'Image too large (max 10MB)' }, { status: 400 });
    }

    if (isAudio && file.size > maxAudioSize) {
      return NextResponse.json({ error: 'Audio file too large (max 50MB)' }, { status: 400 });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    const ext = file.name.split('.').pop() || (isImage ? 'jpg' : 'mp3');
    const filename = `${timestamp}-${randomSuffix}.${ext}`;

    // Ensure uploads directory exists
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadsDir, { recursive: true });

    // Write file
    const filePath = path.join(uploadsDir, filename);
    const bytes = await file.arrayBuffer();
    await writeFile(filePath, Buffer.from(bytes));

    const url = `/uploads/${filename}`;

    return NextResponse.json({
      url,
      filename,
      size: file.size,
      type: isImage ? 'image' : 'audio',
    });
  } catch (error) {
    console.error('[UPLOAD_POST]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
