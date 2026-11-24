'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { ChartConfiguration } from 'chart.js';
import ChartCanvas from '@/components/ChartCanvas';
import { supabase } from '@/lib/supabase';
import {
  VHS_REF,
  brl,
  calcularResultado,
  type Experiencia,
  type Formato,
  type Frequencia,
  type Resultado,
} from '@/lib/diagnostico';

const TABLE = 'diagnostico_precificacao';
const LEAD_KEY = 'vhs_lead_id';
const WHATSAPP_CTA =
  'https://api.whatsapp.com/send/?phone=556791286394&text=Ol%C3%A1%21+Fiz+o+diagn%C3%B3stico+de+precifica%C3%A7%C3%A3o+e+gostaria+de+agendar+meu+diagn%C3%B3stico+estrat%C3%A9gico+gratuito&type=phone_number&app_absent=0';

/* Telas: 0 boas-vindas · 1 dados · 2 metas · 3 precificação · 4 loading · 5 resultado */
const PROG = [0, 20, 45, 70, 90, 100];
const GAUGE_CIRC = 477.52;

const LOAD_STEPS = [
  'Calculando seu VHS ideal',
  'Comparando com benchmarks de mercado',
  'Calculando receita potencial',
  'Gerando diagnóstico personalizado',
];

const EXP_OPTS: { val: Experiencia; text: string; sub: string }[] = [
  { val: '<1', text: 'Menos de 1 ano', sub: 'Estou começando agora' },
  { val: '1-3', text: '1 a 3 anos', sub: 'Já tenho experiência inicial' },
  { val: '3-5', text: '3 a 5 anos', sub: 'Profissional consolidada' },
  { val: '+5', text: 'Mais de 5 anos', sub: 'Veterano no ensino' },
];

const FMT_OPTS: { val: Formato; icon: string; title: string; sub: string }[] = [
  { val: 'individual', icon: '👤', title: 'Individual', sub: '1 aluno' },
  { val: 'dupla', icon: '👥', title: 'Dupla/Trio', sub: '2 a 3 alunos' },
  { val: 'grupo', icon: '👨‍👩‍👧‍👦', title: 'Grupo', sub: '4 a 6 alunos' },
];

const FRQ_OPTS: { val: Frequencia; icon: string; title: string; sub: string }[] = [
  { val: '1x', icon: '📅', title: '1× por semana', sub: '~4 aulas/mês' },
  { val: '2x', icon: '📆', title: '2× por semana', sub: '~8 aulas/mês' },
];

function Dots({ step }: { step: number }) {
  return (
    <div className="dots">
      {[1, 2, 3, 4].map((n) => (
        <div key={n} className={`dot${n < step ? ' done' : n === step ? ' active' : ''}`} />
      ))}
    </div>
  );
}

const Check = () => (
  <div className="feat-icon">
    <svg viewBox="0 0 24 24">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  </div>
);

