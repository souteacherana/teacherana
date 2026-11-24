import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { isAdmin } from '@/lib/admin-auth';
import { CAMPAIGNS } from '@/lib/campaigns';
import { SUPABASE_ANON_KEY, SUPABASE_URL } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

/** GET /api/admin/leads?campaign=vhs → linhas da tabela da campanha (só logado). */
export async function GET(req: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
  }

  const id = new URL(req.url).searchParams.get('campaign');
  const campaign = CAMPAIGNS.find((c) => c.id === id);
  if (!campaign) {
    return NextResponse.json({ error: 'Campanha desconhecida.' }, { status: 400 });
  }

  // Com SUPABASE_SERVICE_ROLE_KEY definida, a leitura passa a depender só do servidor
  // e a policy de SELECT para "anon" pode ser removida no Supabase.
  const sb = createClient(
    SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? SUPABASE_ANON_KEY,
    { auth: { persistSession: false } },
  );

  // O Supabase devolve no máximo 1000 linhas por consulta, então buscamos em páginas.
  const PAGE = 1000;
  const rows: Record<string, unknown>[] = [];
  for (let from = 0; ; from += PAGE) {
    const { data, error } = await sb
      .from(campaign.table)
      .select('*')
      .order('created_at', { ascending: false })
      .range(from, from + PAGE - 1);
    if (error) return NextResponse.json({ error: error.message }, { status: 502 });
    rows.push(...(data ?? []));
    if (!data || data.length < PAGE) break;
  }

  return NextResponse.json({ rows });
}
