'use client';

import Link from 'next/link';

const BrandDots = () => (
  <div className="brand-dots" style={{ margin: '20px 0' }}>
    <span className="dot dot-pink"></span>
    <span className="dot dot-orange"></span>
    <span className="dot dot-green"></span>
  </div>
);

interface FaseCard {
  number: number;
  title: string;
  subtitle: string;
  description: string;
  sections: string[];
  color: string;
  href: string;
  icon: string;
}

const fasi: FaseCard[] = [
  {
    number: 1,
    title: "BUSINESS MINING",
    subtitle: "& Lo Schema del Semaforo",
    description: "Estrarre, semplificare e identificare dove \"staccare\" l'uomo dal lavoro di fango. Mining dei processi, Lean Trimming e classificazione Semaforo.",
    sections: ["Estrazione Processi", "Lean Trimming", "Switch Uomo/AI"],
    color: "var(--color-pink)",
    href: "/lab1",
    icon: "⛏️"
  },
  {
    number: 2,
    title: "LO SPARTITO",
    subtitle: "& Il Sistema dei Tag",
    description: "Disegnare l'architettura logica del processo snello pronta per la macchina. Tag universali e laboratorio Mural.",
    sections: ["Sistema Tag", "Laboratorio Mural", "Architettura Logica"],
    color: "var(--color-orange)",
    href: "/lab2",
    icon: "🎼"
  },
  {
    number: 3,
    title: "IMPLEMENTAZIONE",
    subtitle: "Antigravity & n8n",
    description: "Dalla teoria alla musica. Zero Code Execution con Google Antigravity e n8n per trasformare i Tag in workflow funzionanti.",
    sections: ["Google Antigravity", "Generazione JSON", "Test con Dati Reali"],
    color: "var(--color-green)",
    href: "/lab3",
    icon: "🚀"
  },
  {
    number: 4,
    title: "CAMBIO DI PARADIGMA",
    subtitle: "& Il Paper per l'IT",
    description: "Gestire il cambiamento e parlare la lingua del ferro. KPI, gestione resistenze e Technical Handover per l'IT.",
    sections: ["KPI & Benefici", "Gestione Resistenze", "Paper per l'IT"],
    color: "#6366f1",
    href: "/lab4",
    icon: "📋"
  }
];

