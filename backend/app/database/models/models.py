import uuid
from datetime import datetime, timezone
from sqlalchemy import (
    Column, String, Text, Integer, Float, Boolean, DateTime, ForeignKey, JSON, Index
)
from sqlalchemy.orm import relationship
from app.database.session import Base

def gen_uuid():
    return str(uuid.uuid4())

def utc_now():
    return datetime.now(timezone.utc)

class Project(Base):
    __tablename__ = "projects"

    id = Column(String(36), primary_key=True, default=gen_uuid)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, default=utc_now)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now)

    circuits = relationship("QuantumCircuit", back_populates="project", cascade="all, delete-orphan")
    phase1_investigations = relationship("Phase1Investigation", back_populates="project", cascade="all, delete-orphan")
    phase2_investigations = relationship("Phase2Investigation", back_populates="project", cascade="all, delete-orphan")
    diagnoses = relationship("UnifiedDiagnosis", back_populates="project", cascade="all, delete-orphan")


class QuantumCircuit(Base):
    __tablename__ = "quantum_circuits"

    id = Column(String(36), primary_key=True, default=gen_uuid)
    project_id = Column(String(36), ForeignKey("projects.id"), nullable=False, index=True)
    name = Column(String(255), nullable=False)
    source_code = Column(Text, nullable=False)
    circuit_format = Column(String(50), default="qiskit")  # "qiskit", "openqasm"
    canonical_hash = Column(String(64), nullable=False, index=True)
    qubit_count = Column(Integer, default=0)
    clbit_count = Column(Integer, default=0)
    circuit_depth = Column(Integer, default=0)
    gate_counts = Column(JSON, default=dict)
    expected_distribution = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=utc_now)

    project = relationship("Project", back_populates="circuits")
    runs = relationship("SimulationRun", back_populates="circuit", cascade="all, delete-orphan")
    checkpoints = relationship("CircuitCheckpoint", back_populates="circuit", cascade="all, delete-orphan")


class SimulationRun(Base):
    __tablename__ = "simulation_runs"

    id = Column(String(36), primary_key=True, default=gen_uuid)
    circuit_id = Column(String(36), ForeignKey("quantum_circuits.id"), nullable=False, index=True)
    simulation_mode = Column(String(50), nullable=False)  # "ideal", "noisy", "counterfactual", "hardware"
    shot_count = Column(Integer, default=2048)
    random_seed = Column(Integer, nullable=True)
    noise_model_name = Column(String(255), nullable=True)
    noise_config = Column(JSON, nullable=True)
    backend_name = Column(String(255), nullable=True)
    raw_counts = Column(JSON, default=dict)
    probabilities = Column(JSON, default=dict)
    observables = Column(JSON, default=dict)
    statevector = Column(JSON, nullable=True)
    execution_duration_ms = Column(Float, default=0.0)
    status = Column(String(50), default="completed")  # "pending", "running", "completed", "failed"
    error_message = Column(Text, nullable=True)
    created_at = Column(DateTime, default=utc_now)

    circuit = relationship("QuantumCircuit", back_populates="runs")
    fingerprint = relationship("QuantumFingerprint", back_populates="run", uselist=False, cascade="all, delete-orphan")


class QuantumFingerprint(Base):
    __tablename__ = "quantum_fingerprints"

    id = Column(String(36), primary_key=True, default=gen_uuid)
    run_id = Column(String(36), ForeignKey("simulation_runs.id"), nullable=False, unique=True, index=True)
    circuit_hash = Column(String(64), nullable=False, index=True)
    fingerprint_hash = Column(String(64), nullable=False, index=True)
    schema_version = Column(String(20), default="1.0.0")
    execution_mode = Column(String(50), nullable=False)
    summary_metrics = Column(JSON, default=dict)  # entropy, purity estimate, dominant states
    distribution = Column(JSON, default=dict)
    uncertainty_bounds = Column(JSON, default=dict)  # multinomial confidence intervals
    persisted_status = Column(Boolean, default=True)
    created_at = Column(DateTime, default=utc_now)

    run = relationship("SimulationRun", back_populates="fingerprint")


