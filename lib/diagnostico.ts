/* Regras de negócio do Diagnóstico de Precificação (VHS).
   Mesmos números e mesmos textos da versão WordPress. */

export type Formato = 'individual' | 'dupla' | 'grupo';
export type Frequencia = '1x' | '2x';
export type Experiencia = '<1' | '1-3' | '3-5' | '+5';

export interface Respostas {
  nome: string;
  email: string;
  wpp: string;
  sal: number;
  horas: number;
  exp: Experiencia;
  vhs: number;
  fmt: Formato;
  frq: Frequencia;
  men: number;
  alu: number;
}

/* Benchmarks de mercado (por aluno/mês)
   Individual  : R$100/aula → 1x = R$400 | 2x = R$800
   Dupla       : R$85/pessoa → 1x = R$340 | 2x = R$680
   Trio/Turma  : R$70/pessoa → 1x = R$280 | 2x = R$560 */
export const BENCH: Record<Formato, Record<Frequencia, { min: number; max: number }>> = {
  individual: { '1x': { min: 340, max: 460 }, '2x': { min: 680, max: 920 } },
  dupla: { '1x': { min: 289, max: 391 }, '2x': { min: 578, max: 782 } },
  grupo: { '1x': { min: 238, max: 322 }, '2x': { min: 476, max: 644 } },
};

/** Referência individual de mercado (R$/hora). */
export const VHS_REF = 100;

export const brl = (v: number) => 'R$ ' + Math.round(v).toLocaleString('pt-BR');

/* ── Qualificação ICP ── */
export function calcICP(d: {
  score_alinhamento: number;
  num_alunos: number;
  salario_desejado: number;
  experiencia: string;
  vhs_atual: number;
}) {
  let pts = 0;

  // Dor ativa: quanto abaixo do mercado = urgência
  if (d.score_alinhamento < 60) pts += 30;
  else if (d.score_alinhamento < 80) pts += 20;
  else if (d.score_alinhamento <= 100) pts += 10;
  else pts += 4;

  // Volume de alunos = negócio real e ativo
  if (d.num_alunos >= 15) pts += 25;
  else if (d.num_alunos >= 8) pts += 18;
  else if (d.num_alunos >= 4) pts += 10;
  else pts += 3;

  // Ambição salarial = motivação para investir
  if (d.salario_desejado >= 10000) pts += 20;
  else if (d.salario_desejado >= 6000) pts += 15;
  else if (d.salario_desejado >= 3000) pts += 10;
  else pts += 4;

  // Experiência = maturidade profissional
  if (d.experiencia === '+5') pts += 15;
  else if (d.experiencia === '3-5') pts += 12;
  else if (d.experiencia === '1-3') pts += 8;
  else pts += 3;

  // VHS atual = profissional estabelecido
  if (d.vhs_atual >= 100) pts += 10;
  else if (d.vhs_atual >= 70) pts += 8;
  else if (d.vhs_atual >= 40) pts += 5;
  else pts += 2;

  pts = Math.min(pts, 100);
  const grade = pts >= 70 ? 'A' : pts >= 45 ? 'B' : 'C';
  return { grade, pts };
}

export interface Resultado {
  firstName: string;
  intro: string;
  score: number;
  vhsIdeal: number;
  bench: { min: number; max: number };
  gap: number;
  statusTxt: string;
  statusColor: string;
  badgeCls: 'ok' | 'warn' | 'bad';
  badgeTxt: string;
  dText: string;
  dTip: string;
  /** Linha gravada na tabela diagnostico_precificacao. */
  payload: Record<string, string | number>;
}

