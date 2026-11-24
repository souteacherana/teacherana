'use client';

import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import type { ChartConfiguration } from 'chart.js';
import ChartCanvas from '@/components/ChartCanvas';
import { CAMPAIGNS, type Campaign, type Column, type Kpi, type Row } from '@/lib/campaigns';

type Conn = 'loading' | 'ok' | 'err';
type Grade = '' | 'A' | 'B' | 'C';
type Sort = { col: string; dir: 'asc' | 'desc' };

const icpLabel = (g: unknown) =>
  g === 'A' ? '🔥 Quente' : g === 'B' ? '☀️ Morno' : g === 'C' ? '❄️ Frio' : '—';
const icpClass = (g: unknown) => (g ? `i${g}` : 'i-');
const digits = (v: unknown) => String(v ?? '').replace(/\D/g, '');

function KpiCard({ label, value, sub, color, icon }: Kpi) {
  return (
    <div className={`kpi ${color}`}>
      <div className="kpi-lbl">{label}</div>
      <div className="kpi-val">{value}</div>
      <div className="kpi-sub">{sub || ''}</div>
      <div className="kpi-ico">{icon || ''}</div>
    </div>
  );
}

function Loading({ colSpan }: { colSpan: number }) {
  return (
    <tr>
      <td colSpan={colSpan}>
        <div className="ld-msg"><div className="spin" />Carregando...</div>
      </td>
    </tr>
  );
}

function Empty({ colSpan, txt, sub }: { colSpan: number; txt: string; sub: string }) {
  return (
    <tr>
      <td colSpan={colSpan}>
        <div className="empty">
          <div className="empty-ico">📭</div>
          <div className="empty-txt">{txt}</div>
          <div className="empty-sub">{sub}</div>
        </div>
      </td>
    </tr>
  );
}

function Cell({ col, row }: { col: Column; row: Row }) {
  const v = row[col.key];
  if (col.icp) {
    return <td><span className={`icp ${icpClass(v)}`}>{icpLabel(v)}</span></td>;
  }
  if (col.scoreBar) {
    const s = v || 0;
    const color = s < 60 ? '#ef4444' : s < 80 ? '#f97316' : '#10b981';
    return (
      <td>
        <div className="sbar-w">
          <span>{s}</span>
          <div className="sbar"><div className="sbar-f" style={{ width: `${s}%`, background: color }} /></div>
        </div>
      </td>
    );
  }
  return <td>{col.fmt ? col.fmt(v) : v != null ? String(v) : '—'}</td>;
}

