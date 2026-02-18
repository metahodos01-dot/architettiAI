'use client';

import Link from 'next/link';

const BrandDots = () => (
  <div className="brand-dots" style={{ margin: '20px 0' }}>
    <span className="dot dot-pink"></span>
    <span className="dot dot-orange"></span>
    <span className="dot dot-green"></span>
  </div>
);

const tags = [
  { tag: '#TRG', componente: 'Trigger', descrizione: "L'evento scatenante", esempio: 'Arrivo Bolla PDF' },
  { tag: '#AGT', componente: 'Agente AI', descrizione: 'Il ruolo logico', esempio: 'Specialista Logistica' },
  { tag: '#LLM', componente: 'Motore AI', descrizione: 'Il cervello scelto', esempio: 'GPT-4o, Claude 3.5' },
  { tag: '#PRM', componente: 'System Prompt', descrizione: 'Le regole monastiche e il tono di voce', esempio: '' },
  { tag: '#MEM', componente: 'Memory', descrizione: 'Il contesto', esempio: 'Storico prezzi 2025' },
  { tag: '#TOL', componente: 'Tools/API', descrizione: 'I bracci operativi', esempio: 'Connessione SAP, Excel' },
  { tag: '#OUT', componente: 'Output', descrizione: 'Il risultato finale', esempio: 'Riga caricata su ERP' },
];

