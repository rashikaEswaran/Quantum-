import React from 'react';
import { AlertTriangle, CheckCircle, Info, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

interface DiagnosticSummaryCardProps {
  primaryHypothesis: string;
  executiveSummary: string;
  severity?: 'critical' | 'moderate' | 'nominal';
  evidencePoints: string[];
  recommendedAction: string;
  confidenceScore?: number;
  onTakeAction?: () => void;
  actionButtonLabel?: string;
}

export const DiagnosticSummaryCard: React.FC<DiagnosticSummaryCardProps> = ({
  primaryHypothesis,
  executiveSummary,
  severity = 'moderate',
  evidencePoints,
  recommendedAction,
  confidenceScore = 0.88,
  onTakeAction,
  actionButtonLabel = 'Investigate Cause'
}) => {
  return (
    <div className="bg-[#0d111a] border border-[#1e2638] rounded-lg p-6 shadow-sm">
      {/* Header with Severity Indicator */}
      <div className="flex items-start justify-between pb-4 border-b border-[#1e2638] mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2.5 rounded-md ${
            severity === 'critical' ? 'bg-red-950/80 text-red-400 border border-red-800/60' :
            severity === 'moderate' ? 'bg-orange-950/80 text-orange-400 border border-orange-800/60' :
            'bg-emerald-950/80 text-emerald-400 border border-emerald-800/60'
          }`}>
            {severity === 'critical' ? <AlertTriangle className="w-5 h-5" /> :
             severity === 'moderate' ? <Zap className="w-5 h-5" /> :
             <ShieldCheck className="w-5 h-5" />}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className={`text-[11px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                severity === 'critical' ? 'bg-red-950 text-red-300 border border-red-800' :
                severity === 'moderate' ? 'bg-orange-950 text-orange-300 border border-orange-800' :
                'bg-emerald-950 text-emerald-300 border border-emerald-800'
              }`}>
                {severity === 'critical' ? 'Elevated Divergence' :
                 severity === 'moderate' ? 'Statistical Anomaly Detected' : 'Nominal Fidelity'}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Calibrated Confidence: <strong className="text-cyan-400">{(confidenceScore * 100).toFixed(0)}%</strong>
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-100 mt-1">
              {primaryHypothesis}
            </h3>
          </div>
        </div>

        {onTakeAction && (
          <button
            onClick={onTakeAction}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-black text-xs font-semibold rounded transition shadow-sm"
          >
            <span>{actionButtonLabel}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Structured Answer Blocks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        {/* Left: What went wrong & context */}
        <div className="bg-[#131926] p-4 rounded-md border border-[#1e2638]">
          <h5 className="font-semibold text-slate-300 uppercase tracking-wider text-[11px] mb-1.5 flex items-center space-x-1.5">
            <Info className="w-3.5 h-3.5 text-slate-400" />
            <span>Finding Analysis</span>
          </h5>
          <p className="text-slate-300 leading-relaxed">
            {executiveSummary}
          </p>
        </div>

        {/* Right: Concrete Next Step */}
        <div className="bg-[#162032] p-4 rounded-md border border-cyan-500/30">
          <h5 className="font-semibold text-cyan-300 uppercase tracking-wider text-[11px] mb-1.5 flex items-center space-x-1.5">
            <CheckCircle className="w-3.5 h-3.5 text-cyan-400" />
            <span>Recommended Next Action</span>
          </h5>
          <p className="text-cyan-100 font-medium leading-relaxed">
            {recommendedAction}
          </p>
        </div>
      </div>

      {/* Supporting Evidence Bullets */}
      {evidencePoints.length > 0 && (
        <div className="mt-4 pt-3 border-t border-[#1e2638]">
          <h5 className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold mb-2">
            Validating Evidence
          </h5>
          <ul className="space-y-1.5 text-xs text-slate-300">
            {evidencePoints.map((ev, idx) => (
              <li key={idx} className="flex items-start space-x-2">
                <span className="text-cyan-400 font-bold">•</span>
                <span>{ev}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

