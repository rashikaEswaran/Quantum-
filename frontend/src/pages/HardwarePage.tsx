import React, { useState, useEffect } from 'react';
import { Cpu, ShieldCheck, Activity, AlertTriangle, Key } from 'lucide-react';
import { NavPage } from '../components/layout/Sidebar';
import { HardwareTopologyMap } from '../components/hardware/HardwareTopologyMap';
import { HardwareBackend } from '../types';
import { api } from '../services/api';

interface HardwarePageProps {
  circuitId?: string;
  onNavigate: (page: NavPage) => void;
}

export const HardwarePage: React.FC<HardwarePageProps> = ({
  circuitId,
  onNavigate
}) => {
  const [backends, setBackends] = useState<HardwareBackend[]>([]);
  const [selectedBackend, setSelectedBackend] = useState('ibm_brisbane');
  const [hwStatus, setHwStatus] = useState<any>(null);

  useEffect(() => {
    api.getHardwareStatus().then(setHwStatus).catch(console.error);
    api.listHardwareBackends().then(setBackends).catch(console.error);
  }, []);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Banner */}
      <div className="bg-[#0d111a] border border-[#1e2638] rounded-lg p-5 flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-mono font-bold uppercase px-2 py-0.5 bg-cyan-950 text-cyan-400 border border-cyan-800/60 rounded">
              IBM Quantum QPUs
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Status: <strong className="text-cyan-400">{hwStatus?.status_label || 'Physical Heavy-Hex Twin Active'}</strong>
            </span>
          </div>
          <h2 className="text-lg font-bold text-slate-100 mt-1">
            Real Backend Discovery & Hardware Calibration Telemetry
          </h2>
        </div>

        <button
          onClick={() => onNavigate('settings')}
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-[#131926] hover:bg-[#1a2336] text-slate-200 text-xs font-medium rounded border border-[#1e2638] transition"
        >
          <Key className="w-3.5 h-3.5 text-cyan-400" />
          <span>Configure IBM Token</span>
        </button>
      </div>

      {/* Main Topology & Confirmation Dispatch Component */}
      <HardwareTopologyMap
        backends={backends}
        selectedBackend={selectedBackend}
        onSelectBackend={setSelectedBackend}
        circuitId={circuitId}
      />
    </div>
  );
};

