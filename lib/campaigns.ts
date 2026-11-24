/* ══════════════════════════════════════════
   CAMPANHAS CONFIG
   Para adicionar nova campanha: inclua um
   objeto no array CAMPAIGNS. Nada mais precisa mudar.
══════════════════════════════════════════ */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Row = Record<string, any>;

export interface Column {
  key: string;
  label: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fmt?: (v: any) => string;
  scoreBar?: boolean;
  icp?: boolean;
}

export interface Kpi {
  label: string;
  value: string | number;
  sub?: string;
  color: 'c-green' | 'c-red' | 'c-orange' | 'c-blue' | 'c-gold';
  icon?: string;
}

export interface Campaign {
  id: string;
  name: string;
  icon: string;
  color: string;
  /** Tabela no Supabase. */
  table: string;
  columns: Column[];
  detail: Column[];
  kpis(rows: Row[]): Kpi[];
}

export const CAMPAIGNS: Campaign[] = [
  {
    id: 'vhs',
    name: 'VHS Diagnóstico',
    icon: '📊',
    color: '#10b981',
    table: 'diagnostico_precificacao',

    columns: [
      { key: 'nome', label: 'Nome' },
      { key: 'whatsapp', label: 'WhatsApp' },
      { key: 'vhs_atual', label: 'VHS/hora', fmt: (v) => (v ? `R$ ${v}` : '—') },
      { key: 'score_alinhamento', label: 'Score', scoreBar: true },
      { key: 'qualificacao_icp', label: 'ICP', icp: true },
      { key: 'num_alunos', label: 'Alunos' },
      { key: 'receita_potencial_mes', label: 'Potencial/mês', fmt: (v) => (v ? `R$ ${Math.round(v).toLocaleString('pt-BR')}` : '—') },
      { key: 'created_at', label: 'Data', fmt: (v) => (v ? new Date(v).toLocaleDateString('pt-BR') : '—') },
    ],

    detail: [
      { key: 'email', label: 'E-mail' },
      { key: 'formato_aula', label: 'Formato' },
      { key: 'frequencia', label: 'Frequência' },
      { key: 'valor_mensal_cobrado', label: 'Mensalidade atual', fmt: (v) => (v ? `R$ ${v}` : '—') },
      { key: 'vhs_ideal', label: 'VHS Ideal', fmt: (v) => (v ? `R$ ${v}` : '—') },
      { key: 'salario_desejado', label: 'Salário desejado', fmt: (v) => (v ? `R$ ${Number(v).toLocaleString('pt-BR')}` : '—') },
      { key: 'horas_semana', label: 'Horas/semana', fmt: (v) => (v ? `${v}h` : '—') },
      { key: 'experiencia', label: 'Experiência' },
      { key: 'qualificacao_pts', label: 'Pontuação ICP', fmt: (v) => (v != null ? `${v} pts` : '—') },
      { key: 'status_precificacao', label: 'Status' },
    ],

    kpis(rows) {
      const total = rows.length;
      const hot = rows.filter((r) => r.qualificacao_icp === 'A').length;
      const avgScore = total ? Math.round(rows.reduce((s, r) => s + (r.score_alinhamento || 0), 0) / total) : 0;
      const potTotal = rows.reduce((s, r) => s + (r.receita_potencial_mes || 0), 0);
      const hotPct = total ? Math.round((hot / total) * 100) : 0;
      return [
        { label: 'Total de Leads', value: total, sub: 'captados', color: 'c-green', icon: '👥' },
        { label: 'Leads Quentes (A)', value: hot, sub: `${hotPct}% do total`, color: 'c-red', icon: '🔥' },
        { label: 'Score Médio', value: avgScore, sub: 'alinhamento de preço', color: 'c-orange', icon: '📊' },
        { label: 'Potencial Mensal Total', value: `R$ ${Math.round(potTotal).toLocaleString('pt-BR')}`, sub: 'oportunidade identificada', color: 'c-gold', icon: '💰' },
      ];
    },
  },

  /* ADICIONE NOVAS CAMPANHAS AQUI ↓
  {
    id: 'campanha2', name: 'Lead Magnet IG', icon: '📱', color: '#a855f7',
    table: 'nome_da_tabela_supabase',
    columns: [...], detail: [...], kpis(rows){ return [...]; }
  },
  */
];
