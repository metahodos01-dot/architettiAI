'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useProcess } from '@/lib/processContext';
import { Phase } from '@/types/process';

function ResultContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { state } = useProcess();

  const [loading, setLoading] = useState(false);
  const [workflow, setWorkflow] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Estrai fasi dai parametri URL
  const phasesParam = searchParams?.get('phases');
  const processName = searchParams?.get('processName') || state.processName || 'Workflow';

  const phases: Phase[] = phasesParam
    ? JSON.parse(decodeURIComponent(phasesParam))
    : state.phases;

  const handleGenerateWorkflow = async () => {
    if (phases.length === 0) {
      setError('Nessuna fase definita');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phases,
          name: processName,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Errore generazione workflow');
      }

      const data = await response.json();
      setWorkflow(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore sconosciuto');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyJSON = () => {
    if (workflow?.workflow) {
      const json = JSON.stringify(workflow.workflow, null, 2);
      navigator.clipboard.writeText(json).then(() => {
        alert('Workflow JSON copiato negli appunti!');
      });
    }
  };

  const handleDownloadJSON = () => {
    if (workflow?.workflow) {
      const json = JSON.stringify(workflow.workflow, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${processName.replace(/\s+/g, '_')}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
      {/* Header */}
      <div style={{ marginBottom: '40px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '36px', marginBottom: '8px', textTransform: 'uppercase' }}>
          {processName}
        </h1>
        <p style={{ color: '#999', fontSize: '16px' }}>
          {phases.length} fasi • Pronto per n8n
        </p>
      </div>

      {/* Fasi Summary */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <h2 style={{ marginBottom: '16px', fontSize: '20px', textTransform: 'uppercase' }}>
          Fasi del Processo
        </h2>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
          {phases.map((phase, index) => (
            <div
              key={phase.id}
              style={{
                background: '#F5F5F5',
                padding: '12px 16px',
                borderRadius: '8px',
                fontSize: '13px',
                flex: '1',
                minWidth: '150px',
              }}
            >
              <div style={{ fontWeight: 600, marginBottom: '4px' }}>
                {phase.order}. {phase.name}
              </div>
              <div style={{ color: '#999', fontSize: '12px' }}>
                {phase.tags.length > 0
                  ? phase.tags.map((t) => `#${t.type}`).join(' ')
                  : 'Nessun tag'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Generate Button */}
      {!workflow && (
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <button
            className="btn-primary"
            onClick={handleGenerateWorkflow}
            disabled={loading}
            style={{ fontSize: '18px', padding: '20px 60px' }}
          >
            {loading ? (
              <>
                <span className="spinner" style={{ marginRight: '10px' }}></span>
                Generando...
              </>
            ) : (
              '🚀 Genera Workflow n8n'
            )}
          </button>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div
          style={{
            background: '#FFF5F5',
            border: '1px solid #FFCCCC',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '24px',
            color: '#C00',
          }}
        >
          <strong>❌ Errore:</strong> {error}
        </div>
      )}

      {/* Workflow Result */}
      {workflow && (
        <div>
          {/* Metadata */}
          <div className="card" style={{ marginBottom: '24px' }}>
            <h2 style={{ marginBottom: '16px', fontSize: '20px', textTransform: 'uppercase' }}>
              📊 Analisi del Workflow
            </h2>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px',
              }}
            >
              <div style={{ background: '#F5F5F5', padding: '16px', borderRadius: '8px' }}>
                <div style={{ fontSize: '12px', color: '#999', marginBottom: '4px' }}>
                  PATTERN
                </div>
                <div style={{ fontSize: '18px', fontWeight: 600, textTransform: 'uppercase' }}>
                  {workflow.pattern}
                </div>
              </div>

              <div style={{ background: '#F5F5F5', padding: '16px', borderRadius: '8px' }}>
                <div style={{ fontSize: '12px', color: '#999', marginBottom: '4px' }}>
                  NODI ATTIVI
                </div>
                <div style={{ fontSize: '18px', fontWeight: 600 }}>
                  {workflow.nodeCount}
                </div>
              </div>

              <div style={{ background: '#F5F5F5', padding: '16px', borderRadius: '8px' }}>
                <div style={{ fontSize: '12px', color: '#999', marginBottom: '4px' }}>
                  DOCUMENTAZIONE
                </div>
                <div style={{ fontSize: '18px', fontWeight: 600 }}>
                  {workflow.stickyNoteCount} Note
                </div>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          {workflow.recommendations && workflow.recommendations.length > 0 && (
            <div className="card" style={{ marginBottom: '24px' }}>
              <h2 style={{ marginBottom: '16px', fontSize: '20px', textTransform: 'uppercase' }}>
                💡 Raccomandazioni
              </h2>
              <ul style={{ fontSize: '14px', color: '#555', lineHeight: 1.8, marginLeft: '20px' }}>
                {workflow.recommendations.map((rec: string, i: number) => (
                  <li key={i}>{rec}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Credentials Needed */}
          {workflow.credentialsNeeded && workflow.credentialsNeeded.length > 0 && (
            <div className="card" style={{ marginBottom: '24px' }}>
              <h2 style={{ marginBottom: '16px', fontSize: '20px', textTransform: 'uppercase' }}>
                🔑 Credenziali Richieste
              </h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {workflow.credentialsNeeded.map((cred: string, i: number) => (
                  <span
                    key={i}
                    style={{
                      background: '#FFE5CC',
                      color: '#C65911',
                      padding: '6px 12px',
                      borderRadius: '20px',
                      fontSize: '13px',
                      fontWeight: 600,
                    }}
                  >
                    {cred}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* JSON Output */}
          <div className="card" style={{ marginBottom: '24px' }}>
            <h2 style={{ marginBottom: '16px', fontSize: '20px', textTransform: 'uppercase' }}>
              📝 JSON Workflow
            </h2>

            <div className="json-output">
              <pre>{JSON.stringify(workflow.workflow, null, 2)}</pre>
            </div>

            <div style={{ marginTop: '16px', display: 'flex', gap: '12px' }}>
              <button className="btn-primary" onClick={handleCopyJSON}>
                📋 Copia JSON
              </button>
              <button className="btn-secondary-large" onClick={handleDownloadJSON}>
                ⬇️ Scarica JSON
              </button>
            </div>
          </div>

          {/* Import Instructions */}
          <div className="card" style={{ marginBottom: '40px', background: '#FFFBF0', border: '1px solid #FFE5CC' }}>
            <h2 style={{ marginBottom: '16px', fontSize: '20px', textTransform: 'uppercase' }}>
              📤 Come Importare in n8n
            </h2>

            <ol style={{ fontSize: '14px', color: '#555', lineHeight: 2, marginLeft: '20px' }}>
              <li>Accedi a <strong>https://ata-modena.app.n8n.cloud</strong></li>
              <li>Clicca <strong>Import</strong> in alto a destra</li>
              <li>Incolla il JSON copiato o carica il file scaricato</li>
              <li>Configura le credenziali necessarie (vedi sezione sopra)</li>
              <li>Salva e attiva il workflow</li>
            </ol>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <div className="buttons-row">
        <button
          className="btn-secondary-large"
          onClick={() => router.push('/workflow-generator/edit-process')}
        >
          ← Modifica Fasi
        </button>
        <button
          className="btn-secondary-large"
          onClick={() => router.push('/workflow-generator/welcome')}
        >
          ← Nuovo Processo
        </button>
      </div>
    </div>
  );
}

export default function ResultPage() {
  return (
    <Suspense fallback={<div>Caricamento...</div>}>
      <ResultContent />
    </Suspense>
  );
}