export default function Home() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-white)' }}>
      {/* Hero Section */}
      <header style={{
        background: 'var(--color-gray-dark)',
        padding: '60px 20px',
        color: 'white',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏛️</div>
          <h1 style={{
            fontFamily: 'var(--font-headings)',
            fontSize: '56px',
            marginBottom: '16px',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            color: 'var(--color-white)'
          }}>
            PROGETTO ATENA
          </h1>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '20px',
            color: 'rgba(255,255,255,0.8)',
            maxWidth: '600px',
            margin: '0 auto 24px'
          }}>
            Diventa Architetto dei Tuoi Processi AI-Driven
          </p>
          <BrandDots />
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '14px',
            color: 'rgba(255,255,255,0.5)',
            marginTop: '8px'
          }}>
            4 Fasi • Lean-AI Methodology • Da Mining a Handover
          </p>
        </div>
      </header>

      {/* Vision Section */}
      <section style={{
        maxWidth: '900px',
        margin: '0 auto',
        padding: '40px 20px'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, rgba(248,159,90,0.1) 0%, rgba(239,111,108,0.1) 100%)',
          borderRadius: 'var(--radius-lg)',
          padding: '32px',
          border: '1px solid rgba(248,159,90,0.2)'
        }}>
          <h2 style={{
            fontFamily: 'var(--font-headings)',
            fontSize: '24px',
            marginBottom: '16px',
            color: 'var(--color-gray-dark)'
          }}>
            LA VISIONE
          </h2>
          <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
            <p style={{
              fontFamily: 'var(--font-body)',
              color: 'var(--color-gray-dark)',
              fontSize: '18px',
              lineHeight: '1.6',
              margin: 0
            }}>
              Formare manager capaci di coinvolgere le proprie squadre nella creazione di Processi AI-driven,
              gestendo la ricollocazione strategica delle persone liberate in totale armonia con le esigenze
              del IT facilitando la messa in produzione &quot;sicura&quot; e a norma di questi processi.
            </p>
          </div>
        </div>
      </section>

      {/* Fasi Grid */}
      <main style={{ maxWidth: '900px', margin: '0 auto', padding: '0 20px 60px' }}>
        <h2 style={{
          fontFamily: 'var(--font-headings)',
          fontSize: '32px',
          textAlign: 'center',
          marginBottom: '32px',
          color: 'var(--color-gray-dark)'
        }}>
          LE 4 FASI
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
          {fasi.map((fase) => (
            <Link href={fase.href} key={fase.number} style={{ textDecoration: 'none' }}>
              <div
                className="card"
                style={{
                  borderTop: `4px solid ${fase.color}`,
                  cursor: 'pointer',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  height: '100%'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div>
                    <span style={{
                      display: 'inline-block',
                      background: fase.color,
                      color: 'white',
                      padding: '4px 12px',
                      borderRadius: 'var(--radius-pill)',
                      fontSize: '12px',
                      fontFamily: 'var(--font-headings)',
                      fontWeight: 700,
                      marginBottom: '8px'
                    }}>
                      FASE {fase.number}
                    </span>
                    <h3 style={{
                      fontFamily: 'var(--font-headings)',
                      fontSize: '24px',
                      margin: 0,
                      color: 'var(--color-gray-dark)'
                    }}>
                      {fase.icon} {fase.title}
                    </h3>
                    <p style={{
                      fontFamily: 'var(--font-headings)',
                      fontSize: '14px',
                      color: fase.color,
                      margin: '4px 0 0'
                    }}>
                      {fase.subtitle}
                    </p>
                  </div>
                </div>

                <p style={{
                  fontFamily: 'var(--font-body)',
                  color: 'var(--color-gray-medium)',
                  marginBottom: '16px',
                  lineHeight: 1.6
                }}>
                  {fase.description}
                </p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {fase.sections.map((section, idx) => (
                    <span key={idx} style={{
                      fontSize: '12px',
                      fontFamily: 'var(--font-body)',
                      color: 'var(--color-gray-dark)',
                      background: 'var(--color-gray-light)',
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-sm)'
                    }}>
                      {section}
                    </span>
                  ))}
                </div>

                <div style={{
                  marginTop: '20px',
                  paddingTop: '16px',
                  borderTop: '1px solid var(--color-gray-border)',
                  display: 'flex',
                  justifyContent: 'flex-end'
                }}>
                  <span style={{
                    fontFamily: 'var(--font-headings)',
                    fontSize: '14px',
                    color: fase.color,
                    fontWeight: 600
                  }}>
                    ENTRA NELLA FASE →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Methodology */}
        <div style={{
          marginTop: '48px',
          textAlign: 'center',
          padding: '32px',
          background: 'var(--color-gray-light)',
          borderRadius: 'var(--radius-lg)'
        }}>
          <h3 style={{
            fontFamily: 'var(--font-headings)',
            fontSize: '20px',
            marginBottom: '16px'
          }}>
            METODOLOGIA META-HODOS
          </h3>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', marginBottom: '4px' }}>⛏️</div>
              <span style={{ fontFamily: 'var(--font-headings)', fontSize: '12px' }}>MINING</span>
            </div>
            <span style={{ color: 'var(--color-orange)', fontSize: '20px' }}>→</span>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', marginBottom: '4px' }}>🎼</div>
              <span style={{ fontFamily: 'var(--font-headings)', fontSize: '12px' }}>SPARTITO</span>
            </div>
            <span style={{ color: 'var(--color-orange)', fontSize: '20px' }}>→</span>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', marginBottom: '4px' }}>🚀</div>
              <span style={{ fontFamily: 'var(--font-headings)', fontSize: '12px' }}>ESECUZIONE</span>
            </div>
            <span style={{ color: 'var(--color-orange)', fontSize: '20px' }}>→</span>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', marginBottom: '4px' }}>📋</div>
              <span style={{ fontFamily: 'var(--font-headings)', fontSize: '12px' }}>HANDOVER</span>
            </div>
          </div>
          <p style={{
            fontFamily: 'var(--font-body)',
            color: 'var(--color-gray-medium)',
            marginTop: '16px',
            fontSize: '14px'
          }}>
            Non automatizzare processi inefficienti. Prima semplifica, poi automatizza.
          </p>
        </div>
      </main>

      <footer className="footer">
        <BrandDots />
        <p style={{ margin: 0 }}>Progetto Atena • AI Training Platform per Manager</p>
      </footer>
    </div>
  );
}
