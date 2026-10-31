import pytest
from app.services.quantum_parser import QuantumParserService, compute_canonical_circuit_hash
from app.services.simulator import QuantumSimulatorService
from app.services.fingerprint_service import QuantumFingerprintService
from app.services.static_analyzer import StaticAnalyzerService

def test_bell_state_parsing_and_simulation():
    code = """from qiskit import QuantumCircuit
qc = QuantumCircuit(2, 2)
qc.h(0)
qc.cx(0, 1)
qc.measure(0, 0)
qc.measure(1, 1)
"""
    circuit, metadata, errors = QuantumParserService.parse_and_validate(code)
    assert errors == []
    assert circuit is not None
    assert metadata["qubit_count"] == 2
    assert metadata["circuit_depth"] >= 2
    
    # Check canonical hash
    h1 = compute_canonical_circuit_hash(circuit)
    h2 = compute_canonical_circuit_hash(circuit)
    assert h1 == h2
    assert len(h1) == 64

    # Run ideal simulation
    sim_res = QuantumSimulatorService.simulate(circuit, simulation_mode="ideal", shot_count=1024)
    probs = sim_res["probabilities"]
    assert "00" in probs
    assert "11" in probs
    # In ideal Bell state, |00> and |11> dominate (~0.5 each)
    assert probs.get("00", 0) > 0.4
    assert probs.get("11", 0) > 0.4
    assert probs.get("01", 0) < 0.05
    assert probs.get("10", 0) < 0.05

def test_fingerprint_generation():
    probs = {"00": 0.5, "11": 0.5}
    obs = {"Z_0": 0.0, "Z_1": 0.0, "ZZ_01": 1.0}
    fp_hash, summary, uncertainty = QuantumFingerprintService.generate_fingerprint(
        "testhash123", "ideal", 1024, probs, obs, 1.0, 2, 2
    )
    assert len(fp_hash) == 64
    assert summary["purity_estimate"] == 0.5
    assert "00" in uncertainty
    assert "11" in uncertainty

def test_static_analyzer_detects_missing_measurement():
    code = """from qiskit import QuantumCircuit
qc = QuantumCircuit(2)
qc.h(0)
qc.cx(0, 1)
"""
    circuit, _, _ = QuantumParserService.parse_and_validate(code)
    findings = StaticAnalyzerService.analyze_circuit(circuit, code)
    assert any(f.category == "Measurement" for f in findings)
