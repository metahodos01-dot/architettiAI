import { Phase, ProcessKPI, KPIResults, PhaseKPIResult } from '@/types/process';

/**
 * Valori di default KPI per una fase (basati sul tipo di tag predominante)
 */
export function getDefaultKPI(phase: Phase): ProcessKPI {
  const hasTrigger = phase.tags.some((t) => t.type === 'TRG');
  const hasAgent = phase.tags.some((t) => t.type === 'AGT');
  const hasTool = phase.tags.some((t) => t.type === 'TOL');
  const hasOutput = phase.tags.some((t) => t.type === 'OUT');

  // Stima intelligente basata sui tag
  let timeManual = 15;
  let timeAuto = 2;
  let errorManual = 5;
  let errorAuto = 1;
  let costManual = 10;
  let costAuto = 2;
  let volume = 10;

  if (hasTrigger) {
    timeManual = 5;
    timeAuto = 0.1;
    errorManual = 2;
    errorAuto = 0.1;
    costManual = 3;
    costAuto = 0.5;
  }
  if (hasAgent) {
    timeManual = 30;
    timeAuto = 3;
    errorManual = 15;
    errorAuto = 2;
    costManual = 25;
    costAuto = 5;
  }
  if (hasTool) {
    timeManual = 20;
    timeAuto = 1;
    errorManual = 8;
    errorAuto = 0.5;
    costManual = 15;
    costAuto = 3;
  }
  if (hasOutput) {
    timeManual = 10;
    timeAuto = 1;
    errorManual = 5;
    errorAuto = 0.5;
    costManual = 8;
    costAuto = 1;
  }

  return {
    phaseId: phase.id,
    timeManualMinutes: timeManual,
    timeAutoMinutes: timeAuto,
    errorRateManual: errorManual,
    errorRateAuto: errorAuto,
    costManualEur: costManual,
    costAutoEur: costAuto,
    volumePerDay: volume,
  };
}

/**
 * Calcola risultati KPI aggregati per l'intero processo
 */
export function calculateKPIResults(
  phases: Phase[],
  kpis: Record<string, ProcessKPI>
): KPIResults {
  const phaseResults: PhaseKPIResult[] = [];

  let totalTimeManual = 0;
  let totalTimeAuto = 0;
  let totalCostManual = 0;
  let totalCostAuto = 0;
  let totalErrorManual = 0;
  let totalErrorAuto = 0;

  for (const phase of phases) {
    const kpi = kpis[phase.id];
    if (!kpi) continue;

    const timeSaved = kpi.timeManualMinutes - kpi.timeAutoMinutes;
    const timeSavedPct = kpi.timeManualMinutes > 0
      ? (timeSaved / kpi.timeManualMinutes) * 100
      : 0;
    const costSaved = kpi.costManualEur - kpi.costAutoEur;
    const errorReduction = kpi.errorRateManual - kpi.errorRateAuto;

    // Punteggio efficienza: media pesata di tempo, errori e costi
    const timeScore = Math.min(timeSavedPct, 100);
    const errorScore = kpi.errorRateManual > 0
      ? Math.min((errorReduction / kpi.errorRateManual) * 100, 100)
      : 100;
    const costScore = kpi.costManualEur > 0
      ? Math.min((costSaved / kpi.costManualEur) * 100, 100)
      : 100;
    const efficiencyScore = Math.round((timeScore * 0.4 + errorScore * 0.3 + costScore * 0.3));

    phaseResults.push({
      phaseId: phase.id,
      phaseName: phase.name,
      timeSavedMinutes: timeSaved,
      timeSavedPercent: Math.round(timeSavedPct),
      errorReduction: Math.round(errorReduction * 10) / 10,
      costSavedEur: Math.round(costSaved * 100) / 100,
      efficiencyScore,
    });

    totalTimeManual += kpi.timeManualMinutes * kpi.volumePerDay;
    totalTimeAuto += kpi.timeAutoMinutes * kpi.volumePerDay;
    totalCostManual += kpi.costManualEur * kpi.volumePerDay;
    totalCostAuto += kpi.costAutoEur * kpi.volumePerDay;
    totalErrorManual += kpi.errorRateManual;
    totalErrorAuto += kpi.errorRateAuto;
  }

  const totalTimeSaved = totalTimeManual - totalTimeAuto;
  const totalTimeSavedPct = totalTimeManual > 0
    ? (totalTimeSaved / totalTimeManual) * 100
    : 0;
  const totalCostSaved = totalCostManual - totalCostAuto;
  const totalCostSavedPct = totalCostManual > 0
    ? (totalCostSaved / totalCostManual) * 100
    : 0;
  const totalErrorReduction = totalErrorManual - totalErrorAuto;

  // ROI: (risparmio annuale - costo auto annuale) / costo auto annuale * 100
  const annualSaving = totalCostSaved * 365;
  const annualAutoCost = totalCostAuto * 365;
  const roiPercent = annualAutoCost > 0
    ? (annualSaving / annualAutoCost) * 100
    : totalCostSaved > 0 ? 999 : 0;

  // Payback: costo setup stimato / risparmio giornaliero
  const estimatedSetupCost = phases.length * 500; // ~500 EUR per fase di setup
  const paybackDays = totalCostSaved > 0
    ? Math.ceil(estimatedSetupCost / totalCostSaved)
    : 999;

  return {
    totalTimeSavedMinutes: Math.round(totalTimeSaved),
    totalTimeSavedPercent: Math.round(totalTimeSavedPct),
    totalErrorReduction: Math.round(totalErrorReduction * 10) / 10,
    totalCostSavedEur: Math.round(totalCostSaved * 100) / 100,
    totalCostSavedPercent: Math.round(totalCostSavedPct),
    roiPercent: Math.round(roiPercent),
    paybackDays,
    phaseResults,
  };
}

