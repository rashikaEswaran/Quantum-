import React, { useState } from 'react';
import { HelpCircle, Play, CheckCircle2, Sparkles, TrendingUp, ArrowRight } from 'lucide-react';
import { api } from '../../services/api';
import { CounterfactualOutcome } from '../../types';

interface WhatIfPanelProps {
  circuitId: string;
  onExperimentComplete?: (outcome: CounterfactualOutcome) => void;
}

export const WhatIfPanel: React.FC<WhatIfPanelProps> = ({
  circuitId,
  onExperimentComplete
}) => {
  const [query, setQuery] = useState('What if readout error were reduced to 0.5%?');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [proposal, setProposal] = useState<any>(null);
  const [outcome, setOutcome] = useState<CounterfactualOutcome | null>(null);

  const templates = [
    'What if readout error were reduced to 0.5%?',
    'What if 2-qubit CNOT gate error were reduced to 0.2%?',
    'What if T1/T2 thermal relaxation times were extended 3x?'
  ];

  const handlePropose = async () => {
    if (!query.trim()) return;
    setIsEvaluating(true);
    try {
      const res = await api.proposeCounterfactual(query);
      setProposal(res.proposal);
      setOutcome(null);
    } catch (e) {
      console.error(e);
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleExecute = async () => {
    if (!circuitId) return;
    setIsEvaluating(true);
    try {
      const res = await api.executeCounterfactual(circuitId, query);
      setOutcome(res.outcome);
      if (onExperimentComplete) {
        onExperimentComplete(res.outcome);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="bg-[#0d111a] border border-[#1e2638] rounded-lg p-5">
      <div className="flex items-center justify-between pb-3 border-b border-[#1e2638] mb-4">
        <div>
          <h4 className="text-sm font-semibold text-slate-100 tracking-tight flex items-center space-x-1.5">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>What-If Counterfactual Investigation</span>
          </h4>
          <p className="text-xs text-slate-400">Ask causal questions to simulate targeted parameter interventions</p>
        </div>
        <span className="text-[11px] font-mono font-medium px-2 py-0.5 bg-cyan-950 text-cyan-400 rounded border border-cyan-800/60">
          Causal Sandbox Active
        </span>
      </div>

      {/* Query Input & Quick Templates */}
      <div className="space-y-3 mb-4">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. What if readout error were reduced to 0.5%?"
            className="flex-1 px-3.5 py-2 text-xs bg-[#131926] border border-[#1e2638] rounded-md text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-sans"
          />
          <button
            onClick={handlePropose}
            disabled={isEvaluating}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-black text-xs font-semibold rounded-md transition shadow-sm disabled:opacity-50"
          >
            {isEvaluating ? 'Evaluating...' : 'Evaluate Query'}
          </button>
        </div>

        {/* Templates Pills */}
        <div className="flex flex-wrap gap-1.5">
          {templates.map((tmpl) => (
            <button
              key={tmpl}
              onClick={() => { setQuery(tmpl); setProposal(null); setOutcome(null); }}
              className="text-[11px] px-2.5 py-1 bg-[#131926] hover:bg-[#1a2336] text-slate-300 rounded border border-[#1e2638] transition"
            >
              {tmpl}
            </button>
          ))}
        </div>
      </div>

      {/* Structured Proposal Preview (Approval Step) */}
      {proposal && !outcome && (
        <div className="bg-[#131926] border border-cyan-500/40 rounded-md p-4 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-mono font-bold text-cyan-400">EXPERIMENT PROPOSAL</span>
            <span className="text-slate-400 font-mono">
              Prioritization Score: <strong className="text-slate-100">{(proposal.prioritization_score * 100).toFixed(0)}%</strong>
            </span>
          </div>

          <div className="text-xs space-y-1 text-slate-300">
            <p><strong>Objective:</strong> {proposal.objective}</p>
            <p><strong>Feasibility:</strong> {proposal.feasibility}</p>
            <p><strong>Expected Outcome:</strong> {proposal.expected_outcome}</p>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={handleExecute}
              disabled={isEvaluating}
              className="inline-flex items-center space-x-1.5 px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-black text-xs font-semibold rounded transition shadow-sm"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Approve & Execute Counterfactual</span>
            </button>
          </div>
        </div>
      )}

      {/* Outcome Results */}
      {outcome && (
        <div className="bg-[#0f241a] border border-emerald-500/40 rounded-md p-4 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-mono font-bold text-emerald-300 flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Counterfactual Executed</span>
            </span>
            <span className="font-mono text-emerald-300 font-semibold">
              Recovery: +{outcome.fidelity_recovery_percent}% Fidelity
            </span>
          </div>
          <p className="text-emerald-100 font-medium">
            {outcome.summary_interpretation}
          </p>
          <div className="flex items-center space-x-4 pt-1 font-mono text-[11px] text-emerald-300">
            <div>TV to Ideal: <strong>{outcome.total_variation_to_ideal.toFixed(4)}</strong></div>
            <div>TV Delta: <strong>-{outcome.tv_reduction_from_baseline.toFixed(4)}</strong></div>
            <div>Fingerprint: <strong>{outcome.fingerprint_hash.slice(0, 12)}...</strong></div>
          </div>
        </div>
      )}
    </div>
  );
};

