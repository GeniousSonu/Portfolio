import { NextResponse } from 'next/server';
import { uploadImage } from '@/lib/cloudinary';

export const runtime = 'nodejs';

/**
 * Direct Secure Media Upload Route Handler
 * Endpoint: POST /api/upload
 * Accepts JSON payload: { file: string (base64 data URI or remote URL), folder: string, tags: string[] }
 */
export async function POST(request) {
  try {
    const origin = request.headers.get('origin');
    const isAllowedOrigin =
      !origin ||
      origin.includes('localhost') ||
      origin.includes('127.0.0.1') ||
      origin.includes('genioussonu.me');

    if (!isAllowedOrigin) {
      return NextResponse.json({ error: 'Forbidden origin' }, { status: 403 });
    }

    const body = await request.json();
    const { file, folder = 'portfolio/uploads', publicId, tags = ['portfolio-upload'] } = body;

    if (!file) {
      return NextResponse.json(
        { error: 'Missing required file data in request body' },
        { status: 400 }
      );
    }

    const result = await uploadImage(file, {
      folder,
      publicId,
      tags,
    });

    return NextResponse.json({
      success: true,
      url: result.url,
      publicId: result.publicId,
      width: result.width,
      height: result.height,
      format: result.format,
    });
  } catch (error) {
    console.error('[API /api/upload] Error uploading to Cloudinary:', error);
    return NextResponse.json(
      { error: 'Upload failed', message: error.message },
      { status: 500 }
    );
  }
}
