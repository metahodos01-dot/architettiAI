// Tag types per il sistema Meta-Hodos
export type TagType = 'TRG' | 'AGT' | 'LLM' | 'PRM' | 'MEM' | 'TOL' | 'OUT';

export interface Tag {
  type: TagType;
  value: string;
}

export interface Phase {
  id: string;
  name: string;
  description: string;
  tags: Tag[];
  order: number;
}

export interface ProcessFlow {
  id: string;
  name: string;
  pattern: 'standard' | 'custom';
  templateId?: string;
  phases: Phase[];
  createdAt: string;
  updatedAt: string;
}

export type SemaforoStatus = 'green' | 'yellow' | 'red';

export interface SemaforoResult {
  status: SemaforoStatus;
  phaseCount: number;
  maxSafe: number;
  message: string;
}

export type ProcessAction =
  | { type: 'ADD_PHASE'; payload: Phase }
  | { type: 'UPDATE_PHASE'; payload: { id: string; updates: Partial<Phase> } }
  | { type: 'DELETE_PHASE'; payload: string }
  | { type: 'REORDER_PHASES'; payload: Phase[] }
  | { type: 'ASSIGN_TAG'; payload: { phaseId: string; tag: Tag } }
  | { type: 'REMOVE_TAG'; payload: { phaseId: string; tagIndex: number } }
  | { type: 'SET_PROCESS_NAME'; payload: string }
  | { type: 'LOAD_TEMPLATE'; payload: ProcessFlow }
  | { type: 'SET_PATTERN'; payload: 'standard' | 'custom' }
  | { type: 'RESET' }
  | { type: 'SET_KPI'; payload: { phaseId: string; kpi: ProcessKPI } }
  | { type: 'RESET_KPIS' };

export interface ProcessState {
  phases: Phase[];
  processName: string;
  pattern: 'standard' | 'custom';
  templateId?: string;
  kpis: Record<string, ProcessKPI>;
}

export interface ProcessContextType {
  state: ProcessState;
  dispatch: React.Dispatch<ProcessAction>;
  getSemaforoStatus: () => SemaforoStatus;
  getPhaseCount: () => number;
  getKPIResults: () => KPIResults | null;
}

// KPI Types per Fase 4
export interface ProcessKPI {
  phaseId: string;
  timeManualMinutes: number;    // Tempo manuale stimato (minuti)
  timeAutoMinutes: number;      // Tempo automatizzato stimato (minuti)
  errorRateManual: number;      // Tasso errore manuale (0-100%)
  errorRateAuto: number;        // Tasso errore automatizzato (0-100%)
  costManualEur: number;        // Costo manuale (EUR)
  costAutoEur: number;          // Costo automatizzato (EUR)
  volumePerDay: number;         // Volume operazioni/giorno
}

export interface KPIResults {
  totalTimeSavedMinutes: number;
  totalTimeSavedPercent: number;
  totalErrorReduction: number;
  totalCostSavedEur: number;
  totalCostSavedPercent: number;
  roiPercent: number;
  paybackDays: number;
  phaseResults: PhaseKPIResult[];
}

export interface PhaseKPIResult {
  phaseId: string;
  phaseName: string;
  timeSavedMinutes: number;
  timeSavedPercent: number;
  errorReduction: number;
  costSavedEur: number;
  efficiencyScore: number; // 0-100
}

