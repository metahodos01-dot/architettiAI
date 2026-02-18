'use client';

import { useState, useMemo } from 'react';
import { useProcess } from '@/lib/processContext';
import { getDefaultKPI, getKPISuggestions, generateKPIPDF } from '@/lib/kpiUtils';
import { ProcessKPI } from '@/types/process';

interface KPIFieldProps {
  label: string;
  value: number;
  unit: string;
  onChange: (val: number) => void;
  min?: number;
  max?: number;
  step?: number;
}

function KPIField({ label, value, unit, onChange, min = 0, max = 9999, step = 1 }: KPIFieldProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
      <label style={{ fontSize: '12px', color: '#666', flex: 1 }}>{label}</label>
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Math.max(min, Math.min(max, Number(e.target.value))))}
          min={min}
          max={max}
          step={step}
          style={{
            width: '70px',
            padding: '4px 6px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '13px',
            textAlign: 'right',
            background: '#fafafa',
          }}
        />
        <span style={{ fontSize: '11px', color: '#999', width: '30px' }}>{unit}</span>
      </div>
    </div>
  );
}

function EfficiencyBar({ score }: { score: number }) {
  const color = score >= 70 ? '#4CAF50' : score >= 40 ? '#FFC107' : '#F44336';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <div style={{
        flex: 1,
        height: '8px',
        background: '#eee',
        borderRadius: '4px',
        overflow: 'hidden',
      }}>
        <div style={{
          width: `${score}%`,
          height: '100%',
          background: color,
          borderRadius: '4px',
          transition: 'width 0.3s ease',
        }} />
      </div>
      <span style={{ fontSize: '12px', fontWeight: 600, color, minWidth: '35px' }}>{score}%</span>
    </div>
  );
}

