# Automotive Design Orchestrator - n8n Workflow Architecture

## 📋 Overview

Questo workflow gestisce il ciclo di progettazione di un nuovo modello di automobile, dalla fase di concept alla simulazione ingegneristica.

---

## 🔧 Architettura dei Nodi

### 1. Ingestion & Concept (Trigger)

| Nodo | Tipo | Configurazione |
|------|------|----------------|
| **Start Trigger** | `n8n-nodes-base.webhook` o `n8n-nodes-base.formTrigger` | Path: `/automotive-concept` |

**Input atteso**:

```json
{
  "segmento": "SUV" | "Sedan" | "Hatchback" | "Sportiva",
  "target_autonomia_km": 500,
  "budget_euro": 45000,
  "materiali": ["Alluminio", "Fibra di Carbonio", "Acciaio"],
  "peso_target_kg": 1800
}
```

---

### 2. Branching Decisionale (Router)

| Nodo | Tipo | Note |
|------|------|------|
| **Router** | `n8n-nodes-base.switch` | Separa il flusso in 3 rami paralleli |

**Condizioni Switch**:

- Ramo A: `true` (sempre eseguito)
- Ramo B: `true` (sempre eseguito)
- Ramo C: `true` (sempre eseguito)

> **Nota**: Poiché tutti i rami devono essere eseguiti in parallelo, si può usare un nodo **Set** con 3 output o semplicemente collegare il trigger a 3 nodi diversi.

---

### 3. Ramo A: Design & Estetica (Generazione Immagini 3D)

| Nodo | Tipo | Configurazione |
|------|------|----------------|
| **Generate Design** | `n8n-nodes-base.httpRequest` | POST a Leonardo.ai o GetImg.ai |

**Esempio configurazione HTTP Request**:

- **URL**: `https://cloud.leonardo.ai/api/rest/v1/generations`
- **Method**: POST
- **Headers**: `Authorization: Bearer {{$credentials.leonardoApi}}`
- **Body**:

```json
{
  "prompt": "Automotive {{ $json.body.segmento }} concept car, futuristic design, studio lighting, 4k render",
  "modelId": "6bef9f1b-29cb-40c7-b9df-32b51c1f67d3",
  "width": 1024,
  "height": 768,
  "num_images": 1
}
```

**API consigliate**:

- **Leonardo.ai**: Generazione immagini AI con modelli ottimizzati per automotive
- **GetImg.ai**: Alternative economica con buona qualità
- **Stability AI**: API SDXL per rendering fotorealistici

---

### 4. Ramo B: Ingegneria Meccanica (Calcolo Pesi)

| Nodo | Tipo | Configurazione |
|------|------|----------------|
| **Calculate Weight Balance** | `n8n-nodes-base.code` | JavaScript - Calcolo bilanciamento pesi |

**Codice JavaScript per il nodo Code**:

```javascript
// Automotive Weight Balance Calculator
// Formule basate su principi di fisica automobilistica

const input = $input.first().json.body || $input.first().json;

// Parametri di input
const segmento = input.segmento;
const targetAutonomia = input.target_autonomia_km || 500;
const materiali = input.materiali || ['Acciaio'];
const pesoTarget = input.peso_target_kg || 1800;

// === COSTANTI DI PESO PER COMPONENTE (in kg) ===
const PESO_BASE = {
  'SUV': { telaio: 450, carrozzeria: 380, interni: 220 },
  'Sedan': { telaio: 380, carrozzeria: 320, interni: 200 },
  'Hatchback': { telaio: 320, carrozzeria: 280, interni: 180 },
  'Sportiva': { telaio: 280, carrozzeria: 250, interni: 150 }
};

// === COEFFICIENTI MATERIALE (moltiplicatore peso) ===
const COEFF_MATERIALI = {
  'Acciaio': 1.0,
  'Alluminio': 0.65,
  'Fibra di Carbonio': 0.45,
  'Magnesio': 0.55,
  'Composito': 0.70
};

// === PESO BATTERIA (formula: autonomia * 0.3 kg/km per EV) ===
const pesoBatteria = targetAutonomia * 0.3;

// === CALCOLO PESO COMPONENTI ===
const pesoBase = PESO_BASE[segmento] || PESO_BASE['Sedan'];

// Calcola coefficiente medio materiali
const coeffMedio = materiali.reduce((acc, mat) => {
  return acc + (COEFF_MATERIALI[mat] || 1.0);
}, 0) / materiali.length;

// Pesi componenti con coefficiente materiale
const pesoTelaio = pesoBase.telaio * coeffMedio;
const pesoCarrozzeria = pesoBase.carrozzeria * coeffMedio;
const pesoInterni = pesoBase.interni; // interni non influenzati da materiali esterni

// === PESO PROPULSIONE ===
const pesoPropulsione = 180; // Motore elettrico + trasmissione
const pesoSospensioni = 120;
const pesoRuote = 80;
const pesoSistemiSicurezza = 50;

// === CALCOLO PESO TOTALE ===
const pesoTotale = Math.round(
  pesoTelaio +
  pesoCarrozzeria +
  pesoInterni +
  pesoBatteria +
  pesoPropulsione +
  pesoSospensioni +
  pesoRuote +
  pesoSistemiSicurezza
);

// === DISTRIBUZIONE PESI (Asse Anteriore / Posteriore) ===
// Formula: Per EV con batteria centrale, mira a 50/50
const pesoAnteriore = Math.round(pesoTotale * 0.48); // 48% anteriore
const pesoPosteriore = Math.round(pesoTotale * 0.52); // 52% posteriore

// === CENTRO DI GRAVITÀ (altezza in mm) ===
// Formula semplificata: CdG = (altezza telaio * 0.45)
const altezzaCdG = segmento === 'SUV' ? 620 : segmento === 'Sportiva' ? 420 : 520;

// === VALUTAZIONE ===
const differenzaPeso = pesoTotale - pesoTarget;
const superaPesoTarget = pesoTotale > pesoTarget;
const distribuzioneOttimale = Math.abs(pesoAnteriore - pesoPosteriore) < (pesoTotale * 0.05);

// === OUTPUT ===
return [{
  json: {
    ramo: 'B_Ingegneria',
    segmento: segmento,
    materiali_utilizzati: materiali,
    coefficiente_materiale: coeffMedio.toFixed(2),
    
    // Dettaglio pesi
    dettaglio_pesi: {
      telaio_kg: Math.round(pesoTelaio),
      carrozzeria_kg: Math.round(pesoCarrozzeria),
      interni_kg: pesoInterni,
      batteria_kg: Math.round(pesoBatteria),
      propulsione_kg: pesoPropulsione,
      sospensioni_kg: pesoSospensioni,
      ruote_kg: pesoRuote,
      sicurezza_kg: pesoSistemiSicurezza
    },
    
    // Risultati bilanciamento
    peso_totale_kg: pesoTotale,
    peso_target_kg: pesoTarget,
    differenza_kg: differenzaPeso,
    supera_target: superaPesoTarget,
    
    // Distribuzione
    distribuzione: {
      anteriore_kg: pesoAnteriore,
      posteriore_kg: pesoPosteriore,
      rapporto: `${Math.round((pesoAnteriore/pesoTotale)*100)}/${Math.round((pesoPosteriore/pesoTotale)*100)}`,
      ottimale: distribuzioneOttimale
    },
    
    // Centro di gravità
    centro_gravita_mm: altezzaCdG,
    
    // Status
    status: superaPesoTarget ? 'REVISIONE_RICHIESTA' : 'OK',
    messaggio: superaPesoTarget 
      ? `Peso totale (${pesoTotale}kg) supera il target (${pesoTarget}kg) di ${differenzaPeso}kg. Richiesta revisione materiali.`
      : `Peso totale (${pesoTotale}kg) entro il target. Distribuzione ${distribuzioneOttimale ? 'ottimale' : 'accettabile'}.`
  }
}];
```