export function calcularResultado(D: Respostas): Resultado {
  const vhsIdeal = D.sal / (D.horas * 4);
  const b = BENCH[D.fmt][D.frq];
  const bm = (b.min + b.max) / 2;

  /* Score: mensalidade atual vs benchmark */
  const scoreRaw = (D.men / bm) * 100;
  const score = Math.min(Math.round(scoreRaw), 100);

  /* Receita */
  const recAtual = D.men * D.alu;
  const recPot = bm * D.alu;
  const gap = Math.max(0, recPot - recAtual);

  const firstName = D.nome.split(' ')[0];
  const fmtLabel =
    D.fmt === 'individual' ? 'individuais' : D.fmt === 'dupla' ? 'em dupla/trio' : 'em grupo';
  const vhsRefFmt = D.fmt === 'individual' ? 100 : D.fmt === 'dupla' ? 85 : 70; // R$/hora por pessoa
  const frqLabel = D.frq === '1x' ? '1× por semana' : '2× por semana';

  let statusTxt: string, statusColor: string, badgeCls: Resultado['badgeCls'], badgeTxt: string;
  let dText: string, dTip: string;

  if (scoreRaw < 60) {
    statusTxt = '⚠️ Muito Abaixo do Mercado'; statusColor = '#ef4444'; badgeCls = 'bad'; badgeTxt = '🔴 Atenção: precificação crítica';
    dText = `${firstName}, seu preço está significativamente abaixo do que o mercado pratica para aulas ${fmtLabel} com frequência de ${frqLabel}. Isso significa que você está trabalhando mais do que precisa para ganhar menos do que merece. Com ${D.alu} alunos ativos, você está potencialmente deixando ${brl(gap)} na mesa todo mês — dinheiro que poderia estar no seu bolso sem precisar de nenhum aluno a mais.`;
    dTip = `💡 Recomendação imediata: Para aulas ${fmtLabel}, o mercado pratica ${brl(vhsRefFmt)}/hora por aluno — o que equivale a ${brl(b.min)}–${brl(b.max)}/mês. Você está cobrando ${brl(D.men)}. Um reajuste gradual e bem comunicado é totalmente possível — e necessário para chegar nos 10K.`;
  } else if (scoreRaw < 80) {
    statusTxt = '📉 Levemente Abaixo'; statusColor = '#f97316'; badgeCls = 'warn'; badgeTxt = '🟡 Margem de melhora identificada';
    dText = `${firstName}, sua precificação está próxima do mercado, mas ainda há espaço para otimizar. Você está cobrando um pouco abaixo do que poderia — e com ${D.alu} alunos, um pequeno ajuste já representa ${brl(gap)} a mais por mês sem aumentar carga horária. A boa notícia: você está quase no ponto certo.`;
    dTip = `💡 Recomendação: O mercado pratica ${brl(vhsRefFmt)}/hora para o seu formato (${brl(b.min)}–${brl(b.max)}/mês). Seu atual ${brl(D.men)} está levemente abaixo. Um reajuste de 10 a 20% já colocaria você dentro do range ideal — e o momento de fazer isso é agora.`;
  } else if (scoreRaw <= 115) {
    statusTxt = '✅ Alinhado com o Mercado'; statusColor = '#10b981'; badgeCls = 'ok'; badgeTxt = '🟢 Precificação alinhada';
    dText = `${firstName}, parabéns! Sua precificação está alinhada com os benchmarks de mercado para aulas ${fmtLabel}. Isso mostra maturidade na sua gestão financeira. Agora, o próximo passo é pensar em estratégias para escalar — seja aumentando o volume de alunos, criando produtos de médio e alto ticket, ou construindo uma esteira de infoprodutos.`;
    dTip = `💡 Próximo nível: Com a precificação alinhada, o crescimento para os 10K passa por escalar. Um diagnóstico estratégico pode te mostrar o melhor caminho para o seu perfil — com ou sem aumentar o número de horas trabalhadas.`;
  } else {
    statusTxt = '🏆 Acima do Mercado'; statusColor = '#d2bc8f'; badgeCls = 'ok'; badgeTxt = '⭐ Posicionamento premium';
    dText = `${firstName}, você cobra acima do benchmark de mercado — o que indica um excelente posicionamento de valor. Seus alunos reconhecem e pagam pelo diferencial que você entrega. Isso é resultado de autoridade construída. O desafio agora é manter a consistência e escalar com uma esteira de produtos.`;
    dTip = `💡 Próximo nível: Quem cobra acima do mercado precisa de uma esteira de produtos sólida para sustentar o posicionamento e crescer de forma previsível. Mentorias em grupo, cursos e produtos de alto ticket são seus próximos passos naturais.`;
  }

  const icp = calcICP({
    score_alinhamento: score,
    num_alunos: D.alu,
    salario_desejado: D.sal,
    experiencia: D.exp,
    vhs_atual: D.vhs,
  });

  return {
    firstName,
    intro: `Diagnóstico para aulas ${fmtLabel} com frequência de ${frqLabel}.`,
    score,
    vhsIdeal: Math.round(vhsIdeal),
    bench: b,
    gap,
    statusTxt,
    statusColor,
    badgeCls,
    badgeTxt,
    dText,
    dTip,
    payload: {
      nome: D.nome, email: D.email, whatsapp: D.wpp,
      salario_desejado: D.sal, horas_semana: D.horas, experiencia: D.exp,
      vhs_atual: D.vhs, formato_aula: D.fmt, frequencia: D.frq,
      valor_mensal_cobrado: D.men, num_alunos: D.alu,
      vhs_ideal: Math.round(vhsIdeal),
      benchmark_min: b.min, benchmark_max: b.max,
      score_alinhamento: score,
      status_precificacao: statusTxt.replace(/[^\w\sÀ-úÃãÕõÂâÊêÎîÔôÛû]/g, '').trim(),
      receita_potencial_mes: Math.round(recPot),
      qualificacao_icp: icp.grade,
      qualificacao_pts: icp.pts,
      campanha: 'VHS Diagnóstico',
    },
  };
}
