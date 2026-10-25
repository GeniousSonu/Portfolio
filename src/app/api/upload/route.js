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
    // 1. Strict Admin Authentication Check
    const authHeader = request.headers.get('authorization') || '';
    const adminKeyHeader = request.headers.get('x-admin-key') || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : adminKeyHeader;

    const expectedKey = process.env.ADMIN_API_KEY || process.env.STUDIO_ADMIN_PASSWORD;
    if (!expectedKey || token !== expectedKey) {
      return NextResponse.json(
        { error: 'Unauthorized: Admin authorization required for uploads.' },
        { status: 401 }
      );
    }

    // 2. Strict Origin Verification
    const origin = request.headers.get('origin');
    if (origin) {
      const parsedOrigin = new URL(origin);
      const host = parsedOrigin.hostname.toLowerCase();
      const isAllowedHost =
        host === 'genioussonu.me' ||
        host === 'www.genioussonu.me' ||
        host === 'localhost' ||
        host === '127.0.0.1';

      if (!isAllowedHost) {
        return NextResponse.json({ error: 'Forbidden origin' }, { status: 403 });
      }
    }

    const body = await request.json().catch(() => ({}));
    const { file, folder = 'portfolio/uploads' } = body;

    if (!file || typeof file !== 'string') {
      return NextResponse.json(
        { error: 'Missing required file data in request body' },
        { status: 400 }
      );
    }

    // Enforce data URL or strict format check
    if (!file.startsWith('data:image/') && !file.startsWith('https://')) {
      return NextResponse.json(
        { error: 'Invalid file format. Only image data URIs or HTTPS image URLs are supported.' },
        { status: 400 }
      );
    }

    // Server-controlled random ID to prevent overwrite of existing assets
    const safePublicId = `upload_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    const result = await uploadImage(file, {
      folder: folder.startsWith('portfolio') ? folder : 'portfolio/uploads',
      publicId: safePublicId,
      tags: ['portfolio-admin-upload'],
      overwrite: false,
      invalidate: false,
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
    console.error('[API /api/upload] Error uploading to Cloudinary:', error?.message);
    return NextResponse.json(
      { error: 'Upload failed. Please check server logs.' },
      { status: 500 }
    );
  }
}
