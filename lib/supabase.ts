import { createClient } from '@supabase/supabase-js';

// URL e chave "anon" são públicas por natureza (já iam no HTML do WordPress).
// Para trocar de projeto, defina NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY.
export const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://bhcivgnmzkavokskqhne.supabase.co';

export const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJoY2l2Z25temthdm9rc2txaG5lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc1NTY4MTIsImV4cCI6MjA5MzEzMjgxMn0.WkZSxy8WRHzmUxasHMigxhOHWHbCwgcL_ZJkfvUuijs';

/** Cliente para uso no navegador (quiz). */
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