export default function KPISidebar() {
  const { state, dispatch, getKPIResults } = useProcess();
  const [expandedPhase, setExpandedPhase] = useState<string | null>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const results = getKPIResults();
  const suggestions = useMemo(() => results ? getKPISuggestions(results) : [], [results]);

  const handleSetKPI = (phaseId: string, updates: Partial<ProcessKPI>) => {
    const phase = state.phases.find((p) => p.id === phaseId);
    if (!phase) return;

    const existing = state.kpis[phaseId] || getDefaultKPI(phase);
    dispatch({
      type: 'SET_KPI',
      payload: {
        phaseId,
        kpi: { ...existing, ...updates },
      },
    });
  };

  const handleInitDefaults = () => {
    for (const phase of state.phases) {
      if (!state.kpis[phase.id]) {
        dispatch({
          type: 'SET_KPI',
          payload: {
            phaseId: phase.id,
            kpi: getDefaultKPI(phase),
          },
        });
      }
    }
  };

  const handleDownloadPDF = async () => {
    if (!results) return;
    setIsGeneratingPDF(true);
    try {
      const blob = await generateKPIPDF(
        state.processName,
        state.phases,
        state.kpis,
        results
      );
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `KPI_${state.processName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Errore generazione PDF:', err);
      alert('Errore nella generazione del PDF');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const kpiCount = Object.keys(state.kpis).length;
  const phaseCount = state.phases.length;

  if (phaseCount === 0) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
        <p style={{ fontSize: '14px' }}>Aggiungi almeno una fase per visualizzare i KPI</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Header KPI */}
      <div style={{
        background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
        borderRadius: '12px',
        padding: '20px',
        color: 'white',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700 }}>Dashboard KPI</h3>
          <span style={{
            fontSize: '11px',
            background: 'rgba(255,255,255,0.15)',
            padding: '3px 8px',
            borderRadius: '10px',
          }}>
            {kpiCount}/{phaseCount} fasi
          </span>
        </div>

        {results ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <div style={{ fontSize: '24px', fontWeight: 700, color: '#4CAF50' }}>
                {results.totalTimeSavedPercent}%
              </div>
              <div style={{ fontSize: '11px', opacity: 0.7 }}>Tempo risparmiato</div>
            </div>
            <div>
              <div style={{ fontSize: '24px', fontWeight: 700, color: '#FFC107' }}>
                {results.totalCostSavedEur}
              </div>
              <div style={{ fontSize: '11px', opacity: 0.7 }}>EUR/giorno</div>
            </div>
            <div>
              <div style={{ fontSize: '24px', fontWeight: 700, color: '#2196F3' }}>
                {results.roiPercent}%
              </div>
              <div style={{ fontSize: '11px', opacity: 0.7 }}>ROI</div>
            </div>
            <div>
              <div style={{ fontSize: '24px', fontWeight: 700, color: '#FF5722' }}>
                {results.paybackDays}g
              </div>
              <div style={{ fontSize: '11px', opacity: 0.7 }}>Payback</div>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '10px 0' }}>
            <p style={{ fontSize: '13px', opacity: 0.7, margin: '0 0 10px 0' }}>
              Nessun KPI configurato
            </p>
            <button
              onClick={handleInitDefaults}
              style={{
                background: 'rgba(255,255,255,0.2)',
                border: '1px solid rgba(255,255,255,0.3)',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '13px',
              }}
            >
              Genera stime automatiche
            </button>
          </div>
        )}
      </div>

      {/* Fasi con KPI */}
      {state.phases.map((phase) => {
        const kpi = state.kpis[phase.id];
        const isExpanded = expandedPhase === phase.id;
        const phaseResult = results?.phaseResults.find((r) => r.phaseId === phase.id);

        return (
          <div
            key={phase.id}
            style={{
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              overflow: 'hidden',
              background: 'white',
            }}
          >
            {/* Phase header */}
            <div
              onClick={() => setExpandedPhase(isExpanded ? null : phase.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                cursor: 'pointer',
                background: isExpanded ? '#f8f9fa' : 'white',
                transition: 'background 0.2s',
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>
                  {phase.order}. {phase.name}
                </div>
                {phaseResult && (
                  <EfficiencyBar score={phaseResult.efficiencyScore} />
                )}
              </div>
              <div style={{
                fontSize: '18px',
                transform: isExpanded ? 'rotate(180deg)' : 'rotate(0)',
                transition: 'transform 0.2s',
                marginLeft: '8px',
              }}>
                {kpi ? (isExpanded ? '▲' : '▼') : '●'}
              </div>
            </div>

            {/* Expanded KPI form */}
            {isExpanded && (
              <div style={{ padding: '12px 16px', borderTop: '1px solid #eee' }}>
                {!kpi && (
                  <button
                    onClick={() => {
                      const defaults = getDefaultKPI(phase);
                      dispatch({
                        type: 'SET_KPI',
                        payload: { phaseId: phase.id, kpi: defaults },
                      });
                    }}
                    style={{
                      width: '100%',
                      padding: '8px',
                      background: '#f0f7ff',
                      border: '1px dashed #4A90E2',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      color: '#4A90E2',
                      fontSize: '13px',
                      marginBottom: '8px',
                    }}
                  >
                    + Inizializza KPI con stime
                  </button>
                )}

                {kpi && (
                  <>
                    <div style={{ marginBottom: '12px' }}>
                      <div style={{ fontSize: '11px', fontWeight: 700, color: '#999', textTransform: 'uppercase', marginBottom: '8px' }}>
                        Tempo (minuti)
                      </div>
                      <KPIField
                        label="Manuale"
                        value={kpi.timeManualMinutes}
                        unit="min"
                        step={0.5}
                        onChange={(v) => handleSetKPI(phase.id, { timeManualMinutes: v })}
                      />
                      <KPIField
                        label="Automatizzato"
                        value={kpi.timeAutoMinutes}
                        unit="min"
                        step={0.1}
                        onChange={(v) => handleSetKPI(phase.id, { timeAutoMinutes: v })}
                      />
                    </div>

                    <div style={{ marginBottom: '12px' }}>
                      <div style={{ fontSize: '11px', fontWeight: 700, color: '#999', textTransform: 'uppercase', marginBottom: '8px' }}>
                        Tasso Errore (%)
                      </div>
                      <KPIField
                        label="Manuale"
                        value={kpi.errorRateManual}
                        unit="%"
                        max={100}
                        step={0.5}
                        onChange={(v) => handleSetKPI(phase.id, { errorRateManual: v })}
                      />
                      <KPIField
                        label="Automatizzato"
                        value={kpi.errorRateAuto}
                        unit="%"
                        max={100}
                        step={0.1}
                        onChange={(v) => handleSetKPI(phase.id, { errorRateAuto: v })}
                      />
                    </div>

                    <div style={{ marginBottom: '12px' }}>
                      <div style={{ fontSize: '11px', fontWeight: 700, color: '#999', textTransform: 'uppercase', marginBottom: '8px' }}>
                        Costi (EUR)
                      </div>
                      <KPIField
                        label="Manuale"
                        value={kpi.costManualEur}
                        unit="EUR"
                        step={0.5}
                        onChange={(v) => handleSetKPI(phase.id, { costManualEur: v })}
                      />
                      <KPIField
                        label="Automatizzato"
                        value={kpi.costAutoEur}
                        unit="EUR"
                        step={0.1}
                        onChange={(v) => handleSetKPI(phase.id, { costAutoEur: v })}
                      />
                    </div>

                    <div>
                      <div style={{ fontSize: '11px', fontWeight: 700, color: '#999', textTransform: 'uppercase', marginBottom: '8px' }}>
                        Volume
                      </div>
                      <KPIField
                        label="Operazioni/giorno"
                        value={kpi.volumePerDay}
                        unit="/g"
                        min={1}
                        onChange={(v) => handleSetKPI(phase.id, { volumePerDay: v })}
                      />
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        );
      })}

      {/* Suggerimenti */}
      {suggestions.length > 0 && (
        <div style={{
          background: '#FFF8E1',
          border: '1px solid #FFE082',
          borderRadius: '8px',
          padding: '12px 16px',
        }}>
          <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>
            Suggerimenti
          </div>
          {suggestions.map((s, i) => (
            <div key={i} style={{ fontSize: '12px', color: '#555', marginBottom: '4px', lineHeight: 1.5 }}>
              {s}
            </div>
          ))}
        </div>
      )}

      {/* Download PDF */}
      {results && (
        <button
          onClick={handleDownloadPDF}
          disabled={isGeneratingPDF}
          style={{
            width: '100%',
            padding: '12px',
            background: isGeneratingPDF ? '#ccc' : '#1a1a2e',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: isGeneratingPDF ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            fontWeight: 600,
          }}
        >
          {isGeneratingPDF ? 'Generazione in corso...' : 'Scarica Report PDF'}
        </button>
      )}
    </div>
  );
}
