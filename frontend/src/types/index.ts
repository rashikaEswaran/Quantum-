export interface Project {
  id: string;
  name: string;
  description?: string;
  created_at: string;
}

export interface StaticFinding {
  finding_id: string;
  category: string;
  severity: 'error' | 'warning' | 'info';
  line_number?: number;
  affected_qubits: number[];
  explanation: string;
  evidence: string;
  confidence: number;
  suggested_action: string;
}

export interface QuantumCircuitRecord {
  id: string;
  project_id: string;
  name: string;
  source_code: string;
  canonical_hash: string;
  qubit_count: number;
  circuit_depth: number;
  gate_counts: Record<string, number>;
  expected_distribution?: Record<string, number>;
}

export interface SimulationResult {
  run_id: string;
  fingerprint_id: string;
  fingerprint_hash: string;
  simulation_mode: string;
  raw_counts: Record<string, number>;
  probabilities: Record<string, number>;
  observables: Record<string, number>;
  entropy: number;
  uncertainty_bounds: Record<string, {
    p: number;
    ci_95_lower: number;
    ci_95_upper: number;
    uncertainty_half_width: number;
  }>;
  execution_duration_ms: number;
  noise_provenance?: {
    model_type: string;
    provenance_source: string;
    parameters: Record<string, any>;
  };
}

export interface StatisticalComparison {
  total_variation_distance: number;
  hellinger_distance: number;
  jensen_shannon_divergence: number;
  aligned_outcomes: string[];
  distribution_p: Record<string, number>;
  distribution_q: Record<string, number>;
  statistical_significance: {
    chi_square_statistic: number;
    degrees_of_freedom: number;
    z_score: number;
    reject_null_hypothesis_at_99pct: boolean;
    significance_threshold_alpha: number;
  };
  interpretation: string;
}

export interface Phase1Result {
  investigation_id: string;
  circuit_id: string;
  ideal: {
    run_id: string;
    fingerprint_hash: string;
    probabilities: Record<string, number>;
    observables: Record<string, number>;
    uncertainty_bounds: Record<string, any>;
  };
  noisy: {
    run_id: string;
    fingerprint_hash: string;
    probabilities: Record<string, number>;
    observables: Record<string, number>;
    uncertainty_bounds: Record<string, any>;
    provenance?: any;
  };
  statistical_comparison: StatisticalComparison;
  diagnosis_summary: string;
}

export interface CheckpointItem {
  checkpoint_index: number;
  name: string;
  gate_range_end: number;
  involved_qubits: number[];
  total_variation_distance: number;
  hellinger_distance: number;
  jensen_shannon_divergence: number;
  is_suspected_divergence: boolean;
  ideal_distribution: Record<string, number>;
  noisy_distribution: Record<string, number>;
  ideal_fingerprint_hash: string;
  noisy_fingerprint_hash: string;
}

export interface CounterfactualOutcome {
  fingerprint_hash: string;
  probabilities: Record<string, number>;
  observables: Record<string, number>;
  total_variation_to_ideal: number;
  tv_reduction_from_baseline: number;
  fidelity_recovery_percent: number;
  summary_interpretation: string;
}

export interface UnifiedDiagnosisResult {
  diagnosis_id: string;
  circuit_id: string;
  unified_result: {
    executive_summary: string;
    primary_hypothesis: string;
    ranked_hypotheses: Array<{
      rank: number;
      hypothesis: string;
      evidence_strength: string;
      calibrated_score: number;
      category: string;
      provenance: string;
    }>;
    suspected_gates: string[];
    suspected_qubits: number[];
    confidence_category: string;
    confidence_value: number;
    agreements: string[];
    disagreements: string[];
    recommended_next_action: string;
  };
  llm_explanation: {
    executive_summary: string;
    primary_hypothesis: string;
    suspected_region: string;
    recommended_action: string;
    confidence_assessment: string;
  };
  phase1_stats: StatisticalComparison;
  phase2_divergence?: CheckpointItem;
}

export interface CandidateRepairResult {
  repair_id: string;
  patch_description: string;
  diff_text: string;
  repaired_code: string;
  validation_status: string;
  validation_metrics: Record<string, any>;
}

export interface HardwareBackend {
  name: string;
  num_qubits: number;
  status: string;
  pending_jobs: number;
  basis_gates: string[];
  is_simulator: boolean;
  provenance: string;
  median_t1_us?: number;
  median_t2_us?: number;
  median_readout_error?: number;
  median_cx_error?: number;
}