export default function Fase2() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-white)' }}>
      {/* Header */}
      <header style={{ background: 'var(--color-gray-dark)', padding: '24px 20px', color: 'white' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <Link href="/" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontFamily: 'var(--font-body)', fontSize: '14px' }}>
            ← Torna alla Home
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '16px' }}>
            <span style={{ background: 'var(--color-orange)', color: 'white', padding: '8px 16px', borderRadius: 'var(--radius-pill)', fontFamily: 'var(--font-headings)', fontWeight: 700 }}>
              FASE 2
            </span>
            <h1 style={{ fontFamily: 'var(--font-headings)', fontSize: '42px', margin: 0 }}>
              🎼 LO SPARTITO
            </h1>
          </div>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '18px', color: 'rgba(255,255,255,0.8)', marginTop: '8px' }}>
            & Il Sistema dei Tag
          </p>
        </div>
      </header>

      <main style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 20px' }}>
        <BrandDots />

        {/* Obiettivo */}
        <div className="card" style={{ marginBottom: '32px', borderLeft: '4px solid var(--color-orange)' }}>
          <h2 style={{ fontFamily: 'var(--font-headings)', fontSize: '20px', marginBottom: '12px' }}>
            OBIETTIVO
          </h2>
          <p style={{ fontFamily: 'var(--font-body)', color: 'var(--color-gray-medium)', margin: 0 }}>
            Disegnare l&apos;architettura logica del processo snello pronta per la macchina.
          </p>
        </div>

        {/* 1. Sistema dei Tag */}
        <h2 style={{ fontFamily: 'var(--font-headings)', fontSize: '28px', marginBottom: '16px', color: 'var(--color-gray-dark)' }}>
          1. IL SISTEMA DEI TAG (LINGUAGGIO UNIVERSALE)
        </h2>
        <p style={{ fontFamily: 'var(--font-body)', color: 'var(--color-gray-medium)', marginBottom: '24px' }}>
          Ogni manager associa i seguenti tag ai processi estratti e semplificati nella Fase 1 per creare lo &quot;spartito&quot; su Mural:
        </p>

        {/* Tag Table */}
        <div className="card" style={{ marginBottom: '40px', padding: '0', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-body)' }}>
            <thead>
              <tr style={{ background: 'var(--color-gray-dark)', color: 'white' }}>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontFamily: 'var(--font-headings)', fontSize: '13px' }}>TAG</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontFamily: 'var(--font-headings)', fontSize: '13px' }}>COMPONENTE</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontFamily: 'var(--font-headings)', fontSize: '13px' }}>DESCRIZIONE</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontFamily: 'var(--font-headings)', fontSize: '13px' }}>ESEMPIO</th>
              </tr>
            </thead>
            <tbody>
              {tags.map((t, idx) => (
                <tr key={t.tag} style={{ borderBottom: '1px solid var(--color-gray-border)', background: idx % 2 === 0 ? 'white' : 'var(--color-gray-light)' }}>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{
                      background: 'var(--color-orange)', color: 'white', padding: '3px 10px',
                      borderRadius: 'var(--radius-sm)', fontFamily: 'monospace', fontSize: '13px', fontWeight: 700
                    }}>
                      {t.tag}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', fontWeight: 600, fontSize: '14px' }}>{t.componente}</td>
                  <td style={{ padding: '12px 16px', fontSize: '14px', color: 'var(--color-gray-medium)' }}>{t.descrizione}</td>
                  <td style={{ padding: '12px 16px', fontSize: '13px', color: 'var(--color-gray-medium)', fontStyle: 'italic' }}>{t.esempio || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 2. Laboratorio Mural */}
        <h2 style={{ fontFamily: 'var(--font-headings)', fontSize: '28px', marginBottom: '16px', color: 'var(--color-gray-dark)' }}>
          2. LABORATORIO MURAL
        </h2>
        <p style={{ fontFamily: 'var(--font-body)', color: 'var(--color-gray-medium)', marginBottom: '16px' }}>
          I manager creano un flusso visivo &quot;taggato&quot;. Esempio per Magazzino:
        </p>

        {/* Visual Flow Example */}
        <div className="card" style={{ marginBottom: '40px', background: 'var(--color-gray-light)', overflow: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', justifyContent: 'center', padding: '16px 0' }}>
            <span style={{ background: 'var(--color-pink)', color: 'white', padding: '8px 14px', borderRadius: 'var(--radius-sm)', fontFamily: 'monospace', fontSize: '13px', fontWeight: 700 }}>
              [WHSE]
            </span>
            <span style={{ color: 'var(--color-orange)', fontSize: '20px', fontWeight: 700 }}>→</span>
            <span style={{ background: 'var(--color-orange)', color: 'white', padding: '8px 14px', borderRadius: 'var(--radius-sm)', fontFamily: 'monospace', fontSize: '13px' }}>
              #TRG:Email
            </span>
            <span style={{ color: 'var(--color-orange)', fontSize: '20px', fontWeight: 700 }}>→</span>
            <span style={{ background: 'var(--color-orange)', color: 'white', padding: '8px 14px', borderRadius: 'var(--radius-sm)', fontFamily: 'monospace', fontSize: '13px' }}>
              #AGT:Data_Extractor
            </span>
            <span style={{ color: 'var(--color-orange)', fontSize: '20px', fontWeight: 700 }}>→</span>
            <span style={{ background: 'var(--color-orange)', color: 'white', padding: '8px 14px', borderRadius: 'var(--radius-sm)', fontFamily: 'monospace', fontSize: '13px' }}>
              #LLM:Claude
            </span>
            <span style={{ color: 'var(--color-orange)', fontSize: '20px', fontWeight: 700 }}>→</span>
            <span style={{ background: 'var(--color-orange)', color: 'white', padding: '8px 14px', borderRadius: 'var(--radius-sm)', fontFamily: 'monospace', fontSize: '13px' }}>
              #TOL:OCR_Scanner
            </span>
            <span style={{ color: 'var(--color-orange)', fontSize: '20px', fontWeight: 700 }}>→</span>
            <span style={{ background: 'var(--color-green)', color: 'white', padding: '8px 14px', borderRadius: 'var(--radius-sm)', fontFamily: 'monospace', fontSize: '13px' }}>
              #OUT:SAP_Entry
            </span>
          </div>
        </div>

        {/* Tip */}
        <div className="card" style={{ marginBottom: '40px', background: 'rgba(248,159,90,0.08)', border: '1px solid rgba(248,159,90,0.2)' }}>
          <h3 style={{ fontFamily: 'var(--font-headings)', fontSize: '16px', color: 'var(--color-orange)', marginBottom: '8px' }}>
            COME LEGGERE LO SPARTITO
          </h3>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--color-gray-medium)', margin: 0 }}>
            Ogni tag rappresenta un &quot;blocco&quot; dell&apos;architettura. Collegandoli in sequenza si ottiene lo spartito completo
            del processo, pronto per essere tradotto in codice nella Fase 3 (Antigravity + n8n).
          </p>
        </div>

        {/* Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px' }}>
          <Link href="/lab1" style={{ fontFamily: 'var(--font-headings)', color: 'var(--color-pink)', textDecoration: 'none' }}>
            ← FASE 1: MINING
          </Link>
          <Link href="/lab3" style={{ fontFamily: 'var(--font-headings)', color: 'var(--color-green)', textDecoration: 'none', fontWeight: 700 }}>
            FASE 3: IMPLEMENTAZIONE →
          </Link>
        </div>
      </main>

      <footer className="footer">
        <BrandDots />
        <p style={{ margin: 0 }}>Progetto Atena • Fase 2: Lo Spartito</p>
      </footer>
    </div>
  );
}
