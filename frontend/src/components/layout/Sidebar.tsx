import React from 'react';
import {
  Compass,
  Code2,
  Target,
  Activity,
  Layers,
  GitCompare,
  Cpu,
  History,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles
} from 'lucide-react';

export type NavPage =
  | 'landing'
  | 'workspace'
  | 'twin'
  | 'phase1'
  | 'phase2'
  | 'unified'
  | 'hardware'
  | 'history'
  | 'settings';

interface SidebarProps {
  currentPage: NavPage;
  onNavigate: (page: NavPage) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onNavigate,
  collapsed,
  onToggleCollapse
}) => {
  const navItems: Array<{ id: NavPage; label: string; icon: any; badge?: string }> = [
    { id: 'landing', label: 'Overview', icon: Compass },
    { id: 'workspace', label: 'Quantum Workspace', icon: Code2 },
    { id: 'twin', label: '3D Digital Twin', icon: Target, badge: '3D' },
    { id: 'phase1', label: 'Phase 1: Noise Studio', icon: Activity },
    { id: 'phase2', label: 'Phase 2: Checkpoints', icon: Layers },
    { id: 'unified', label: 'Unified Diagnosis', icon: GitCompare, badge: 'AI' },
    { id: 'hardware', label: 'IBM Quantum', icon: Cpu },
    { id: 'history', label: 'Analysis History', icon: History },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside
      className={`relative h-screen bg-[#0d111a] border-r border-[#1e2638] flex flex-col justify-between transition-all duration-300 z-30 shrink-0 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div>
        <div className="h-16 flex items-center px-4 border-b border-[#1e2638]">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onNavigate('landing')}>
            <div className="w-8 h-8 rounded-lg bg-cyan-600 flex items-center justify-center text-black font-bold text-sm shadow-sm shrink-0">
              QT
            </div>
            {!collapsed && (
              <div className="overflow-hidden">
                <span className="font-bold text-sm tracking-tight text-slate-100 block truncate">
                  QuantumTrace AI
                </span>
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest block truncate">
                  Evidence Engine
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Navigation List */}
        <nav className="p-2 space-y-1 mt-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-md text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-[#162032] text-cyan-400 border border-cyan-500/40 font-semibold shadow-sm'
                    : 'text-slate-400 hover:bg-[#121824] hover:text-slate-200 border border-transparent'
                }`}
                title={collapsed ? item.label : undefined}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                {!collapsed && (
                  <span className="flex-1 text-left truncate">{item.label}</span>
                )}
                {!collapsed && item.badge && (
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/60 font-bold">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer & Collapse Toggle */}
      <div className="p-3 border-t border-[#1e2638] flex items-center justify-between">
        {!collapsed && (
          <div className="text-[11px] font-mono text-slate-500">
            v1.0.4 • Qiskit 2.x
          </div>
        )}
        <button
          onClick={onToggleCollapse}
          className="p-1.5 rounded-md text-slate-400 hover:bg-[#1a2233] hover:text-slate-200 ml-auto transition"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
    </aside>
  );
};

