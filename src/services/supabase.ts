// Supabase Client Abstraction for PDF Studio
// Connects to real Supabase project if VITE_SUPABASE_URL is provided,
// or falls back to local user-partitioned IndexedDB/localStorage storage.

export const isSupabaseConfigured = (): boolean => {
  return !!(
    import.meta.env.VITE_SUPABASE_URL &&
    import.meta.env.VITE_SUPABASE_ANON_KEY &&
    !import.meta.env.VITE_SUPABASE_URL.includes('your-project')
  );
};

export const getSupabaseConfig = () => {
  return {
    url: import.meta.env.VITE_SUPABASE_URL || '',
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
    configured: isSupabaseConfigured(),
  };
};
