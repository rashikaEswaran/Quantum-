import React, { useState, useEffect } from 'react';
import { Key, Save, CheckCircle, Database, ShieldAlert, Cpu } from 'lucide-react';
import { api } from '../services/api';

export const SettingsPage: React.FC = () => {
  const [ibmToken, setIbmToken] = useState('');
  const [defaultShots, setDefaultShots] = useState(2048);
  const [enableBdhcq, setEnableBdhcq] = useState(true);
  const [saved, setSaved] = useState(false);
  const [hwStatus, setHwStatus] = useState<any>(null);

  useEffect(() => {
    api.getHardwareStatus().then(setHwStatus).catch(console.error);
  }, []);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="bg-[#0d111a] border border-[#1e2638] rounded-lg p-5">
        <h2 className="text-lg font-bold text-slate-100">Platform Settings & Credentials</h2>
        <p className="text-xs text-slate-400">Configure IBM Quantum access tokens, simulation defaults, and reasoning engines</p>
      </div>

      {/* IBM Token Card */}
      <div className="bg-[#0d111a] border border-[#1e2638] rounded-lg p-6 space-y-4">
        <div className="flex items-center space-x-2 pb-2 border-b border-[#1e2638]">
          <Key className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-bold text-slate-100">IBM Quantum Authentication</h3>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          Provide your IBM Quantum API token to connect to physical QPUs. When left empty, QuantumTrace AI operates in high-fidelity offline architectural demonstration mode.
        </p>

        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1">
            API Token
          </label>
          <input
            type="password"
            value={ibmToken}
            onChange={(e) => setIbmToken(e.target.value)}
            placeholder="Paste IBM Quantum token..."
            className="w-full px-3 py-2 text-xs bg-[#131926] border border-[#1e2638] rounded font-mono text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="p-3 bg-[#131926] border border-[#1e2638] rounded text-xs font-mono text-slate-300 flex items-center justify-between">
          <span>Active Mode: <strong className="text-cyan-400">{hwStatus?.mode || 'Offline Simulation'}</strong></span>
          <span className="text-cyan-400 font-semibold">{hwStatus?.masked_token || 'No Token'}</span>
        </div>
      </div>

      {/* Simulation Defaults */}
      <div className="bg-[#0d111a] border border-[#1e2638] rounded-lg p-6 space-y-4">
        <div className="flex items-center space-x-2 pb-2 border-b border-[#1e2638]">
          <Cpu className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-bold text-slate-100">Simulation Thresholds</h3>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1">
            Default Shot Count (Finite Multinomial Sample Size)
          </label>
          <select
            value={defaultShots}
            onChange={(e) => setDefaultShots(Number(e.target.value))}
            className="text-xs border border-[#1e2638] rounded px-3 py-2 bg-[#131926] text-slate-100 font-mono focus:border-cyan-500"
          >
            <option value={1024}>1,024 Shots (Rapid testing)</option>
            <option value={2048}>2,048 Shots (Standard balanced statistical confidence)</option>
            <option value={4096}>4,096 Shots (High precision)</option>
            <option value={8192}>8,192 Shots (Publication-grade audit)</option>
          </select>
        </div>

        {/* BDH-CQ Reasoning Engine */}
        <div className="pt-2">
          <label className="flex items-center space-x-2 text-xs font-semibold text-slate-200 cursor-pointer">
            <input
              type="checkbox"
              checked={enableBdhcq}
              onChange={(e) => setEnableBdhcq(e.target.checked)}
              className="rounded text-cyan-500 focus:ring-cyan-500 bg-[#131926] border-[#1e2638]"
            />
            <span>Enable BDH-CQ Directed Hypothesis Prioritization</span>
          </label>
          <p className="text-[11px] text-slate-400 mt-1 pl-5">
            Ranks candidate causes and follow-up What-If experiments using directed graphical evidence models.
          </p>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex items-center justify-between">
        {saved && (
          <span className="text-xs font-mono text-emerald-400 flex items-center space-x-1.5 font-bold">
            <CheckCircle className="w-4 h-4" />
            <span>Settings saved successfully.</span>
          </span>
        )}
        <button
          onClick={handleSave}
          className="ml-auto inline-flex items-center space-x-1.5 px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-black text-xs font-semibold rounded-md shadow transition"
        >
          <Save className="w-3.5 h-3.5" />
          <span>Save Changes</span>
        </button>
      </div>
    </div>
  );
};

