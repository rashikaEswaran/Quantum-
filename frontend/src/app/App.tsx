import React, { useState } from 'react';
import { Sidebar, NavPage } from '../components/layout/Sidebar';
import { Header } from '../components/layout/Header';
import { LandingPage } from '../pages/LandingPage';
import { WorkspacePage } from '../pages/WorkspacePage';
import { PhaseOnePage } from '../pages/PhaseOnePage';
import { PhaseTwoPage } from '../pages/PhaseTwoPage';
import { UnifiedDiagnosisPage } from '../pages/UnifiedDiagnosisPage';
import { HardwarePage } from '../pages/HardwarePage';
import { ExperimentHistoryPage } from '../pages/ExperimentHistoryPage';
import { SettingsPage } from '../pages/SettingsPage';
import { DigitalTwinCanvas } from '../components/digital-twin/DigitalTwinCanvas';
import { ReportModal } from '../components/reports/ReportModal';

export const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<NavPage>('landing');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeCircuitId, setActiveCircuitId] = useState<string>('circ-bell-default');
  const [activeCircuitName, setActiveCircuitName] = useState<string>('bell_state_investigation');
  const [activeSourceCode, setActiveSourceCode] = useState<string>(`from qiskit import QuantumCircuit

qc = QuantumCircuit(2, 2)
qc.h(0)
qc.cx(0, 1)
qc.measure(0, 0)
qc.measure(1, 1)
`);
  const [showReportModal, setShowReportModal] = useState(false);

  const handleCircuitReady = (id: string, name: string, code: string) => {
    setActiveCircuitId(id);
    setActiveCircuitName(name);
    setActiveSourceCode(code);
  };

  const handleApplyRepair = (repairedCode: string) => {
    setActiveSourceCode(repairedCode);
    setCurrentPage('workspace');
  };

  return (
    <div className="flex h-screen bg-[#090c12] text-slate-100 overflow-hidden font-sans">
      {/* Sidebar */}
      <Sidebar
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main App Container */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[#090c12]">
        {/* Header */}
        <Header
          currentPage={currentPage}
          onNavigate={setCurrentPage}
          activeCircuitName={activeCircuitName}
          onOpenReport={() => setShowReportModal(true)}
        />

        {/* Scrollable Viewport */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-[#090c12]">
          {currentPage === 'landing' && <LandingPage onNavigate={setCurrentPage} />}
          {currentPage === 'workspace' && (
            <WorkspacePage
              onNavigate={setCurrentPage}
              onCircuitReady={handleCircuitReady}
            />
          )}
          {currentPage === 'twin' && (
            <div className="space-y-4 max-w-7xl mx-auto">
              <DigitalTwinCanvas
                executionState="simulating"
                activeQubits={[0, 1]}
                fingerprintHash="911c33b1a16f1185fa78bc901a"
              />
            </div>
          )}
          {currentPage === 'phase1' && (
            <PhaseOnePage
              circuitId={activeCircuitId}
              circuitName={activeCircuitName}
              onNavigate={setCurrentPage}
            />
          )}
          {currentPage === 'phase2' && (
            <PhaseTwoPage
              circuitId={activeCircuitId}
              circuitName={activeCircuitName}
              onNavigate={setCurrentPage}
            />
          )}
          {currentPage === 'unified' && (
            <UnifiedDiagnosisPage
              circuitId={activeCircuitId}
              circuitName={activeCircuitName}
              onNavigate={setCurrentPage}
              onApplyRepair={handleApplyRepair}
            />
          )}
          {currentPage === 'hardware' && (
            <HardwarePage
              circuitId={activeCircuitId}
              onNavigate={setCurrentPage}
            />
          )}
          {currentPage === 'history' && (
            <ExperimentHistoryPage
              onNavigate={setCurrentPage}
              onSelectCircuit={(id, name) => {
                setActiveCircuitId(id);
                setActiveCircuitName(name);
              }}
            />
          )}
          {currentPage === 'settings' && <SettingsPage />}
        </main>
      </div>

      {/* Global Report Modal */}
      <ReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        circuitId={activeCircuitId}
        circuitName={activeCircuitName}
      />
    </div>
  );
};

