import { NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabaseServer';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabase = getServiceSupabase();

    // 1. Attempt hardened SECURITY DEFINER counting function
    const { data, error } = await supabase.rpc('get_total_visitors');

    if (!error && typeof data === 'number') {
      return NextResponse.json(
        { totalVisitors: data, ok: true },
        {
          headers: {
            'Cache-Control': 'public, s-maxage=15, stale-while-revalidate=30',
          },
        }
      );
    }

    // 2. Fallback: Direct exact count query if RPC is not yet created
    const { count, error: fallbackError } = await supabase
      .from('site_visit_log')
      .select('visitor_id', { count: 'exact', head: true });

    if (!fallbackError && typeof count === 'number') {
      return NextResponse.json(
        { totalVisitors: count, ok: true },
        {
          headers: {
            'Cache-Control': 'public, s-maxage=15, stale-while-revalidate=30',
          },
        }
      );
    }

    console.warn('[SiteStats] Could not retrieve distinct visitors:', error?.message || fallbackError?.message);
    return NextResponse.json(
      { totalVisitors: 0, ok: false },
      { headers: { 'Cache-Control': 'no-store' } }
    );
  } catch (err) {
    console.warn('[SiteStats] Graceful fallback on exception:', err.message);
    return NextResponse.json(
      { totalVisitors: 0, ok: false },
      { headers: { 'Cache-Control': 'no-store' } }
    );
  }
}