/**
 * Suggerimenti KPI basati sui risultati
 */
export function getKPISuggestions(results: KPIResults): string[] {
  const suggestions: string[] = [];

  if (results.totalTimeSavedPercent < 50) {
    suggestions.push('Il risparmio di tempo e\' sotto il 50%. Valuta se alcune fasi possono essere ulteriormente automatizzate.');
  }

  if (results.paybackDays > 180) {
    suggestions.push('Il tempo di payback supera 6 mesi. Considera di partire con le fasi a ROI piu\' alto.');
  }

  const lowEfficiency = results.phaseResults.filter((p) => p.efficiencyScore < 40);
  if (lowEfficiency.length > 0) {
    suggestions.push(
      `Le fasi "${lowEfficiency.map((p) => p.phaseName).join('", "')}" hanno efficienza bassa. Rivedi i parametri.`
    );
  }

  if (results.totalErrorReduction < 5) {
    suggestions.push('La riduzione errori e\' minima. L\'automazione potrebbe non essere giustificata solo per la qualita\'.');
  }

  if (results.roiPercent > 300) {
    suggestions.push('ROI eccellente! Questo processo e\' un ottimo candidato per l\'automazione prioritaria.');
  }

  return suggestions;
}

/**
 * Genera dati per il PDF report KPI (lato client)
 */
export function generateKPIPDFData(
  processName: string,
  phases: Phase[],
  kpis: Record<string, ProcessKPI>,
  results: KPIResults
) {
  return {
    processName,
    generatedAt: new Date().toISOString(),
    summary: {
      totalPhases: phases.length,
      phasesWithKPI: Object.keys(kpis).length,
      timeSaved: `${results.totalTimeSavedMinutes} min/giorno (${results.totalTimeSavedPercent}%)`,
      costSaved: `${results.totalCostSavedEur} EUR/giorno (${results.totalCostSavedPercent}%)`,
      errorReduction: `${results.totalErrorReduction}% riduzione errori`,
      roi: `${results.roiPercent}%`,
      payback: `${results.paybackDays} giorni`,
    },
    phases: results.phaseResults,
  };
}

/**
 * Genera PDF lato client con jsPDF
 */
export async function generateKPIPDF(
  processName: string,
  phases: Phase[],
  kpis: Record<string, ProcessKPI>,
  results: KPIResults
): Promise<Blob> {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF();

  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 20;

  // Header
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('Report KPI Automazione', pageWidth / 2, y, { align: 'center' });
  y += 10;

  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.text(processName, pageWidth / 2, y, { align: 'center' });
  y += 8;

  doc.setFontSize(10);
  doc.setTextColor(128);
  doc.text(`Generato il ${new Date().toLocaleDateString('it-IT')}`, pageWidth / 2, y, { align: 'center' });
  doc.setTextColor(0);
  y += 15;

  // Linea separatore
  doc.setDrawColor(200);
  doc.line(20, y, pageWidth - 20, y);
  y += 10;

  // Summary box
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Riepilogo', 20, y);
  y += 10;

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');

  const summaryItems = [
    [`Tempo risparmiato:`, `${results.totalTimeSavedMinutes} min/giorno (${results.totalTimeSavedPercent}%)`],
    [`Costi risparmiati:`, `${results.totalCostSavedEur} EUR/giorno (${results.totalCostSavedPercent}%)`],
    [`Riduzione errori:`, `${results.totalErrorReduction}%`],
    [`ROI:`, `${results.roiPercent}%`],
    [`Payback:`, `${results.paybackDays} giorni`],
  ];

  for (const [label, value] of summaryItems) {
    doc.setFont('helvetica', 'bold');
    doc.text(label, 25, y);
    doc.setFont('helvetica', 'normal');
    doc.text(value, 85, y);
    y += 7;
  }

  y += 10;

  // Dettaglio per fase
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Dettaglio per Fase', 20, y);
  y += 10;

  for (const phaseResult of results.phaseResults) {
    // Controlla se serve nuova pagina
    if (y > 260) {
      doc.addPage();
      y = 20;
    }

    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(phaseResult.phaseName, 25, y);

    // Barra efficienza
    const barX = 130;
    const barWidth = 50;
    const barHeight = 5;
    doc.setDrawColor(200);
    doc.rect(barX, y - 4, barWidth, barHeight);
    const fillWidth = (phaseResult.efficiencyScore / 100) * barWidth;
    if (phaseResult.efficiencyScore >= 70) {
      doc.setFillColor(76, 175, 80); // green
    } else if (phaseResult.efficiencyScore >= 40) {
      doc.setFillColor(255, 193, 7); // yellow
    } else {
      doc.setFillColor(244, 67, 54); // red
    }
    doc.rect(barX, y - 4, fillWidth, barHeight, 'F');
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(`${phaseResult.efficiencyScore}%`, barX + barWidth + 3, y);
    y += 7;

    doc.setFontSize(9);
    doc.text(`Tempo: -${phaseResult.timeSavedMinutes} min (${phaseResult.timeSavedPercent}%)  |  Errori: -${phaseResult.errorReduction}%  |  Costi: -${phaseResult.costSavedEur} EUR`, 30, y);
    y += 10;
  }

  // Footer
  y += 5;
  doc.setDrawColor(200);
  doc.line(20, y, pageWidth - 20, y);
  y += 8;
  doc.setFontSize(9);
  doc.setTextColor(128);
  doc.text('Antigravity AI Training Platform - Report generato automaticamente', pageWidth / 2, y, { align: 'center' });

  return doc.output('blob');
}
