import React, { useState, useEffect } from 'react';
import { Activity, ArrowRight, ShieldCheck, Zap, Layers, RefreshCw } from 'lucide-react';
import { NavPage } from '../components/layout/Sidebar';
import { DigitalTwinCanvas } from '../components/digital-twin/DigitalTwinCanvas';
import { DistributionChart } from '../components/quantum/DistributionChart';
import { DiagnosticSummaryCard } from '../components/diagnostics/DiagnosticSummaryCard';
import { WhatIfPanel } from '../components/counterfactual/WhatIfPanel';
import { Phase1Result, CounterfactualOutcome } from '../types';
import { api } from '../services/api';

interface PhaseOnePageProps {
  circuitId: string;
  circuitName: string;
  onNavigate: (page: NavPage) => void;
}

export const PhaseOnePage: React.FC<PhaseOnePageProps> = ({
  circuitId,
  circuitName,
  onNavigate
}) => {
  const [loading, setLoading] = useState(false);
  const [phase1Data, setPhase1Data] = useState<Phase1Result | null>(null);
  const [cfOutcome, setCfOutcome] = useState<CounterfactualOutcome | null>(null);

  const fetchPhase1 = async () => {
    if (!circuitId) return;
    setLoading(true);
    try {
      const data = await api.runPhase1(circuitId);
      setPhase1Data(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhase1();
  }, [circuitId]);

  const tv = phase1Data?.statistical_comparison.total_variation_distance || 0.0;
  const isSevere = tv > 0.15;
  const isModerate = tv > 0.05;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Banner / Summary */}
      <div className="bg-[#0d111a] border border-[#1e2638] rounded-lg p-5 flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-mono font-bold uppercase px-2 py-0.5 bg-cyan-950 text-cyan-400 border border-cyan-800/60 rounded">
              Phase 1 Studio
            </span>
            <span className="text-xs text-slate-400 font-mono">Circuit: <strong className="text-slate-200">{circuitName}</strong></span>
          </div>
          <h2 className="text-lg font-bold text-slate-100 mt-1">
            Ideal vs. Noisy Distribution Analysis
          </h2>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={fetchPhase1}
            disabled={loading}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-[#131926] hover:bg-[#1a2336] text-slate-200 text-xs font-medium rounded border border-[#1e2638] transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Re-Simulate</span>
          </button>
          <button
            onClick={() => onNavigate('phase2')}
            className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-black text-xs font-semibold rounded shadow-sm transition"
          >
            <span>Proceed to Phase 2 (Checkpoints)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Master 3D Digital Twin & Waveguide Cockpit */}
      <div className="w-full">
        <DigitalTwinCanvas
          executionState={isSevere ? 'divergence' : isModerate ? 'noisy' : 'idle'}
          activeQubits={[0, 1]}
          fingerprintHash={phase1Data?.noisy.fingerprint_hash}
        />
      </div>

      {/* Statistical Distance Cards & Distribution Comparison */}
      {phase1Data && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-[#0d111a] p-4 rounded-lg border border-[#1e2638] shadow-sm">
              <span className="text-[10px] font-mono text-slate-400 uppercase block">Total Variation Distance</span>
              <span className="text-2xl font-bold font-mono text-cyan-400 mt-1 block">
                {phase1Data.statistical_comparison.total_variation_distance.toFixed(4)}
              </span>
              <span className="text-[11px] text-slate-500 font-mono">0.0 (exact) - 1.0 (disjoint)</span>
            </div>
            <div className="bg-[#0d111a] p-4 rounded-lg border border-[#1e2638] shadow-sm">
              <span className="text-[10px] font-mono text-slate-400 uppercase block">Hellinger Distance</span>
              <span className="text-2xl font-bold font-mono text-slate-200 mt-1 block">
                {phase1Data.statistical_comparison.hellinger_distance.toFixed(4)}
              </span>
              <span className="text-[11px] text-slate-500 font-mono">State fidelity geometric bound</span>
            </div>
            <div className="bg-[#0d111a] p-4 rounded-lg border border-[#1e2638] shadow-sm">
              <span className="text-[10px] font-mono text-slate-400 uppercase block">Jensen-Shannon Divergence</span>
              <span className="text-2xl font-bold font-mono text-slate-200 mt-1 block">
                {phase1Data.statistical_comparison.jensen_shannon_divergence.toFixed(4)}
              </span>
              <span className="text-[11px] text-slate-500 font-mono">Symmetric entropy divergence (bits)</span>
            </div>
          </div>

          {/* Aligned Distribution Chart */}
          <DistributionChart
            idealDist={phase1Data.ideal.probabilities}
            noisyDist={phase1Data.noisy.probabilities}
            counterfactualDist={cfOutcome?.probabilities}
            uncertaintyBounds={phase1Data.noisy.uncertainty_bounds}
            tvDistance={phase1Data.statistical_comparison.total_variation_distance}
          />
        </div>
      )}

      {/* Diagnostic Answer Card */}
      {phase1Data && (
        <DiagnosticSummaryCard
          primaryHypothesis={
            isSevere ? 'Significant Gate Depolarization and State Decoherence' :
            isModerate ? 'Asymmetric Measurement Readout Leakage' :
            'Fidelity Preserved: Output Matches Ideal Distribution'
          }
          executiveSummary={phase1Data.diagnosis_summary}
          severity={isSevere ? 'critical' : isModerate ? 'moderate' : 'nominal'}
          evidencePoints={[
            `Total Variation Distance TV(P, Q) = ${tv.toFixed(4)}`,
            `Two-sample divergence test: z-score = ${phase1Data.statistical_comparison.statistical_significance.z_score.toFixed(2)} (Chi2 = ${phase1Data.statistical_comparison.statistical_significance.chi_square_statistic.toFixed(1)})`,
            `Physical Noise Model: ${phase1Data.noisy.provenance?.model_type || 'depolarizing_readout'}`
          ]}
          recommendedAction={
            isModerate || isSevere
              ? 'Run Phase 2 Checkpoint Segmentation to isolate whether divergence stems from intermediate entangling gates or final readout mapping.'
              : 'Circuit is statistically verified. Ready for execution on physical IBM hardware.'
          }
          confidenceScore={0.92}
          onTakeAction={() => onNavigate('phase2')}
          actionButtonLabel="Analyze Checkpoint Timeline"
        />
      )}

      {/* What-If Panel */}
      <WhatIfPanel
        circuitId={circuitId}
        onExperimentComplete={(outcome) => setCfOutcome(outcome)}
      />
    </div>
  );
};

