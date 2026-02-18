'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useProcess } from '@/lib/processContext';
import {
  calculateSemaforoStatus,
  createPhase,
  reorderPhases,
  getSimplifySuggestions,
  TAG_EMOJIS,
  TAG_DESCRIPTIONS,
} from '@/lib/processUtils';
import { Phase, Tag, TagType } from '@/types/process';
import KPISidebar from '@/components/KPISidebar';

type ActiveTab = 'process' | 'kpi';

const TAG_TYPES: TagType[] = ['TRG', 'AGT', 'LLM', 'PRM', 'MEM', 'TOL', 'OUT'];

export default function EditProcessPage() {
  const router = useRouter();
  const { state, dispatch, getSemaforoStatus, getPhaseCount } = useProcess();

  const [draggedPhaseId, setDraggedPhaseId] = useState<string | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [editingPhaseId, setEditingPhaseId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSimplifyGuide, setShowSimplifyGuide] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>('process');

  // Modal form state
  const [formName, setFormName] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formTags, setFormTags] = useState<Tag[]>([]);

  const phaseCount = getPhaseCount();
  const semaforoStatus = calculateSemaforoStatus(phaseCount);
  const suggestions = getSimplifySuggestions(state.phases);

  const handleDragStart = (phaseId: string) => {
    setDraggedPhaseId(phaseId);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    setDragOverIndex(null);

    if (!draggedPhaseId) return;

    const fromIndex = state.phases.findIndex((p) => p.id === draggedPhaseId);
    if (fromIndex === -1) return;

    if (fromIndex !== targetIndex) {
      const newPhases = reorderPhases(state.phases, fromIndex, targetIndex);
      dispatch({ type: 'REORDER_PHASES', payload: newPhases });
    }

    setDraggedPhaseId(null);
  };

  const handleEditPhase = (phase: Phase) => {
    setEditingPhaseId(phase.id);
    setFormName(phase.name);
    setFormDescription(phase.description);
    setFormTags(phase.tags);
    setShowAddModal(true);
  };

  const handleSavePhase = () => {
    if (!formName.trim()) {
      alert('Inserisci il nome della fase');
      return;
    }

    if (editingPhaseId) {
      // Update existing
      dispatch({
        type: 'UPDATE_PHASE',
        payload: {
          id: editingPhaseId,
          updates: {
            name: formName,
            description: formDescription,
            tags: formTags,
          },
        },
      });
    } else {
      // Add new
      const newPhase = createPhase(formName, formDescription, formTags, phaseCount + 1);
      dispatch({ type: 'ADD_PHASE', payload: newPhase });
    }

    handleCloseModal();
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditingPhaseId(null);
    setFormName('');
    setFormDescription('');
    setFormTags([]);
  };

  const handleToggleTag = (tagType: TagType) => {
    const existingTagIndex = formTags.findIndex((t) => t.type === tagType);

    if (existingTagIndex > -1) {
      setFormTags(formTags.filter((_, i) => i !== existingTagIndex));
    } else {
      setFormTags([...formTags, { type: tagType, value: '' }]);
    }
  };

  const handleDeletePhase = (phaseId: string) => {
    if (confirm('Elimina questa fase?')) {
      dispatch({ type: 'DELETE_PHASE', payload: phaseId });
    }
  };

  const handleMovePhase = (phaseId: string, direction: 'up' | 'down') => {
    const index = state.phases.findIndex((p) => p.id === phaseId);
    if (index === -1) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= state.phases.length) return;

    const newPhases = reorderPhases(state.phases, index, targetIndex);
    dispatch({ type: 'REORDER_PHASES', payload: newPhases });
  };

  const handleGenerateWorkflow = async () => {
    if (state.phases.length === 0) {
      alert('Aggiungi almeno una fase');
      return;
    }

    // Valida complessità
    if (semaforoStatus.status === 'red') {
      const confirmContinue = confirm(
        `⚠️ Il processo è FUORI GIOCO (${phaseCount} fasi)!\n\nContinuare comunque?`
      );
      if (!confirmContinue) return;
    }

    // Redirect a result page con phases
    const phasesJson = encodeURIComponent(JSON.stringify(state.phases));
    router.push(
      `/workflow-generator/result?phases=${phasesJson}&processName=${encodeURIComponent(
        state.processName
      )}`
    );
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '32px', marginBottom: '8px', textTransform: 'uppercase' }}>
          {state.processName}
        </h1>
        <p style={{ color: '#999', fontSize: '14px' }}>
          {state.pattern === 'standard' ? '📋 Processo Standard' : '✍️ Processo Custom'}
        </p>
      </div>

      {/* Tab Switcher */}
      <div style={{
        display: 'flex',
        gap: '0',
        marginBottom: '24px',
        borderBottom: '2px solid #e0e0e0',
      }}>
        <button
          onClick={() => setActiveTab('process')}
          style={{
            padding: '12px 24px',
            fontSize: '14px',
            fontWeight: activeTab === 'process' ? 700 : 400,
            color: activeTab === 'process' ? '#1a1a2e' : '#999',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'process' ? '2px solid #1a1a2e' : '2px solid transparent',
            cursor: 'pointer',
            marginBottom: '-2px',
            transition: 'all 0.2s',
          }}
        >
          Processo
        </button>
        <button
          onClick={() => setActiveTab('kpi')}
          style={{
            padding: '12px 24px',
            fontSize: '14px',
            fontWeight: activeTab === 'kpi' ? 700 : 400,
            color: activeTab === 'kpi' ? '#1a1a2e' : '#999',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'kpi' ? '2px solid #1a1a2e' : '2px solid transparent',
            cursor: 'pointer',
            marginBottom: '-2px',
            transition: 'all 0.2s',
          }}
        >
          KPI Dashboard
        </button>
      </div>

      {/* KPI Tab */}
      {activeTab === 'kpi' && (
        <div style={{ maxWidth: '600px' }}>
          <KPISidebar />

          {/* Bottom Actions for KPI tab */}
          <div className="buttons-row" style={{ marginTop: '40px' }}>
            <button
              className="btn-secondary-large"
              onClick={() => setActiveTab('process')}
            >
              ← Torna al Processo
            </button>
            <button
              className="btn-primary"
              onClick={handleGenerateWorkflow}
            >
              Genera Workflow n8n →
            </button>
          </div>
        </div>
      )}

      {/* Process Tab */}
      {activeTab === 'process' && <>

      {/* Semaforo */}
      <div className="semaforo-container">
        <div className="semaforo-lights">
          {[...Array(7)].map((_, i) => (
            <div
              key={i}
              className={`semaforo-light ${
                i < phaseCount
                  ? semaforoStatus.status === 'green'
                    ? 'semaforo-green'
                    : semaforoStatus.status === 'yellow'
                      ? 'semaforo-yellow'
                      : 'semaforo-red'
                  : ''
              } ${i < phaseCount ? 'semaforo-light-active' : ''}`}
            />
          ))}
        </div>

        <div className="semaforo-info">
          <div className="semaforo-status">
            {semaforoStatus.message}
          </div>
          <div className="semaforo-message">
            {phaseCount} di {semaforoStatus.maxSafe} fasi
          </div>
        </div>

        <button
          className="btn-secondary-large"
          onClick={() => setShowSimplifyGuide(!showSimplifyGuide)}
          style={{ whiteSpace: 'nowrap' }}
        >
          {showSimplifyGuide ? '✓ Chiudi' : '? Semplifica'}
        </button>
      </div>

      {/* Guida Semplificazione */}
      {showSimplifyGuide && (
        <div style={{
          background: '#FFFBF0',
          border: '1px solid #FFE5CC',
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '24px',
        }}>
          <h3 style={{ marginBottom: '12px', fontSize: '16px', fontWeight: 600 }}>
            💡 Suggerimenti per Semplificare
          </h3>
          {suggestions.length > 0 ? (
            <ul style={{ fontSize: '14px', marginLeft: '20px', color: '#555', lineHeight: 1.8 }}>
              {suggestions.map((suggestion, i) => (
                <li key={i}>{suggestion}</li>
              ))}
            </ul>
          ) : (
            <p style={{ fontSize: '14px', color: '#999' }}>
              ✅ Processo ben strutturato! Nessun suggerimento.
            </p>
          )}
        </div>
      )}

      {/* Phase List */}
      <div className="phase-list">
        {state.phases.map((phase, index) => (
          <div
            key={phase.id}
            className={`phase-item ${dragOverIndex === index ? 'drag-over' : ''}`}
            draggable
            onDragStart={() => handleDragStart(phase.id)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDrop={(e) => handleDrop(e, index)}
            onDragLeave={() => setDragOverIndex(null)}
          >
            <div className="phase-drag-handle">↔️</div>

            <div className="phase-order">{phase.order}</div>

            <div className="phase-content">
              <div className="phase-name">{phase.name}</div>
              <div className="phase-description">{phase.description}</div>
              <div className="phase-tags">
                {phase.tags.map((tag, i) => (
                  <div
                    key={i}
                    className={`phase-tag-badge ${tag.type.toLowerCase()}`}
                    title={TAG_DESCRIPTIONS[tag.type]}
                  >
                    {TAG_EMOJIS[tag.type]} {tag.type}
                  </div>
                ))}
              </div>
            </div>

            <div className="phase-actions">
              <button
                className="btn-icon"
                onClick={() => handleEditPhase(phase)}
              >
                ✏️ Edit
              </button>
              <button
                className="btn-icon"
                onClick={() => handleMovePhase(phase.id, 'up')}
                disabled={index === 0}
                style={{ opacity: index === 0 ? 0.5 : 1 }}
              >
                ↑
              </button>
              <button
                className="btn-icon"
                onClick={() => handleMovePhase(phase.id, 'down')}
                disabled={index === state.phases.length - 1}
                style={{ opacity: index === state.phases.length - 1 ? 0.5 : 1 }}
              >
                ↓
              </button>
              <button
                className="btn-icon delete"
                onClick={() => handleDeletePhase(phase.id)}
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Phase Button */}
      <button
        className="btn-add-phase"
        onClick={() => {
          setEditingPhaseId(null);
          setFormName('');
          setFormDescription('');
          setFormTags([]);
          setShowAddModal(true);
        }}
      >
        + Aggiungi Fase
      </button>

      {/* Bottom Actions */}
      <div className="buttons-row" style={{ marginTop: '40px' }}>
        <button
          className="btn-secondary-large"
          onClick={() => router.push('/workflow-generator/welcome')}
        >
          ← Indietro
        </button>
        <button
          className="btn-primary"
          onClick={handleGenerateWorkflow}
        >
          Genera Workflow n8n →
        </button>
      </div>

      </>}

      {/* Modal - Add/Edit Phase */}
      {showAddModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="modal-header">
              {editingPhaseId ? 'Modifica Fase' : 'Nuova Fase'}
            </h2>

            <div className="form-group">
              <label className="form-label">Nome Fase</label>
              <input
                type="text"
                className="form-input"
                placeholder="Es: Ricezione Email"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Descrizione</label>
              <textarea
                className="form-textarea"
                placeholder="Descrivi cosa fa questa fase..."
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Assegna Tag (Seleziona)</label>
              <div className="tag-selector">
                {TAG_TYPES.map((tagType) => (
                  <button
                    key={tagType}
                    className={`tag-selector-item ${
                      formTags.some((t) => t.type === tagType) ? 'selected' : ''
                    }`}
                    onClick={() => handleToggleTag(tagType)}
                    title={TAG_DESCRIPTIONS[tagType]}
                  >
                    {TAG_EMOJIS[tagType]} {tagType}
                  </button>
                ))}
              </div>
            </div>

            <div className="modal-actions">
              <button className="btn-secondary" onClick={handleCloseModal}>
                Annulla
              </button>
              <button className="btn-primary" onClick={handleSavePhase}>
                Salva
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