---

### 5. Ramo C: Compliance & Normative (AI Agent)

| Nodo | Tipo | Configurazione |
|------|------|----------------|
| **AI Compliance Agent** | `@n8n/n8n-nodes-langchain.agent` | Agente AI con accesso a database vettoriale |
| **OpenAI Chat Model** | `@n8n/n8n-nodes-langchain.lmChatOpenAi` | Collegato all'Agent (ai_languageModel) |
| **Pinecone Vector Store** | `@n8n/n8n-nodes-langchain.vectorStorePinecone` | Collegato all'Agent (ai_tool) |

**Prompt per l'AI Agent**:

```
Sei un esperto di normative automotive europee. Analizza i seguenti parametri del veicolo e verifica la conformità con:
1. Euro NCAP (standard sicurezza)
2. WLTP (emissioni e autonomia)
3. ECE R94/R95 (crash test frontale/laterale)

Parametri veicolo:
- Segmento: {{ $json.body.segmento }}
- Peso target: {{ $json.body.peso_target_kg }} kg
- Materiali: {{ $json.body.materiali.join(', ') }}

Rispondi con:
- Lista requisiti obbligatori
- Potenziali issue di compliance
- Suggerimenti per superare i test Euro NCAP 5 stelle
```

**Configurazione Pinecone**:

- Index: `automotive-regulations`
- Namespace: `euro-ncap-2024`
- Top K: 5

---

### 6. Sync & Merge

| Nodo | Tipo | Configurazione |
|------|------|----------------|
| **Wait for Branches** | `n8n-nodes-base.merge` | Mode: `Merge By Position` (attende tutti e 3 i rami) |
| **Compile Report** | `n8n-nodes-base.code` | Unifica i dati in un report strutturato |
| **Save to Notion** | `n8n-nodes-base.notion` | Operation: Create Database Item |

**Codice nodo Compile Report**:

```javascript
const items = $input.all();

// Trova i risultati dei 3 rami
const designResult = items.find(i => i.json.ramo === 'A_Design')?.json || {};
const engineeringResult = items.find(i => i.json.ramo === 'B_Ingegneria')?.json || {};
const complianceResult = items.find(i => i.json.ramo === 'C_Compliance')?.json || {};

return [{
  json: {
    report_tecnico: {
      titolo: `Concept Vehicle - ${engineeringResult.segmento || 'N/A'}`,
      data_generazione: new Date().toISOString(),
      
      sezione_design: {
        immagini_generate: designResult.images || [],
        stile: designResult.style || 'Futuristic'
      },
      
      sezione_ingegneria: {
        peso_totale_kg: engineeringResult.peso_totale_kg,
        distribuzione: engineeringResult.distribuzione,
        centro_gravita_mm: engineeringResult.centro_gravita_mm,
        status: engineeringResult.status
      },
      
      sezione_compliance: {
        euro_ncap_rating: complianceResult.rating || 'Pending',
        requisiti: complianceResult.requirements || [],
        issues: complianceResult.issues || []
      },
      
      richiede_revisione: engineeringResult.supera_target === true
    }
  }
}];
```

---

### 7. Loop di Revisione

| Nodo | Tipo | Configurazione |
|------|------|----------------|
| **Check Weight** | `n8n-nodes-base.if` | Condizione: `{{ $json.report_tecnico.richiede_revisione === true }}` |
| **Notify Slack** | `n8n-nodes-base.slack` | Channel: `#team-telaio` |
| **Loop Back** | `n8n-nodes-base.set` | Prepara nuovi parametri e ritorna al Router |

**Messaggio Slack**:

```
🚨 *REVISIONE PESO RICHIESTA*

Il peso totale del concept *{{ $json.report_tecnico.titolo }}* supera il target.

*Dettagli:*
• Peso calcolato: {{ $json.report_tecnico.sezione_ingegneria.peso_totale_kg }} kg
• Distribuzione: {{ $json.report_tecnico.sezione_ingegneria.distribuzione.rapporto }}

*Azione richiesta:* Rivedere selezione materiali e rilanciare simulazione.
```

