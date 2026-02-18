import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

// ============================================================
// n8n Workflow Generator - Powered by n8n-skills knowledge base
// ============================================================

const SYSTEM_PROMPT = `You are an expert n8n workflow architect. You generate production-ready n8n workflow JSON.

## CRITICAL RULES
1. Return ONLY a valid JSON object. No markdown, no text before/after. Start with { end with }
2. Use EXACT n8n node type names from the reference below
3. Every workflow MUST have exactly ONE trigger node
4. Connections use node NAMES (not IDs)
5. Position nodes on a grid: x starts at 250, increment by 300. y=300 for main flow, y=500 for branches
6. ALWAYS prefer Google Workspace nodes over generic ones:
   - Gmail instead of emailSend/emailReadImap
   - Google Sheets instead of generic databases for simple data
   - Google Drive instead of generic file storage
   - Google Calendar for calendar/scheduling needs
   - Google Docs for document generation
7. NEVER use n8n-nodes-base.emailSend or n8n-nodes-base.emailReadImap — use Gmail nodes instead
8. NEVER use generic n8n-nodes-base.httpRequest when a dedicated n8n node exists for that service
9. ALWAYS add Sticky Note nodes to document each phase of the workflow

## 5 CORE WORKFLOW PATTERNS

### Pattern 1: Webhook Processing (most common)
Structure: Webhook → [Validate] → [Transform] → [Action] → [Response/Notify]
- CRITICAL: Webhook data is nested under $json.body — use {{$json.body.email}} NOT {{$json.email}}
- responseMode: "onReceived" (fire-and-forget) or "lastNode" (custom response)
- When using "lastNode", add a "Respond to Webhook" node at the end

### Pattern 2: HTTP API Integration
Structure: Trigger → HTTP Request → [Transform] → [Action] → [Error Handler]
- Use continueOnFail:true on HTTP nodes for error handling
- Add IF node after to check for errors
- Support pagination with Loop patterns

### Pattern 3: Database Operations
Structure: Schedule → Query → Transform → Write → Verify
- Always use parameterized queries (never string concatenation)
- Add LIMIT to SELECT queries
- Use batch processing for large datasets

### Pattern 4: AI Agent Workflow
Structure: Trigger → AI Agent (Model + Tools + Memory) → Output
- AI Agent node type: "@n8n/n8n-nodes-langchain.agent"
- Language Model: "@n8n/n8n-nodes-langchain.lmChatOpenAi" or "@n8n/n8n-nodes-langchain.lmChatAnthropic"
- Memory: "@n8n/n8n-nodes-langchain.memoryBufferWindow"
- Tools connect via "ai_tool" connection type (NOT "main")
- Memory connects via "ai_memory" connection type
- Model connects via "ai_languageModel" connection type
- ANY n8n node can be a tool when connected via ai_tool port

### Pattern 5: Scheduled Tasks
Structure: Schedule Trigger → [Fetch Data] → [Process] → [Deliver] → [Log/Notify]
- Schedule modes: interval, cron, daysAndHours
- Always set workflow timezone
- Add error handling with Error Trigger

## AVAILABLE NODE TYPES (use exact strings)

### Triggers
- n8n-nodes-base.webhook — HTTP webhook endpoint
- n8n-nodes-base.scheduleTrigger — Cron/interval schedule
- n8n-nodes-base.manualTrigger — Manual execution
- n8n-nodes-base.gmailTrigger — Gmail trigger (PREFERRED for email triggers)
- n8n-nodes-base.googleCalendarTrigger — Google Calendar event trigger
- n8n-nodes-base.slackTrigger — Slack event trigger
- n8n-nodes-base.telegramTrigger — Telegram trigger
- n8n-nodes-base.githubTrigger — GitHub event trigger
- n8n-nodes-base.stripeTrigger — Stripe event trigger
- n8n-nodes-base.errorTrigger — Error handler trigger

### Logic & Transform
- n8n-nodes-base.if — IF condition (two outputs: true/false)
- n8n-nodes-base.switch — Multi-condition switch
- n8n-nodes-base.code — JavaScript/Python code
- n8n-nodes-base.set — Set/map fields
- n8n-nodes-base.merge — Merge two inputs
- n8n-nodes-base.splitInBatches — Process in batches
- n8n-nodes-base.filter — Filter items
- n8n-nodes-base.aggregate — Aggregate data
- n8n-nodes-base.respondToWebhook — Send webhook response (use with responseMode:"lastNode")
- n8n-nodes-base.noOp — No operation (placeholder)
- n8n-nodes-base.stopAndError — Stop workflow with error

### Communication (prefer Google nodes!)
- n8n-nodes-base.gmail — Gmail send/read (ALWAYS use this instead of emailSend)
- n8n-nodes-base.slack — Slack messages
- n8n-nodes-base.discord — Discord messages
- n8n-nodes-base.telegram — Telegram messages
- n8n-nodes-base.twilio — SMS via Twilio

### Google Workspace (PREFERRED — use these whenever possible)
- n8n-nodes-base.gmail — Gmail (send, read, draft, label)
- n8n-nodes-base.gmailTrigger — Gmail trigger (new email)
- n8n-nodes-base.googleSheets — Google Sheets (read, write, append, update)
- n8n-nodes-base.googleDrive — Google Drive (upload, download, list, share)
- n8n-nodes-base.googleDocs — Google Docs (create, update)
- n8n-nodes-base.googleCalendar — Google Calendar (create event, list events)
- n8n-nodes-base.googleCalendarTrigger — Google Calendar trigger
- n8n-nodes-base.googleSlides — Google Slides

### Documentation (Sticky Notes)
- n8n-nodes-base.stickyNote — Sticky note for documenting workflow sections

### HTTP & APIs
- n8n-nodes-base.httpRequest — REST API calls (GET/POST/PUT/DELETE)

### Data & Storage
- n8n-nodes-base.googleSheets — Google Sheets read/write
- n8n-nodes-base.airtable — Airtable
- n8n-nodes-base.notion — Notion pages/databases
- n8n-nodes-base.postgres — PostgreSQL
- n8n-nodes-base.mysql — MySQL
- n8n-nodes-base.mongoDb — MongoDB
- n8n-nodes-base.redis — Redis

### CRM & Business
- n8n-nodes-base.salesforce — Salesforce
- n8n-nodes-base.hubspot — HubSpot
- n8n-nodes-base.pipedrive — Pipedrive
- n8n-nodes-base.jira — Jira tickets
- n8n-nodes-base.asana — Asana tasks
- n8n-nodes-base.trello — Trello cards

### E-commerce
- n8n-nodes-base.stripe — Stripe payments
- n8n-nodes-base.shopify — Shopify
- n8n-nodes-base.wooCommerce — WooCommerce

### Files & Cloud
- n8n-nodes-base.googleDrive — Google Drive
- n8n-nodes-base.dropbox — Dropbox
- n8n-nodes-base.awsS3 — AWS S3

### AI / LangChain
- @n8n/n8n-nodes-langchain.agent — AI Agent (orchestrator)
- @n8n/n8n-nodes-langchain.lmChatOpenAi — OpenAI Chat Model
- @n8n/n8n-nodes-langchain.lmChatAnthropic — Anthropic Claude Model
- @n8n/n8n-nodes-langchain.memoryBufferWindow — Window Buffer Memory
- @n8n/n8n-nodes-langchain.toolCalculator — Calculator tool
- @n8n/n8n-nodes-langchain.toolWikipedia — Wikipedia tool
- @n8n/n8n-nodes-langchain.toolCode — Custom code tool

### Timing
- n8n-nodes-base.wait — Wait/delay

## CONNECTION TYPES
- "main" — Standard data flow (most nodes)
- "ai_languageModel" — LLM → AI Agent
- "ai_tool" — Tool node → AI Agent
- "ai_memory" — Memory → AI Agent
- "ai_outputParser" — Output parser → AI Agent

## DATA FLOW PATTERNS
- Linear: A → B → C → D
- Branching: A → IF → [True: B] / [False: C]
- Parallel: A → [B, C] → Merge → D
- Loop: A → SplitInBatches → B → (loop back)
- Error: Main flow + separate Error Trigger → Alert

## STICKY NOTES — MANDATORY
Add sticky note nodes to document EACH logical phase of the workflow.
Position them ABOVE the nodes they describe (y = 50, same x range).
Use clear Italian descriptions. Example sticky notes:
- "📥 FASE 1: RICEZIONE DATI\nIl webhook riceve i dati dal form e li valida"
- "⚙️ FASE 2: ELABORAZIONE\nI dati vengono trasformati e arricchiti"
- "📤 FASE 3: OUTPUT\nRisultati salvati su Google Sheets e notifica su Slack"
- "🚨 GESTIONE ERRORI\nIn caso di errore, notifica il team su Slack"

Sticky note parameters:
{"content": "📥 FASE 1: RICEZIONE\\nDescrizione della fase", "width": 300, "height": 120, "color": 4}
Colors: 1=yellow, 2=orange, 3=red, 4=green, 5=blue, 6=purple, 7=gray

## OUTPUT FORMAT

Return this exact JSON structure:
{
  "pattern": "webhook|http_api|database|ai_agent|scheduled",
  "flow_description": "Clear description of what the workflow does",
  "nodes": [
    {
      "name": "Descriptive Node Name",
      "type": "exact.node.type",
      "typeVersion": 1,
      "position": [x, y],
      "parameters": { ... node-specific config ... }
    }
  ],
  "connections": {
    "Source Node Name": {
      "main": [[{"node": "Target Node Name", "type": "main", "index": 0}]]
    }
  },
  "ai_connections": {
    "Model Node Name": {
      "ai_languageModel": [[{"node": "AI Agent Name", "type": "ai_languageModel", "index": 0}]]
    },
    "Tool Node Name": {
      "ai_tool": [[{"node": "AI Agent Name", "type": "ai_tool", "index": 0}]]
    }
  },
  "recommendations": ["tip1", "tip2", "tip3"],
  "credentials_needed": ["credentialType1", "credentialType2"]
}

IMPORTANT: Include sticky note nodes in the "nodes" array. They are NOT connected to other nodes (no connections needed for sticky notes).

## NODE PARAMETER RULES — CRITICAL

KEEP PARAMETERS MINIMAL. Only include parameters that are simple strings, numbers, or booleans.
Do NOT include complex nested objects — n8n will provide defaults.
The user will configure credentials and complex settings in the n8n UI.

### Webhook — ONLY these parameters:
{"httpMethod": "POST", "path": "my-webhook", "responseMode": "onReceived"}

### Schedule Trigger — ONLY these parameters:
{"rule": {"interval": [{"field": "hours", "triggerAtHour": 9}]}}

### HTTP Request — ONLY these parameters:
{"method": "GET", "url": "https://api.example.com/data", "options": {}}

### IF Condition — EMPTY parameters (user configures in UI):
{}

### Set Node — EMPTY parameters (user configures in UI):
{}

### Code Node — ONLY jsCode:
{"jsCode": "const items = $input.all();\\nreturn items.map(item => ({json: {processed: true, ...item.json}}));"}

### Slack — ONLY these simple parameters:
{"resource": "message", "operation": "post"}

### Gmail — ONLY these:
{"resource": "message", "operation": "send"}

### Postgres — ONLY these:
{"operation": "executeQuery", "query": "SELECT * FROM table LIMIT 100"}

### AI Agent — ONLY these:
{"agent": "conversationalAgent", "promptType": "define", "text": "You are a helpful assistant."}

### Google Sheets — ONLY these:
{"operation": "append"}

### Respond to Webhook — EMPTY:
{}

### Manual Trigger — EMPTY:
{}

### Error Trigger — EMPTY:
{}

### Sticky Note — content, width, height, color:
{"content": "📥 FASE 1: RICEZIONE\\nDescrizione", "width": 300, "height": 120, "color": 4}

### Google Docs — ONLY these:
{"resource": "document", "operation": "create"}

### Google Calendar — ONLY these:
{"resource": "event", "operation": "create"}

For ALL other nodes: use EMPTY parameters {} or only simple string/number fields.
NEVER include nested objects like "conditions", "assignments", "columns", "queryParameters", "headerParameters".
NEVER include "__rl" objects.

## IMPORTANT REMINDERS
- Webhook data access: ALWAYS use $json.body.fieldName (NOT $json.fieldName)
- AI tools connect via ai_tool type, NOT main
- Always include error handling recommendations
- Use descriptive node names in Italian if the prompt is in Italian
- Position: first node at [250, 300], increment x by 300 for each node in sequence
- For branching: true branch at y=300, false branch at y=500
- KEEP PARAMETERS SIMPLE — no complex nested objects
- ALWAYS use Gmail instead of emailSend/emailReadImap
- ALWAYS use Google Sheets for tabular data storage
- ALWAYS use Google Drive for file storage
- ALWAYS add 2-4 sticky notes documenting the workflow phases (position at y=50, above the nodes)
- Sticky notes do NOT have connections — they are just visual documentation
`;

