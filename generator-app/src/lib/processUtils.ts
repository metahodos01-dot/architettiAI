import { Phase, ProcessFlow, SemaforoStatus, SemaforoResult, Tag, TagType } from '@/types/process';

/**
 * Calcola lo stato del Semaforo Meta-Hodos
 * 🟢 Green: 1-5 fasi
 * 🟡 Yellow: 6-7 fasi
 * 🔴 Red: 8+ fasi
 */
export function calculateSemaforoStatus(phaseCount: number): SemaforoResult {
  if (phaseCount <= 5) {
    return {
      status: 'green',
      phaseCount,
      maxSafe: 5,
      message: '🟢 PISTA LIBERA - Workflow semplice e veloce',
    };
  } else if (phaseCount <= 7) {
    return {
      status: 'yellow',
      phaseCount,
      maxSafe: 7,
      message: '🟡 ZONA GIALLA - Complessità media, valuta semplificazione',
    };
  } else {
    return {
      status: 'red',
      phaseCount,
      maxSafe: 7,
      message: '🔴 FUORI GIOCO - Troppo complesso, rischio fallimento',
    };
  }
}

/**
 * Genera un ID univoco per una fase
 */
export function generatePhaseId(): string {
  return `phase_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Crea una nuova fase con valori di default
 */
export function createPhase(
  name: string,
  description: string = '',
  tags: Tag[] = [],
  order: number = 1
): Phase {
  return {
    id: generatePhaseId(),
    name,
    description,
    tags,
    order,
  };
}

/**
 * Rinumerazione automatica delle fasi dopo modifica
 */
export function renumberPhases(phases: Phase[]): Phase[] {
  return phases.map((phase, index) => ({
    ...phase,
    order: index + 1,
  }));
}

/**
 * Aggiunge una fase al processo
 */
export function addPhase(phases: Phase[], phase: Phase): Phase[] {
  const newPhase = {
    ...phase,
    order: phases.length + 1,
  };
  return [...phases, newPhase];
}

/**
 * Aggiorna una fase
 */
export function updatePhase(
  phases: Phase[],
  phaseId: string,
  updates: Partial<Phase>
): Phase[] {
  return phases.map((phase) =>
    phase.id === phaseId ? { ...phase, ...updates } : phase
  );
}

/**
 * Elimina una fase
 */
export function deletePhase(phases: Phase[], phaseId: string): Phase[] {
  const filtered = phases.filter((phase) => phase.id !== phaseId);
  return renumberPhases(filtered);
}

/**
 * Riordina le fasi (drag & drop)
 */
export function reorderPhases(
  phases: Phase[],
  fromIndex: number,
  toIndex: number
): Phase[] {
  const newPhases = [...phases];
  const [removed] = newPhases.splice(fromIndex, 1);
  newPhases.splice(toIndex, 0, removed);
  return renumberPhases(newPhases);
}

/**
 * Assegna un tag a una fase
 */
export function assignTag(phases: Phase[], phaseId: string, tag: Tag): Phase[] {
  return phases.map((phase) => {
    if (phase.id === phaseId) {
      // Evita duplicati dello stesso tipo di tag
      const hasTag = phase.tags.some((t) => t.type === tag.type);
      if (hasTag) {
        return phase;
      }
      return { ...phase, tags: [...phase.tags, tag] };
    }
    return phase;
  });
}

/**
 * Rimuove un tag da una fase
 */
export function removeTag(
  phases: Phase[],
  phaseId: string,
  tagIndex: number
): Phase[] {
  return phases.map((phase) => {
    if (phase.id === phaseId) {
      return {
        ...phase,
        tags: phase.tags.filter((_, index) => index !== tagIndex),
      };
    }
    return phase;
  });
}

/**
 * Suggerimenti per semplificare il processo
 */
export function getSimplifySuggestions(phases: Phase[]): string[] {
  const suggestions: string[] = [];

  // Controlla se ci sono troppi trigger
  const triggerCount = phases.filter((p) =>
    p.tags.some((t) => t.type === 'TRG')
  ).length;
  if (triggerCount > 1) {
    suggestions.push(
      '💡 Considera di consolidare più trigger in uno singolo webhook'
    );
  }

  // Controlla se ci sono troppi tool/API
  const toolCount = phases.filter((p) =>
    p.tags.some((t) => t.type === 'TOL')
  ).length;
  if (toolCount > 2) {
    suggestions.push(
      '💡 Valuta di combinare più API call in un unico HTTP request'
    );
  }

  // Controlla se ci sono prompt ripetuti
  const prmCount = phases.filter((p) =>
    p.tags.some((t) => t.type === 'PRM')
  ).length;
  if (prmCount > 1) {
    suggestions.push(
      '💡 Consolida multiple istruzioni AI in un unico system prompt con variabili'
    );
  }

  // Controlla se il processo è lineare
  if (phases.length > 5) {
    suggestions.push(
      "❓ Quali sono i 3 step ESSENZIALI? Il resto potrebbe essere eliminato?"
    );
  }

  return suggestions;
}

/**
 * Valida la complessità del processo
 */
export function validateProcessComplexity(
  phases: Phase[]
): { valid: boolean; warnings: string[] } {
  const warnings: string[] = [];
  const status = calculateSemaforoStatus(phases.length);

  if (status.status === 'yellow') {
    warnings.push(
      `⚠️ Processo in ZONA GIALLA (${phases.length} fasi). Valuta semplificazione.`
    );
  } else if (status.status === 'red') {
    warnings.push(
      `🔴 Processo FUORI GIOCO (${phases.length} fasi)! Troppo complesso. Semplifica prima di procedere.`
    );
    return { valid: false, warnings };
  }

  return { valid: true, warnings };
}

/**
 * Serializza il processo per storage/trasporto
 */
export function serializeProcess(flow: ProcessFlow): string {
  return JSON.stringify(flow, null, 2);
}

/**
 * Deserializza il processo da storage/trasporto
 */
export function deserializeProcess(json: string): ProcessFlow {
  return JSON.parse(json);
}

/**
 * Tag color mapping per UI
 */
export const TAG_COLORS: Record<TagType, string> = {
  TRG: '#F89F5A', // orange
  AGT: '#4A90E2', // blue
  LLM: '#B26FFF', // purple
  PRM: '#FFD700', // gold
  MEM: '#9B59B6', // darker purple
  TOL: '#F1C40F', // yellow
  OUT: '#8CC63F', // green
};

/**
 * Tag descriptions per tooltip
 */
export const TAG_DESCRIPTIONS: Record<TagType, string> = {
  TRG: 'Trigger - Come si avvia il workflow (Email, Webhook, Schedule, Evento)',
  AGT: 'Agente AI - Quale AI fa decisioni/elaborazioni in questa fase',
  LLM: 'Motore AI - Quale modello IA viene usato (Claude, GPT, Gemini)',
  PRM: 'System Prompt - Istruzioni specifiche per l\'AI',
  MEM: 'Memory/Contesto - Dati persistenti e storici per l\'AI',
  TOL: 'Tools/API - Integrazioni esterne (SAP, Slack, Gmail, etc.)',
  OUT: 'Output - Risultato finale (Email, PDF, Database, Slack, etc.)',
};

/**
 * Emojis per icon visualizzazione
 */
export const TAG_EMOJIS: Record<TagType, string> = {
  TRG: '🟠',
  AGT: '🔵',
  LLM: '🟣',
  PRM: '⭐',
  MEM: '💾',
  TOL: '🟡',
  OUT: '🟢',
};
