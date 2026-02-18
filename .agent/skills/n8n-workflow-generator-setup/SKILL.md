---
name: n8n-workflow-generator-setup
description: Skill per replicare l'app "n8n Workflow Generator" con integrazione MCP e stile MetàHodos.
---

# n8n Workflow Generator Setup

Questa skill contiene le istruzioni e il "Prompt Master" per ricreare l'applicazione di generazione workflow che abbiamo sviluppato.

## Come usare questa skill

1. Leggi il file `PROMPT_N8N.md` incluso in questa cartella.
2. Copia il contenuto del prompt.
3. Incolla il prompt in una nuova sessione con un agente AI (come Claude Code o Antigravity) per ricostruire l'applicazione da zero.

## Contenuto del Pacchetto

- **PROMPT_N8N.md**: Il prompt dettagliato con specifiche tecniche, design system e architettura.
- **Concetti Chiave**:
  - Integrazione **n8n-mcp** via stdio/npx.
  - Design System **MetàHodos**.
  - Logica di generazione JSON per n8n.

## Esempio di utilizzo (Comando Rapido)

Se vuoi lanciare la ricostruzione in automatico, puoi dire:
> "Usa la skill n8n-workflow-generator-setup per creare una nuova app nella cartella /nuova-app"