class FingerprintComparison(Base):
    __tablename__ = "fingerprint_comparisons"

    id = Column(String(36), primary_key=True, default=gen_uuid)
    ideal_fingerprint_id = Column(String(36), ForeignKey("quantum_fingerprints.id"), nullable=False)
    target_fingerprint_id = Column(String(36), ForeignKey("quantum_fingerprints.id"), nullable=False)
    total_variation_distance = Column(Float, nullable=False)
    hellinger_distance = Column(Float, nullable=False)
    jensen_shannon_divergence = Column(Float, nullable=False)
    kl_divergence = Column(Float, nullable=True)
    statistical_significance = Column(JSON, default=dict)  # p_value, z_score, reject_null
    observable_deltas = Column(JSON, default=dict)
    interpretation = Column(Text, nullable=True)
    created_at = Column(DateTime, default=utc_now)


class Phase1Investigation(Base):
    __tablename__ = "phase1_investigations"

    id = Column(String(36), primary_key=True, default=gen_uuid)
    project_id = Column(String(36), ForeignKey("projects.id"), nullable=False, index=True)
    circuit_id = Column(String(36), ForeignKey("quantum_circuits.id"), nullable=False)
    ideal_run_id = Column(String(36), ForeignKey("simulation_runs.id"), nullable=True)
    noisy_run_id = Column(String(36), ForeignKey("simulation_runs.id"), nullable=True)
    comparison_id = Column(String(36), ForeignKey("fingerprint_comparisons.id"), nullable=True)
    confidence_score = Column(Float, default=0.0)
    confidence_method = Column(String(100), default="Bootstrap + TV Distance Calibration")
    suspected_causes = Column(JSON, default=list)
    diagnosis_summary = Column(Text, nullable=True)
    created_at = Column(DateTime, default=utc_now)

    project = relationship("Project", back_populates="phase1_investigations")
    counterfactuals = relationship("CounterfactualExperiment", back_populates="phase1_investigation", cascade="all, delete-orphan")


class CircuitCheckpoint(Base):
    __tablename__ = "circuit_checkpoints"

    id = Column(String(36), primary_key=True, default=gen_uuid)
    circuit_id = Column(String(36), ForeignKey("quantum_circuits.id"), nullable=False, index=True)
    checkpoint_index = Column(Integer, nullable=False)
    name = Column(String(255), nullable=False)
    gate_range_start = Column(Integer, default=0)
    gate_range_end = Column(Integer, default=0)
    involved_qubits = Column(JSON, default=list)
    prefix_code = Column(Text, nullable=False)
    ideal_fingerprint_id = Column(String(36), ForeignKey("quantum_fingerprints.id"), nullable=True)
    noisy_fingerprint_id = Column(String(36), ForeignKey("quantum_fingerprints.id"), nullable=True)
    divergence_metric = Column(Float, default=0.0)  # TV distance at this checkpoint
    is_suspected_divergence = Column(Boolean, default=False)
    created_at = Column(DateTime, default=utc_now)

    circuit = relationship("QuantumCircuit", back_populates="checkpoints")


class Phase2Investigation(Base):
    __tablename__ = "phase2_investigations"

    id = Column(String(36), primary_key=True, default=gen_uuid)
    project_id = Column(String(36), ForeignKey("projects.id"), nullable=False, index=True)
    circuit_id = Column(String(36), ForeignKey("quantum_circuits.id"), nullable=False)
    divergence_checkpoint_id = Column(String(36), nullable=True)
    first_divergence_index = Column(Integer, nullable=True)
    confidence_score = Column(Float, default=0.0)
    segment_diagnosis = Column(Text, nullable=True)
    checkpoint_results = Column(JSON, default=list)
    created_at = Column(DateTime, default=utc_now)

    project = relationship("Project", back_populates="phase2_investigations")