---

## 🚨 Error Handling

| Nodo | Tipo | Configurazione |
|------|------|----------------|
| **Error Trigger** | `n8n-nodes-base.errorTrigger` | Cattura errori da tutto il workflow |
| **Alert Slack** | `n8n-nodes-base.slack` | Channel: `#alerts-automotive` |
| **Log Error** | `n8n-nodes-base.airtable` | Tabella: `Error Logs` |

**Messaggio Slack per errori**:

```
❌ *WORKFLOW ERROR - Automotive Orchestrator*

*Errore:* {{ $json.error.message }}
*Nodo fallito:* {{ $json.error.node.name }}
*Timestamp:* {{ $now.toISO() }}
*Execution ID:* {{ $execution.id }}

@engineering-team
```

---

## 📁 Gestione File Binari (CAD/Immagini)

Per gestire file binari (modelli 3D, immagini generate):

1. **Upload a S3/GCS**:
   - Usa `n8n-nodes-base.s3` o `n8n-nodes-base.googleCloudStorage`
   - Salva il file e passa solo l'URL tra i nodi

2. **Binary Data Handling**:

   ```javascript
   // Nel nodo Code, accedi ai binari così:
   const binaryData = $binary;
   const imageBuffer = binaryData.data; // Base64
   const mimeType = binaryData.mimeType;
   ```

3. **Workflow Pattern**:

   ```
   Generate Image → Move Binary Data → Upload to S3 → Store URL in Notion
   ```

---

## 🔗 API Esterne Consigliate

| Servizio | Uso | Endpoint |
|----------|-----|----------|
| **Leonardo.ai** | Generazione bozzetti 3D | `https://cloud.leonardo.ai/api/rest/v1/` |
| **GetImg.ai** | Alternativa immagini | `https://api.getimg.ai/v1/` |
| **Pinecone** | Database vettoriale normative | `https://YOUR_INDEX.svc.ENVIRONMENT.pinecone.io` |
| **Notion API** | Report storage | `https://api.notion.com/v1/` |
| **Slack API** | Notifiche team | `https://slack.com/api/` |

---

## 🏁 Flusso Completo

```
┌─────────────────┐
│   Webhook/Form  │
│  (Concept Data) │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│     Router      │
│   (3 Branches)  │
└──┬──────┬──────┬─┘
   │      │      │
   ▼      ▼      ▼
┌─────┐ ┌─────┐ ┌─────┐
│ API │ │Code │ │ AI  │
│Image│ │Calc │ │Agent│
└──┬──┘ └──┬──┘ └──┬──┘
   │      │      │
   └──────┼──────┘
          ▼
    ┌───────────┐
    │   Merge   │
    │  (Wait)   │
    └─────┬─────┘
          │
          ▼
    ┌───────────┐
    │  Compile  │
    │  Report   │
    └─────┬─────┘
          │
          ▼
    ┌───────────┐     ┌─────────────┐
    │ IF: Peso  │──▶  │ Slack Alert │
    │ > Target? │     │ + Loop Back │
    └─────┬─────┘     └─────────────┘
          │ No
          ▼
    ┌───────────┐
    │  Notion   │
    │  (Save)   │
    └───────────┘
```

---

## ✅ Checklist Implementazione

- [ ] Creare Webhook trigger con path `/automotive-concept`
- [ ] Configurare credenziali Leonardo.ai o GetImg.ai
- [ ] Configurare credenziali OpenAI per AI Agent
- [ ] Popolare Pinecone con normative Euro NCAP
- [ ] Configurare credenziali Notion e creare database
- [ ] Configurare canale Slack #team-telaio
- [ ] Testare Error Trigger con fallimento simulato
- [ ] Validare workflow completo con `validate_workflow`
