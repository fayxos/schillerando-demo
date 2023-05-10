import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jwfyrkfpqfkzovzdpkqt.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp3Znlya2ZwcWZrem92emRwa3F0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzkyNDg4MjcsImV4cCI6MTk5NDgyNDgyN30.ECsAuWRN08LWBqJZqa4v3Qmnx03N8wkGrTRgVMotCS8';
export const supabase = createClient(supabaseUrl, supabaseKey);

supabase.auth.onAuthStateChange((event, session) => {
  const domain = window.location.hostname
  if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
    const expires = new Date(0).toUTCString()
    document.cookie = `supabase-access-token=; Domain=${domain}; path=/; expires=${expires}; SameSite=Lax; secure`
    document.cookie = `supabase-refresh-token=; Domain=${domain}; path=/; expires=${expires}; SameSite=Lax; secure`
  } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
    const maxAge = 100 * 365 * 24 * 60 * 60
    document.cookie = `supabase-access-token=${session.access_token}; Domain=${domain}; path=/; max-age=${maxAge}; SameSite=Lax; secure`
    document.cookie = `supabase-refresh-token=${session.refresh_token}; Domain=${domain}; path=/; max-age=${maxAge}; SameSite=Lax; secure`
  }
})