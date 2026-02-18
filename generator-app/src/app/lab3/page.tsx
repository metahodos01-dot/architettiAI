'use client';

import Link from 'next/link';

const BrandDots = () => (
  <div className="brand-dots" style={{ margin: '20px 0' }}>
    <span className="dot dot-pink"></span>
    <span className="dot dot-orange"></span>
    <span className="dot dot-green"></span>
  </div>
);

export default function Fase3() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-white)' }}>
      {/* Header */}
      <header style={{ background: 'var(--color-gray-dark)', padding: '24px 20px', color: 'white' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <Link href="/" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontFamily: 'var(--font-body)', fontSize: '14px' }}>
            ← Torna alla Home
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '16px' }}>
            <span style={{ background: 'var(--color-green)', color: 'white', padding: '8px 16px', borderRadius: 'var(--radius-pill)', fontFamily: 'var(--font-headings)', fontWeight: 700 }}>
              FASE 3
            </span>
            <h1 style={{ fontFamily: 'var(--font-headings)', fontSize: '42px', margin: 0 }}>
              🚀 IMPLEMENTAZIONE
            </h1>
          </div>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '18px', color: 'rgba(255,255,255,0.8)', marginTop: '8px' }}>
            Antigravity & n8n — Dalla Teoria alla Musica
          </p>
        </div>
      </header>

      <main style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 20px' }}>
        <BrandDots />

        {/* Obiettivo */}
        <div className="card" style={{ marginBottom: '32px', borderLeft: '4px solid var(--color-green)' }}>
          <h2 style={{ fontFamily: 'var(--font-headings)', fontSize: '20px', marginBottom: '12px' }}>
            OBIETTIVO
          </h2>
          <p style={{ fontFamily: 'var(--font-body)', color: 'var(--color-gray-medium)', margin: 0 }}>
            Dalla teoria alla musica (Zero Code Execution).
          </p>
        </div>

        {/* 1. Antigravity */}
        <h2 style={{ fontFamily: 'var(--font-headings)', fontSize: '28px', marginBottom: '16px', color: 'var(--color-gray-dark)' }}>
          1. IL SALTO CON GOOGLE ANTIGRAVITY
        </h2>
        <p style={{ fontFamily: 'var(--font-body)', color: 'var(--color-gray-medium)', marginBottom: '16px' }}>
          Si utilizza l&apos;MCP (Model Context Protocol) di Google Antigravity per interpretare i Tag di Mural:
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '40px' }}>
          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '20px' }}>
            <div style={{
              width: '48px', height: '48px', borderRadius: '50%', background: 'var(--color-green)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', flexShrink: 0
            }}>
              1
            </div>
            <div>
              <h4 style={{ fontFamily: 'var(--font-headings)', fontSize: '16px', margin: '0 0 4px' }}>LETTURA TAG</h4>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--color-gray-medium)', margin: 0 }}>
                L&apos;AI legge i Tag #TRG, #AGT, #LLM, #PRM, #MEM, #TOL, #OUT dallo spartito creato in Fase 2.
              </p>
            </div>
          </div>

          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '20px' }}>
            <div style={{
              width: '48px', height: '48px', borderRadius: '50%', background: 'var(--color-green)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', flexShrink: 0
            }}>
              2
            </div>
            <div>
              <h4 style={{ fontFamily: 'var(--font-headings)', fontSize: '16px', margin: '0 0 4px' }}>GENERAZIONE JSON</h4>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--color-gray-medium)', margin: 0 }}>
                Genera istantaneamente il file JSON per n8n, pronto per l&apos;importazione.
              </p>
            </div>
          </div>

          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '20px' }}>
            <div style={{
              width: '48px', height: '48px', borderRadius: '50%', background: 'var(--color-green)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', flexShrink: 0
            }}>
              3
            </div>
            <div>
              <h4 style={{ fontFamily: 'var(--font-headings)', fontSize: '16px', margin: '0 0 4px' }}>ZERO CODE APP</h4>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--color-gray-medium)', margin: 0 }}>
                Crea la struttura per Claude Cowork se serve un&apos;interfaccia (Zero Code App).
              </p>
            </div>
          </div>
        </div>

        {/* 2. Test e Miglioramento */}
        <h2 style={{ fontFamily: 'var(--font-headings)', fontSize: '28px', marginBottom: '16px', color: 'var(--color-gray-dark)' }}>
          2. TEST E MIGLIORAMENTO
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', marginBottom: '40px' }}>
          <div className="card" style={{ textAlign: 'center', borderTop: '3px solid var(--color-green)' }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>📥</div>
            <h4 style={{ fontFamily: 'var(--font-headings)', fontSize: '16px', marginBottom: '8px' }}>CARICAMENTO</h4>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--color-gray-medium)', margin: 0 }}>
              Caricamento del flusso JSON su n8n
            </p>
          </div>

          <div className="card" style={{ textAlign: 'center', borderTop: '3px solid var(--color-orange)' }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>🧪</div>
            <h4 style={{ fontFamily: 'var(--font-headings)', fontSize: '16px', marginBottom: '8px' }}>TEST REALI</h4>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--color-gray-medium)', margin: 0 }}>
              Test con dati reali (es. una vera bolla o un meeting reale)
            </p>
          </div>

          <div className="card" style={{ textAlign: 'center', borderTop: '3px solid var(--color-pink)' }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>🔧</div>
            <h4 style={{ fontFamily: 'var(--font-headings)', fontSize: '16px', marginBottom: '8px' }}>OTTIMIZZAZIONE</h4>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--color-gray-medium)', margin: 0 }}>
              Ottimizzazione iterativa del #PRM (Prompt) finché la musica non è perfetta
            </p>
          </div>
        </div>

        {/* Prompt Commissioning */}
        <div className="card" style={{ marginBottom: '40px', background: 'var(--color-gray-dark)', color: 'white' }}>
          <h3 style={{ fontFamily: 'var(--font-headings)', fontSize: '18px', marginBottom: '16px', color: 'var(--color-green)' }}>
            LOGICA DI INTEGRAZIONE N8N (PROMPT COMMISSIONING)
          </h3>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'rgba(255,255,255,0.7)', marginBottom: '12px' }}>
            Quando il manager preme &quot;Genera Workflow&quot;, Antigravity invia questo prompt a n8n:
          </p>
          <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: 'var(--radius-sm)', padding: '16px', fontFamily: 'monospace', fontSize: '13px', color: 'var(--color-green)', lineHeight: 1.6 }}>
            <p style={{ margin: '0 0 8px' }}>&quot;Crea un workflow n8n funzionale basato sulla seguente architettura taggata: [SCHEMA TAG DI MURAL].</p>
            <p style={{ margin: '0 0 8px' }}>- Usa nodi &apos;HTTP Request&apos; per i tag #TOL.</p>
            <p style={{ margin: '0 0 8px' }}>- Usa nodi &apos;AI Agent&apos; per i tag #AGT.</p>
            <p style={{ margin: '0 0 8px' }}>- Configura il &apos;System Prompt&apos; nel nodo AI usando il tag #PRM.</p>
            <p style={{ margin: 0 }}>Restituisci il JSON del workflow pronto per l&apos;importazione.&quot;</p>
          </div>
        </div>

        {/* Link to Workflow Generator */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <Link href="/workflow-generator">
            <button className="btn-primary" style={{ fontSize: '18px', padding: '16px 40px' }}>
              APRI IL WORKFLOW GENERATOR
            </button>
          </Link>
        </div>

        {/* Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px' }}>
          <Link href="/lab2" style={{ fontFamily: 'var(--font-headings)', color: 'var(--color-orange)', textDecoration: 'none' }}>
            ← FASE 2: LO SPARTITO
          </Link>
          <Link href="/lab4" style={{ fontFamily: 'var(--font-headings)', color: '#6366f1', textDecoration: 'none', fontWeight: 700 }}>
            FASE 4: HANDOVER →
          </Link>
        </div>
      </main>

      <footer className="footer">
        <BrandDots />
        <p style={{ margin: 0 }}>Progetto Atena • Fase 3: Implementazione</p>
      </footer>
    </div>
  );
}
