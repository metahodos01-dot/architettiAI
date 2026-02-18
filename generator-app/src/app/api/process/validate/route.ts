import { NextRequest, NextResponse } from 'next/server';
import { validateProcessComplexity, calculateSemaforoStatus } from '@/lib/processUtils';
import { Phase } from '@/types/process';

export async function POST(request: NextRequest) {
  try {
    const { phases } = (await request.json()) as { phases: Phase[] };

    if (!Array.isArray(phases)) {
      return NextResponse.json(
        { success: false, error: 'Phases deve essere un array' },
        { status: 400 }
      );
    }

    const phaseCount = phases.length;
    const validation = validateProcessComplexity(phases);
    const semaforoResult = calculateSemaforoStatus(phaseCount);

    return NextResponse.json({
      success: true,
      valid: validation.valid,
      warnings: validation.warnings,
      phaseCount,
      semaforoStatus: semaforoResult.status,
      semaforoMessage: semaforoResult.message,
    });
  } catch (error) {
    console.error('Validate API error:', error);
    return NextResponse.json(
      { success: false, error: 'Errore nella validazione' },
      { status: 500 }
    );
  }
}
