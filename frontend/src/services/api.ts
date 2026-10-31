import {
  Project,
  StaticFinding,
  QuantumCircuitRecord,
  SimulationResult,
  Phase1Result,
  CheckpointItem,
  CounterfactualOutcome,
  UnifiedDiagnosisResult,
  CandidateRepairResult,
  HardwareBackend
} from '../types';

const customApiUrl = (import.meta as any)?.env?.VITE_API_URL;
const API_BASE = customApiUrl
  ? `${customApiUrl.replace(/\/+$/, '')}/api/v1`
  : '/api/v1';

export const api = {
  async getHealth() {
    const res = await fetch(`${API_BASE}/health`);
    return res.json();
  },

  async getExamples() {
    const res = await fetch(`${API_BASE}/examples`);
    return res.json();
  },

  async createProject(name: string, description?: string): Promise<Project> {
    const res = await fetch(`${API_BASE}/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description })
    });
    return res.json();
  },

  async listProjects(): Promise<Project[]> {
    const res = await fetch(`${API_BASE}/projects`);
    return res.json();
  },

  async submitCircuit(projectId: string, name: string, sourceCode: string, expected?: Record<string, number>) {
    const res = await fetch(`${API_BASE}/circuits`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        project_id: projectId,
        name,
        source_code: sourceCode,
        expected_distribution: expected
      })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail?.errors?.join(', ') || 'Failed to submit circuit');
    }
    return res.json();
  },

  async getCircuit(circuitId: string): Promise<QuantumCircuitRecord> {
    const res = await fetch(`${API_BASE}/circuits/${circuitId}`);
    return res.json();
  },

  async runSimulation(circuitId: string, mode: string = 'ideal', shotCount: number = 2048, noiseType?: string): Promise<SimulationResult> {
    const res = await fetch(`${API_BASE}/simulations/run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        circuit_id: circuitId,
        simulation_mode: mode,
        shot_count: shotCount,
        noise_model_type: noiseType
      })
    });
    return res.json();
  },

  async runPhase1(circuitId: string, noiseType: string = 'depolarizing_readout', shotCount: number = 2048): Promise<Phase1Result> {
    const res = await fetch(`${API_BASE}/phase1/investigate?circuit_id=${circuitId}&noise_model_type=${noiseType}&shot_count=${shotCount}`, {
      method: 'POST'
    });
    return res.json();
  },

  async runPhase2(circuitId: string, shotCount: number = 2048, noiseType: string = 'depolarizing_readout'): Promise<{
    checkpoints: CheckpointItem[];
    divergence_checkpoint?: CheckpointItem;
    diagnosis: string;
  }> {
    const res = await fetch(`${API_BASE}/phase2/checkpoints?circuit_id=${circuitId}&shot_count=${shotCount}&noise_model_type=${noiseType}`, {
      method: 'POST'
    });
    return res.json();
  },

  async proposeCounterfactual(userQuery: string) {
    const res = await fetch(`${API_BASE}/counterfactuals/propose`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ investigation_id: 'active', user_query: userQuery })
    });
    return res.json();
  },

  async executeCounterfactual(circuitId: string, userQuery: string, shotCount: number = 2048): Promise<{
    proposal: any;
    outcome: CounterfactualOutcome;
  }> {
    const res = await fetch(`${API_BASE}/counterfactuals/execute?circuit_id=${circuitId}&user_query=${encodeURIComponent(userQuery)}&shot_count=${shotCount}`, {
      method: 'POST'
    });
    return res.json();
  },

  async getUnifiedDiagnosis(circuitId: string, shotCount: number = 2048): Promise<UnifiedDiagnosisResult> {
    const res = await fetch(`${API_BASE}/diagnoses/unified?circuit_id=${circuitId}&shot_count=${shotCount}`, {
      method: 'POST'
    });
    return res.json();
  },

  async proposeRepair(circuitId: string, diagnosisId?: string): Promise<CandidateRepairResult> {
    const res = await fetch(`${API_BASE}/repairs/propose`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ circuit_id: circuitId, diagnosis_id: diagnosisId })
    });
    return res.json();
  },

  async getHardwareStatus() {
    const res = await fetch(`${API_BASE}/hardware/status`);
    return res.json();
  },

  async listHardwareBackends(): Promise<HardwareBackend[]> {
    const res = await fetch(`${API_BASE}/hardware/backends`);
    return res.json();
  },

  async getHardwareTopology(backendName: string) {
    const res = await fetch(`${API_BASE}/hardware/topology/${backendName}`);
    return res.json();
  },

  async submitHardwareJob(circuitId: string, backendName: string, confirmed: boolean = false, shotCount: number = 2048) {
    const res = await fetch(`${API_BASE}/hardware/jobs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        circuit_id: circuitId,
        backend_name: backendName,
        confirmed,
        shot_count: shotCount
      })
    });
    return res.json();
  },

  getReportExportUrl(circuitId: string, format: 'json' | 'html' = 'html') {
    return `${API_BASE}/reports/export/${circuitId}?format=${format}`;
  }
};

