'use client';

import Link from 'next/link';

const BrandDots = () => (
  <div className="brand-dots" style={{ margin: '20px 0' }}>
    <span className="dot dot-pink"></span>
    <span className="dot dot-orange"></span>
    <span className="dot dot-green"></span>
  </div>
);

const kpis = [
  { nome: 'FTE Savings', desc: 'Calcolo delle ore/uomo risparmiate su base mensile.', icon: '⏱️' },
  { nome: 'Accuracy & Error Rate', desc: 'Riduzione percentuale degli errori manuali post-implementazione.', icon: '🎯' },
  { nome: 'Lead Time Reduction', desc: 'Riduzione del tempo tra Trigger e Output finale.', icon: '⚡' },
  { nome: 'Cost of Execution', desc: 'Confronto tra costo orario dipendente e costo token/infra.', icon: '💰' },
];

const resistenze = [
  { titolo: 'WIIFM', sottotitolo: "What's In It For Me", desc: "L'AI toglie la \"gravità\" del lavoro noioso.", icon: '🎁' },
  { titolo: 'Role Upgrade', sottotitolo: 'Da esecutore a validatore', desc: 'Yellow Zone Controller: il manager diventa supervisore strategico.', icon: '📈' },
  { titolo: 'Trasparenza Totale', sottotitolo: 'Condivisione dei successi', desc: 'Condivisione dei successi su Metahodos 2.0.', icon: '🔍' },
];

