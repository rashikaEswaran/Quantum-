import React, { useState, useEffect } from 'react';
import { GitCompare, CheckCircle2, AlertTriangle, Wrench, FileText, Check, ArrowRight, ShieldCheck, Terminal } from 'lucide-react';
import { NavPage } from '../components/layout/Sidebar';
import { UnifiedDiagnosisResult, CandidateRepairResult } from '../types';
import { api } from '../services/api';
import { DiagnosticSummaryCard } from '../components/diagnostics/DiagnosticSummaryCard';
import { ReportModal } from '../components/reports/ReportModal';

interface UnifiedDiagnosisPageProps {
  circuitId: string;
  circuitName: string;
  onNavigate: (page: NavPage) => void;
  onApplyRepair?: (newCode: string) => void;
}

export const UnifiedDiagnosisPage: React.FC<UnifiedDiagnosisPageProps> = ({
  circuitId,
  circuitName,
  onNavigate,
  onApplyRepair
}) => {
  const [loading, setLoading] = useState(false);
  const [diagnosis, setDiagnosis] = useState<UnifiedDiagnosisResult | null>(null);
  const [repair, setRepair] = useState<CandidateRepairResult | null>(null);
  const [repairApplied, setRepairApplied] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  useEffect(() => {
    if (!circuitId) return;
    setLoading(true);
    api.getUnifiedDiagnosis(circuitId)
      .then((data) => {
        setDiagnosis(data);
        return api.proposeRepair(circuitId, data.diagnosis_id);
      })
      .then((rep) => setRepair(rep))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [circuitId]);

  const handleAcceptRepair = () => {
    if (!repair) return;
    setRepairApplied(true);
    if (onApplyRepair) {
      onApplyRepair(repair.repaired_code);
    }
  };

  const uni = diagnosis?.unified_result;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Banner */}
      <div className="bg-[#0d111a] border border-[#1e2638] rounded-lg p-5 flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-mono font-bold uppercase px-2 py-0.5 bg-cyan-950 text-cyan-400 border border-cyan-800/60 rounded">
              Unified Diagnosis Engine
            </span>
            <span className="text-xs text-slate-400 font-mono">Circuit: <strong className="text-slate-200">{circuitName}</strong></span>
          </div>
          <h2 className="text-lg font-bold text-slate-100 mt-1">
            Synthesized Evidence & Automated Code Repair
          </h2>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowReportModal(true)}
            className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 bg-[#131926] hover:bg-[#1a2336] text-slate-200 text-xs font-medium rounded border border-[#1e2638] shadow-sm transition"
          >
            <FileText className="w-3.5 h-3.5 text-cyan-400" />
            <span>Generate Audit Report</span>
          </button>
        </div>
      </div>

      {/* Primary Diagnosis & Evidence Card */}
      {uni && (
        <DiagnosticSummaryCard
          primaryHypothesis={uni.primary_hypothesis}
          executiveSummary={uni.executive_summary}
          severity={uni.confidence_category === 'High Evidence' ? 'critical' : 'moderate'}
          evidencePoints={[
            `Phase 1 Total Variation Distance: TV = ${diagnosis?.phase1_stats.total_variation_distance.toFixed(4)}`,
            `Phase 2 Suspected Frontier: ${diagnosis?.phase2_divergence?.name || 'Uniform distribution divergence across layers'}`,
            `Cross-phase status: ${uni.agreements.length > 0 ? uni.agreements[0] : 'Evaluated independently'}`
          ]}
          recommendedAction={uni.recommended_next_action}
          confidenceScore={uni.confidence_value}
        />
      )}

      {/* Cross-Phase Agreement & Disagreement Box */}
      {uni && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Agreement */}
          <div className="bg-[#0d111a] border border-[#1e2638] rounded-lg p-5">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 flex items-center space-x-1.5 mb-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Cross-Phase Evidence Agreement</span>
            </h4>
            <ul className="text-xs text-slate-300 space-y-1.5">
              {uni.agreements.length > 0 ? (
                uni.agreements.map((ag, i) => <li key={i}>• {ag}</li>)
              ) : (
                <li>No direct conflicting correlations detected.</li>
              )}
            </ul>
          </div>

          {/* Disagreements / Nuances */}
          <div className="bg-[#0d111a] border border-[#1e2638] rounded-lg p-5">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 flex items-center space-x-1.5 mb-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Evidence Disagreements & Caveats</span>
            </h4>
            <ul className="text-xs text-slate-300 space-y-1.5">
              {uni.disagreements.length > 0 ? (
                uni.disagreements.map((dis, i) => <li key={i}>• {dis}</li>)
              ) : (
                <li>Phase 1 global divergence aligns with Phase 2 prefix progression.</li>
              )}
            </ul>
          </div>
        </div>
      )}

      {/* Ranked Hypotheses Table */}
      {uni && (
        <div className="bg-[#0d111a] border border-[#1e2638] rounded-lg p-5 space-y-3">
          <h4 className="text-sm font-bold text-slate-100 tracking-tight">
            Directed Causal Hypotheses Ranking
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-[#1e2638] bg-[#121824] font-mono text-slate-400">
                  <th className="py-2.5 px-3">Rank</th>
                  <th className="py-2.5 px-3">Candidate Cause</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Calibrated Score</th>
                  <th className="py-2.5 px-3">Evidence Provenance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e2638]">
                {uni.ranked_hypotheses.map((h) => (
                  <tr key={h.rank} className="hover:bg-[#162032] transition">
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-200">#{h.rank}</td>
                    <td className="py-2.5 px-3 font-semibold text-slate-100">{h.hypothesis}</td>
                    <td className="py-2.5 px-3 text-slate-400 font-mono">{h.category}</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-cyan-400">
                      {(h.calibrated_score * 100).toFixed(0)}%
                    </td>
                    <td className="py-2.5 px-3 text-slate-400 text-[11px]">{h.provenance}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Automated Code Repair Section */}
      {repair && (
        <div className="bg-[#0d111a] border border-[#1e2638] rounded-lg p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#1e2638]">
            <div>
              <h4 className="text-sm font-bold text-slate-100 flex items-center space-x-1.5">
                <Wrench className="w-4 h-4 text-cyan-400" />
                <span>Automated Code Repair Proposal</span>
              </h4>
              <p className="text-xs text-slate-400">{repair.patch_description}</p>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-0.5 rounded text-xs font-mono font-bold ${
                repair.validation_status === 'passed' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-red-950 text-red-300 border border-red-800'
              }`}>
                Validation: {repair.validation_status.toUpperCase()}
              </span>
              <button
                onClick={handleAcceptRepair}
                disabled={repairApplied}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-black text-xs font-semibold rounded shadow-sm transition disabled:bg-emerald-600"
              >
                <Check className="w-3.5 h-3.5" />
                <span>{repairApplied ? 'Patch Applied to Workspace' : 'Approve & Apply Repair'}</span>
              </button>
            </div>
          </div>

          {/* Unified Diff View */}
          <div className="font-mono text-xs bg-[#070a0f] text-cyan-300 rounded-md p-4 overflow-x-auto border border-[#1e2638]">
            <pre className="text-xs leading-relaxed">
              {repair.diff_text || 'No textual changes required.'}
            </pre>
          </div>
        </div>
      )}

      {/* Report Modal */}
      <ReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        circuitId={circuitId}
        circuitName={circuitName}
      />
    </div>
  );
};

