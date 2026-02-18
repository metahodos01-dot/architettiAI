# Prompt per la Creazione del n8n Workflow Generator

Copia e utlizza questo prompt per ricreare l'applicazione n8n Workflow Generator completa di stile MetàHodos e integrazione MCP.

---

## 🚀 PROMPT MASTER

**Obiettivo**: Creare una applicazione Next.js (App Router) per generare workflow n8n da linguaggio naturale, integrando il protocollo MCP per interrogare la documentazione dei nodi n8n e usando lo stila MetàHodos.

### 1. Stack Tecnologico

- Framework: **Next.js 15+** (App Router)
- Linguaggio: **TypeScript**
- Styling: **CSS Modules** o **Tailwind** (ma con variabili CSS custom obbligatorie)
- Integrazione Esterna: **n8n-mcp** (via `npx`)

### 2. Design System (Stile MetàHodos)

Devi rispettare rigorosamente queste regole visive:

**Palette Colori:**

- Arancione (Accent/Primary): `#F89F5A`
- Rosa (Secondary): `#f06681`
- Verde (Success): `#8CC63F`
- Background Dark: `#3C3C3C` (per Header/Hero)
- Grigio Chiaro: `#F5F5F5` (sfondi)

**Tipografia:**

- Font Titoli: `Saira Condensed` (Google Font), uppercase, bold.
- Font Testo: `Lato` (Google Font), leggibile.

**Elementi Obbligatori:**

- **Brand Dots**: Tre pallini (Rosa, Arancione, Verde) visualizzati come firma visiva.
- **Titoli con Linea**: Titoli con una sottolineatura colorata spessa (es. verde o arancione).
- **Card**: Bianche, arrotondate (radius 20px), con ombra morbida.

### 3. Architettura Backend (API Routes)

L'applicazione deve avere i seguenti endpoint API in `src/app/api`:

#### A. `api/mcp/search`

- **Scopo**: Cercare nodi n8n tramite il tool MCP `search_nodes`.
- **Implementazione**: Deve eseguire il comando shell:
  `cat input.txt | MCP_MODE=stdio npx -y n8n-mcp`
  Passando JSON-RPC su stdin.

#### B. `api/mcp/details`

- **Scopo**: Ottenere dettagli di un nodo (parametri, input, output) tramite MCP `get_node`.
- **Implementazione**: Simile alla search, ma chiama `get_node`.

#### C. `api/generate`

- **Scopo**: Accetta un prompt utente (es. "Quando ricevo una mail salvami su sheets") e restituisce un JSON importabile in n8n.
- **Logica**:
  1. Analizza il prompt per identificare intenti (Webhook, Email, Slack, ecc.).
  2. Mappa gli intenti su nodi n8n specifici (es. `n8n-nodes-base.googleSheets`).
  3. Costruisce una struttura JSON valida per n8n (`nodes`, `connections`).
  4. (Opzionale) Usa i dati MCP per arricchire i parametri se possibile.

### 4. Interfaccia Utente (`/workflow-generator`)

La pagina deve presentare:

1. **Header Scuro**: Con titolo "WORKFLOW GENERATOR" e stile MetàHodos.
2. **Form di Input**:
   - Nome del Workflow.
   - Textarea per il prompt ("Descrivi cosa vuoi automatizzare...").
   - Bottone "Genera Workflow" (Arancione, grande).
3. **Sezione Risultati**:
   - Lista dei "Nodi Rilevati" (badge verdi).
   - Anteprima visiva del flusso (card collegate da frecce).
   - Blocco JSON (copiabile/scaricabile).
4. **Istruzioni**: Un box che spiega come importare il JSON in n8n.

### 5. Istruzioni di Implementazione Passo-Passo

Esegui queste azioni:

1. **Setup**: Crea un nuovo progetto Next.js (se non esiste) e installa le dipendenze base.
2. **Stili**: Configura `globals.css` con le variabili CSS MetàHodos (vedi sopra).
3. **API MCP**: Implementa `route.ts` per search e details usando `child_process.execSync` per invocare `npx -y n8n-mcp`.
4. **Generatore**: Implementa la logica di mapping prompt -> nodi e costruzione JSON.
5. **UI**: Crea la pagina React con i componenti `BrandDots`, `TitleWithLine` e la logica di fetch.

---

**Nota Importante**: L'integrazione MCP richiede che l'ambiente dove gira l'app abbia `npx` e accesso a internet per scaricare `n8n-mcp`.