export default function Fase4() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-white)' }}>
      {/* Header */}
      <header style={{ background: 'var(--color-gray-dark)', padding: '24px 20px', color: 'white' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <Link href="/" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontFamily: 'var(--font-body)', fontSize: '14px' }}>
            ← Torna alla Home
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '16px' }}>
            <span style={{ background: '#6366f1', color: 'white', padding: '8px 16px', borderRadius: 'var(--radius-pill)', fontFamily: 'var(--font-headings)', fontWeight: 700 }}>
              FASE 4
            </span>
            <h1 style={{ fontFamily: 'var(--font-headings)', fontSize: '42px', margin: 0 }}>
              📋 CAMBIO DI PARADIGMA
            </h1>
          </div>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '18px', color: 'rgba(255,255,255,0.8)', marginTop: '8px' }}>
            & Il Paper per l&apos;IT
          </p>
        </div>
      </header>

      <main style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 20px' }}>
        <BrandDots />

        {/* Obiettivo */}
        <div className="card" style={{ marginBottom: '32px', borderLeft: '4px solid #6366f1' }}>
          <h2 style={{ fontFamily: 'var(--font-headings)', fontSize: '20px', marginBottom: '12px' }}>
            OBIETTIVO
          </h2>
          <p style={{ fontFamily: 'var(--font-body)', color: 'var(--color-gray-medium)', margin: 0 }}>
            Gestire il cambiamento e parlare la lingua del ferro.
          </p>
        </div>

        {/* 1. KPI */}
        <h2 style={{ fontFamily: 'var(--font-headings)', fontSize: '28px', marginBottom: '16px', color: 'var(--color-gray-dark)' }}>
          1. VALUTAZIONE DEI BENEFICI (KPI TECNICI E STRATEGICI)
        </h2>
        <p style={{ fontFamily: 'var(--font-body)', color: 'var(--color-gray-medium)', marginBottom: '24px' }}>
          Per ogni processo automatizzato, il manager deve misurare:
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '40px' }}>
          {kpis.map((kpi) => (
            <div key={kpi.nome} className="card" style={{ textAlign: 'center', borderTop: '3px solid #6366f1' }}>
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>{kpi.icon}</div>
              <h4 style={{ fontFamily: 'var(--font-headings)', fontSize: '15px', marginBottom: '8px', color: '#6366f1' }}>
                {kpi.nome}
              </h4>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--color-gray-medium)', margin: 0 }}>
                {kpi.desc}
              </p>
            </div>
          ))}
        </div>

        {/* 2. Gestione Resistenze */}
        <h2 style={{ fontFamily: 'var(--font-headings)', fontSize: '28px', marginBottom: '16px', color: 'var(--color-gray-dark)' }}>
          2. GESTIONE &quot;SMART&quot; DELLE RESISTENZE
        </h2>
        <p style={{ fontFamily: 'var(--font-headings)', fontSize: '14px', color: '#6366f1', marginBottom: '24px' }}>
          Strategia Antigravity
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '40px' }}>
          {resistenze.map((r) => (
            <div key={r.titolo} className="card" style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '20px' }}>
              <div style={{
                width: '48px', height: '48px', borderRadius: '50%', background: '#6366f1',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', flexShrink: 0
              }}>
                {r.icon}
              </div>
              <div>
                <h4 style={{ fontFamily: 'var(--font-headings)', fontSize: '16px', margin: '0 0 2px', color: 'var(--color-gray-dark)' }}>
                  {r.titolo}
                </h4>
                <span style={{ fontFamily: 'var(--font-headings)', fontSize: '12px', color: '#6366f1' }}>{r.sottotitolo}</span>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--color-gray-medium)', margin: '4px 0 0' }}>
                  {r.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* 3. Paper per l'IT */}
        <h2 style={{ fontFamily: 'var(--font-headings)', fontSize: '28px', marginBottom: '16px', color: 'var(--color-gray-dark)' }}>
          3. IL &quot;PAPER PER L&apos;IT&quot; (TECHNICAL HANDOVER)
        </h2>

        <div className="card" style={{ marginBottom: '40px', background: 'rgba(99, 102, 241, 0.05)', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
          <p style={{ fontFamily: 'var(--font-body)', color: 'var(--color-gray-dark)', marginBottom: '16px' }}>
            Documento che descrive:
          </p>
          <ul style={{ fontFamily: 'var(--font-body)', fontSize: '15px', color: 'var(--color-gray-medium)', paddingLeft: '24px', lineHeight: 2 }}>
            <li>L&apos;architettura n8n completa (nodi, connessioni, credenziali)</li>
            <li>Gli strumenti Claude Cowork utilizzati</li>
            <li>I protocolli di sicurezza e le policy di accesso</li>
            <li>I KPI misurati e i risultati ottenuti</li>
            <li>Piano di manutenzione e ownership</li>
          </ul>
        </div>

        {/* Appendice: Master Prompt */}
        <div className="card" style={{ marginBottom: '40px', background: 'var(--color-gray-dark)', color: 'white' }}>
          <h3 style={{ fontFamily: 'var(--font-headings)', fontSize: '20px', marginBottom: '16px', color: '#6366f1' }}>
            APPENDICE: MASTER PROMPT PER ANTIGRAVITY
          </h3>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'rgba(255,255,255,0.7)', marginBottom: '12px' }}>
            Copia e incolla questo prompt in un IDE come Antigravity o Bolt per creare l&apos;App del corso:
          </p>
          <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: 'var(--radius-sm)', padding: '16px', fontFamily: 'monospace', fontSize: '12px', color: 'var(--color-green)', lineHeight: 1.7 }}>
            <p style={{ margin: '0 0 8px' }}>&quot;Agisci come Senior Software Architect esperto in metodologie Agile e AI. Crea una Web App chiamata &apos;Metahodos Architect Companion&apos;. L&apos;app deve guidare i manager attraverso le 4 fasi del corso:</p>
            <p style={{ margin: '0 0 8px' }}>1. Dashboard &apos;Mining&apos;: Form per inserire processi nelle 6 aree (+ Custom) con logica &apos;Lean Trimming&apos; (avviso se passaggi &gt; 7).</p>
            <p style={{ margin: '0 0 8px' }}>2. Strumento &apos;Semaforo&apos;: Classificazione 🟢/🟡/🔴 basata sui criteri di Esecuzione vs Decisione.</p>
            <p style={{ margin: '0 0 8px' }}>3. Editor &apos;Spartito&apos;: Interfaccia drag-and-drop per associare i tag (#TRG, #AGT, #LLM, #PRM, #MEM, #TOL, #OUT).</p>
            <p style={{ margin: '0 0 8px' }}>4. Pulsante &apos;Antigravity Trigger&apos;: Prende lo spartito taggato, lo trasforma in prompt strutturato per n8n e lo invia tramite webhook.</p>
            <p style={{ margin: 0 }}>5. Calcolatore KPI: Form per inserire ore/uomo e costi per generare il &apos;Paper per l&apos;IT&apos; finale in PDF.&quot;</p>
          </div>
        </div>

        {/* Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px' }}>
          <Link href="/lab3" style={{ fontFamily: 'var(--font-headings)', color: 'var(--color-green)', textDecoration: 'none' }}>
            ← FASE 3: IMPLEMENTAZIONE
          </Link>
          <Link href="/" style={{ fontFamily: 'var(--font-headings)', color: 'var(--color-gray-medium)', textDecoration: 'none', fontWeight: 700 }}>
            TORNA ALLA HOME →
          </Link>
        </div>
      </main>

      <footer className="footer">
        <BrandDots />
        <p style={{ margin: 0 }}>Progetto Atena • Fase 4: Cambio di Paradigma</p>
      </footer>
    </div>
  );
}
