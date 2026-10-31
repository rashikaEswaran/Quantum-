import React from 'react';
import { Cpu, Plus, Sparkles, FileText, CheckCircle2 } from 'lucide-react';
import { NavPage } from './Sidebar';

interface HeaderProps {
  currentPage: NavPage;
  onNavigate: (page: NavPage) => void;
  activeCircuitName?: string;
  onOpenReport?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPage,
  onNavigate,
  activeCircuitName,
  onOpenReport
}) => {
  const pageTitles: Record<NavPage, { title: string; subtitle: string }> = {
    landing: { title: 'Trace the Quantum. Find the Why.', subtitle: 'Evidence-driven quantum software debugging platform' },
    workspace: { title: 'Quantum Workspace', subtitle: 'Program input, static inspection, and simulation configuration' },
    twin: { title: '3D Quantum Digital Twin & Microwave Bus Cockpit', subtitle: 'Hardware dilution stage, RF helical coils, and waveguide resonator telemetry' },
    phase1: { title: 'Phase 1: Noise Studio', subtitle: 'Global ideal vs noise-aware distribution and divergence tracking' },
    phase2: { title: 'Phase 2: Checkpoint Segmentation', subtitle: 'Prefix execution and earliest divergence boundary detection' },
    unified: { title: 'Unified Evidence Diagnosis', subtitle: 'Synthesized hypotheses, automated code repair, and causal explanations' },
    hardware: { title: 'IBM Quantum QPUs', subtitle: 'Backend discovery, calibration telemetry, and confirmed hardware dispatch' },
    history: { title: 'Experiment Audit History', subtitle: 'Persistent fingerprint records, comparisons, and child experiments' },
    settings: { title: 'Platform Settings', subtitle: 'IBM Quantum tokens, simulation thresholds, and AI reasoning adapters' },
  };

  const { title, subtitle } = pageTitles[currentPage] || { title: 'QuantumTrace AI', subtitle: '' };

  return (
    <header className="h-16 bg-[#0d111a] border-b border-[#1e2638] px-6 flex items-center justify-between z-20 shrink-0">
      <div>
        <h1 className="text-sm font-bold text-slate-100 leading-none">{title}</h1>
        <p className="text-[11px] text-slate-400 mt-1 leading-none">{subtitle}</p>
      </div>

      <div className="flex items-center space-x-3">
        {/* Active Circuit Indicator */}
        {activeCircuitName && (
          <div className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1 bg-[#131926] rounded text-xs font-mono text-slate-300 border border-[#1e2638]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Active: <strong className="text-cyan-400">{activeCircuitName}</strong></span>
          </div>
        )}

        {/* IBM Hardware Pill */}
        <div
          onClick={() => onNavigate('hardware')}
          className="flex items-center space-x-1.5 px-2.5 py-1 bg-[#131926] hover:bg-[#1a2336] rounded text-xs font-mono text-cyan-400 border border-[#1e2638] cursor-pointer transition"
          title="Click to view IBM Quantum topology"
        >
          <Cpu className="w-3.5 h-3.5 text-cyan-400" />
          <span>IBM: Heavy-Hex (Connected)</span>
        </div>

        {/* Audit Report Button */}
        {onOpenReport && (
          <button
            onClick={onOpenReport}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-[#131926] hover:bg-[#1a2336] text-slate-200 text-xs font-medium rounded border border-[#1e2638] transition"
          >
            <FileText className="w-3.5 h-3.5 text-slate-400" />
            <span>Export Report</span>
          </button>
        )}

        {/* New Analysis Action */}
        <button
          onClick={() => onNavigate('workspace')}
          className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-black text-xs font-semibold rounded shadow-sm transition"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Analysis</span>
        </button>
      </div>
    </header>
  );
};