interface WorkflowNode {
  id: string;
  name: string;
  type: string;
  typeVersion: number;
  position: [number, number];
  parameters: Record<string, unknown>;
}

interface Connection {
  node: string;
  type: string;
  index: number;
}

interface WorkflowConnections {
  [nodeName: string]: {
    [connectionType: string]: Connection[][];
  };
}

interface GeneratedWorkflow {
  name: string;
  nodes: WorkflowNode[];
  connections: WorkflowConnections;
  settings: Record<string, unknown>;
  staticData: null;
  pinData: Record<string, unknown>;
}

async function generateWorkflowWithAI(prompt: string, name: string): Promise<{
  pattern: string;
  workflow: GeneratedWorkflow;
  explanation: string;
  recommendations: string[];
  credentialsNeeded: string[];
}> {
  const client = new Anthropic();

  const response = await client.messages.create({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 8192,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: `Design a complete n8n workflow for: "${prompt}"

Workflow name: "${name}"

IMPORTANT: Return ONLY the JSON object. No markdown fences, no explanatory text. Start with { and end with }.`
      }
    ]
  });

  let jsonStr = response.content[0].type === 'text' ? response.content[0].text : '';

  // Clean up response
  jsonStr = jsonStr.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();

  // Extract JSON object
  const jsonMatch = jsonStr.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    jsonStr = jsonMatch[0];
  }

  let parsed;
  try {
    parsed = JSON.parse(jsonStr);
  } catch {
    console.error('JSON parse error. Raw response:', jsonStr.substring(0, 1000));
    throw new Error('Failed to parse AI response. Please try again with a more specific description.');
  }

  if (!Array.isArray(parsed.nodes) || parsed.nodes.length === 0) {
    throw new Error('AI response did not contain valid nodes. Please describe your workflow in more detail.');
  }

  // Build proper n8n workflow format
  const nodes: WorkflowNode[] = parsed.nodes.map((node: Record<string, unknown>, index: number) => {
    const position = Array.isArray(node.position) ? node.position as [number, number] : [250 + index * 300, 300] as [number, number];
    const rawParams = (node.parameters as Record<string, unknown>) || (node as Record<string, unknown>).config as Record<string, unknown> || {};

    return {
      id: crypto.randomUUID(),
      name: node.name as string || `Node ${index}`,
      type: node.type as string,
      typeVersion: (node.typeVersion as number) || getDefaultTypeVersion(node.type as string),
      position,
      parameters: sanitizeParameters(node.type as string, rawParams),
    };
  });

  // Ensure unique node names
  const nameCount: Record<string, number> = {};
  for (const node of nodes) {
    if (nameCount[node.name]) {
      nameCount[node.name]++;
      node.name = `${node.name} ${nameCount[node.name]}`;
    } else {
      nameCount[node.name] = 1;
    }
  }

  // Build connections from AI response
  const connections: WorkflowConnections = {};

  // Process main connections
  if (parsed.connections && typeof parsed.connections === 'object') {
    for (const [sourceName, targets] of Object.entries(parsed.connections)) {
      if (!connections[sourceName]) connections[sourceName] = {};
      const targetObj = targets as Record<string, Connection[][]>;
      for (const [connType, connArrays] of Object.entries(targetObj)) {
        connections[sourceName][connType] = connArrays;
      }
    }
  }

  // Process AI-specific connections (ai_languageModel, ai_tool, ai_memory)
  if (parsed.ai_connections && typeof parsed.ai_connections === 'object') {
    for (const [sourceName, targets] of Object.entries(parsed.ai_connections)) {
      if (!connections[sourceName]) connections[sourceName] = {};
      const targetObj = targets as Record<string, Connection[][]>;
      for (const [connType, connArrays] of Object.entries(targetObj)) {
        connections[sourceName][connType] = connArrays;
      }
    }
  }

  // Fallback: if no connections provided, create linear flow
  if (Object.keys(connections).length === 0) {
    for (let i = 0; i < nodes.length - 1; i++) {
      connections[nodes[i].name] = {
        main: [[{ node: nodes[i + 1].name, type: 'main', index: 0 }]]
      };
    }
  }

  return {
    pattern: parsed.pattern || 'custom',
    workflow: {
      name,
      nodes,
      connections,
      settings: {
        executionOrder: 'v1',
      },
      staticData: null,
      pinData: {}
    },
    explanation: parsed.flow_description || 'Generated workflow',
    recommendations: parsed.recommendations || [],
    credentialsNeeded: parsed.credentials_needed || []
  };
}

