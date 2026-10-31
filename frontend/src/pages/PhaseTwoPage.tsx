import React, { useState, useEffect } from 'react';
import { Layers, ArrowRight, CheckCircle2, AlertTriangle, ShieldCheck, RefreshCw } from 'lucide-react';
import { NavPage } from '../components/layout/Sidebar';
import { CheckpointItem } from '../types';
import { api } from '../services/api';
import { DiagnosticSummaryCard } from '../components/diagnostics/DiagnosticSummaryCard';
import { WhatIfPanel } from '../components/counterfactual/WhatIfPanel';

interface PhaseTwoPageProps {
  circuitId: string;
  circuitName: string;
  onNavigate: (page: NavPage) => void;
}

export const PhaseTwoPage: React.FC<PhaseTwoPageProps> = ({
  circuitId,
  circuitName,
  onNavigate
}) => {
  const [loading, setLoading] = useState(false);
  const [checkpoints, setCheckpoints] = useState<CheckpointItem[]>([]);
  const [suspectedCp, setSuspectedCp] = useState<CheckpointItem | null>(null);
  const [selectedCpIndex, setSelectedCpIndex] = useState<number>(0);
  const [diagnosis, setDiagnosis] = useState('');

  const fetchPhase2 = async () => {
    if (!circuitId) return;
    setLoading(true);
    try {
      const res = await api.runPhase2(circuitId);
      setCheckpoints(res.checkpoints);
      setSuspectedCp(res.divergence_checkpoint || null);
      setDiagnosis(res.diagnosis);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhase2();
  }, [circuitId]);

  const activeCheckpoint = checkpoints[selectedCpIndex] || checkpoints[0];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Banner */}
      <div className="bg-[#0d111a] border border-[#1e2638] rounded-lg p-5 flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-mono font-bold uppercase px-2 py-0.5 bg-cyan-950 text-cyan-400 border border-cyan-800/60 rounded">
              Phase 2 Studio
            </span>
            <span className="text-xs text-slate-400 font-mono">Circuit: <strong className="text-slate-200">{circuitName}</strong></span>
          </div>
          <h2 className="text-lg font-bold text-slate-100 mt-1">
            Circuit Segmentation & Checkpoint Fingerprints
          </h2>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={fetchPhase2}
            disabled={loading}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-[#131926] hover:bg-[#1a2336] text-slate-200 text-xs font-medium rounded border border-[#1e2638] transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Re-Evaluate Segments</span>
          </button>
          <button
            onClick={() => onNavigate('unified')}
            className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-black text-xs font-semibold rounded shadow-sm transition"
          >
            <span>Proceed to Unified Diagnosis</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Checkpoints Timeline Rail */}
      <div className="bg-[#0d111a] border border-[#1e2638] rounded-lg p-5 space-y-4">
        <h4 className="text-sm font-bold text-slate-100 tracking-tight flex items-center justify-between">
          <span>Prefix Execution Timeline</span>
          <span className="text-xs font-mono text-slate-400">{checkpoints.length} Checkpoints Evaluated</span>
        </h4>

        {/* Timeline Pills */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {checkpoints.map((cp, idx) => {
            const isSelected = selectedCpIndex === idx;
            const isSuspect = cp.is_suspected_divergence;

            return (
              <div
                key={cp.checkpoint_index}
                onClick={() => setSelectedCpIndex(idx)}
                className={`p-4 rounded-lg border transition cursor-pointer ${
                  isSelected
                    ? 'border-cyan-400 bg-[#162032] shadow-sm'
                    : 'border-[#1e2638] bg-[#121824] hover:bg-[#182030]'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-mono mb-2">
                  <span className="font-bold text-slate-200">CP #{cp.checkpoint_index}</span>
                  {isSuspect ? (
                    <span className="px-1.5 py-0.5 rounded bg-red-950 text-red-300 border border-red-800 font-bold text-[10px]">
                      SUSPECT
                    </span>
                  ) : (
                    <span className="text-slate-500 text-[10px]">Prefix</span>
                  )}
                </div>

                <div className="text-xs font-semibold text-slate-100 truncate mb-1">
                  {cp.name}
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mt-2 pt-2 border-t border-[#1e2638]">
                  <span>TV Distance:</span>
                  <strong className={cp.total_variation_distance > 0.08 ? 'text-orange-400 font-bold' : 'text-cyan-400'}>
                    {cp.total_variation_distance.toFixed(4)}
                  </strong>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Checkpoint Detailed Comparison */}
      {activeCheckpoint && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-[#0d111a] border border-[#1e2638] rounded-lg p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#1e2638]">
              <div>
                <h4 className="text-sm font-bold text-slate-100">{activeCheckpoint.name}</h4>
                <p className="text-xs text-slate-400 font-mono">
                  Involved Qubits: {activeCheckpoint.involved_qubits.join(', ')} • End Gate: #{activeCheckpoint.gate_range_end}
                </p>
              </div>
              <span className={`px-2 py-0.5 rounded text-xs font-mono font-bold ${
                activeCheckpoint.is_suspected_divergence
                  ? 'bg-red-950 text-red-300 border border-red-800'
                  : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
              }`}>
                {activeCheckpoint.is_suspected_divergence ? 'Initial Divergence Frontier' : 'Coherent Evolution'}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs font-mono text-center">
              <div className="bg-[#131926] p-2.5 rounded border border-[#1e2638]">
                <span className="text-[10px] text-slate-400 uppercase block">Total Variation</span>
                <span className="font-bold text-cyan-400">{activeCheckpoint.total_variation_distance.toFixed(4)}</span>
              </div>
              <div className="bg-[#131926] p-2.5 rounded border border-[#1e2638]">
                <span className="text-[10px] text-slate-400 uppercase block">Hellinger</span>
                <span className="font-bold text-slate-200">{activeCheckpoint.hellinger_distance.toFixed(4)}</span>
              </div>
              <div className="bg-[#131926] p-2.5 rounded border border-[#1e2638]">
                <span className="text-[10px] text-slate-400 uppercase block">JSD</span>
                <span className="font-bold text-slate-200">{activeCheckpoint.jensen_shannon_divergence.toFixed(4)}</span>
              </div>
            </div>

            {/* Checkpoint Fingerprints */}
            <div className="p-3 bg-[#121824] rounded border border-[#1e2638] space-y-1 text-xs font-mono">
              <div className="text-slate-400 text-[10px] uppercase font-bold">Checkpoint Fingerprints</div>
              <div className="truncate text-slate-200">Ideal FP: <span className="text-slate-400">{activeCheckpoint.ideal_fingerprint_hash}</span></div>
              <div className="truncate text-slate-200">Noisy FP: <span className="text-orange-400">{activeCheckpoint.noisy_fingerprint_hash}</span></div>
            </div>
          </div>

          {/* Segment Diagnostic Card */}
          <DiagnosticSummaryCard
            primaryHypothesis={
              activeCheckpoint.is_suspected_divergence
                ? `Earliest Divergence Pinpointed at ${activeCheckpoint.name}`
                : 'Checkpoint Maintains Coherent Quantum Prefix'
            }
            executiveSummary={diagnosis}
            severity={activeCheckpoint.is_suspected_divergence ? 'critical' : 'nominal'}
            evidencePoints={[
              `Prefix divergence metric TV = ${activeCheckpoint.total_variation_distance.toFixed(4)}`,
              `Involved Qubits: [${activeCheckpoint.involved_qubits.join(', ')}]`,
              'Computed via exact prefix state preparation without destructive intermediate measurement collapse.'
            ]}
            recommendedAction="Inspect the entangling instructions immediately preceding this cut boundary."
            onTakeAction={() => onNavigate('unified')}
            actionButtonLabel="View Unified Diagnosis"
          />
        </div>
      )}

      {/* Segment What-If Panel */}
      <WhatIfPanel circuitId={circuitId} />
    </div>
  );
};