class CounterfactualExperiment(Base):
    __tablename__ = "counterfactual_experiments"

    id = Column(String(36), primary_key=True, default=gen_uuid)
    phase1_id = Column(String(36), ForeignKey("phase1_investigations.id"), nullable=True)
    parent_experiment_id = Column(String(36), nullable=True)
    user_query = Column(String(500), nullable=False)
    proposed_parameter = Column(String(255), nullable=False)
    original_value = Column(JSON, nullable=True)
    counterfactual_value = Column(JSON, nullable=True)
    prioritization_score = Column(Float, default=0.0)
    status = Column(String(50), default="proposed")  # "proposed", "approved", "executed", "rejected"
    run_id = Column(String(36), ForeignKey("simulation_runs.id"), nullable=True)
    fingerprint_id = Column(String(36), ForeignKey("quantum_fingerprints.id"), nullable=True)
    improvement_metrics = Column(JSON, default=dict)
    outcome_summary = Column(Text, nullable=True)
    created_at = Column(DateTime, default=utc_now)

    phase1_investigation = relationship("Phase1Investigation", back_populates="counterfactuals")


class UnifiedDiagnosis(Base):
    __tablename__ = "unified_diagnoses"

    id = Column(String(36), primary_key=True, default=gen_uuid)
    project_id = Column(String(36), ForeignKey("projects.id"), nullable=False, index=True)
    circuit_id = Column(String(36), ForeignKey("quantum_circuits.id"), nullable=False)
    phase1_id = Column(String(36), ForeignKey("phase1_investigations.id"), nullable=True)
    phase2_id = Column(String(36), ForeignKey("phase2_investigations.id"), nullable=True)
    executive_summary = Column(Text, nullable=False)
    primary_hypothesis = Column(String(255), nullable=False)
    ranked_hypotheses = Column(JSON, default=list)
    suspected_gates = Column(JSON, default=list)
    suspected_qubits = Column(JSON, default=list)
    confidence_category = Column(String(50), default="High Evidence")  # "High", "Moderate", "Exploratory"
    confidence_value = Column(Float, default=0.88)
    agreements = Column(JSON, default=list)
    disagreements = Column(JSON, default=list)
    recommended_next_action = Column(Text, nullable=True)
    llm_explanation = Column(Text, nullable=True)
    bdhcq_assessment = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=utc_now)

    project = relationship("Project", back_populates="diagnoses")


class HardwareJob(Base):
    __tablename__ = "hardware_jobs"

    id = Column(String(36), primary_key=True, default=gen_uuid)
    backend_name = Column(String(255), nullable=False)
    circuit_id = Column(String(36), ForeignKey("quantum_circuits.id"), nullable=False)
    job_id = Column(String(255), nullable=True)
    status = Column(String(50), default="submitted")  # "submitted", "queued", "running", "completed", "failed"
    shot_count = Column(Integer, default=2048)
    hardware_counts = Column(JSON, default=dict)
    hardware_probabilities = Column(JSON, default=dict)
    calibration_snapshot = Column(JSON, default=dict)
    fingerprint_id = Column(String(36), nullable=True)
    created_at = Column(DateTime, default=utc_now)
    completed_at = Column(DateTime, nullable=True)


class CandidateRepair(Base):
    __tablename__ = "candidate_repairs"

    id = Column(String(36), primary_key=True, default=gen_uuid)
    circuit_id = Column(String(36), ForeignKey("quantum_circuits.id"), nullable=False)
    diagnosis_id = Column(String(36), ForeignKey("unified_diagnoses.id"), nullable=True)
    patch_description = Column(String(500), nullable=False)
    original_code = Column(Text, nullable=False)
    repaired_code = Column(Text, nullable=False)
    diff_text = Column(Text, nullable=False)
    validation_status = Column(String(50), default="pending")  # "pending", "passed", "failed"
    validation_metrics = Column(JSON, default=dict)
    accepted_by_user = Column(Boolean, default=False)
    created_at = Column(DateTime, default=utc_now)

