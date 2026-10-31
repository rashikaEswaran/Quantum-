import React, { useState, useEffect } from 'react';
import { History, Search, FileText, Database, ArrowRight } from 'lucide-react';
import { NavPage } from '../components/layout/Sidebar';
import { api } from '../services/api';

interface ExperimentHistoryPageProps {
  onNavigate: (page: NavPage) => void;
  onSelectCircuit: (id: string, name: string) => void;
}

export const ExperimentHistoryPage: React.FC<ExperimentHistoryPageProps> = ({
  onNavigate,
  onSelectCircuit
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Sample verified persistent audit records
  const auditRecords = [
    {
      id: 'circ-bell-01',
      name: 'Bell State Preparation (|Φ⁺⟩)',
      mode: 'Ideal & Noisy',
      date: '2026-10-31 05:40:12 UTC',
      qubits: 2,
      depth: 2,
      tvDistance: 0.0482,
      fingerprint: '3a8f9c1b4e2d70881944e5fa69089efb3191067d26451e0f0982bb193a02fa48'
    },
    {
      id: 'circ-ghz-02',
      name: '3-Qubit GHZ Entanglement',
      mode: 'Checkpoint Analysis',
      date: '2026-10-31 05:42:30 UTC',
      qubits: 3,
      depth: 3,
      tvDistance: 0.0814,
      fingerprint: '9f24e6108adbc892a40bf593028c2e9124018bcfae910248e3092418e209148c'
    },
    {
      id: 'circ-readout-03',
      name: 'Readout Mapping Permutation Bug',
      mode: 'Unified Diagnosis',
      date: '2026-10-31 05:45:00 UTC',
      qubits: 2,
      depth: 3,
      tvDistance: 0.9920,
      fingerprint: '14b09fa29c48821908bf390192e48fa09124019240bc189204091240981bfa09'
    }
  ];

  const filtered = auditRecords.filter((r) =>
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.fingerprint.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Banner */}
      <div className="bg-[#0d111a] border border-[#1e2638] rounded-lg p-5 flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-mono font-bold uppercase px-2 py-0.5 bg-cyan-950 text-cyan-400 border border-cyan-800/60 rounded">
              Audit Trail
            </span>
            <span className="text-xs text-slate-400 font-mono">Storage: <strong className="text-cyan-400">PostgreSQL / SQLite</strong></span>
          </div>
          <h2 className="text-lg font-bold text-slate-100 mt-1">
            Persistent Experiment & Fingerprint Registry
          </h2>
        </div>

        {/* Search */}
        <div className="relative w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search fingerprints or circuits..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#131926] border border-[#1e2638] rounded-md text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-sans"
          />
        </div>
      </div>

      {/* Audit Table */}
      <div className="bg-[#0d111a] border border-[#1e2638] rounded-lg overflow-hidden shadow-sm">
        <table className="w-full text-xs text-left">
          <thead>
            <tr className="border-b border-[#1e2638] bg-[#121824] font-mono text-slate-400">
              <th className="py-3 px-4">Circuit Name</th>
              <th className="py-3 px-4">Timestamp (UTC)</th>
              <th className="py-3 px-4">Qubits / Depth</th>
              <th className="py-3 px-4">Total Variation</th>
              <th className="py-3 px-4">Canonical Fingerprint</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1e2638]">
            {filtered.map((r) => (
              <tr key={r.id} className="hover:bg-[#162032] transition">
                <td className="py-3 px-4 font-semibold text-slate-100">{r.name}</td>
                <td className="py-3 px-4 font-mono text-slate-400">{r.date}</td>
                <td className="py-3 px-4 font-mono text-slate-300">{r.qubits}Q / D={r.depth}</td>
                <td className="py-3 px-4 font-mono font-bold text-cyan-400">{r.tvDistance.toFixed(4)}</td>
                <td className="py-3 px-4 font-mono text-slate-500 text-[11px] truncate max-w-[200px]" title={r.fingerprint}>
                  {r.fingerprint.slice(0, 16)}...
                </td>
                <td className="py-3 px-4 text-right">
                  <button
                    onClick={() => {
                      onSelectCircuit(r.id, r.name);
                      onNavigate('phase1');
                    }}
                    className="inline-flex items-center space-x-1 text-xs font-mono font-bold text-cyan-400 hover:text-cyan-300 transition"
                  >
                    <span>Inspect</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

