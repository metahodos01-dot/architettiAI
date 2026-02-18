import { NextRequest, NextResponse } from 'next/server';
import { Phase, ProcessKPI } from '@/types/process';
import { calculateKPIResults, generateKPIPDFData } from '@/lib/kpiUtils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { processName, phases, kpis } = body as {
      processName: string;
      phases: Phase[];
      kpis: Record<string, ProcessKPI>;
    };

    if (!phases || !kpis || Object.keys(kpis).length === 0) {
      return NextResponse.json(
        { error: 'Dati KPI mancanti' },
        { status: 400 }
      );
    }

    const results = calculateKPIResults(phases, kpis);
    const pdfData = generateKPIPDFData(processName, phases, kpis, results);

    return NextResponse.json({
      results,
      pdfData,
    });
  } catch (error) {
    console.error('Errore calcolo KPI:', error);
    return NextResponse.json(
      { error: 'Errore nel calcolo dei KPI' },
      { status: 500 }
    );
  }
}