// Sanitize node parameters to prevent n8n import errors
// The "propertyValues[itemName] is not iterable" error happens when
// parameters contain objects where n8n expects arrays, or vice versa.
// Strategy: only keep SAFE simple parameters, strip everything complex.
function sanitizeParameters(nodeType: string, params: Record<string, unknown>): Record<string, unknown> {
  if (!params || typeof params !== 'object') return {};

  // Known safe parameter keys per node type (only simple values)
  const safeKeys: Record<string, string[]> = {
    'n8n-nodes-base.stickyNote': ['content', 'width', 'height', 'color'],
    'n8n-nodes-base.webhook': ['httpMethod', 'path', 'responseMode'],
    'n8n-nodes-base.scheduleTrigger': ['rule'],
    'n8n-nodes-base.manualTrigger': [],
    'n8n-nodes-base.errorTrigger': [],
    'n8n-nodes-base.gmailTrigger': [],
    'n8n-nodes-base.googleCalendarTrigger': [],
    'n8n-nodes-base.httpRequest': ['method', 'url', 'options'],
    'n8n-nodes-base.if': [],  // IF conditions are complex — let user configure in UI
    'n8n-nodes-base.switch': [],
    'n8n-nodes-base.code': ['jsCode', 'language', 'mode'],
    'n8n-nodes-base.set': [],  // Set assignments are complex — let user configure in UI
    'n8n-nodes-base.merge': ['mode'],
    'n8n-nodes-base.splitInBatches': ['batchSize'],
    'n8n-nodes-base.filter': [],
    'n8n-nodes-base.aggregate': [],
    'n8n-nodes-base.respondToWebhook': [],
    'n8n-nodes-base.wait': ['amount', 'unit'],
    'n8n-nodes-base.slack': ['resource', 'operation'],
    'n8n-nodes-base.discord': ['resource', 'operation'],
    'n8n-nodes-base.telegram': ['resource', 'operation'],
    'n8n-nodes-base.emailSend': [],
    'n8n-nodes-base.gmail': ['resource', 'operation'],
    'n8n-nodes-base.twilio': ['resource', 'operation'],
    'n8n-nodes-base.googleSheets': ['operation'],
    'n8n-nodes-base.airtable': ['operation'],
    'n8n-nodes-base.notion': ['resource', 'operation'],
    'n8n-nodes-base.postgres': ['operation', 'query'],
    'n8n-nodes-base.mysql': ['operation', 'query'],
    'n8n-nodes-base.mongoDb': ['operation', 'collection'],
    'n8n-nodes-base.redis': ['operation', 'key'],
    'n8n-nodes-base.salesforce': ['resource', 'operation'],
    'n8n-nodes-base.hubspot': ['resource', 'operation'],
    'n8n-nodes-base.jira': ['resource', 'operation'],
    'n8n-nodes-base.stripe': ['resource', 'operation'],
    'n8n-nodes-base.googleDrive': ['resource', 'operation'],
    'n8n-nodes-base.googleDocs': ['resource', 'operation'],
    'n8n-nodes-base.googleCalendar': ['resource', 'operation'],
    'n8n-nodes-base.googleSlides': ['resource', 'operation'],
    'n8n-nodes-base.awsS3': ['operation'],
    '@n8n/n8n-nodes-langchain.agent': ['agent', 'promptType', 'text'],
    '@n8n/n8n-nodes-langchain.lmChatOpenAi': ['model', 'options'],
    '@n8n/n8n-nodes-langchain.lmChatAnthropic': ['model', 'options'],
    '@n8n/n8n-nodes-langchain.memoryBufferWindow': ['contextWindowLength'],
  };

  const allowedKeys = safeKeys[nodeType];

  // If we don't know the node type, only keep simple primitive values
  if (!allowedKeys) {
    const safe: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(params)) {
      if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
        safe[key] = value;
      }
    }
    return safe;
  }

  // If the allowed list is empty, return empty params (user configures in UI)
  if (allowedKeys.length === 0) return {};

  const safe: Record<string, unknown> = {};
  for (const key of allowedKeys) {
    if (key in params) {
      const value = params[key];
      // Allow simple values and special known-safe objects
      if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
        safe[key] = value;
      } else if (key === 'rule' && typeof value === 'object') {
        // Schedule rule is a known-safe structure, but validate it
        safe[key] = sanitizeScheduleRule(value);
      } else if (key === 'options' && typeof value === 'object') {
        // Options: only keep simple key-value pairs
        const safeOpts: Record<string, unknown> = {};
        if (value && typeof value === 'object') {
          for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
            if (typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean') {
              safeOpts[k] = v;
            }
          }
        }
        safe[key] = safeOpts;
      }
    }
  }

  return safe;
}