/* ══════════════════════════════════════════
   APP
══════════════════════════════════════════ */
export default function AdminApp() {
  const [authed, setAuthed] = useState<boolean | null>(null); // null = verificando sessão
  const [pwd, setPwd] = useState('');
  const [loginErr, setLoginErr] = useState('');

  const [data, setData] = useState<Record<string, Row[] | undefined>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [conn, setConn] = useState<Conn>('loading');
  const [tab, setTab] = useState('overview');

  /* ── Sessão / login ── */
  useEffect(() => {
    fetch('/api/admin/login')
      .then((r) => r.json())
      .then((j) => setAuthed(Boolean(j.ok)))
      .catch(() => setAuthed(false));
  }, []);

  async function login() {
    setLoginErr('');
    try {
      const r = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: pwd }),
      });
      const j = await r.json().catch(() => ({}));
      if (r.ok && j.ok) {
        setPwd('');
        setAuthed(true);
      } else {
        setLoginErr(j.error || 'Senha incorreta.');
      }
    } catch {
      setLoginErr('Erro de conexão.');
    }
  }

  async function logout() {
    await fetch('/api/admin/login', { method: 'DELETE' }).catch(() => {});
    setAuthed(false);
    setData({});
    setErrors({});
    setTab('overview');
  }

  /* ── Sync ── */
  const syncAll = useCallback(async () => {
    setConn('loading');
    let anyErr = false;
    for (const c of CAMPAIGNS) {
      try {
        const r = await fetch(`/api/admin/leads?campaign=${encodeURIComponent(c.id)}`, { cache: 'no-store' });
        if (r.status === 401) {
          setAuthed(false);
          return;
        }
        const j = await r.json();
        if (!r.ok) throw new Error(j.error || `HTTP ${r.status}`);
        setData((d) => ({ ...d, [c.id]: j.rows || [] }));
        setErrors((e) => ({ ...e, [c.id]: '' }));
      } catch (e) {
        anyErr = true;
        setData((d) => ({ ...d, [c.id]: [] }));
        setErrors((er) => ({ ...er, [c.id]: `Erro ao carregar dados: ${(e as Error).message}` }));
      }
    }
    setConn(anyErr ? 'err' : 'ok');
  }, []);

  useEffect(() => {
    if (authed) syncAll();
  }, [authed, syncAll]);

  /* ── Telas ── */
  if (authed === null) return null;

  if (!authed) {
    return (
      <div id="login-screen">
        <div className="lcard">
          <div style={{ fontSize: 32 }}>🚀</div>
          <h1>Campanhas Pré Diagnóstico</h1>
          <p>Painel de leads e qualificação — Rise</p>
          <input
            type="password"
            placeholder="••••••••"
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && login()}
          />
          <button onClick={login}>Entrar</button>
          {loginErr && <div className="lerr" style={{ display: 'block' }}>{loginErr}</div>}
        </div>
      </div>
    );
  }

  const loaded = CAMPAIGNS.every((c) => data[c.id]);
  const active = CAMPAIGNS.find((c) => c.id === tab);

  return (
    <div id="app" style={{ display: 'flex' }}>
      <header className="hdr">
        <div className="hdr-l">
          <span style={{ fontSize: 18 }}>🚀</span>
          <span style={{ fontSize: 15, fontWeight: 800 }}>Rise Admin</span>
          <span className="hdr-badge">Campanhas</span>
        </div>
        <div className="hdr-r">
          <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--muted)' }}>
            <span className={`conn-dot${conn === 'ok' ? ' ok' : conn === 'err' ? ' err' : ''}`} />
            <span>{conn === 'ok' ? 'Conectado' : conn === 'err' ? 'Erro de conexão' : 'Sincronizando...'}</span>
          </span>
          <button className="btn-sm" onClick={syncAll}>↻ Sincronizar</button>
          <button className="btn-sm" onClick={logout}>Sair</button>
        </div>
      </header>

      <nav className="tabs">
        <div className={`tab${tab === 'overview' ? ' on' : ''}`} onClick={() => setTab('overview')}>
          🏠 Visão Geral <span className="tab-n">{CAMPAIGNS.length}</span>
        </div>
        {CAMPAIGNS.map((c) => (
          <div key={c.id} className={`tab${tab === c.id ? ' on' : ''}`} onClick={() => setTab(c.id)}>
            {c.icon} {c.name} <span className="tab-n">{data[c.id] ? data[c.id]!.length : '—'}</span>
          </div>
        ))}
        <div className="tab-soon">＋ Novas campanhas em breve</div>
      </nav>

      <main className="content">
        {active ? (
          <div className="panel on" key={active.id}>
            <CampaignPanel c={active} rows={data[active.id]} error={errors[active.id]} />
          </div>
        ) : (
          <div className="panel on" key="overview">
            <Overview data={data} loaded={loaded} />
          </div>
        )}
      </main>
    </div>
  );
}

