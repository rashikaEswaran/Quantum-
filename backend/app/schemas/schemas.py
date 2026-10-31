from typing import Dict, List, Optional, Any
from pydantic import BaseModel, Field, ConfigDict

class ProjectCreate(BaseModel):
    name: str = Field(..., json_schema_extra={"example": "Bell State Fault Investigation"})
    description: Optional[str] = Field(None, json_schema_extra={"example": "Debugging phase shift in Bell State"})

class ProjectResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    name: str
    description: Optional[str] = None
    created_at: Any
    updated_at: Any

class CircuitSubmit(BaseModel):
    project_id: str
    name: str = Field(..., json_schema_extra={"example": "bell_circuit"})
    source_code: str
    circuit_format: str = "qiskit"
    expected_distribution: Optional[Dict[str, float]] = None

class StaticFinding(BaseModel):
    finding_id: str
    category: str
    severity: str  # "error", "warning", "info"
    line_number: Optional[int] = None
    affected_qubits: List[int] = []
    explanation: str
    evidence: str
    confidence: float
    suggested_action: str

class StaticAnalysisResult(BaseModel):
    is_valid: bool
    qubit_count: int
    clbit_count: int
    circuit_depth: int
    gate_counts: Dict[str, int]
    canonical_hash: str
    findings: List[StaticFinding]

class SimulationRequest(BaseModel):
    circuit_id: str
    simulation_mode: str = "ideal"  # "ideal", "noisy", "counterfactual"
    shot_count: int = 2048
    random_seed: Optional[int] = None
    noise_model_type: Optional[str] = "depolarizing_readout"
    noise_params: Optional[Dict[str, Any]] = None
    backend_name: Optional[str] = None

class FingerprintData(BaseModel):
    id: str
    run_id: str
    circuit_hash: str
    fingerprint_hash: str
    execution_mode: str
    summary_metrics: Dict[str, Any]
    distribution: Dict[str, float]
    uncertainty_bounds: Dict[str, Any]
    created_at: Any

class ComparisonRequest(BaseModel):
    ideal_fingerprint_id: str
    target_fingerprint_id: str

class ComparisonResult(BaseModel):
    id: str
    ideal_fingerprint_id: str
    target_fingerprint_id: str
    total_variation_distance: float
    hellinger_distance: float
    jensen_shannon_divergence: float
    kl_divergence: Optional[float] = None
    statistical_significance: Dict[str, Any]
    observable_deltas: Dict[str, Any]
    interpretation: str

class CounterfactualProposal(BaseModel):
    investigation_id: str
    user_query: str

class CounterfactualExecution(BaseModel):
    proposal_id: str
    confirm: bool = True

class HardwareJobRequest(BaseModel):
    circuit_id: str
    backend_name: str
    shot_count: int = 2048
    confirmed: bool = False

class CodeRepairRequest(BaseModel):
    circuit_id: str
    diagnosis_id: Optional[str] = None