function sanitizeScheduleRule(rule: unknown): Record<string, unknown> {
  if (!rule || typeof rule !== 'object') {
    return { interval: [{ field: 'hours', triggerAtHour: 9 }] };
  }
  const r = rule as Record<string, unknown>;
  // Only allow the 'interval' key with array value
  if (Array.isArray(r.interval)) {
    return { interval: r.interval };
  }
  return { interval: [{ field: 'hours', triggerAtHour: 9 }] };
}

function getDefaultTypeVersion(type: string): number {
  const versionMap: Record<string, number> = {
    'n8n-nodes-base.set': 3.4,
    'n8n-nodes-base.code': 2,
    'n8n-nodes-base.if': 2,
    'n8n-nodes-base.switch': 3,
    'n8n-nodes-base.merge': 3,
    'n8n-nodes-base.httpRequest': 4.2,
    'n8n-nodes-base.webhook': 2,
    'n8n-nodes-base.respondToWebhook': 1.1,
    'n8n-nodes-base.slack': 2.2,
    'n8n-nodes-base.gmail': 2.1,
    'n8n-nodes-base.googleSheets': 4.5,
    'n8n-nodes-base.postgres': 2.5,
    'n8n-nodes-base.mysql': 2.4,
    'n8n-nodes-base.mongoDb': 1.1,
    'n8n-nodes-base.stickyNote': 1,
    'n8n-nodes-base.scheduleTrigger': 1.2,
    'n8n-nodes-base.gmailTrigger': 1.2,
    'n8n-nodes-base.googleCalendarTrigger': 1.2,
    'n8n-nodes-base.googleDocs': 2,
    'n8n-nodes-base.googleCalendar': 1.2,
    '@n8n/n8n-nodes-langchain.agent': 1.7,
    '@n8n/n8n-nodes-langchain.lmChatOpenAi': 1.2,
    '@n8n/n8n-nodes-langchain.lmChatAnthropic': 1.3,
    '@n8n/n8n-nodes-langchain.memoryBufferWindow': 1.3,
  };
  return versionMap[type] || 1;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { prompt, name = 'Generated Workflow' } = body;

    if (!prompt || !prompt.trim()) {
      return NextResponse.json(
        { error: 'Prompt required' },
        { status: 400 }
      );
    }

    const result = await generateWorkflowWithAI(prompt, name);

    const activeNodes = result.workflow.nodes.filter(n => n.type !== 'n8n-nodes-base.stickyNote');

    return NextResponse.json({
      success: true,
      pattern: result.pattern,
      workflow: result.workflow,
      explanation: result.explanation,
      recommendations: result.recommendations,
      credentialsNeeded: result.credentialsNeeded,
      nodeCount: activeNodes.length,
      stickyNoteCount: result.workflow.nodes.length - activeNodes.length,
      detectedNodes: activeNodes.map(n => n.type)
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to generate workflow';
    console.error('Generation error:', error);
    return NextResponse.json(
      {
        error: message,
        hint: 'Try describing your workflow in more detail, mentioning specific services and the trigger event.'
      },
      { status: 500 }
    );
  }
}
