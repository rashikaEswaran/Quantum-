import React from 'react';

interface CircuitViewerProps {
  qubitCount: number;
  circuitDepth: number;
  gateCounts: Record<string, number>;
  code: string;
  divergenceCheckpointIndex?: number;
}

export const CircuitViewer: React.FC<CircuitViewerProps> = ({
  qubitCount,
  circuitDepth,
  gateCounts,
  code,
  divergenceCheckpointIndex
}) => {
  // Parse simple gate sequence for visual timeline
  const lines = code.split('\n');
  const gateEvents: Array<{ gate: string; qubits: number[]; target?: number }> = [];

  lines.forEach((line) => {
    const trimmed = line.trim();
    if (trimmed.startsWith('qc.h(')) {
      const q = parseInt(trimmed.match(/\d+/)?.[0] || '0', 10);
      gateEvents.push({ gate: 'H', qubits: [q] });
    } else if (trimmed.startsWith('qc.x(')) {
      const q = parseInt(trimmed.match(/\d+/)?.[0] || '0', 10);
      gateEvents.push({ gate: 'X', qubits: [q] });
    } else if (trimmed.startsWith('qc.cx(')) {
      const matches = trimmed.match(/\d+/g);
      if (matches && matches.length >= 2) {
        gateEvents.push({ gate: 'CX', qubits: [parseInt(matches[0], 10)], target: parseInt(matches[1], 10) });
      }
    } else if (trimmed.includes('measure')) {
      const matches = trimmed.match(/\d+/g);
      if (matches && matches.length >= 1) {
        gateEvents.push({ gate: 'M', qubits: [parseInt(matches[0], 10)] });
      } else {
        gateEvents.push({ gate: 'M*', qubits: Array.from({ length: qubitCount }, (_, i) => i) });
      }
    }
  });

  return (
    <div className="bg-[#0d111a] border border-[#1e2638] rounded-lg p-5">
      <div className="flex items-center justify-between pb-3 border-b border-[#1e2638] mb-4">
        <div>
          <h4 className="text-sm font-semibold text-slate-100 tracking-tight">Quantum Circuit Architecture</h4>
          <p className="text-xs text-slate-400">Qubit register rails and sequential gate operations</p>
        </div>
        <div className="flex items-center space-x-2 font-mono text-xs">
          <span className="px-2 py-0.5 bg-[#131926] text-slate-300 rounded border border-[#1e2638]">
            Qubits: <strong className="text-cyan-400">{qubitCount}</strong>
          </span>
          <span className="px-2 py-0.5 bg-[#131926] text-slate-300 rounded border border-[#1e2638]">
            Depth: <strong className="text-cyan-400">{circuitDepth}</strong>
          </span>
          <span className="px-2 py-0.5 bg-cyan-950 text-cyan-300 rounded border border-cyan-800/60">
            Gates: <strong>{Object.values(gateCounts).reduce((a, b) => a + b, 0)}</strong>
          </span>
        </div>
      </div>

      {/* Visual Qubit Wire Rails */}
      <div className="overflow-x-auto py-4">
        <div className="min-w-[480px] space-y-6">
          {Array.from({ length: Math.min(qubitCount, 6) }).map((_, qIdx) => (
            <div key={qIdx} className="relative flex items-center h-10">
              {/* Rail Label */}
              <div className="w-14 text-xs font-mono font-medium text-slate-400 shrink-0">
                q[{qIdx}] |0⟩
              </div>

              {/* Wire Line */}
              <div className="relative flex-1 h-[2px] bg-[#253047] flex items-center space-x-8 px-4">
                {gateEvents.map((event, eIdx) => {
                  const isControl = event.gate === 'CX' && event.qubits.includes(qIdx);
                  const isTarget = event.gate === 'CX' && event.target === qIdx;
                  const isSingle = event.qubits.includes(qIdx);

                  if (!isControl && !isTarget && !isSingle) return <div key={eIdx} className="w-8 shrink-0" />;

                  if (isControl) {
                    return (
                      <div key={eIdx} className="relative w-8 flex justify-center shrink-0">
                        <div className="w-3.5 h-3.5 rounded-full bg-cyan-400 ring-2 ring-[#0d111a] z-10" />
                      </div>
                    );
                  }

                  if (isTarget) {
                    return (
                      <div key={eIdx} className="relative w-8 flex justify-center shrink-0">
                        <div className="w-6 h-6 rounded-full bg-orange-500 text-black font-bold text-xs flex items-center justify-center ring-2 ring-[#0d111a] z-10">
                          ⊕
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div key={eIdx} className="relative w-8 flex justify-center shrink-0">
                      <div className={`px-2 py-1 rounded text-xs font-mono font-bold shadow-sm z-10 ${
                        event.gate === 'H' ? 'bg-[#182030] text-cyan-300 border border-cyan-500/40' :
                        event.gate === 'X' ? 'bg-[#182030] text-cyan-300 border border-cyan-500/40' :
                        'bg-[#131926] text-slate-200 border border-[#1e2638]'
                      }`}>
                        {event.gate}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Gate Summary Footer */}
      <div className="mt-3 pt-3 border-t border-[#1e2638] flex flex-wrap gap-2 text-[11px] font-mono text-slate-400">
        <span className="font-semibold text-slate-400 uppercase tracking-wider">Gate Inventory:</span>
        {Object.entries(gateCounts).map(([gate, count]) => (
          <span key={gate} className="px-2 py-0.5 bg-[#131926] rounded border border-[#1e2638] text-slate-300">
            {gate.toUpperCase()}: {count}
          </span>
        ))}
      </div>
    </div>
  );
};

