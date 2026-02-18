'use client';

import Link from 'next/link';

const BrandDots = () => (
  <div className="brand-dots" style={{ margin: '20px 0' }}>
    <span className="dot dot-pink"></span>
    <span className="dot dot-orange"></span>
    <span className="dot dot-green"></span>
  </div>
);

const areeChiave = [
  { tag: 'STRAT', area: 'Strategia', esempio: 'Analisi SWOT dinamica' },
  { tag: 'MKTG', area: 'Marketing', esempio: 'Analisi di mercato e sentiment' },
  { tag: 'SALES', area: 'Vendite', esempio: 'Gestione meeting e follow-up' },
  { tag: 'SERV', area: 'Customer Service', esempio: 'Chatbot di II generazione' },
  { tag: 'PROD', area: 'Produzione', esempio: 'Ottimizzazione Distinte Base (BOM)' },
  { tag: 'WHSE', area: 'Magazzino', esempio: 'Caricamento automatico bolle' },
  { tag: 'CUST', area: 'Custom', esempio: 'Processo specifico azienda/settore' },
];

const semaforo = [
  {
    colore: '🟢',
    nome: 'PISTA LIBERA',
    sottotitolo: 'Scream Execution',
    criteri: 'Processi prevalentemente Esecutivi. Dati 100% digitali, regole fisse, basso rischio.',
    azione: "Automazione totale. L'uomo monitora solo i log (eccezioni).",
    bg: 'rgba(140, 198, 63, 0.1)',
    border: 'rgba(140, 198, 63, 0.3)',
    color: '#5a8a1a'
  },
  {
    colore: '🟡',
    nome: 'ZONA GIALLA',
    sottotitolo: 'Ostacoli/Criticità',
    criteri: 'Processi prevalentemente Decisionali. Dati semi-strutturati, impatto economico rilevante.',
    azione: "L'AI funge da consulente (Draft/Analisi), l'Uomo valida e prende la decisione finale (Human-in-the-loop).",
    bg: 'rgba(248, 159, 90, 0.1)',
    border: 'rgba(248, 159, 90, 0.3)',
    color: '#c47a2a'
  },
  {
    colore: '🔴',
    nome: 'FUORI GIOCO',
    sottotitolo: 'Zona Rossa',
    criteri: 'Relazioni umane, negoziazione politica, etica, dati analogici.',
    azione: "L'Uomo resta sovrano. L'AI fa solo da archivio informativo.",
    bg: 'rgba(239, 111, 108, 0.1)',
    border: 'rgba(239, 111, 108, 0.3)',
    color: '#c44a47'
  }
];

