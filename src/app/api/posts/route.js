import { NextResponse } from 'next/server';
import { client } from '@/sanity/client';
import { POSTS_QUERY } from '@/sanity/queries';

export const revalidate = 30; // ISR cache revalidation every 30 seconds

export async function GET() {
  try {
    const posts = await client.fetch(POSTS_QUERY);
    return NextResponse.json({
      success: true,
      posts: Array.isArray(posts) ? posts : [],
    });
  } catch (error) {
    console.error('[API /api/posts] Failed to fetch Sanity posts:', error?.message || error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch posts from Sanity',
        posts: [],
      },
      { status: 500 }
    );
  }
}
