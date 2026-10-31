import React from 'react';

interface DistributionChartProps {
  idealDist: Record<string, number>;
  noisyDist?: Record<string, number>;
  counterfactualDist?: Record<string, number>;
  uncertaintyBounds?: Record<string, { ci_95_lower: number; ci_95_upper: number; uncertainty_half_width: number }>;
  tvDistance?: number;
}

export const DistributionChart: React.FC<DistributionChartProps> = ({
  idealDist,
  noisyDist,
  counterfactualDist,
  uncertaintyBounds,
  tvDistance
}) => {
  // Collect all unique outcome bitstrings
  const allStates = Array.from(new Set([
    ...Object.keys(idealDist),
    ...(noisyDist ? Object.keys(noisyDist) : []),
    ...(counterfactualDist ? Object.keys(counterfactualDist) : [])
  ])).sort();

  return (
    <div className="bg-[#0d111a] border border-[#1e2638] rounded-lg p-5">
      <div className="flex items-center justify-between pb-3 border-b border-[#1e2638] mb-4">
        <div>
          <h4 className="text-sm font-semibold text-slate-100 tracking-tight">Measurement Distribution Comparison</h4>
          <p className="text-xs text-slate-400">Computational basis state probabilities across execution modes</p>
        </div>
        <div className="flex items-center space-x-4 text-xs font-mono">
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded-sm bg-cyan-400" />
            <span className="text-slate-300">Ideal</span>
          </div>
          {noisyDist && (
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded-sm bg-orange-500" />
              <span className="text-slate-300">Noisy (Physical)</span>
            </div>
          )}
          {counterfactualDist && (
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded-sm bg-emerald-400" />
              <span className="text-slate-300">Counterfactual</span>
            </div>
          )}
        </div>
      </div>

      {/* Aligned Bar Rows */}
      <div className="space-y-4 my-2">
        {allStates.map((state) => {
          const idealP = idealDist[state] || 0.0;
          const noisyP = noisyDist ? (noisyDist[state] || 0.0) : null;
          const cfP = counterfactualDist ? (counterfactualDist[state] || 0.0) : null;
          const bounds = uncertaintyBounds?.[state];

          return (
            <div key={state} className="group">
              <div className="flex items-center justify-between text-xs font-mono mb-1">
                <span className="font-bold text-cyan-300 bg-[#131926] px-1.5 py-0.5 rounded border border-[#1e2638]">
                  |{state}⟩
                </span>
                <div className="flex items-center space-x-3 text-[11px] text-slate-400">
                  <span>Ideal: <strong className="text-cyan-400">{(idealP * 100).toFixed(1)}%</strong></span>
                  {noisyP !== null && (
                    <span>Noisy: <strong className="text-orange-400">{(noisyP * 100).toFixed(1)}%</strong></span>
                  )}
                  {cfP !== null && (
                    <span>What-If: <strong className="text-emerald-400">{(cfP * 100).toFixed(1)}%</strong></span>
                  )}
                </div>
              </div>

              {/* Progress Bar Bars */}
              <div className="space-y-1">
                {/* Ideal Bar */}
                <div className="w-full bg-[#131926] h-2.5 rounded-full overflow-hidden flex items-center">
                  <div
                    className="bg-cyan-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, Math.max(2, idealP * 100))}%` }}
                  />
                </div>

                {/* Noisy Bar */}
                {noisyP !== null && (
                  <div className="relative w-full bg-[#131926] h-2.5 rounded-full overflow-hidden flex items-center">
                    <div
                      className="bg-orange-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, Math.max(2, noisyP * 100))}%` }}
                    />
                    {bounds && (
                      <div
                        className="absolute h-full border-r-2 border-orange-300 opacity-80"
                        style={{ left: `${bounds.ci_95_upper * 100}%` }}
                        title={`95% CI: [${(bounds.ci_95_lower * 100).toFixed(1)}%, ${(bounds.ci_95_upper * 100).toFixed(1)}%]`}
                      />
                    )}
                  </div>
                )}

                {/* Counterfactual Bar */}
                {cfP !== null && (
                  <div className="w-full bg-[#131926] h-2.5 rounded-full overflow-hidden flex items-center">
                    <div
                      className="bg-emerald-400 h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, Math.max(2, cfP * 100))}%` }}
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Explanatory Statistical Footer */}
      {tvDistance !== undefined && (
        <div className="mt-4 pt-3 border-t border-[#1e2638] flex items-center justify-between text-xs text-slate-400">
          <div>
            Total Variation Distance: <strong className="font-mono text-cyan-400">{tvDistance.toFixed(4)}</strong>
            <span className="text-slate-500 ml-1.5">
              (0.0 = identical distributions, 1.0 = completely orthogonal)
            </span>
          </div>
          <div className="text-[11px] text-slate-500 font-mono">
            N = 2,048 shots • Wilson 95% Confidence
          </div>
        </div>
      )}
    </div>
  );
};