/* ══════════════════════════════════════════
   VISÃO GERAL
══════════════════════════════════════════ */
function Overview({ data, loaded }: { data: Record<string, Row[] | undefined>; loaded: boolean }) {
  const allRows = useMemo<Row[]>(
    () => CAMPAIGNS.flatMap((c) => (data[c.id] || []).map((r) => ({ ...r, _camp: c.name, _color: c.color }))),
    [data],
  );
  const total = allRows.length;
  const hot = allRows.filter((r) => r.qualificacao_icp === 'A').length;
  const avg = total ? Math.round(allRows.reduce((s, r) => s + (r.score_alinhamento || 0), 0) / total) : 0;

  const barCfg = useMemo<ChartConfiguration>(
    () => ({
      type: 'bar',
      data: {
        labels: CAMPAIGNS.map((c) => c.name),
        datasets: [
          {
            data: CAMPAIGNS.map((c) => (data[c.id] || []).length),
            backgroundColor: CAMPAIGNS.map((c) => c.color + '88'),
            borderColor: CAMPAIGNS.map((c) => c.color),
            borderWidth: 2,
            borderRadius: 8,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
          x: { ticks: { color: '#666' }, grid: { color: '#1a1a1a' } },
          y: { ticks: { color: '#666', stepSize: 1 }, grid: { color: '#1a1a1a' } },
        },
      },
    }),
    [data],
  );

  const icpCfg = useMemo<ChartConfiguration>(() => {
    const n = (g: string) => allRows.filter((r) => r.qualificacao_icp === g).length;
    return {
      type: 'doughnut',
      data: {
        labels: ['Quente (A)', 'Morno (B)', 'Frio (C)', 'Sem ICP'],
        datasets: [
          {
            data: [n('A'), n('B'), n('C'), allRows.filter((r) => !r.qualificacao_icp).length],
            backgroundColor: ['#ef444455', '#f9731655', '#60a5fa55', '#33333355'],
            borderColor: ['#ef4444', '#f97316', '#60a5fa', '#555'],
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        cutout: '62%',
        plugins: { legend: { labels: { color: '#888', font: { size: 12 } } } },
      },
    } as ChartConfiguration;
  }, [allRows]);

  return (
    <>
      <div className="kpi-grid">
        <KpiCard label="Campanhas Ativas" value={CAMPAIGNS.length} sub="configuradas" color="c-green" icon="🚀" />
        <KpiCard label="Total de Leads" value={loaded ? total : '—'} sub="todas as campanhas" color="c-blue" icon="👥" />
        <KpiCard label="Leads Quentes (A)" value={loaded ? hot : '—'} sub="alta prioridade" color="c-red" icon="🔥" />
        <KpiCard label="Score Médio Geral" value={loaded ? avg : '—'} sub="alinhamento geral" color="c-orange" icon="📊" />
      </div>
      <div className="chart-grid">
        <div className="chart-card"><h3>📈 Leads por Campanha</h3><ChartCanvas config={barCfg} /></div>
        <div className="chart-card"><h3>🎯 Distribuição ICP</h3><ChartCanvas config={icpCfg} /></div>
      </div>
      <div className="sec-hdr"><h2 className="sec-title">Últimos Leads — Todas as Campanhas</h2></div>
      <div className="tbl-wrap">
        <div className="tbl-scroll">
          <table>
            <thead>
              <tr><th>Campanha</th><th>Nome</th><th>WhatsApp</th><th>ICP</th><th>Score</th><th>Data</th><th>Ações</th></tr>
            </thead>
            <tbody>
              {!loaded ? (
                <Loading colSpan={7} />
              ) : !allRows.length ? (
                <Empty colSpan={7} txt="Nenhum lead captado ainda" sub="Os leads aparecerão aqui após preenchimento dos formulários" />
              ) : (
                allRows.slice(0, 50).map((r, i) => {
                  const wpp = digits(r.whatsapp);
                  return (
                    <tr key={`${r._camp}-${r.id ?? i}`}>
                      <td><span style={{ color: r._color, fontSize: 12, fontWeight: 700 }}>{r._camp}</span></td>
                      <td>{r.nome || '—'}</td>
                      <td>{r.whatsapp || '—'}</td>
                      <td><span className={`icp ${icpClass(r.qualificacao_icp)}`}>{icpLabel(r.qualificacao_icp)}</span></td>
                      <td>{r.score_alinhamento != null ? r.score_alinhamento : '—'}</td>
                      <td>{r.created_at ? new Date(r.created_at).toLocaleDateString('pt-BR') : '—'}</td>
                      <td>
                        {wpp ? (
                          <a className="act wpp" href={`https://wa.me/55${wpp}`} target="_blank" rel="noopener noreferrer">💬</a>
                        ) : '—'}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

/* ══════════════════════════════════════════
   PAINEL DE CAMPANHA
══════════════════════════════════════════ */
function CampaignPanel({ c, rows, error }: { c: Campaign; rows?: Row[]; error?: string }) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<Grade>('');
  const [sort, setSort] = useState<Sort | null>(null);
  const [open, setOpen] = useState<Set<string>>(new Set());

  const all = rows || [];
  const colSpan = c.columns.length + 1;

  const list = useMemo(() => {
    let l = [...all];
    const term = search.toLowerCase();
    if (term) {
      l = l.filter((r) =>
        [r.nome, r.email, r.whatsapp].some((v) => String(v || '').toLowerCase().includes(term)),
      );
    }
    if (filter) l = l.filter((r) => r.qualificacao_icp === filter);
    if (sort) {
      l.sort((a, b) => {
        const av = a[sort.col], bv = b[sort.col];
        if (av == null) return 1;
        if (bv == null) return -1;
        return sort.dir === 'asc' ? (av > bv ? 1 : -1) : av < bv ? 1 : -1;
      });
    }
    return l;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows, search, filter, sort]);

  const sortBy = (col: string) =>
    setSort((s) => ({ col, dir: s?.col === col && s.dir === 'desc' ? 'asc' : 'desc' }));

  const toggle = (k: string) =>
    setOpen((o) => {
      const n = new Set(o);
      if (n.has(k)) n.delete(k);
      else n.add(k);
      return n;
    });

  function copyLead(r: Row) {
    const txt = [
      `Nome: ${r.nome || '—'}`,
      `E-mail: ${r.email || '—'}`,
      `WhatsApp: ${r.whatsapp || '—'}`,
      `VHS Atual: ${r.vhs_atual ? 'R$ ' + r.vhs_atual : '—'}`,
      `Score: ${r.score_alinhamento ?? '—'}`,
      `ICP: ${r.qualificacao_icp || '—'}`,
      `Alunos: ${r.num_alunos || '—'}`,
    ].join('\n');
    navigator.clipboard.writeText(txt).catch(() => {});
  }

  function exportCSV() {
    if (!all.length) return alert('Nenhum dado para exportar.');
    const keys = Object.keys(all[0]);
    const csv = [keys.join(','), ...all.map((r) => keys.map((k) => JSON.stringify(r[k] ?? '')).join(','))].join('\n');
    const a = Object.assign(document.createElement('a'), {
      href: URL.createObjectURL(new Blob([csv], { type: 'text/csv' })),
      download: `leads_${c.id}_${new Date().toISOString().slice(0, 10)}.csv`,
    });
    a.click();
  }

  const FILTERS: { g: Grade; label: string }[] = [
    { g: '', label: 'Todos' },
    { g: 'A', label: '🔥 Quente (A)' },
    { g: 'B', label: '☀️ Morno (B)' },
    { g: 'C', label: '❄️ Frio (C)' },
  ];

  return (
    <>
      <div className="kpi-grid">
        {rows ? (
          c.kpis(rows).map((k) => <KpiCard key={k.label} {...k} />)
        ) : (
          <KpiCard label="Aguardando dados..." value="—" sub="" color="c-green" icon="⏳" />
        )}
      </div>
      {error && <div className="err-banner" style={{ display: 'block' }}>⚠ {error}</div>}
      <div className="sec-hdr">
        <h2 className="sec-title">Leads — {c.name}</h2>
        <div className="fbar">
          <div className="sbox">
            <span className="sicon">🔍</span>
            <input type="text" placeholder="Buscar nome, e-mail ou WhatsApp..." value={search}
              onChange={(e) => setSearch(e.target.value)} />
          </div>
          {FILTERS.map((f) => (
            <button key={f.g || 'all'} className={`fbtn${filter === f.g ? ' on' : ''}`} onClick={() => setFilter(f.g)}>
              {f.label}
            </button>
          ))}
          <button className="exp-btn" onClick={exportCSV}>⬇ Exportar CSV</button>
        </div>
      </div>
      <div className="tbl-wrap">
        <div className="tbl-scroll">
          <table>
            <thead>
              <tr>
                {c.columns.map((col) => (
                  <th key={col.key} className={sort?.col === col.key ? 'srt' : ''} onClick={() => sortBy(col.key)}>
                    {col.label}
                    {sort?.col === col.key ? (sort.dir === 'asc' ? ' ↑' : ' ↓') : ''}
                  </th>
                ))}
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {!rows ? (
                <Loading colSpan={colSpan} />
              ) : !list.length ? (
                <Empty
                  colSpan={colSpan}
                  txt={all.length ? 'Nenhum lead com esse filtro' : 'Nenhum lead ainda'}
                  sub={all.length ? 'Tente outro filtro' : 'Aguardando primeiros cadastros'}
                />
              ) : (
                list.map((row, i) => {
                  const k = String(row.id ?? i);
                  const isOpen = open.has(k);
                  const wpp = digits(row.whatsapp);
                  const wppHref = wpp
                    ? `https://wa.me/55${wpp}?text=${encodeURIComponent(`Olá ${row.nome || ''}! Vi seu diagnóstico de precificação e gostaria de conversar.`)}`
                    : '';
                  return (
                    <Fragment key={k}>
                      <tr className={isOpen ? 'exp' : ''} onClick={() => toggle(k)}>
                        {c.columns.map((col) => <Cell key={col.key} col={col} row={row} />)}
                        <td onClick={(e) => e.stopPropagation()}>
                          <div className="acts">
                            {wppHref && (
                              <a className="act wpp" href={wppHref} target="_blank" rel="noopener noreferrer" title="WhatsApp">💬</a>
                            )}
                            <button className="act" onClick={() => copyLead(row)} title="Copiar dados">📋</button>
                          </div>
                        </td>
                      </tr>
                      {isOpen && (
                        <tr>
                          <td className="det-td" colSpan={colSpan}>
                            <div className="det-inner">
                              {c.detail.map((d) => {
                                const raw = row[d.key];
                                const v = d.fmt ? d.fmt(raw) : raw != null ? String(raw) : '—';
                                return (
                                  <div key={d.key}>
                                    <div className="di-lbl">{d.label}</div>
                                    <div className="di-val">{v || '—'}</div>
                                  </div>
                                );
                              })}
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
