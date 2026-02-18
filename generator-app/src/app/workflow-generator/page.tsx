'use client';

import Link from 'next/link';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

// Brand Dots Component
const BrandDots = () => (
    <div className="brand-dots" style={{ margin: '20px 0' }}>
        <span className="dot dot-pink"></span>
        <span className="dot dot-orange"></span>
        <span className="dot dot-green"></span>
    </div>
);

interface WorkflowNode {
    id: string;
    name: string;
    type: string;
    position: number[];
}

interface GenerateResult {
    success: boolean;
    detectedNodes: string[];
    explanation?: string;
    pattern?: string;
    recommendations?: string[];
    credentialsNeeded?: string[];
    nodeCount?: number;
    stickyNoteCount?: number;
    workflow: {
        name: string;
        nodes: WorkflowNode[];
        connections: Record<string, unknown>;
    };
}

// Title with Underline Component
const TitleWithLine = ({ children, color = 'orange' }: { children: React.ReactNode; color?: 'orange' | 'pink' | 'green' }) => (
    <h2 className="title-with-line">
        {children}
        <span className={`title-underline title-underline-${color}`}></span>
    </h2>
);

const WorkflowGeneratorContent = () => {
    const searchParams = useSearchParams();
    const [prompt, setPrompt] = useState('');

    useEffect(() => {
        const p = searchParams.get('prompt');
        if (p) {
            setPrompt(p);
        }
    }, [searchParams]);
    const [workflowName, setWorkflowName] = useState('My Workflow');
    const [result, setResult] = useState<GenerateResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const generateWorkflow = async () => {
        if (!prompt.trim()) return;

        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const res = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt, name: workflowName })
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Generation failed');
                return;
            }

            setResult(data);
        } catch (e: any) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    const downloadWorkflow = () => {
        if (!result?.workflow) return;

        const blob = new Blob([JSON.stringify(result.workflow, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${workflowName.replace(/\s+/g, '_')}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const copyToClipboard = () => {
        if (!result?.workflow) return;
        navigator.clipboard.writeText(JSON.stringify(result.workflow, null, 2));
    };

    return (
        <div style={{ minHeight: '100vh', background: 'var(--color-white)' }}>
            {/* Header */}
            <header style={{
                background: 'var(--color-gray-dark)',
                padding: '24px 20px',
                color: 'white'
            }}>
                <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                    <Link href="/" style={{
                        color: 'rgba(255,255,255,0.6)',
                        textDecoration: 'none',
                        fontFamily: 'var(--font-body)',
                        fontSize: '14px'
                    }}>
                        ← Torna alla Home
                    </Link>
                    <h1 style={{
                        fontFamily: 'var(--font-headings)',
                        fontSize: '48px',
                        marginTop: '16px',
                        marginBottom: '8px'
                    }}>
                        🔄 WORKFLOW GENERATOR
                    </h1>
                    <p style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '18px',
                        color: 'rgba(255,255,255,0.8)'
                    }}>
                        Modulo 3 • Genera workflow n8n da linguaggio naturale
                    </p>
                </div>
            </header>

            {/* Content */}
            <main style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 20px' }}>
                <BrandDots />

                {/* Input Section */}
                <div className="card" style={{ marginBottom: '32px' }}>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontFamily: 'var(--font-headings)',
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            fontSize: '14px'
                        }}>
                            Nome Workflow
                        </label>
                        <input
                            type="text"
                            value={workflowName}
                            onChange={(e) => setWorkflowName(e.target.value)}
                            className="form-input"
                            placeholder="My Awesome Workflow"
                        />
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '8px',
                            fontFamily: 'var(--font-headings)',
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            fontSize: '14px'
                        }}>
                            Descrivi cosa vuoi automatizzare
                        </label>
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            rows={4}
                            className="form-input"
                            style={{ resize: 'none' }}
                            placeholder="Es: Quando ricevo un webhook, controlla i dati con un IF, poi invia a Slack se il valore è alto, altrimenti salva su Google Sheets"
                        />
                    </div>

                    <button
                        onClick={generateWorkflow}
                        disabled={loading || !prompt.trim()}
                        className="btn-primary"
                        style={{ width: '100%' }}
                    >
                        {loading ? '⏳ Generazione in corso...' : '⚡ Genera Workflow'}
                    </button>
                </div>

                {/* Error */}
                {error && (
                    <div style={{
                        background: 'rgba(239, 111, 108, 0.1)',
                        border: '1px solid var(--color-pink)',
                        borderRadius: 'var(--radius-md)',
                        padding: '16px',
                        marginBottom: '24px'
                    }}>
                        <p style={{ color: 'var(--color-pink)', margin: 0 }}>❌ {error}</p>
                    </div>
                )}

                {/* Results */}
                {result && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

                        {/* Pattern & Explanation */}
                        <div className="card" style={{ background: 'rgba(140, 198, 63, 0.05)', border: '1px solid rgba(140, 198, 63, 0.2)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                                <h4 style={{ fontFamily: 'var(--font-headings)', color: 'var(--color-green)', margin: 0 }}>
                                    📊 ARCHITETTURA DEL WORKFLOW
                                </h4>
                                {result.pattern && (
                                    <span style={{
                                        background: 'var(--color-green)', color: 'white', padding: '2px 10px',
                                        borderRadius: 'var(--radius-pill)', fontFamily: 'monospace', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase'
                                    }}>
                                        {result.pattern}
                                    </span>
                                )}
                                {result.nodeCount && (
                                    <span style={{
                                        background: 'var(--color-gray-light)', color: 'var(--color-gray-medium)', padding: '2px 10px',
                                        borderRadius: 'var(--radius-pill)', fontFamily: 'monospace', fontSize: '11px'
                                    }}>
                                        {result.nodeCount} nodi
                                    </span>
                                )}
                            </div>
                            {result.explanation && (
                                <p style={{ fontFamily: 'var(--font-body)', color: 'var(--color-gray-dark)', margin: 0 }}>
                                    {result.explanation}
                                </p>
                            )}
                        </div>

                        {/* Recommendations & Credentials */}
                        {((result.recommendations && result.recommendations.length > 0) || (result.credentialsNeeded && result.credentialsNeeded.length > 0)) && (
                            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                                {result.recommendations && result.recommendations.length > 0 && (
                                    <div className="card" style={{ flex: '1 1 300px' }}>
                                        <h4 style={{ fontFamily: 'var(--font-headings)', color: 'var(--color-orange)', marginBottom: '12px', fontSize: '14px' }}>
                                            💡 RACCOMANDAZIONI
                                        </h4>
                                        <ul style={{ fontFamily: 'var(--font-body)', color: 'var(--color-gray-medium)', paddingLeft: '18px', margin: 0, fontSize: '14px', lineHeight: 1.6 }}>
                                            {result.recommendations.map((rec, i) => (
                                                <li key={i}>{rec}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                {result.credentialsNeeded && result.credentialsNeeded.length > 0 && (
                                    <div className="card" style={{ flex: '1 1 200px' }}>
                                        <h4 style={{ fontFamily: 'var(--font-headings)', color: 'var(--color-pink)', marginBottom: '12px', fontSize: '14px' }}>
                                            🔑 CREDENZIALI NECESSARIE
                                        </h4>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                            {result.credentialsNeeded.map((cred, i) => (
                                                <span key={i} style={{
                                                    background: 'rgba(239, 111, 108, 0.1)', color: 'var(--color-pink)',
                                                    padding: '4px 10px', borderRadius: 'var(--radius-pill)',
                                                    fontFamily: 'monospace', fontSize: '12px', border: '1px solid rgba(239, 111, 108, 0.2)'
                                                }}>
                                                    {cred}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Detected Nodes */}
                        <div className="card">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                                <span style={{ color: 'var(--color-green)', fontSize: '24px' }}>✓</span>
                                <TitleWithLine color="green">Nodi Rilevati ({result.detectedNodes.length})</TitleWithLine>
                            </div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                {result.detectedNodes.map((node, i) => {
                                    const nodeName = node.split('.').pop();
                                    return (
                                        <span key={i} className="node-tag" title={node}>
                                            {nodeName}
                                        </span>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Sticky Notes (Process Documentation) */}
                        {(() => {
                            const stickyNotes = result.workflow.nodes.filter(n => n.type === 'n8n-nodes-base.stickyNote');
                            if (stickyNotes.length === 0) return null;
                            return (
                                <div className="card" style={{ background: 'rgba(248, 159, 90, 0.05)', border: '1px solid rgba(248, 159, 90, 0.2)' }}>
                                    <h4 style={{ fontFamily: 'var(--font-headings)', color: 'var(--color-orange)', marginBottom: '12px', fontSize: '14px' }}>
                                        📌 DOCUMENTAZIONE PROCESSO
                                    </h4>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                        {stickyNotes.map((note, i) => (
                                            <div key={i} style={{
                                                background: 'rgba(248, 159, 90, 0.08)',
                                                border: '1px solid rgba(248, 159, 90, 0.15)',
                                                borderRadius: 'var(--radius-md)',
                                                padding: '10px 14px',
                                                flex: '1 1 200px',
                                                fontSize: '13px',
                                                fontFamily: 'var(--font-body)',
                                                color: 'var(--color-gray-dark)',
                                                whiteSpace: 'pre-line',
                                                lineHeight: 1.5
                                            }}>
                                                {String((note as unknown as Record<string, unknown>).name || '')}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })()}

                        {/* Workflow Preview (active nodes only) */}
                        <div className="card">
                            <TitleWithLine color="orange">Anteprima Workflow</TitleWithLine>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                overflowX: 'auto',
                                paddingTop: '16px',
                                paddingBottom: '16px'
                            }}>
                                {result.workflow.nodes
                                    .filter(node => node.type !== 'n8n-nodes-base.stickyNote')
                                    .map((node, i, arr) => (
                                    <div key={node.id} style={{ display: 'flex', alignItems: 'center' }}>
                                        <div className="workflow-node">
                                            <div className="workflow-node-name">{node.name}</div>
                                            <div className="workflow-node-type">{node.type.split('.').pop()}</div>
                                        </div>
                                        {i < arr.length - 1 && (
                                            <span className="node-arrow" style={{ margin: '0 8px' }}>›</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* JSON Output */}
                        <div className="card">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
                                <TitleWithLine color="pink">Workflow JSON</TitleWithLine>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button onClick={copyToClipboard} style={{
                                        background: 'var(--color-gray-light)',
                                        border: '1px solid var(--color-gray-border)',
                                        borderRadius: 'var(--radius-pill)',
                                        padding: '8px 16px',
                                        fontFamily: 'var(--font-headings)',
                                        fontSize: '12px',
                                        fontWeight: 600,
                                        textTransform: 'uppercase',
                                        cursor: 'pointer'
                                    }}>
                                        📋 Copia
                                    </button>
                                    <button onClick={downloadWorkflow} style={{
                                        background: 'var(--color-green)',
                                        border: 'none',
                                        borderRadius: 'var(--radius-pill)',
                                        padding: '8px 16px',
                                        fontFamily: 'var(--font-headings)',
                                        fontSize: '12px',
                                        fontWeight: 600,
                                        textTransform: 'uppercase',
                                        color: 'white',
                                        cursor: 'pointer'
                                    }}>
                                        ⬇ Download
                                    </button>
                                </div>
                            </div>
                            <div className="json-output">
                                <pre>{JSON.stringify(result.workflow, null, 2)}</pre>
                            </div>
                        </div>

                        {/* Instructions */}
                        <div style={{
                            background: 'rgba(248, 159, 90, 0.1)',
                            border: '1px solid rgba(248, 159, 90, 0.3)',
                            borderRadius: 'var(--radius-lg)',
                            padding: '20px'
                        }}>
                            <h4 style={{ fontFamily: 'var(--font-headings)', color: 'var(--color-orange)', marginBottom: '12px' }}>
                                📥 Come importare in n8n
                            </h4>
                            <ol style={{ fontFamily: 'var(--font-body)', color: 'var(--color-gray-medium)', paddingLeft: '20px', margin: 0 }}>
                                <li>Scarica il file JSON o copia negli appunti</li>
                                <li>Apri n8n e crea un nuovo workflow</li>
                                <li>Clicca "⋮" → Import from File oppure incolla con Ctrl+V</li>
                                <li>Configura credenziali e parametri</li>
                                <li>Salva e attiva!</li>
                            </ol>
                        </div>
                    </div>
                )}

                {/* Examples when no result */}
                {!result && !error && (
                    <div>
                        <h3 style={{ fontFamily: 'var(--font-headings)', marginBottom: '24px', textAlign: 'center' }}>
                            SCENARI PRONTI ALL&apos;USO
                        </h3>

                        {/* Area Tags */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center', marginBottom: '24px' }}>
                            {['WHSE', 'SALES', 'MKTG', 'SERV', 'PROD', 'STRAT'].map(tag => (
                                <span key={tag} style={{
                                    background: 'var(--color-gray-light)', padding: '4px 12px', borderRadius: 'var(--radius-pill)',
                                    fontFamily: 'monospace', fontSize: '12px', color: 'var(--color-gray-medium)'
                                }}>{tag}</span>
                            ))}
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {[
                                {
                                    tag: 'WHSE',
                                    title: 'Caricamento Automatico Bolle',
                                    prompt: '[WHSE] Quando arriva una email con allegato PDF (bolla di consegna), estrai automaticamente i dati (fornitore, codici articolo, quantità, data) usando OCR, valida i dati confrontandoli con l\'anagrafica prodotti su Google Sheets, e se tutto ok carica la riga su SAP via HTTP Request. Se ci sono discrepanze, invia alert su Slack al responsabile magazzino con il dettaglio degli errori.'
                                },
                                {
                                    tag: 'SALES',
                                    title: 'Follow-up Meeting Automatico',
                                    prompt: '[SALES] Dopo ogni meeting registrato su Google Calendar con tag "prospect", genera automaticamente un riassunto del meeting usando AI (Claude), crea un follow-up email personalizzato con i punti chiave discussi, schedulalo per l\'invio 24h dopo via Gmail, e aggiorna il CRM (HubSpot) con lo stato della trattativa e i prossimi passi concordati.'
                                },
                                {
                                    tag: 'MKTG',
                                    title: 'Sentiment Analysis Social',
                                    prompt: '[MKTG] Ogni mattina alle 8:00, raccogli tutti i nuovi post e commenti che menzionano il brand su Twitter e Facebook (ultimi 24h), analizza il sentiment con AI (positivo/negativo/neutro), classifica per tema (prodotto, servizio, prezzo, qualità), genera un report sintetico con grafici e trend, e invialo su Slack nel canale #marketing. Se il sentiment negativo supera il 30%, invia alert urgente al Marketing Manager via email.'
                                },
                                {
                                    tag: 'SERV',
                                    title: 'Chatbot Intelligente II Gen.',
                                    prompt: '[SERV] Configura un webhook che riceve domande dal chatbot del sito web. L\'AI Agent (Claude) risponde consultando la knowledge base aziendale (documenti su Google Drive), lo storico ticket (Notion), e le FAQ. Se la confidence è sotto il 70%, escala a un operatore umano via Slack con il contesto completo. Logga ogni interazione su Google Sheets per analisi qualità.'
                                },
                                {
                                    tag: 'PROD',
                                    title: 'Ottimizzazione Distinta Base',
                                    prompt: '[PROD] Quando viene aggiornata una distinta base (BOM) su Google Sheets, confronta automaticamente i prezzi dei componenti con i fornitori alternativi via HTTP API, calcola il risparmio potenziale per ogni alternativa, verifica la disponibilità a magazzino, e genera un report di ottimizzazione costi. Se il risparmio supera il 5%, notifica il responsabile acquisti su Slack con la proposta dettagliata.'
                                },
                                {
                                    tag: 'STRAT',
                                    title: 'SWOT Dinamica Settimanale',
                                    prompt: '[STRAT] Ogni venerdì alle 17:00, raccogli i KPI della settimana da Google Sheets (vendite, reclami, lead, costi produzione), analizza con AI i trend rispetto alle settimane precedenti, identifica automaticamente Strengths, Weaknesses, Opportunities e Threats emergenti, genera un documento SWOT aggiornato su Google Docs, e invia il link al C-Level team su Slack con un executive summary di 3 righe.'
                                },
                            ].map((ex, i) => (
                                <button
                                    key={i}
                                    onClick={() => {
                                        setPrompt(ex.prompt);
                                        setWorkflowName(ex.title);
                                    }}
                                    className="example-btn"
                                    style={{ textAlign: 'left', padding: '16px 20px' }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                                        <span style={{
                                            background: 'var(--color-orange)', color: 'white', padding: '2px 8px',
                                            borderRadius: 'var(--radius-sm)', fontFamily: 'monospace', fontSize: '11px', fontWeight: 700
                                        }}>
                                            {ex.tag}
                                        </span>
                                        <strong style={{ fontFamily: 'var(--font-headings)', fontSize: '15px', color: 'var(--color-gray-dark)' }}>
                                            {ex.title}
                                        </strong>
                                    </div>
                                    <span style={{ fontSize: '13px', color: 'var(--color-gray-medium)', lineHeight: 1.4, display: 'block' }}>
                                        {ex.prompt.substring(0, 120)}...
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </main>

            {/* Footer */}
            <footer className="footer">
                <BrandDots />
                <p style={{ margin: 0 }}>AI Training Platform • Modulo 3: Workflow Generator</p>
            </footer>
        </div>
    );

}

export default function WorkflowGenerator() {
    return (
        <Suspense fallback={<div>Loading generator...</div>}>
            <WorkflowGeneratorContent />
        </Suspense>
    );
}
