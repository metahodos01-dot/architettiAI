'use client';

import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import {
  ProcessState,
  ProcessAction,
  ProcessContextType,
  ProcessFlow,
  KPIResults,
} from '@/types/process';
import {
  calculateSemaforoStatus,
  addPhase as addPhaseUtil,
  updatePhase as updatePhaseUtil,
  deletePhase as deletePhaseUtil,
  reorderPhases as reorderPhasesUtil,
  assignTag as assignTagUtil,
  removeTag as removeTagUtil,
  generatePhaseId,
} from './processUtils';
import { calculateKPIResults } from './kpiUtils';

const ProcessContext = createContext<ProcessContextType | undefined>(undefined);

const initialState: ProcessState = {
  phases: [],
  processName: 'Nuovo Processo',
  pattern: 'custom',
  templateId: undefined,
  kpis: {},
};

function processReducer(state: ProcessState, action: ProcessAction): ProcessState {
  switch (action.type) {
    case 'ADD_PHASE':
      return {
        ...state,
        phases: addPhaseUtil(state.phases, action.payload),
      };

    case 'UPDATE_PHASE':
      return {
        ...state,
        phases: updatePhaseUtil(
          state.phases,
          action.payload.id,
          action.payload.updates
        ),
      };

    case 'DELETE_PHASE':
      return {
        ...state,
        phases: deletePhaseUtil(state.phases, action.payload),
      };

    case 'REORDER_PHASES':
      return {
        ...state,
        phases: action.payload,
      };

    case 'ASSIGN_TAG':
      return {
        ...state,
        phases: assignTagUtil(
          state.phases,
          action.payload.phaseId,
          action.payload.tag
        ),
      };

    case 'REMOVE_TAG':
      return {
        ...state,
        phases: removeTagUtil(
          state.phases,
          action.payload.phaseId,
          action.payload.tagIndex
        ),
      };

    case 'SET_PROCESS_NAME':
      return {
        ...state,
        processName: action.payload,
      };

    case 'LOAD_TEMPLATE':
      return {
        phases: action.payload.phases,
        processName: action.payload.name,
        pattern: action.payload.pattern,
        templateId: action.payload.templateId,
        kpis: {},
      };

    case 'SET_PATTERN':
      return {
        ...state,
        pattern: action.payload,
      };

    case 'SET_KPI':
      return {
        ...state,
        kpis: {
          ...state.kpis,
          [action.payload.phaseId]: action.payload.kpi,
        },
      };

    case 'RESET_KPIS':
      return {
        ...state,
        kpis: {},
      };

    case 'RESET':
      return initialState;

    default:
      return state;
  }
}

interface ProcessProviderProps {
  children: ReactNode;
}

export function ProcessProvider({ children }: ProcessProviderProps) {
  const [state, dispatch] = useReducer(processReducer, initialState);

  const getSemaforoStatus = () => {
    return calculateSemaforoStatus(state.phases.length).status;
  };

  const getPhaseCount = () => {
    return state.phases.length;
  };

  const getKPIResults = (): KPIResults | null => {
    const kpiEntries = Object.keys(state.kpis);
    if (kpiEntries.length === 0) return null;
    return calculateKPIResults(state.phases, state.kpis);
  };

  const value: ProcessContextType = {
    state,
    dispatch,
    getSemaforoStatus,
    getPhaseCount,
    getKPIResults,
  };

  return (
    <ProcessContext.Provider value={value}>
      {children}
    </ProcessContext.Provider>
  );
}

export function useProcess() {
  const context = useContext(ProcessContext);
  if (context === undefined) {
    throw new Error('useProcess must be used within ProcessProvider');
  }
  return context;
}
