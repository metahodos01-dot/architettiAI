import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { Phase, Tag, TagType } from '@/types/process';

const client = new Anthropic();

const DECOMPOSE_SYSTEM_PROMPT = `Sei un esperto di automazione n8n e processi.
Il tuo compito: analizzare una descrizione di processo e scomporla in fasi logiche e sequenziali.

REGOLE CRITICHE:
1. Massimo 7 fasi (regola Meta-Hodos Lean Trimming)
2. Ogni fase deve avere nome BREVE, descrizione CHIARA, e almeno un TAG
3. Restituisci SOLO JSON valido, niente altro
4. I tag disponibili sono: TRG (trigger), AGT (agente AI), LLM (motore AI), PRM (prompt), MEM (memory), TOL (tools/API), OUT (output)

OUTPUT FORMAT - JSON PURO:
{
  "phases": [
    {
      "id": "phase_1",
      "name": "Nome Breve Fase",
      "description": "Descrizione di cosa fa questa fase",
      "tags": [
        { "type": "TRG", "value": "EMAIL" },
        { "type": "AGT", "value": "DATA_EXTRACTOR" }
      ],
      "order": 1
    }
  ]
}

ESEMPIO CORRETTO:
Input: "Ricevo ordini via email, estraggo dati con AI, verifico stock, creo fattura, invio via Slack"
Output:
{
  "phases": [
    {
      "id": "phase_1",
      "name": "Ricezione Email Ordini",
      "description": "Ricevi email con ordini da clienti",
      "tags": [{ "type": "TRG", "value": "EMAIL" }],
      "order": 1
    },
    {
      "id": "phase_2",
      "name": "Estrazione Dati IA",
      "description": "AI estrae SKU, quantità, indirizzo da email",
      "tags": [
        { "type": "AGT", "value": "EXTRACTOR" },
        { "type": "LLM", "value": "CLAUDE" }
      ],
      "order": 2
    },
    {
      "id": "phase_3",
      "name": "Verifica Stock SAP",
      "description": "Query SAP per verificare disponibilità",
      "tags": [{ "type": "TOL", "value": "SAP" }],
      "order": 3
    },
    {
      "id": "phase_4",
      "name": "Generazione Fattura",
      "description": "Crea PDF fattura con dati ordine",
      "tags": [{ "type": "OUT", "value": "PDF" }],
      "order": 4
    },
    {
      "id": "phase_5",
      "name": "Notifica Slack",
      "description": "Invia notifica ordine su Slack",
      "tags": [{ "type": "OUT", "value": "SLACK" }],
      "order": 5
    }
  ]
}

RICORDA: Restituisci SOLO il JSON, niente testo prima o dopo.`;

export async function POST(request: NextRequest) {
  try {
    const { description, style } = await request.json();

    if (!description || !description.trim()) {
      return NextResponse.json(
        { success: false, error: 'Descrizione processo richiesta' },
        { status: 400 }
      );
    }

    // Chiama Claude per decomposizione
    const response = await client.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 2048,
      system: DECOMPOSE_SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: `Scomponi questo processo in fasi logiche:\n\n${description}`,
        },
      ],
    });

    // Estrai JSON dalla risposta
    const responseText =
      response.content[0].type === 'text' ? response.content[0].text : '';

    let phases: Phase[] = [];

    try {
      // Estrai JSON da blocchi di codice se presente
      const jsonMatch = responseText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      const jsonString = jsonMatch ? jsonMatch[1] : responseText;

      const parsed = JSON.parse(jsonString);

      if (!parsed.phases || !Array.isArray(parsed.phases)) {
        throw new Error('Invalid phases format');
      }

      phases = parsed.phases.map((phase: any, index: number) => ({
        id: phase.id || `phase_${index + 1}`,
        name: phase.name || 'Fase Senza Nome',
        description: phase.description || '',
        tags: phase.tags || [],
        order: index + 1,
      }));

      // Valida massimo 7 fasi
      if (phases.length > 7) {
        phases = phases.slice(0, 7);
      }
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.error('Response text:', responseText);

      // Fallback: crea fase generica
      phases = [
        {
          id: 'phase_1',
          name: 'Processo Custom',
          description: description,
          tags: [{ type: 'AGT', value: 'CUSTOM' }],
          order: 1,
        },
      ];
    }

    return NextResponse.json({
      success: true,
      phases,
    });
  } catch (error) {
    console.error('Decompose API error:', error);
    return NextResponse.json(
      { success: false, error: 'Errore nella decomposizione' },
      { status: 500 }
    );
  }
}