// Standard templates definitions
export const STANDARD_TEMPLATES: Record<string, ProcessFlow> = {
  WHSE: {
    id: 'whse',
    name: 'Warehouse Automation',
    pattern: 'standard',
    templateId: 'whse',
    phases: [
      {
        id: '1',
        name: 'Ricezione Email da Cliente',
        description: 'Email arriva a orders@warehouse.it con richiesta ordine',
        tags: [{ type: 'TRG', value: 'EMAIL' }],
        order: 1,
      },
      {
        id: '2',
        name: 'Estrazione Dati Ordine',
        description: 'AI estrae SKU, quantità, indirizzo di consegna dalla email',
        tags: [
          { type: 'AGT', value: 'DATA_EXTRACTION' },
          { type: 'LLM', value: 'CLAUDE' },
        ],
        order: 2,
      },
      {
        id: '3',
        name: 'Query Disponibilità SAP',
        description: 'Verifica stock in tempo reale via API SAP',
        tags: [{ type: 'TOL', value: 'SAP_API' }],
        order: 3,
      },
      {
        id: '4',
        name: 'Creazione Bolla Automatica',
        description: 'Genera PDF bolla di carico e invia al magazzino',
        tags: [{ type: 'OUT', value: 'PDF' }],
        order: 4,
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  SALES: {
    id: 'sales',
    name: 'Sales Follow-up',
    pattern: 'standard',
    templateId: 'sales',
    phases: [
      {
        id: '1',
        name: 'Trigger Opportunity Chiusa',
        description: 'Attiva quando opp. CRM cambia a "Closed Won"',
        tags: [{ type: 'TRG', value: 'CRM_EVENT' }],
        order: 1,
      },
      {
        id: '2',
        name: 'Pianificazione Follow-up',
        description: 'AI suggerisce timing e contenuto basato su storia cliente',
        tags: [
          { type: 'AGT', value: 'SCHEDULER' },
          { type: 'LLM', value: 'CLAUDE' },
        ],
        order: 2,
      },
      {
        id: '3',
        name: 'Invio Email Personalizzata',
        description: 'Email con dati cliente via Gmail con merge fields',
        tags: [{ type: 'OUT', value: 'EMAIL' }],
        order: 3,
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  MKTG: {
    id: 'mktg',
    name: 'Marketing Analytics',
    pattern: 'standard',
    templateId: 'mktg',
    phases: [
      {
        id: '1',
        name: 'Schedule Esecuzione Settimanale',
        description: 'Trigger ogni lunedì mattina alle 6:00 AM',
        tags: [{ type: 'TRG', value: 'SCHEDULE' }],
        order: 1,
      },
      {
        id: '2',
        name: 'Raccolta Dati Social',
        description: 'Fetch Twitter, LinkedIn, Instagram mentions',
        tags: [{ type: 'TOL', value: 'SOCIAL_API' }],
        order: 2,
      },
      {
        id: '3',
        name: 'Sentiment Analysis',
        description: 'AI analizza sentiment e categorizza mentions',
        tags: [
          { type: 'AGT', value: 'SENTIMENT_ANALYZER' },
          { type: 'LLM', value: 'CLAUDE' },
        ],
        order: 3,
      },
      {
        id: '4',
        name: 'Report su Google Sheets',
        description: 'Salva risultati in Google Sheets con grafici',
        tags: [{ type: 'OUT', value: 'GOOGLE_SHEETS' }],
        order: 4,
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  SERV: {
    id: 'serv',
    name: 'Service Chatbot',
    pattern: 'standard',
    templateId: 'serv',
    phases: [
      {
        id: '1',
        name: 'Webhook da Slack',
        description: 'Riceve messaggi da canale #support via webhook',
        tags: [{ type: 'TRG', value: 'WEBHOOK' }],
        order: 1,
      },
      {
        id: '2',
        name: 'AI Customer Service Agent',
        description: 'Agente AI legge query, consulta KB, prepara risposta',
        tags: [
          { type: 'AGT', value: 'SUPPORT_AGENT' },
          { type: 'LLM', value: 'CLAUDE' },
          { type: 'MEM', value: 'KNOWLEDGE_BASE' },
        ],
        order: 2,
      },
      {
        id: '3',
        name: 'Risposta su Slack',
        description: 'Invia risposta al canale Slack originale',
        tags: [{ type: 'OUT', value: 'SLACK' }],
        order: 3,
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  PROD: {
    id: 'prod',
    name: 'Production Optimization',
    pattern: 'standard',
    templateId: 'prod',
    phases: [
      {
        id: '1',
        name: 'Estrazione Distinta Base da ERP',
        description: 'Carica componenti e quantità dal sistema ERP',
        tags: [{ type: 'TRG', value: 'ERP_EXPORT' }],
        order: 1,
      },
      {
        id: '2',
        name: 'Ottimizzazione IA',
        description: 'AI analizza distinta per supplier migration, consolidamento',
        tags: [
          { type: 'AGT', value: 'OPTIMIZER' },
          { type: 'LLM', value: 'CLAUDE' },
        ],
        order: 2,
      },
      {
        id: '3',
        name: 'Generazione Documento',
        description: 'Crea PDF con suggerimenti di ottimizzazione',
        tags: [{ type: 'OUT', value: 'PDF' }],
        order: 3,
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  STRAT: {
    id: 'strat',
    name: 'Strategic SWOT',
    pattern: 'standard',
    templateId: 'strat',
    phases: [
      {
        id: '1',
        name: 'Trigger Settimanale',
        description: 'Esegue ogni giovedì per preparare briefing settimanale',
        tags: [{ type: 'TRG', value: 'SCHEDULE' }],
        order: 1,
      },
      {
        id: '2',
        name: 'Raccolta Dati di Mercato',
        description: 'Fetch news, competitor data, trend da API esterne',
        tags: [{ type: 'TOL', value: 'MARKET_DATA_API' }],
        order: 2,
      },
      {
        id: '3',
        name: 'Generazione SWOT',
        description: 'AI crea matrice SWOT dinamica basata su dati',
        tags: [
          { type: 'AGT', value: 'SWOT_GENERATOR' },
          { type: 'LLM', value: 'CLAUDE' },
          { type: 'MEM', value: 'HISTORICAL_DATA' },
        ],
        order: 3,
      },
      {
        id: '4',
        name: 'Email Report Dirigenti',
        description: 'Invia report SWOT ai C-suite via Gmail',
        tags: [{ type: 'OUT', value: 'EMAIL' }],
        order: 4,
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
};
