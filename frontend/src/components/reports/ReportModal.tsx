import React from 'react';
import { X, Download, Printer, FileText } from 'lucide-react';
import { api } from '../../services/api';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  circuitId: string;
  circuitName: string;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  circuitId,
  circuitName
}) => {
  if (!isOpen) return null;

  const htmlUrl = api.getReportExportUrl(circuitId, 'html');
  const jsonUrl = api.getReportExportUrl(circuitId, 'json');

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#0d111a] rounded-lg max-w-3xl w-full h-[85vh] flex flex-col border border-[#1e2638] shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1e2638] bg-[#121824]">
          <div className="flex items-center space-x-2.5">
            <FileText className="w-5 h-5 text-cyan-400" />
            <div>
              <h3 className="text-sm font-bold text-slate-100">QuantumTrace Audit & Investigation Report</h3>
              <p className="text-xs text-slate-400">Immutable findings for circuit: {circuitName}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <a
              href={htmlUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium border border-[#1e2638] rounded bg-[#131926] hover:bg-[#1a2336] text-slate-200"
            >
              <Printer className="w-3.5 h-3.5 text-cyan-400" />
              <span>Print / Save PDF</span>
            </a>
            <a
              href={jsonUrl}
              download={`${circuitName}_report.json`}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium bg-cyan-600 hover:bg-cyan-500 text-black font-semibold rounded"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON</span>
            </a>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-200 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Embedded Iframe Report View */}
        <div className="flex-1 w-full bg-[#080b10]">
          <iframe
            src={htmlUrl}
            title="Investigation Report"
            className="w-full h-full border-none"
          />
        </div>
      </div>
    </div>
  );
};