export default function Fase1() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-white)' }}>
      {/* Header */}
      <header style={{ background: 'var(--color-gray-dark)', padding: '24px 20px', color: 'white' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <Link href="/" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontFamily: 'var(--font-body)', fontSize: '14px' }}>
            ← Torna alla Home
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '16px' }}>
            <span style={{ background: 'var(--color-pink)', color: 'white', padding: '8px 16px', borderRadius: 'var(--radius-pill)', fontFamily: 'var(--font-headings)', fontWeight: 700 }}>
              FASE 1
            </span>
            <h1 style={{ fontFamily: 'var(--font-headings)', fontSize: '42px', margin: 0 }}>
              ⛏️ BUSINESS MINING
            </h1>
          </div>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '18px', color: 'rgba(255,255,255,0.8)', marginTop: '8px' }}>
            & Lo Schema del Semaforo
          </p>
        </div>
      </header>

      <main style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 20px' }}>
        <BrandDots />

        {/* Obiettivo */}
        <div className="card" style={{ marginBottom: '32px', borderLeft: '4px solid var(--color-pink)' }}>
          <h2 style={{ fontFamily: 'var(--font-headings)', fontSize: '20px', marginBottom: '12px' }}>
            OBIETTIVO
          </h2>
          <p style={{ fontFamily: 'var(--font-body)', color: 'var(--color-gray-medium)', margin: 0 }}>
            Estrarre, semplificare e identificare dove &quot;staccare&quot; l&apos;uomo dal lavoro di fango.
          </p>
        </div>

        {/* 1. Estrazione Processi */}
        <h2 style={{ fontFamily: 'var(--font-headings)', fontSize: '28px', marginBottom: '16px', color: 'var(--color-gray-dark)' }}>
          1. ESTRAZIONE DEI PROCESSI (MINING)
        </h2>
        <p style={{ fontFamily: 'var(--font-body)', color: 'var(--color-gray-medium)', marginBottom: '24px' }}>
          Si lavora su 6 aree chiave + 1 Custom per estrarre processi reali:
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px', marginBottom: '40px' }}>
          {areeChiave.map((area) => (
            <div key={area.tag} className="card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{
                background: 'var(--color-pink)', color: 'white', padding: '4px 10px',
                borderRadius: 'var(--radius-sm)', fontFamily: 'monospace', fontSize: '12px', fontWeight: 700, flexShrink: 0
              }}>
                {area.tag}
              </span>
              <div>
                <strong style={{ fontFamily: 'var(--font-headings)', fontSize: '14px' }}>{area.area}</strong>
                <p style={{ margin: 0, fontSize: '13px', color: 'var(--color-gray-medium)' }}>{area.esempio}</p>
              </div>
            </div>
          ))}
        </div>

        {/* 2. Lean Trimming */}
        <h2 style={{ fontFamily: 'var(--font-headings)', fontSize: '28px', marginBottom: '16px', color: 'var(--color-gray-dark)' }}>
          2. LEAN TRIMMING: SEMPLIFICAZIONE E TAGLIO
        </h2>
        <div className="card" style={{ marginBottom: '40px', background: 'rgba(239,111,108,0.05)', border: '1px solid rgba(239,111,108,0.2)' }}>
          <p style={{ fontFamily: 'var(--font-body)', color: 'var(--color-gray-dark)', marginBottom: '16px', fontWeight: 700, fontSize: '16px' }}>
            Prima di ogni switch tecnologico, il processo va &quot;potato&quot;. Un processo lungo e complicato non è un buon candidato per l&apos;AI.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '20px', flexShrink: 0 }}>✂️</span>
              <div>
                <strong style={{ fontFamily: 'var(--font-headings)', fontSize: '14px' }}>Regola del Taglio</strong>
                <p style={{ margin: '4px 0 0', fontSize: '14px', color: 'var(--color-gray-medium)' }}>
                  Se un processo ha più di 7 passaggi, va spezzato o ridotto eliminando i passaggi che non generano valore (Muda).
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '20px', flexShrink: 0 }}>🧹</span>
              <div>
                <strong style={{ fontFamily: 'var(--font-headings)', fontSize: '14px' }}>De-complicazione</strong>
                <p style={{ margin: '4px 0 0', fontSize: '14px', color: 'var(--color-gray-medium)' }}>
                  Semplificare la logica decisionale. Se un umano fa fatica a spiegarlo, l&apos;AI farà fatica a eseguirlo.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Esecuzione vs Decisione */}
        <h2 style={{ fontFamily: 'var(--font-headings)', fontSize: '28px', marginBottom: '16px', color: 'var(--color-gray-dark)' }}>
          3. LA GRANDE DISTINZIONE: ESECUZIONE VS DECISIONE
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '40px' }}>
          <div className="card" style={{ borderTop: '4px solid var(--color-green)' }}>
            <h3 style={{ fontFamily: 'var(--font-headings)', fontSize: '18px', marginBottom: '12px' }}>
              PROCESSI ESECUTIVI
            </h3>
            <p style={{ fontFamily: 'var(--font-headings)', fontSize: '13px', color: 'var(--color-green)', marginBottom: '8px' }}>
              L&apos;AI come Motore
            </p>
            <ul style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--color-gray-medium)', paddingLeft: '20px', margin: 0 }}>
              <li><strong>Focus:</strong> Velocità, precisione, volume</li>
              <li><strong>Supporto AI:</strong> Automazione dei flussi (n8n). Sposta dati, compila moduli, genera report</li>
              <li><strong>Obiettivo:</strong> Azzerare il &quot;lavoro di fango&quot;</li>
            </ul>
          </div>
          <div className="card" style={{ borderTop: '4px solid var(--color-orange)' }}>
            <h3 style={{ fontFamily: 'var(--font-headings)', fontSize: '18px', marginBottom: '12px' }}>
              PROCESSI DECISIONALI
            </h3>
            <p style={{ fontFamily: 'var(--font-headings)', fontSize: '13px', color: 'var(--color-orange)', marginBottom: '8px' }}>
              L&apos;AI come Consulente
            </p>
            <ul style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--color-gray-medium)', paddingLeft: '20px', margin: 0 }}>
              <li><strong>Focus:</strong> Qualità della scelta, analisi rischi, scenari</li>
              <li><strong>Supporto AI:</strong> Sintesi dati, pattern, previsioni (Augmented Intelligence)</li>
              <li><strong>Obiettivo:</strong> Ridurre i bias umani e fornire base solida per decidere</li>
            </ul>
          </div>
        </div>

        {/* 4. Semaforo */}
        <h2 style={{ fontFamily: 'var(--font-headings)', fontSize: '28px', marginBottom: '16px', color: 'var(--color-gray-dark)' }}>
          4. LO SWITCH UOMO/AI (IL SEMAFORO META-HODOS)
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '40px' }}>
          {semaforo.map((s) => (
            <div key={s.nome} className="card" style={{ background: s.bg, border: `1px solid ${s.border}`, padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <span style={{ fontSize: '32px' }}>{s.colore}</span>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-headings)', fontSize: '20px', margin: 0, color: s.color }}>{s.nome}</h3>
                  <span style={{ fontFamily: 'var(--font-headings)', fontSize: '13px', color: s.color, opacity: 0.8 }}>{s.sottotitolo}</span>
                </div>
              </div>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--color-gray-dark)', marginBottom: '8px' }}>
                <strong>Criteri:</strong> {s.criteri}
              </p>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--color-gray-dark)', margin: 0 }}>
                <strong>Azione:</strong> {s.azione}
              </p>
            </div>
          ))}
        </div>

        {/* Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px' }}>
          <Link href="/" style={{ fontFamily: 'var(--font-headings)', color: 'var(--color-gray-medium)', textDecoration: 'none' }}>
            ← HOME
          </Link>
          <Link href="/lab2" style={{ fontFamily: 'var(--font-headings)', color: 'var(--color-orange)', textDecoration: 'none', fontWeight: 700 }}>
            FASE 2: LO SPARTITO →
          </Link>
        </div>
      </main>

      <footer className="footer">
        <BrandDots />
        <p style={{ margin: 0 }}>Progetto Atena • Fase 1: Business Mining</p>
      </footer>
    </div>
  );
}
