'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useProcess } from '@/lib/processContext';
import { STANDARD_TEMPLATES } from '@/types/process';

export default function WelcomePage() {
  const router = useRouter();
  const { dispatch } = useProcess();

  const [scenario, setScenario] = useState<'standard' | 'text' | 'voice' | null>(null);
  const [textDescription, setTextDescription] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedText, setRecordedText] = useState('');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const handleStandardSelect = (templateId: string) => {
    const template = STANDARD_TEMPLATES[templateId as keyof typeof STANDARD_TEMPLATES];
    if (template) {
      dispatch({
        type: 'LOAD_TEMPLATE',
        payload: template,
      });
      router.push('/workflow-generator/edit-process');
    }
  };

  const handleTextSubmit = async () => {
    if (!textDescription.trim()) {
      alert('Descrivi il tuo processo');
      return;
    }

    // Invia al server per decomposizione
    try {
      const response = await fetch('/api/process/decompose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: textDescription,
          style: 'custom',
        }),
      });

      if (!response.ok) {
        throw new Error('Errore nella scomposizione');
      }

      const data = await response.json();

      // Carica le fasi nel context
      dispatch({
        type: 'LOAD_TEMPLATE',
        payload: {
          id: `custom_${Date.now()}`,
          name: 'Processo Custom',
          pattern: 'custom',
          phases: data.phases,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      });

      router.push('/workflow-generator/edit-process');
    } catch (error) {
      console.error('Errore:', error);
      alert('Errore nella decomposizione del processo');
    }
  };

  const handleVoiceStart = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        audioChunksRef.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await handleAudioTranscription(audioBlob);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Errore accesso microfono:', error);
      alert('Errore nel faccesso al microfono');
    }
  };

  const handleVoiceStop = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      mediaRecorderRef.current.stream
        .getTracks()
        .forEach((track) => track.stop());
    }
  };

  const handleAudioTranscription = async (audioBlob: Blob) => {
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob);

      const response = await fetch('/api/process/transcribe', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Errore trascrizione');
      }

      const data = await response.json();
      setRecordedText(data.text);
      setScenario('text'); // Switch a text dopo trascrizione
      setTextDescription(data.text);
    } catch (error) {
      console.error('Errore trascrizione:', error);
      alert('Errore nella trascrizione vocale');
    }
  };

  return (
    <div className="welcome-container">
      <div className="welcome-header">
        <h1 className="welcome-title">Crea il Tuo Workflow</h1>
        <p className="welcome-subtitle">
          Scegli un processo standard o descrivi il tuo
        </p>
      </div>

      <div className="brand-dots">
        <div className="dot dot-pink"></div>
        <div className="dot dot-orange"></div>
        <div className="dot dot-green"></div>
      </div>

      {!scenario ? (
        // Schermata principale con 3 scenari
        <div className="welcome-scenarios">
          {/* Scenario A: Standard Templates */}
          <div
            className="scenario-card"
            onClick={() => setScenario('standard')}
          >
            <div className="scenario-icon">📋</div>
            <h2 className="scenario-title">Processi Standard</h2>
            <p className="scenario-description">
              Scegli uno dei nostri 6 processi già pronti e personalizzabili
            </p>
            <p style={{ fontSize: '12px', color: '#999' }}>Tempo: ~30 secondi</p>
          </div>

          {/* Scenario B: Text Description */}
          <div className="scenario-card" onClick={() => setScenario('text')}>
            <div className="scenario-icon">✍️</div>
            <h2 className="scenario-title">Descrivi il Tuo Processo</h2>
            <p className="scenario-description">
              Scrivi come funziona il tuo processo in linguaggio naturale
            </p>
            <p style={{ fontSize: '12px', color: '#999' }}>Tempo: ~2-3 minuti</p>
          </div>

          {/* Scenario C: Voice Recording */}
          <div className="scenario-card" onClick={() => setScenario('voice')}>
            <div className="scenario-icon">🎤</div>
            <h2 className="scenario-title">Racconta a Voce</h2>
            <p className="scenario-description">
              Parla del tuo processo e la AI lo trascrverà
            </p>
            <p style={{ fontSize: '12px', color: '#999' }}>Tempo: ~2-3 minuti</p>
          </div>

          {/* Scenario A: Already loaded, but as placeholder */}
          <div className="scenario-card" style={{ opacity: 0.3, pointerEvents: 'none' }}>
            <div className="scenario-icon">🔄</div>
            <h2 className="scenario-title">Importa JSON</h2>
            <p className="scenario-description">
              Carica un file JSON di workflow esistente
            </p>
            <p style={{ fontSize: '12px', color: '#999' }}>Coming Soon</p>
          </div>
        </div>
      ) : scenario === 'standard' ? (
        // Scenario A: Standard Templates Selection
        <div className="card">
          <h2 style={{ marginBottom: '24px', fontSize: '28px', textTransform: 'uppercase' }}>
            Scegli un Processo Standard
          </h2>

          <div className="template-grid">
            {Object.entries(STANDARD_TEMPLATES).map(([key, template]) => (
              <button
                key={key}
                className={`template-btn ${selectedTemplate === key ? 'selected' : ''}`}
                onClick={() => setSelectedTemplate(key)}
              >
                {key}
                <br />
                <span style={{ fontSize: '11px', fontWeight: 400 }}>
                  {template.phases.length} fasi
                </span>
              </button>
            ))}
          </div>

          {selectedTemplate && STANDARD_TEMPLATES[selectedTemplate as keyof typeof STANDARD_TEMPLATES] && (
            <div style={{ marginTop: '24px', padding: '16px', background: '#F5F5F5', borderRadius: '8px' }}>
              <h3 style={{ marginBottom: '12px', fontSize: '16px', fontWeight: 600 }}>
                {STANDARD_TEMPLATES[selectedTemplate as keyof typeof STANDARD_TEMPLATES].name}
              </h3>
              <p style={{ fontSize: '14px', color: '#666', marginBottom: '12px' }}>
                Fasi:
              </p>
              <ul style={{ fontSize: '13px', marginLeft: '20px', color: '#555' }}>
                {STANDARD_TEMPLATES[selectedTemplate as keyof typeof STANDARD_TEMPLATES].phases.map((phase) => (
                  <li key={phase.id}>{phase.name}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="buttons-row">
            <button
              className="btn-secondary-large"
              onClick={() => setScenario(null)}
            >
              ← Indietro
            </button>
            <button
              className="btn-primary"
              disabled={!selectedTemplate}
              onClick={() => {
                if (selectedTemplate) {
                  handleStandardSelect(selectedTemplate);
                }
              }}
            >
              Continua
            </button>
          </div>
        </div>
      ) : scenario === 'text' ? (
        // Scenario B: Text Description
        <div className="card">
          <h2 style={{ marginBottom: '24px', fontSize: '28px', textTransform: 'uppercase' }}>
            Descrivi il Tuo Processo
          </h2>

          <div className="form-group">
            <label className="form-label">Come funziona il tuo processo?</label>
            <textarea
              className="form-textarea"
              placeholder="Es: Ricevo email da cliente con ordine, estraggo i dati con AI, verifico disponibilità in SAP, genero bolla PDF..."
              value={textDescription}
              onChange={(e) => setTextDescription(e.target.value)}
            />
          </div>

          <div style={{ fontSize: '13px', color: '#999', marginBottom: '24px' }}>
            💡 Descrivi i step principali del processo. La AI li scomporrà automaticamente
            in fasi
          </div>

          <div className="buttons-row">
            <button
              className="btn-secondary-large"
              onClick={() => setScenario(null)}
            >
              ← Indietro
            </button>
            <button
              className="btn-primary"
              disabled={!textDescription.trim()}
              onClick={handleTextSubmit}
            >
              Scomponi in Fasi
            </button>
          </div>
        </div>
      ) : scenario === 'voice' ? (
        // Scenario C: Voice Recording
        <div className="card">
          <h2 style={{ marginBottom: '24px', fontSize: '28px', textTransform: 'uppercase' }}>
            Racconta il Tuo Processo a Voce
          </h2>

          <div style={{ marginBottom: '24px' }}>
            <label className="form-label" style={{ marginBottom: '16px', display: 'block' }}>
              Registra la Tua Descrizione
            </label>

            <div className="voice-recorder">
              <button
                className={`voice-record-btn ${isRecording ? 'recording' : ''}`}
                onClick={isRecording ? handleVoiceStop : handleVoiceStart}
              >
                {isRecording ? '⏹️' : '🎤'}
              </button>
              <div className="voice-status">
                {isRecording
                  ? '🔴 Registrazione in corso... Parla!'
                  : recordedText
                    ? '✅ Trascritto con successo'
                    : '⏹️ Clicca per registrare'}
              </div>
            </div>
          </div>

          {recordedText && (
            <div className="form-group">
              <label className="form-label">Testo Trascritto</label>
              <textarea
                className="form-textarea"
                value={recordedText}
                onChange={(e) => setRecordedText(e.target.value)}
              />
              <p style={{ fontSize: '12px', color: '#999', marginTop: '8px' }}>
                Puoi modificare il testo trascritto prima di procedere
              </p>
            </div>
          )}

          <div className="buttons-row">
            <button
              className="btn-secondary-large"
              onClick={() => {
                setScenario(null);
                setRecordedText('');
              }}
            >
              ← Indietro
            </button>
            <button
              className="btn-primary"
              disabled={!recordedText.trim()}
              onClick={() => {
                setTextDescription(recordedText);
                setScenario('text');
              }}
            >
              Continua
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