export default function Quiz() {
  const [screen, setScreen] = useState(0);

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [wpp, setWpp] = useState('');
  const [sal, setSal] = useState('');
  const [horas, setHoras] = useState(20);
  const [exp, setExp] = useState<Experiencia | ''>('');
  const [vhs, setVhs] = useState('');
  const [fmt, setFmt] = useState<Formato | ''>('');
  const [frq, setFrq] = useState<Frequencia | ''>('');
  const [men, setMen] = useState('');
  const [alu, setAlu] = useState('');

  const [err, setErr] = useState<1 | 2 | 3 | null>(null);
  const [loadStep, setLoadStep] = useState(0);
  const [res, setRes] = useState<Resultado | null>(null);
  const [gauge, setGauge] = useState(0);
  const leadId = useRef<string | number | null>(null);

  function go(n: number) {
    setScreen(n);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /* ── Validações ── */
  function v1() {
    if (!nome.trim() || !email.trim() || !wpp.trim()) return setErr(1);
    setErr(null);
    go(2);
  }
  function v2() {
    if (!sal || !exp) return setErr(2);
    setErr(null);
    go(3);
  }
  function v3() {
    if (!vhs || !fmt || !frq || !men) return setErr(3);
    setErr(null);
    setLoadStep(0);
    go(4);
  }

  /* ── Loading: avança os 4 passos e então mostra o resultado ── */
  useEffect(() => {
    if (screen !== 4) return;
    if (loadStep < LOAD_STEPS.length) {
      const t = setTimeout(() => setLoadStep((s) => s + 1), 680);
      return () => clearTimeout(t);
    }
    const t = setTimeout(finish, 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen, loadStep]);

  function finish() {
    if (!exp || !fmt || !frq) return;

    try {
      (window as any).fbq?.('track', 'Lead', {
        content_name: 'Diagnóstico de Precificação',
        content_category: 'Quiz',
      });
    } catch {}

    const r = calcularResultado({
      nome: nome.trim(),
      email: email.trim(),
      wpp: wpp.trim(),
      sal: parseFloat(sal),
      horas,
      exp,
      vhs: parseFloat(vhs),
      fmt,
      frq,
      men: parseFloat(men),
      alu: parseInt(alu) || 10,
    });
    setRes(r);
    setGauge(0);
    go(5);
    saveLead(r.payload);
  }

  /* ── Grava o lead no Supabase ── */
  async function saveLead(payload: Resultado['payload']) {
    try {
      const { data, error } = await supabase.from(TABLE).insert([payload]).select('id').single();
      if (error) console.warn('Supabase:', error.message);
      if (data?.id) {
        leadId.current = data.id;
        try {
          localStorage.setItem(LEAD_KEY, String(data.id));
        } catch {}
      }
    } catch (e) {
      console.warn('Supabase skip:', (e as Error).message);
    }
  }

  /* ── Marca contato quando o lead clica no CTA do WhatsApp ──
     Fire-and-forget: não bloqueia a abertura do link. */
  function markContactClicked() {
    try {
      let id: string | number | null = leadId.current;
      if (!id) {
        try {
          id = localStorage.getItem(LEAD_KEY);
        } catch {}
      }
      if (id) {
        supabase
          .from(TABLE)
          .update({ mensagem_enviada: new Date().toISOString() })
          .eq('id', id)
          .then(
            () => {},
            (e: unknown) => console.warn('mark contact:', e),
          );
      }
      const w = window as any;
      w.dataLayer = w.dataLayer || [];
      w.dataLayer.push({ event: 'cta_whatsapp_click', lead_id: id || null });
    } catch (e) {
      console.warn('markContactClicked:', e);
    }
  }

  /* ── Anima o medidor de score ── */
  useEffect(() => {
    if (screen !== 5 || !res) return;
    let c = 0;
    let iv: ReturnType<typeof setInterval>;
    const t = setTimeout(() => {
      iv = setInterval(() => {
        c = Math.min(c + 2, res.score);
        setGauge(c);
        if (c >= res.score) clearInterval(iv);
      }, 18);
    }, 300);
    return () => {
      clearTimeout(t);
      clearInterval(iv);
    };
  }, [screen, res]);

  /* ── Gráficos ── */
  const menNum = parseFloat(men) || 0;
  const vhsNum = parseFloat(vhs) || 0;

  const chart1 = useMemo<ChartConfiguration | null>(() => {
    if (!res) return null;
    const b = res.bench;
    return {
      type: 'bar',
      data: {
        labels: ['Seu Preço Atual', 'Mínimo Mercado', 'Médio Mercado', 'Máximo Mercado'],
        datasets: [
          {
            data: [menNum, b.min, Math.round((b.min + b.max) / 2), b.max],
            backgroundColor: ['rgba(16,185,129,.85)', 'rgba(255,255,255,.07)', 'rgba(255,255,255,.15)', 'rgba(255,255,255,.07)'],
            borderColor: ['#10b981', '#3a3a3a', '#5a5a5a', '#3a3a3a'],
            borderWidth: 2,
            borderRadius: 9,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (c) => ' R$ ' + Math.round(c.raw as number).toLocaleString('pt-BR') + '/mês',
            },
          },
        },
        scales: {
          x: { ticks: { color: '#777', font: { size: 12 } }, grid: { color: '#1c1c1c' } },
          y: {
            ticks: { color: '#777', callback: (v) => 'R$ ' + Number(v).toLocaleString('pt-BR') },
            grid: { color: '#1c1c1c' },
          },
        },
      },
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [res]);

  const chart2 = useMemo<ChartConfiguration | null>(() => {
    if (!res) return null;
    return {
      type: 'bar',
      data: {
        labels: ['Seu VHS Atual', 'VHS Ideal\n(salário alvo)', 'VHS Referência\nde Mercado'],
        datasets: [
          {
            data: [vhsNum, res.vhsIdeal, VHS_REF],
            backgroundColor: ['rgba(16,185,129,.85)', 'rgba(210,188,143,.75)', 'rgba(96,165,250,.65)'],
            borderColor: ['#10b981', '#d2bc8f', '#60a5fa'],
            borderWidth: 2,
            borderRadius: 9,
          },
        ],
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (c) => ' R$ ' + (c.raw as number).toLocaleString('pt-BR') + '/hora',
            },
          },
        },
        scales: {
          x: { ticks: { color: '#777', callback: (v) => 'R$ ' + v }, grid: { color: '#1c1c1c' } },
          y: { ticks: { color: '#ccc', font: { size: 13 } }, grid: { color: '#1c1c1c' } },
        },
      },
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [res]);

  const scr = (n: number, extra = '') =>
    `screen${extra ? ' ' + extra : ''}${screen === n ? ' active' : ''}`;
  const aluNum = parseInt(alu) || 10;

  return (
    <>
      <div className="prog-bar">
        <div className="prog-fill" style={{ width: PROG[screen] + '%' }} />
      </div>

      {/* ══ TELA 0 — WELCOME ══ */}
      <div id="s0" className={scr(0)}>
        <div className="badge">
          <div className="badge-dot" /> Gratuito · menos de 3 minutos
        </div>
        <h1 className="hero-title">
          Você está cobrando o<br />
          <em>valor certo</em> pelas suas aulas?
        </h1>
        <p className="hero-sub">
          Descubra em minutos se sua precificação está alinhada com o mercado — ou se você está
          deixando dinheiro na mesa todo mês.
        </p>
        <div className="feats">
          <div className="feat"><Check /><span>Compare seu VHS com o mercado de professores de inglês</span></div>
          <div className="feat"><Check /><span>Veja se o seu preço por aluno está correto para o seu formato</span></div>
          <div className="feat"><Check /><span>Descubra quanto você está potencialmente perdendo por mês</span></div>
          <div className="feat"><Check /><span>Receba diagnóstico personalizado com gráficos e recomendações</span></div>
        </div>
        <button className="btn-start" onClick={() => go(1)}>
          Iniciar Diagnóstico Gratuito
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </button>
        <p className="trust-note">
          🔒 Seus dados são confidenciais. Nunca serão compartilhados com terceiros.
        </p>
      </div>

      {/* ══ TELA 1 — SEUS DADOS ══ */}
      <div id="s1" className={scr(1, 'form-screen')}>
        <div className="fc">
          <Dots step={1} />
          <div className="f-icon">👋</div>
          <h2 className="f-title">Antes de começar, nos diga quem você é</h2>
          <p className="f-sub">
            Usamos seus dados para enviar o resultado do diagnóstico e para um possível contato da
            nossa equipe.
          </p>
          <div className="ig">
            <label htmlFor="i-nome">Nome completo *</label>
            <input type="text" id="i-nome" placeholder="Ex: Maria da Silva" autoComplete="name"
              value={nome} onChange={(e) => setNome(e.target.value)} />
          </div>
          <div className="row2">
            <div className="ig">
              <label htmlFor="i-email">E-mail *</label>
              <input type="email" id="i-email" placeholder="seu@email.com" autoComplete="email"
                value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="ig">
              <label htmlFor="i-wpp">WhatsApp *</label>
              <input type="tel" id="i-wpp" placeholder="(11) 99999-9999" autoComplete="tel"
                value={wpp} onChange={(e) => setWpp(e.target.value)} />
            </div>
          </div>
          {err === 1 && (
            <p className="err" style={{ display: 'block' }}>
              ⚠ Por favor, preencha nome, e-mail e WhatsApp para continuar.
            </p>
          )}
          <div className="fnav">
            <button className="btn-back" onClick={() => go(0)}>← Voltar</button>
            <button className="btn-next" onClick={v1}>Continuar →</button>
          </div>
        </div>
      </div>

      {/* ══ TELA 2 — PERFIL FINANCEIRO ══ */}
      <div id="s2" className={scr(2, 'form-screen')}>
        <div className="fc">
          <Dots step={2} />
          <div className="f-icon">💰</div>
          <h2 className="f-title">Suas metas financeiras</h2>
          <p className="f-sub">
            Para calcular seu VHS ideal, precisamos saber quanto você quer ganhar e quanto tempo
            você tem disponível.
          </p>
          <div className="ig">
            <label htmlFor="i-sal">Qual salário líquido você quer tirar por mês? *</label>
            <div className="ip">
              <span className="pfx">R$</span>
              <input type="number" id="i-sal" placeholder="5000" min={500} max={100000}
                value={sal} onChange={(e) => setSal(e.target.value)} />
            </div>
          </div>
          <div className="rg">
            <div className="rg-top">
              Horas disponíveis para trabalhar por semana <span>{horas}h</span>
            </div>
            <input type="range" id="i-horas" min={5} max={40} value={horas}
              onChange={(e) => setHoras(parseInt(e.target.value))} />
          </div>
          <div className="ig"><label>Há quanto tempo você ensina inglês? *</label></div>
          <div className="rc-wrap">
            {EXP_OPTS.map((o) => (
              <div key={o.val} className={`rc${exp === o.val ? ' sel' : ''}`} onClick={() => setExp(o.val)}>
                <div className="rc-dot" />
                <div>
                  <div className="rc-text">{o.text}</div>
                  <div className="rc-sub">{o.sub}</div>
                </div>
              </div>
            ))}
          </div>
          {err === 2 && (
            <p className="err" style={{ display: 'block' }}>
              ⚠ Por favor, informe o salário desejado e seu tempo de experiência.
            </p>
          )}
          <div className="fnav">
            <button className="btn-back" onClick={() => go(1)}>← Voltar</button>
            <button className="btn-next" onClick={v2}>Continuar →</button>
          </div>
        </div>
      </div>

      {/* ══ TELA 3 — PRECIFICAÇÃO ATUAL ══ */}
      <div id="s3" className={scr(3, 'form-screen')}>
        <div className="fc">
          <Dots step={3} />
          <div className="f-icon">📊</div>
          <h2 className="f-title">Como você precifica hoje?</h2>
          <p className="f-sub">
            Seja honesto — é exatamente aqui que identificamos onde você pode melhorar e quanto
            você está deixando de ganhar.
          </p>
          <div className="ig">
            <label htmlFor="i-vhs">Quanto você cobra por hora/aula atualmente? *</label>
            <div className="ip">
              <span className="pfx">R$</span>
              <input type="number" id="i-vhs" placeholder="80" min={10} max={2000}
                value={vhs} onChange={(e) => setVhs(e.target.value)} />
            </div>
          </div>
          <div className="ig"><label>Seu formato de aula predominante *</label></div>
          <div className="cs c3">
            {FMT_OPTS.map((o) => (
              <div key={o.val} className={`co${fmt === o.val ? ' sel' : ''}`} onClick={() => setFmt(o.val)}>
                <div className="co-icon">{o.icon}</div>
                <div className="co-title">{o.title}</div>
                <div className="co-sub">{o.sub}</div>
              </div>
            ))}
          </div>
          <div className="ig"><label>Frequência predominante das aulas *</label></div>
          <div className="cs c2">
            {FRQ_OPTS.map((o) => (
              <div key={o.val} className={`co${frq === o.val ? ' sel' : ''}`} onClick={() => setFrq(o.val)}>
                <div className="co-icon">{o.icon}</div>
                <div className="co-title">{o.title}</div>
                <div className="co-sub">{o.sub}</div>
              </div>
            ))}
          </div>
          <div className="row2">
            <div className="ig">
              <label htmlFor="i-men">Valor mensal cobrado por aluno *</label>
              <div className="ip">
                <span className="pfx">R$</span>
                <input type="number" id="i-men" placeholder="200" min={50} max={10000}
                  value={men} onChange={(e) => setMen(e.target.value)} />
              </div>
            </div>
            <div className="ig">
              <label htmlFor="i-alu">Número de alunos ativos</label>
              <input type="number" id="i-alu" placeholder="10" min={1} max={500}
                value={alu} onChange={(e) => setAlu(e.target.value)} />
            </div>
          </div>
          {err === 3 && (
            <p className="err" style={{ display: 'block' }}>
              ⚠ Por favor, preencha todos os campos obrigatórios (*) e selecione formato e
              frequência.
            </p>
          )}
          <div className="fnav">
            <button className="btn-back" onClick={() => go(2)}>← Voltar</button>
            <button className="btn-next" onClick={v3}>Ver meu diagnóstico →</button>
          </div>
        </div>
      </div>

      {/* ══ TELA LOADING ══ */}
      <div id="s-load" className={scr(4)}>
        <div className="ring" />
        <h2 style={{ fontSize: 21, fontWeight: 800, marginBottom: 7 }}>
          Analisando sua precificação...
        </h2>
        <p style={{ color: '#555', fontSize: 13.5 }}>Comparando com benchmarks do mercado</p>
        <div className="ls-wrap">
          {LOAD_STEPS.map((txt, i) => (
            <div key={txt} className={`ls${i < loadStep ? ' done' : i === loadStep ? ' on' : ''}`}>
              <div className="ls-d" /> {txt}
            </div>
          ))}
        </div>
      </div>

      {/* ══ TELA RESULTADOS ══ */}
      <div id="s-res" className={scr(5, 'form-screen')}>
        {res && screen === 5 && (
          <div className="rc-wrap2">
            <div style={{ textAlign: 'center', marginBottom: 28 }}>
              <div className={`r-badge ${res.badgeCls}`}>{res.badgeTxt}</div>
              <h2 className="r-title">
                Olá, <span className="r-name">{res.firstName}</span> — aqui está seu resultado
              </h2>
              <p className="r-intro">{res.intro}</p>
            </div>

            {/* Gauge */}
            <div className="gauge-wrap">
              <div>
                <div className="gauge">
                  <svg width="190" height="190" viewBox="0 0 190 190">
                    <circle cx="95" cy="95" r="76" fill="none" stroke="#1e1e1e" strokeWidth="13" />
                    <circle cx="95" cy="95" r="76" fill="none" stroke="url(#g1)" strokeWidth="13"
                      strokeLinecap="round" strokeDasharray={GAUGE_CIRC}
                      strokeDashoffset={GAUGE_CIRC - (GAUGE_CIRC * gauge) / 100}
                      style={{ transition: 'stroke-dashoffset 1.6s ease' }} />
                    <defs>
                      <linearGradient id="g1" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#ef4444" />
                        <stop offset="45%" stopColor="#f97316" />
                        <stop offset="100%" stopColor="#10b981" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="g-val">
                    <div className="g-num" style={{ color: res.statusColor }}>{gauge}</div>
                    <div className="g-lbl">/ 100</div>
                  </div>
                </div>
                <div className="g-status" style={{ color: res.statusColor }}>{res.statusTxt}</div>
              </div>
            </div>

            {/* Metrics */}
            <div className="metrics">
              <div className="mc">
                <div className="mc-lbl">Seu VHS Atual</div>
                <div className="mc-val" style={{ color: 'var(--em)' }}>{brl(vhsNum)}</div>
                <div className="mc-sub">por hora/aula</div>
              </div>
              <div className="mc">
                <div className="mc-lbl">VHS Ideal Calculado</div>
                <div className="mc-val" style={{ color: 'var(--gold)' }}>{brl(res.vhsIdeal)}</div>
                <div className="mc-sub">baseado no seu salário alvo</div>
              </div>
              <div className="mc">
                <div className="mc-lbl">Oportunidade Mensal</div>
                <div className="mc-val" style={{ color: 'var(--blue)' }}>
                  {res.gap > 0 ? `+${brl(res.gap)}/mês` : 'Alinhado ✓'}
                </div>
                <div className="mc-sub">
                  {res.gap > 0 ? `com ${aluNum} alunos ativos` : 'sem oportunidade perdida'}
                </div>
              </div>
            </div>

            <div className="chart-card">
              <h3>📊 Seu Preço Mensal vs Mercado de Referência</h3>
              <p>Comparação do valor que você cobra por mês com os benchmarks para o seu formato de aula.</p>
              {chart1 && <ChartCanvas config={chart1} height={170} />}
            </div>

            <div className="chart-card">
              <h3>⚡ Análise do Seu VHS (Valor Hora/Aula)</h3>
              <p>Seu VHS atual comparado com o ideal calculado para o seu salário alvo e a referência de mercado.</p>
              {chart2 && <ChartCanvas config={chart2} height={120} />}
            </div>

            <div className="diag">
              <h3>🎯 Diagnóstico Personalizado</h3>
              <p>{res.dText}</p>
              <div className="diag-tip">{res.dTip}</div>
            </div>

            <div className="cta-box">
              <h2>Quer saber <em>exatamente</em> como corrigir sua precificação?</h2>
              <p>
                Em um Diagnóstico Estratégico gratuito de 30 minutos, a Teacher Ana analisa sua
                situação real e mostra o caminho concreto para chegar nos 10K.
              </p>
              <a href={WHATSAPP_CTA} className="btn-cta" target="_blank" rel="noopener"
                onClick={markContactClicked}>
                Quero meu Diagnóstico Estratégico Gratuito →
              </a>
              <p className="cta-trust">🔒 100% gratuito, sem compromisso. Apenas 30 minutos.</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
