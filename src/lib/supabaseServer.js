import 'server-only';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

let _serviceSupabaseInstance = null;

/**
 * Server-only Supabase client initialized with the privileged service role key.
 * Strictly forbidden from being bundled or imported into client components.
 */
export const getServiceSupabase = () => {
  if (_serviceSupabaseInstance) return _serviceSupabaseInstance;

  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not defined in environment variables.');
  }

  _serviceSupabaseInstance = createClient(supabaseUrl || '', serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  return _serviceSupabaseInstance;
};

export default getServiceSupabase;
