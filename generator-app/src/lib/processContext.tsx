'use client';

import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import {
  ProcessState,
  ProcessAction,
  ProcessContextType,
  ProcessFlow,
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

const ProcessContext = createContext<ProcessContextType | undefined>(undefined);

const initialState: ProcessState = {
  phases: [],
  processName: 'Nuovo Processo',
  pattern: 'custom',
  templateId: undefined,
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
      };

    case 'SET_PATTERN':
      return {
        ...state,
        pattern: action.payload,
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

  const value: ProcessContextType = {
    state,
    dispatch,
    getSemaforoStatus,
    getPhaseCount,
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
